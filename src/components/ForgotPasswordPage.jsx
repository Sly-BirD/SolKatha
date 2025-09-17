import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ mobileOrEmail: '', code: '', newPassword: '' });
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (step === 1) {
      if (!formData.mobileOrEmail.trim()) {
        setError('Mobile or email is required');
        return;
      }
      setError('');
      setStep(2); // Move to code verification
    } else if (step === 2) {
      if (!formData.code.trim() || !formData.newPassword.trim()) {
        setError('Code and new password are required');
        return;
      }
      setError('');
      // Simulate password reset
      console.log('Reset data:', formData);
      navigate('/login');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-purple-900 to-teal-500 text-white">
      <h1 className="text-3xl mb-6">Forgot Password</h1>
      <form onSubmit={handleSubmit} className="w-1/2 space-y-4">
        {step === 1 && (
          <>
            <input
              type="text"
              placeholder="Mobile or Email"
              value={formData.mobileOrEmail}
              onChange={(e) => setFormData({ ...formData, mobileOrEmail: e.target.value })}
              className="p-2 border rounded-lg w-full"
            />
            <button type="submit" className="p-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600">
              Send Verification Code
            </button>
          </>
        )}
        {step === 2 && (
          <>
            <input
              type="text"
              placeholder="Verification Code"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              className="p-2 border rounded-lg w-full"
            />
            <input
              type="password"
              placeholder="New Password"
              value={formData.newPassword}
              onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
              className="p-2 border rounded-lg w-full"
            />
            <button type="submit" className="p-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600">
              Confirm New Password
            </button>
          </>
        )}
        {error && <p className="text-red-500">{error}</p>}
        <Link to="/login">
          <p className="text-gold-500 hover:underline">Back to Login</p>
        </Link>
      </form>
    </div>
  );
};

export default ForgotPasswordPage;
