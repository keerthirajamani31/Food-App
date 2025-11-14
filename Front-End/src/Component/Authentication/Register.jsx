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
    if (error) setError('');
  };

  // Function to check if response is JSON
  const isJsonResponse = (response) => {
    const contentType = response.headers.get('content-type');
    return contentType && contentType.includes('application/json');
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
      const API_BASE_URL = 'https://food-app-fshp.onrender.com';
      
      console.log('📱 Mobile Registration Attempt:', formData.username);
      
      // Try primary registration endpoint
      let response = await fetch(`${API_BASE_URL}/api/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          username: formData.username,
          email: formData.emailAddress,
          phoneNumber: formData.phoneNumber,
          password: formData.password
        }),
      });

      console.log('📡 Registration Response Status:', response.status);

      // Check if response is JSON
      if (!isJsonResponse(response)) {
        // If not JSON, get the text to see what's wrong
        const textResponse = await response.text();
        console.error('❌ Non-JSON Response:', textResponse.substring(0, 200));
        
        // Check if it's an HTML error page
        if (textResponse.includes('<!DOCTYPE') || textResponse.includes('<html')) {
          throw new Error('Server error: Please try again later');
        } else {
          throw new Error('Unexpected response from server');
        }
      }

      const data = await response.json();
      console.log('📦 Registration Response Data:', data);

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
        alert('🎉 Registration successful! Please login with your credentials.');
        navigate('/login');
      } else {
        throw new Error(data.message || 'Registration failed');
      }

    } catch (error) {
      console.error('❌ Registration error:', error);
      
      // Try alternative endpoints if first one fails
      if (error.message.includes('Failed to fetch') || 
          error.message.includes('Network') || 
          error.message.includes('Unexpected token') ||
          error.message.includes('Server error')) {
        
        try {
          console.log('🔄 Trying alternative registration endpoints...');
          
          // Try different endpoint variations
          const endpoints = [
            `${API_BASE_URL}/api/users/`,
            `${API_BASE_URL}/api/users/signup`,
            `${API_BASE_URL}/api/users/create`,
            `${API_BASE_URL}/api/register`
          ];
          
          let success = false;
          
          for (let endpoint of endpoints) {
            try {
              console.log(`🔄 Trying endpoint: ${endpoint}`);
              const altResponse = await fetch(endpoint, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  fullName: formData.fullName,
                  username: formData.username,
                  emailAddress: formData.emailAddress,
                  phoneNumber: formData.phoneNumber,
                  password: formData.password
                }),
              });

              if (altResponse.ok && isJsonResponse(altResponse)) {
                const altData = await altResponse.json();
                console.log('✅ Alternative endpoint success:', altData);
                
                if (altData.success) {
                  alert('🎉 Registration successful! Please login with your credentials.');
                  navigate('/login');
                  success = true;
                  break;
                }
              }
            } catch (altError) {
              console.log(`❌ Endpoint ${endpoint} failed:`, altError.message);
              continue;
            }
          }
          
          if (!success) {
            // If all endpoints fail, try local storage fallback for mobile
            console.log('🔄 Trying local storage fallback...');
            await tryLocalStorageFallback();
          }
          
        } catch (fallbackError) {
          console.error('❌ All registration methods failed:', fallbackError);
          setError('Registration service unavailable. Please try again later or use a different network.');
        }
      } else {
        setError(error.message || 'Failed to register. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Fallback method using localStorage (for mobile when API is down)
  const tryLocalStorageFallback = async () => {
    return new Promise((resolve, reject) => {
      try {
        // Get existing users from localStorage
        const existingUsers = JSON.parse(localStorage.getItem('foodAppUsers') || '[]');
        
        // Check if user already exists
        const userExists = existingUsers.find(user => 
          user.username === formData.username || 
          user.emailAddress === formData.emailAddress
        );
        
        if (userExists) {
          reject(new Error('User already exists with this username or email'));
          return;
        }
        
        // Create new user
        const newUser = {
          id: `user_${Date.now()}`,
          fullName: formData.fullName,
          username: formData.username,
          emailAddress: formData.emailAddress,
          phoneNumber: formData.phoneNumber,
          password: formData.password, // Note: In real app, hash this password
          createdAt: new Date().toISOString()
        };
        
        // Save to localStorage
        existingUsers.push(newUser);
        localStorage.setItem('foodAppUsers', JSON.stringify(existingUsers));
        
        console.log('✅ User registered locally:', newUser);
        alert('🎉 Registration successful (offline mode)! Please login with your credentials.');
        navigate('/login');
        resolve(true);
        
      } catch (error) {
        reject(error);
      }
    });
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

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg">
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}

        <div className='relative mb-4 text-amber-500'>
          <FaUser size={18} className='absolute left-3 top-1/2 transform -translate-y-1/2'/>
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
          <LuUserRoundPen size={18} className='absolute left-3 top-1/2 transform -translate-y-1/2'/>
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
          <FaEnvelope size={16} className='absolute left-3 top-1/2 transform -translate-y-1/2'/>
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
          <FaPhone size={16} className='absolute left-3 top-1/2 transform -translate-y-1/2'/>
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
          <FaLock size={16} className='absolute left-3 top-1/2 transform -translate-y-1/2'/>
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
          <FaLock size={16} className='absolute left-3 top-1/2 transform -translate-y-1/2'/>
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

        {/* Mobile-specific help text */}
        <div className="mt-4 p-3 bg-blue-500/20 border border-blue-500 rounded-lg">
          <p className="text-blue-300 text-xs text-center">
            📱 <strong>Mobile Users:</strong> If registration fails, try switching between WiFi and mobile data.
          </p>
        </div>
      </form> 
    </div>
  );
}

export default Register;