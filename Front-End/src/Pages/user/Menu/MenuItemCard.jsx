import React from 'react'
import { useNavigate } from 'react-router-dom'

const MenuItemCard = ({ item, theme = 'light' }) => {
  const navigate = useNavigate()
  const isDark = theme === 'dark'
  
  const cardClasses = `
    rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer transform hover:scale-105
    ${isDark 
      ? 'bg-white/10 backdrop-blur-md border border-amber-800/30' 
      : 'bg-white border border-gray-100'
    }
  `

  const titleClasses = `font-bold ${isDark ? 'text-amber-100' : 'text-gray-800'} text-sm sm:text-base md:text-xl line-clamp-1`
  const descriptionClasses = `leading-relaxed ${isDark ? 'text-amber-200' : 'text-gray-600'} text-xs sm:text-sm line-clamp-3`
  const ratingClasses = `flex items-center justify-center ${isDark 
    ? 'bg-yellow-500/20 text-yellow-300' 
    : 'bg-yellow-100 text-yellow-800'
  } rounded-full text-xs font-bold w-10 h-6 sm:w-12 sm:h-7`
  
  const ctaClasses = `text-center font-semibold py-2 border-t pt-3 ${
    isDark 
      ? 'text-orange-300 border-amber-800/30' 
      : 'text-orange-500 border-gray-200'
  } text-xs sm:text-sm`

  const handleClick = () => {
    console.log('MenuItemCard clicked:', item.name)
    
    let urlCategory = item.category.toLowerCase()
    if (item.category === 'South Indian Specialties') {
      urlCategory = 'breakfast'
    }
    

    const encodedItemName = encodeURIComponent(item.name)
    const targetUrl = `/menu/${urlCategory}/${encodedItemName}`
    
    console.log('Navigating to:', targetUrl)
    navigate(targetUrl)
  }

  return (
    <div 
      className={cardClasses}
      onClick={handleClick}
    >
      <div className="h-32 sm:h-40 md:h-56 overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
        />
      </div>

      <div className="p-3 sm:p-4 md:p-6 flex flex-col h-32 sm:h-36 md:h-40">
      
        <div className="flex justify-between items-start mb-2 gap-2">
          <h3 className={titleClasses}>{item.name}</h3>
          <span className={ratingClasses}>
            ⭐{item.rating}
          </span>
        </div>

        <p className={`${descriptionClasses} flex-1 overflow-hidden`}>
          {item.description}
        </p>

       
        <div className={ctaClasses}>
          View {item.varieties?.length || 0} varieties →
        </div>
      </div>
    </div>
  )
}

export default MenuItemCard