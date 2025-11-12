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
      <div className='bg-gradient-to-br from-[#1a120b] via-[#2a1e1e] to-[#3e2b1d] min-h-screen justify-items-center'>
        <div className='py-16 px-4 sm:px-6 lg:px-8 '>
          <h2 className='font-serif italic text-4xl text-amber-500 text-center'>Our Exquisite Menu</h2>
        </div>
        <span className='font-serif font-bold text-white text-3xl sm:text-6xl md:text-4xl block text-center'>A SYMPHONY OF FLAVOURS</span>
        
        <CategoryNavigation />
        
        <FeaturedSection items={breakfastItems} />
      </div>
    </div>
  )
}

const CategoryNavigation = () => (
  <div className='flex flex-wrap justify-center gap-4 p-7 text-white '>
    <Link to="/menu/breakfast">
      <button className='bg-amber-900/20 border-2 border-amber-800/30 text-amber-100/80 hover:bg-amber-800/40 font-serif px-4 sm:px-6 py-2 rounded-full text-lg transition-all duration-300'>BREAKFAST</button>
    </Link>
    <Link to="/menu/lunch">
      <button className='bg-amber-900/20 border-2 border-amber-800/30 text-amber-100/80 hover:bg-amber-800/40 font-serif px-4 sm:px-6 py-2 rounded-full text-lg'>LUNCH</button>
    </Link>
    <Link to="/menu/dinner">
      <button className='bg-amber-900/20 border-2 border-amber-800/30 text-amber-100/80 hover:bg-amber-800/40 font-serif px-4 sm:px-6 py-2 rounded-full text-lg'>DINNER</button>
    </Link>
    <Link to="/menu/dessert">
      <button className='bg-amber-900/20 border-2 border-amber-800/30 text-amber-100/80 hover:bg-amber-800/40 font-serif px-4 sm:px-6 py-2 rounded-full text-lg'>DESSERT</button>
    </Link>
    <Link to="/menu/drinks">
      <button className='bg-amber-900/20 border-2 border-amber-800/30 text-amber-100/80 hover:bg-amber-800/40 font-serif px-4 sm:px-6 py-2 rounded-full text-lg'>DRINKS</button>
    </Link>
  </div>
)

const FeaturedSection = ({ items }) => (
  <div className="bg-white/10 backdrop-blur-sm mx-4 mb-8 rounded-2xl p-8 border border-amber-800/30">
    <div className="text-center mb-8">
      <h1 className="text-4xl font-bold text-amber-100 capitalize font-serif">
        Breakfast Menu
      </h1>
    </div>
    
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
      {items.map((item) => (
        <MenuItemCard 
          key={item._id} 
          item={item} 
          theme="dark"
        />
      ))}
    </div>

    {items.length === 0 && (
      <div className="text-center py-12">
        <p className="text-amber-200 text-xl">No breakfast items available</p>
      </div>
    )}
  </div>
)

export default MenuLayout