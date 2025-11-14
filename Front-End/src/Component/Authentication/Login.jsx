import React, { useState } from 'react'
import { LuUserRoundPen } from "react-icons/lu";
import { FaLock } from "react-icons/fa";
import { FaUserPlus } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Function to check if response is JSON
  const isJsonResponse = (response) => {
    const contentType = response.headers.get('content-type');
    return contentType && contentType.includes('application/json');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.username || !formData.password) {
      setError('Please enter both username and password');
      setLoading(false);
      return;
    }

    try {
      console.log('📱 Mobile Login Attempt:', formData.username);
      
      const API_BASE_URL = 'https://food-app-fshp.onrender.com';
      
      // Try login endpoint
      const loginResponse = await fetch(`${API_BASE_URL}/api/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password
        }),
      });

      console.log('📡 Login Response Status:', loginResponse.status);

      // Check if response is JSON before parsing
      if (!isJsonResponse(loginResponse)) {
        const textResponse = await loginResponse.text();
        console.error('❌ Non-JSON Response:', textResponse.substring(0, 200));
        
        // Check if it's an HTML error page
        if (textResponse.includes('<!DOCTYPE') || textResponse.includes('<html')) {
          throw new Error('Server error: Please try again later');
        } else {
          throw new Error('Unexpected response from server');
        }
      }

      if (loginResponse.ok) {
        const data = await loginResponse.json();
        console.log('✅ Login Successful:', data);
        
        if (data.success) {
          // Create user info object
          const userInfo = {
            id: data.user._id || data.user.id,
            fullName: data.user.fullName || data.user.username,
            username: data.user.username,
            emailAddress: data.user.emailAddress || data.user.email,
            phoneNumber: data.user.phoneNumber || data.user.phone,
            isLoggedIn: true,
            loginTime: new Date().toISOString()
          };
          
          // Save to localStorage
          localStorage.setItem('user', JSON.stringify(userInfo));
          localStorage.setItem('isLoggedIn', 'true');
          
          // Force storage event for mobile browsers
          window.dispatchEvent(new Event('storage'));
          
          // Dispatch custom event
          const loginEvent = new CustomEvent('userLoggedIn', { 
            detail: userInfo 
          });
          window.dispatchEvent(loginEvent);
          
          console.log('🔑 User saved to localStorage:', userInfo);
          
          alert(`Welcome back, ${userInfo.fullName || userInfo.username}!`);
          
          // Force reload cart data
          setTimeout(() => {
            navigate('/menu');
          }, 100);
          return;
        }
      }

      // If login endpoint fails, try manual user check
      console.log('🔄 Trying manual user check...');
      
      const usersResponse = await fetch(`${API_BASE_URL}/api/users/all`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Check if users response is JSON
      if (!isJsonResponse(usersResponse)) {
        const textResponse = await usersResponse.text();
        console.error('❌ Non-JSON Users Response:', textResponse.substring(0, 200));
        throw new Error('Server error: Unable to fetch users');
      }

      if (!usersResponse.ok) {
        throw new Error('Failed to fetch users');
      }

      const usersData = await usersResponse.json();
      console.log('📦 Users data received:', usersData.users?.length || 0, 'users');

      if (usersData.success && usersData.users) {
        const user = usersData.users.find(u => 
          u.username === formData.username && 
          u.password === formData.password
        );
        
        if (user) {
          const userInfo = {
            id: user._id || user.id,
            fullName: user.fullName || user.username,
            username: user.username,
            emailAddress: user.emailAddress || user.email,
            phoneNumber: user.phoneNumber || user.phone,
            isLoggedIn: true,
            loginTime: new Date().toISOString()
          };
          
          // Save to localStorage
          localStorage.setItem('user', JSON.stringify(userInfo));
          localStorage.setItem('isLoggedIn', 'true');
          
          // Force storage event for mobile browsers
          window.dispatchEvent(new Event('storage'));
          
          // Dispatch custom event
          const loginEvent = new CustomEvent('userLoggedIn', { 
            detail: userInfo 
          });
          window.dispatchEvent(loginEvent);
          
          console.log('🔑 User saved via manual check:', userInfo);
          
          alert(`Welcome back, ${userInfo.fullName || userInfo.username}!`);
          
          // Force reload cart data
          setTimeout(() => {
            navigate('/menu');
          }, 100);
        } else {
          const userExists = usersData.users.find(u => u.username === formData.username);
          if (userExists) {
            setError('Invalid password! Please check your password.');
          } else {
            setError('User not found! Please register first.');
          }
        }
      } else {
        throw new Error('Invalid response from server');
      }

    } catch (error) {
      console.error('❌ Login error:', error);
      
      // Try local storage fallback for mobile when API is completely down
      if (error.message.includes('Failed to fetch') || 
          error.message.includes('Network') || 
          error.message.includes('Server error')) {
        
        try {
          console.log('🔄 Trying local storage fallback login...');
          await tryLocalStorageLogin();
        } catch (fallbackError) {
          console.error('❌ Local storage login failed:', fallbackError);
          setError('Network error. Please check your internet connection and try again.');
        }
      } else {
        setError(error.message || 'Login failed. Please check your credentials and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Local storage fallback login for mobile when API is down
  const tryLocalStorageLogin = async () => {
    return new Promise((resolve, reject) => {
      try {
        const existingUsers = JSON.parse(localStorage.getItem('foodAppUsers') || '[]');
        console.log('🔍 Checking local storage users:', existingUsers.length);
        
        const user = existingUsers.find(u => 
          u.username === formData.username && 
          u.password === formData.password
        );
        
        if (user) {
          const userInfo = {
            id: user.id,
            fullName: user.fullName,
            username: user.username,
            emailAddress: user.emailAddress,
            phoneNumber: user.phoneNumber,
            isLoggedIn: true,
            loginTime: new Date().toISOString()
          };
          
          // Save to localStorage
          localStorage.setItem('user', JSON.stringify(userInfo));
          localStorage.setItem('isLoggedIn', 'true');
          
          // Force storage event for mobile browsers
          window.dispatchEvent(new Event('storage'));
          
          // Dispatch custom event
          const loginEvent = new CustomEvent('userLoggedIn', { 
            detail: userInfo 
          });
          window.dispatchEvent(loginEvent);
          
          console.log('🔑 User logged in via local storage:', userInfo);
          
          alert(`Welcome back, ${userInfo.fullName || userInfo.username}! (Offline Mode)`);
          
          setTimeout(() => {
            navigate('/menu');
          }, 100);
          resolve(true);
        } else {
          const userExists = existingUsers.find(u => u.username === formData.username);
          if (userExists) {
            reject(new Error('Invalid password! Please check your password.'));
          } else {
            reject(new Error('User not found! Please register first.'));
          }
        }
      } catch (error) {
        reject(error);
      }
    });
  };

  const handleCreateAccount = () => {
    navigate('/register');
  };

  const handleClose = () => {
    navigate('/'); 
  };

  return (
    <div className='min-h-screen flex items-center justify-center p-4 bg-[url("https://i.pinimg.com/736x/e2/3d/fe/e23dfe43da22ddcef418d551be2161df.jpg")] bg-cover bg-center'>
      <form onSubmit={handleLogin} className="bg-gradient-to-br from-[#2D1B0E] to-[#4a372a] rounded-xl p-6 w-full max-w-[480px] relative border-4 border-amber-700/30 shadow-[0_0_30px] shadow-amber-500/30">
        <button 
          type="button"
          onClick={handleClose}
          className="absolute top-2 right-2 text-amber-500 hover:text-amber-300 text-2xl"
        >
          ×
        </button>

        <div className='justify-items-center'>
          <h1 className='font-serif text-amber-500 font-bold text-xl p-5'>Foodie-Bazar</h1>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg">
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}
        
        <div className='relative mb-5 text-amber-500'>
          <LuUserRoundPen size={20} className='absolute left-3 top-1/2 transform -translate-y-1/2'/>
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
        
        <div className='relative mb-5 text-amber-500'>
          <FaLock size={20} className='absolute left-3 top-1/2 transform -translate-y-1/2'/>
          <input 
            type='password' 
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder='Password' 
            className='w-full rounded-lg pl-10 px-4 py-3 border-1 border-amber-500 placeholder-amber-300 bg-transparent text-white'
            required
          />
        </div>
        
        <div className='flex gap-4 text-white font-serif mb-4'>
          <input type='checkbox' className='border-none'/>
          Remember Me
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
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </div>
        
        <div className='relative flex justify-center'>
          <FaUserPlus size={20} className='text-amber-500 mr-2' />
          <button 
            type="button"
            onClick={handleCreateAccount}
            className='text-amber-500 cursor-pointer hover:text-amber-700 font-serif text-lg'
          >
            Create New Account
          </button>
        </div>

        {/* Mobile-specific help text */}
        <div className="mt-4 p-3 bg-blue-500/20 border border-blue-500 rounded-lg">
          <p className="text-blue-300 text-xs text-center">
            📱 <strong>Mobile Users:</strong> If login fails, try switching between WiFi and mobile data.
          </p>
        </div>
      </form> 
    </div>
  );
}

export default Login;