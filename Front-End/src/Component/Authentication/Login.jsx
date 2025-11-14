import React, { useState } from 'react'
import { LuUserRoundPen } from "react-icons/lu";
import { FaLock } from "react-icons/fa";
import { FaUserPlus } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
import { MobileAuth } from '../../utils/auth'; // Adjust path based on your structure

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [usingOfflineMode, setUsingOfflineMode] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
    setUsingOfflineMode(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setUsingOfflineMode(false);

    if (!formData.username || !formData.password) {
      setError('Please enter both username and password');
      setLoading(false);
      return;
    }

    // First try backend API (for laptop users)
    try {
      console.log('🖥️ Trying backend login...');
      
      const API_BASE_URL = 'https://food-app-fshp.onrender.com';
      
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

      if (loginResponse.ok) {
        const data = await loginResponse.json();
        console.log('✅ Backend login successful:', data);
        
        if (data.success) {
          const userInfo = {
            id: data.user._id || data.user.id,
            fullName: data.user.fullName || data.user.username,
            username: data.user.username,
            emailAddress: data.user.emailAddress || data.user.email,
            phoneNumber: data.user.phoneNumber || data.user.phone,
            isLoggedIn: true,
            loginTime: new Date().toISOString()
          };
          
          localStorage.setItem('user', JSON.stringify(userInfo));
          localStorage.setItem('isLoggedIn', 'true');
          
          window.dispatchEvent(new Event('storage'));
          const loginEvent = new CustomEvent('userLoggedIn', { detail: userInfo });
          window.dispatchEvent(loginEvent);
          
          console.log('🔑 User saved to localStorage:', userInfo);
          alert(`Welcome back, ${userInfo.fullName || userInfo.username}!`);
          
          setTimeout(() => {
            navigate('/menu');
          }, 100);
          return;
        }
      }
    } catch (backendError) {
      console.log('⚠️ Backend login failed, trying offline mode...');
    }

    // If backend fails, try offline mode (for mobile users)
    try {
      console.log('📱 Trying offline login...');
      setUsingOfflineMode(true);
      
      const userInfo = await MobileAuth.login(formData.username, formData.password);
      
      window.dispatchEvent(new Event('storage'));
      const loginEvent = new CustomEvent('userLoggedIn', { detail: userInfo });
      window.dispatchEvent(loginEvent);
      
      console.log('🔑 Offline login successful:', userInfo);
      alert(`Welcome back, ${userInfo.fullName || userInfo.username}! (Offline Mode)`);
      
      setTimeout(() => {
        navigate('/menu');
      }, 100);

    } catch (offlineError) {
      console.error('❌ All login methods failed:', offlineError);
      setError(offlineError.message || 'Login failed. Please check your credentials and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAccount = () => {
    navigate('/register');
  };

  const handleClose = () => {
    navigate('/'); 
  };

  // Demo login for quick testing
  const handleDemoLogin = (demoUser) => {
    setFormData({
      username: demoUser.username,
      password: demoUser.password
    });
    setUsingOfflineMode(true);
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

        {usingOfflineMode && (
          <div className="mb-4 p-3 bg-blue-500/20 border border-blue-500 rounded-lg">
            <p className="text-blue-300 text-sm text-center">
              📱 Using offline mode
            </p>
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
        <div className="mb-4 space-y-2">
          <p className="text-amber-300 text-sm text-center mb-2">Quick Demo Login:</p>
          <div className="flex gap-2">
            <button 
              type="button"
              onClick={() => handleDemoLogin({ username: 'demo', password: 'demo123' })}
              className="flex-1 bg-green-600 text-white py-2 rounded-lg text-sm hover:bg-green-700 transition-colors"
            >
              Demo User
            </button>
            <button 
              type="button"
              onClick={() => handleDemoLogin({ username: 'test', password: 'test123' })}
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors"
            >
              Test User
            </button>
          </div>
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

        {/* Mode indicator */}
        <div className="mt-4 p-3 bg-green-500/20 border border-green-500 rounded-lg">
          <p className="text-green-300 text-xs text-center">
            ✅ <strong>Smart Mode:</strong> Tries backend first, falls back to offline
          </p>
        </div>
      </form> 
    </div>
  );
}

export default Login;