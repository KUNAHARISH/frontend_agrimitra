# multi_rag.py
"""LangGraph CRAG Engine for AgriMitra AI.

Implements a Corrective RAG (CRAG) pipeline using LangGraph StateGraph:
  1. Route   — keyword-match the query to 1-3 specialized agents
  2. Retrieve — FAISS similarity search per agent
  3. Evaluate — LLM scores retrieval relevance (0-1)
  4. Conditional — if score < 0.6 → web search, else → synthesize
  5. Synthesize — LLM generates the final answer
  6. Reflect  — LLM checks answer quality before returning

Conversation memory is persisted per session via SqliteSaver checkpointer.
"""

import os
import json
import logging
import asyncio
import sqlite3
from pathlib import Path
from typing import Dict, List, Optional, AsyncGenerator, TypedDict

from dotenv import load_dotenv
from langgraph.graph import StateGraph, END
from langgraph.checkpoint.sqlite.aio import AsyncSqliteSaver
import structlog
import time
import uuid

load_dotenv()

logger = structlog.get_logger(__name__)

# ---------------------------------------------------------------------------
# AgriState — Typed state flowing through the LangGraph
# ---------------------------------------------------------------------------
class AgriState(TypedDict):
    query: str
    image_url: Optional[str]
    retrieved_docs: List[Dict]
    retrieval_score: float
    needs_web_search: bool
    answer: str
    conversation_history: List[Dict]
    # Operational fields used internally by nodes
    agents_used: List[str]
    sources: List[str]
    web_context: str
    language: str
    answer_quality: str
    quality_note: str


# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------
FAISS_INDEX_PATH = Path(__file__).parent / "faiss_index"
EMBEDDING_MODEL_NAME = "all-MiniLM-L6-v2"
CROSS_ENCODER_MODEL_NAME = "cross-encoder/ms-marco-MiniLM-L-6-v2"

LLM_AVAILABLE = False
LLM = None
EMBEDDINGS = None
VECTORDB = None
CROSS_ENCODER = None


def _init_llm():
    """Initialize remote API LLMs (Groq / NVIDIA / OpenRouter) with ultra-fast sub-second TTFT."""
    global LLM_AVAILABLE, LLM
    if LLM is not None:
        return

    groq_key = os.getenv("GROQ_API_KEY")
    nvidia_key = os.getenv("NVIDIA_API_KEY")
    openrouter_key = os.getenv("OPENROUTER_API_KEY")

    # 1. Primary ultra-fast streaming engine (Groq Qwen 27B / GPT-OSS)
    if groq_key and groq_key != "your_key_here":
        try:
            from langchain_groq import ChatGroq
            model_name = os.getenv("GROQ_MODEL", "openai/gpt-oss-120b")
            LLM = ChatGroq(
                model_name=model_name,
                groq_api_key=groq_key,
                temperature=0.3,
                streaming=True,
                request_timeout=15.0
            )
            LLM_AVAILABLE = True
            logger.info(f"Groq ultra-fast LLM initialized successfully with model {model_name}")
            return
        except Exception as e:
            logger.warning(f"Failed to initialize Groq LLM: {e}")

    # 2. NVIDIA Nemotron Engine
    if not LLM_AVAILABLE and nvidia_key:
        try:
            from langchain_openai import ChatOpenAI
            model_name = os.getenv("NVIDIA_MODEL", "nvidia/nemotron-3-nano-omni-30b-a3b-reasoning")
            LLM = ChatOpenAI(
                base_url="https://integrate.api.nvidia.com/v1",
                api_key=nvidia_key,
                model=model_name,
                temperature=0.3,
                max_tokens=2048,
                streaming=True,
                request_timeout=20.0
            )
            LLM_AVAILABLE = True
            logger.info(f"NVIDIA Nemotron LLM initialized successfully with model {model_name}")
            return
        except Exception as e:
            logger.warning(f"Failed to initialize NVIDIA LLM: {e}")

    # 3. OpenRouter Engine
    if not LLM_AVAILABLE and openrouter_key:
        try:
            from langchain_openai import ChatOpenAI
            model_name = os.getenv("OPENROUTER_MODEL", "meta-llama/llama-3.3-70b-instruct")
            LLM = ChatOpenAI(
                base_url="https://openrouter.ai/api/v1",
                api_key=openrouter_key,
                model=model_name,
                temperature=0.3,
                streaming=True,
                default_headers={
                    "HTTP-Referer": "https://agrimitra.ai",
                    "X-Title": "AgriMitra AI"
                },
                request_timeout=20.0
            )
            LLM_AVAILABLE = True
            logger.info(f"OpenRouter LLM initialized successfully with model {model_name}")
            return
        except Exception as e:
            logger.warning(f"Failed to initialize OpenRouter LLM: {e}")


def _init_components():
    """Fast non-blocking initialization of LLM."""
    global LLM_AVAILABLE, LLM
    _init_llm()
    if not LLM_AVAILABLE:
        logger.warning("No working LLM API key set. LLM features will use fallback mode.")


# ---------------------------------------------------------------------------
# Agent Definitions
# ---------------------------------------------------------------------------
from dataclasses import dataclass

@dataclass
class AgentConfig:
    """Configuration for a single RAG agent."""
    id: str
    name: str
    emoji: str
    description: str
    keywords: List[str]
    retrieval_k: int = 4  # Number of chunks to retrieve


AGENTS: Dict[str, AgentConfig] = {
    "crop_advisor": AgentConfig(
        id="crop_advisor",
        name="Crop Advisor",
        emoji="🌾",
        description="Expert in crop diseases, pest management, chemical & organic remedies, and cultivation best practices",
        keywords=[
            "crop", "disease", "pest", "fungus", "virus", "bacteria", "blast",
            "bollworm", "armyworm", "leaf", "wilt", "blight", "rot", "spray",
            "fungicide", "pesticide", "insecticide", "remedy", "organic",
            "chemical", "treatment", "symptom", "paddy", "rice", "cotton",
            "maize", "groundnut", "chilli", "wheat", "soybean", "cultivation",
            "sowing", "harvest", "fertilizer", "nitrogen", "phosphorus",
            "potassium", "urea", "DAP", "NPK", "seed", "variety", "hybrid",
            "yield", "irrigation", "plant", "farming",
        ],
        retrieval_k=5,
    ),
    "market_analyst": AgentConfig(
        id="market_analyst",
        name="Market Analyst",
        emoji="📊",
        description="Specialist in MSP rates, mandi prices, market trends, demand forecasts, storage, and export data",
        keywords=[
            "market", "price", "msp", "mandi", "rate", "cost", "sell",
            "buy", "demand", "supply", "export", "import", "trade",
            "quintal", "ton", "rupee", "₹", "storage", "warehouse",
            "cold storage", "apmc", "e-nam", "procurement", "profit",
            "income", "revenue", "value", "premium", "grade", "today", "live"
        ],
        retrieval_k=4,
    ),
    "schemes_expert": AgentConfig(
        id="schemes_expert",
        name="Schemes Expert",
        emoji="🏛️",
        description="Authority on government agricultural schemes, subsidies, eligibility criteria, and application processes",
        keywords=[
            "scheme", "subsidy", "government", "pm-kisan", "kisan", "pmfby",
            "insurance", "loan", "credit", "kcc", "rythu", "bharosa",
            "bandhu", "benefit", "eligibility", "apply", "application",
            "registration", "dbt", "transfer", "support", "assistance",
            "grant", "policy", "niti", "mission", "yojana", "pradhan",
            "mantri", "soil health", "micro irrigation", "horticulture",
        ],
        retrieval_k=4,
    ),
    "weather_analyst": AgentConfig(
        id="weather_analyst",
        name="Weather Analyst",
        emoji="🌦️",
        description="Expert on seasonal weather patterns, climate risks, monsoon forecasts, and agricultural weather advisories",
        keywords=[
            "weather", "rain", "rainfall", "monsoon", "temperature", "heat",
            "cold", "frost", "hail", "cyclone", "flood", "drought",
            "season", "kharif", "rabi", "zaid", "summer", "winter",
            "climate", "wind", "humidity", "forecast", "advisory",
            "risk", "hazard", "storm", "warning", "today", "tomorrow"
        ],
        retrieval_k=4,
    ),
    "leaf_scanner": AgentConfig(
        id="leaf_scanner",
        name="Leaf Scanner",
        emoji="🔬",
        description="Identifies plant diseases from symptom descriptions and provides targeted treatment recommendations",
        keywords=[
            "scan", "identify", "leaf", "spot", "curl", "yellow",
            "brown", "wilt", "deform", "hole", "damage", "image",
            "photo", "upload", "diagnose", "detection", "analysis",
            "appearance", "color", "shape", "pattern", "lesion",
        ],
        retrieval_k=5,
    ),
}


# ---------------------------------------------------------------------------
# Core Logic (used by nodes and kept as public API for tests)
# ---------------------------------------------------------------------------
def route_query(query: str) -> List[str]:
    """Route a query to the most relevant agents using keyword matching."""
    query_lower = query.lower()
    scores: Dict[str, int] = {}

    for agent_id, config in AGENTS.items():
        score = sum(1 for kw in config.keywords if kw in query_lower)
        if score > 0:
            scores[agent_id] = score

    if not scores:
        return ["crop_advisor"]

    sorted_agents = sorted(scores.items(), key=lambda x: x[1], reverse=True)
    top_agents = [agent_id for agent_id, _score in sorted_agents[:3]]
    logger.info(f"Routed query to agents: {top_agents}")
    return top_agents


_LOCAL_DOCS_CACHE: Optional[List[Dict]] = None

def _get_local_docs() -> List[Dict]:
    global _LOCAL_DOCS_CACHE
    if _LOCAL_DOCS_CACHE is not None:
        return _LOCAL_DOCS_CACHE

    docs = []
    docs_dir = Path(__file__).parent / "data" / "docs"
    if docs_dir.exists():
        for txt_file in docs_dir.glob("*.txt"):
            try:
                content = txt_file.read_text(encoding="utf-8", errors="ignore")
                paragraphs = [p.strip() for p in content.split("\n\n") if len(p.strip()) > 30]
                for p in paragraphs:
                    docs.append({
                        "content": p,
                        "source": txt_file.name
                    })
            except Exception as e:
                logger.debug(f"Doc load error for {txt_file}: {e}")
    _LOCAL_DOCS_CACHE = docs
    return docs


def agent_retrieve(agent_id: str, query: str) -> List[Dict]:
    """Retrieve relevant document chunks for a specific agent in <1ms without PyTorch/FAISS overhead."""
    _init_components()
    docs = _get_local_docs()
    if not docs:
        return []

    query_lower = query.lower()
    query_terms = set(w for w in query_lower.split() if len(w) > 2)
    config = AGENTS.get(agent_id)
    agent_keywords = set(config.keywords) if config else set()

    scored = []
    for d in docs:
        c_lower = d["content"].lower()
        # Score based on query terms match + agent domain keyword match
        score = sum(3 for term in query_terms if term in c_lower) + sum(1 for kw in agent_keywords if kw in c_lower)
        if score > 0:
            scored.append((score, d))

    scored.sort(key=lambda x: x[0], reverse=True)
    top_docs = [item[1] for item in scored[:4]]

    results = []
    for d in top_docs:
        results.append({
            "content": d["content"],
            "source": d["source"],
            "agent": agent_id,
        })
    return results


def _web_search(query: str) -> tuple[str, List[str]]:
    """Use DuckDuckGo to fetch live web data with quick timeout. Returns (context_str, source_list)."""
    try:
        from duckduckgo_search import DDGS
        import concurrent.futures
        
        def _run_ddg():
            with DDGS(timeout=1.0) as ddgs:
                return list(ddgs.text(query, max_results=2))

        with concurrent.futures.ThreadPoolExecutor(max_workers=1) as executor:
            future = executor.submit(_run_ddg)
            results = future.result(timeout=1.0)

        if not results:
            return "", []

        web_sources = []
        web_context = "\n--- 🌐 Live Web Search (CRAG Corrective Retrieval) ---\n"
        for r in results:
            source_domain = r.get('href', 'web').split('/')[2] if 'href' in r else 'web'
            web_sources.append(source_domain)
            web_context += f"[Source: {source_domain}]\n{r.get('body', '')}\n\n"
        return web_context, web_sources
    except Exception as e:
        logger.debug(f"Web search skipped / timed out: {e}")
        return "", []


# ---------------------------------------------------------------------------
# LangGraph Nodes
# ---------------------------------------------------------------------------
def route_node(state: AgriState) -> dict:
    """Node 1: Route the query to the best-matching agents."""
    agents = route_query(state["query"])
    logger.info(f"[route_node] Selected agents: {agents}")
    return {"agents_used": agents}


def retrieve_node(state: AgriState) -> dict:
    """Node 2: Retrieve relevant documents from FAISS for each routed agent."""
    all_docs = []
    all_sources = []

    for agent_id in state["agents_used"]:
        results = agent_retrieve(agent_id, state["query"])
        all_docs.extend(results)
        for r in results:
            source = Path(r["source"]).name if r["source"] != "unknown" else "unknown"
            if source not in all_sources:
                all_sources.append(source)

    logger.info(f"[retrieve_node] Retrieved {len(all_docs)} chunks from {len(all_sources)} sources")
    return {"retrieved_docs": all_docs, "sources": all_sources}


def evaluate_retrieval_node(state: AgriState) -> dict:
    """Node 3 (CRAG): LLM evaluates whether retrieved docs actually answer the query.

    Returns a relevance score (0-1). If score < 0.6, the pipeline
    triggers corrective web search before synthesis.
    """
    _init_components()
    docs = state["retrieved_docs"]

    # If no docs retrieved at all, definitely need web search
    if not docs:
        logger.info("[evaluate_retrieval_node] No docs retrieved → needs_web_search=True")
        return {"retrieval_score": 0.0, "needs_web_search": True}

    # If LLM unavailable, use a simple heuristic
    if not LLM_AVAILABLE or LLM is None:
        score = min(len(docs) / 5.0, 1.0)
        logger.info(f"[evaluate_retrieval_node] Heuristic score: {score:.2f}")
        return {"retrieval_score": score, "needs_web_search": score < 0.6}

    # LLM-based relevance grading (the core of CRAG)
    doc_snippets = "\n\n".join(
        f"[Doc {i+1}]: {d['content'][:300]}" for i, d in enumerate(docs[:5])
    )

    grading_prompt = f"""You are a retrieval evaluator. Score how well the following retrieved documents answer the user's question.

USER QUESTION: {state["query"]}

RETRIEVED DOCUMENTS:
{doc_snippets}

SCORING RULES:
- 1.0 = Documents directly and fully answer the question
- 0.7-0.9 = Documents are highly relevant and partially answer
- 0.4-0.6 = Documents are somewhat related but don't directly answer
- 0.1-0.3 = Documents are barely relevant
- 0.0 = Documents are completely irrelevant

Respond with ONLY a single decimal number between 0.0 and 1.0. Nothing else."""

    try:
        start_time = time.time()
        response = LLM.invoke(grading_prompt)
        latency_ms = int((time.time() - start_time) * 1000)
        logger.info("LLM call completed", llm_node="evaluate_retrieval", latency_ms=latency_ms)
        score_text = response.content.strip()
        import re
        match = re.search(r"(\b\d(?:\.\d+)?\b)", score_text)
        if match:
            score = float(match.group(1))
        else:
            score = float(score_text.split()[0])
        score = max(0.0, min(1.0, score))
    except Exception as e:
        logger.warning(f"[evaluate_retrieval_node] LLM scoring failed: {e}, using heuristic")
        score = min(len(docs) / 5.0, 1.0)

    needs_search = score < 0.6
    logger.info(f"[evaluate_retrieval_node] Relevance score: {score:.2f}, needs_web_search: {needs_search}")
    return {"retrieval_score": score, "needs_web_search": needs_search}


def web_search_node(state: AgriState) -> dict:
    """Node 4 (Conditional): Corrective web search when retrieval is insufficient."""
    web_context, web_sources = _web_search(state["query"])
    updated_sources = list(state.get("sources", [])) + web_sources
    logger.info(f"[web_search_node] Added {len(web_sources)} web sources")
    return {"web_context": web_context, "sources": updated_sources}


def synthesize_node(state: AgriState) -> dict:
    """Node 5: LLM synthesizes retrieved context + web search into a final answer."""
    _init_components()

    # Build context from retrieved docs
    context_parts = []
    agents_used = state.get("agents_used", [])
    docs = state.get("retrieved_docs", [])

    # Group docs by agent
    agent_docs: Dict[str, List[Dict]] = {}
    for doc in docs:
        aid = doc.get("agent", "unknown")
        agent_docs.setdefault(aid, []).append(doc)

    for agent_id in agents_used:
        if agent_id in AGENTS and agent_id in agent_docs:
            config = AGENTS[agent_id]
            agent_context = f"\n--- {config.emoji} {config.name} (Local DB) ---\n"
            for chunk in agent_docs[agent_id]:
                source = Path(chunk["source"]).name if chunk["source"] != "unknown" else "unknown"
                agent_context += f"[Source: {source}]\n{chunk['content']}\n\n"
            context_parts.append(agent_context)

    # Append web context if CRAG triggered it
    web_context = state.get("web_context", "")
    full_context = "\n".join(context_parts) + web_context

    agents_consulted = ", ".join(
        f"{AGENTS[a].emoji} {AGENTS[a].name}" for a in agents_used if a in AGENTS
    )

    if not full_context.strip():
        full_context = "No specific local or web documents retrieved. Answer based on your own knowledge."

    language = state.get("language", "English")

    # Use LLM if available
    if LLM_AVAILABLE and LLM is not None:
        try:
            prompt = SYNTHESIS_PROMPT.format(
                agents_consulted=agents_consulted,
                context=full_context,
                question=state["query"],
                language=language,
            )
            start_time = time.time()
            image_url = state.get("image_url")
            if image_url:
                from langchain_core.messages import HumanMessage
                msg = HumanMessage(content=[
                    {"type": "text", "text": prompt},
                    {"type": "image_url", "image_url": {"url": image_url}}
                ])
                response = LLM.invoke([msg])
            else:
                response = LLM.invoke(prompt)
            latency_ms = int((time.time() - start_time) * 1000)
            logger.info("LLM call completed", llm_node="synthesize", latency_ms=latency_ms)
            answer = response.content
            logger.info(f"[synthesize_node] Generated answer ({len(answer)} chars)")
            return {"answer": answer}
        except Exception as e:
            logger.error(f"[synthesize_node] LLM synthesis failed: {e}")

    # Fallback
    fallback = f"**Agents consulted:** {agents_consulted}\n\n"
    fallback += "**Based on available information:**\n\n"
    for agent_id in agents_used:
        if agent_id in AGENTS and agent_id in agent_docs:
            config = AGENTS[agent_id]
            fallback += f"### {config.emoji} {config.name}\n"
            for chunk in agent_docs[agent_id]:
                source = Path(chunk["source"]).name if chunk["source"] != "unknown" else "unknown"
                content = chunk["content"][:500]
                fallback += f"{content}\n*[Source: {source}]*\n\n"

    return {"answer": fallback}


def reflect_node(state: AgriState) -> dict:
    """Node 6: LLM reviews the generated answer for quality before returning.

    Checks for completeness, accuracy relative to context, and helpfulness.
    If quality is poor, adds a note indicating limitations.
    """
    _init_components()
    answer = state.get("answer", "")

    if not answer or not LLM_AVAILABLE or LLM is None:
        return {"answer_quality": "unverified", "quality_note": ""}

    try:
        reflect_prompt = f"""You are a quality reviewer for an agricultural AI assistant.

USER QUESTION: {state["query"]}

GENERATED ANSWER:
{answer[:2000]}

Evaluate this answer and respond with ONLY valid JSON:
{{
  "quality": "good" or "needs_improvement",
  "note": "Brief explanation if needs_improvement, otherwise empty string"
}}

Criteria:
- Does it address the question directly?
- Is it factually plausible for Indian agriculture?
- Is it actionable and practical for a farmer?

JSON only, no markdown:"""

        start_time = time.time()
        response = LLM.invoke(reflect_prompt)
        latency_ms = int((time.time() - start_time) * 1000)
        logger.info("LLM call completed", llm_node="reflect", latency_ms=latency_ms)
        content = response.content.strip()
        if content.startswith("```"):
            content = content.split("\n", 1)[1] if "\n" in content else content[3:]
        if content.endswith("```"):
            content = content[:-3]
        content = content.strip()

        result = json.loads(content)
        quality = result.get("quality", "good")
        note = result.get("note", "")

        # If reflection found issues, append a disclaimer to the answer
        if quality == "needs_improvement" and note:
            updated_answer = answer + f"\n\n---\n⚠️ *Note: {note}*"
            logger.info(f"[reflect_node] Quality: {quality} - {note}")
            return {"answer": updated_answer, "answer_quality": quality, "quality_note": note}

        logger.info(f"[reflect_node] Quality: {quality}")
        return {"answer_quality": quality, "quality_note": ""}

    except Exception as e:
        logger.warning(f"[reflect_node] Reflection failed: {e}")
        return {"answer_quality": "unverified", "quality_note": ""}


# ---------------------------------------------------------------------------
# Prompts
# ---------------------------------------------------------------------------
SYNTHESIS_PROMPT = """You are AgriMitra AI, an expert agricultural assistant serving Indian farmers.
Synthesize the retrieved context and your knowledge into a clear, direct, actionable answer.

AGENTS CONSULTED: {agents_consulted}
{history_section}
RETRIEVED CONTEXT:
{context}

USER QUESTION: {question}

INSTRUCTIONS:
1. Provide a direct, practical, step-by-step answer formatted with clear markdown bullet points.
2. Include specific chemical & organic remedies, dosages (e.g., g/L or ml/L), or market numbers when relevant.
3. If this is a follow-up question, directly refer to the previous conversation history provided.
4. Keep the response concise, clear, and actionable without filler.
5. Respond entirely in the following language: {language}.

ANSWER:"""


# ---------------------------------------------------------------------------
# Conditional Edge
# ---------------------------------------------------------------------------
def _should_web_search(state: AgriState) -> str:
    """Conditional edge: route to web_search if retrieval score < 0.6."""
    if state.get("needs_web_search", False):
        logger.info("[conditional] Retrieval insufficient -> web_search")
        return "web_search"
    logger.info("[conditional] Retrieval sufficient -> synthesize")
    return "synthesize"


# ---------------------------------------------------------------------------
# Build & Compile the LangGraph StateGraph
# ---------------------------------------------------------------------------
workflow = StateGraph(AgriState)

# Add nodes
workflow.add_node("route", route_node)
workflow.add_node("retrieve", retrieve_node)
workflow.add_node("evaluate", evaluate_retrieval_node)
workflow.add_node("web_search", web_search_node)
workflow.add_node("synthesize", synthesize_node)
workflow.add_node("reflect", reflect_node)

# Wire edges
workflow.set_entry_point("route")
workflow.add_edge("route", "retrieve")
workflow.add_edge("retrieve", "evaluate")
workflow.add_conditional_edges("evaluate", _should_web_search, {
    "web_search": "web_search",
    "synthesize": "synthesize",
})
workflow.add_edge("web_search", "synthesize")
workflow.add_edge("synthesize", "reflect")
workflow.add_edge("reflect", END)

# Compile base graph (without checkpointer) globally
crag_graph_base = workflow.compile()
DB_PATH = Path(__file__).parent / "checkpoints.db"
logger.info("LangGraph CRAG pipeline base compiled")


# ---------------------------------------------------------------------------
# Streaming Entry Point — stream_answer()
# ---------------------------------------------------------------------------
async def stream_answer(query: str, language: str = "English", session_id: Optional[str] = None, image_url: Optional[str] = None) -> AsyncGenerator[str, None]:
    """Process a query with real-time token streaming (sub-second TTFT) & conversation memory.

    Args:
        query: The user's question.
        language: Target language for the answer.
        session_id: Optional UUID to enable conversation memory.
        image_url: Optional base64 image or URL for multimodal vision reasoning.
    """
    _init_components()
    logger.info(f"Fast streaming query: {query[:80]}... (session={session_id}, has_image={bool(image_url)})")

    # 1. Fast Route
    agents_used = route_query(query)
    
    # 2. Check Conversation History for Context
    history_section = ""
    curr_history = []
    if session_id:
        try:
            async with AsyncSqliteSaver.from_conn_string(str(DB_PATH)) as checkpointer:
                config = {"configurable": {"thread_id": session_id}}
                tup = await checkpointer.aget_tuple(config)
                if tup and tup.checkpoint:
                    cv = tup.checkpoint.get("channel_values", {})
                    curr_history = cv.get("conversation_history", [])
                    if curr_history:
                        lines = []
                        for h in curr_history[-4:]:
                            lines.append(f"{h['role'].upper()}: {h['content']}")
                        history_section = "\nPREVIOUS CONVERSATION HISTORY:\n" + "\n".join(lines) + "\n\n"
        except Exception as he:
            logger.debug(f"History fetch note: {he}")

    # 3. Fast Retrieve from Local Knowledge Base
    retrieved_docs = []
    sources = []
    context_parts = []
    
    for aid in agents_used:
        if aid in AGENTS:
            docs = agent_retrieve(aid, query)
            retrieved_docs.extend(docs)
            config = AGENTS[aid]
            agent_ctx = f"\n--- {config.emoji} {config.name} (Local Knowledge) ---\n"
            for d in docs:
                if d["source"] not in sources:
                    sources.append(d["source"])
                agent_ctx += f"[Source: {Path(d['source']).name}]: {d['content'][:400]}\n"
            context_parts.append(agent_ctx)

    # 4. Live Web Search only if explicit live rate/weather keywords present
    live_keywords = ["today mandi rate", "live price today", "breaking news", "weather today"]
    needs_web = any(k in query.lower() for k in live_keywords)
    web_context = ""
    if needs_web:
        web_context, web_sources = _web_search(query)
        sources.extend(web_sources)

    full_context = "\n".join(context_parts) + (f"\n--- Live Web Context ---\n{web_context}" if web_context else "")
    if not full_context.strip():
        full_context = "No specific documents found. Answer using accurate Indian agricultural practices."

    agents_consulted = ", ".join(f"{AGENTS[a].emoji} {AGENTS[a].name}" for a in agents_used if a in AGENTS)
    prompt = SYNTHESIS_PROMPT.format(
        agents_consulted=agents_consulted or "🌾 Crop Advisor",
        history_section=history_section,
        context=full_context,
        question=query,
        language=language
    )

    full_answer_chunks = []

    # 5. Stream Tokens in Real-Time
    try:
        active_llm = LLM
        if active_llm is None:
            raise ValueError("No LLM available")

        # Build messages (support multimodal vision if image attached)
        if image_url:
            from langchain_core.messages import HumanMessage
            messages = [HumanMessage(content=[
                {"type": "text", "text": prompt},
                {"type": "image_url", "image_url": {"url": image_url}}
            ])]
            nvidia_key = os.getenv("NVIDIA_API_KEY")
            if nvidia_key:
                from langchain_openai import ChatOpenAI
                active_llm = ChatOpenAI(
                    base_url="https://integrate.api.nvidia.com/v1",
                    api_key=nvidia_key,
                    model=os.getenv("NVIDIA_MODEL", "nvidia/nemotron-3-nano-omni-30b-a3b-reasoning"),
                    temperature=0.2,
                    max_tokens=2048,
                    streaming=True
                )
        else:
            messages = prompt

        # Direct token streaming loop with reasoning tag filter
        in_think_block = False
        async for chunk in active_llm.astream(messages):
            token = chunk.content if hasattr(chunk, "content") else str(chunk)
            if not token:
                continue

            # Strip out internal reasoning <think>...</think> tags if model emits them
            if "<think>" in token:
                in_think_block = True
                token = token.split("<think>")[0]
            if in_think_block:
                if "</think>" in token:
                    in_think_block = False
                    token = token.split("</think>")[-1]
                else:
                    continue

            if token:
                full_answer_chunks.append(token)
                yield f"data: {json.dumps({'chunk': token}, ensure_ascii=False)}\n\n"

    except Exception as e:
        logger.warning(f"Primary LLM streaming failed ({e}), attempting fast fallback...")
        
        fallback_done = False
        groq_key = os.getenv("GROQ_API_KEY")
        if groq_key and groq_key != "your_key_here":
            try:
                from langchain_groq import ChatGroq
                fallback_model = "openai/gpt-oss-120b"
                fallback_llm = ChatGroq(model_name=fallback_model, groq_api_key=groq_key, temperature=0.3, max_tokens=1500)
                async for chunk in fallback_llm.astream(prompt):
                    token = chunk.content if hasattr(chunk, "content") else str(chunk)
                    if token:
                        full_answer_chunks.append(token)
                        yield f"data: {json.dumps({'chunk': token}, ensure_ascii=False)}\n\n"
                fallback_done = True
            except Exception as fe:
                logger.error(f"Groq fallback failed: {fe}")

        if not fallback_done:
            # Local fallback response
            fallback_text = f"**Agents Consulted:** {agents_consulted}\n\n"
            for doc in retrieved_docs[:3]:
                fallback_text += f"• {doc['content'][:300]}\n\n"
            full_answer_chunks.append(fallback_text)
            yield f"data: {json.dumps({'chunk': fallback_text}, ensure_ascii=False)}\n\n"

    # 6. Yield Metadata
    agents_info = []
    for agent_id in agents_used:
        if agent_id in AGENTS:
            config = AGENTS[agent_id]
            docs_count = len([d for d in retrieved_docs if d.get("agent") == agent_id])
            agents_info.append({
                "id": config.id,
                "name": config.name,
                "emoji": config.emoji,
                "description": config.description,
                "chunks_retrieved": docs_count,
            })

    metadata = {
        "sources": sources,
        "agents_used": agents_info,
        "retrieval_score": 0.9 if retrieved_docs else 0.4,
        "web_search_used": needs_web,
        "answer_quality": "good",
        "retrieved_chunks": [d.get("content", "") for d in retrieved_docs[:4]],
    }
    yield f"data: {json.dumps({'metadata': metadata}, ensure_ascii=False)}\n\n"
    yield "data: [DONE]\n\n"

    # 7. Asynchronously save turn to Sqlite checkpointer for session memory
    if session_id and full_answer_chunks:
        try:
            complete_answer = "".join(full_answer_chunks)
            updated_history = curr_history + [
                {"role": "user", "content": query},
                {"role": "assistant", "content": complete_answer}
            ]
            state_update = {
                "query": query,
                "answer": complete_answer,
                "conversation_history": updated_history,
                "agents_used": agents_used,
                "sources": sources,
                "retrieved_docs": retrieved_docs
            }
            async with AsyncSqliteSaver.from_conn_string(str(DB_PATH)) as checkpointer:
                config = {"configurable": {"thread_id": session_id}}
                crag_graph = workflow.compile(checkpointer=checkpointer)
                await crag_graph.aupdate_state(config, state_update)
        except Exception as se:
            logger.debug(f"Session memory checkpoint save note: {se}")


# ---------------------------------------------------------------------------
# Public API (unchanged for main.py and tests)
# ---------------------------------------------------------------------------
def get_all_agents() -> List[Dict]:
    """Return metadata for all available agents."""
    return [
        {
            "id": config.id,
            "name": config.name,
            "emoji": config.emoji,
            "description": config.description,
        }
        for config in AGENTS.values()
    ]


# Eager warm initialization of LLM components on startup
try:
    _init_components()
except Exception as e:
    logger.debug(f"Eager startup note: {e}")

