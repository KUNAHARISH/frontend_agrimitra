import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, MapPin, Sprout, Landmark, MessageSquare, 
  Bell, Edit3, Globe, Award, CheckCircle2, LogOut, Save, X,
  Navigation, LocateFixed, Loader2, Compass, ShieldCheck, RefreshCw
} from 'lucide-react';

export default function Profile({ t = {}, user, language, onLogout, onUpdateProfile }) {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isDetectingGps, setIsDetectingGps] = useState(false);
  const [gpsStatusMsg, setGpsStatusMsg] = useState(null);
  const [profilePhoto, setProfilePhoto] = useState(() => user?.profilePhoto || '');

  const [coords, setCoords] = useState(() => {
    try {
      const saved = user?.coordinates || JSON.parse(localStorage.getItem('agrisathi_farm_coords') || 'null');
      return saved || null;
    } catch {
      return null;
    }
  });

  const [formData, setFormData] = useState({
    name: user?.name || "Farmer",
    role: "Registered Farmer",
    location: user?.location || localStorage.getItem('agri_gps_location') || localStorage.getItem('agrisathi_farm_location') || "Locating via GPS...",
    farmSize: user?.farmSize || user?.farm_size || "5 Acres",
    mainCrops: Array.isArray(user?.mainCrops) ? user.mainCrops.join(', ') : (Array.isArray(user?.main_crops) ? user.main_crops.join(', ') : (user?.mainCrops || user?.main_crops || "Paddy, Tomato")),
    preferredLang: user?.preferredLang || (language === 'te' ? "తెలుగు" : language === 'hi' ? "हिन्दी" : "English")
  });

  // Sync state if user prop updates
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || prev.name,
        location: user.location || prev.location,
        farmSize: user.farmSize || user.farm_size || prev.farmSize,
        mainCrops: Array.isArray(user.mainCrops) ? user.mainCrops.join(', ') : (Array.isArray(user.main_crops) ? user.main_crops.join(', ') : (user.mainCrops || user.main_crops || prev.mainCrops))
      }));
      setProfilePhoto(user.profilePhoto || '');
    }
  }, [user]);

  const handleProfilePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = () => {
      const photo = String(reader.result);
      setProfilePhoto(photo);
      const updatedUser = { ...(user || {}), profilePhoto: photo };
      if (onUpdateProfile) onUpdateProfile(updatedUser);
      else localStorage.setItem('agrisathi_user', JSON.stringify(updatedUser));
    };
    reader.readAsDataURL(file);
  };

  const clearProfilePhoto = () => {
    setProfilePhoto('');
    const updatedUser = { ...(user || {}), profilePhoto: '' };
    if (onUpdateProfile) onUpdateProfile(updatedUser);
    else localStorage.setItem('agrisathi_user', JSON.stringify(updatedUser));
  };

  // If location is default or empty, trigger auto GPS detection once on mount
  useEffect(() => {
    const currentLoc = user?.location || formData.location;
    if (!currentLoc || currentLoc === 'Locating via GPS...' || currentLoc === 'Andhra Pradesh') {
      detectLiveGPS(false);
    }
  }, []);

  const detectLiveGPS = (isUserClick = true) => {
    if (!navigator.geolocation) {
      setGpsStatusMsg({ type: 'error', text: 'Geolocation is not supported by your browser.' });
      return;
    }

    setIsDetectingGps(true);
    setGpsStatusMsg({ type: 'loading', text: 'Connecting to GPS satellites & resolving accurate address...' });

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        const newCoords = {
          lat: parseFloat(latitude.toFixed(5)),
          lon: parseFloat(longitude.toFixed(5)),
          accuracy: Math.round(accuracy),
          timestamp: new Date().toISOString()
        };
        setCoords(newCoords);

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=14`,
            { headers: { 'Accept-Language': language === 'te' ? 'te,en;q=0.8' : language === 'hi' ? 'hi,en;q=0.8' : 'en' } }
          );

          let resolvedName = `Lat ${latitude.toFixed(2)}°, Lon ${longitude.toFixed(2)}°`;
          if (res.ok) {
            const data = await res.json();
            const addr = data.address || {};
            const place = addr.village || addr.suburb || addr.town || addr.city || addr.county || addr.hamlet;
            const district = addr.state_district || addr.district || addr.county;
            const state = addr.state || 'India';

            const parts = [place, district, state].filter(Boolean);
            if (parts.length > 0) {
              resolvedName = parts.join(', ');
            } else if (data.display_name) {
              resolvedName = data.display_name.split(',').slice(0, 3).join(', ');
            }
          }

          setFormData(prev => ({ ...prev, location: resolvedName }));
          setGpsStatusMsg({ 
            type: 'success', 
            text: `GPS locked: ±${Math.round(accuracy)}m accuracy (${resolvedName})` 
          });

          // Propagate update to parent and localStorage
          const updatedUser = {
            ...(user || {}),
            location: resolvedName,
            coordinates: newCoords
          };

          if (onUpdateProfile) {
            onUpdateProfile(updatedUser);
          } else {
            localStorage.setItem('agrisathi_user', JSON.stringify(updatedUser));
          }
          localStorage.setItem('agri_gps_location', resolvedName);
          localStorage.setItem('agrisathi_farm_coords', JSON.stringify(newCoords));

        } catch (err) {
          console.warn('GPS reverse geocode error:', err);
          const fallback = `Lat ${latitude.toFixed(3)}°, Lon ${longitude.toFixed(3)}°`;
          setFormData(prev => ({ ...prev, location: fallback }));
          setGpsStatusMsg({ type: 'success', text: `GPS coordinates locked: ${fallback}` });
        } finally {
          setIsDetectingGps(false);
        }
      },
      (err) => {
        console.warn('GPS position error:', err);
        setIsDetectingGps(false);
        setGpsStatusMsg({ 
          type: 'error', 
          text: isUserClick ? 'GPS permission denied or unavailable. Please type your location manually.' : null 
        });
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleSave = (e) => {
    e.preventDefault();
    const updated = {
      ...user,
      name: formData.name.trim(),
      location: formData.location.trim(),
      farmSize: formData.farmSize.trim(),
      mainCrops: formData.mainCrops.split(',').map(s => s.trim()).filter(Boolean),
      preferredLang: formData.preferredLang,
      profilePhoto
    };

    if (onUpdateProfile) {
      onUpdateProfile(updated);
    } else {
      localStorage.setItem('agrisathi_user', JSON.stringify(updated));
    }
    localStorage.setItem('agri_gps_location', formData.location);
    setIsEditing(false);
    setGpsStatusMsg({ type: 'success', text: 'Profile updated and saved successfully!' });
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
        <h1 className="page-title"><User className="inline-icon" color="#16a34a" /> {t.profileTitle || "My Farmer Profile"}</h1>
        <p className="page-subtitle">View and manage your real-time verified GPS location, land records, and farm preferences.</p>
      </div>

      {/* Main Profile Header Card */}
      <div className="profile-header-card as-card" style={{ padding: '32px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div className="profile-avatar" style={{
              width: '84px',
              height: '84px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #15803d, #16a34a)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2.2rem',
              fontWeight: '800',
              boxShadow: '0 8px 20px rgba(22, 163, 74, 0.25)'
            }}>
              {profilePhoto ? (
                <img src={profilePhoto} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
              ) : '👨‍🌾'}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>{formData.name}</h2>
                <span className="badge badge-green"><CheckCircle2 size={12} /> Verified Farmer</span>
              </div>
              
              {/* Dynamic Accurate Location Pill */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px', flexWrap: 'wrap' }}>
                <div style={{ 
                  color: '#15803d', 
                  fontSize: '0.92rem', 
                  fontWeight: '700',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  background: '#f0fdf4',
                  padding: '3px 10px',
                  borderRadius: '12px',
                  border: '1px solid #bbf7d0'
                }}>
                  <MapPin size={15} color="#16a34a" /> {formData.location}
                </div>

                {coords && (
                  <span style={{ fontSize: '0.75rem', color: '#64748b', background: '#f8fafc', padding: '3px 8px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    🎯 GPS: {coords.lat}°, {coords.lon}° (±{coords.accuracy}m)
                  </span>
                )}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <input
              id="profile-photo-input"
              type="file"
              accept="image/*"
              onChange={handleProfilePhotoChange}
              style={{ display: 'none' }}
            />
            <label htmlFor="profile-photo-input" className="as-btn-outline profile-photo-button" style={{ borderRadius: '12px', cursor: 'pointer' }}>
              <User size={16} /> {profilePhoto ? 'Change Photo' : 'Upload Photo'}
            </label>
            {profilePhoto && (
              <button type="button" onClick={clearProfilePhoto} className="as-btn-outline profile-photo-button" style={{ borderRadius: '12px', color: '#dc2626', borderColor: '#fca5a5' }}>
                <X size={16} /> Remove Photo
              </button>
            )}
            <button 
              type="button"
              onClick={() => detectLiveGPS(true)}
              disabled={isDetectingGps}
              className="as-btn-outline"
              style={{ borderRadius: '12px', borderColor: '#16a34a', color: '#15803d', background: '#f0fdf4' }}
              title="Detect accurate current farm location using device GPS"
            >
              {isDetectingGps ? (
                <><Loader2 size={16} className="animate-spin" /> Detecting GPS...</>
              ) : (
                <><LocateFixed size={16} color="#16a34a" /> Live GPS Sync</>
              )}
            </button>

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

        {/* GPS Status feedback message */}
        <AnimatePresence>
          {gpsStatusMsg && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{
                marginTop: '16px',
                padding: '10px 14px',
                borderRadius: '10px',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: gpsStatusMsg.type === 'error' ? '#fee2e2' : '#f0fdf4',
                color: gpsStatusMsg.type === 'error' ? '#b91c1c' : '#15803d',
                border: `1px solid ${gpsStatusMsg.type === 'error' ? '#fca5a5' : '#bbf7d0'}`
              }}
            >
              {gpsStatusMsg.type === 'loading' ? <Loader2 size={16} className="animate-spin" /> : <ShieldCheck size={16} />}
              <span>{gpsStatusMsg.text}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Farm Details Card */}
      <div className="as-card" style={{ padding: '28px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
            🌾 My Farm & Agricultural Land Details
          </h3>
          {!isEditing && (
            <span style={{ fontSize: '0.8rem', color: '#16a34a', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }} onClick={() => setIsEditing(true)}>
              <Edit3 size={14} /> Edit Details
            </span>
          )}
        </div>

        {isEditing ? (
          <form className="profile-edit-form" onSubmit={handleSave} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '4px' }}>Full Name</label>
              <input 
                type="text" 
                required
                className="as-input" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)' }}>Farm Location (Village, District, State)</label>
                <span 
                  onClick={() => detectLiveGPS(true)} 
                  style={{ fontSize: '0.75rem', color: '#16a34a', cursor: 'pointer', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '2px' }}
                >
                  <LocateFixed size={12} /> Auto GPS
                </span>
              </div>
              <input 
                type="text" 
                required
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
                placeholder="e.g. 5 Acres"
                value={formData.farmSize}
                onChange={(e) => setFormData({...formData, farmSize: e.target.value})}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '4px' }}>Main Crops (comma separated)</label>
              <input 
                type="text" 
                className="as-input" 
                placeholder="e.g. Paddy, Tomato, Chilli"
                value={formData.mainCrops}
                onChange={(e) => setFormData({...formData, mainCrops: e.target.value})}
              />
            </div>

            <div style={{ gridColumn: '1 / -1', marginTop: '10px', display: 'flex', gap: '10px' }}>
              <button type="submit" className="as-btn-primary" style={{ padding: '12px 28px' }}>
                <Save size={16} /> Save Profile Changes
              </button>
              <button type="button" onClick={() => setIsEditing(false)} className="as-btn-outline" style={{ padding: '12px 20px' }}>
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="profile-details-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '14px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>
                📍 Real-Time Farm Location
              </div>
              <div style={{ fontSize: '1.05rem', fontWeight: '800', color: '#14532d' }}>{formData.location}</div>
              {coords && (
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>
                  Lat: {coords.lat}°, Lon: {coords.lon}°
                </div>
              )}
            </div>

            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '14px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>
                🚜 Farm Landholding
              </div>
              <div style={{ fontSize: '1.05rem', fontWeight: '800', color: '#15803d' }}>{formData.farmSize}</div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>Irrigated Agriculture Land</div>
            </div>

            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '14px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>
                🌱 Active Crops
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: '800', color: 'var(--text-main)' }}>{formData.mainCrops}</div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>Monitored for Mandi & Diseases</div>
            </div>

            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '14px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>
                🌐 Preferred Language
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: '800', color: 'var(--text-main)' }}>{formData.preferredLang}</div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>Multi-lingual Voice & AI Assistant</div>
            </div>
          </div>
        )}
      </div>

      {/* 4 Summary Stats Pills */}
      <div className="profile-stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        <div 
          onClick={() => navigate('/my-crops')}
          style={{ background: 'white', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '20px', textAlign: 'center', boxShadow: 'var(--shadow-sm)', cursor: 'pointer', transition: 'all 0.2s ease' }}
          onMouseEnter={(e) => e.currentTarget.style.borderColor = '#16a34a'}
          onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}
        >
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#dcfce7', color: '#15803d', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>
            <Sprout size={24} />
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>My Crops</div>
          <div style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--text-main)', marginTop: '2px' }}>
            {formData.mainCrops.split(',').length} Active Crops
          </div>
        </div>

        <div 
          onClick={() => navigate('/chat')}
          style={{ background: 'white', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '20px', textAlign: 'center', boxShadow: 'var(--shadow-sm)', cursor: 'pointer', transition: 'all 0.2s ease' }}
          onMouseEnter={(e) => e.currentTarget.style.borderColor = '#7c3aed'}
          onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}
        >
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#ede9fe', color: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>
            <MessageSquare size={24} />
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>AI Consultations</div>
          <div style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--text-main)', marginTop: '2px' }}>Ask AgriSathi AI</div>
        </div>

        <div 
          onClick={() => navigate('/schemes')}
          style={{ background: 'white', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '20px', textAlign: 'center', boxShadow: 'var(--shadow-sm)', cursor: 'pointer', transition: 'all 0.2s ease' }}
          onMouseEnter={(e) => e.currentTarget.style.borderColor = '#0284c7'}
          onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}
        >
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>
            <Landmark size={24} />
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>Govt Schemes</div>
          <div style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--text-main)', marginTop: '2px' }}>Check Eligibility</div>
        </div>

        <div 
          onClick={() => navigate('/weather')}
          style={{ background: 'white', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '20px', textAlign: 'center', boxShadow: 'var(--shadow-sm)', cursor: 'pointer', transition: 'all 0.2s ease' }}
          onMouseEnter={(e) => e.currentTarget.style.borderColor = '#0284c7'}
          onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}
        >
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>
            <MapPin size={24} />
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>Local Forecast</div>
          <div style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--text-main)', marginTop: '2px' }}>Live IMD Telemetry</div>
        </div>
      </div>
    </motion.div>
  );
}
