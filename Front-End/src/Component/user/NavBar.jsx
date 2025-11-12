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
    setOpen(false); // Close menu after logout
  };

  const handleCartClick = (e) => {
    if (!user) {
      e.preventDefault();
      alert('Please login to view your cart!');
      navigate('/login');
    }
    setOpen(false); // Close menu after cart click
  };

  const closeMenu = () => {
    setOpen(false);
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

          {/* Logo */}
          <div className='flex-shrink-0 flex items-center space-x-2 group relative z-40'>
            <div className='absolute -inset-4 bg-amber-500/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
            <GiChefToque className='text-2xl md:text-4xl lg:text-5xl text-amber-500 transition-all group-hover:rotate-12 group-hover:text-amber-400 relative z-10' />
            <div className='flex flex-col relative ml-2'>
              <Link
                to="/"
                className='text-xl md:text-3xl lg:text-4xl bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent font-monsieur tracking-wider drop-shadow-[0_2px_2px] drop-shadow-black hover:from-amber-300 hover:to-amber-500 transition-all duration-200'
                onClick={closeMenu}
              >
                Foodie-Bazar
              </Link>
            </div>
          </div>

          {/* Desktop Navigation - Hidden on mobile */}
          <div className='hidden md:flex items-center space-x-2 md:space-x-4 lg:space-x-6'>
            <Link 
              to='/'
              className='flex items-center gap-2 rounded-xl px-2 py-2 md:px-4 lg:px-5 text-amber-100 hover:text-amber-400 font-medium transition-all duration-200 text-sm md:text-base'
            >
              <FaHome className='text-sm md:text-lg' />
              <span>Home</span>
            </Link>
            
            <Link 
              to='/menu'
              className='flex items-center gap-2 rounded-xl px-2 py-2 md:px-4 lg:px-5 text-amber-100 hover:text-amber-400 font-medium transition-all duration-200 text-sm md:text-base'
            >
              <MdMenuBook className='text-sm md:text-lg' />
              <span>Menu</span>
            </Link>
            
            <Link 
              to='/about'
              className='flex items-center gap-2 rounded-xl px-2 py-2 md:px-4 lg:px-5 text-amber-100 hover:text-amber-400 font-medium transition-all duration-200 text-sm md:text-base'
            >
              <IoMdStarOutline className='text-sm md:text-lg' />
              <span>About</span>
            </Link>
            
            <Link 
              to='/contact'
              className='flex items-center gap-2 rounded-xl px-2 py-2 md:px-4 lg:px-5 text-amber-100 hover:text-amber-400 font-medium transition-all duration-200 text-sm md:text-base'
            >
              <FaPhoneAlt className='text-sm md:text-lg' />
              <span>Contact</span>
            </Link>
            
            {/* Cart Icon */}
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
              <FaCartPlus className='text-xl md:text-2xl' />
            </Link>

            {/* User Authentication Section */}
            {user ? (
              <div className="flex items-center gap-2 md:gap-3">
                <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
                  <FaUser className="text-amber-400 text-sm" />
                  <span className="text-amber-100 font-medium text-sm">
                    {user.fullName || user.username}
                  </span>
                </div>
                
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 bg-gradient-to-br from-red-500 to-red-700 rounded-md px-3 py-2 text-white hover:from-red-600 hover:to-red-800 transition-all duration-200 text-sm"
                >
                  <FaSignOutAlt className="text-sm" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <Link 
                to="/login"
                className='bg-gradient-to-br from-amber-500 to-amber-700 rounded-md px-3 py-2 text-amber-100 hover:from-amber-600 hover:to-amber-800 transition-all duration-200 flex items-center space-x-2 text-sm'
              >
                <LuKey className="text-sm" />
                <span>Login</span>
              </Link>
            )}
          </div>

          {/* Mobile Right Section - Cart + Hamburger */}
          <div className='md:hidden flex items-center gap-4'>
            {/* Mobile Cart Icon */}
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
              <FaCartPlus className='text-2xl' />
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setOpen(!isOpen)}
              className='p-2 text-amber-100 hover:text-amber-400 transition-colors border border-amber-700 rounded-lg'
            >
              {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div className={`md:hidden absolute top-full left-0 right-0 bg-[#2D1B0E] border-t border-amber-900/30 shadow-lg transition-all duration-300 z-40 ${
          isOpen ? 'max-h-screen opacity-100 py-4' : 'max-h-0 opacity-0 overflow-hidden py-0'
        }`}>
          <div className='px-6 space-y-4'>
            {/* Navigation Links */}
            <Link 
              to='/'
              className='flex items-center gap-4 text-amber-100 hover:text-amber-400 font-medium transition-all duration-200 text-lg py-3 border-b border-amber-900/30'
              onClick={closeMenu}
            >
              <FaHome className="text-amber-400" />
              <span>Home</span>
            </Link>
            
            <Link 
              to='/menu'
              className='flex items-center gap-4 text-amber-100 hover:text-amber-400 font-medium transition-all duration-200 text-lg py-3 border-b border-amber-900/30'
              onClick={closeMenu}
            >
              <MdMenuBook className="text-amber-400" />
              <span>Menu</span>
            </Link>
            
            <Link 
              to='/about'
              className='flex items-center gap-4 text-amber-100 hover:text-amber-400 font-medium transition-all duration-200 text-lg py-3 border-b border-amber-900/30'
              onClick={closeMenu}
            >
              <IoMdStarOutline className="text-amber-400" />
              <span>About</span>
            </Link>
            
            <Link 
              to='/contact'
              className='flex items-center gap-4 text-amber-100 hover:text-amber-400 font-medium transition-all duration-200 text-lg py-3 border-b border-amber-900/30'
              onClick={closeMenu}
            >
              <FaPhoneAlt className="text-amber-400" />
              <span>Contact</span>
            </Link>

            {/* Mobile Authentication Section */}
            <div className="pt-4 border-t border-amber-900/50 space-y-4">
              {user ? (
                <>
                  {/* User Info */}
                  <div className="flex items-center gap-4 text-amber-100 py-2">
                    <FaUser className="text-amber-400" />
                    <span className="font-medium">{user.fullName || user.username}</span>
                  </div>
                  
                  {/* Logout Button */}
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-4 bg-gradient-to-br from-red-500 to-red-700 rounded-lg px-4 py-3 text-white hover:from-red-600 hover:to-red-800 transition-all duration-200 w-full text-lg font-medium"
                  >
                    <FaSignOutAlt />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                /* Login Button */
                <Link 
                  to="/login"
                  className='flex items-center gap-4 bg-gradient-to-br from-amber-500 to-amber-700 rounded-lg px-4 py-3 text-amber-100 hover:from-amber-600 hover:to-amber-800 transition-all duration-200 text-lg font-medium w-full'
                  onClick={closeMenu}
                >
                  <LuKey />
                  <span>Login</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Overlay when mobile menu is open */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setOpen(false)}
        />
      )}
    </nav>
  )
}

export default Navbar