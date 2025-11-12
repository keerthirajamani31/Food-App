import React from 'react'
import { FaStar } from "react-icons/fa";
import foodData from '../../utils/offer.json'
import { FaRupeeSign } from "react-icons/fa";
import { useState } from 'react';

const Banner = () => {
  const [visibleItems, setVisibleItems] = useState(4);

  const handleShowMore = () => {
    setVisibleItems(prev => prev + 4);
  };

  const handleShowLess = () => {
    setVisibleItems(4);
  };

  const handleAddToCart = (item) => {
    const newCartItem = {  
      id: `offer-${item.id || item.title}`, 
      name: item.title,
      price: item.price,
      image: item.image,
      description: item.description,
      quantity: 1
    };

    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    const existingItemIndex = existingCart.findIndex(cartItem => cartItem.id === newCartItem.id);
    
    if (existingItemIndex >= 0) {
      existingCart[existingItemIndex].quantity += 1;
    } else {
      existingCart.push(newCartItem);  
    }

    localStorage.setItem('cart', JSON.stringify(existingCart));
    
    alert(`${item.title} added to cart!`);
  };

  const displayedItems = foodData.slice(0, visibleItems);
  const hasMoreItems = visibleItems < foodData.length;
  
  return (
    <div className='relative'>
      {/* Hero Section */}
      <div className='min-h-screen bg-gradient-to-br from-amber-900 via-amber-800 to-amber-700 text-white py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden'>
        <div className='absolute inset-0 bg-gradient-to-r from-amber-900/20 to-amber-700/10'>
          <div className='max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-8 lg:gap-12 relative z-10 min-h-screen justify-center py-8'>
            
            {/* Left Content */}
            <div className='flex-1 space-y-4 lg:space-y-6 text-center lg:text-left px-2'>
              <div className='space-y-3 lg:space-y-6'>
                <h1 className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-serif leading-tight'>
                  We're here
                </h1>
                <span className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-amber-400 block leading-tight'>
                  For Food & Delivery
                </span>
              </div>
              <p className='italic text-base sm:text-lg lg:text-xl text-amber-100 max-w-2xl mx-auto lg:mx-0 leading-relaxed'>
                Best cooks and best delivery guys all at your service. Hot tasty food will reach you in 60 minutes.
              </p>
            </div>
            
            {/* Right Image Content */}
            <div className='flex-1 relative group mt-6 lg:mt-0 min-h-[250px] sm:min-h-[300px] lg:min-h-[400px] flex items-center justify-center w-full max-w-sm lg:max-w-md mx-auto'>
             
              {/* Rotating Food Images */}
              <div className='absolute w-[250px] h-[250px] sm:w-[300px] sm:h-[300px] lg:w-[400px] lg:h-[400px] animate-spin-slow'>
                <div className='absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-full overflow-hidden border-2 border-amber-400'>
                  <img src='https://i.pinimg.com/736x/85/9a/de/859adef90e854238d9b330d0c7d2cf73.jpg' alt='Food 1' className='w-full h-full object-cover' />
                </div>

                <div className='absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-full overflow-hidden border-2 border-amber-400'>
                  <img src='https://i.pinimg.com/736x/6a/2e/59/6a2e59a39437d6a74f50812f29c9342a.jpg' alt='Food 2' className='w-full h-full object-cover' />
                </div>

                <div className='absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-full overflow-hidden border-2 border-amber-400'>
                  <img src='https://i.pinimg.com/736x/95/ca/0f/95ca0f0a0522dd291c33cf750017d749.jpg' alt='Food 3' className='w-full h-full object-cover' />
                </div>

                <div className='absolute top-1/2 left-0 transform -translate-x-1/2 -translate-y-1/2 w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-full overflow-hidden border-2 border-amber-400'>
                  <img src='https://i.pinimg.com/736x/41/d6/55/41d6550e96ee3c1cad6b3f88949500bc.jpg' alt='Food 4' className='w-full h-full object-cover' />
                </div>
              </div>

              {/* Center Main Image */}
              <div className='relative rounded-full p-1 bg-gradient-to-br from-amber-800 to-amber-400 shadow-2xl z-20 w-[180px] h-[180px] sm:w-[220px] sm:h-[220px] lg:w-[300px] lg:h-[300px] xl:w-[350px] xl:h-[350px]'>
                <img 
                  src='https://i.pinimg.com/736x/b9/e3/67/b9e36739fb1e4d53879a4fa8c3efbf3b.jpg' 
                  alt='Banner' 
                  className='rounded-full border-2 sm:border-4 lg:border-8 border-amber-900/50 w-full h-full object-cover object-top' 
                />
                <div className='absolute inset-0 rounded-full bg-gradient-to-b from-transparent to-amber-900/40 mix-blend-multiply'></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Special Offers Section */}
      <div className='min-h-screen bg-gradient-to-b from-[#1a1212] to-[#2a1e1e] text-white py-12 px-4 sm:px-6 font-[Poppins]'>
        <div className='text-center mb-8 sm:mb-12 px-2'>
          <h1 className='italic text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-amber-400 mb-3 sm:mb-4 leading-tight'>
            Today's Special Offers
          </h1>
          <p className='text-sm sm:text-base md:text-lg lg:text-xl font-serif text-white max-w-2xl mx-auto leading-relaxed'>
            Savor the extraordinary with our culinary masterpieces crafted to perfection.
          </p>
        </div>
   
        <div className="max-w-7xl mx-auto">
          {/* CHANGED: grid-cols-2 for mobile, then responsive for larger screens */}
          <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8'>
            {displayedItems.map((item, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg sm:rounded-2xl shadow-lg sm:shadow-2xl hover:shadow-amber-500/20 transition-all duration-300 transform hover:-translate-y-1 border border-amber-900/30 overflow-hidden group cursor-pointer"
              >
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-32 sm:h-48 md:h-40 lg:h-48 object-cover" 
                />
                <div className="p-2 sm:p-4 lg:p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-sm sm:text-xl lg:text-2xl font-bold text-white group-hover:text-amber-400 transition-colors duration-300 flex-1 pr-2">
                      {item.title}
                    </h3>
                    <span className="text-amber-500 px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 whitespace-nowrap">
                      <FaStar className="text-xs" />
                      {item.rating}
                    </span>
                  </div>
                  
                  <p className="text-gray-300 leading-relaxed group-hover:text-white transition-colors duration-300 text-xs sm:text-base mb-2 sm:mb-4 lg:mb-6 line-clamp-2">
                    {item.description}
                  </p>
                  
                  <div className='flex justify-between items-center'>
                    <p className="text-amber-600 hover:text-amber-500 flex items-center font-semibold transition-colors duration-300 text-sm sm:text-lg">
                      <FaRupeeSign className="mr-1" />
                      {item.price}
                    </p>
                  
                    <button
                      onClick={() => handleAddToCart(item)}
                      className="bg-amber-600 hover:bg-amber-500 text-white px-2 sm:px-4 lg:px-6 py-1 sm:py-3 rounded text-xs sm:text-base whitespace-nowrap"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Show More/Less Buttons */}
          <div className='flex flex-col sm:flex-row justify-center items-center mt-6 sm:mt-8 gap-3 sm:gap-4'> 
            {hasMoreItems && (
              <button 
                className='bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 sm:px-8 py-3 rounded-full text-sm sm:text-base font-semibold hover:shadow-lg transition-all duration-300 w-full sm:w-40 text-center'
                onClick={handleShowMore}
              >
                Show More
              </button>
            )}
            {visibleItems > 4 && (
              <button 
                onClick={handleShowLess}
                className='bg-gray-700 hover:bg-gray-600 text-white px-6 sm:px-8 py-3 rounded-full font-semibold transition-colors duration-300 w-full sm:w-40 text-sm sm:text-base text-center'
              >
                Show Less
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Banner