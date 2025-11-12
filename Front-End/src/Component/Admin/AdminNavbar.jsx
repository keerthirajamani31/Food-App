import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FaBars,
  FaTimes,
  FaUtensils,

} from 'react-icons/fa';

const AdminNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();


  
  return (
    <nav className="bg-gradient-to-r from-amber-800 to-amber-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <FaUtensils className="text-amber-200 text-2xl" />
            <span className="text-amber-100 font-bold text-xl font-serif">
              Foodie-Bazar Admin
            </span>
          </div>

       

          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-amber-200 hover:text-white p-2"
            >
              {isMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden pb-4">
          
          </div>
        )}
      </div>
    </nav>
  );
};

export default AdminNavbar;