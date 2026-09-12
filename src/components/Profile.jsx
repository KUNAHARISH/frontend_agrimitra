import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  User, MapPin, Sprout, Landmark, MessageSquare, 
  Bell, Edit3, Globe, Award, CheckCircle2, LogOut, Save, X 
} from 'lucide-react';

export default function Profile({ t, user, language, onLogout, onUpdateProfile }) {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || "Ramesh Kumar",
    role: "Farmer",
    location: user?.location || "Vijayawada, Andhra Pradesh",
    farmSize: user?.farmSize || "5 Acres",
    mainCrops: Array.isArray(user?.mainCrops) ? user.mainCrops.join(', ') : (user?.mainCrops || "Paddy, Tomato, Chilli"),
    preferredLang: user?.preferredLang || "English (हिन्दी / తెలుగు)"
  });

  const handleSave = (e) => {
    e.preventDefault();
    const updated = {
      ...user,
      name: formData.name,
      location: formData.location,
      farmSize: formData.farmSize,
      mainCrops: formData.mainCrops.split(',').map(s => s.trim()),
      preferredLang: formData.preferredLang
    };

    if (onUpdateProfile) {
      onUpdateProfile(updated);
    } else {
      localStorage.setItem('agrisathi_user', JSON.stringify(updated));
    }
    setIsEditing(false);
  };

  const handleLogoutClick = () => {
    if (window.confirm("Are you sure you want to log out of AgriSathi?")) {
      if (onLogout) onLogout();
      navigate('/login');
    }
  };

  return (
    <motion.div 
      className="page-container"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
    >
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title"><User className="inline-icon" color="#16a34a" /> {t.profileTitle || "My Profile"}</h1>
        <p className="page-subtitle">View and manage your personal agricultural profile, land records, and farm preferences.</p>
      </div>

      {/* Main Profile Header Card */}
      <div className="as-card" style={{ padding: '32px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{
              width: '84px',
              height: '84px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #22c55e, #15803d)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2.2rem',
              fontWeight: '800',
              boxShadow: '0 8px 20px rgba(34, 197, 94, 0.3)'
            }}>
              👨‍🌾
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--text-main)' }}>{formData.name}</h2>
                <span className="badge badge-green"><CheckCircle2 size={12} /> Verified Farmer</span>
              </div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '2px' }}>
                Farmer • 📍 {formData.location}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              className="as-btn-outline"
              onClick={() => setIsEditing(!isEditing)}
              style={{ borderRadius: '12px' }}
            >
              {isEditing ? <><X size={16} /> {t.cancelBtn || "Cancel"}</> : <><Edit3 size={16} /> {t.editProfile || "Edit Profile"}</>}
            </button>

            <button 
              onClick={handleLogoutClick}
              className="as-btn-outline"
              style={{ borderRadius: '12px', borderColor: '#fca5a5', color: '#dc2626' }}
            >
              <LogOut size={16} /> {t.logout || "Logout"}
            </button>
          </div>
        </div>
      </div>

      {/* Farm Details Card */}
      <div className="as-card" style={{ padding: '28px', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '20px', color: 'var(--text-main)' }}>
          🌾 My Farm Details
        </h3>

        {isEditing ? (
          <form onSubmit={handleSave} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '4px' }}>Full Name</label>
              <input 
                type="text" 
                className="as-input" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '4px' }}>Farm Location</label>
              <input 
                type="text" 
                className="as-input" 
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '4px' }}>Farm Size</label>
              <input 
                type="text" 
                className="as-input" 
                value={formData.farmSize}
                onChange={(e) => setFormData({...formData, farmSize: e.target.value})}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '4px' }}>Main Crops (comma separated)</label>
              <input 
                type="text" 
                className="as-input" 
                value={formData.mainCrops}
                onChange={(e) => setFormData({...formData, mainCrops: e.target.value})}
              />
            </div>

            <div style={{ gridColumn: '1 / -1', marginTop: '10px' }}>
              <button type="submit" className="as-btn-primary" style={{ padding: '12px 28px' }}>
                <Save size={16} /> Save Changes
              </button>
            </div>
          </form>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '14px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '4px' }}>FARM LOCATION</div>
              <div style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-main)' }}>{formData.location}</div>
            </div>

            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '14px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '4px' }}>FARM SIZE</div>
              <div style={{ fontSize: '1.05rem', fontWeight: '700', color: '#15803d' }}>{formData.farmSize}</div>
            </div>

            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '14px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '4px' }}>MAIN CROPS</div>
              <div style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-main)' }}>{formData.mainCrops}</div>
            </div>

            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '14px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '4px' }}>PREFERRED LANGUAGE</div>
              <div style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-main)' }}>{formData.preferredLang}</div>
            </div>
          </div>
        )}
      </div>

      {/* 4 Summary Stats Pills */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        <div style={{ background: 'white', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '20px', textAlign: 'center', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#dcfce7', color: '#15803d', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>
            <Sprout size={24} />
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '500' }}>My Crops</div>
          <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-main)', marginTop: '2px' }}>3 Crops</div>
        </div>

        <div style={{ background: 'white', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '20px', textAlign: 'center', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#ede9fe', color: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>
            <MessageSquare size={24} />
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '500' }}>My Queries</div>
          <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-main)', marginTop: '2px' }}>12 Questions</div>
        </div>

        <div style={{ background: 'white', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '20px', textAlign: 'center', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>
            <Landmark size={24} />
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '500' }}>Saved Schemes</div>
          <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-main)', marginTop: '2px' }}>5 Schemes</div>
        </div>

        <div style={{ background: 'white', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '20px', textAlign: 'center', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#fee2e2', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>
            <Bell size={24} />
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '500' }}>Notifications</div>
          <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#ef4444', marginTop: '2px' }}>8 New</div>
        </div>
      </div>
    </motion.div>
  );
}
