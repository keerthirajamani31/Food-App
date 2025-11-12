import React, { useState, useEffect } from 'react'
import { GiChefToque, GiForkKnifeSpoon } from "react-icons/gi";
import { FaCartPlus, FaBars, FaTimes, FaHome, FaPhoneAlt, FaUser, FaSignOutAlt } from "react-icons/fa";
import { LuKey } from "react-icons/lu";
import { Link, useNavigate } from 'react-router-dom'
import { MdMenuBook } from "react-icons/md";
import { IoMdStarOutline } from "react-icons/io";

const Navbar = () => {
  const [isOpen, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Check if user is logged in
  useEffect(() => {
    const checkAuth = () => {
      try {
        const userData = JSON.parse(localStorage.getItem('user') || 'null');
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        
        if (isLoggedIn && userData) {
          setUser(userData);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        setUser(null);
      }
    };

    checkAuth();

    // Listen for login/logout events
    window.addEventListener('storage', checkAuth);
    window.addEventListener('authChange', checkAuth);

    return () => {
      window.removeEventListener('storage', checkAuth);
      window.removeEventListener('authChange', checkAuth);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('isLoggedIn');
    setUser(null);
    
    // Trigger auth change event for other components
    window.dispatchEvent(new Event('authChange'));
    
    alert('Logged out successfully!');
    navigate('/');
  };

  const handleCartClick = (e) => {
    if (!user) {
      e.preventDefault();
      alert('Please login to view your cart!');
      navigate('/login');
    }
  };

  return (
    <nav className='bg-[#2D1B0E] border-b-8 border-amber-900/30 shadow-amber-900/30 sticky top-0 z-50 shadow-[0_25px_50px_-12px] font-vibes overflow-hidden'>
   
      <div className='absolute top-3 left-1/2 -translate-x-1/2 w-full max-w-7xl px-4'>
        <div className='h-[6px] bg-gradient-to-r from-transparent via-amber-600/50 to transparent shadow-[0_0_20px] shadow-amber-500/30'></div>
        <div className='flex justify-between px-6'>
          <GiForkKnifeSpoon className='text-amber-500/40 -mt-4 -ml-2 rotate-45' size={32} />
          <GiForkKnifeSpoon className='text-amber-500/40 -mt-4 mr-2 rotate-45' size={32} />
        </div>
      </div>

     
      <div className='max-w-7xl mx-auto px-4 relative'>
        <div className='flex justify-between items-center h-16 md:h-20 lg:h-24'>

          <div className='flex-shrink-0 flex items-center space-x-2 group relative'>
            <div className='absolute -inset-4 bg-amber-500/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
            <GiChefToque className='text-3xl md:text-4xl lg:text-5xl text-amber-500 transition-all group-hover:rotate-12 group-hover:text-amber-400 relative z-10' />
            <div className='flex flex-col relative ml-2'>
              <Link
                to="/"
                className='text-2xl md:text-3xl lg:text-4xl bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent font-monsieur tracking-wider drop-shadow-[0_2px_2px] drop-shadow-black hover:from-amber-300 hover:to-amber-500 transition-all duration-200'
              >
                Foodie-Bazar
              </Link>
            </div>
          </div>

       
          <div className='flex items-center space-x-2 md:space-x-4 lg:space-x-6'>
            <Link 
              to='/'
              className='flex items-center gap-2 rounded-xl px-2 py-2 md:px-4 lg:px-5 text-amber-100 hover:text-amber-400 font-medium transition-all duration-200 text-sm md:text-base'
            >
              <FaHome className='text-sm md:text-lg' />
              <span className='hidden sm:inline'>Home</span>
            </Link>
            
            <Link 
              to='/menu'
              className='flex items-center gap-2 rounded-xl px-2 py-2 md:px-4 lg:px-5 text-amber-100 hover:text-amber-400 font-medium transition-all duration-200 text-sm md:text-base'
            >
              <MdMenuBook className='text-sm md:text-lg' />
              <span className='hidden sm:inline'>Menu</span>
            </Link>
            
            <Link 
              to='/about'
              className='flex items-center gap-2 rounded-xl px-2 py-2 md:px-4 lg:px-5 text-amber-100 hover:text-amber-400 font-medium transition-all duration-200 text-sm md:text-base'
            >
              <IoMdStarOutline className='text-sm md:text-lg' />
              <span className='hidden sm:inline'>About</span>
            </Link>
            
            <Link 
              to='/contact'
              className='flex items-center gap-2 rounded-xl px-2 py-2 md:px-4 lg:px-5 text-amber-100 hover:text-amber-400 font-medium transition-all duration-200 text-sm md:text-base'
            >
              <FaPhoneAlt className='text-sm md:text-lg' />
              <span className='hidden sm:inline'>Contact</span>
            </Link>
            
            <Link 
              to='/cart'
              onClick={handleCartClick}
              className={`flex items-center justify-center rounded-xl p-2 transition-all duration-200 ${
                user 
                  ? 'text-amber-100 hover:text-amber-400' 
                  : 'text-amber-100/60 cursor-not-allowed'
              }`}
              title={user ? 'View Cart' : 'Please login to view cart'}
            >
              <FaCartPlus className='text-lg md:text-xl lg:text-2xl' />
            </Link>

            {/* User Authentication Section */}
            {user ? (
              <div className="flex items-center gap-2 md:gap-3">
                {/* User Welcome */}
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
                  <FaUser className="text-amber-400 text-sm" />
                  <span className="text-amber-100 font-medium text-sm md:text-base">
                    {user.fullName || user.username}
                  </span>
                </div>
                
                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 bg-gradient-to-br from-red-500 to-red-700 rounded-md px-3 py-2 text-white hover:from-red-600 hover:to-red-800 transition-all duration-200 text-sm md:text-base"
                  title="Logout"
                >
                  <FaSignOutAlt className="text-sm" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              /* Login Button */
              <Link 
                to="/login"
                className='bg-gradient-to-br from-amber-500 to-amber-700 rounded-md px-3 py-2 text-amber-100 hover:from-amber-600 hover:to-amber-800 transition-all duration-200 flex items-center space-x-2 text-sm md:text-base'
              >
                <LuKey className="text-sm" />
                <span className='hidden sm:inline'>Login</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar