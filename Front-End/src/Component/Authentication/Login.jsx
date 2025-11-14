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

  // Function to sync local storage with backend users
  const syncUsersWithBackend = async () => {
    try {
      const API_BASE_URL = 'https://food-app-fshp.onrender.com';
      const response = await fetch(`${API_BASE_URL}/api/users/all`);
      
      if (response.ok && isJsonResponse(response)) {
        const data = await response.json();
        if (data.success && data.users) {
          // Store backend users in localStorage for mobile fallback
          localStorage.setItem('backendUsers', JSON.stringify(data.users));
          console.log('🔄 Synced backend users to localStorage:', data.users.length);
          return data.users;
        }
      }
    } catch (error) {
      console.log('⚠️ Could not sync with backend, using local data');
    }
    return null;
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
      
      // First, try to sync with backend to get latest users
      const backendUsers = await syncUsersWithBackend();
      
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
        
        // If not JSON, try manual user check
        await tryManualUserCheck(backendUsers);
        return;
      }

      if (loginResponse.ok) {
        const data = await loginResponse.json();
        console.log('✅ Login Successful via API:', data);
        
        if (data.success) {
          await handleSuccessfulLogin(data.user);
          return;
        }
      }

      // If login endpoint fails, try manual user check
      console.log('🔄 Login endpoint failed, trying manual user check...');
      await tryManualUserCheck(backendUsers);

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
          console.error('❌ All login methods failed:', fallbackError);
          setError('Network error. Please check your internet connection and try again.');
        }
      } else {
        setError(error.message || 'Login failed. Please check your credentials and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const tryManualUserCheck = async (backendUsers) => {
    try {
      const API_BASE_URL = 'https://food-app-fshp.onrender.com';
      
      let users = backendUsers;
      
      // If no backend users provided, fetch them
      if (!users) {
        const usersResponse = await fetch(`${API_BASE_URL}/api/users/all`);
        
        if (!isJsonResponse(usersResponse)) {
          throw new Error('Server returned invalid response');
        }

        if (!usersResponse.ok) {
          throw new Error('Failed to fetch users');
        }

        const usersData = await usersResponse.json();
        console.log('📦 Users data received:', usersData.users?.length || 0, 'users');

        if (usersData.success && usersData.users) {
          users = usersData.users;
          // Store for future use
          localStorage.setItem('backendUsers', JSON.stringify(users));
        } else {
          throw new Error('Invalid response from server');
        }
      }

      // Check credentials against users
      const user = users.find(u => 
        u.username === formData.username && 
        u.password === formData.password
      );
      
      if (user) {
        console.log('✅ Manual user check successful');
        await handleSuccessfulLogin(user);
      } else {
        const userExists = users.find(u => u.username === formData.username);
        if (userExists) {
          setError('Invalid password! Please check your password.');
        } else {
          setError('User not found! Please register first.');
        }
      }
    } catch (error) {
      console.error('❌ Manual user check failed:', error);
      throw error;
    }
  };

  const handleSuccessfulLogin = async (userData) => {
    const userInfo = {
      id: userData._id || userData.id,
      fullName: userData.fullName || userData.username,
      username: userData.username,
      emailAddress: userData.emailAddress || userData.email,
      phoneNumber: userData.phoneNumber || userData.phone,
      isLoggedIn: true,
      loginTime: new Date().toISOString()
    };
    
    // Save to localStorage
    localStorage.setItem('user', JSON.stringify(userInfo));
    localStorage.setItem('isLoggedIn', 'true');
    
    // Also save to mobile users list for consistency
    const mobileUsers = JSON.parse(localStorage.getItem('mobileUsers') || '[]');
    const userExists = mobileUsers.find(u => u.username === userInfo.username);
    if (!userExists) {
      mobileUsers.push({
        ...userInfo,
        password: formData.password // Store for local login (not secure for production)
      });
      localStorage.setItem('mobileUsers', JSON.stringify(mobileUsers));
    }
    
    // Force storage event for mobile browsers
    window.dispatchEvent(new Event('storage'));
    
    // Dispatch custom event
    const loginEvent = new CustomEvent('userLoggedIn', { 
      detail: userInfo 
    });
    window.dispatchEvent(loginEvent);
    
    console.log('🔑 User logged in successfully:', userInfo);
    
    alert(`Welcome back, ${userInfo.fullName || userInfo.username}!`);
    
    // Navigate to menu
    setTimeout(() => {
      navigate('/menu');
    }, 100);
  };

  // Local storage fallback login for mobile when API is completely down
  const tryLocalStorageLogin = async () => {
    return new Promise((resolve, reject) => {
      try {
        // Check multiple user sources
        const backendUsers = JSON.parse(localStorage.getItem('backendUsers') || '[]');
        const mobileUsers = JSON.parse(localStorage.getItem('mobileUsers') || '[]');
        const foodAppUsers = JSON.parse(localStorage.getItem('foodAppUsers') || '[]');
        
        const allUsers = [...backendUsers, ...mobileUsers, ...foodAppUsers];
        console.log('🔍 Checking local storage users:', allUsers.length);
        
        const user = allUsers.find(u => 
          u.username === formData.username && 
          u.password === formData.password
        );
        
        if (user) {
          const userInfo = {
            id: user.id || user._id,
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
          
          console.log('🔑 User logged in via local storage:', userInfo);
          
          alert(`Welcome back, ${userInfo.fullName || userInfo.username}! (Offline Mode)`);
          
          setTimeout(() => {
            navigate('/menu');
          }, 100);
          resolve(true);
        } else {
          const userExists = allUsers.find(u => u.username === formData.username);
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
            📱 <strong>Mobile Users:</strong> Having issues? Try registering again or check your network connection.
          </p>
        </div>
      </form> 
    </div>
  );
}

export default Login;