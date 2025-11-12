import React from 'react'
import { PiBowlFoodBold } from "react-icons/pi";
import { GiCampCookingPot } from "react-icons/gi";
import { MdDeliveryDining } from "react-icons/md";

const AboutPage = () => {
  return (
    <div className='bg-gradient-to-br from-[#1a120b] via-[#2a1e1e] to-[#3e2b1d] min-h-screen p-8'>

      <div className='text-center mb-12'>
        <h1 className='text-amber-600 text-4xl font-serif font-bold'>CULINARY EXPRESS</h1>
        <p className='text-white mt-6 mb-8 text-lg max-w-2xl mx-auto'>
          Crafting unforgettable dining experiences delivered to your doorstep.
        </p>
      </div>


      <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto items-center mb-16'>

        <div className='flex justify-center'>
          <img
            src='https://i.pinimg.com/736x/17/f7/90/17f790f916598cb612d864ee13ed8e35.jpg'
            alt='About Culinary Express'
            className='rounded-lg shadow-lg w-full max-w-md lg:max-w-lg object-cover h-96 lg:h-[500px]'
          />
        </div>
        <div className='px-4'>
          <h1 className='text-white text-3xl lg:text-4xl p-4 font-bold font-serif'>
            About <span className='text-amber-500'>Us</span>
          </h1>
          <p className='text-white font-serif p-4 text-lg lg:text-xl leading-relaxed'>
            At Culinary Express, we believe that great food should be accessible to everyone,
            anytime. Our team of passionate chefs crafts each dish with the finest locally sourced
            ingredients, ensuring every bite is a celebration of flavor and quality.
          </p>
          <p className='text-white font-serif p-4 text-lg lg:text-xl leading-relaxed'>
            We're committed to delivering not just meals, but memorable dining experiences right
            to your doorstep. From traditional favorites to innovative culinary creations,
            we bring restaurant-quality food to your home with speed and care.
          </p>
          <div className='p-6'>
            <button className='font-serif p-4 px-8 text-lg border-2 border-amber-500 rounded-full text-amber-500 hover:bg-amber-500 hover:text-white transition-all duration-300'>
              Visit Us
            </button>
          </div>
        </div>
      </div>
      <div className='max-w-6xl mx-auto'>
        <div className='text-center mb-12'>
          <h1 className='text-white font-serif font-bold text-3xl lg:text-4xl'>
            Why Choose our <span className='text-amber-500'>Food</span>
          </h1>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch'>
          <div className='bg-[#2a1e1e] p-8 rounded-lg shadow-lg border border-amber-500/70 hover:bg-amber-700 
          hover:shadow-2xl hover:scale-105 transition-all duration-300 transform group cursor-pointer'>
            <PiBowlFoodBold className='text-4xl text-amber-500 group-hover:text-white mb-4' />
            <h3 className='font-bold font-serif text-xl text-amber-500 group-hover:text-white mb-4'>Quality Food</h3>
            <p className='font-serif text-amber-500 group-hover:text-white leading-relaxed'>
              We use only the freshest, highest quality ingredients sourced from trusted local suppliers.
              Every dish is prepared with care and attention to detail.
            </p>
          </div>

          <div className='bg-[#2a1e1e] p-8 rounded-lg shadow-lg border border-amber-500/70 hover:bg-amber-700 
          hover:shadow-2xl hover:scale-105 transition-all duration-300 transform group cursor-pointer'>
            <GiCampCookingPot className='text-4xl text-amber-500 group-hover:text-white mb-4' />
            <h3 className='font-bold font-serif text-xl text-amber-500 group-hover:text-white mb-4'>Super Taste</h3>
            <p className='font-serif text-amber-500 group-hover:text-white leading-relaxed'>
              Our chefs combine traditional recipes with modern techniques to create unforgettable flavors
              that will keep you coming back for more.
            </p>
          </div>

          <div className='bg-[#2a1e1e] p-8 rounded-lg shadow-lg border border-amber-500/70 hover:bg-amber-700 
          hover:shadow-2xl hover:scale-105 transition-all duration-300 transform group cursor-pointer'>
            <MdDeliveryDining className='text-4xl text-amber-500 group-hover:text-white mb-4' />
            <h3 className='font-bold font-serif text-xl text-amber-500 group-hover:text-white mb-4'>Fast Delivery</h3>
            <p className='font-serif text-amber-500 group-hover:text-white leading-relaxed'>
              Enjoy hot, fresh meals delivered to your door in record time. Our 30-minute delivery
              guarantee ensures you never wait long for quality food.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AboutPage