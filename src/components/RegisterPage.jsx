import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signUpWithCredentials } from '../services/firebase';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    avatar: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');

  const avatars = ['avatar1', 'avatar2', 'avatar3', 'avatar4', 'avatar5'];

  const validateForm = () => {
    if (!formData.username.trim()) return 'Username is required';
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) return 'Invalid email format';
    if (formData.password !== formData.confirmPassword) return 'Passwords do not match';
    if (!formData.avatar) return 'Please select an avatar';
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError('');
    try {
      const user = await signUpWithCredentials(formData.email, formData.password);
      // Simulate storing additional profile data (replace with Firestore later)
      console.log('User registered:', { ...formData, uid: user.uid });
      navigate('/login');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-purple-900 to-teal-500 text-white">
      <h1 className="text-3xl mb-6">Create New Account</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
        <input
          type="text"
          placeholder="Username"
          value={formData.username}
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          className="p-2 border rounded-lg w-full bg-white/5 text-white placeholder-white/60"
        />
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="p-2 border rounded-lg w-full bg-white/5 text-white placeholder-white/60"
        />
        <select
          value={formData.avatar}
          onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
          className="p-2 border rounded-lg w-full bg-white/5 text-white"
        >
          <option value="">Select Avatar</option>
          {avatars.map((avatar) => (
            <option key={avatar} value={avatar}>{avatar}</option>
          ))}
        </select>
        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          className="p-2 border rounded-lg w-full bg-white/5 text-white placeholder-white/60"
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
          className="p-2 border rounded-lg w-full bg-white/5 text-white placeholder-white/60"
        />
        {error && <p className="text-red-500">{error}</p>}
        <div className="flex justify-between items-center">
          <button type="submit" className="p-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600">Register</button>
          <a onClick={() => navigate('/login')} className="text-white/80 hover:underline cursor-pointer">Back to login</a>
        </div>
      </form>
    </div>
  );
};

export default RegisterPage;