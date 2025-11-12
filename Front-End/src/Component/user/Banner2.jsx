import React from 'react'
import { AiOutlineThunderbolt } from "react-icons/ai";
import { CiClock2 } from "react-icons/ci";
import { TbBrandBooking } from "react-icons/tb";
import { FaFire } from "react-icons/fa";

const Banner2 = () => {
  return (
    <div className='relative space-y-8 sm:space-y-12 min-h-screen   bg-gradient-to-br from-brown-900 via-amber-800 to-amber-700'>
       <div className='flex flex-col lg:flex-row items-center lg:items-center gap-8 p-8'>
  
        <div className='lg:w-1/2 sm:1/4 flex justify-items-center'>
          <img 
            src='https://i.pinimg.com/1200x/c6/57/4b/c6574b568e4a95c060520149c28e818d.jpg' 
            alt='Restaurant ambiance'
            className='rounded-lg shadow-lg max-w-full h-auto object-cover'
          />
        </div>
<div className='w-1/2 justify-items-center p-19'>
   
        <h2 className='items-center'>
            <span className='font-serif italic font-bold text-amber-500 text-xl sm:text-4xl md:text-xl xl:text-4xl'>Epicurean Elegance</span>
        </h2>
        <h3 className='p-7 text-2xl font-serif text-white'>Where Flavours Dance & Memories Bloom</h3>
       <div className='w-auto h-auto p-7 bg-amber-600'>
          <p className='font-serif italic text-white text-xl'>"In our kitchen, passion meets precision. We craft not just meals, but culinary journeys that linger on the palate and in the heart."</p>
       </div>
       <div className='grid grid-cols-1 md:grid-cols-2 sm:grid-cols-2 gap-26 text-4xl justify-between p-10 '>
        <div className='flex flex-col items-center gap-4  justify-center md:justify-start'>
        <div className=' sm:p-5 bg-amber-500  rounded-full flex items-center w-16 h-16 text-white justify-items-center'>
           <AiOutlineThunderbolt />
          </div>
           <span className='font-serif italic text-xl text-white font-bold'>Instant ordering</span>
           <span className='text-sm text-white font-bold'>Seamless Digital experience</span>
          </div>
          
        <div className='flex flex-col items-center gap-4  justify-center md:justify-start'>
           <div className='sm:p-5 bg-pink-400 flex rounded-full items-center w-16 h-16 text-white justify-items-center'>
            <CiClock2 />
          </div>
            <span className='font-serif italic text-xl text-white font-bold'>Always open</span>
            <span className='text-sm text-white font-bold'>24/7 Premium experience</span>
           </div>
           <div className='flex flex-col items-center gap-4  justify-center md:justify-start'>
           <div className='sm:p-5 bg-pink-400 flex rounded-full items-center w-16 h-16 text-white justify-items-center'>
          <TbBrandBooking />
          </div>
            <span className='font-serif italic text-xl text-white font-bold text-nowrap'>Exclusive Booking</span>
            <span className='text-sm text-white font-bold'>Priority reservations</span>
           </div>
        
 
          <div className='flex flex-col items-center gap-4  justify-center md:justify-start'>
           <div className='text-white bg-gradient-to-br from-purple-400 to-indigo-600 flex rounded-full items-center w-16 h-16 justify-items-center sm:p-5'>
           <FaFire />
         </div>
           <span className='font-serif italic text-xl text-white font-bold'>Signature Dishes</span>
           <span className='text-sm text-white font-bold'>Chef's Special creations</span>
         </div>
       </div>

                         <div className='bg-amber-500 text-white  font-serif italic p-4 text-xl rounded-md pointer'>
                          <button className='font-bold'>Unveil our legacy </button>
                         </div>
</div>
</div>
    </div>
  )
}

export default Banner2