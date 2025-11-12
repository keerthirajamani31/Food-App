import React from 'react'
import { FaFacebook } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";

const Footer = () => {
  return (
     <footer className="bg-gradient-to-br from-[#1a120b] to-[#2a1e1e] text-white border-t border-amber-500/30 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col items-center text-center">
          
        
          <div className="flex space-x-6 mb-6">
            <a href="#" className="text-gray-400 hover:text-amber-400 transition-colors transform hover:scale-110">
              <FaFacebook size={20} />
            </a>
            <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors transform hover:scale-110">
              <FaTwitter size={20} />
            </a>
            <a href="#" className="text-gray-400 hover:text-pink-500 transition-colors transform hover:scale-110">
              <FaInstagram size={20} />
            </a>
            <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors transform hover:scale-110">
              <FaLinkedin size={20} />
            </a>
          </div>

          
          <div className="flex flex-wrap justify-center gap-6 mb-6">
            <a href="#" className="text-gray-300 hover:text-amber-400 transition-colors text-sm">Home</a>
            <a href="#" className="text-gray-300 hover:text-amber-400 transition-colors text-sm">Menu</a>
            <a href="#" className="text-gray-300 hover:text-amber-400 transition-colors text-sm">About</a>
            <a href="#" className="text-gray-300 hover:text-amber-400 transition-colors text-sm">Contact</a>
            <a href="#" className="text-gray-300 hover:text-amber-400 transition-colors text-sm">Privacy</a>
          </div>

       
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <span>Made with</span>
            <FaHeart className="text-red-500" size={14} />
            <span>by FoodieBazar © 2024</span>
          </div>

        </div>
      </div>
    </footer>
  
  )
}

export default Footer