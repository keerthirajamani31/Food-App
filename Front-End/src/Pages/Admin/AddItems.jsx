import React, { useState } from 'react';

const AddItems = ({ menuItems, setMenuItems, setCurrentView }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: '',
    ingredients: '',
    subCategory: '',
    rating: '',
    varietyName: '',
    varietyPrice: '',
    varietyDescription: '',
    varietyImage: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasVarieties, setHasVarieties] = useState(false);
  const [varieties, setVarieties] = useState([]);

  const categories = ['Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Drinks'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addVariety = () => {
    if (formData.varietyName && formData.varietyPrice) {
      const newVariety = {
        name: formData.varietyName,
        price: parseFloat(formData.varietyPrice),
        description: formData.varietyDescription || '',
        rating: parseFloat(formData.rating) || 4.5,
        ingredients: formData.ingredients ? formData.ingredients.split(',').map(i => i.trim()) : [],
        image: formData.varietyImage || formData.image || 'https://via.placeholder.com/150'
      };
      
      setVarieties(prev => [...prev, newVariety]);
      
      // Reset variety form fields
      setFormData(prev => ({
        ...prev,
        varietyName: '',
        varietyPrice: '',
        varietyDescription: '',
        varietyImage: ''
      }));
    }
  };

  const removeVariety = (index) => {
    setVarieties(prev => prev.filter((_, i) => i !== index));
  };

  // Enhanced event dispatcher for real-time updates
  const dispatchUpdateEvents = () => {
    window.dispatchEvent(new Event('menuItemsUpdated'));
    window.dispatchEvent(new Event('adminDataChanged'));
    console.log('🔄 Update events dispatched for real-time sync');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate required fields
      if (!formData.name || !formData.description || !formData.price || !formData.category) {
        alert('Please fill in all required fields');
        setIsSubmitting(false);
        return;
      }

      const foodData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        category: formData.category,
        subCategory: formData.subCategory?.trim() || '',
        rating: parseFloat(formData.rating) || 4.5,
        ingredients: formData.ingredients ? formData.ingredients.split(',').map(i => i.trim()).filter(i => i) : [],
        image: formData.image?.trim() || 'https://via.placeholder.com/150',
        varieties: hasVarieties ? varieties : []
      };

      console.log('Sending food data:', foodData);

      let itemAdded = false;

      // UPDATED: Using Render backend URL
      try {
        const response = await fetch('https://food-app-fshp.onrender.com/api/food/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(foodData),
        });

        if (response.ok) {
          const savedItem = await response.json();
          console.log('Successfully created food item via API:', savedItem);
          setMenuItems(prev => [...prev, savedItem]);
          alert('Food item created successfully via API!');
          itemAdded = true;
          
          // Trigger real-time updates
          dispatchUpdateEvents();
        } else {
          throw new Error(`API failed with status: ${response.status}`);
        }
      } catch (apiError) {
        console.log('API failed, using localStorage:', apiError);
        // Fallback to localStorage ONLY if API failed
        const foodDataWithId = {
          _id: `local_${Date.now()}`,
          ...foodData,
          source: 'admin',
          varieties: hasVarieties ? varieties.map((v, index) => ({
            _id: `variety_${Date.now()}_${index}`,
            ...v
          })) : [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        const existingItems = JSON.parse(localStorage.getItem('menuItems') || '[]');
        const updatedItems = [...existingItems, foodDataWithId];
        localStorage.setItem('menuItems', JSON.stringify(updatedItems));
        setMenuItems(updatedItems);
        
        // Trigger real-time updates
        dispatchUpdateEvents();
        
        alert('Food item added to localStorage successfully!');
        itemAdded = true;
      }

      // Only reset and navigate if item was successfully added
      if (itemAdded) {
        // Reset form
        setFormData({
          name: '',
          description: '',
          price: '',
          category: '',
          image: '',
          ingredients: '',
          subCategory: '',
          rating: '',
          varietyName: '',
          varietyPrice: '',
          varietyDescription: '',
          varietyImage: ''
        });
        setVarieties([]);
        setHasVarieties(false);
        
        setCurrentView('listItems');
      }
      
    } catch (error) {
      console.error('Error creating food item:', error);
      alert(`Failed to create food item: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Add New Food Item</h2>
        <button
          onClick={() => setCurrentView('listItems')}
          className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors text-sm font-semibold"
        >
          ← Back to List
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Item Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm sm:text-base"
                placeholder="Enter item name"
                required
                disabled={isSubmitting}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm sm:text-base"
                required
                disabled={isSubmitting}
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm sm:text-base"
              rows="3"
              placeholder="Enter item description"
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price ($) *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm sm:text-base"
                placeholder="0.00"
                step="0.01"
                min="0"
                required
                disabled={isSubmitting}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
              <input
                type="number"
                name="rating"
                value={formData.rating}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm sm:text-base"
                placeholder="4.5"
                step="0.1"
                min="0"
                max="5"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sub Category</label>
              <input
                type="text"
                name="subCategory"
                value={formData.subCategory}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm sm:text-base"
                placeholder="e.g., Vegetarian, Spicy"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ingredients</label>
            <input
              type="text"
              name="ingredients"
              value={formData.ingredients}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm sm:text-base"
              placeholder="Enter ingredients separated by commas"
              disabled={isSubmitting}
            />
            <p className="text-xs text-gray-500 mt-1">Separate ingredients with commas</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Main Image URL</label>
            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm sm:text-base"
              placeholder="https://example.com/image.jpg"
              disabled={isSubmitting}
            />
          </div>

          {/* Varieties Section */}
          <div className="border-t pt-4 sm:pt-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <h3 className="text-base sm:text-lg font-medium text-gray-800">Varieties</h3>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={hasVarieties}
                  onChange={(e) => setHasVarieties(e.target.checked)}
                  className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                  disabled={isSubmitting}
                />
                <span className="text-sm text-gray-700">This item has varieties</span>
              </label>
            </div>

            {hasVarieties && (
              <div className="space-y-4 bg-gray-50 p-3 sm:p-4 rounded-lg">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Variety Name *</label>
                    <input
                      type="text"
                      name="varietyName"
                      value={formData.varietyName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                      placeholder="e.g., Small, Large, Spicy"
                      disabled={isSubmitting}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Variety Price ($) *</label>
                    <input
                      type="number"
                      name="varietyPrice"
                      value={formData.varietyPrice}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Variety Description</label>
                  <textarea
                    name="varietyDescription"
                    value={formData.varietyDescription}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                    rows="2"
                    placeholder="Optional variety description"
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Variety Image URL</label>
                  <input
                    type="url"
                    name="varietyImage"
                    value={formData.varietyImage}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                    placeholder="https://example.com/variety-image.jpg"
                    disabled={isSubmitting}
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={addVariety}
                    className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors disabled:bg-green-400 disabled:cursor-not-allowed text-sm"
                    disabled={isSubmitting || !formData.varietyName || !formData.varietyPrice}
                  >
                    Add Variety
                  </button>
                </div>

                {/* Display added varieties */}
                {varieties.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Added Varieties:</h4>
                    <div className="space-y-2">
                      {varieties.map((variety, index) => (
                        <div key={index} className="flex justify-between items-center bg-white p-2 sm:p-3 rounded-lg border">
                          <div className="flex items-center space-x-2 sm:space-x-3">
                            <img 
                              src={variety.image} 
                              alt={variety.name}
                              className="w-8 h-8 sm:w-12 sm:h-12 object-cover rounded"
                            />
                            <div>
                              <span className="font-medium text-sm">{variety.name}</span>
                              <span className="text-gray-600 ml-2 text-sm">- ${variety.price}</span>
                              {variety.description && (
                                <p className="text-xs text-gray-500 line-clamp-1">{variety.description}</p>
                              )}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeVariety(index)}
                            className="text-red-600 hover:text-red-800 text-sm"
                            disabled={isSubmitting}
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-amber-600 text-white py-3 rounded-lg hover:bg-amber-700 transition-colors font-semibold disabled:bg-amber-400 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              {isSubmitting ? 'Adding Item...' : 'Add Food Item'}
            </button>
            <button
              type="button"
              onClick={() => setCurrentView('listItems')}
              disabled={isSubmitting}
              className="flex-1 bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600 transition-colors font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddItems;