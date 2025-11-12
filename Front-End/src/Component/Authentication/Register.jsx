import React, { useState, useEffect } from 'react'
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
  const [isMobile, setIsMobile] = useState(false);
  const [existingUsers, setExistingUsers] = useState([]);

  // Detect mobile and fetch existing users
  useEffect(() => {
    const checkMobile = () => {
      const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      setIsMobile(mobile);
      console.log('📱 Mobile detected:', mobile);
    };
    checkMobile();

    // Fetch existing users to check for duplicates
    fetchExistingUsers();
  }, []);

  const fetchExistingUsers = async () => {
    try {
      const API_BASE_URL = 'https://food-app-fshp.onrender.com';
      const response = await fetch(`${API_BASE_URL}/api/users/all`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(10000)
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.users) {
          setExistingUsers(data.users);
          console.log('📋 Loaded existing users:', data.users.length);
        }
      }
    } catch (error) {
      console.log('⚠️ Could not fetch existing users, will check on submit');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  // Check if user already exists locally before sending to server
  const checkDuplicateUser = () => {
    const duplicateUsername = existingUsers.find(user => 
      user.username.toLowerCase() === formData.username.toLowerCase()
    );
    
    const duplicateEmail = existingUsers.find(user => 
      user.emailAddress.toLowerCase() === formData.emailAddress.toLowerCase()
    );

    if (duplicateUsername) {
      return `Username "${formData.username}" is already taken. Please choose a different username.`;
    }

    if (duplicateEmail) {
      return `Email "${formData.emailAddress}" is already registered. Please use a different email or try logging in.`;
    }

    return null;
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

    // Check for duplicates locally first
    const duplicateError = checkDuplicateUser();
    if (duplicateError) {
      setError(duplicateError);
      setLoading(false);
      return;
    }

    try {
      const API_BASE_URL = 'https://food-app-fshp.onrender.com';
      
      console.log('🔄 Attempting registration...');
      
      // Mobile-friendly fetch with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const response = await fetch(`${API_BASE_URL}/api/users/`, {
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
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      const data = await response.json();
      console.log('📡 Registration response:', data);

      if (!response.ok) {
        // Handle specific error cases
        if (data.message && data.message.includes('already exists')) {
          throw new Error('This username or email is already registered. Please try logging in instead.');
        } else if (data.message && data.message.includes('duplicate')) {
          throw new Error('This account already exists. Please use the login page.');
        } else {
          throw new Error(data.message || `Registration failed: ${response.status}`);
        }
      }

      if (data.success) {
        alert('Registration successful! Please login with your credentials.');
        navigate('/login');
      } else {
        throw new Error(data.message || 'Registration failed');
      }

    } catch (error) {
      console.error('❌ Registration error:', error);
      
      // Mobile-specific error handling
      if (isMobile) {
        if (error.name === 'AbortError') {
          setError('Registration timeout. Please check your mobile network and try again.');
        } else if (error.message.includes('Failed to fetch')) {
          setError('Network error. Please check your mobile data/WiFi connection.');
        } else if (error.message.includes('already exists') || error.message.includes('duplicate')) {
          setError(error.message + ' Try using the demo login instead.');
        } else {
          setError('Registration failed. Please try again or use demo login.');
        }
      } else {
        if (error.message.includes('already exists') || error.message.includes('duplicate')) {
          setError(error.message + ' You can try logging in or use a different email/username.');
        } else {
          setError(error.message || 'Failed to register. Please try again.');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  // Mobile-friendly demo registration
  const handleDemoRegistration = () => {
    console.log('🔄 Creating demo account...');
    
    const demoUser = {
      id: 'demo_user_' + Date.now(),
      fullName: 'Demo User',
      username: 'demo' + Math.floor(Math.random() * 1000),
      emailAddress: `demo${Date.now()}@example.com`,
      phoneNumber: '1234567890',
      isLoggedIn: true,
      loginTime: new Date().toISOString(),
      role: 'user'
    };
    
    localStorage.setItem('user', JSON.stringify(demoUser));
    localStorage.setItem('isLoggedIn', 'true');
    
    const loginEvent = new CustomEvent('userLoggedIn', { 
      detail: demoUser 
    });
    window.dispatchEvent(loginEvent);
    
    console.log('✅ Demo registration successful');
    alert(`Welcome, ${demoUser.fullName}! (Demo Account Created)`);
    navigate('/menu');
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
            className="flex items-center gap-2 text-amber-500 hover:text-amber-300 text-sm"
          >
            <FaArrowLeft />
            <span>Back to Login</span>
          </button>
          <h1 className='font-serif text-amber-500 font-bold text-xl'>Foodie-Bazar</h1>
        </div>

        {isMobile && (
          <div className="mb-4 p-3 bg-amber-500/20 border border-amber-500 rounded-lg">
            <p className="text-amber-300 text-sm text-center">
              📱 Mobile Registration
            </p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg">
            <p className="text-red-300 text-sm">{error}</p>
            {isMobile && error.includes('already exists') && (
              <div className="mt-2 text-center">
                <button
                  type="button"
                  onClick={handleDemoRegistration}
                  className="text-amber-300 text-xs underline hover:text-amber-100"
                >
                  Create Demo Account Instead
                </button>
              </div>
            )}
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
            minLength="3"
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
            minLength="10"
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

        {/* Demo Registration for Mobile */}
        {isMobile && (
          <div className='mb-4'>
            <button 
              type="button"
              onClick={handleDemoRegistration}
              className="w-full bg-green-600 text-white font-serif rounded-lg px-4 py-3 font-bold hover:bg-green-700 transition-colors"
            >
              Create Demo Account (Mobile)
            </button>
            <p className="text-amber-300 text-xs text-center mt-2">
              Use this if registration fails on mobile
            </p>
          </div>
        )}

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

        {/* Debug Info */}
        <div className='mt-4 text-center'>
          <p className='text-amber-500 text-xs'>
            {isMobile ? '📱 Mobile Mode' : '💻 Desktop Mode'} | Users: {existingUsers.length}
          </p>
        </div>
      </form> 
    </div>
  );
}

export default Register;