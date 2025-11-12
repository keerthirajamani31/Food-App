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
  
  console.log('Filtered items for category:', categoryItems.map(item => item.name))
  console.log('=== END CATEGORY DEBUG ===')

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <PageHeader 
          title={`${category} Menu (${categoryItems.length} items)`}
          onBack={() => navigate('/menu')}
          backLabel="Back to Categories"
        />
        
        {categoryItems.length > 0 ? (
       
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
            message={`No items found in ${category} category`}
            subMessage="Available categories: Breakfast, Lunch, Dinner, Dessert, Drinks"
            onBack={() => navigate('/menu')}
            backLabel="Back to Main Menu"
          />
        )}
      </div>
    </div>
  )
}

const PageHeader = ({ title, onBack, backLabel }) => (
  <div className="flex items-center justify-between mb-8">
    <button
      onClick={onBack}
      className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-colors duration-200 flex items-center"
    >
      ← {backLabel}
    </button>
    <h1 className="text-3xl font-bold text-gray-900 capitalize">
      {title}
    </h1>
    <div className="w-24"></div>
  </div>
)

const EmptyState = ({ message, subMessage, onBack, backLabel }) => (
  <div className="text-center py-12">
    <p className="text-gray-600 text-xl">{message}</p>
    <p className="text-gray-500 mt-2">{subMessage}</p>
    <button
      onClick={onBack}
      className="mt-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg"
    >
      {backLabel}
    </button>
  </div>
)

export default CategoryPage