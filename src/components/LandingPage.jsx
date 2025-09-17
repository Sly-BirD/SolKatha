import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInAnon } from '../services/firebase';
import krishnaImg from '../assets/krishna.jpeg';

export default function LandingPage() {
  const navigate = useNavigate();
  const guest = async () => {
    try {
      await signInAnon();
      navigate('/chat');
    } catch (e) {
      console.warn('Guest sign-in failed:', e);
      // still navigate so user can use the frontend UI without backend
      navigate('/chat');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center text-white px-4 relative overflow-hidden">
      <div className="decor-arrow left-10 top-20" aria-hidden />
      <div className="decor-arrow right-10 bottom-20 rotate-90" aria-hidden />

      <div className="max-w-5xl bg-gradient-to-r from-white/3 to-white/2 rounded-3xl p-10 shadow-2xl relative z-10 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-3">Emotional Odyssey</h1>
            <p className="text-lg text-white/80 mb-4">A guided conversational journey inspired by Krishna-Arjuna — explore feelings, create art, and listen to calming music.</p>
            <p className="text-sm text-white/70 mb-6">Built for the Google Gen AI Hackathon — gentle guidance and culturally inspired motifs.</p>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Link to="/chat" className="px-6 py-4 bg-teal-500 text-white rounded-lg font-semibold text-center shadow hover:scale-[1.02] transition">Start Chat</Link>
              <Link to="/dashboard" className="px-6 py-4 bg-gold-200 text-purple-900 rounded-lg font-semibold text-center shadow hover:scale-[1.02] transition">Open Dashboard</Link>
              <button onClick={guest} aria-label="Continue as Guest" className="px-6 py-4 bg-white/10 text-white rounded-lg font-semibold text-center shadow hover:scale-[1.02] transition">
                Continue as Guest
              </button>
            </div>

            <div className="mt-6 flex flex-wrap gap-4 text-sm text-white/80">
              <Link to="/register" className="underline">Create New Account</Link>
              <Link to="/login" className="underline">Already a User</Link>
              <Link to="/admin-login" className="underline">Admin Login</Link>
            </div>

            <div className="mt-4">
              <button onClick={guest} className="text-sm text-white/90 underline">Or continue as guest</button>
            </div>
          </div>

          <div className="hidden md:flex items-center justify-center w-56 h-56 flex-shrink-0">
            <div className="cartwheel w-56 h-56 rounded-full overflow-hidden border-2 border-white/5 shadow-xl">
              <img src={krishnaImg} alt="krishna" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
