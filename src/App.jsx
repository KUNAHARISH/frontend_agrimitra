import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';

import Layout from './components/Layout';
import Home from './components/Home';
import Scanner from './components/Scanner';
import Weather from './components/Weather';
import Market from './components/Market';
import Chat from './components/Chat';
import Schemes from './components/Schemes';
import Helpline from './components/Helpline';
import Profile from './components/Profile';
import MyCrops from './components/MyCrops';
import Community from './components/Community';
import Settings from './components/Settings';
import Login from './components/Login';

import { translations, locales } from './translations';
import './index.css';

function App() {
  const [language, setLanguage] = useState(() => {
    try {
      return localStorage.getItem('agrisathi_lang') || 'en';
    } catch {
      return 'en';
    }
  });

  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('agrisathi_user');
      return saved ? JSON.parse(saved) : { name: "Ramesh Kumar", phone: "9848022338", location: "Vijayawada, Andhra Pradesh" };
    } catch {
      return { name: "Ramesh Kumar", phone: "9848022338", location: "Vijayawada, Andhra Pradesh" };
    }
  });

  const handleSetLanguage = (newLang) => {
    setLanguage(newLang);
    try {
      localStorage.setItem('agrisathi_lang', newLang);
    } catch (e) {
      console.error('Failed to save language choice:', e);
    }
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    try {
      localStorage.setItem('agrisathi_user', JSON.stringify(userData));
    } catch (e) {
      console.error('Failed to save login session:', e);
    }
  };

  const handleLogout = () => {
    setUser(null);
    try {
      localStorage.removeItem('agrisathi_user');
    } catch (e) {
      console.error('Failed to remove login session:', e);
    }
  };

  // Safe fallback translation object proxy
  const currentTranslations = translations[language] || translations['en'];
  const englishFallback = translations['en'];
  const t = new Proxy(currentTranslations, {
    get: (target, prop) => {
      return target[prop] || englishFallback[prop] || prop;
    }
  });
  const locale = locales[language] || locales['en'];

  return (
    <Routes>
      <Route 
        path="/" 
        element={
          <Layout 
            t={t} 
            language={language} 
            setLanguage={handleSetLanguage} 
            user={user} 
            onLogout={handleLogout} 
          />
        }
      >
        <Route index element={<Home t={t} language={language} />} />
        <Route path="scanner" element={<Scanner t={t} language={language} user={user} />} />
        <Route path="weather" element={<Weather t={t} language={language} />} />
        <Route path="market" element={<Market t={t} language={language} />} />
        <Route path="chat" element={<Chat t={t} language={language} locale={locale} />} />
        <Route path="chat/:agentId" element={<Chat t={t} language={language} locale={locale} />} />
        <Route path="schemes" element={<Schemes t={t} language={language} />} />
        <Route path="helpline" element={<Helpline t={t} language={language} />} />
        <Route path="my-crops" element={<MyCrops t={t} language={language} user={user} />} />
        <Route path="community" element={<Community t={t} language={language} />} />
        <Route path="profile" element={<Profile t={t} user={user} language={language} onLogout={handleLogout} onUpdateProfile={handleLoginSuccess} />} />
        <Route path="settings" element={<Settings t={t} language={language} setLanguage={handleSetLanguage} user={user} onUpdateProfile={handleLoginSuccess} />} />
      </Route>
      <Route path="/login" element={<Login t={t} onLoginSuccess={handleLoginSuccess} />} />
    </Routes>
  );
}

export default App;
