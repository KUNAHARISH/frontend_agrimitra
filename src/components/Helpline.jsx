import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PhoneCall, AlertTriangle, ShieldAlert, Building, Phone, MapPin, Clock, Sparkles, Headphones } from 'lucide-react';

export default function Helpline({ t, language }) {
  const [activeTab, setActiveTab] = useState('contacts');

  const contacts = [
    {
      title: t.kccTitle || "Kisan Call Centre",
      number: "1800-180-1551",
      timing: "24x7, Toll Free (11 Indian Languages)",
      desc: t.kccDesc || "Connect directly with agricultural scientists for immediate pest, fertilizer, seed and crop advice.",
      badge: "National 24x7",
      color: "#16a34a",
      bg: "#dcfce7"
    },
    {
      title: t.agriHelplineTitle || "Agriculture Helpline",
      number: "14447",
      timing: "Mon - Sat, 9:00 AM - 6:00 PM",
      desc: t.agriHelplineDesc || "For PM-KISAN verification, PMFBY crop insurance claims, and national agriculture subsidy queries.",
      badge: "Government Support",
      color: "#0284c7",
      bg: "#e0f2fe"
    },
    {
      title: t.disasterTitle || "Disaster Management Helpline",
      number: "1070",
      timing: "24x7 Emergency Response",
      desc: t.disasterDesc || "State & National Emergency Operation Centre for flood inundation, cyclones, drought relief, and hail storm damage.",
      badge: "Emergency",
      color: "#ef4444",
      bg: "#fee2e2"
    },
    {
      title: "State Agriculture Department (Your State)",
      number: "1800-425-3535",
      timing: "Working Hours (9:30 AM - 5:30 PM)",
      desc: "Contact your local District Agriculture Officer (DAO) and Krishi Vigyan Kendra (KVK) extension specialists.",
      badge: "State Extension",
      color: "#7c3aed",
      bg: "#ede9fe"
    },
    {
      title: "AgriSathi Customer Care",
      number: "9014527114",
      timing: "Customer Support & App Help",
      desc: "Get help using the AgriSathi app, account features, crop tools, and technical support.",
      badge: "App Support",
      color: "#d97706",
      bg: "#fef3c7"
    },
    {
      title: "AgriSathi Customer Care",
      number: "7337571089",
      timing: "Customer Support & App Help",
      desc: "Call for assistance with app access, farmer services, and connecting to the right support team.",
      badge: "App Support",
      color: "#0f766e",
      bg: "#ccfbf1"
    }
  ];

  const nearbyCenters = [
    { name: "Krishi Vigyan Kendra (KVK)", location: "Garikapadu, Krishna District", phone: "08654-288234", type: "Extension Center" },
    { name: "District Agriculture Office", location: "Collectorate Complex, Vijayawada", phone: "0866-2576822", type: "Government Office" },
    { name: "APMC Agricultural Market Yard", location: "Gollapudi, Vijayawada", phone: "0866-2410291", type: "Mandi Office" },
    { name: "Soil Testing Laboratory", location: "Agriculture Research Station, Guntur", phone: "0863-2234011", type: "Soil Health Lab" }
  ];

  return (
    <motion.div 
      className="page-container"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
    >
      {/* Visual Kisan Call Centre Showcase Banner */}
      <div className="helpline-hero" style={{
        background: 'linear-gradient(135deg, #881337 0%, #be123c 50%, #e11d48 100%)',
        borderRadius: '20px',
        overflow: 'hidden',
        boxShadow: '0 12px 30px -10px rgba(136, 19, 55, 0.4)',
        display: 'grid',
        gridTemplateColumns: '1.2fr 1fr',
        alignItems: 'center',
        marginBottom: '28px',
        color: 'white',
        border: '1px solid #fda4af'
      }}>
        <div style={{ padding: '32px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.15)', padding: '4px 12px', borderRadius: '16px', fontSize: '0.78rem', fontWeight: '700', marginBottom: '12px', backdropFilter: 'blur(4px)', color: '#fecdd3' }}>
            <Sparkles size={14} /> Ministry of Agriculture Toll-Free Support
          </div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: '800', lineHeight: 1.2, margin: '0 0 10px 0', color: '#ffffff' }}>
            {t.helplineTitle || "Farmer Helpline & Expert Support"}
          </h1>
          <p style={{ fontSize: '0.92rem', color: '#ffe4e6', margin: '0 0 18px 0', lineHeight: 1.5 }}>
            Direct access to senior agricultural scientists, ICAR extension officers, disaster relief helplines, and local KVK offices.
          </p>
          <div style={{ display: 'flex', gap: '16px', fontSize: '0.8rem', fontWeight: '600' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#fecdd3' }}>
              <Headphones size={16} /> 1800-180-1551 (Toll Free)
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#fecdd3' }}>
              <Clock size={16} /> 24x7 in 11 Languages
            </div>
          </div>
        </div>
        <div style={{ height: '100%', minHeight: '190px', position: 'relative' }}>
          <img 
            src="/helpline-kcc.jpg" 
            alt="Kisan Call Centre Support" 
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(90deg, #881337 0%, rgba(136,19,55,0.2) 40%, transparent 100%)'
          }} />
        </div>
      </div>

      {/* Tabs matching screenshot */}
      <div className="helpline-tabs" style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
        <button 
          className={activeTab === 'contacts' ? 'as-btn-primary' : 'as-btn-outline'}
          onClick={() => setActiveTab('contacts')}
          style={{ borderRadius: '24px', padding: '10px 24px' }}
        >
          {t.featureHelplineTitle || "Important Contacts"}
        </button>
        <button 
          className={activeTab === 'centers' ? 'as-btn-primary' : 'as-btn-outline'}
          onClick={() => setActiveTab('centers')}
          style={{ borderRadius: '24px', padding: '10px 24px' }}
        >
          Nearby Centers (KVK & Offices)
        </button>
      </div>

      {activeTab === 'contacts' ? (
        <div className="helpline-contact-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          {contacts.map((c, idx) => (
            <div key={idx} className="as-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: c.bg, color: c.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <PhoneCall size={24} />
                  </div>
                  <span className="badge badge-green">{c.badge}</span>
                </div>

                <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#14532d', marginBottom: '4px' }}>
                  {c.title}
                </h3>
                
                <div style={{ fontSize: '1.5rem', fontWeight: '800', color: c.color, margin: '8px 0' }}>
                  {c.number}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                  <Clock size={14} /> {c.timing}
                </div>

                <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: '1.5' }}>
                  {c.desc}
                </p>
              </div>

              <div style={{ marginTop: '20px' }}>
                <a 
                  href={`tel:${c.number.replace(/[^\d]/g, '')}`} 
                  className="as-btn-primary"
                  style={{ width: '100%', textDecoration: 'none' }}
                >
                  <Phone size={16} /> {t.callNow || "Call Now"} ({c.number})
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="helpline-center-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          {nearbyCenters.map((center, idx) => (
            <div key={idx} className="as-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#dcfce7', color: '#15803d', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Building size={22} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-main)' }}>{center.name}</h3>
                  <span className="badge badge-blue">{center.type}</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '8px' }}>
                <MapPin size={16} color="var(--text-muted)" /> {center.location}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#16a34a', fontSize: '0.9rem', fontWeight: '600', marginBottom: '16px' }}>
                <Phone size={16} /> {center.phone}
              </div>

              <a 
                href={`tel:${center.phone.replace(/[^\d]/g, '')}`} 
                className="as-btn-outline"
                style={{ width: '100%', textDecoration: 'none', justifyContent: 'center' }}
              >
                Contact Center
              </a>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
