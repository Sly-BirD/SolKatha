import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithCredentials, signInAnon } from '../services/firebase';

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username.trim() || !formData.password.trim()) {
      setError('Username and password are required');
      return;
    }
    setError('');
    try {
      const user = await signInWithCredentials(formData.username, formData.password);
      navigate('/chat');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-purple-900 to-teal-500 text-white">
      <h1 className="text-3xl mb-6">Login</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4" aria-label="Login form">
        <input
          type="text"
          placeholder="Email or Username"
          value={formData.username}
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          className="p-2 border rounded-lg w-full bg-white/5 text-white placeholder-white/60 focus-ring"
          aria-label="Email or username"
        />
        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          className="p-2 border rounded-lg w-full bg-white/5 text-white placeholder-white/60 focus-ring"
          aria-label="Password"
        />
        {error && <p role="alert" className="text-red-400 bg-white/5 p-2 rounded">{error}</p>}
        <div className="flex flex-col sm:flex-row sm:space-x-3 gap-2">
          <button type="submit" className="flex-1 p-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 focus-ring">
            Login
          </button>
          <button
            type="button"
            onClick={async () => {
              const ok = await signInAnon();
              if (ok) navigate('/chat');
              else {
                // If anon sign-in failed, still navigate but inform user
                setError('Guest login failed, continuing offline.');
                navigate('/chat');
              }
            }}
            className="flex-1 p-2 bg-gold-200 text-purple-900 rounded-lg focus-ring"
          >
            Continue as Guest
          </button>
        </div>
        <div className="flex justify-between items-center">
          <Link to="/forgot-password">
            <p className="text-gold-500 hover:underline">Forgot Password?</p>
          </Link>
          <Link to="/register" className="text-white/80 hover:underline">Create account</Link>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;