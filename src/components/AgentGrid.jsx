import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PhoneCall, ShieldAlert, PhoneForwarded } from 'lucide-react';

const FALLBACK_AGENTS = [
  { id: 'crop_advisor', name: 'Crop Advisor', emoji: '🌾', descKey: 'agentDescCrop', description: 'Diseases, pests, remedies & cultivation' },
  { id: 'market_analyst', name: 'Market Analyst', emoji: '📊', descKey: 'agentDescMarket', description: 'MSP, mandi prices & demand trends' },
  { id: 'schemes_expert', name: 'Schemes Expert', emoji: '🏛️', descKey: 'agentDescSchemes', description: 'Government schemes & subsidies' },
  { id: 'weather_analyst', name: 'Weather Analyst', emoji: '🌦️', descKey: 'agentDescWeather', description: 'Weather risks & seasonal planning' },
  { id: 'leaf_scanner', name: 'Leaf Scanner', emoji: '🔬', descKey: 'agentDescScanner', description: 'Plant disease identification' },
  { id: 'helpline_support', name: 'Emergency Helpline', emoji: '📞', descKey: 'helplineTitle', description: 'Direct Kisan & Emergency call support' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

export default function AgentGrid({ t, language }) {
  const [agents, setAgents] = useState(FALLBACK_AGENTS);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`/api/agents?lang=${language || 'en'}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          // ensure helpline is included
          const exists = data.some(a => a.id === 'helpline_support');
          if (!exists) {
            setAgents([...data, FALLBACK_AGENTS[5]]);
          } else {
            setAgents(data);
          }
        }
      })
      .catch(() => {
        // Use fallback
      });
  }, [language]);

  const getTranslatedName = (agentId, fallbackName) => {
    if (agentId === 'helpline_support') return t?.helplinePanel || 'Helpline & Call';
    const key = 'agent' + agentId.split('_')[0].charAt(0).toUpperCase() + agentId.split('_')[0].slice(1);
    return t[key] || fallbackName;
  };

  const handleClick = (agentId) => {
    if (agentId === 'leaf_scanner') {
      navigate('/scanner');
    } else if (agentId === 'market_analyst') {
      navigate('/market');
    } else if (agentId === 'schemes_expert') {
      navigate('/schemes');
    } else if (agentId === 'weather_analyst') {
      navigate('/weather');
    } else if (agentId === 'helpline_support') {
      navigate('/helpline');
    } else {
      navigate(`/chat/${agentId}`);
    }
  };

  return (
    <div className="page-container">
      {/* Dashboard Top Helpline Quick Banner */}
      <motion.div 
        className="dashboard-helpline-banner glass-panel"
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="dhb-content">
          <div className="dhb-badge">
            <ShieldAlert size={16} />
            <span>{t?.helplineEmergencyPill || 'Farmer Support Helpline'}</span>
          </div>
          <h3 className="dhb-title">{t?.helplineBannerTitle || 'Need Immediate Agricultural Assistance?'}</h3>
          <p className="dhb-subtitle">{t?.helplineBannerSubtitle || 'Call Kisan Call Center (1800-180-1551) or AgriMitra 24/7 Helpline with 1-click direct dialing.'}</p>
        </div>

        <div className="dhb-actions">
          <a href="tel:18001801551" className="dhb-call-btn primary">
            <PhoneCall size={18} />
            <span>Kisan Call Center (1800-180-1551)</span>
          </a>

          <a href="tel:18001234567" className="dhb-call-btn secondary">
            <PhoneForwarded size={18} />
            <span>24/7 Support (1800-123-4567)</span>
          </a>

          <button onClick={() => navigate('/helpline')} className="dhb-view-all-btn">
            {t?.helplineFilterAll || 'View All Helplines'} →
          </button>
        </div>
      </motion.div>

      <motion.div 
        className="hero-section"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <h1 className="page-title">{t.agentsAll || 'Select an AI Agent'}</h1>
        <p className="page-subtitle">{t?.agentGridSubtitle || 'Choose a specialized assistant to help you with your farming needs today.'}</p>
      </motion.div>

      <motion.div 
        className="agent-grid-full"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {agents.map((agent) => (
          <motion.div
            key={agent.id}
            className="agent-card-large glass-panel"
            variants={itemVariants}
            whileHover={{ scale: 1.03, translateY: -5, boxShadow: "0 20px 40px rgba(0,0,0,0.4)" }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleClick(agent.id)}
            role="button"
            tabIndex={0}
          >
            <div className="agent-card-header">
              <div className="agent-emoji-large">{agent.emoji}</div>
              <div className="agent-status-indicator">
                <span className="status-dot pulsing"></span> {t?.agentOnline || 'Online'}
              </div>
            </div>
            <h3 className="agent-name-large">{getTranslatedName(agent.id, agent.name)}</h3>
            <p className="agent-desc-large">
              {agent.id === 'helpline_support' 
                ? (t?.helplineSubtitle || 'Direct 1-click phone call to agricultural experts & Kisan helpline.')
                : ((agent.descKey && t?.[agent.descKey]) || agent.description)
              }
            </p>
            {agent.id === 'helpline_support' && (
              <div style={{ marginTop: '12px' }}>
                <a 
                  href="tel:18001801551" 
                  className="quick-card-call-btn"
                  onClick={(e) => { e.stopPropagation(); window.location.href = 'tel:18001801551'; }}
                >
                  <PhoneCall size={16} /> <span>Call 1800-180-1551</span>
                </a>
              </div>
            )}
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
