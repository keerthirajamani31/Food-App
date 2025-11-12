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
    window.dispatchEvent(new Event('authChange'));
    alert('Logged out successfully!');
    navigate('/');
    setOpen(false);
  };

  const handleCartClick = (e) => {
    if (!user) {
      e.preventDefault();
      alert('Please login to view your cart!');
      navigate('/login');
    }
    setOpen(false);
  };

  return (
    <nav className='bg-[#2D1B0E] border-b-8 border-amber-900/30 shadow-amber-900/30 sticky top-0 z-50 shadow-[0_25px_50px_-12px] font-vibes'>
   
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
          <div className='flex-shrink-0 flex items-center space-x-2'>
            <GiChefToque className='text-2xl md:text-4xl lg:text-5xl text-amber-500' />
            <div className='flex flex-col ml-2'>
              <Link
                to="/"
                className='text-xl md:text-3xl lg:text-4xl bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent font-monsieur tracking-wider'
              >
                Foodie-Bazar
              </Link>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className='hidden md:flex items-center space-x-4 lg:space-x-6'>
            <Link to='/' className='flex items-center gap-2 text-amber-100 hover:text-amber-400'>
              <FaHome />
              <span>Home</span>
            </Link>
            <Link to='/menu' className='flex items-center gap-2 text-amber-100 hover:text-amber-400'>
              <MdMenuBook />
              <span>Menu</span>
            </Link>
            <Link to='/about' className='flex items-center gap-2 text-amber-100 hover:text-amber-400'>
              <IoMdStarOutline />
              <span>About</span>
            </Link>
            <Link to='/contact' className='flex items-center gap-2 text-amber-100 hover:text-amber-400'>
              <FaPhoneAlt />
              <span>Contact</span>
            </Link>
            
            <Link to='/cart' onClick={handleCartClick} className='text-amber-100 hover:text-amber-400'>
              <FaCartPlus className='text-xl' />
            </Link>

            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-500/10">
                  <FaUser className="text-amber-400" />
                  <span className="text-amber-100">{user.fullName || user.username}</span>
                </div>
                <button onClick={handleLogout} className="flex items-center gap-2 bg-red-600 rounded-md px-3 py-2 text-white hover:bg-red-700">
                  <FaSignOutAlt />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <Link to="/login" className='bg-amber-600 rounded-md px-3 py-2 text-amber-100 hover:bg-amber-700 flex items-center space-x-2'>
                <LuKey />
                <span>Login</span>
              </Link>
            )}
          </div>

          {/* Mobile Right Section */}
          <div className='md:hidden flex items-center gap-4'>
            <Link to='/cart' onClick={handleCartClick} className='text-amber-100'>
              <FaCartPlus className='text-2xl' />
            </Link>

            <button
              onClick={() => setOpen(!isOpen)}
              className='p-2 text-amber-100'
            >
              {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>
          </div>
        </div>

        {/* SIMPLE MOBILE MENU - This will definitely work */}
        {isOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-[#2D1B0E] border-t border-amber-900/30 shadow-lg z-50">
            <div className="px-4 py-4 space-y-4">
              {/* Navigation Links */}
              <Link to='/' className='flex items-center gap-3 text-amber-100 text-lg py-2' onClick={() => setOpen(false)}>
                <FaHome className="text-amber-400" />
                <span>Home</span>
              </Link>
              
              <Link to='/menu' className='flex items-center gap-3 text-amber-100 text-lg py-2' onClick={() => setOpen(false)}>
                <MdMenuBook className="text-amber-400" />
                <span>Menu</span>
              </Link>
              
              <Link to='/about' className='flex items-center gap-3 text-amber-100 text-lg py-2' onClick={() => setOpen(false)}>
                <IoMdStarOutline className="text-amber-400" />
                <span>About</span>
              </Link>
              
              <Link to='/contact' className='flex items-center gap-3 text-amber-100 text-lg py-2' onClick={() => setOpen(false)}>
                <FaPhoneAlt className="text-amber-400" />
                <span>Contact</span>
              </Link>

              {/* User Section */}
              <div className="pt-4 border-t border-amber-900/50">
                {user ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-amber-100 py-2">
                      <FaUser className="text-amber-400" />
                      <span className="font-medium">{user.fullName || user.username}</span>
                    </div>
                    <button onClick={handleLogout} className="flex items-center gap-3 bg-red-600 rounded-lg px-4 py-3 text-white w-full text-lg">
                      <FaSignOutAlt />
                      <span>Logout</span>
                    </button>
                  </div>
                ) : (
                  <Link to="/login" className='flex items-center gap-3 bg-amber-600 rounded-lg px-4 py-3 text-amber-100 w-full text-lg justify-center' onClick={() => setOpen(false)}>
                    <LuKey />
                    <span>Login</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar