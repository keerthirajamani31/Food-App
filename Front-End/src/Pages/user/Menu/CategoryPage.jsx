import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import MenuItemCard from '../Menu/MenuItemCard'

const CategoryPage = ({ allItems }) => {
  const { category } = useParams()
  const navigate = useNavigate()

  console.log('=== CATEGORY PAGE DEBUG ===')
  console.log('URL Category:', category)
  console.log('All items categories:', [...new Set(allItems.map(item => item.category))])
  
  const categoryItems = allItems.filter(item => {
    const itemCategory = item.category.toLowerCase();
    const urlCategory = category.toLowerCase();
    
    // Handle different category mappings
    if (urlCategory === 'breakfast') {
      return itemCategory === 'breakfast' || item.category === 'South Indian Specialties';
    }
    
    if (urlCategory === 'dessert') {
      return itemCategory === 'dessert' || itemCategory === 'desert';
    }
    
    return itemCategory === urlCategory;
  })

  // Format category name for display
  const getFormattedCategoryName = () => {
    const names = {
      breakfast: 'Breakfast',
      lunch: 'Lunch',
      dinner: 'Dinner',
      dessert: 'Dessert',
      drinks: 'Drinks'
    }
    return names[category.toLowerCase()] || category
  }

  const formattedCategoryName = getFormattedCategoryName()
  
  console.log('Filtered items for category:', categoryItems.map(item => item.name))
  console.log('=== END CATEGORY DEBUG ===')

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 py-4 sm:py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Updated Header with better spacing */}
        <div className="text-center mb-6 sm:mb-12">
          <button
            onClick={() => navigate('/menu')}
            className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 sm:py-3 px-4 sm:px-6 rounded-xl transition-all duration-200 flex items-center shadow-md hover:shadow-lg mb-4 sm:mb-6 mx-auto text-sm sm:text-base"
          >
            ← Back to Main Menu
          </button>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-gray-800 capitalize font-serif mb-2 sm:mb-3">
            {formattedCategoryName} <span className="text-orange-600">Menu</span>
          </h1>
          <p className="text-gray-600 text-sm sm:text-lg max-w-2xl mx-auto">
            Discover our delicious {formattedCategoryName.toLowerCase()} options, each crafted with authentic flavors
          </p>
        </div>
        
        {categoryItems.length > 0 ? (
          // Updated grid with proper spacing
          <div className='grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6'>
            {categoryItems.map((item) => (
              <MenuItemCard 
                key={item._id} 
                item={item} 
                theme="light"
              />
            ))}
          </div>
        ) : (
          <EmptyState 
            message={`No ${formattedCategoryName.toLowerCase()} items found`}
            subMessage="Check back later for new additions to our menu"
            onBack={() => navigate('/menu')}
            backLabel="Back to Main Menu"
          />
        )}
      </div>
    </div>
  )
}

const EmptyState = ({ message, subMessage, onBack, backLabel }) => (
  <div className="text-center py-12">
    <div className="bg-white rounded-2xl p-8 max-w-md mx-auto shadow-lg">
      <p className="text-gray-600 text-xl font-semibold mb-2">{message}</p>
      <p className="text-gray-500 text-sm mb-6">{subMessage}</p>
      <button
        onClick={onBack}
        className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300"
      >
        {backLabel}
      </button>
    </div>
  </div>
)

export default CategoryPage