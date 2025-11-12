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
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);

    // Fetch existing users to check for duplicates
    fetchExistingUsers();

    return () => window.removeEventListener('resize', checkMobile);
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
        signal: AbortSignal.timeout(15000)
      });

      const data = await response.json();
      console.log('📡 Registration response:', data);

      if (!response.ok) {
        if (data.message && data.message.includes('already exists')) {
          throw new Error('This username or email is already registered. Please try logging in instead.');
        } else if (data.message && data.message.includes('duplicate')) {
          throw new Error('This account already exists. Please use the login page.');
        } else {
          throw new Error(data.message || `Registration failed: ${response.status}`);
        }
      }

      if (data.success) {
        alert('🎉 Registration successful! Please login with your credentials.');
        navigate('/login');
      } else {
        throw new Error(data.message || 'Registration failed');
      }

    } catch (error) {
      console.error('❌ Registration error:', error);
      
      if (isMobile) {
        if (error.name === 'AbortError') {
          setError('Request timeout. Please check your network connection.');
        } else if (error.message.includes('Failed to fetch')) {
          setError('Network error. Please check your internet connection.');
        } else if (error.message.includes('already exists') || error.message.includes('duplicate')) {
          setError(error.message);
        } else {
          setError('Registration failed. Please try again.');
        }
      } else {
        setError(error.message || 'Failed to register. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Mobile-friendly demo registration
  const handleDemoRegistration = () => {
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
    
    alert(`👋 Welcome, ${demoUser.fullName}! (Demo Account Created)`);
    navigate('/menu');
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  const handleClose = () => {
    navigate('/');
  };

  return (
    <div className='min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900'>
      <form onSubmit={handleRegister} className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 sm:p-8 w-full max-w-md relative shadow-2xl border border-white/20">
        <button 
          type="button"
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl transition-colors"
        >
          ×
        </button>

        {/* Header */}
        <div className='flex items-center justify-between mb-8'>
          <button 
            type="button"
            onClick={handleBackToLogin}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors text-sm font-medium"
          >
            <FaArrowLeft />
            <span>Back to Login</span>
          </button>
          <h1 className='font-bold text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
            FoodieBazar
          </h1>
        </div>

        {/* Mobile Notice */}
        {isMobile && (
          <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-lg text-center">
            <p className="text-blue-700 text-sm font-medium">
              📱 Mobile Registration
            </p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
            {isMobile && error.includes('already exists') && (
              <div className="mt-3 text-center">
                <button
                  type="button"
                  onClick={handleDemoRegistration}
                  className="text-blue-600 text-sm font-medium underline hover:text-blue-700 transition-colors"
                >
                  Create Demo Account Instead
                </button>
              </div>
            )}
          </div>
        )}

        {/* Form Fields */}
        <div className="space-y-4">
          <div className='relative'>
            <FaUser className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' size={16}/>
            <input 
              type='text' 
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder='Full Name' 
              className='w-full rounded-lg pl-10 pr-4 py-3 border border-gray-300 placeholder-gray-400 bg-white text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all'
              required
            />
          </div>

          <div className='relative'>
            <LuUserRoundPen className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' size={16}/>
            <input 
              type='text' 
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder='Username' 
              className='w-full rounded-lg pl-10 pr-4 py-3 border border-gray-300 placeholder-gray-400 bg-white text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all'
              required
              minLength="3"
            />
          </div>

          <div className='relative'>
            <FaEnvelope className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' size={15}/>
            <input 
              type='email' 
              name="emailAddress"
              value={formData.emailAddress}
              onChange={handleInputChange}
              placeholder='Email Address' 
              className='w-full rounded-lg pl-10 pr-4 py-3 border border-gray-300 placeholder-gray-400 bg-white text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all'
              required
            />
          </div>

          <div className='relative'>
            <FaPhone className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' size={15}/>
            <input 
              type='tel' 
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              placeholder='Phone Number' 
              className='w-full rounded-lg pl-10 pr-4 py-3 border border-gray-300 placeholder-gray-400 bg-white text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all'
              required
              minLength="10"
            />
          </div>

          <div className='relative'>
            <FaLock className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' size={15}/>
            <input 
              type='password' 
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder='Password (min. 6 characters)' 
              className='w-full rounded-lg pl-10 pr-4 py-3 border border-gray-300 placeholder-gray-400 bg-white text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all'
              required
              minLength="6"
            />
          </div>

          <div className='relative'>
            <FaLock className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' size={15}/>
            <input 
              type='password' 
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder='Confirm Password' 
              className='w-full rounded-lg pl-10 pr-4 py-3 border border-gray-300 placeholder-gray-400 bg-white text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all'
              required
            />
          </div>
        </div>
        
        {/* Register Button */}
        <div className='mt-6'>
          <button 
            type="submit"
            disabled={loading}
            className={`w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg px-4 py-3 transition-all duration-200 ${
              loading 
                ? 'opacity-50 cursor-not-allowed' 
                : 'hover:from-blue-700 hover:to-purple-700 hover:shadow-lg transform hover:-translate-y-0.5'
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Creating Account...
              </div>
            ) : (
              'Create Account'
            )}
          </button>
        </div>

        {/* Demo Registration */}
        <div className='mt-4'>
          <button 
            type="button"
            onClick={handleDemoRegistration}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-lg px-4 py-3 hover:from-green-600 hover:to-emerald-700 hover:shadow-lg transition-all duration-200"
          >
            Try Demo Account
          </button>
          <p className="text-gray-500 text-xs text-center mt-2">
            Experience the app instantly with a demo account
          </p>
        </div>

        {/* Login Link */}
        <div className='mt-6 text-center'>
          <p className='text-gray-600 text-sm'>
            Already have an account?{' '}
            <button 
              type="button"
              onClick={handleBackToLogin}
              className='text-blue-600 hover:text-blue-700 font-semibold transition-colors'
            >
              Sign In
            </button>
          </p>
        </div>

        {/* Security Note */}
        <div className='mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200'>
          <p className='text-gray-600 text-xs text-center'>
            🔒 Your data is securely stored and encrypted
          </p>
        </div>
      </form> 
    </div>
  );
}

export default Register;