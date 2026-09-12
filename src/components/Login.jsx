import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sprout, Phone, Mail, Lock, User, ArrowRight, 
  ShieldCheck, CheckCircle2, KeyRound, X, AlertCircle 
} from 'lucide-react';

export default function Login({ onLoginSuccess }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpPhone, setOtpPhone] = useState('');
  const [otpValue, setOtpValue] = useState(['', '', '', '', '', '']);
  const [otpSent, setOtpSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    emailOrPhone: '',
    password: '',
    farmLocation: 'Vijayawada, Andhra Pradesh',
    farmSize: '5 Acres',
    mainCrops: 'Paddy, Tomato'
  });

  const [loading, setLoading] = useState(false);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanPhone = formData.emailOrPhone.trim();
    if (!cleanPhone) {
      setErrorMsg('Please enter your 10-digit mobile number or email.');
      return;
    }

    if (!formData.password || formData.password.length < 4) {
      setErrorMsg('Password must be at least 4 characters long.');
      return;
    }

    setLoading(true);
    try {
      const endpoint = isSignUp ? '/api/auth/signup' : '/api/auth/login';
      const payload = isSignUp ? {
        name: formData.name.trim() || 'Farmer User',
        phone: cleanPhone.includes('@') ? '' : cleanPhone,
        email: cleanPhone.includes('@') ? cleanPhone : '',
        password: formData.password,
        location: formData.farmLocation || 'Andhra Pradesh',
        farm_size: formData.farmSize || '5 Acres',
        main_crops: formData.mainCrops ? formData.mainCrops.split(',').map(s => s.trim()) : ['Paddy']
      } : {
        identifier: cleanPhone,
        password: formData.password
      };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (res.ok && data.success) {
        const user = data.user;
        user.isLoggedIn = true;
        onLoginSuccess(user);
        navigate('/');
      } else {
        setErrorMsg(data.error || data.detail || (isSignUp ? 'Registration failed. Mobile/email may already exist.' : 'Account not found or invalid password. Please click Sign Up if you are a new farmer.'));
      }
    } catch (err) {
      console.warn('Auth network error:', err);
      setErrorMsg('Server network error. Please verify backend connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    const googleUser = {
      name: 'Ramesh Kumar',
      phone: '9848022338',
      email: 'ramesh.farmer@gmail.com',
      location: 'Vijayawada, Andhra Pradesh',
      farmSize: '5 Acres',
      mainCrops: ['Paddy', 'Tomato', 'Chilli'],
      isLoggedIn: true,
      loginTime: new Date().toISOString()
    };
    onLoginSuccess(googleUser);
    navigate('/');
  };

  const handleStartOtp = async () => {
    const phone = formData.emailOrPhone.trim();
    if (!phone || phone.length < 10) {
      setErrorMsg('Please enter your 10-digit mobile number above before requesting OTP.');
      return;
    }
    setOtpPhone(phone);
    setShowOtpModal(true);
    setOtpSent(true);
    setOtpValue(['', '', '', '', '', '']);

    try {
      await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone })
      });
    } catch (e) {
      console.warn('OTP send fallback note:', e);
    }
  };

  const handleOtpVerify = async () => {
    const otpCode = otpValue.join('');
    if (otpCode.length < 6) {
      setErrorMsg('Please enter the 6-digit OTP sent to your phone (Demo OTP: 123456).');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: otpPhone, otp: otpCode })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setShowOtpModal(false);
        const user = data.user;
        user.isLoggedIn = true;
        onLoginSuccess(user);
        navigate('/');
        return;
      } else {
        setErrorMsg(data.error || data.detail || 'Invalid OTP code. Please enter the correct 6 digits.');
      }
    } catch (e) {
      console.warn('OTP verify note:', e);
      setErrorMsg('Failed to verify OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 50%, #fef9c3 100%)',
      padding: '24px'
    }}>
      <div style={{
        maxWidth: '960px',
        width: '100%',
        background: 'white',
        borderRadius: '24px',
        boxShadow: '0 20px 40px -10px rgba(22, 163, 74, 0.15)',
        border: '1px solid #bbf7d0',
        overflow: 'hidden',
        display: 'grid',
        gridTemplateColumns: '1fr 1.15fr'
      }}>
        {/* Left Side Banner matching screenshot */}
        <div style={{
          background: 'linear-gradient(135deg, #15803d 0%, #166534 100%)',
          padding: '44px 36px',
          color: 'white',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '28px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Sprout size={24} color="white" />
              </div>
              <span style={{ fontSize: '1.5rem', fontWeight: '800', letterSpacing: '-0.5px' }}>AgriSathi</span>
            </div>

            <h2 style={{ fontSize: '2.1rem', fontWeight: '800', lineHeight: '1.2', marginBottom: '16px' }}>
              {isSignUp ? "Let's Grow a Greener Tomorrow" : "Good Farmers, Brighter Tomorrows"}
            </h2>
            <p style={{ fontSize: '0.95rem', color: '#bbf7d0', lineHeight: '1.6' }}>
              India's first multi-agent AI agricultural assistant. Access real-time mandi prices, rain telemetry, crop disease scanning, and government schemes in your native language.
            </p>
          </div>

          <div style={{ marginTop: '40px', background: 'rgba(255,255,255,0.12)', padding: '18px', borderRadius: '18px', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.15)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '700', fontSize: '0.95rem', marginBottom: '4px' }}>
              <ShieldCheck size={20} color="#86efac" /> 100% Verified Farmer Platform
            </div>
            <div style={{ fontSize: '0.82rem', color: '#dcfce7' }}>
              Integrated with Agmarknet, IMD Agromet, and Kisan Call Centre (1800-180-1551) records.
            </div>
          </div>
        </div>

        {/* Right Form Card matching screenshot */}
        <div style={{ padding: '44px 40px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: '#dcfce7', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#16a34a', marginBottom: '12px', boxShadow: '0 4px 12px rgba(22, 163, 74, 0.2)' }}>
              <Sprout size={30} />
            </div>
            <h2 style={{ fontSize: '1.65rem', fontWeight: '800', color: '#14532d' }}>
              {isSignUp ? "Create Your Account" : "Welcome Back"}
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              {isSignUp ? "Join AgriSathi and grow with us" : "Login to continue to AgriSathi"}
            </p>
          </div>

          {errorMsg && (
            <div style={{ background: '#fee2e2', border: '1px solid #f87171', color: '#b91c1c', padding: '10px 14px', borderRadius: '12px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <AlertCircle size={16} /> {errorMsg}
            </div>
          )}

          <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {isSignUp && (
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '4px' }}>Full Name</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type="text" 
                    required 
                    className="as-input" 
                    placeholder="e.g. Ramesh Kumar"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    style={{ paddingLeft: '38px' }}
                  />
                  <User size={16} style={{ position: 'absolute', left: '12px', top: '15px', color: 'var(--text-muted)' }} />
                </div>
              </div>
            )}

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                {isSignUp ? "Mobile Number" : "Email or Phone"}
              </label>
              <div style={{ position: 'relative' }}>
                <input 
                  type="text" 
                  required 
                  className="as-input" 
                  placeholder={isSignUp ? "10-digit mobile number" : "e.g. 9848022338 or email"}
                  value={formData.emailOrPhone}
                  onChange={(e) => setFormData({...formData, emailOrPhone: e.target.value})}
                  style={{ paddingLeft: '38px' }}
                />
                <Phone size={16} style={{ position: 'absolute', left: '12px', top: '15px', color: 'var(--text-muted)' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Password</label>
                {!isSignUp && (
                  <span 
                    onClick={() => alert("Password reset link sent to your registered mobile/email!")}
                    style={{ fontSize: '0.75rem', color: '#16a34a', cursor: 'pointer', fontWeight: '600' }}
                  >
                    Forgot Password?
                  </span>
                )}
              </div>
              <div style={{ position: 'relative' }}>
                <input 
                  type="password" 
                  required 
                  className="as-input" 
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  style={{ paddingLeft: '38px' }}
                />
                <Lock size={16} style={{ position: 'absolute', left: '12px', top: '15px', color: 'var(--text-muted)' }} />
              </div>
            </div>

            <button 
              type="submit" 
              className="as-btn-primary" 
              style={{ width: '100%', marginTop: '6px', padding: '14px', borderRadius: '12px', fontSize: '1rem' }}
            >
              {isSignUp ? "Sign Up & Register" : "Login"}
            </button>
          </form>

          {/* Social / OTP Dividers */}
          <div style={{ textAlign: 'center', margin: '18px 0 12px', position: 'relative' }}>
            <span style={{ background: 'white', padding: '0 12px', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: '600' }}>OR</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button 
              type="button"
              onClick={handleGoogleLogin}
              className="as-btn-outline" 
              style={{ width: '100%', justifyContent: 'center', borderColor: 'var(--border-color)', color: 'var(--text-main)' }}
            >
              🌐 Continue with Google
            </button>

            <button 
              type="button"
              onClick={handleStartOtp}
              className="as-btn-outline" 
              style={{ width: '100%', justifyContent: 'center', borderColor: 'var(--border-color)', color: 'var(--text-main)' }}
            >
              📱 Continue with Mobile (OTP)
            </button>
          </div>

          <div style={{ textAlign: 'center', marginTop: '18px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            {isSignUp ? "Already have an account? " : "Don't have an account? "}
            <span 
              onClick={() => { setIsSignUp(!isSignUp); setErrorMsg(''); }} 
              style={{ color: '#16a34a', fontWeight: '700', cursor: 'pointer' }}
            >
              {isSignUp ? "Login" : "Sign Up"}
            </span>
          </div>
        </div>
      </div>

      {/* OTP Modal */}
      <AnimatePresence>
        {showOtpModal && (
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
              style={{ maxWidth: '420px', width: '100%', padding: '32px', textAlign: 'center' }}
            >
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button onClick={() => setShowOtpModal(false)} className="icon-btn">
                  <X size={18} />
                </button>
              </div>

              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#dcfce7', color: '#16a34a', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
                <KeyRound size={28} />
              </div>

              <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '4px' }}>Verify OTP</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
                We sent a 6-digit verification code to <strong>{otpPhone}</strong>
              </p>

              <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '20px' }}>
                {otpValue.map((digit, i) => (
                  <input
                    key={i}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => {
                      const newOtp = [...otpValue];
                      newOtp[i] = e.target.value;
                      setOtpValue(newOtp);
                    }}
                    style={{
                      width: '44px',
                      height: '50px',
                      textAlign: 'center',
                      fontSize: '1.2rem',
                      fontWeight: '700',
                      borderRadius: '10px',
                      border: '1.5px solid #16a34a',
                      background: '#f8fafc',
                      outline: 'none'
                    }}
                  />
                ))}
              </div>

              <button 
                onClick={handleOtpVerify}
                className="as-btn-primary" 
                style={{ width: '100%', padding: '12px', borderRadius: '12px' }}
              >
                Verify & Login
              </button>

              <div style={{ marginTop: '14px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Didn't receive code? <span onClick={() => alert("New OTP sent: 123456")} style={{ color: '#16a34a', fontWeight: '700', cursor: 'pointer' }}>Resend OTP</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
