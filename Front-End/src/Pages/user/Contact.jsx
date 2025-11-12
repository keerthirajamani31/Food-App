import React, { useState } from 'react'
import { CiLocationOn } from "react-icons/ci";
import { FaPhoneAlt } from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";
import { LuUserRoundPen } from "react-icons/lu";
import { HiDevicePhoneMobile } from "react-icons/hi2";
import { TfiEmail } from "react-icons/tfi";
import { FaHome } from "react-icons/fa";
import { GiForkKnifeSpoon } from "react-icons/gi";
import { CiChat1 } from "react-icons/ci";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    address: '',
    dishName: '',
    query: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const emptyFields = [];
    
    if (!formData.fullName.trim()) emptyFields.push('Full Name');
    if (!formData.phoneNumber.trim()) emptyFields.push('Phone Number');
    if (!formData.email.trim()) emptyFields.push('Email Address');
    if (!formData.address.trim()) emptyFields.push('Address');
    if (!formData.dishName.trim()) emptyFields.push('Dish Name');
    if (!formData.query.trim()) emptyFields.push('Your Query');
    
    if (emptyFields.length > 0) {
      alert(`Please fill all the details:\n${emptyFields.join('\n')}`);
      return;
    }
    
 
    alert('Successfully query submitted!');
    
  
    setFormData({
      fullName: '',
      phoneNumber: '',
      email: '',
      address: '',
      dishName: '',
      query: ''
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a120b] via-[#2a1e1e] to-[#3e2b1d] py-12 px-4">
      <div className='text-center mb-12'>
        <h1 className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-orange-300 text-4xl sm:text-5xl md:text-6xl pb-17 font-bold animate-fade-in-down">
          Connect With Us
        </h1>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
      
        <div className="space-y-6">
          <div className="bg-white/5 gap-5 flex items-center backdrop-blur-lg text-white rounded-2xl p-8 border border-amber-500/30 shadow-2xl">
            <CiLocationOn className='text-amber-500 text-2xl' />
            <div className='font-serif'>
              <span className='text-xl'>Our Headquarter</span>
              <p>Lucknow, UP</p>
            </div>
          </div>
          <div className="bg-white/5 gap-5 flex items-center text-white backdrop-blur-lg rounded-2xl p-8 border border-amber-500/30 shadow-2xl">
            <FaPhoneAlt className='text-green-500 text-2xl' />
            <div className='font-serif'>
              <span className='text-xl'>Contact Number</span>
              <p>+91 78685788</p>
            </div>
          </div>
          <div className="bg-white/5 gap-5 text-white flex items-center backdrop-blur-lg rounded-2xl p-8 border border-amber-500/30 shadow-2xl">
            <MdOutlineEmail className='text-amber-500 text-2xl' />
            <div className='font-serif'>
              <span className='text-xl'>Email Address</span>
              <p>keerthanaanu3103@gmail.com</p>
            </div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-amber-500/30 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div>
              <p className='text-white'>Full Name</p>
              <div className='relative items-center text-amber-500 gap-4'>
                <div className='absolute left-2 top-1/2 transform -translate-y-1/2 text-amber-500'>
                  <LuUserRoundPen size={20} />
                </div>
                <input 
                  type='text' 
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder='Enter your Full Name' 
                  className='text-white w-full bg-white/10 rounded-lg pl-9 px-4 py-3 border border-amber-500/30'
                />
              </div>
            </div>

        
            <div>
              <p className='text-white'>Phone Number</p>
              <div className='relative items-center text-amber-500 gap-4'>
                <div className='absolute left-2 top-1/2 transform -translate-y-1/2 text-amber-500'>
                  <HiDevicePhoneMobile size={20} />
                </div>
                <input 
                  type='tel' 
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  placeholder='+91 123456789' 
                  className='text-white w-full bg-white/10 rounded-lg pl-9 px-4 py-3 border border-amber-500/30'
                />
              </div>
            </div>

          
            <div>
              <p className='text-white'>Email Address</p>
              <div className='relative items-center text-amber-500 gap-4'>
                <div className='absolute left-2 top-1/2 transform -translate-y-1/2 text-amber-500'>
                  <TfiEmail size={20} />
                </div>
                <input 
                  type='email' 
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder='your.email@example.com' 
                  className='text-white w-full bg-white/10 rounded-lg pl-9 px-4 py-3 border border-amber-500/30'
                />
              </div>
            </div>

            <div>
              <p className='text-white'>Address</p>
              <div className='relative items-center text-amber-500 gap-4'>
                <div className='absolute left-2 top-1/2 transform -translate-y-1/2 text-amber-500'>
                  <FaHome size={20} />
                </div>
                <input 
                  type='text' 
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder='Enter your delivery address' 
                  className='text-white w-full bg-white/10 rounded-lg pl-9 px-4 py-3 border border-amber-500/30'
                />
              </div>
            </div>

           
            <div>
              <p className='text-white'>Dish Name</p>
              <div className='relative items-center text-amber-500 gap-4'>
                <div className='absolute left-2 top-1/2 transform -translate-y-1/2 text-amber-500'>
                  <GiForkKnifeSpoon size={20} />
                </div>
                <input 
                  type='text' 
                  name="dishName"
                  value={formData.dishName}
                  onChange={handleInputChange}
                  placeholder='Enter your dish name' 
                  className='text-white w-full bg-white/10 rounded-lg pl-9 px-4 py-3 border border-amber-500/30'
                />
              </div>
            </div>

         
            <div>
              <p className='text-white'>Your Query</p>
              <div className='relative items-center text-amber-500 gap-4'>
                <div className='absolute left-2 top-7 transform -translate-y-1/2 text-amber-500'>
                  <CiChat1 size={20} />
                </div>
                <textarea
                  name="query"
                  value={formData.query}
                  onChange={handleInputChange}
                  placeholder='Type your message here'
                  rows="4"
                  className='w-full bg-white/10 text-white rounded-lg pl-9 px-4 py-3 border border-amber-500/30 placeholder-gray-400 resize-none'
                ></textarea>
              </div>
            </div>

        
            <div>
              <button 
                type="submit"
                className="w-full bg-gradient-to-r from-amber-500 to-orange-400 text-white font-bold py-3 px-6 rounded-lg hover:from-amber-600 hover:to-orange-500 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Submit Query
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ContactPage