import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Sprout, Bot, ShieldCheck, ArrowRight, Sparkles, 
  TrendingUp, CloudSun, BookOpen, Landmark, PhoneCall, 
  CheckCircle2, Users, Star, Smartphone, Globe, Lock, Leaf
} from 'lucide-react';

export default function LandingPage({ t, language, setLanguage }) {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Bot size={28} color="#16a34a" />,
      title: "NVIDIA Multi-Agent AI Chat",
      desc: "Sub-second voice and chat advisory powered by NVIDIA Nemotron-30B Omni reasoning in your native Indian language.",
      tag: "Sub-Second AI"
    },
    {
      icon: <Sprout size={28} color="#0284c7" />,
      title: "AI Plant Disease Vision Doctor",
      desc: "Upload leaf photos from your phone camera for instant pathology detection with ICAR-verified biological & chemical sprays.",
      tag: "98% Vision Accuracy"
    },
    {
      icon: <TrendingUp size={28} color="#ea580c" />,
      title: "Live Mandi Prices & MSP Tracker",
      desc: "Real-time Agmarknet market rates across 500+ APMC mandis with price forecast trends and minimum support prices.",
      tag: "Live APMC Rates"
    },
    {
      icon: <BookOpen size={28} color="#8b5cf6" />,
      title: "ICAR Crop Agronomy Package",
      desc: "Comprehensive package-of-practices for 25+ Indian crops with stage-by-stage NPK dosage, water scheduling, and field logs.",
      tag: "25+ Major Crops"
    },
    {
      icon: <CloudSun size={28} color="#eab308" />,
      title: "Agromet Weather Telemetry",
      desc: "Hyperlocal 7-day precipitation forecasts, relative humidity alerts, and ideal agricultural spray window advisories.",
      tag: "Rain Telemetry"
    },
    {
      icon: <Landmark size={28} color="#10b981" />,
      title: "Government Schemes & Subsidies",
      desc: "Direct access and eligibility checks for PM-KISAN, PMFBY crop insurance, Soil Health Cards, and state welfare schemes.",
      tag: "Official Portals"
    }
  ];

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'te', label: 'తెలుగు (Telugu)' },
    { code: 'hi', label: 'हिन्दी (Hindi)' },
    { code: 'ta', label: 'தமிழ் (Tamil)' },
    { code: 'kn', label: 'ಕನ್ನಡ (Kannada)' },
    { code: 'mr', label: 'मराठी (Marathi)' },
    { code: 'bn', label: 'বাংলা (Bengali)' },
    { code: 'gu', label: 'ગુજરાતી (Gujarati)' }
  ];

  return (
    <div className="landing-page" style={{ minHeight: '100vh', background: '#f8fafc', color: '#1e293b', overflowX: 'hidden' }}>
      
      {/* 1. TOP NAVIGATION BAR */}
      <nav style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'rgba(255, 255, 255, 0.92)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #e2e8f0',
        padding: '16px 24px'
      }}>
        <div className="landing-nav-inner" style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          
          {/* Brand Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, #15803d, #16a34a)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', boxShadow: '0 4px 12px rgba(22, 163, 74, 0.25)' }}>
              <Sprout size={24} />
            </div>
            <div>
              <span style={{ fontSize: '1.4rem', fontWeight: '800', color: '#14532d', letterSpacing: '-0.5px' }}>AgriMitra</span>
              <span style={{ fontSize: '0.75rem', fontWeight: '700', background: '#dcfce7', color: '#15803d', padding: '2px 8px', borderRadius: '12px', marginLeft: '6px' }}>AI PRO</span>
            </div>
          </div>

          {/* Right Action Bar */}
          <div className="landing-nav-actions" style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            
            {/* Language Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#f1f5f9', padding: '6px 12px', borderRadius: '10px', border: '1px solid #cbd5e1' }}>
              <Globe size={16} color="#64748b" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                style={{ background: 'transparent', border: 'none', fontSize: '0.85rem', fontWeight: '600', color: '#334155', cursor: 'pointer', outline: 'none' }}
              >
                {languages.map((l) => (
                  <option key={l.code} value={l.code}>{l.label}</option>
                ))}
              </select>
            </div>

            {/* Login Button */}
            <button
              onClick={() => navigate('/login')}
              style={{
                background: 'linear-gradient(135deg, #15803d 0%, #16a34a 100%)',
                color: 'white',
                border: 'none',
                padding: '10px 22px',
                borderRadius: '12px',
                fontWeight: '700',
                fontSize: '0.92rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 14px rgba(22, 163, 74, 0.3)',
                transition: 'transform 0.15s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <span>{t.login || "Farmer Login / Sign Up"}</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </nav>

      {/* 2. HERO SECTION */}
      <section className="landing-hero" style={{
        position: 'relative',
        padding: '60px 24px 80px',
        background: 'linear-gradient(180deg, #f0fdf4 0%, #ffffff 100%)',
        borderBottom: '1px solid #e2e8f0'
      }}>
        <div className="landing-hero-grid" style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1.15fr 1fr', gap: '48px', alignItems: 'center' }}>
          
          {/* Left Hero Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: '#dcfce7',
              border: '1px solid #86efac',
              padding: '6px 14px',
              borderRadius: '20px',
              fontSize: '0.85rem',
              fontWeight: '700',
              color: '#15803d',
              marginBottom: '20px'
            }}>
              <Sparkles size={16} /> Powered by NVIDIA Nemotron-30B Omni & Supabase Cloud
            </div>

            <h1 style={{ fontSize: '2.9rem', fontWeight: '900', lineHeight: 1.15, color: '#0f3a1d', margin: '0 0 20px 0', letterSpacing: '-1px' }}>
              Empowering Indian Farmers with <span style={{ color: '#16a34a', textDecoration: 'underline decoration-emerald-300' }}>AI Intelligence</span>
            </h1>

            <p style={{ fontSize: '1.1rem', color: '#475569', lineHeight: 1.6, margin: '0 0 32px 0' }}>
              Your 24/7 personal agricultural scientist. Get instant disease diagnosis from leaf photos, real-time APMC mandi prices, weather forecasts, and ICAR crop agronomy packages in your native language.
            </p>

            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
              <button
                onClick={() => navigate('/login')}
                style={{
                  background: 'linear-gradient(135deg, #15803d 0%, #16a34a 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '16px 32px',
                  borderRadius: '14px',
                  fontSize: '1.05rem',
                  fontWeight: '800',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  boxShadow: '0 8px 24px rgba(22, 163, 74, 0.35)',
                  transition: 'all 0.2s ease'
                }}
              >
                <span>Enter Farmer Dashboard</span>
                <ArrowRight size={20} />
              </button>

              <button
                onClick={() => navigate('/login')}
                style={{
                  background: 'white',
                  color: '#15803d',
                  border: '2px solid #86efac',
                  padding: '14px 26px',
                  borderRadius: '14px',
                  fontSize: '1rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <Leaf size={18} />
                <span>Scan Leaf Disease</span>
              </button>
            </div>

            {/* Trust Badges */}
            <div style={{ display: 'flex', gap: '24px', marginTop: '36px', paddingTop: '24px', borderTop: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: '600', color: '#334155' }}>
                <CheckCircle2 size={18} color="#16a34a" /> 100% Free for Farmers
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: '600', color: '#334155' }}>
                <CheckCircle2 size={18} color="#16a34a" /> 8 Indian Languages
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: '600', color: '#334155' }}>
                <CheckCircle2 size={18} color="#16a34a" /> Verified ICAR Practices
              </div>
            </div>
          </motion.div>

          {/* Right Visual Hero Showcase */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{ position: 'relative' }}
          >
            <div style={{
              borderRadius: '24px',
              overflow: 'hidden',
              boxShadow: '0 25px 50px -12px rgba(6, 78, 59, 0.25)',
              border: '4px solid white',
              position: 'relative'
            }}>
              <img
                src="/hero-farm.jpg"
                alt="AgriMitra Smart Farming"
                style={{ width: '100%', height: '420px', objectFit: 'cover', display: 'block' }}
              />
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg, transparent 40%, rgba(6, 78, 59, 0.85) 100%)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                padding: '28px',
                color: 'white'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: '700', color: '#86efac', marginBottom: '4px' }}>
                  <Sparkles size={16} /> Instant AI Diagnosis
                </div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: '800', margin: 0 }}>
                  Early Blight, Powdery Mildew & Pest Detection
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#dcfce7', margin: '4px 0 0 0' }}>
                  Capture a leaf picture or query mandi rates with voice in Telugu, Hindi or English.
                </p>
              </div>
            </div>

            {/* Floating Live Card */}
            <div style={{
              position: 'absolute',
              top: '-16px',
              right: '-16px',
              background: 'white',
              borderRadius: '16px',
              padding: '14px 18px',
              boxShadow: '0 12px 30px rgba(0,0,0,0.12)',
              border: '1px solid #bbf7d0',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <TrendingUp size={20} />
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '600' }}>Guntur Mirchi Mandi</div>
                <div style={{ fontSize: '0.95rem', fontWeight: '800', color: '#15803d' }}>₹19,450 / Qtl ▲ +3.2%</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3. METRICS SHOWCASE BAR */}
      <section className="landing-metrics" style={{ background: '#064e3b', color: 'white', padding: '36px 24px' }}>
        <div className="landing-metrics-grid" style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', textAlign: 'center' }}>
          <div>
            <div style={{ fontSize: '2.2rem', fontWeight: '900', color: '#86efac' }}>500+</div>
            <div style={{ fontSize: '0.88rem', color: '#d1fae5', marginTop: '2px' }}>APMC Mandis Tracked</div>
          </div>
          <div>
            <div style={{ fontSize: '2.2rem', fontWeight: '900', color: '#86efac' }}>98%</div>
            <div style={{ fontSize: '0.88rem', color: '#d1fae5', marginTop: '2px' }}>Pathology Detection Accuracy</div>
          </div>
          <div>
            <div style={{ fontSize: '2.2rem', fontWeight: '900', color: '#86efac' }}>25+</div>
            <div style={{ fontSize: '0.88rem', color: '#d1fae5', marginTop: '2px' }}>ICAR Crop Packages</div>
          </div>
          <div>
            <div style={{ fontSize: '2.2rem', fontWeight: '900', color: '#86efac' }}>&lt; 1s</div>
            <div style={{ fontSize: '0.88rem', color: '#d1fae5', marginTop: '2px' }}>Sub-Second NVIDIA Streaming</div>
          </div>
        </div>
      </section>

      {/* 4. CORE PLATFORM MODULES */}
      <section className="landing-platform" style={{ padding: '80px 24px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#16a34a', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Comprehensive Intelligence Suite
          </span>
          <h2 style={{ fontSize: '2.3rem', fontWeight: '800', color: '#0f3a1d', margin: '8px 0 12px 0' }}>
            Everything You Need for Precision Agriculture
          </h2>
          <p style={{ fontSize: '1rem', color: '#64748b', maxWidth: '640px', margin: '0 auto' }}>
            Designed ground-up for Indian farmers, combining cutting-edge AI neural reasoning with verified scientific ICAR agronomy.
          </p>
        </div>

        <div className="landing-feature-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '28px' }}>
          {features.map((f, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -6 }}
              style={{
                background: 'white',
                borderRadius: '20px',
                padding: '32px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.2s ease'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                  <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {f.icon}
                  </div>
                  <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#15803d', background: '#dcfce7', padding: '4px 10px', borderRadius: '12px' }}>
                    {f.tag}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1e293b', margin: '0 0 10px 0' }}>
                  {f.title}
                </h3>
                <p style={{ fontSize: '0.92rem', color: '#64748b', lineHeight: 1.6, margin: 0 }}>
                  {f.desc}
                </p>
              </div>

              <div style={{ marginTop: '24px', paddingTop: '18px', borderTop: '1px solid #f1f5f9' }}>
                <button
                  onClick={() => navigate('/login')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#16a34a',
                    fontWeight: '700',
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: 0
                  }}
                >
                  <span>Explore Feature</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 5. CALL TO ACTION BANNER */}
      <section className="landing-cta" style={{ padding: '0 24px 80px' }}>
        <div className="landing-cta-inner" style={{
          maxWidth: '1200px',
          margin: '0 auto',
          background: 'linear-gradient(135deg, #064e3b 0%, #065f46 50%, #047857 100%)',
          borderRadius: '28px',
          padding: '56px 48px',
          color: 'white',
          display: 'grid',
          gridTemplateColumns: '1.4fr 1fr',
          alignItems: 'center',
          gap: '40px',
          boxShadow: '0 20px 40px -15px rgba(6, 78, 59, 0.4)'
        }}>
          <div>
            <h2 style={{ fontSize: '2.2rem', fontWeight: '800', margin: '0 0 14px 0', lineHeight: 1.2 }}>
              Ready to Upgrade Your Farm with AI?
            </h2>
            <p style={{ fontSize: '1rem', color: '#d1fae5', margin: '0 0 28px 0', lineHeight: 1.6 }}>
              Join thousands of Indian farmers using AgriMitra AI on their phones and computers to protect crops, maximize crop profits, and get instant ICAR scientific advisory.
            </p>
            <button
              onClick={() => navigate('/login')}
              style={{
                background: '#22c55e',
                color: '#052e16',
                border: 'none',
                padding: '16px 32px',
                borderRadius: '14px',
                fontSize: '1.05rem',
                fontWeight: '800',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                boxShadow: '0 8px 20px rgba(34, 197, 94, 0.4)'
              }}
            >
              <Smartphone size={20} />
              <span>Get Started Now — It's Free</span>
            </button>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.1)', padding: '24px', borderRadius: '20px', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.15)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '700', fontSize: '1.05rem', marginBottom: '8px', color: '#86efac' }}>
              <PhoneCall size={20} /> Kisan Call Centre Support
            </div>
            <p style={{ fontSize: '0.88rem', color: '#dcfce7', margin: '0 0 14px 0', lineHeight: 1.5 }}>
              Need urgent voice help? Dial toll-free <strong>1800-180-1551</strong> directly from your mobile phone.
            </p>
            <div style={{ fontSize: '0.8rem', color: '#a7f3d0' }}>
              Integrated with Agmarknet, IMD Agromet, and ICAR Research Institutes.
            </div>
          </div>
        </div>
      </section>

      {/* 6. FOOTER */}
      <footer className="landing-footer" style={{ background: '#022c22', color: '#a7f3d0', padding: '36px 24px', borderTop: '1px solid #064e3b' }}>
        <div className="landing-footer-inner" style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Sprout size={22} color="#4ade80" />
            <span style={{ fontWeight: '800', fontSize: '1.1rem', color: 'white' }}>AgriMitra AI</span>
            <span style={{ fontSize: '0.8rem', color: '#6ee7b7' }}>© 2026 All Rights Reserved.</span>
          </div>

          <div style={{ display: 'flex', gap: '20px', fontSize: '0.85rem' }}>
            <span onClick={() => navigate('/login')} style={{ cursor: 'pointer', color: '#86efac' }}>Farmer Login</span>
            <span onClick={() => navigate('/login')} style={{ cursor: 'pointer', color: '#86efac' }}>Register Account</span>
            <span onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} style={{ cursor: 'pointer', color: '#86efac' }}>Back to Top ↑</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
