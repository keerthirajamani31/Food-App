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
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile on component mount
  React.useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
      console.log('🔄 Attempting login...');
      
      const API_BASE_URL = 'https://food-app-fshp.onrender.com';
      
      // Get all users
      const usersResponse = await fetch(`${API_BASE_URL}/api/users/all`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(15000)
      });

      console.log('📡 Users response status:', usersResponse.status);
      
      if (!usersResponse.ok) {
        throw new Error(`Server responded with status: ${usersResponse.status}`);
      }

      const usersData = await usersResponse.json();
      console.log('📦 Users data received');

      if (usersData.success && usersData.users) {
        // FIXED: Check both username AND password
        const user = usersData.users.find(u => 
          u.username === formData.username && 
          u.password === formData.password
        );
        
        if (user) {
          // Store user info
          const userInfo = {
            id: user._id || user.id,
            fullName: user.fullName,
            username: user.username,
            emailAddress: user.emailAddress,
            phoneNumber: user.phoneNumber,
            isLoggedIn: true,
            loginTime: new Date().toISOString()
          };
          
          localStorage.setItem('user', JSON.stringify(userInfo));
          localStorage.setItem('isLoggedIn', 'true');
          
          // Dispatch custom event to update all components
          const loginEvent = new CustomEvent('userLoggedIn', { 
            detail: userInfo 
          });
          window.dispatchEvent(loginEvent);
          window.dispatchEvent(new Event('storage'));
          
          console.log('✅ Login successful');
          alert(`Welcome back, ${user.fullName || user.username}!`);
          navigate('/menu');
        } else {
          // FIXED: Better error message
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
      
      // Mobile-specific error handling
      if (isMobile) {
        if (error.name === 'AbortError' || error.message.includes('timeout')) {
          setError('Request timeout. Please check your mobile network connection.');
        } else if (error.message.includes('Failed to fetch')) {
          setError('Network unavailable. Please check your mobile data/WiFi.');
        } else {
          setError('Server connection issue. Please try again.');
        }
      } else {
        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
          setError('Network error. Please check your internet connection.');
        } else {
          setError(error.message || 'Server error. Please try again.');
        }
      }
      setLoading(false);
    }
  };

  // Demo login
  const handleDemoLogin = async () => {
    setLoading(true);
    setError('');
    
    try {
      const API_BASE_URL = 'https://food-app-fshp.onrender.com';
      
      const response = await fetch(`${API_BASE_URL}/api/demo/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'user@demo.com',
          password: 'user123'
        }),
        signal: AbortSignal.timeout(10000)
      });

      if (!response.ok) {
        throw new Error('Demo login failed');
      }

      const data = await response.json();
      
      if (data.success) {
        const userInfo = {
          id: 'demo_user',
          fullName: data.user.name,
          username: 'demo',
          emailAddress: 'user@demo.com',
          phoneNumber: '0000000000',
          isLoggedIn: true,
          loginTime: new Date().toISOString(),
          role: data.user.role
        };
        
        localStorage.setItem('user', JSON.stringify(userInfo));
        localStorage.setItem('isLoggedIn', 'true');
        
        const loginEvent = new CustomEvent('userLoggedIn', { 
          detail: userInfo 
        });
        window.dispatchEvent(loginEvent);
        
        console.log('✅ Demo login successful');
        alert(`Welcome, ${data.user.name}! (Demo Mode)`);
        navigate('/menu');
      } else {
        setError('Demo login failed');
      }
    } catch (error) {
      console.error('❌ Demo login error:', error);
      setError('Demo login unavailable. Using fallback.');
      handleFallbackLogin();
    } finally {
      setLoading(false);
    }
  };

  // Fallback login
  const handleFallbackLogin = () => {
    console.log('🔄 Using fallback login...');
    
    const mockUser = {
      id: 'fallback_user_' + Date.now(),
      fullName: 'Demo User',
      username: 'demo',
      emailAddress: 'demo@example.com',
      phoneNumber: '1234567890',
      isLoggedIn: true,
      loginTime: new Date().toISOString(),
      role: 'user'
    };
    
    localStorage.setItem('user', JSON.stringify(mockUser));
    localStorage.setItem('isLoggedIn', 'true');
    
    const loginEvent = new CustomEvent('userLoggedIn', { 
      detail: mockUser 
    });
    window.dispatchEvent(loginEvent);
    
    console.log('✅ Fallback login successful');
    alert(`Welcome, ${mockUser.fullName}! (Fallback Mode)`);
    navigate('/menu');
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
          {isMobile && (
            <p className='text-amber-300 text-sm text-center -mt-3 mb-2'>
              Mobile Mode
            </p>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg">
            <p className="text-red-300 text-sm">{error}</p>
            {isMobile && (
              <div className="mt-2 text-center">
                <button
                  type="button"
                  onClick={handleDemoLogin}
                  className="text-amber-300 text-xs underline hover:text-amber-100"
                >
                  Try Demo Login Instead
                </button>
              </div>
            )}
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

        {/* Demo Login Buttons */}
        <div className='mb-4 space-y-2'>
          <button 
            type="button"
            onClick={handleDemoLogin}
            disabled={loading}
            className="w-full bg-green-600 text-white font-serif rounded-lg px-4 py-3 font-bold hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Demo Login (Recommended)'}
          </button>
          
          <button 
            type="button"
            onClick={handleFallbackLogin}
            className="w-full bg-blue-600 text-white font-serif rounded-lg px-4 py-3 font-bold hover:bg-blue-700 transition-colors text-sm"
          >
            Quick Fallback Login
          </button>
        </div>
        
        {/* FIXED: Create Account Button - Better mobile layout */}
        <div className='relative mb-4'>
          <button 
            type="button"
            onClick={handleCreateAccount}
            className='w-full text-amber-500 cursor-pointer hover:text-amber-700 font-serif text-lg py-3 flex items-center justify-center gap-2'
          >
            <FaUserPlus size={20} className='flex-shrink-0' />
            <span>Create New Account</span>
          </button>
        </div>

        <div className='mt-4 text-center'>
          <p className='text-amber-300 text-sm'>
            {isMobile 
              ? 'For best mobile experience, use Demo Login'
              : 'Enter your username and password to login normally'
            }
          </p>
        </div>

        {/* Debug Info */}
        <div className='mt-4 text-center'>
          <p className='text-amber-500 text-xs'>
            Backend: food-app-fshp.onrender.com
            {isMobile && ' | Mobile Mode'}
          </p>
        </div>

        {/* Login Instructions */}
        <div className='mt-3 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg'>
          <p className='text-amber-300 text-xs text-center'>
            💡 <strong>Normal Login:</strong> Use your registered username and password
          </p>
        </div>
      </form> 
    </div>
  );
}

export default Login;