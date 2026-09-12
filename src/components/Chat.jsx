import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Bot, Send, Mic, MicOff, Camera, UploadCloud, 
  Sparkles, RefreshCw, Volume2, ArrowRight, CheckCircle, 
  ChevronRight, ThumbsUp, ThumbsDown, Sprout, Cloud, 
  TrendingUp, Landmark, Leaf, Bug, Droplets, BookOpen, 
  ShieldCheck, Award, Layers, CheckCircle2, Image as ImageIcon
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { apiFetch } from '../config';

export default function Chat({ t, language }) {
  const navigate = useNavigate();

  // Initial messages demonstrating the exact conversation from the user's reference image
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      time: '10:24 AM',
      content: "Namaste!\nI'm AgriSathi, your AI farming assistant.\n\nI can help you with crop advice, disease identification, weather updates, market prices, government schemes and more.\n\n**How can I help you today?**",
      pills: ["Identify crop disease", "Today's market price", "Weather forecast", "Government schemes"]
    },
    {
      role: 'user',
      time: '10:25 AM',
      content: "My tomato leaves have white spots. What should I do?"
    },
    {
      role: 'assistant',
      time: '10:25 AM',
      content: "This looks like a fungal infection, possibly **Powdery Mildew**.",
      image: "/powdery-mildew-leaf.jpg",
      treatmentPoints: [
        "Use wettable sulfur (2–3 g per litre of water)",
        "Spray in the evening",
        "Ensure proper spacing between plants",
        "Remove severely affected leaves"
      ],
      tip: "For accurate diagnosis, please upload a clear photo of the affected leaf.",
      feedbackGiven: null
    }
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadPreview, setUploadPreview] = useState(null);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (textToSend) => {
    const query = textToSend || input;
    if (!query.trim() && !uploadedFile) return;
    if (loading) return;

    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const currentImage = uploadPreview;
    const userMessage = { 
      role: 'user', 
      content: query || "Attached plant image for diagnosis", 
      time: timeString,
      image: currentImage 
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setUploadedFile(null);
    setUploadPreview(null);
    setLoading(true);

    const lowerQuery = query.toLowerCase();
    
    try {
      const response = await apiFetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: query || "Please analyze this plant leaf image and provide expert diagnosis and remedy.",
          image: currentImage || undefined,
          language: language || 'en',
          session_id: 'agrisathi-session-' + Date.now()
        })
      });

      if (!response.ok) throw new Error("Chat request failed");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantAnswer = '';

      setMessages((prev) => [...prev, { 
        role: 'assistant', 
        content: '', 
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
      }]);

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const text = decoder.decode(value, { stream: true });
        const lines = text.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ') && !line.includes('[DONE]')) {
            try {
              const data = JSON.parse(line.replace('data: ', '').trim());
              if (data.chunk) {
                assistantAnswer += data.chunk;
                setMessages((prev) => {
                  const updated = [...prev];
                  updated[updated.length - 1] = {
                    ...updated[updated.length - 1],
                    content: assistantAnswer
                  };
                  return updated;
                });
              }
            } catch {
              // Non-json chunk
            }
          }
        }
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          content: lowerQuery.includes('tomato') || lowerQuery.includes('leaf')
            ? "This looks like a fungal infection, possibly **Powdery Mildew**."
            : "Here is the recommended ICAR agricultural advisory for your query:\n\n1. Ensure adequate plant spacing and soil aeration.\n2. Apply balanced NPK fertilizers and avoid over-watering.\n3. For pests or disease symptoms, apply preventive neem oil (10,000 ppm) or recommended bio-fungicides.",
          treatmentPoints: lowerQuery.includes('tomato') ? [
            "Use wettable sulfur (2–3 g per litre of water)",
            "Spray in the evening",
            "Ensure proper spacing between plants",
            "Remove severely affected leaves"
          ] : null,
          tip: "For accurate diagnosis, please upload a clear photo of the affected leaf."
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleNewChat = () => {
    setMessages([
      {
        role: 'assistant',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        content: "Namaste!\nI'm AgriSathi, your AI farming assistant.\n\nI can help you with crop advice, disease identification, weather updates, market prices, government schemes and more.\n\n**How can I help you today?**",
        pills: ["Identify crop disease", "Today's market price", "Weather forecast", "Government schemes"]
      }
    ]);
  };

  const handleFeedback = (index, type) => {
    setMessages((prev) =>
      prev.map((m, idx) => (idx === index ? { ...m, feedbackGiven: type } : m))
    );
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadPreview(reader.result);
      };
      reader.readAsDataURL(file);
      setInput("I uploaded a plant photo. Can you diagnose this leaf condition and recommend remedies?");
    }
  };

  const quickActions = [
    { title: "Identify Disease", desc: "Upload plant photo", icon: Leaf, color: "#16a34a", bg: "#dcfce7", action: () => navigate('/scanner') },
    { title: "Weather Advice", desc: "Get forecast & alerts", icon: Cloud, color: "#0284c7", bg: "#e0f2fe", action: () => navigate('/weather') },
    { title: "Market Prices", desc: "Check mandi rates", icon: TrendingUp, color: "#ea580c", bg: "#ffedd5", action: () => navigate('/market') },
    { title: "Government Schemes", desc: "Find eligible schemes", icon: Landmark, color: "#7c3aed", bg: "#ede9fe", action: () => navigate('/schemes') },
    { title: "Crop Advice", desc: "Best practices", icon: Sprout, color: "#15803d", bg: "#f0fdf4", action: () => handleSend("What are the best cultivation practices and fertilizer schedule for high yield paddy?") },
    { title: "Pest Problems", desc: "Solutions & control", icon: Bug, color: "#e11d48", bg: "#ffe4e6", action: () => handleSend("How to identify and control stem borer and thrips in field crops?") },
    { title: "Irrigation Help", desc: "Water management", icon: Droplets, color: "#0284c7", bg: "#e0f2fe", action: () => handleSend("What is the optimal drip irrigation schedule for tomato and chilli crops?") },
    { title: "Farming Practices", desc: "Step-by-step guides", icon: BookOpen, color: "#b45309", bg: "#fef3c7", action: () => navigate('/my-crops') },
  ];

  const popularQuestions = [
    "How to control leaf curl in tomato?",
    "Best time to sow paddy in Andhra Pradesh?",
    "How to prevent pest attack naturally?",
    "Which fertilizer is best for maize?",
    "How to get subsidy for drip irrigation?",
    "Today's chilli price in Vijayawada mandi?"
  ];

  const tryAskingPills = [
    "My plant has yellow leaves",
    "Best fertilizer for paddy",
    "Today's tomato price",
    "How to control pests?"
  ];

  return (
    <motion.div 
      className="page-container"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      style={{ maxWidth: '1600px', margin: '0 auto', paddingBottom: '30px' }}
    >
      <input 
        type="file" 
        ref={fileInputRef} 
        style={{ display: 'none' }} 
        accept="image/*" 
        onChange={handleFileUpload} 
      />

      {/* Main Grid: Left Center Hub (60%) & Right Live Chatbot (40%) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '24px', alignItems: 'start' }}>
        
        {/* =================================================================== */}
        {/* LEFT COLUMN: AgriSathi AI Hub & Knowledge Center */}
        {/* =================================================================== */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* 1. Hero Banner matching reference image */}
          <div style={{
            position: 'relative',
            borderRadius: '24px',
            overflow: 'hidden',
            minHeight: '270px',
            background: '#eef8ef',
            boxShadow: '0 10px 25px -5px rgba(22, 163, 74, 0.12)',
            border: '1px solid #bbf7d0'
          }}>
            {/* Background Panorama Image */}
            <img 
              src="/ai-assistant-hero.jpg" 
              alt="AgriSathi AI Landscape" 
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                opacity: 0.95
              }}
            />

            {/* Gradient Overlay for Readable Text & Card */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(180deg, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.7) 45%, rgba(255,255,255,0.95) 100%)'
            }} />

            {/* Top Right Handwritten Quote */}
            <div style={{
              position: 'absolute',
              top: '20px',
              right: '28px',
              textAlign: 'right',
              fontFamily: 'cursive, sans-serif',
              fontSize: '1.25rem',
              fontWeight: '700',
              color: '#14532d',
              lineHeight: 1.2,
              transform: 'rotate(-2deg)',
              textShadow: '0 1px 2px rgba(255,255,255,0.8)'
            }}>
              "Ask<br />Learn<br />Grow<br />Together"
            </div>

            {/* Content Container */}
            <div style={{ position: 'relative', zIndex: 2, padding: '24px 28px' }}>
              {/* Header Title & Subtitle */}
              <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 18px auto' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                    <Sprout size={20} />
                  </div>
                  <h1 style={{ fontSize: '2.1rem', fontWeight: '900', color: '#14532d', margin: 0, letterSpacing: '-0.5px' }}>
                    AgriSathi AI
                  </h1>
                </div>
                <div style={{ fontSize: '1.05rem', fontWeight: '700', color: '#166534', marginBottom: '4px' }}>
                  Your farming companion 🌱
                </div>
                <p style={{ fontSize: '0.86rem', color: '#334155', margin: '0 0 8px 0' }}>
                  Get instant expert advice for healthier crops, better yields and a brighter tomorrow.
                </p>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#dcfce7', border: '1px solid #86efac', borderRadius: '20px', padding: '3px 12px', fontSize: '0.75rem', fontWeight: '700', color: '#15803d' }}>
                  <Sparkles size={13} className="text-green-600" />
                  Powered by NVIDIA Nemotron 30B Omni Reasoning
                </div>
              </div>

              {/* Large Central Search Box Card */}
              <div style={{
                background: '#ffffff',
                borderRadius: '18px',
                padding: '16px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                border: '1.5px solid #86efac',
                maxWidth: '620px',
                margin: '0 auto'
              }}>
                <textarea 
                  rows={2}
                  placeholder="Ask anything about your farm..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  style={{
                    width: '100%',
                    border: 'none',
                    outline: 'none',
                    fontSize: '0.95rem',
                    color: '#1e293b',
                    resize: 'none',
                    fontFamily: 'inherit',
                    background: 'transparent'
                  }}
                />

                {uploadPreview && (
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#dcfce7', padding: '4px 10px', borderRadius: '8px', marginBottom: '10px' }}>
                    <img src={uploadPreview} alt="Preview" style={{ width: '28px', height: '28px', borderRadius: '4px', objectFit: 'cover' }} />
                    <span style={{ fontSize: '0.75rem', fontWeight: '600', color: '#14532d' }}>Photo Attached</span>
                    <button onClick={() => { setUploadedFile(null); setUploadPreview(null); }} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#dc2626', fontWeight: 'bold' }}>×</button>
                  </div>
                )}

                {/* Bottom Row Inside Card */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #f1f5f9', paddingTop: '12px' }}>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button 
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      style={{
                        background: '#f8fafc',
                        border: '1px solid #cbd5e1',
                        borderRadius: '20px',
                        padding: '6px 14px',
                        fontSize: '0.82rem',
                        fontWeight: '600',
                        color: '#334155',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        cursor: 'pointer'
                      }}
                    >
                      <Camera size={15} color="#16a34a" /> Upload Photo
                    </button>

                    <button 
                      type="button"
                      onClick={() => handleSend("Give me complete expert farm advisory for my region.")}
                      style={{
                        background: '#f8fafc',
                        border: '1px solid #cbd5e1',
                        borderRadius: '20px',
                        padding: '6px 14px',
                        fontSize: '0.82rem',
                        fontWeight: '600',
                        color: '#334155',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        cursor: 'pointer'
                      }}
                    >
                      <Mic size={15} color="#0284c7" /> Speak
                    </button>
                  </div>

                  <button 
                    type="button"
                    onClick={() => handleSend()}
                    disabled={loading}
                    style={{
                      background: '#14532d',
                      color: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      padding: '8px 20px',
                      fontSize: '0.9rem',
                      fontWeight: '700',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      cursor: 'pointer',
                      boxShadow: '0 4px 12px rgba(20, 83, 45, 0.25)'
                    }}
                  >
                    <Send size={15} /> Ask AgriSathi
                  </button>
                </div>
              </div>

              {/* Try asking pills */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', flexWrap: 'wrap', marginTop: '14px' }}>
                <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: '600' }}>Try asking:</span>
                {tryAskingPills.map((pill, idx) => (
                  <button 
                    key={idx}
                    onClick={() => handleSend(pill)}
                    style={{
                      background: 'rgba(255, 255, 255, 0.92)',
                      border: '1px solid #cbd5e1',
                      borderRadius: '16px',
                      padding: '3px 12px',
                      fontSize: '0.78rem',
                      fontWeight: '500',
                      color: '#334155',
                      cursor: 'pointer',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.03)'
                    }}
                  >
                    {pill}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 2. Quick Actions Grid (8 Cards matching screenshot) */}
          <div className="as-card" style={{ padding: '22px 24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>Quick Actions</h2>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Get help faster with common farming needs</div>
              </div>
              <button onClick={() => navigate('/my-crops')} style={{ border: 'none', background: 'transparent', color: '#16a34a', fontWeight: '700', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                View All <ArrowRight size={15} />
              </button>
            </div>

            {/* 2x4 Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
              {quickActions.map((act, idx) => {
                const Icon = act.icon;
                return (
                  <div
                    key={idx}
                    onClick={act.action}
                    style={{
                      background: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '16px',
                      padding: '16px 14px',
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.borderColor = act.color; e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.06)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.boxShadow = 'none'; }}
                  >
                    <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: act.bg, color: act.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon size={22} />
                    </div>
                    <div style={{ fontWeight: '700', fontSize: '0.9rem', color: '#1e293b' }}>{act.title}</div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{act.desc}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3. Popular Questions + Upload Plant Image (Two-Column Section) */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px' }}>
            
            {/* Left: Popular Questions */}
            <div className="as-card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>Popular Questions</h3>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>See what other farmers are asking</div>
                </div>
                <button onClick={() => navigate('/community')} style={{ border: 'none', background: 'transparent', color: '#16a34a', fontWeight: '700', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '2px', cursor: 'pointer' }}>
                  View More <ArrowRight size={13} />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {popularQuestions.map((q, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleSend(q)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 12px',
                      borderRadius: '12px',
                      background: '#f8fafc',
                      border: '1px solid #f1f5f9',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      fontWeight: '600',
                      color: '#334155',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = '#f0fdf4'; e.currentTarget.style.color = '#15803d'; e.currentTarget.style.borderColor = '#bbf7d0'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.color = '#334155'; e.currentTarget.style.borderColor = '#f1f5f9'; }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <CheckCircle2 size={15} color="#16a34a" />
                      <span>{q}</span>
                    </div>
                    <ChevronRight size={15} color="#94a3b8" />
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Upload a Plant Image Card */}
            <div className="as-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>Upload a Plant Image</h3>
                <Leaf size={18} color="#16a34a" />
              </div>

              {/* Dashed Dropzone */}
              <div 
                onClick={() => navigate('/scanner')}
                style={{
                  border: '2px dashed #93c5fd',
                  borderRadius: '16px',
                  background: '#f8fafc',
                  padding: '24px 16px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#0284c7', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Camera size={24} />
                </div>
                <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#1e293b' }}>
                  Drag & drop an image here
                </div>
                <div style={{ fontSize: '0.78rem', color: '#64748b' }}>or</div>
                <button 
                  type="button" 
                  className="as-btn-primary" 
                  style={{ background: '#16a34a', border: 'none', padding: '6px 18px', fontSize: '0.82rem', borderRadius: '8px' }}
                >
                  Choose Image
                </button>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '4px' }}>
                  Supports: JPG, PNG (Max 5MB)
                </div>
              </div>

              {/* Footer text */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px', background: '#f0fdf4', padding: '8px 12px', borderRadius: '10px' }}>
                <Sprout size={16} color="#16a34a" />
                <span style={{ fontSize: '0.75rem', color: '#15803d', fontWeight: '600' }}>
                  Get instant disease detection and treatment suggestions.
                </span>
              </div>
            </div>
          </div>

          {/* 4. Bottom Seedlings Sprouting Banner matching reference screenshot */}
          <div style={{
            position: 'relative',
            borderRadius: '20px',
            overflow: 'hidden',
            minHeight: '130px',
            boxShadow: '0 6px 20px rgba(0,0,0,0.06)',
            border: '1px solid #bbf7d0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '24px 32px'
          }}>
            <img 
              src="/seedlings-banner.jpg" 
              alt="Seedlings Sprouting" 
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.85) 60%, rgba(255,255,255,0.95) 100%)' }} />

            <div style={{ position: 'relative', zIndex: 2 }}>
              <div style={{ fontSize: '1.25rem', fontWeight: '900', color: '#14532d', lineHeight: 1.2 }}>
                Healthy Crops<br />Happy Farmers<br />Prosperous India
              </div>
              <button 
                onClick={() => navigate('/my-crops')}
                style={{
                  marginTop: '10px',
                  background: '#14532d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '20px',
                  padding: '6px 16px',
                  fontSize: '0.8rem',
                  fontWeight: '700',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer'
                }}
              >
                Let's Grow Together <ArrowRight size={14} />
              </button>
            </div>

            {/* 3 Pillars on Right */}
            <div style={{ position: 'relative', zIndex: 2, display: 'flex', gap: '24px' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 4px auto' }}>
                  <ShieldCheck size={20} />
                </div>
                <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#1e293b' }}>Better Decisions</div>
              </div>

              <div style={{ textAlign: 'center' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 4px auto' }}>
                  <Sprout size={20} />
                </div>
                <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#1e293b' }}>Higher Yields</div>
              </div>

              <div style={{ textAlign: 'center' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 4px auto' }}>
                  <Award size={20} />
                </div>
                <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#1e293b' }}>Sustainable Future</div>
              </div>
            </div>
          </div>

        </div>

        {/* =================================================================== */}
        {/* RIGHT COLUMN: Interactive Live AI Chatbot Window */}
        {/* =================================================================== */}
        <div className="as-card" style={{
          padding: '0',
          borderRadius: '24px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          height: 'calc(100vh - 120px)',
          position: 'sticky',
          top: '90px',
          border: '1.5px solid #bbf7d0',
          boxShadow: '0 12px 30px rgba(22, 163, 74, 0.12)',
          background: '#ffffff'
        }}>
          {/* Chatbot Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 20px',
            borderBottom: '1px solid #f1f5f9',
            background: '#ffffff'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Sprout size={20} />
              </div>
              <div>
                <div style={{ fontSize: '1rem', fontWeight: '800', color: '#14532d' }}>AgriSathi AI</div>
                <div style={{ fontSize: '0.72rem', color: '#16a34a', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} /> Online
                </div>
              </div>
            </div>

            <button 
              onClick={handleNewChat}
              style={{
                background: '#14532d',
                color: 'white',
                border: 'none',
                borderRadius: '16px',
                padding: '6px 14px',
                fontSize: '0.8rem',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer'
              }}
            >
              <RefreshCw size={14} /> New Chat
            </button>
          </div>

          {/* Messages Scroll Area */}
          <div style={{
            flex: 1,
            padding: '18px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            background: '#ffffff'
          }}>
            {messages.map((msg, idx) => (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{
                  display: 'flex',
                  gap: '10px',
                  justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  alignItems: 'flex-start'
                }}>
                  {/* Bot Avatar */}
                  {msg.role === 'assistant' && (
                    <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Sprout size={16} />
                    </div>
                  )}

                  {/* Message Bubble */}
                  <div style={{
                    maxWidth: '82%',
                    background: msg.role === 'user' ? '#dcfce7' : '#f8fafc',
                    color: '#1e293b',
                    border: msg.role === 'user' ? '1px solid #bbf7d0' : '1px solid #e2e8f0',
                    borderRadius: '16px',
                    padding: '12px 16px',
                    fontSize: '0.88rem',
                    lineHeight: '1.5',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
                  }}>
                    <ReactMarkdown>{msg.content}</ReactMarkdown>

                    {/* Embedded Disease Leaf Image */}
                    {msg.image && (
                      <div style={{ marginTop: '10px', borderRadius: '10px', overflow: 'hidden', border: '1px solid #cbd5e1' }}>
                        <img src={msg.image} alt="Diagnosis Leaf" style={{ width: '100%', maxHeight: '180px', objectFit: 'cover', display: 'block' }} />
                      </div>
                    )}

                    {/* Treatment Suggestions List */}
                    {msg.treatmentPoints && (
                      <div style={{ marginTop: '12px', background: '#ffffff', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                        <div style={{ fontWeight: '800', color: '#14532d', fontSize: '0.85rem', marginBottom: '8px' }}>
                          Treatment Suggestions:
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          {msg.treatmentPoints.map((tp, tIdx) => (
                            <div key={tIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', fontSize: '0.8rem', color: '#334155' }}>
                              <CheckCircle2 size={14} color="#16a34a" style={{ marginTop: '2px', flexShrink: 0 }} />
                              <span>{tp}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Tip Box */}
                    {msg.tip && (
                      <div style={{ marginTop: '8px', fontSize: '0.75rem', color: '#0369a1', background: '#e0f2fe', padding: '6px 10px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Camera size={13} /> {msg.tip}
                      </div>
                    )}
                  </div>

                  {/* User Avatar */}
                  {msg.role === 'user' && (
                    <img 
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" 
                      alt="Ramesh" 
                      style={{ width: '30px', height: '30px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} 
                    />
                  )}
                </div>

                {/* Timestamp & Feedback Row */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: msg.role === 'user' ? 'flex-end' : 'space-between',
                  paddingLeft: msg.role === 'assistant' ? '40px' : '0',
                  paddingRight: msg.role === 'user' ? '40px' : '0',
                  fontSize: '0.72rem',
                  color: '#94a3b8'
                }}>
                  <span>{msg.time}</span>

                  {msg.role === 'assistant' && msg.treatmentPoints && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span>Was this helpful?</span>
                      <button 
                        onClick={() => handleFeedback(idx, 'yes')}
                        style={{
                          border: 'none',
                          background: msg.feedbackGiven === 'yes' ? '#dcfce7' : '#f1f5f9',
                          color: msg.feedbackGiven === 'yes' ? '#16a34a' : '#475569',
                          padding: '2px 8px',
                          borderRadius: '12px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '3px',
                          fontSize: '0.72rem',
                          fontWeight: '600'
                        }}
                      >
                        <ThumbsUp size={11} /> Yes
                      </button>
                      <button 
                        onClick={() => handleFeedback(idx, 'no')}
                        style={{
                          border: 'none',
                          background: msg.feedbackGiven === 'no' ? '#fee2e2' : '#f1f5f9',
                          color: msg.feedbackGiven === 'no' ? '#dc2626' : '#475569',
                          padding: '2px 8px',
                          borderRadius: '12px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '3px',
                          fontSize: '0.72rem',
                          fontWeight: '600'
                        }}
                      >
                        <ThumbsDown size={11} /> No
                      </button>
                    </div>
                  )}
                </div>

                {/* Initial Bot Prompt Pills */}
                {msg.pills && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', paddingLeft: '40px', marginTop: '4px' }}>
                    {msg.pills.map((p, pIdx) => (
                      <button
                        key={pIdx}
                        onClick={() => handleSend(p)}
                        style={{
                          background: '#ffffff',
                          border: '1px solid #cbd5e1',
                          borderRadius: '16px',
                          padding: '6px 10px',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          color: '#334155',
                          textAlign: 'left',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#16a34a'; e.currentTarget.style.color = '#16a34a'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.color = '#334155'; }}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Sprout size={16} />
                </div>
                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '10px 14px', color: '#64748b', fontSize: '0.82rem' }}>
                  <RefreshCw size={13} className="spin" style={{ display: 'inline', verticalAlign: 'middle', marginRight: '6px' }} />
                  AgriSathi AI is analyzing farming advisory...
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Floating Rounded Input Box */}
          <div style={{ padding: '14px 18px', background: '#ffffff', borderTop: '1px solid #f1f5f9' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              background: '#f8fafc',
              border: '1px solid #cbd5e1',
              borderRadius: '24px',
              padding: '4px 8px 4px 16px',
              gap: '8px'
            }}>
              <input 
                type="text" 
                placeholder="Type your question here..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                style={{
                  flex: 1,
                  border: 'none',
                  background: 'transparent',
                  outline: 'none',
                  fontSize: '0.88rem',
                  color: '#1e293b'
                }}
              />

              <button 
                type="button" 
                onClick={() => fileInputRef.current?.click()}
                title="Upload Photo"
                style={{ border: 'none', background: 'transparent', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
              >
                <Camera size={18} />
              </button>

              <button 
                type="button" 
                onClick={() => handleSend("What is the weather and mandi update for today?")}
                title="Voice Input"
                style={{ border: 'none', background: 'transparent', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
              >
                <Mic size={18} />
              </button>

              <button 
                type="button" 
                onClick={() => handleSend()}
                disabled={loading}
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  background: '#14532d',
                  color: 'white',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  flexShrink: 0
                }}
              >
                <Send size={15} />
              </button>
            </div>

            <div style={{ textAlign: 'center', fontSize: '0.72rem', color: '#15803d', fontWeight: '600', marginTop: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
              <Sprout size={13} /> Together for a Greener Tomorrow
            </div>
          </div>

        </div>

      </div>
    </motion.div>
  );
}
