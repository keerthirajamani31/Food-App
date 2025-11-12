import React, { useState, useEffect } from 'react';

const ListItems = ({ menuItems, setMenuItems, setCurrentView }) => {
  const [editingItem, setEditingItem] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [apiItems, setApiItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewMode, setViewMode] = useState('all');
  const [forceUpdate, setForceUpdate] = useState(0);

  useEffect(() => {
    const loadApiItems = async () => {
      try {
        const response = await fetch('https://food-app-fshp.onrender.com/api/food/all');
        if (response.ok) {
          const result = await response.json();
          const apiData = result.data || result || [];
          setApiItems(apiData);
        }
      } catch (error) {
        console.error('Error loading API items:', error);
      } finally {
        setLoading(false);
      }
    };

    loadApiItems();
  }, [forceUpdate]);

  useEffect(() => {
    const handleMenuItemsUpdated = () => {
      console.log('Menu items updated event received');
      const storedItems = JSON.parse(localStorage.getItem('menuItems') || '[]');
      setMenuItems(storedItems);
      setForceUpdate(prev => prev + 1);
    };

    window.addEventListener('menuItemsUpdated', handleMenuItemsUpdated);
    return () => {
      window.removeEventListener('menuItemsUpdated', handleMenuItemsUpdated);
    };
  }, [setMenuItems]);

  const getAllItems = () => {
    const allItems = [];
    const seenIds = new Set();
    
    menuItems.forEach(item => {
      if (item.name && item.name.trim() !== '') {
        allItems.push({
          ...item,
          type: 'main',
          source: 'admin',
          displayName: item.name,
          displayPrice: item.price,
          displayCategory: item.category,
          displayImage: item.image,
          displayDescription: item.description,
          fullId: item._id
        });
        seenIds.add(item._id);
        
        if (item.varieties && item.varieties.length > 0) {
          item.varieties.forEach(variety => {
            const varietyId = `${item._id}-${variety._id || variety.id}`;
            allItems.push({
              ...variety,
              type: 'variety',
              parentItem: item.name,
              parentCategory: item.category,
              source: 'admin',
              displayName: `${item.name} - ${variety.name}`,
              displayPrice: variety.price,
              displayCategory: item.category,
              displayImage: variety.image || item.image,
              displayDescription: variety.description || item.description,
              fullId: varietyId
            });
            seenIds.add(varietyId);
          });
        }
      }
    });
    
    apiItems.forEach(item => {
      if (item.name && item.name.trim() !== '' && !seenIds.has(item._id)) {
        allItems.push({
          ...item,
          type: 'main',
          source: 'api',
          displayName: item.name,
          displayPrice: item.price,
          displayCategory: item.category,
          displayImage: item.image,
          displayDescription: item.description,
          fullId: item._id
        });
        seenIds.add(item._id);
        
        if (item.varieties && item.varieties.length > 0) {
          item.varieties.forEach(variety => {
            const varietyId = `${item._id}-${variety._id || variety.id}`;
            if (!seenIds.has(varietyId)) {
              allItems.push({
                ...variety,
                type: 'variety',
                parentItem: item.name,
                parentCategory: item.category,
                source: 'api',
                displayName: `${item.name} - ${variety.name}`,
                displayPrice: variety.price,
                displayCategory: item.category,
                displayImage: variety.image || item.image,
                displayDescription: variety.description || item.description,
                fullId: varietyId
              });
              seenIds.add(varietyId);
            }
          });
        }
      }
    });
    
    return allItems;
  };

  const allItems = getAllItems();

  const filteredItems = allItems.filter(item => {
    const matchesSearch = searchTerm === '' || 
      item.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'All' || 
      item.displayCategory === selectedCategory;
    
    const matchesViewMode = viewMode === 'all' || 
      (viewMode === 'main' && item.type === 'main') ||
      (viewMode === 'varieties' && item.type === 'variety');
    
    return matchesSearch && matchesCategory && matchesViewMode;
  });

  const categories = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Drinks'];

  const handleEdit = (item) => {
    setEditingItem(item.fullId);
    setEditFormData(item);
  };

  const handleSaveEdit = async (fullId) => {
    const [itemId, varietyId] = fullId.split('-');
    const isVariety = varietyId !== undefined;
    const isApiItem = apiItems.some(item => item._id === itemId);

    try {
      if (isApiItem) {
        if (isVariety) {
          const item = apiItems.find(item => item._id === itemId);
          const updatedVarieties = item.varieties.map(v => 
            (v._id === varietyId || v.id === varietyId) ? { ...v, ...editFormData } : v
          );
          
          const response = await fetch(`https://food-app-fshp.onrender.com/api/food/${itemId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...item, varieties: updatedVarieties }),
          });

          if (response.ok) {
            const updatedItem = await response.json();
            setApiItems(prev => prev.map(item => item._id === itemId ? updatedItem : item));
            alert('API variety updated successfully!');
          } else throw new Error('Failed to update API variety');
        } else {
          const response = await fetch(`https://food-app-fshp.onrender.com/api/food/${itemId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(editFormData),
          });

          if (response.ok) {
            const updatedItem = await response.json();
            setApiItems(prev => prev.map(item => item._id === itemId ? updatedItem : item));
            alert('API item updated successfully!');
          } else throw new Error('Failed to update API item');
        }
      } else {
        if (isVariety) {
          const updatedItems = menuItems.map(item => {
            if (item._id === itemId) {
              return {
                ...item,
                varieties: item.varieties.map(v => 
                  (v._id === varietyId || v.id === varietyId) ? { ...v, ...editFormData } : v
                )
              };
            }
            return item;
          });
          setMenuItems(updatedItems);
          localStorage.setItem('menuItems', JSON.stringify(updatedItems));
          alert('Admin variety updated successfully!');
        } else {
          const updatedItems = menuItems.map(item => 
            item._id === itemId ? { ...item, ...editFormData } : item
          );
          setMenuItems(updatedItems);
          localStorage.setItem('menuItems', JSON.stringify(updatedItems));
          alert('Admin item updated successfully!');
        }
      }

      window.dispatchEvent(new Event('menuItemsUpdated'));
      setEditingItem(null);
      setEditFormData({});
    } catch (error) {
      console.error('Error updating item:', error);
      alert(`Error updating item: ${error.message}`);
    }
  };

  const handleCancelEdit = () => {
    setEditingItem(null);
    setEditFormData({});
  };

  const handleDelete = async (fullId) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;

    const [itemId, varietyId] = fullId.split('-');
    const isVariety = varietyId !== undefined;
    const isApiItem = apiItems.some(item => item._id === itemId);

    try {
      if (isApiItem) {
        if (isVariety) {
          const item = apiItems.find(item => item._id === itemId);
          const updatedVarieties = item.varieties.filter(v => 
            v._id !== varietyId && v.id !== varietyId
          );
          
          const response = await fetch(`https://food-app-fshp.onrender.com/api/food/${itemId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...item, varieties: updatedVarieties }),
          });

          if (response.ok) {
            const updatedItem = await response.json();
            setApiItems(prev => prev.map(item => item._id === itemId ? updatedItem : item));
            alert('API variety deleted successfully!');
          } else throw new Error('Failed to delete API variety');
        } else {
          const response = await fetch(`https://food-app-fshp.onrender.com/api/food/${itemId}`, {
            method: 'DELETE',
          });

          if (response.ok) {
            setApiItems(prev => prev.filter(item => item._id !== itemId));
            alert('API item deleted successfully!');
          } else throw new Error('Failed to delete API item');
        }
      } else {
        if (isVariety) {
          const updatedItems = menuItems.map(item => {
            if (item._id === itemId) {
              return {
                ...item,
                varieties: item.varieties.filter(v => 
                  v._id !== varietyId && v.id !== varietyId
                )
              };
            }
            return item;
          });
          setMenuItems(updatedItems);
          localStorage.setItem('menuItems', JSON.stringify(updatedItems));
          alert('Admin variety deleted successfully!');
        } else {
          const updatedItems = menuItems.filter(item => item._id !== itemId);
          setMenuItems(updatedItems);
          localStorage.setItem('menuItems', JSON.stringify(updatedItems));
          alert('Admin item deleted successfully!');
        }
      }

      window.dispatchEvent(new Event('menuItemsUpdated'));
    } catch (error) {
      console.error('Error deleting item:', error);
      alert(`Error deleting item: ${error.message}`);
    }
  };

  const handleEditInputChange = (e) => {
    const { name, value, type } = e.target;
    setEditFormData(prev => ({ 
      ...prev, 
      [name]: type === 'number' ? parseFloat(value) : value 
    }));
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setViewMode('all');
  };

  const handleRefresh = () => {
    setForceUpdate(prev => prev + 1);
    const storedItems = JSON.parse(localStorage.getItem('menuItems') || '[]');
    setMenuItems(storedItems);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
        <div className="flex justify-center items-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-slate-600 font-medium text-sm">Loading menu items...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-3 sm:p-4 lg:p-6">
      {/* Header Section */}
      <div className="mb-4 sm:mb-6 lg:mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="flex flex-wrap gap-2 sm:gap-3 justify-end w-full sm:w-auto">
            <button
              onClick={() => setCurrentView('addItems')}
              className="bg-orange-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl hover:bg-orange-600 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl flex items-center gap-2 text-sm sm:text-base"
            >
              <span>+</span>
              Add New Item
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-slate-200 p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="text-center">
              <div className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900">{allItems.length}</div>
              <div className="text-xs sm:text-sm text-slate-600">Total</div>
            </div>
            <div className="text-center">
              <div className="text-lg sm:text-xl lg:text-2xl font-bold text-purple-600">
                {allItems.filter(item => item.type === 'main').length}
              </div>
              <div className="text-xs sm:text-sm text-slate-600">Main</div>
            </div>
            <div className="text-center">
              <div className="text-lg sm:text-xl lg:text-2xl font-bold text-amber-600">
                {allItems.filter(item => item.type === 'variety').length}
              </div>
              <div className="text-xs sm:text-sm text-slate-600">Varieties</div>
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="sm:col-span-2 lg:col-span-1">
              <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1 sm:mb-2">Search</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 border border-slate-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 bg-slate-50 text-sm"
                />
                <span className="absolute left-2 sm:left-3 top-2 sm:top-3 text-slate-400 text-sm">🔍</span>
              </div>
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1 sm:mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-slate-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 bg-slate-50 text-sm"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1 sm:mb-2">View</label>
              <select
                value={viewMode}
                onChange={(e) => setViewMode(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-slate-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 bg-slate-50 text-sm"
              >
                <option value="all">All Items</option>
                <option value="main">Main Only</option>
                <option value="varieties">Varieties Only</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={clearFilters}
                className="w-full bg-slate-500 text-white py-2 sm:py-3 rounded-lg sm:rounded-xl hover:bg-slate-600 transition-all duration-300 font-semibold text-sm"
              >
                Clear Filters
              </button>
            </div>
          </div>
          
          {/* Filter Status */}
          {(searchTerm || selectedCategory !== 'All' || viewMode !== 'all') && (
            <div className="mt-3 sm:mt-4 p-2 sm:p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs sm:text-sm">
              <p className="text-amber-800">
                Showing {filteredItems.length} of {allItems.length} items
                {searchTerm && ` matching "${searchTerm}"`}
                {selectedCategory !== 'All' && ` in ${selectedCategory}`}
                {viewMode !== 'all' && ` (${viewMode})`}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Items List */}
      {filteredItems.length === 0 ? (
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-slate-200 p-6 sm:p-8 lg:p-12 text-center">
          <div className="text-4xl sm:text-6xl mb-3 sm:mb-4 text-slate-400">🍽️</div>
          <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-slate-800 mb-2">
            {allItems.length === 0 ? 'No Items Found' : 'No Matching Items'}
          </h3>
          <p className="text-slate-500 mb-6 sm:mb-8 max-w-md mx-auto text-sm sm:text-base">
            {allItems.length === 0 
              ? 'Get started by adding items to your menu. They will appear here for management.'
              : 'No items found matching your search criteria. Try adjusting your search terms or filters.'
            }
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <button
              onClick={() => setCurrentView('addItems')}
              className="bg-orange-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl hover:bg-orange-600 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl text-sm sm:text-base"
            >
              Add New Menu Items
            </button>
            {(searchTerm || selectedCategory !== 'All' || viewMode !== 'all') && (
              <button
                onClick={clearFilters}
                className="bg-slate-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl hover:bg-slate-600 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl text-sm sm:text-base"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {filteredItems.map(item => (
            <div
              key={item.fullId}
              className="bg-white rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-200"
            >
              {editingItem === item.fullId ? (
                <div className="p-4 sm:p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                    <div className="flex flex-col items-center">
                      <div className="relative w-full h-40 sm:h-48 lg:h-64 rounded-lg sm:rounded-xl overflow-hidden mb-3 sm:mb-4">
                        <img
                          src={editFormData.image || item.displayImage || 'https://via.placeholder.com/150'}
                          alt={editFormData.name || item.displayName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="text-xs sm:text-sm text-slate-600 text-center">
                        {item.type === 'variety' && `Variety of: ${item.parentItem}`}
                        {item.type === 'main' && 'Main Item'}
                      </div>
                    </div>

                    <div className="space-y-3 sm:space-y-4">
                      <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-3 sm:mb-4">
                        Edit {item.type === 'variety' ? 'Variety' : 'Item'}
                      </h3>
                      
                      <input
                        type="text"
                        name="name"
                        value={editFormData.name || ''}
                        onChange={handleEditInputChange}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-slate-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 text-sm"
                        placeholder="Name"
                      />
                      
                      <textarea
                        name="description"
                        value={editFormData.description || ''}
                        onChange={handleEditInputChange}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-slate-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 text-sm"
                        rows="2"
                        placeholder="Description"
                      />
                      
                      <input
                        type="number"
                        name="price"
                        value={editFormData.price || ''}
                        onChange={handleEditInputChange}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-slate-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 text-sm"
                        step="0.01"
                        placeholder="Price"
                      />
                      
                      <input
                        type="text"
                        name="image"
                        value={editFormData.image || ''}
                        onChange={handleEditInputChange}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-slate-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 text-sm"
                        placeholder="Image URL"
                      />

                      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                        <button
                          onClick={() => handleSaveEdit(item.fullId)}
                          className="flex-1 bg-green-500 text-white py-2 sm:py-3 rounded-lg sm:rounded-xl hover:bg-green-600 transition-all duration-300 font-semibold text-sm"
                        >
                          Save Changes
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="flex-1 bg-slate-500 text-white py-2 sm:py-3 rounded-lg sm:rounded-xl hover:bg-slate-600 transition-all duration-300 font-semibold text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 sm:p-6">
                  <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
                    {/* Image */}
                    <div className="lg:w-1/4">
                      <div className="relative h-32 sm:h-36 lg:h-40 rounded-lg sm:rounded-xl overflow-hidden">
                        <img
                          src={item.displayImage || 'https://via.placeholder.com/150'}
                          alt={item.displayName}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="lg:w-2/4 flex flex-col justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-1 sm:gap-2 mb-2">
                          <span className="bg-orange-500 text-white px-2 sm:px-3 py-1 rounded-full text-xs font-semibold">
                            {item.displayCategory}
                          </span>
                          {item.type === 'variety' && (
                            <span className="bg-slate-500 text-white px-2 sm:px-3 py-1 rounded-full text-xs font-semibold">
                              Variety: {item.parentItem}
                            </span>
                          )}
                        </div>
                        
                        <h3 className="text-base sm:text-lg lg:text-xl font-bold text-slate-900 mb-2 line-clamp-1">
                          {item.displayName}
                        </h3>
                        
                        <p className="text-slate-600 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">
                          {item.displayDescription}
                        </p>
                        
                        {item.ingredients && item.ingredients.length > 0 && (
                          <div className="mb-2 sm:mb-3">
                            <div className="text-xs font-semibold text-slate-700 mb-1 sm:mb-2">Ingredients:</div>
                            <div className="flex flex-wrap gap-1">
                              {item.ingredients.slice(0, 2).map((ingredient, index) => (
                                <span 
                                  key={index} 
                                  className="bg-slate-100 text-slate-700 px-2 py-1 rounded-full text-xs font-medium"
                                >
                                  {ingredient}
                                </span>
                              ))}
                              {item.ingredients.length > 2 && (
                                <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded-full text-xs font-medium">
                                  +{item.ingredients.length - 2} more
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm">
                        <div className="flex items-center gap-1 text-amber-500">
                          <span>⭐</span>
                          <span className="font-semibold">{item.rating || '4.0'}</span>
                        </div>
                        <div className="text-base sm:text-lg font-bold text-green-600">
                          ${item.displayPrice}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="lg:w-1/4 flex flex-row lg:flex-col justify-center gap-2 sm:gap-3">
                      <button
                        onClick={() => handleEdit(item)}
                        className="flex-1 lg:w-full bg-amber-500 text-black py-2 sm:py-3 rounded-lg sm:rounded-xl hover:bg-amber-600 transition-all duration-300 font-semibold flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item.fullId)}
                        className="flex-1 lg:w-full bg-red-500 text-white py-2 sm:py-3 rounded-lg sm:rounded-xl hover:bg-red-600 transition-all duration-300 font-semibold flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ListItems;