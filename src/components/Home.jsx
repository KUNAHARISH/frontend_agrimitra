import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Sprout, Cloud, TrendingUp, Bot, Landmark, 
  PhoneCall, Leaf, Users, ArrowRight, ShieldCheck, 
  Sparkles, CheckCircle 
} from 'lucide-react';

export default function Home({ t, language, user }) {
  const navigate = useNavigate();
  const userName = user?.name ? user.name.split(' ')[0] : 'Farmer';

  const featureCards = [
    {
      title: t.featurePlantDiseaseTitle || "Plant Disease",
      desc: t.featurePlantDiseaseDesc || "Identify & treat crop diseases",
      icon: Sprout,
      color: "#16a34a",
      bgColor: "#dcfce7",
      to: "/scanner"
    },
    {
      title: t.featureWeatherTitle || "Weather",
      desc: t.featureWeatherDesc || "Get real-time weather updates",
      icon: Cloud,
      color: "#0284c7",
      bgColor: "#e0f2fe",
      to: "/weather"
    },
    {
      title: t.featureMarketTitle || "Market Prices",
      desc: t.featureMarketDesc || "Check daily mandi prices",
      icon: TrendingUp,
      color: "#ea580c",
      bgColor: "#ffedd5",
      to: "/market"
    },
    {
      title: t.featureAiChatTitle || "AI Assistant",
      desc: t.featureAiChatDesc || "Ask anything about farming",
      icon: Bot,
      color: "#7c3aed",
      bgColor: "#ede9fe",
      to: "/chat"
    },
    {
      title: t.featureSchemesTitle || "Government Schemes",
      desc: t.featureSchemesDesc || "Find eligible schemes",
      icon: Landmark,
      color: "#0d9488",
      bgColor: "#ccfbf1",
      to: "/schemes"
    },
    {
      title: t.featureHelplineTitle || "Farmer Helpline",
      desc: t.featureHelplineDesc || "Get expert support (24x7)",
      icon: PhoneCall,
      color: "#e11d48",
      bgColor: "#ffe4e6",
      to: "/helpline"
    },
    {
      title: t.featureMyCropsTitle || "My Crops",
      desc: t.featureMyCropsDesc || "Track and manage crops",
      icon: Leaf,
      color: "#15803d",
      bgColor: "#f0fdf4",
      to: "/my-crops"
    },
    {
      title: t.featureCommunityTitle || "Community",
      desc: t.featureCommunityDesc || "Connect with farmers",
      icon: Users,
      color: "#2563eb",
      bgColor: "#dbeafe",
      to: "/community"
    },
  ];

  return (
    <motion.div 
      className="page-container"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
    >
      {/* Hero Banner with Rich Visual Showcase */}
      <div className="home-hero hero-banner" style={{
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 50%, #bbf7d0 100%)',
        borderRadius: '24px',
        padding: '36px 32px',
        display: 'grid',
        gridTemplateColumns: '1.2fr 1fr',
        gap: '32px',
        alignItems: 'center',
        border: '1px solid #86efac',
        boxShadow: '0 10px 30px -10px rgba(22, 163, 74, 0.15)',
        marginBottom: '28px'
      }}>
        <div className="hero-content" style={{ zIndex: 2 }}>
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '8px', 
            background: 'white', 
            padding: '6px 14px', 
            borderRadius: '20px', 
            fontSize: '0.82rem', 
            fontWeight: '700', 
            color: '#15803d', 
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            marginBottom: '16px',
            border: '1px solid #bbf7d0'
          }}>
            <Sparkles size={16} color="#16a34a" /> {`Namaste, ${userName}! 🌾 — `}{t.heroTag || "AI-Powered Indian Agriculture"}
          </div>
          <h1 className="hero-title" style={{ fontSize: '2.4rem', fontWeight: '800', lineHeight: 1.2, color: '#14532d', marginBottom: '14px' }}>
            {t.heroTitle || "Empowering Farmers, Enriching Lives"}
          </h1>
          <p className="hero-subtitle" style={{ fontSize: '1.05rem', color: '#166534', lineHeight: 1.5, marginBottom: '24px' }}>
            {t.heroSubtitle || "Smart Information, Better Decisions, Higher Yields."}
          </p>
          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
            <button 
              className="hero-btn" 
              onClick={() => navigate('/scanner')}
              style={{
                background: '#16a34a',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '12px',
                fontWeight: '700',
                fontSize: '0.95rem',
                border: 'none',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 14px rgba(22, 163, 74, 0.35)',
                transition: 'all 0.2s ease'
              }}
            >
              <Sprout size={18} /> {t.navScanner || "Scan Plant Disease"}
            </button>
            <button 
              onClick={() => navigate('/market')}
              style={{
                background: 'white',
                color: '#15803d',
                padding: '12px 22px',
                borderRadius: '12px',
                fontWeight: '700',
                fontSize: '0.95rem',
                border: '1px solid #86efac',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s ease'
              }}
            >
              <TrendingUp size={18} /> {t.navMarket || "Live Mandi Prices"}
            </button>
          </div>
        </div>

        {/* Hero Visual Image Container */}
        <div style={{ position: 'relative', borderRadius: '18px', overflow: 'hidden', boxShadow: '0 12px 30px rgba(0,0,0,0.12)' }}>
          <img 
            src="/hero-farm.jpg" 
            alt="Smart Indian Agriculture" 
            style={{ width: '100%', height: '260px', objectFit: 'cover', display: 'block' }}
          />
          <div style={{
            position: 'absolute',
            bottom: '12px',
            left: '12px',
            right: '12px',
            background: 'rgba(255, 255, 255, 0.92)',
            backdropFilter: 'blur(8px)',
            borderRadius: '12px',
            padding: '10px 14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            border: '1px solid rgba(255,255,255,0.8)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 8px #22c55e' }} />
              <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#14532d' }}>Smart IoT & Satellite Sync</span>
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#16a34a', background: '#dcfce7', padding: '2px 8px', borderRadius: '6px' }}>
              700+ Districts Active
            </span>
          </div>
        </div>
      </div>

      {/* Visual Agritech Feature Spotlights */}
      <div className="home-spotlight-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '28px' }}>
        {/* Spotlight 1: AI Plant Disease */}
        <div 
          onClick={() => navigate('/scanner')}
          style={{
            background: 'white',
            borderRadius: '18px',
            overflow: 'hidden',
            border: '1px solid var(--border-color, #e2e8f0)',
            cursor: 'pointer',
            transition: 'all 0.25s ease',
            boxShadow: '0 4px 12px rgba(0,0,0,0.04)'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 24px rgba(22,163,74,0.15)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.04)'; }}
        >
          <div style={{ height: '150px', overflow: 'hidden', position: 'relative' }}>
            <img src="/ai-scanner.jpg" alt="AI Disease Scanner" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', top: '10px', left: '10px', background: 'rgba(22, 163, 74, 0.9)', color: 'white', fontSize: '0.75rem', fontWeight: '700', padding: '3px 10px', borderRadius: '12px', backdropFilter: 'blur(4px)' }}>
              AI Vision Model
            </div>
          </div>
          <div style={{ padding: '16px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#14532d', marginBottom: '4px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>{t.featurePlantDiseaseTitle || "Plant Disease Doctor"}</span>
              <ArrowRight size={16} color="#16a34a" />
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted, #64748b)', margin: 0 }}>
              {t.featurePlantDiseaseDesc || "Instant leaf diagnosis, severity score & organic remedies"}
            </p>
          </div>
        </div>

        {/* Spotlight 2: Live APMC Mandi */}
        <div 
          onClick={() => navigate('/market')}
          style={{
            background: 'white',
            borderRadius: '18px',
            overflow: 'hidden',
            border: '1px solid var(--border-color, #e2e8f0)',
            cursor: 'pointer',
            transition: 'all 0.25s ease',
            boxShadow: '0 4px 12px rgba(0,0,0,0.04)'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 24px rgba(234,88,12,0.15)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.04)'; }}
        >
          <div style={{ height: '150px', overflow: 'hidden', position: 'relative' }}>
            <img src="/mandi-market.jpg" alt="Mandi Market" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', top: '10px', left: '10px', background: 'rgba(234, 88, 12, 0.9)', color: 'white', fontSize: '0.75rem', fontWeight: '700', padding: '3px 10px', borderRadius: '12px', backdropFilter: 'blur(4px)' }}>
              All 35+ Crops
            </div>
          </div>
          <div style={{ padding: '16px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#7c2d12', marginBottom: '4px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>{t.featureMarketTitle || "Live APMC Mandi"}</span>
              <ArrowRight size={16} color="#ea580c" />
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted, #64748b)', margin: 0 }}>
              {t.featureMarketDesc || "Real-time crop prices, 24h gainers & district yard trends"}
            </p>
          </div>
        </div>

        {/* Spotlight 3: Smart Farm Management */}
        <div 
          onClick={() => navigate('/my-crops')}
          style={{
            background: 'white',
            borderRadius: '18px',
            overflow: 'hidden',
            border: '1px solid var(--border-color, #e2e8f0)',
            cursor: 'pointer',
            transition: 'all 0.25s ease',
            boxShadow: '0 4px 12px rgba(0,0,0,0.04)'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 24px rgba(2,132,199,0.15)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.04)'; }}
        >
          <div style={{ height: '150px', overflow: 'hidden', position: 'relative' }}>
            <img src="/farmer-crops.jpg" alt="Farm Tracker" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', top: '10px', left: '10px', background: 'rgba(2, 132, 199, 0.9)', color: 'white', fontSize: '0.75rem', fontWeight: '700', padding: '3px 10px', borderRadius: '12px', backdropFilter: 'blur(4px)' }}>
              ICAR Farm Advisory
            </div>
          </div>
          <div style={{ padding: '16px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0369a1', marginBottom: '4px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>{t.featureMyCropsTitle || "My Crops & Fields"}</span>
              <ArrowRight size={16} color="#0284c7" />
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted, #64748b)', margin: 0 }}>
              {t.featureMyCropsDesc || "Field progress, irrigation alerts & seasonal spray plans"}
            </p>
          </div>
        </div>
      </div>

      {/* 8 Action Features Grid */}
      <div className="feature-grid">
        {featureCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={idx}
              className="feature-card"
              onClick={() => navigate(card.to)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="feature-icon-wrapper" style={{ background: card.bgColor, color: card.color }}>
                <Icon size={28} />
              </div>
              <h3 className="feature-title">{card.title}</h3>
              <p className="feature-desc">{card.desc}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Live Highlights / Value Pillars */}
      <div className="home-value-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginTop: '24px' }}>
        <div style={{ background: 'white', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '18px 20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16a34a' }}>
            <ShieldCheck size={22} />
          </div>
          <div>
            <div style={{ fontWeight: '700', fontSize: '0.95rem' }}>{t.pillarDataTitle || "Official Datasets"}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t.pillarDataDesc || "Agmarknet & IMD real-time data"}</div>
          </div>
        </div>

        <div style={{ background: 'white', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '18px 20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#ede9fe', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7c3aed' }}>
            <Bot size={22} />
          </div>
          <div>
            <div style={{ fontWeight: '700', fontSize: '0.95rem' }}>{t.pillarAiTitle || "KCC Intelligence"}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t.pillarAiDesc || "Kisan Call Centre scientific RAG"}</div>
          </div>
        </div>

        <div style={{ background: 'white', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '18px 20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#e11d48' }}>
            <PhoneCall size={22} />
          </div>
          <div>
            <div style={{ fontWeight: '700', fontSize: '0.95rem' }}>{t.pillarLangTitle || "11 Indian Languages"}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t.pillarLangDesc || "Regional dialect voice and text"}</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
