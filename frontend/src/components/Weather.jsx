import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Cloud, CloudRain, Sun, Wind, Droplets, AlertTriangle, 
  MapPin, CheckCircle2, ChevronRight, RefreshCw, Calendar, 
  Compass, ArrowUpRight, ShieldCheck, Thermometer, Info, Eye,
  ShieldAlert, Sparkles, Gauge, Activity, Lightbulb, Sprout
} from 'lucide-react';
import { apiFetch } from '../config';

const FALLBACK_STATES = {
  "Andhra Pradesh": ["Anantapur", "Chittoor", "East Godavari", "Guntur", "Krishna", "Kurnool", "Nellore", "Prakasam", "Srikakulam", "Visakhapatnam", "Vizianagaram", "West Godavari", "YSR Kadapa"],
  "Telangana": ["Adilabad", "Hyderabad", "Karimnagar", "Khammam", "Mahabubnagar", "Medak", "Nalgonda", "Nizamabad", "Warangal"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Cuddalore", "Dindigul", "Erode", "Madurai", "Nagapattinam", "Salem", "Thanjavur", "Tiruchirappalli"],
  "Karnataka": ["Belagavi", "Bengaluru", "Bellary", "Bidar", "Dharwad", "Gulbarga", "Hassan", "Mandya", "Mysore", "Raichur", "Shimoga", "Tumakuru"],
  "Maharashtra": ["Ahmednagar", "Akola", "Amravati", "Aurangabad", "Jalgaon", "Kolhapur", "Latur", "Nagpur", "Nashik", "Pune", "Solapur"],
  "Punjab": ["Amritsar", "Bathinda", "Firozpur", "Gurdaspur", "Hoshiarpur", "Jalandhar", "Ludhiana", "Patiala", "Sangrur"],
  "Haryana": ["Ambala", "Bhiwani", "Faridabad", "Gurugram", "Hisar", "Karnal", "Kurukshetra", "Panipat", "Rohtak", "Sirsa"],
  "Uttar Pradesh": ["Agra", "Aligarh", "Bareilly", "Gorakhpur", "Jhansi", "Kanpur", "Lucknow", "Meerut", "Moradabad", "Prayagraj", "Varanasi"],
  "Madhya Pradesh": ["Bhopal", "Dewas", "Gwalior", "Hoshangabad", "Indore", "Jabalpur", "Rewa", "Sagar", "Sehore", "Ujjain", "Vidisha"],
  "Gujarat": ["Ahmedabad", "Amreli", "Banaskantha", "Bhavnagar", "Jamnagar", "Junagadh", "Mehsana", "Rajkot", "Surat", "Vadodara"],
  "Rajasthan": ["Ajmer", "Alwar", "Bikaner", "Hanumangarh", "Jaipur", "Jodhpur", "Kota", "Sri Ganganagar", "Udaipur"],
  "Bihar": ["Begusarai", "Bhagalpur", "Darbhanga", "Gaya", "Muzaffarpur", "Patna", "Purnia", "Samastipur", "East Champaran"],
  "West Bengal": ["Bankura", "Bardhaman", "Birbhum", "Cooch Behar", "Darjeeling", "Hooghly", "Kolkata", "Murshidabad", "Nadia", "Purulia"],
  "Odisha": ["Balasore", "Bhadrak", "Cuttack", "Ganjam", "Khurda", "Puri", "Sambalpur"],
  "Kerala": ["Alappuzha", "Ernakulam", "Idukki", "Kottayam", "Kozhikode", "Palakkad", "Thrissur", "Wayanad"]
};

export default function Weather({ t, language, user }) {
  const [locations, setLocations] = useState(FALLBACK_STATES);
  
  // Resolve initial state & district from user context / GPS storage or fallback
  const getInitialLocation = () => {
    const loc = user?.location || localStorage.getItem('agri_gps_location') || localStorage.getItem('agrisathi_farm_location') || "Krishna, Andhra Pradesh";
    const locLower = loc.toLowerCase();
    
    // Check known states
    for (const [st, dists] of Object.entries(FALLBACK_STATES)) {
      if (locLower.includes(st.toLowerCase())) {
        for (const dist of dists) {
          if (locLower.includes(dist.toLowerCase())) {
            return { state: st, district: dist };
          }
        }
        return { state: st, district: dists[0] || 'Krishna' };
      }
    }
    return { state: "Andhra Pradesh", district: "Krishna" };
  };

  const initialLoc = getInitialLocation();
  const [selectedState, setSelectedState] = useState(initialLoc.state);
  const [city, setCity] = useState(initialLoc.district);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch all 36 Indian states & districts on mount
  useEffect(() => {
    const loadGeo = async () => {
      try {
        const res = await apiFetch('/api/states-districts');
        if (res.ok) {
          const json = await res.json();
          if (json && Object.keys(json).length > 0) {
            setLocations(json);
          }
        }
      } catch {
        // Fallback to FALLBACK_STATES
      }
    };
    loadGeo();
    // Auto-fetch weather immediately on mount for initial district
    fetchWeather(initialLoc.state, initialLoc.district, language);
  }, []);

  const fetchWeather = async (stateName, cityName, lang) => {
    if (!stateName || !cityName) return;
    setLoading(true);
    try {
      const res = await apiFetch(`/api/weather/${encodeURIComponent(stateName)}/${encodeURIComponent(cityName)}?lang=${lang || 'en'}`);
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error("Failed to fetch weather data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedState && city) {
      fetchWeather(selectedState, city, language);
    }
  }, [language]);

  const handleStateChange = (e) => {
    const newState = e.target.value;
    setSelectedState(newState);
    const distList = locations[newState] || FALLBACK_STATES[newState] || [];
    const defaultDist = distList[0] || '';
    setCity(defaultDist);
    if (defaultDist) {
      fetchWeather(newState, defaultDist, language);
    } else {
      setData(null);
    }
  };

  const handleCityChange = (e) => {
    const newCity = e.target.value;
    setCity(newCity);
    if (newCity && selectedState) {
      fetchWeather(selectedState, newCity, language);
    }
  };

  // Helper for cyclone alert styling
  const getAlertBadge = (level) => {
    switch (level) {
      case 'RED':
        return { bg: 'rgba(239, 68, 68, 0.15)', border: '#ef4444', text: '#f87171', icon: ShieldAlert };
      case 'ORANGE':
        return { bg: 'rgba(249, 115, 22, 0.15)', border: '#f97316', text: '#fb923c', icon: AlertTriangle };
      case 'YELLOW':
        return { bg: 'rgba(234, 179, 8, 0.15)', border: '#eab308', text: '#fde047', icon: AlertTriangle };
      default:
        return { bg: 'rgba(16, 185, 129, 0.15)', border: '#10b981', text: '#34d399', icon: CheckCircle2 };
    }
  };

  const cycloneStyle = data?.cyclone_alert ? getAlertBadge(data.cyclone_alert.level) : getAlertBadge('GREEN');
  const AlertIcon = cycloneStyle.icon;

  return (
    <motion.div 
      className="page-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      {/* Visual Weather & Cyclone Telemetry Showcase Banner */}
      <div className="weather-hero" style={{
        background: 'linear-gradient(135deg, #0c4a6e 0%, #0369a1 50%, #0284c7 100%)',
        borderRadius: '20px',
        overflow: 'hidden',
        boxShadow: '0 12px 30px -10px rgba(12, 74, 110, 0.4)',
        display: 'grid',
        gridTemplateColumns: '1.2fr 1fr',
        alignItems: 'center',
        marginBottom: '28px',
        color: 'white',
        border: '1px solid #38bdf8'
      }}>
        <div style={{ padding: '32px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.15)', padding: '4px 12px', borderRadius: '16px', fontSize: '0.78rem', fontWeight: '700', marginBottom: '12px', backdropFilter: 'blur(4px)', color: '#bae6fd' }}>
            <Sparkles size={14} /> IMD Doppler Radar & Cyclone Tracking
          </div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: '800', lineHeight: 1.2, margin: '0 0 10px 0', color: '#ffffff' }}>
            {t.weatherTitle || "District Weather & Cyclone Advisory"}
          </h1>
          <p style={{ fontSize: '0.92rem', color: '#e0f2fe', margin: '0 0 18px 0', lineHeight: 1.5 }}>
            {t.weatherSubtitle || "Real-time rainfall telemetry, cyclone gale warnings, and hyper-local farm action plans across all Indian districts."}
          </p>
          <div style={{ display: 'flex', gap: '16px', fontSize: '0.8rem', fontWeight: '600' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#bae6fd' }}>
              <CloudRain size={16} /> Live Precipitation Radar
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#bae6fd' }}>
              <ShieldAlert size={16} /> 5-Day Farm Risk Index
            </div>
          </div>
        </div>
        <div style={{ height: '100%', minHeight: '190px', position: 'relative' }}>
          <img 
            src="/weather-radar.jpg" 
            alt="Doppler Weather Radar" 
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(90deg, #0c4a6e 0%, rgba(12,74,110,0.2) 40%, transparent 100%)'
          }} />
        </div>
      </div>

      {/* District & State Selector */}
      <div className="weather-location-panel glass-panel" style={{ padding: '24px', marginBottom: '30px' }}>
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: 1, minWidth: '240px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: '500' }}>
              <MapPin size={16} style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '6px' }}/> 
              {t.selectState || 'Select State'}
            </label>
            <select
              className="lang-select"
              value={selectedState}
              onChange={handleStateChange}
              style={{ width: '100%', padding: '12px 16px', fontSize: '1rem', borderRadius: '12px' }}
            >
              <option value="" disabled>{t.selectState || 'Choose Indian State...'}</option>
              {Object.keys(locations).sort().map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div style={{ flex: 1, minWidth: '240px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: '500' }}>
              <MapPin size={16} style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '6px' }}/> 
              {t.selectDistrict || 'Select District / City'}
            </label>
            <select
              className="lang-select"
              value={city}
              onChange={handleCityChange}
              disabled={!selectedState}
              style={{ 
                width: '100%', 
                padding: '12px 16px', 
                fontSize: '1rem', 
                borderRadius: '12px',
                opacity: !selectedState ? 0.5 : 1,
                cursor: !selectedState ? 'not-allowed' : 'pointer'
              }}
            >
              <option value="" disabled>{t.selectDistrict || 'Choose District...'}</option>
              {selectedState && locations[selectedState] && locations[selectedState].map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {selectedState && city && (
            <button
              onClick={() => fetchWeather(selectedState, city, language)}
              className="action-btn"
              style={{
                marginTop: '26px',
                padding: '12px 20px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.15)',
                color: 'white',
                borderRadius: '12px',
                cursor: 'pointer'
              }}
            >
              <RefreshCw size={16} className={loading ? "spin" : ""} /> {t.refreshWeather || 'Refresh'}
            </button>
          )}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="glass-panel" style={{ padding: '40px' }}>
            <div className="skeleton-line" style={{ height: '60px', width: '35%', marginBottom: '20px' }}></div>
            <div className="skeleton-line" style={{ height: '24px', width: '80%', marginBottom: '12px' }}></div>
            <div className="skeleton-line" style={{ height: '24px', width: '65%' }}></div>
          </motion.div>
        ) : data ? (
          <motion.div 
            key="data" 
            initial={{ opacity: 0, scale: 0.98 }} 
            animate={{ opacity: 1, scale: 1 }} 
            exit={{ opacity: 0 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
          >
            {/* 1. Cyclone & Severe Weather Alert Banner */}
            {data.cyclone_alert && (
              <div style={{
                background: cycloneStyle.bg,
                border: `1.5px solid ${cycloneStyle.border}`,
                borderRadius: '16px',
                padding: '20px 24px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '16px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
              }}>
                <AlertIcon size={32} color={cycloneStyle.border} style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: cycloneStyle.text, marginBottom: '6px' }}>
                    {data.cyclone_alert.title}
                  </div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.5' }}>
                    {data.cyclone_alert.description}
                  </div>
                </div>
              </div>
            )}

            {/* 2. Main Weather & Rain Telemetry Overview */}
            <div className="weather-overview glass-panel" style={{ padding: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '24px', alignItems: 'center' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '16px' }}>
                    <span style={{ fontSize: '4.2rem', fontWeight: '800', lineHeight: '1', color: 'var(--text-main)' }}>
                      {data.temp}
                    </span>
                    <span style={{ fontSize: '1.5rem', color: '#10b981', fontWeight: '600' }}>
                      {data.condition}
                    </span>
                  </div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginTop: '6px' }}>
                    📍 {data.district}, {data.state}
                  </div>
                </div>

                {/* Grid of Key Telemetry Cards */}
                <div className="weather-telemetry-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '14px', flex: 1, maxWidth: '650px' }}>
                  {/* Rain Amount */}
                  <div style={{ background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.25)', padding: '16px', borderRadius: '16px', textAlign: 'center' }}>
                    <CloudRain size={26} color="#3b82f6" style={{ margin: '0 auto 6px' }} />
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{t.rainfallMm || 'Rainfall'}</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: '700', color: '#60a5fa' }}>{data.rainfall_mm || '0.0 mm'}</div>
                  </div>

                  {/* Rain Probability */}
                  <div style={{ background: 'rgba(14, 165, 233, 0.1)', border: '1px solid rgba(14, 165, 233, 0.25)', padding: '16px', borderRadius: '16px', textAlign: 'center' }}>
                    <Droplets size={26} color="#0ea5e9" style={{ margin: '0 auto 6px' }} />
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{t.rainIntensity || 'Rain Chance'}</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: '700', color: '#38bdf8' }}>{data.rain_chance || '0%'}</div>
                  </div>

                  {/* Wind & Gusts */}
                  <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.25)', padding: '16px', borderRadius: '16px', textAlign: 'center' }}>
                    <Wind size={26} color="#10b981" style={{ margin: '0 auto 6px' }} />
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{t.windSpeed || 'Wind'}</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: '700', color: '#34d399' }}>{data.wind}</div>
                  </div>

                  {/* Humidity */}
                  <div style={{ background: 'rgba(168, 85, 247, 0.1)', border: '1px solid rgba(168, 85, 247, 0.25)', padding: '16px', borderRadius: '16px', textAlign: 'center' }}>
                    <Gauge size={26} color="#a855f7" style={{ margin: '0 auto 6px' }} />
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{t.humidity || 'Humidity'}</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: '700', color: '#c084fc' }}>{data.humidity || data.pressure || '65%'}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Farm Actions Checklist (Rain & Cyclone Preparedness) */}
            {data.farm_actions && (
              <div className="weather-actions-panel glass-panel" style={{ padding: '28px' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.2rem', marginBottom: '20px', color: 'var(--text-main)' }}>
                  <Activity size={22} color="#10b981" /> {t.farmActionPlan || 'Agricultural Rain & Weather Action Plan'}
                </h3>
                <div className="weather-actions-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                  <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '16px' }}>
                    <div style={{ color: '#60a5fa', fontWeight: '600', marginBottom: '6px', fontSize: '0.95rem' }}>🚜 {t.drainageAdvise || 'Field Drainage'}</div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.4' }}>{data.farm_actions.drainage}</div>
                  </div>

                  <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '16px' }}>
                    <div style={{ color: '#34d399', fontWeight: '600', marginBottom: '6px', fontSize: '0.95rem' }}>🧪 {t.sprayingAdvise || 'Spraying Window'}</div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.4' }}>{data.farm_actions.spraying}</div>
                  </div>

                  <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '16px' }}>
                    <div style={{ color: '#38bdf8', fontWeight: '600', marginBottom: '6px', fontSize: '0.95rem' }}>💧 {t.irrigationAdvise || 'Irrigation Adjustment'}</div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.4' }}>{data.farm_actions.irrigation}</div>
                  </div>

                  <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '16px' }}>
                    <div style={{ color: '#fbbf24', fontWeight: '600', marginBottom: '6px', fontSize: '0.95rem' }}>🌾 {t.harvestAdvise || 'Harvest & Storage'}</div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.4' }}>{data.farm_actions.harvesting}</div>
                  </div>
                </div>
              </div>
            )}

            {/* 4. AI Agro-Meteorologist Risk & Advisory */}
            <div className="weather-risk-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
              <div style={{ background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.25)', padding: '24px', borderRadius: '18px' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#f87171', marginBottom: '12px', fontSize: '1.1rem' }}>
                  <AlertTriangle size={22} /> {t.cycloneAlert || 'Crop Risk Assessment'}
                </h3>
                <p style={{ color: 'var(--text-main)', lineHeight: '1.6', fontSize: '0.95rem' }}>{data.risk}</p>
              </div>
              
              <div style={{ background: 'rgba(59, 130, 246, 0.08)', border: '1px solid rgba(59, 130, 246, 0.25)', padding: '24px', borderRadius: '18px' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#60a5fa', marginBottom: '12px', fontSize: '1.1rem' }}>
                  <Lightbulb size={22} /> {t.farmActionPlan || 'Expert IMD Advisory'}
                </h3>
                <p style={{ color: 'var(--text-main)', lineHeight: '1.6', fontSize: '0.95rem' }}>{data.advisory}</p>
              </div>
            </div>

            {/* 5. 5-Day Detailed Rain & Weather Timeline */}
            {data.forecast_days && data.forecast_days.length > 0 && (
              <div className="weather-forecast-panel glass-panel" style={{ padding: '28px' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', fontSize: '1.2rem' }}>
                  <Calendar size={22} color="#60a5fa" /> {t.fiveDayForecast || '5-Day Rain & Temperature Timeline'}
                </h3>
                <div className="weather-forecast-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px' }}>
                  {data.forecast_days.map((item, idx) => (
                    <div key={idx} style={{
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '16px',
                      padding: '18px 14px',
                      textAlign: 'center',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px'
                    }}>
                      <div style={{ color: 'var(--text-muted)', fontWeight: '600', fontSize: '0.9rem' }}>{item.day}</div>
                      <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: 'var(--text-main)' }}>{item.temp}</div>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{item.condition}</div>
                      <div style={{
                        marginTop: '6px',
                        padding: '4px 8px',
                        background: 'rgba(59, 130, 246, 0.15)',
                        borderRadius: '8px',
                        color: '#60a5fa',
                        fontSize: '0.8rem',
                        fontWeight: '600'
                      }}>
                        🌧️ {item.rain_mm} ({item.rain_chance})
                      </div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>💨 {item.wind}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 6. Suggested Crops */}
            {data.suggested_crops && data.suggested_crops.length > 0 && (
              <div className="glass-panel" style={{ padding: '24px' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', fontSize: '1.1rem' }}>
                  <Sprout size={20} color="#10b981" /> {t.farmerName ? (t.featurePlantDiseaseTitle || 'Suggested Crops') : 'Suggested Crops for Current District Climate'}
                </h3>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  {data.suggested_crops.map((crop, i) => (
                    <span key={i} style={{
                      background: 'linear-gradient(135deg, #10b981, #059669)',
                      color: 'white',
                      padding: '8px 18px',
                      borderRadius: '24px',
                      fontWeight: '600',
                      fontSize: '0.95rem',
                      boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)'
                    }}>
                      {crop}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-panel" style={{ padding: '60px', textAlign: 'center' }}>
            <Cloud size={64} style={{ color: 'var(--text-muted)', marginBottom: '20px', opacity: 0.5 }} />
            <h2 style={{ color: 'var(--text-secondary)' }}>{t.selectState || 'Select Any Indian State & District'}</h2>
            <p style={{ color: 'var(--text-muted)' }}>{t.weatherSubtitle || 'Choose any of the 36 States/UTs to view live rainfall amounts, cyclone gale warnings, and crop action plans.'}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
