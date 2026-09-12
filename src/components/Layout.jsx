import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { 
  Home, Sprout, Cloud, TrendingUp, Bot, Landmark, 
  PhoneCall, Leaf, Users, User, Settings, Search, 
  Bell, Globe, LogOut, LogIn, ChevronDown, CheckCircle2,
  MapPin, Sun, BookOpen, Headphones, Sparkles, Loader2, Navigation
} from 'lucide-react';

export default function Layout({ t, language, setLanguage, user, onLogout }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [gpsLocation, setGpsLocation] = useState(() => {
    return localStorage.getItem('agri_gps_location') || 'Vijayawada, AP';
  });
  const [isLocatingGps, setIsLocatingGps] = useState(false);
  const navigate = useNavigate();

  // Automatic GPS Geolocation Detection
  useEffect(() => {
    detectLiveGPS(false);
  }, []);

  const detectLiveGPS = (isUserTriggered = false) => {
    if (!navigator.geolocation) {
      if (isUserTriggered) alert("Geolocation is not supported by your browser.");
      return;
    }

    setIsLocatingGps(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=12`,
            { headers: { 'Accept-Language': 'en' } }
          );
          if (res.ok) {
            const data = await res.json();
            const addr = data.address || {};
            const city = addr.city || addr.town || addr.village || addr.suburb || addr.county || addr.state_district;
            const state = addr.state_code || addr.state || 'India';
            
            let shortLoc = 'GPS Detected';
            if (city && state) {
              shortLoc = `${city}, ${state.length > 10 ? state.substring(0, 2).toUpperCase() : state}`;
            } else if (city) {
              shortLoc = city;
            } else if (data.display_name) {
              shortLoc = data.display_name.split(',').slice(0, 2).join(',');
            }

            setGpsLocation(shortLoc);
            localStorage.setItem('agri_gps_location', shortLoc);
          } else {
            const fallback = `Lat ${latitude.toFixed(2)}°, Lon ${longitude.toFixed(2)}°`;
            setGpsLocation(fallback);
          }
        } catch (err) {
          console.warn("GPS reverse geocode error:", err);
          const fallback = `Lat ${latitude.toFixed(2)}°, Lon ${longitude.toFixed(2)}°`;
          setGpsLocation(fallback);
        } finally {
          setIsLocatingGps(false);
        }
      },
      (error) => {
        console.warn("GPS error:", error);
        setIsLocatingGps(false);
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  const navLinks = [
    { to: "/", label: t.navHome || "Home", icon: Home },
    { to: "/chat", label: t.navChat || "AI Assistant", icon: Bot },
    { to: "/scanner", label: t.navScanner || "Plant Disease", icon: Sprout },
    { to: "/weather", label: t.navWeather || "Weather", icon: Cloud },
    { to: "/market", label: t.navMarket || "Market Prices", icon: TrendingUp },
    { to: "/schemes", label: t.navSchemes || "Government Schemes", icon: Landmark },
    { to: "/my-crops", label: t.navMyCrops || "My Crops", icon: Leaf },
    { to: "/community", label: t.navCommunity || "Community", icon: Users },
    { to: "/helpline", label: t.navHelpline || "Expert Connect", icon: Headphones },
    { to: "/my-crops", label: "Learning Hub", icon: BookOpen },
    { to: "/profile", label: t.navProfile || "Profile", icon: User },
    { to: "/settings", label: t.navSettings || "Settings", icon: Settings },
  ];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const q = searchQuery.toLowerCase();
    if (q.includes("weather") || q.includes("rain") || q.includes("temp")) {
      navigate("/weather");
    } else if (q.includes("price") || q.includes("mandi") || q.includes("market") || q.includes("paddy") || q.includes("cotton")) {
      navigate("/market");
    } else if (q.includes("scheme") || q.includes("kisan") || q.includes("subsidy") || q.includes("insurance")) {
      navigate("/schemes");
    } else if (q.includes("disease") || q.includes("leaf") || q.includes("blight") || q.includes("pest")) {
      navigate("/scanner");
    } else if (q.includes("helpline") || q.includes("call") || q.includes("expert")) {
      navigate("/helpline");
    } else {
      navigate("/chat");
    }
  };

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'te', label: 'తెలుగు' },
    { code: 'hi', label: 'हिन्दी' },
    { code: 'mr', label: 'मराठी' },
    { code: 'bn', label: 'বাংলা' },
    { code: 'gu', label: 'ગુજરાતી' },
    { code: 'kn', label: 'ಕನ್ನಡ' },
    { code: 'ml', label: 'മലയാളം' },
    { code: 'or', label: 'ଓଡ଼ିଆ' },
    { code: 'pa', label: 'ਪੰਜਾਬੀ' },
    { code: 'ta', label: 'தமிழ்' }
  ];

  return (
    <div className="app-layout" onClick={() => showProfileMenu && setShowProfileMenu(false)}>
      {/* Left Sidebar - Clear & Readable Navigation */}
      <aside className="app-sidebar" style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        height: '100vh', 
        width: '260px',
        minWidth: '260px',
        padding: '16px 14px', 
        background: '#ffffff', 
        borderRight: '1px solid #e2e8f0',
        overflow: 'hidden',
        boxSizing: 'border-box'
      }}>
        {/* Brand Logo Header */}
        <div className="sidebar-brand" onClick={() => navigate('/')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', padding: '0 8px 14px 8px', borderBottom: '1px solid #f1f5f9', flexShrink: 0 }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
            <Sprout size={22} />
          </div>
          <div>
            <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#14532d', lineHeight: 1.15 }}>AgriSathi</div>
            <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '500' }}>Farmers Today, Better Tomorrows</div>
          </div>
        </div>

        {/* Navigation Items - Bigger readable text */}
        <nav className="sidebar-nav" style={{ flex: 1, padding: '10px 0', display: 'flex', flexDirection: 'column', gap: '3px', overflowY: 'auto' }}>
          {navLinks.map((item, idx) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={idx}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '8px 12px',
                  borderRadius: '10px',
                  fontSize: '0.94rem',
                  fontWeight: isActive ? '700' : '600',
                  color: isActive ? '#ffffff' : '#334155',
                  background: isActive ? '#14532d' : 'transparent',
                  textDecoration: 'none',
                  transition: 'all 0.15s ease'
                })}
              >
                <Icon size={19} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Sidebar Footer Vertical Image Card */}
        <div style={{
          marginTop: 'auto',
          flexShrink: 0,
          position: 'relative',
          borderRadius: '12px',
          overflow: 'hidden',
          height: '80px',
          boxShadow: '0 4px 12px rgba(22, 163, 74, 0.12)',
          cursor: 'pointer'
        }} onClick={() => navigate('/my-crops')} title="Strong Farmers Stronger India">
          <img 
            src="/sidebar-plant.jpg" 
            alt="Strong Farmers" 
            style={{ width: '100%', height: '80px', objectFit: 'cover', display: 'block' }}
          />
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(20, 83, 45, 0.3) 0%, rgba(20, 83, 45, 0.92) 100%)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            padding: '8px 12px',
            color: 'white'
          }}>
            <div style={{ fontSize: '0.84rem', fontWeight: '800', lineHeight: 1.1, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span>Strong Farmers</span>
            </div>
            <div style={{ fontSize: '0.78rem', fontWeight: '800', color: '#bbf7d0' }}>
              Stronger India
            </div>
            <div style={{ fontSize: '0.62rem', fontStyle: 'italic', color: '#f0fdf4', marginTop: '2px', opacity: 0.9 }}>
              "Good Farming Brighter Tomorrows"
            </div>
          </div>
        </div>
      </aside>

      {/* Main App Window */}
      <div className="app-main" style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflowY: 'auto' }}>
        {/* Top Header Bar */}
        <header className="top-header" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 28px',
          background: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
          position: 'sticky',
          top: 0,
          zIndex: 40
        }}>
          {/* Global Search Bar */}
          <form onSubmit={handleSearchSubmit} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '8px 16px',
            width: '360px',
            maxWidth: '100%'
          }}>
            <Search size={16} color="#94a3b8" />
            <input 
              type="text" 
              placeholder={t.searchPlaceholder || "Search crops, schemes, market prices..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                border: 'none',
                background: 'transparent',
                outline: 'none',
                fontSize: '0.88rem',
                width: '100%',
                color: '#1e293b'
              }}
            />
          </form>

          {/* Header Action Badges */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* Live GPS Location Pill */}
            <div 
              onClick={() => detectLiveGPS(true)}
              title="Click to refresh live GPS location"
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '6px', 
                fontSize: '0.85rem', 
                fontWeight: '600', 
                color: '#15803d',
                background: '#f0fdf4',
                padding: '5px 12px',
                borderRadius: '20px',
                border: '1px solid #bbf7d0',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {isLocatingGps ? (
                <Loader2 size={15} color="#16a34a" className="animate-spin" />
              ) : (
                <MapPin size={15} color="#16a34a" />
              )}
              <span>{isLocatingGps ? 'Locating GPS...' : gpsLocation}</span>
            </div>

            {/* Weather Pill */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: '600', color: '#334155' }}>
              <Sun size={18} color="#eab308" />
              <span>28°C <span style={{ fontWeight: '400', color: '#64748b', fontSize: '0.78rem' }}>Partly Cloudy</span></span>
            </div>

            {/* Language Switcher */}
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <select 
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                style={{
                  background: '#14532d',
                  border: 'none',
                  borderRadius: '20px',
                  padding: '6px 14px 6px 14px',
                  fontSize: '0.82rem',
                  fontWeight: '700',
                  color: '#ffffff',
                  cursor: 'pointer',
                  outline: 'none'
                }}
              >
                <option value="te" style={{ background: 'white', color: 'black' }}>తెలుగు | English</option>
                {languages.map((l) => (
                  <option key={l.code} value={l.code} style={{ background: 'white', color: 'black' }}>{l.label}</option>
                ))}
              </select>
            </div>

            {/* Notifications */}
            <button 
              className="icon-btn" 
              title="Notifications" 
              onClick={() => alert("You have 2 notifications: Mandi prices updated for APMC Vijayawada & 5-day rain alert issued.")}
              style={{ position: 'relative', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
            >
              <Bell size={18} color="#475569" />
              <div style={{ position: 'absolute', top: '7px', right: '7px', width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444' }} />
            </button>

            {/* User Profile Pill */}
            <div 
              onClick={(e) => {
                e.stopPropagation();
                setShowProfileMenu(!showProfileMenu);
              }}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', background: '#f8fafc', padding: '4px 12px 4px 6px', borderRadius: '24px', border: '1px solid #e2e8f0' }}
            >
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" 
                alt="Ramesh Farmer" 
                style={{ width: '30px', height: '30px', borderRadius: '50%', objectFit: 'cover' }}
              />
              <div style={{ textAlign: 'left', lineHeight: 1.1 }}>
                <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#0f172a' }}>Ramesh</div>
                <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Farmer</div>
              </div>
            </div>
          </div>
        </header>

        {/* Active Page View */}
        <main style={{ flex: 1, padding: '24px 28px', background: '#f8fafc' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
