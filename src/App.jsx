import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import ChatLayout from './components/ChatLayout';
import ProgressDashboard from './components/ProgressDashboard';
import KrishnaInteractionPanel from './components/KrishnaInteractionPanel';
import ChatInterface from './components/ChatInterface';
import { auth, signInAnon } from './services/firebase';
import './index.css';

function Header({ onToggleTheme, theme }) {
  const [isSignedIn, setIsSignedIn] = useState(false);
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => setIsSignedIn(!!u));
    return () => unsubscribe();
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-purple-900/90 via-teal-500/70 to-gold-200/60 backdrop-blur py-3">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <img src="/vite.svg" alt="logo" className="h-10 w-10 rounded-full mandala-glow" />
          <Link to="/landing" className="text-white text-xl font-bold">
            Emotional Odyssey
          </Link>
        </div>
        <div className="flex items-center space-x-3">
          <nav className="hidden md:flex space-x-3">
            <Link to="/landing" className="text-white/90 hover:underline">Home</Link>
            <Link to="/chat" className="text-white/90 hover:underline">Chat</Link>
            <Link to="/dashboard" className="text-white/90 hover:underline">Dashboard</Link>
            <Link to="/login" className="text-white/90 hover:underline">Login</Link>
          </nav>
          <button
            onClick={onToggleTheme}
            className="px-3 py-1 rounded bg-white/20 text-white hover:bg-white/30"
          >
            {theme === 'dark' ? 'Light' : 'Dark'}
          </button>
          <button
            onClick={() => signInAnon()}
            className="px-3 py-1 rounded bg-gold-200 text-purple-900 font-semibold"
          >
            {isSignedIn ? 'Signed In' : 'Sign In (Anon)'}
          </button>
        </div>
      </div>
    </header>
  );
}

function DashboardPage() {
  return (
    <div className="pt-20">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl text-white font-bold mb-4">Your Dashboard</h2>
        <ProgressDashboard />
      </div>
    </div>
  );
}

function DebugBanner() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const unsub = auth.onAuthStateChanged((u) => setUser(u));
    return () => unsub();
  }, []);
  return (
    <div className="fixed left-4 bottom-4 bg-white/10 text-white p-2 rounded z-50 text-xs">
      DEV BUILD — Firebase: {auth && auth.currentUser ? 'configured' : 'not configured'} — User: {user?.uid || 'none'}
    </div>
  );
}

function App() {
  const [theme, setTheme] = useState('dark');
  useEffect(() => {
    document.documentElement.classList.toggle('light', theme === 'light');
  }, [theme]);

  return (
    <Router>
      <Header onToggleTheme={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))} theme={theme} />
      <main className="pt-20 min-h-screen bg-gradient-to-b from-purple-900 to-teal-500">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/chat" element={<ChatLayout />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        </Routes>
      </main>
      <DebugBanner />
    </Router>
  );
}

export default App;