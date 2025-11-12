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
      // First, check if user exists in the API
      const usersResponse = await fetch('http://localhost:3000/api/users/all');
      const usersData = await usersResponse.json();

      if (!usersResponse.ok) {
        throw new Error('Failed to connect to server');
      }

      if (usersData.success && usersData.users) {
        const userExists = usersData.users.find(u => u.username === formData.username);
        
        if (!userExists) {
          setError('User not found! Please register first.');
          setLoading(false);
          return;
        }

        // Since we don't have a proper login endpoint yet, we'll use this approach
        // In production, you should create a proper login endpoint
        await attemptLogin();
      } else {
        throw new Error('Invalid response from server');
      }

    } catch (error) {
      console.error('Login error:', error);
      setError('Server error. Please try again later.');
      setLoading(false);
    }
  };

  const attemptLogin = async () => {
    try {
      // For now, we'll fetch all users and simulate login
      // This is a temporary solution until you implement proper authentication
      const response = await fetch('http://localhost:3000/api/users/all');
      const data = await response.json();

      if (data.success && data.users) {
        const user = data.users.find(u => u.username === formData.username);
        
        if (user) {
          // Store user info (without password)
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
          
          console.log('✅ Login successful, user data:', userInfo);
          alert(`Welcome back, ${user.fullName || user.username}!`);
          navigate('/menu');
        } else {
          setError('Invalid credentials!');
        }
      }
    } catch (error) {
      console.error('Login attempt error:', error);
      setError('Login failed. Please try again.');
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

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg">
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}
        
        <div className='relative mb-5 text-amber-500'>
          <LuUserRoundPen size={20} className='absolute left-3 items-center top-1/2 transform -translate-y-1/2'/>
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
          <FaLock size={20} className='absolute left-3 items-center top-1/2 transform -translate-y-1/2'/>
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
        
        <div className='relative flex'>
          <FaUserPlus size={20} className='text-amber-500 absolute left-25 items-center top-1/2 transform -translate-y-1/2 hover:text-amber-700' />
          <button 
            type="button"
            onClick={handleCreateAccount}
            className='w-full text-amber-500 cursor-pointer hover:text-amber-700 font-serif text-lg'
          >
            Create New Account
          </button>
        </div>

        <div className='mt-4 text-center'>
          <p className='text-amber-300 text-sm'>
            Only registered users can login. Please register first if you don't have an account.
          </p>
        </div>
      </form> 
    </div>
  );
}

export default Login;