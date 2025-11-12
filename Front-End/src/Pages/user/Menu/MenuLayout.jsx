import React from 'react'
import { Link } from 'react-router-dom'
import MenuItemCard from '../Menu/MenuItemCard'

const MenuLayout = ({ allItems }) => {
  const breakfastItems = allItems.filter(item => 
    item.category === 'Breakfast' || item.category === 'South Indian Specialties'
  )

  console.log('MenuLayout - Breakfast items:', breakfastItems.map(item => item.name))

  return (
    <div>
      <div className='bg-gradient-to-br from-[#1a120b] via-[#2a1e1e] to-[#3e2b1d] min-h-screen'>
        <div className='py-8 sm:py-16 px-4 sm:px-6 lg:px-8'>
          <h2 className='font-serif italic text-2xl sm:text-4xl text-amber-500 text-center'>Our Exquisite Menu</h2>
        </div>
        <span className='font-serif font-bold text-white text-xl sm:text-3xl md:text-4xl lg:text-6xl block text-center px-4'>A SYMPHONY OF FLAVOURS</span>
        
        <CategoryNavigation />
        
        <FeaturedSection items={breakfastItems} />
      </div>
    </div>
  )
}

const CategoryNavigation = () => (
  <div className='flex flex-wrap justify-center gap-2 sm:gap-4 p-4 sm:p-7 text-white'>
    <Link to="/menu/breakfast" className="w-[45%] sm:w-auto">
      <button className='w-full bg-amber-900/20 border-2 border-amber-800/30 text-amber-100/80 hover:bg-amber-800/40 font-serif px-3 sm:px-6 py-2 rounded-full text-sm sm:text-lg transition-all duration-300 whitespace-nowrap'>BREAKFAST</button>
    </Link>
    <Link to="/menu/lunch" className="w-[45%] sm:w-auto">
      <button className='w-full bg-amber-900/20 border-2 border-amber-800/30 text-amber-100/80 hover:bg-amber-800/40 font-serif px-3 sm:px-6 py-2 rounded-full text-sm sm:text-lg whitespace-nowrap'>LUNCH</button>
    </Link>
    <Link to="/menu/dinner" className="w-[45%] sm:w-auto">
      <button className='w-full bg-amber-900/20 border-2 border-amber-800/30 text-amber-100/80 hover:bg-amber-800/40 font-serif px-3 sm:px-6 py-2 rounded-full text-sm sm:text-lg whitespace-nowrap'>DINNER</button>
    </Link>
    <Link to="/menu/dessert" className="w-[45%] sm:w-auto">
      <button className='w-full bg-amber-900/20 border-2 border-amber-800/30 text-amber-100/80 hover:bg-amber-800/40 font-serif px-3 sm:px-6 py-2 rounded-full text-sm sm:text-lg whitespace-nowrap'>DESSERT</button>
    </Link>
    <Link to="/menu/drinks" className="w-[45%] sm:w-auto">
      <button className='w-full bg-amber-900/20 border-2 border-amber-800/30 text-amber-100/80 hover:bg-amber-800/40 font-serif px-3 sm:px-6 py-2 rounded-full text-sm sm:text-lg whitespace-nowrap'>DRINKS</button>
    </Link>
  </div>
)

const FeaturedSection = ({ items }) => (
  <div className="bg-white/10 backdrop-blur-sm mx-2 sm:mx-4 mb-8 rounded-2xl p-4 sm:p-8 border border-amber-800/30">
    <div className="text-center mb-6 sm:mb-8">
      <h1 className="text-2xl sm:text-4xl font-bold text-amber-100 capitalize font-serif">
        Breakfast Menu
      </h1>
    </div>
    
    <div className='grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6'>
      {items.map((item) => (
        <MenuItemCard 
          key={item._id} 
          item={item} 
          theme="dark"
        />
      ))}
    </div>

    {items.length === 0 && (
      <div className="text-center py-8 sm:py-12">
        <p className="text-amber-200 text-lg sm:text-xl">No breakfast items available</p>
      </div>
    )}
  </div>
)

export default MenuLayout