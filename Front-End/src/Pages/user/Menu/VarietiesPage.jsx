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
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 py-4 sm:py-8 px-4">
      <div className="max-w-6xl mx-auto">
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
          <div className="grid grid-cols-1 gap-4 sm:gap-6">
            {varieties.map((variety) => (
              <div 
                key={variety._id}
                className="bg-white rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
              >
                <div className="flex flex-col sm:flex-row h-full">
                  <div className="sm:w-2/5 h-48 sm:h-56 md:h-auto overflow-hidden">
                    <img
                      src={variety.image}
                      alt={variety.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  <div className="sm:w-3/5 p-4 sm:p-6 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-2 sm:mb-3">
                        <h3 className="text-lg sm:text-xl font-bold text-gray-800 font-serif line-clamp-1">
                          {variety.name}
                        </h3>
                        <div className="flex flex-col items-end gap-1">
                          <span className="bg-amber-100 text-amber-800 text-xs font-medium px-2 py-1 rounded-full">
                            {currentItem.name}
                          </span>
                          <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-bold">
                            ⭐ {variety.rating}
                          </span>
                        </div>
                      </div>

                      <p className="text-gray-600 mb-3 sm:mb-4 leading-relaxed text-xs sm:text-sm line-clamp-2">
                        {variety.description}
                      </p>

                      {variety.ingredients && (
                        <div className="mb-3 sm:mb-4">
                          <p className="text-xs text-gray-500 font-semibold mb-1 sm:mb-2">Key Ingredients:</p>
                          <div className="flex flex-wrap gap-1">
                            {variety.ingredients.slice(0, 3).map((ingredient, idx) => (
                              <span 
                                key={idx}
                                className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs"
                              >
                                {ingredient}
                              </span>
                            ))}
                            {variety.ingredients.length > 3 && (
                              <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                                +{variety.ingredients.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-gray-100">
                      <div>
                        <span className="text-xl sm:text-2xl font-bold text-green-600">
                          ₹{variety.price}
                        </span>
                        <span className="text-xs text-gray-500 block">per serving</span>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => onViewDetails(variety)}
                          className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-1 sm:py-2 px-2 sm:px-4 rounded-lg transition-all duration-200 text-xs sm:text-sm border border-gray-300"
                        >
                          Details
                        </button>
                        <button 
                          onClick={() => onAddToCart(variety)}
                          className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-1 sm:py-2 px-2 sm:px-4 rounded-lg transition-all duration-300 transform hover:scale-105 text-xs sm:text-sm"
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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

export default VarietiesPage