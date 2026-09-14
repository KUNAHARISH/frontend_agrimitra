import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings as SettingsIcon, Globe, Bell, Shield, Smartphone, 
  MapPin, Navigation, LocateFixed, ExternalLink, CheckCircle2, 
  AlertCircle, Loader2, Compass, RefreshCw, Save
} from 'lucide-react';

export default function Settings({ t, language, setLanguage, user, onUpdateProfile }) {
  // Load saved farm location & coordinates from user prop or localStorage
  const [locationInput, setLocationInput] = useState(() => {
    return user?.location || localStorage.getItem('agrisathi_farm_location') || "Vijayawada, Krishna District, Andhra Pradesh";
  });

  const [coordinates, setCoordinates] = useState(() => {
    try {
      const savedCoords = user?.coordinates || JSON.parse(localStorage.getItem('agrisathi_farm_coords') || 'null');
      return savedCoords || { lat: 16.5062, lon: 80.6480, accuracy: 15, isGpsVerified: false };
    } catch {
      return { lat: 16.5062, lon: 80.6480, accuracy: 15, isGpsVerified: false };
    }
  });

  const [isDetecting, setIsDetecting] = useState(false);
  const [gpsStatus, setGpsStatus] = useState(null); // { type: 'loading' | 'success' | 'error', message: string }
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Sync state if user prop changes
  useEffect(() => {
    if (user?.location) {
      setLocationInput(user.location);
    }
    if (user?.coordinates) {
      setCoordinates(user.coordinates);
    }
  }, [user]);

  // GPS Geolocation Auto-Detection
  const handleDetectGPS = () => {
    if (!navigator.geolocation) {
      setGpsStatus({
        type: 'error',
        message: 'Geolocation is not supported by your browser. Please enter location manually.'
      });
      return;
    }

    setIsDetecting(true);
    setGpsStatus({
      type: 'loading',
      message: t.detectingGps || "Acquiring GPS satellite signal..."
    });

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        const newCoords = {
          lat: parseFloat(latitude.toFixed(6)),
          lon: parseFloat(longitude.toFixed(6)),
          accuracy: Math.round(accuracy),
          isGpsVerified: true,
          timestamp: new Date().toISOString()
        };

        setCoordinates(newCoords);

        // Attempt Reverse Geocoding via OpenStreetMap Nominatim
        let resolvedLocation = `Lat ${newCoords.lat}°, Lon ${newCoords.lon}°`;
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=14`,
            {
              headers: {
                'Accept-Language': language === 'en' ? 'en' : `${language},en;q=0.8`
              }
            }
          );
          if (response.ok) {
            const data = await response.json();
            const addr = data.address || {};
            const place = addr.suburb || addr.village || addr.town || addr.city || addr.county || addr.hamlet;
            const district = addr.state_district || addr.county || addr.district;
            const state = addr.state;

            const parts = [place, district, state].filter(Boolean);
            if (parts.length > 0) {
              resolvedLocation = parts.join(', ');
            } else if (data.display_name) {
              resolvedLocation = data.display_name.split(',').slice(0, 3).join(', ');
            }
          }
        } catch (err) {
          console.warn('Reverse geocoding error:', err);
        }

        setLocationInput(resolvedLocation);

        // Save coordinates & location to localStorage
        try {
          localStorage.setItem('agrisathi_farm_coords', JSON.stringify(newCoords));
          localStorage.setItem('agrisathi_farm_location', resolvedLocation);
        } catch (e) {
          console.error(e);
        }

        // Update global user profile
        if (onUpdateProfile) {
          const updatedUser = {
            ...(user || {}),
            location: resolvedLocation,
            coordinates: newCoords
          };
          onUpdateProfile(updatedUser);
        }

        setIsDetecting(false);
        setGpsStatus({
          type: 'success',
          message: `${t.gpsSuccess || "GPS location detected successfully!"} (${resolvedLocation})`
        });

        setTimeout(() => {
          setGpsStatus(null);
        }, 5000);
      },
      (error) => {
        setIsDetecting(false);
        let errorMsg = t.gpsError || "Unable to acquire GPS signal. Please check location permissions in your browser or input manually.";
        if (error.code === 1) {
          errorMsg = "Location permission was denied. Please allow location access in your browser / device settings.";
        } else if (error.code === 2) {
          errorMsg = "Position unavailable. Please ensure GPS / Location is turned on.";
        } else if (error.code === 3) {
          errorMsg = "GPS request timed out. Please try again or enter district manually.";
        }

        setGpsStatus({
          type: 'error',
          message: errorMsg
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 0
      }
    );
  };

  // Manual Location Save
  const handleSaveLocation = (e) => {
    if (e) e.preventDefault();
    if (!locationInput.trim()) return;

    try {
      localStorage.setItem('agrisathi_farm_location', locationInput.trim());
    } catch (err) {
      console.error(err);
    }

    if (onUpdateProfile) {
      const updatedUser = {
        ...(user || {}),
        location: locationInput.trim(),
        coordinates: coordinates
      };
      onUpdateProfile(updatedUser);
    }

    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
    }, 3000);
  };

  const handleClearCache = () => {
    try {
      localStorage.removeItem('agrisathi_cached_weather');
      localStorage.removeItem('agrisathi_market_cache');
      alert(t.clearCacheSuccess || "Cache cleared successfully!");
    } catch {
      alert("Cache cleared!");
    }
  };

  return (
    <motion.div 
      className="page-container"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
    >
      <div className="page-header">
        <h1 className="page-title"><SettingsIcon className="inline-icon" color="#475569" /> {t.settingsTitle || "Application Settings"}</h1>
        <p className="page-subtitle">{t.settingsSubtitle || "Configure regional language, GPS farm location, cyclone notification alerts, and offline caching."}</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '850px' }}>
        
        {/* Farm Location & GPS Detection Card */}
        <div className="as-card" style={{ borderLeft: '4px solid #16a34a' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '14px' }}>
            <div>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.15rem', color: 'var(--text-main)', margin: '0 0 4px 0' }}>
                <MapPin size={22} color="#16a34a" /> {t.farmLocationSettings || "Farm Location & GPS Detection"}
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, maxWidth: '580px' }}>
                {t.farmLocationSettingsDesc || "Use device GPS to pinpoint your farm coordinates for precision district weather, micro-climate storm alerts, and closest APMC mandi rates."}
              </p>
            </div>
            <div>
              <span 
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '4px 10px',
                  borderRadius: '20px',
                  fontSize: '0.78rem',
                  fontWeight: '600',
                  background: coordinates?.isGpsVerified ? '#dcfce7' : '#f1f5f9',
                  color: coordinates?.isGpsVerified ? '#15803d' : '#475569',
                  border: coordinates?.isGpsVerified ? '1px solid #86efac' : '1px solid #cbd5e1'
                }}
              >
                {coordinates?.isGpsVerified ? (
                  <>
                    <CheckCircle2 size={14} color="#15803d" /> {t.gpsVerifiedBadge || "GPS Verified"}
                  </>
                ) : (
                  <>
                    <Compass size={14} color="#64748b" /> {t.manualBadge || "Manual Entry"}
                  </>
                )}
              </span>
            </div>
          </div>

          {/* GPS Coordinates Live Box */}
          <div 
            style={{
              background: 'var(--bg-card-alt, #f8fafc)',
              border: '1px solid var(--border-color, #e2e8f0)',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '18px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  {t.gpsCoordinates || "GPS Coordinates"}
                </div>
                <div style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                  <LocateFixed size={18} color="#16a34a" />
                  <span>
                    {coordinates?.lat ? `${coordinates.lat.toFixed(4)}° N, ${coordinates.lon.toFixed(4)}° E` : "16.5062° N, 80.6480° E"}
                  </span>
                  {coordinates?.accuracy && (
                    <span style={{ fontSize: '0.75rem', fontWeight: '500', color: 'var(--text-muted)', background: '#e2e8f0', padding: '2px 8px', borderRadius: '6px' }}>
                      {t.gpsAccuracy || "Accuracy"}: ±{coordinates.accuracy}m
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons for GPS */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="as-btn-primary"
                  onClick={handleDetectGPS}
                  disabled={isDetecting}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 16px',
                    fontSize: '0.88rem',
                    boxShadow: '0 2px 8px rgba(22, 163, 74, 0.25)'
                  }}
                >
                  {isDetecting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>{t.detectingGps || "Detecting GPS..."}</span>
                    </>
                  ) : (
                    <>
                      <Navigation size={16} />
                      <span>{t.detectGpsBtn || "Detect Farm GPS Location"}</span>
                    </>
                  )}
                </button>

                {coordinates?.lat && coordinates?.lon && (
                  <a
                    href={`https://www.google.com/maps?q=${coordinates.lat},${coordinates.lon}`}
                    target="_blank"
                    rel="noreferrer"
                    className="as-btn-outline"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 14px',
                      fontSize: '0.85rem',
                      textDecoration: 'none'
                    }}
                    title={t.openInMaps || "View Farm on Satellite Map"}
                  >
                    <ExternalLink size={15} />
                    <span>{t.openInMaps || "View on Map"}</span>
                  </a>
                )}
              </div>
            </div>

            {/* Status messages for GPS detection */}
            <AnimatePresence>
              {gpsStatus && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  style={{
                    padding: '10px 14px',
                    borderRadius: '8px',
                    fontSize: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: gpsStatus.type === 'error' ? '#fef2f2' : gpsStatus.type === 'success' ? '#f0fdf4' : '#f0f9ff',
                    color: gpsStatus.type === 'error' ? '#991b1b' : gpsStatus.type === 'success' ? '#166534' : '#0369a1',
                    border: gpsStatus.type === 'error' ? '1px solid #fecaca' : gpsStatus.type === 'success' ? '1px solid #bbf7d0' : '1px solid #bae6fd'
                  }}
                >
                  {gpsStatus.type === 'loading' && <Loader2 size={16} className="animate-spin" />}
                  {gpsStatus.type === 'success' && <CheckCircle2 size={16} color="#16a34a" />}
                  {gpsStatus.type === 'error' && <AlertCircle size={16} color="#dc2626" />}
                  <span>{gpsStatus.message}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Manual Address Input & Save */}
          <form onSubmit={handleSaveLocation} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '0.88rem', fontWeight: '600', color: 'var(--text-main)' }}>
              {t.manualLocationLabel || "Farm Address / Village / District"}
            </label>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <input
                type="text"
                className="as-input"
                style={{ flex: 1, minWidth: '260px' }}
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
                placeholder={t.manualLocationPlaceholder || "e.g. Gollapudi, Krishna District, Andhra Pradesh"}
              />
              <button
                type="submit"
                className="as-btn-outline"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 18px',
                  fontWeight: '600'
                }}
              >
                <Save size={16} color="#16a34a" />
                <span>{t.saveLocationBtn || "Save Location"}</span>
              </button>
            </div>
            {saveSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ fontSize: '0.82rem', color: '#16a34a', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}
              >
                <CheckCircle2 size={14} /> {t.locationSavedSuccess || "Farm location updated successfully!"}
              </motion.div>
            )}
          </form>
        </div>

        {/* Language & Regional Localization Card */}
        <div className="as-card">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.1rem', marginBottom: '16px' }}>
            <Globe size={20} color="#16a34a" /> {t.languageLocalization || "Language & Regional Localization"}
          </h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <div style={{ fontWeight: '600', fontSize: '0.95rem' }}>{t.selectAppLanguage || "Select Application Language"}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Translates all advisories, market prices, and chatbot responses in real-time.</div>
            </div>
            <select 
              className="as-select" 
              value={language} 
              onChange={(e) => setLanguage(e.target.value)}
              style={{ width: '200px' }}
            >
              <option value="en">English</option>
              <option value="hi">हिन्दी (Hindi)</option>
              <option value="te">తెలుగు (Telugu)</option>
              <option value="mr">मराठी (Marathi)</option>
              <option value="bn">বাংলা (Bengali)</option>
              <option value="gu">ગુજરાતી (Gujarati)</option>
              <option value="kn">ಕನ್ನಡ (Kannada)</option>
              <option value="ml">മലയാളം (Malayalam)</option>
              <option value="or">ଓଡ଼ିଆ (Odia)</option>
              <option value="pa">ਪੰਜਾਬੀ (Punjabi)</option>
              <option value="ta">தமிழ் (Tamil)</option>
            </select>
          </div>
        </div>

        {/* Weather & Cyclone Alerts Card */}
        <div className="as-card">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.1rem', marginBottom: '16px' }}>
            <Bell size={20} color="#ea580c" /> {t.cycloneAlertToggle || "Weather & Cyclone Alerts"}
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
              <input type="checkbox" defaultChecked style={{ width: '18px', height: '18px', accentColor: '#16a34a' }} />
              <div>
                <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{t.cycloneAlertToggle || "High Wind & Cyclone Early Warnings"}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t.cycloneAlertDesc || "Receive emergency alerts when IMD issues Yellow/Orange/Red storm warnings."}</div>
              </div>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
              <input type="checkbox" defaultChecked style={{ width: '18px', height: '18px', accentColor: '#16a34a' }} />
              <div>
                <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{t.mandiAlertToggle || "Daily Rain & Mandi Rate Notifications"}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t.mandiAlertDesc || "Morning updates on your district's weather forecast and primary crop prices."}</div>
              </div>
            </label>
          </div>
        </div>

        {/* Mobile & Offline Sync Card */}
        <div className="as-card">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.1rem', marginBottom: '16px' }}>
            <Smartphone size={20} color="#0284c7" /> Mobile & Offline Sync
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
            AgriSathi caches recent advisory bulletins, weather forecasts, and offline ICAR manuals directly on your device.
          </p>
          <button className="as-btn-outline" onClick={handleClearCache} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <RefreshCw size={15} />
            <span>{t.clearCacheBtn || "Clear Local Cache & Re-sync"}</span>
          </button>
        </div>

      </div>
    </motion.div>
  );
}
