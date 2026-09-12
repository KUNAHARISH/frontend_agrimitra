import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, CloudRain, TrendingUp, Landmark, Sprout, Headphones, 
  CheckCheck, Trash2, X, ChevronRight, AlertTriangle, Info, 
  ExternalLink, Settings, ShieldCheck, Sparkles 
} from 'lucide-react';

const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif-1',
    category: 'weather',
    type: 'alert',
    title: 'IMD Heavy Rainfall & Wind Advisory',
    message: 'IMD issues Orange alert: 60-80mm rain and gusty winds (45km/h) expected in your district over the next 36 hours. Ensure field drainage channels are clear.',
    time: '15 mins ago',
    unread: true,
    link: '/weather',
    icon: CloudRain,
    color: '#0284c7',
    badge: 'Weather Alert'
  },
  {
    id: 'notif-2',
    category: 'market',
    type: 'success',
    title: 'Tomato & Paddy Mandi Rates Surge (+14%)',
    message: 'Vijayawada APMC reports Tomato prices up to ₹2,850/Quintal (+14%) and Samba Mahsuri Paddy trading firmly at ₹2,320/Quintal.',
    time: '1 hour ago',
    unread: true,
    link: '/market',
    icon: TrendingUp,
    color: '#16a34a',
    badge: 'Mandi Rates'
  },
  {
    id: 'notif-3',
    category: 'crop',
    type: 'warning',
    title: 'Paddy Blast & Leaf Spot Risk Warning',
    message: 'Continuous high humidity (88%) creates high risk for Paddy Leaf Blast. Scan affected leaves with AI Vision scanner for instant remedy.',
    time: '3 hours ago',
    unread: true,
    link: '/scanner',
    icon: Sprout,
    color: '#d97706',
    badge: 'Crop Advisory'
  },
  {
    id: 'notif-4',
    category: 'scheme',
    type: 'info',
    title: 'PM-Kisan 17th Installment DBT Released',
    message: 'Direct benefit transfer of ₹2,000 processed to registered Aadhaar-linked farmer bank accounts. Verify your e-KYC status now.',
    time: 'Yesterday',
    unread: false,
    link: '/schemes',
    icon: Landmark,
    color: '#7c3aed',
    badge: 'Govt Scheme'
  },
  {
    id: 'notif-5',
    category: 'helpline',
    type: 'info',
    title: 'Kisan Call Centre 24x7 Line Active',
    message: 'Free agronomist telephone advice available in Telugu, Hindi & English on toll-free 1800-180-1551.',
    time: '2 days ago',
    unread: false,
    link: '/helpline',
    icon: Headphones,
    color: '#059669',
    badge: 'Helpline'
  }
];

export default function NotificationCenter({ isOpen, onClose, t = {} }) {
  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem('agrisathi_notifications');
      return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  });

  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    try {
      localStorage.setItem('agrisathi_notifications', JSON.stringify(notifications));
    } catch (e) {
      console.warn('Failed saving notifications to localStorage:', e);
    }
  }, [notifications]);

  const unreadCount = notifications.filter(n => n.unread).length;

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const markSingleAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n));
  };

  const deleteNotification = (e, id) => {
    e.stopPropagation();
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const resetSampleNotifications = () => {
    setNotifications(INITIAL_NOTIFICATIONS);
  };

  const handleNotificationClick = (notif) => {
    markSingleAsRead(notif.id);
    onClose();
    if (notif.link) {
      navigate(notif.link);
    }
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'all') return true;
    if (filter === 'unread') return n.unread;
    return n.category === filter;
  });

  if (!isOpen) return null;

  return (
    <div 
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999,
        background: 'rgba(15, 23, 42, 0.4)',
        backdropFilter: 'blur(3px)',
        display: 'flex',
        justifyContent: 'flex-end'
      }}
    >
      <motion.div
        initial={{ opacity: 0, x: 50, scale: 0.98 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, x: 50, scale: 0.98 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '460px',
          height: '100vh',
          background: '#ffffff',
          boxShadow: '-10px 0 30px rgba(0,0,0,0.15)',
          display: 'flex',
          flexDirection: 'column',
          borderLeft: '1px solid #e2e8f0'
        }}
      >
        {/* Header */}
        <div style={{
          padding: '20px 24px 16px',
          borderBottom: '1px solid #f1f5f9',
          background: 'linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '12px',
                background: '#dcfce7',
                color: '#16a34a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Bell size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#14532d', margin: 0, lineHeight: 1.2 }}>
                  Farm Notifications
                </h3>
                <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                  {unreadCount > 0 ? `${unreadCount} new agricultural alerts` : 'All alerts up to date'}
                </span>
              </div>
            </div>

            <button 
              onClick={onClose}
              className="icon-btn"
              style={{ width: '34px', height: '34px', borderRadius: '50%', background: '#f1f5f9' }}
              title="Close Panel"
            >
              <X size={18} color="#64748b" />
            </button>
          </div>

          {/* Quick Actions Bar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '12px' }}>
            {unreadCount > 0 ? (
              <button
                onClick={markAllAsRead}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'transparent',
                  border: 'none',
                  color: '#16a34a',
                  fontSize: '0.8rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  padding: '4px 8px',
                  borderRadius: '6px'
                }}
              >
                <CheckCheck size={15} /> Mark all as read
              </button>
            ) : <div />}

            {notifications.length > 0 && (
              <button
                onClick={clearAllNotifications}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  background: 'transparent',
                  border: 'none',
                  color: '#94a3b8',
                  fontSize: '0.78rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  padding: '4px 8px',
                  borderRadius: '6px'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#ef4444'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}
              >
                <Trash2 size={13} /> Clear all
              </button>
            )}
          </div>

          {/* Category Filter Chips */}
          <div style={{ 
            display: 'flex', 
            gap: '6px', 
            marginTop: '12px', 
            overflowX: 'auto', 
            paddingBottom: '4px',
            scrollbarWidth: 'none'
          }}>
            {[
              { id: 'all', label: 'All', count: notifications.length },
              { id: 'unread', label: 'Unread', count: unreadCount },
              { id: 'weather', label: 'Weather 🌧️' },
              { id: 'market', label: 'Mandi 📈' },
              { id: 'crop', label: 'Crops 🌿' },
              { id: 'scheme', label: 'Schemes 🏛️' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                style={{
                  whiteSpace: 'nowrap',
                  padding: '5px 12px',
                  borderRadius: '20px',
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  background: filter === tab.id ? '#16a34a' : '#f1f5f9',
                  color: filter === tab.id ? '#ffffff' : '#475569'
                }}
              >
                {tab.label} {tab.count !== undefined && tab.count > 0 && `(${tab.count})`}
              </button>
            ))}
          </div>
        </div>

        {/* Notification List Scroll Area */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <AnimatePresence>
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((n) => {
                const IconComp = n.icon || Bell;
                return (
                  <motion.div
                    key={n.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    onClick={() => handleNotificationClick(n)}
                    style={{
                      background: n.unread ? '#f0fdf4' : '#ffffff',
                      border: n.unread ? '1.5px solid #bbf7d0' : '1px solid #e2e8f0',
                      borderRadius: '16px',
                      padding: '14px',
                      cursor: 'pointer',
                      position: 'relative',
                      boxShadow: n.unread ? '0 4px 12px rgba(22, 163, 74, 0.08)' : '0 1px 3px rgba(0,0,0,0.04)',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#16a34a';
                      e.currentTarget.style.transform = 'translateY(-1px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = n.unread ? '#bbf7d0' : '#e2e8f0';
                      e.currentTarget.style.transform = 'none';
                    }}
                  >
                    <div style={{ display: 'flex', gap: '12px' }}>
                      {/* Category Icon */}
                      <div style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '10px',
                        background: `${n.color}15`,
                        color: n.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        marginTop: '2px'
                      }}>
                        <IconComp size={20} />
                      </div>

                      {/* Content */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '4px' }}>
                          <span style={{
                            fontSize: '0.68rem',
                            fontWeight: '800',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                            color: n.color,
                            background: `${n.color}15`,
                            padding: '2px 8px',
                            borderRadius: '6px'
                          }}>
                            {n.badge}
                          </span>
                          <span style={{ fontSize: '0.72rem', color: '#94a3b8', whiteSpace: 'nowrap' }}>
                            {n.time}
                          </span>
                        </div>

                        <h4 style={{ 
                          fontSize: '0.92rem', 
                          fontWeight: n.unread ? '800' : '700', 
                          color: '#0f172a', 
                          margin: '0 0 4px 0',
                          lineHeight: 1.3
                        }}>
                          {n.title}
                        </h4>

                        <p style={{ 
                          fontSize: '0.8rem', 
                          color: '#475569', 
                          margin: 0, 
                          lineHeight: 1.45 
                        }}>
                          {n.message}
                        </p>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px', paddingTop: '8px', borderTop: '1px dashed #f1f5f9' }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#16a34a', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            View details <ChevronRight size={13} />
                          </span>

                          <button
                            onClick={(e) => deleteNotification(e, n.id)}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: '#cbd5e1',
                              cursor: 'pointer',
                              padding: '2px 6px',
                              borderRadius: '4px'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.color = '#ef4444'}
                            onMouseLeave={(e) => e.currentTarget.style.color = '#cbd5e1'}
                            title="Dismiss notification"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Unread indicator dot */}
                    {n.unread && (
                      <div style={{
                        position: 'absolute',
                        top: '14px',
                        right: '14px',
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: '#16a34a',
                        boxShadow: '0 0 0 3px rgba(22, 163, 74, 0.2)'
                      }} />
                    )}
                  </motion.div>
                );
              })
            ) : (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: '#64748b' }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: '#f1f5f9',
                  color: '#94a3b8',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px'
                }}>
                  <ShieldCheck size={32} color="#16a34a" />
                </div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#14532d', marginBottom: '6px' }}>
                  All Caught Up!
                </h4>
                <p style={{ fontSize: '0.82rem', color: '#64748b', maxWidth: '280px', margin: '0 auto 16px' }}>
                  There are no new alerts or advisory notices for your selected category.
                </p>
                <button
                  onClick={resetSampleNotifications}
                  className="as-btn-outline"
                  style={{ fontSize: '0.78rem', padding: '6px 14px', margin: '0 auto' }}
                >
                  <Sparkles size={14} /> Restore Demo Alerts
                </button>
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div style={{
          padding: '14px 20px',
          borderTop: '1px solid #f1f5f9',
          background: '#f8fafc',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#64748b' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#16a34a', display: 'inline-block' }} />
            <span>Synced with IMD & Agmarknet</span>
          </div>

          <button
            onClick={() => {
              onClose();
              navigate('/settings');
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'transparent',
              border: 'none',
              color: '#0284c7',
              fontSize: '0.78rem',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            <Settings size={14} /> Notification Settings
          </button>
        </div>
      </motion.div>
    </div>
  );
}
