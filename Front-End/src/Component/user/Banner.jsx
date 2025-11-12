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
      <div className='min-h-screen bg-gradient-to-br from-amber-900 via-amber-800 to-amber-700 text-white py-6 px-4 sm:px-8 relative overflow-hidden'>
        <div className='absolute inset-0 bg-gradient-to-r from-amber-900/20 to-amber-700/10'>
          <div className='max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12 relative z-10 min-h-screen justify-center'>
            {/* leftside */}
            <div className='flex-1 space-y-6 text-left'>
              <div className='space-y-6'>
                <h1 className='text-5xl md:text-5xl font-bold font-serif'>We're here</h1>
                <span className='text-5xl md:text-5xl font-bold text-amber-400 block'>For Food & Delivery</span>
              </div>
              <p className='italic text-lg sm:text-xl text-amber-100 max-w-2xl mx-auto md:mx-0'>Best cooks and best delivery guys all at your service. Hot tasty food will reach you in 60 minutes.</p>
             
            </div>
            
        
            <div className='flex-1 relative group mt-8 md:mt-0 min-h-[300px] sm:min-h-[400px] flex items-center justify-center'>
             
              <div className='absolute w-[400px] h-[400px] animate-spin-slow'>
              
                <div className='absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-amber-400'>
                  <img src='https://i.pinimg.com/736x/85/9a/de/859adef90e854238d9b330d0c7d2cf73.jpg' alt='Food 1' className='w-full h-full object-cover' />
                </div>

                <div className='absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-amber-400'>
                  <img src='https://i.pinimg.com/736x/6a/2e/59/6a2e59a39437d6a74f50812f29c9342a.jpg' alt='Food 2' className='w-full h-full object-cover' />
                </div>

           
                <div className='absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-amber-400'>
                  <img src='https://i.pinimg.com/736x/95/ca/0f/95ca0f0a0522dd291c33cf750017d749.jpg' alt='Food 3' className='w-full h-full object-cover' />
                </div>

          
                <div className='absolute top-1/2 left-0 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-amber-400'>
                  <img src='https://i.pinimg.com/736x/41/d6/55/41d6550e96ee3c1cad6b3f88949500bc.jpg' alt='Food 4' className='w-full h-full object-cover' />
                </div>
              </div>

         
              <div className='relative rounded-full p-1 bg-gradient-to-br from-amber-800 to-amber-400 shadow-2xl z-20 w-[250px] xs:w-[300px] sm:w-[350px] h-[250px] xs:h-[300px] sm:h-[350px]'>
                <img 
                  src='https://i.pinimg.com/736x/b9/e3/67/b9e36739fb1e4d53879a4fa8c3efbf3b.jpg' 
                  alt='Banner' 
                  className='rounded-full border-4 xs:border-8 border-amber-900/50 w-full h-full object-cover object-top' 
                />
                <div className='absolute inset-0 rounded-full bg-gradient-to-b from-transparent to-amber-900/40 mix-blend-multiply'></div>
              </div>
            </div>
          </div>
        </div>
      </div>

 
      <div className='min-h-screen bg-gradient-to-b from-[#1a1212] to-[#2a1e1e] text-white py-16 px-4 font-[Poppins]'>
        <div className='text-center text-amber-400 text-6xl'>
          <h1 className='italic'>Today's Special Offers</h1>
          <span className='text-xl font-serif text-white'>Savor the extraordinary with our culinary masterpieces crafted to perfection.</span>
        </div>
   
        <div className="max-w-7xl mx-auto mt-19">
          <div className='grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-6'>
            {displayedItems.map((item, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl hover:shadow-amber-500/20 transition-all duration-300 transform hover:-translate-y-2 border border-amber-900/30 overflow-hidden group cursor-pointer"
              >
                <img src={item.image} alt={item.title} className="w-full h-40 md:h-32 lg:h-70 object-cover" />
                <div className="p-4 h-60">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-2xl font-bold text-white group-hover:text-amber-400 transition-colors duration-300">
                      {item.title}
                    </h3>
                    <span className="text-amber-500 px-4 py-2 rounded-full text-sm font-semibold flex gap-4">
                      <FaStar />
                      {item.rating}
                    </span>
                  </div>
                  
                  <p className="text-gray-300 leading-relaxed group-hover:text-white transition-colors duration-300 text-lg">
                    {item.description}
                  </p>
                  <div className='flex justify-between mt-3'>
                    <p className="mt-6 hover:text-amber-500 text-amber-600 px-2 py-3 flex items-center font-semibold transition-colors duration-300 transform group-hover:scale-105">
                      <FaRupeeSign className="mr-1" />
                      {item.price}
                    </p>
                  
                    <button
                      onClick={() => handleAddToCart(item)}
                      className="mt-6 bg-amber-600 hover:bg-amber-500 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-300"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className='flex justify-center mt-8 gap-4'> 
            {hasMoreItems && (
              <button 
                className='cursor-pointer hover:text-red-500 w-40 p-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-semibold'
                onClick={handleShowMore}
              >
                Show more
              </button>
            )}
            {visibleItems > 4 && (
              <button 
                onClick={handleShowLess}
                className='cursor-pointer hover:bg-gray-600 w-40 p-3 bg-gray-700 text-white rounded-full font-semibold transition-colors duration-300'
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