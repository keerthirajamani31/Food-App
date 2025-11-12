import React, { useState } from 'react'
import { LuUserRoundPen } from "react-icons/lu";
import { FaLock, FaEnvelope, FaPhone, FaUser, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    emailAddress: '',
    phoneNumber: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match!');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long!');
      setLoading(false);
      return;
    }

    try {
      // UPDATED: Using Render backend URL
      const response = await fetch('https://food-app-fshp.onrender.com/api/users/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          username: formData.username,
          emailAddress: formData.emailAddress,
          phoneNumber: formData.phoneNumber,
          password: formData.password,
          confirmPassword: formData.confirmPassword
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      if (data.success) {
        alert('Registration successful! Please login with your credentials.');
        navigate('/login');
      } else {
        throw new Error(data.message || 'Registration failed');
      }

    } catch (error) {
      console.error('Registration error:', error);
      setError(error.message || 'Failed to register. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  const handleClose = () => {
    navigate('/');
  };

  return (
    <div className='min-h-screen flex items-center justify-center p-4 bg-[url("https://i.pinimg.com/736x/e2/3d/fe/e23dfe43da22ddcef418d551be2161df.jpg")] bg-cover bg-center'>
      <form onSubmit={handleRegister} className="bg-gradient-to-br from-[#2D1B0E] to-[#4a372a] rounded-xl p-6 w-full max-w-[480px] relative border-4 border-amber-700/30 shadow-[0_0_30px] shadow-amber-500/30">
        <button 
          type="button"
          onClick={handleClose}
          className="absolute top-2 right-2 text-amber-500 hover:text-amber-300 text-2xl"
        >
          ×
        </button>

        <div className='flex items-center justify-between mb-6'>
          <button 
            type="button"
            onClick={handleBackToLogin}
            className="flex items-center gap-2 text-amber-500 hover:text-amber-300"
          >
            <FaArrowLeft />
            <span>Back to Login</span>
          </button>
          <h1 className='font-serif text-amber-500 font-bold text-xl'>Foodie-Bazar</h1>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg">
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}

        <div className='relative mb-4 text-amber-500'>
          <FaUser size={18} className='absolute left-3 items-center top-1/2 transform -translate-y-1/2'/>
          <input 
            type='text' 
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            placeholder='Full Name' 
            className='w-full rounded-lg pl-10 px-4 py-3 border-1 border-amber-500 placeholder-amber-300 bg-transparent text-white'
            required
          />
        </div>

        <div className='relative mb-4 text-amber-500'>
          <LuUserRoundPen size={18} className='absolute left-3 items-center top-1/2 transform -translate-y-1/2'/>
          <input 
            type='text' 
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            placeholder='Username' 
            className='w-full rounded-lg pl-10 px-4 py-3 border-1 border-amber-500 placeholder-amber-300 bg-transparent text-white'
            required
          />
        </div>

        <div className='relative mb-4 text-amber-500'>
          <FaEnvelope size={16} className='absolute left-3 items-center top-1/2 transform -translate-y-1/2'/>
          <input 
            type='email' 
            name="emailAddress"
            value={formData.emailAddress}
            onChange={handleInputChange}
            placeholder='Email Address' 
            className='w-full rounded-lg pl-10 px-4 py-3 border-1 border-amber-500 placeholder-amber-300 bg-transparent text-white'
            required
          />
        </div>

        <div className='relative mb-4 text-amber-500'>
          <FaPhone size={16} className='absolute left-3 items-center top-1/2 transform -translate-y-1/2'/>
          <input 
            type='tel' 
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            placeholder='Phone Number' 
            className='w-full rounded-lg pl-10 px-4 py-3 border-1 border-amber-500 placeholder-amber-300 bg-transparent text-white'
            required
          />
        </div>

        <div className='relative mb-4 text-amber-500'>
          <FaLock size={16} className='absolute left-3 items-center top-1/2 transform -translate-y-1/2'/>
          <input 
            type='password' 
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder='Password (min. 6 characters)' 
            className='w-full rounded-lg pl-10 px-4 py-3 border-1 border-amber-500 placeholder-amber-300 bg-transparent text-white'
            required
            minLength="6"
          />
        </div>

        <div className='relative mb-6 text-amber-500'>
          <FaLock size={16} className='absolute left-3 items-center top-1/2 transform -translate-y-1/2'/>
          <input 
            type='password' 
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            placeholder='Confirm Password' 
            className='w-full rounded-lg pl-10 px-4 py-3 border-1 border-amber-500 placeholder-amber-300 bg-transparent text-white'
            required
          />
        </div>
        
        <div className='mb-4'>
          <button 
            type="submit"
            disabled={loading}
            className={`w-full bg-amber-500 text-black font-serif rounded-lg px-4 py-3 font-bold transition-colors ${
              loading 
                ? 'opacity-50 cursor-not-allowed' 
                : 'hover:bg-amber-600 cursor-pointer'
            }`}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </div>

        <div className='text-center'>
          <p className='text-amber-300 text-sm'>
            Already have an account?{' '}
            <button 
              type="button"
              onClick={handleBackToLogin}
              className='text-amber-500 hover:text-amber-700 font-semibold underline'
            >
              Sign In
            </button>
          </p>
        </div>
      </form> 
    </div>
  );
}

export default Register;