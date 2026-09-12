import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Landmark, Search, ExternalLink, ShieldCheck, CheckCircle2, X, Sparkles, Award } from 'lucide-react';

const ALL_SCHEMES = [
  {
    id: "pm-kisan",
    name: "PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)",
    description: "₹6,000 per year in 3 equal installments directly to farmer bank accounts",
    category: "Direct Benefit",
    type: "Central",
    benefit: "₹6,000 / year",
    eligibility: "All landholding farmer families across India",
    link: "https://pmkisan.gov.in"
  },
  {
    id: "pmfby",
    name: "PM Fasal Bima Yojana (PMFBY)",
    description: "Comprehensive crop insurance for financial protection against natural calamities and pest outbreaks",
    category: "Insurance",
    type: "Central",
    benefit: "Low 1.5% - 2% premium with full claim settlement",
    eligibility: "All farmers growing notified crops in notified areas",
    link: "https://pmfby.gov.in"
  },
  {
    id: "kcc",
    name: "Kisan Credit Card (KCC)",
    description: "Easy institutional credit for farming, animal husbandry and allied activities at subsidized 4% interest rate",
    category: "Loan Support",
    type: "Central",
    benefit: "Up to ₹3 Lakh at 4% interest (₹1.6 Lakh collateral free)",
    eligibility: "All cultivators, tenant farmers, sharecroppers and SHGs",
    link: "https://kisanrin.gov.in"
  },
  {
    id: "pm-kusum",
    name: "PM-KUSUM (Solar Pumps Scheme)",
    description: "60% subsidy for standalone solar agriculture pumps and solarization of grid-connected irrigation pumps",
    category: "Solar Subsidy",
    type: "Central",
    benefit: "60% capital subsidy (up to 7.5 HP solar pumps)",
    eligibility: "Individual farmers, groups, cooperatives, and FPOs",
    link: "https://pmkusum.mnre.gov.in"
  },
  {
    id: "pmksy",
    name: "PMKSY - Per Drop More Crop",
    description: "55% subsidy on drip and sprinkler micro-irrigation systems for water efficiency",
    category: "Irrigation",
    type: "Central",
    benefit: "55% subsidy for small/marginal farmers (45% for others)",
    eligibility: "All farmers with arable land and irrigation water source",
    link: "https://pmksy.gov.in"
  },
  {
    id: "smam",
    name: "SMAM (Agricultural Mechanization)",
    description: "Subsidies on tractors, power tillers, rotavators, and establishment of Custom Hiring Centres",
    category: "Machinery",
    type: "Central",
    benefit: "40% to 50% machine subsidy (up to 80% for Custom Hiring)",
    eligibility: "All farmers, prioritized for small, marginal and women farmers",
    link: "https://agrimachinery.nic.in"
  },
  {
    id: "soil-health",
    name: "Soil Health Card Scheme",
    description: "Free biennial soil nutrient analysis covering 12 parameters with customized fertilizer recommendations",
    category: "Advisory",
    type: "Central",
    benefit: "Free testing & crop dosage card every 2 years",
    eligibility: "All agricultural landholders in India",
    link: "https://soilhealth.dac.gov.in"
  },
  {
    id: "rythu-bharosa",
    name: "Rythu Bharosa (Andhra Pradesh)",
    description: "₹13,500/year financial investment support for Andhra Pradesh farmers including tenant farmers",
    category: "State Support",
    type: "State",
    benefit: "₹13,500 / year input support",
    eligibility: "All landholding and documented tenant farmers in AP",
    link: "https://ysrrythubharosa.ap.gov.in"
  },
  {
    id: "rythu-bandhu",
    name: "Rythu Bandhu (Telangana)",
    description: "Direct input investment support of ₹10,000/acre/year prior to Kharif and Rabi sowing seasons",
    category: "State Support",
    type: "State",
    benefit: "₹10,000 / acre / year",
    eligibility: "All landholding farmers in Telangana state",
    link: "https://rythubandhu.telangana.gov.in"
  },
];

export default function Schemes({ t, language }) {
  const [schemes, setSchemes] = useState(ALL_SCHEMES);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeModal, setActiveModal] = useState(null);

  const categories = ["All", "Direct Benefit", "Insurance", "Loan Support", "Solar Subsidy", "Irrigation", "Machinery", "State Support"];

  const filtered = schemes.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.description.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategory === "All" || s.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <motion.div 
      className="page-container"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
    >
      {/* Visual Government Schemes Showcase Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #115e59 0%, #0d9488 50%, #14b8a6 100%)',
        borderRadius: '20px',
        overflow: 'hidden',
        boxShadow: '0 12px 30px -10px rgba(17, 94, 89, 0.4)',
        display: 'grid',
        gridTemplateColumns: '1.2fr 1fr',
        alignItems: 'center',
        marginBottom: '28px',
        color: 'white',
        border: '1px solid #5eead4'
      }}>
        <div style={{ padding: '32px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.15)', padding: '4px 12px', borderRadius: '16px', fontSize: '0.78rem', fontWeight: '700', marginBottom: '12px', backdropFilter: 'blur(4px)', color: '#99f6e4' }}>
            <Sparkles size={14} /> Ministry of Agriculture & Farmers Welfare
          </div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: '800', lineHeight: 1.2, margin: '0 0 10px 0', color: '#ffffff' }}>
            {t.schemesTitle || "Central & State Government Schemes"}
          </h1>
          <p style={{ fontSize: '0.92rem', color: '#ccfbf1', margin: '0 0 18px 0', lineHeight: 1.5 }}>
            {t.schemesSubtitle || "Discover, verify eligibility and apply for farmer-related central and state government subsidies, solar irrigation, and PM-KISAN grants."}
          </p>
          <div style={{ display: 'flex', gap: '16px', fontSize: '0.8rem', fontWeight: '600' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#99f6e4' }}>
              <ShieldCheck size={16} /> Direct Benefit Transfer (DBT)
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#99f6e4' }}>
              <Award size={16} /> Verified Portal Links
            </div>
          </div>
        </div>
        <div style={{ height: '100%', minHeight: '190px', position: 'relative' }}>
          <img 
            src="/schemes-krishi.jpg" 
            alt="Government Schemes & Krishi Seva Kendra" 
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(90deg, #115e59 0%, rgba(17,94,89,0.2) 40%, transparent 100%)'
          }} />
        </div>
      </div>

      {/* Filter and Search Bar matching screenshot */}
      <div className="as-card" style={{ padding: '20px 24px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ minWidth: '200px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '6px' }}>
              {t.postCategoryLabel || "Select Category"}
            </label>
            <select 
              className="as-select" 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div style={{ flex: 1, minWidth: '250px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '6px' }}>
              {t.searchSchemes || "Search Schemes"}
            </label>
            <div style={{ position: 'relative' }}>
              <input 
                type="text" 
                className="as-input" 
                placeholder={t.searchSchemes || "Search schemes by name or benefit..."} 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ paddingLeft: '38px' }}
              />
              <Search size={16} style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--text-muted)' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Schemes Cards List matching screenshot */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {filtered.map((item) => (
          <div 
            key={item.id} 
            className="as-card"
            style={{ 
              padding: '22px 26px', 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              flexWrap: 'wrap',
              gap: '16px',
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{ flex: 1, minWidth: '280px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <span className="badge badge-amber">{item.type}</span>
                <span className="badge badge-green">{item.category}</span>
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#14532d', marginBottom: '4px' }}>
                {item.name}
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.4' }}>
                {item.description}
              </p>
            </div>

            <button 
              className="as-btn-outline"
              onClick={() => setActiveModal(item)}
            >
              {t.viewDetails || "View Details"} <ExternalLink size={14} />
            </button>
          </div>
        ))}
      </div>

      {/* Details Modal */}
      <AnimatePresence>
        {activeModal && (
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '20px'
          }}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="as-card"
              style={{ maxWidth: '560px', width: '100%', padding: '32px' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div>
                  <span className="badge badge-green" style={{ marginBottom: '6px' }}>{activeModal.category}</span>
                  <h2 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#14532d' }}>{activeModal.name}</h2>
                </div>
                <button onClick={() => setActiveModal(null)} className="icon-btn">
                  <X size={18} />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', margin: '20px 0' }}>
                <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '12px' }}>
                  <div style={{ fontWeight: '700', fontSize: '0.85rem', color: 'var(--text-muted)' }}>{t.schemeBenefits || "KEY BENEFIT"}</div>
                  <div style={{ fontWeight: '700', fontSize: '1.05rem', color: '#15803d' }}>{activeModal.benefit}</div>
                </div>

                <div>
                  <div style={{ fontWeight: '700', fontSize: '0.85rem', color: 'var(--text-muted)' }}>{t.schemeEligibility || "ELIGIBILITY CRITERIA"}</div>
                  <div style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>{activeModal.eligibility}</div>
                </div>

                <div>
                  <div style={{ fontWeight: '700', fontSize: '0.85rem', color: 'var(--text-muted)' }}>OVERVIEW</div>
                  <div style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>{activeModal.description}</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <a 
                  href={activeModal.link} 
                  target="_blank" 
                  rel="noreferrer"
                  className="as-btn-primary"
                  style={{ flex: 1, textDecoration: 'none' }}
                >
                  {t.schemeApply || "Visit Official Portal"} <ExternalLink size={16} />
                </a>
                <button 
                  className="as-btn-outline"
                  onClick={() => setActiveModal(null)}
                >
                  {t.closeModal || "Close"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
