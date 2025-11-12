import React from 'react'

const VarietyDetails = ({ variety, currentItem, category, onClose, onAddToCart }) => {
  if (!variety) return null

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      {/* Header with Image */}
      <div className="relative h-80 sm:h-96 px-4 sm:px-6 lg:px-8 pt-6">
        <div className="relative h-full rounded-3xl overflow-hidden">
          <img
            src={variety.image}
            alt={variety.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30"></div>
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white hover:bg-gray-100 text-gray-800 w-10 h-10 rounded-full flex items-center justify-center shadow-2xl transition-all duration-200 text-lg font-bold z-10"
          >
            ✕
          </button>

          <div className="absolute bottom-6 left-6 right-6 text-white">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between">
              <div className="flex-1">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif mb-3">
                  {variety.name}
                </h1>
                <div className="flex flex-wrap items-center gap-3 text-sm sm:text-base">
                  <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                    ⭐ {variety.rating}/5
                  </span>
                  <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                    {currentItem?.name}
                  </span>
                  <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                    {category}
                  </span>
                </div>
              </div>
              <div className="mt-3 lg:mt-0 lg:ml-6">
                <div className="text-3xl sm:text-4xl font-bold text-green-300">
                  ₹{variety.price}
                </div>
                <div className="text-white/80 text-sm">per serving</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 font-serif border-b-2 border-orange-500 pb-3">
                About this Dish
              </h2>
              <p className="text-gray-700 text-lg leading-relaxed">
                {variety.description}
              </p>
            </section>

            {variety.ingredients && (
              <section className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 font-serif border-b-2 border-orange-500 pb-3">
                  Ingredients
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {variety.ingredients.map((ingredient, index) => (
                    <div key={index} className="flex items-center bg-orange-50 rounded-xl p-3 sm:p-4 hover:bg-orange-100 transition-colors duration-200">
                      <span className="w-2 h-2 bg-orange-500 rounded-full mr-3 sm:mr-4 flex-shrink-0"></span>
                      <span className="text-gray-800 text-base sm:text-lg capitalize font-medium">{ingredient}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            <section className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 font-serif border-b-2 border-orange-500 pb-3">
                Nutritional Information
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                <div className="text-center bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-4 sm:p-6 border border-orange-200">
                  <div className="text-2xl sm:text-3xl font-bold text-orange-600">250-350</div>
                  <div className="text-gray-600 font-medium text-sm sm:text-base">Calories</div>
                </div>
                <div className="text-center bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-4 sm:p-6 border border-orange-200">
                  <div className="text-2xl sm:text-3xl font-bold text-orange-600">8-12g</div>
                  <div className="text-gray-600 font-medium text-sm sm:text-base">Protein</div>
                </div>
                <div className="text-center bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-4 sm:p-6 border border-orange-200">
                  <div className="text-2xl sm:text-3xl font-bold text-orange-600">45-60g</div>
                  <div className="text-gray-600 font-medium text-sm sm:text-base">Carbs</div>
                </div>
                <div className="text-center bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-4 sm:p-6 border border-orange-200">
                  <div className="text-2xl sm:text-3xl font-bold text-orange-600">10-15g</div>
                  <div className="text-gray-600 font-medium text-sm sm:text-base">Fat</div>
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <section className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-800 mb-4 font-serif text-center">
                Serving Details
              </h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">⏱️</span>
                  <div>
                    <div className="font-bold text-gray-800">Preparation Time</div>
                    <div className="text-gray-600 text-sm">15-20 minutes</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="text-2xl mr-3">🍽️</span>
                  <div>
                    <div className="font-bold text-gray-800">Serving Size</div>
                    <div className="text-gray-600 text-sm">1 plate (2 pieces)</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="text-2xl mr-3">🌶️</span>
                  <div>
                    <div className="font-bold text-gray-800">Spice Level</div>
                    <div className="text-gray-600 text-sm">Medium</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="text-2xl mr-3">⭐</span>
                  <div>
                    <div className="font-bold text-gray-800">Customer Rating</div>
                    <div className="text-gray-600 text-sm">{variety.rating}/5 from 250+ reviews</div>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-amber-50 rounded-2xl p-6 border border-amber-200">
              <h3 className="text-xl font-bold text-gray-800 mb-3 font-serif text-center">
                Allergen Info
              </h3>
              <div className="space-y-2">
                <div className="flex items-center text-green-600">
                  <span className="text-lg mr-2">✅</span>
                  <span className="font-medium text-sm">Vegetarian</span>
                </div>
                <div className="flex items-center text-green-600">
                  <span className="text-lg mr-2">✅</span>
                  <span className="font-medium text-sm">No Nuts</span>
                </div>
                <div className="flex items-center text-amber-600">
                  <span className="text-lg mr-2">⚠️</span>
                  <span className="font-medium text-sm">Contains Gluten</span>
                </div>
                <div className="flex items-center text-green-600">
                  <span className="text-lg mr-2">✅</span>
                  <span className="font-medium text-sm">Dairy Free Options</span>
                </div>
              </div>
            </section>

            <section className="bg-white rounded-2xl p-6 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-800 mb-4 font-serif text-center">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <button
                  onClick={() => {
                    onAddToCart(variety)
                    onClose()
                  }}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 text-sm"
                >
                  🛒 Add to Cart - ₹{variety.price}
                </button>
                <button
                  onClick={onClose}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-3 px-4 rounded-xl transition-all duration-300 border border-gray-300 text-sm"
                >
                  Continue Browsing
                </button>
              </div>
            </section>
          </div>
        </div>

        <section className="mt-12 pt-8 border-t border-gray-200">
          <div className="text-center">
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 font-serif">
              Ready to Order?
            </h3>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-2xl mx-auto">
              <button
                onClick={() => {
                  onAddToCart(variety)
                  onClose()
                }}
                className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 text-lg shadow-xl"
              >
                🛒 Add to Cart - ₹{variety.price}
              </button>
              <button
                onClick={onClose}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-4 px-6 rounded-xl transition-all duration-300 border-2 border-gray-300 text-lg"
              >
                Continue Browsing
              </button>
            </div>
            <p className="text-gray-600 mt-4 text-sm">
              Free delivery on orders above ₹299 • 30-minute delivery guarantee
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}

export default VarietyDetails