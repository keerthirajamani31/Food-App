import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'

const VarietiesPage = ({ currentItem, onViewDetails, onAddToCart }) => {
  const { category } = useParams()
  const navigate = useNavigate()
  
  const varieties = currentItem?.varieties || []

  console.log('=== VARIETIES PAGE DEBUG ===')
  console.log('Current Item:', currentItem)
  console.log('Varieties:', varieties)
  console.log('=== END DEBUG ===')

  if (!currentItem) {
    return (
      <div className="min-h-screen bg-gray-50 py-4 sm:py-8 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Item not found</h1>
          <button
            onClick={() => navigate(`/menu/${category}`)}
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg text-sm sm:text-base"
          >
            Back to {category}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 py-4 sm:py-8 px-3 sm:px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-6 sm:mb-12">
          <button
            onClick={() => navigate(`/menu/${category}`)}
            className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 sm:py-3 px-4 sm:px-6 rounded-xl transition-all duration-200 flex items-center shadow-md hover:shadow-lg mb-4 sm:mb-6 mx-auto text-sm sm:text-base"
          >
            ← Back to {category}
          </button>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-gray-800 capitalize font-serif mb-2 sm:mb-3">
            {currentItem.name} <span className="text-orange-600">Varieties</span>
          </h1>
          <p className="text-gray-600 text-sm sm:text-lg max-w-2xl mx-auto">
            Discover our delicious range of {currentItem.name.toLowerCase()} options, each crafted with authentic flavors
          </p>
        </div>
        
        {varieties.length > 0 ? (
          // UPDATED: Better gaps and container padding
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 lg:gap-6">
            {varieties.map((variety) => (
              <VarietyCard 
                key={variety._id}
                variety={variety}
                currentItem={currentItem}
                onViewDetails={onViewDetails}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 sm:py-12">
            <p className="text-gray-600 text-lg sm:text-xl">No varieties found for {currentItem.name}</p>
            <button
              onClick={() => navigate(`/menu/${category}`)}
              className="mt-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg text-sm sm:text-base"
            >
              Back to {category}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// Updated VarietyCard with better mobile optimization
const VarietyCard = ({ variety, currentItem, onViewDetails, onAddToCart }) => (
  <div className="bg-white rounded-lg sm:rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 hover:border-orange-200 flex flex-col h-full">
    {/* Image */}
    <div className="h-32 sm:h-40 lg:h-48 overflow-hidden flex-shrink-0">
      <img
        src={variety.image}
        alt={variety.name}
        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
      />
    </div>

    {/* Content */}
    <div className="p-2 sm:p-3 lg:p-4 flex flex-col flex-1">
      {/* Header */}
      <div className="mb-2">
        <h3 className="text-sm sm:text-base font-bold text-gray-800 line-clamp-2 leading-tight mb-1">
          {variety.name}
        </h3>
        <div className="flex justify-between items-center">
          <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full whitespace-nowrap truncate max-w-[100px]">
            {currentItem.name}
          </span>
          <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-bold whitespace-nowrap">
            ⭐{variety.rating}
          </span>
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-600 text-xs leading-relaxed line-clamp-2 mb-2 sm:mb-3 flex-1">
        {variety.description}
      </p>

      {/* Ingredients - Hidden on mobile to save space */}
      {variety.ingredients && variety.ingredients.length > 0 && (
        <div className="mb-2 sm:mb-3 hidden sm:block">
          <p className="text-xs text-gray-500 font-semibold mb-1">Ingredients:</p>
          <div className="flex flex-wrap gap-1">
            {variety.ingredients.slice(0, 2).map((ingredient, idx) => (
              <span 
                key={idx}
                className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs"
              >
                {ingredient}
              </span>
            ))}
            {variety.ingredients.length > 2 && (
              <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                +{variety.ingredients.length - 2}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Price and Actions */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-100 mt-auto">
        <div>
          <span className="text-base sm:text-lg font-bold text-green-600">
            ₹{variety.price}
          </span>
          <span className="text-xs text-gray-500 block">each</span>
        </div>
        <div className="flex gap-1">
          <button 
            onClick={() => onViewDetails(variety)}
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-1 px-2 rounded text-xs border border-gray-300 whitespace-nowrap transition-colors"
          >
            View
          </button>
          <button 
            onClick={() => onAddToCart(variety)}
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-1 px-2 rounded text-xs whitespace-nowrap transition-colors min-w-[50px]"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  </div>
)

export default VarietiesPage