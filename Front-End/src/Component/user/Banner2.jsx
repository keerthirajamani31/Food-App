import React from 'react'
import { AiOutlineThunderbolt } from "react-icons/ai";
import { CiClock2 } from "react-icons/ci";
import { TbBrandBooking } from "react-icons/tb";
import { FaFire } from "react-icons/fa";

const Banner2 = () => {
  return (
    <div className='relative min-h-screen bg-gradient-to-br from-amber-900 via-amber-800 to-amber-700 py-8 sm:py-12'>
      <div className='flex flex-col lg:flex-row items-center gap-6 sm:gap-8 lg:gap-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto'>
        
        {/* Image Section */}
        <div className='w-full lg:w-1/2 flex justify-center'>
          <img 
            src='https://i.pinimg.com/1200x/c6/57/4b/c6574b568e4a95c060520149c28e818d.jpg' 
            alt='Restaurant ambiance'
            className='rounded-lg shadow-lg w-full max-w-sm sm:max-w-md lg:max-w-lg h-auto object-cover'
          />
        </div>

        {/* Content Section */}
        <div className='w-full lg:w-1/2 text-center lg:text-left space-y-4 sm:space-y-6'>
          <h2 className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif italic font-bold text-amber-500'>
            Epicurean Elegance
          </h2>
          
          <h3 className='text-lg sm:text-xl md:text-2xl lg:text-3xl font-serif text-white px-2'>
            Where Flavours Dance & Memories Bloom
          </h3>
          
          <div className='bg-amber-600 rounded-lg p-4 sm:p-6 lg:p-7'>
            <p className='font-serif italic text-white text-base sm:text-lg lg:text-xl leading-relaxed'>
              "In our kitchen, passion meets precision. We craft not just meals, but culinary journeys that linger on the palate and in the heart."
            </p>
          </div>

          {/* Features Grid */}
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 py-4 sm:py-6'>
            <div className='flex flex-col items-center text-center'>
              <div className='bg-amber-500 rounded-full flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 text-white mb-2 sm:mb-3'>
                <AiOutlineThunderbolt className='text-lg sm:text-xl lg:text-2xl' />
              </div>
              <span className='font-serif italic text-white font-bold text-sm sm:text-base lg:text-lg mb-1'>
                Instant ordering
              </span>
              <span className='text-white text-xs sm:text-sm'>
                Seamless Digital experience
              </span>
            </div>
            
            <div className='flex flex-col items-center text-center'>
              <div className='bg-pink-400 rounded-full flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 text-white mb-2 sm:mb-3'>
                <CiClock2 className='text-lg sm:text-xl lg:text-2xl' />
              </div>
              <span className='font-serif italic text-white font-bold text-sm sm:text-base lg:text-lg mb-1'>
                Always open
              </span>
              <span className='text-white text-xs sm:text-sm'>
                24/7 Premium experience
              </span>
            </div>
            
            <div className='flex flex-col items-center text-center'>
              <div className='bg-pink-400 rounded-full flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 text-white mb-2 sm:mb-3'>
                <TbBrandBooking className='text-lg sm:text-xl lg:text-2xl' />
              </div>
              <span className='font-serif italic text-white font-bold text-sm sm:text-base lg:text-lg mb-1'>
                Exclusive Booking
              </span>
              <span className='text-white text-xs sm:text-sm'>
                Priority reservations
              </span>
            </div>
            
            <div className='flex flex-col items-center text-center'>
              <div className='bg-gradient-to-br from-purple-400 to-indigo-600 rounded-full flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 text-white mb-2 sm:mb-3'>
                <FaFire className='text-lg sm:text-xl lg:text-2xl' />
              </div>
              <span className='font-serif italic text-white font-bold text-sm sm:text-base lg:text-lg mb-1'>
                Signature Dishes
              </span>
              <span className='text-white text-xs sm:text-sm'>
                Chef's Special creations
              </span>
            </div>
          </div>

          {/* Button */}
          <div className='bg-amber-500 text-white font-serif italic p-3 sm:p-4 text-base sm:text-lg lg:text-xl rounded-md hover:bg-amber-600 transition-colors duration-300 cursor-pointer text-center lg:text-left'>
            <button className='font-bold w-full'>
              Unveil our legacy
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Banner2