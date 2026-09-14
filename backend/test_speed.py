import asyncio
import json
import time
from multi_rag import stream_answer

async def test():
    t0 = time.time()
    first_token = False
    async for chunk in stream_answer("What is the MSP of paddy?"):
        if not first_token:
            first_token = True
            print(f"Time to first yield: {time.time() - t0:.2f}s")
        if chunk.startswith("data: ") and not chunk.endswith("[DONE]\n\n"):
            try:
                data = json.loads(chunk[6:].strip())
                if "chunk" in data:
                    print(data["chunk"], end="", flush=True)
            except:
                pass
    print(f"\nTotal time: {time.time() - t0:.2f}s")

if __name__ == "__main__":
    asyncio.run(test())
