import React, { useState, useEffect } from 'react';

const AdminOffers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingOffer, setEditingOffer] = useState(null);
  const [formData, setFormData] = useState({
    image: '',
    title: '',
    rating: '',
    description: '',
    price: ''
  });

  // Fetch offers from API
  const fetchOffers = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/offers');
      const result = await response.json();
      if (result.success) {
        setOffers(result.data);
      }
    } catch (error) {
      console.error('Error fetching offers:', error);
      // Fallback to localStorage if API fails
      const localOffers = JSON.parse(localStorage.getItem('specialOffers') || '[]');
      setOffers(localOffers);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'rating' || name === 'price' ? parseFloat(value) : value
    }));
  };

  const resetForm = () => {
    setFormData({
      image: '',
      title: '',
      rating: '',
      description: '',
      price: ''
    });
    setEditingOffer(null);
  };

  // Create new offer
  const createOffer = async (offerData) => {
    try {
      const response = await fetch('http://localhost:5000/api/offers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(offerData),
      });

      if (response.ok) {
        const result = await response.json();
        return result.data;
      }
      throw new Error('API failed');
    } catch (error) {
      console.log('API failed, using localStorage');
      // Fallback to localStorage
      const newOffer = {
        _id: `offer_${Date.now()}`,
        ...offerData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const existingOffers = JSON.parse(localStorage.getItem('specialOffers') || '[]');
      const updatedOffers = [...existingOffers, newOffer];
      localStorage.setItem('specialOffers', JSON.stringify(updatedOffers));
      return newOffer;
    }
  };

  // Update offer
  const updateOffer = async (id, offerData) => {
    try {
      const response = await fetch(`http://localhost:5000/api/offers/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(offerData),
      });

      if (response.ok) {
        const result = await response.json();
        return result.data;
      }
      throw new Error('API failed');
    } catch (error) {
      console.log('API failed, using localStorage');
      // Fallback to localStorage
      const existingOffers = JSON.parse(localStorage.getItem('specialOffers') || '[]');
      const updatedOffers = existingOffers.map(offer => 
        offer._id === id 
          ? { ...offer, ...offerData, updatedAt: new Date().toISOString() }
          : offer
      );
      localStorage.setItem('specialOffers', JSON.stringify(updatedOffers));
      return updatedOffers.find(offer => offer._id === id);
    }
  };

  // Delete offer
  const deleteOffer = async (id) => {
    if (!window.confirm('Are you sure you want to delete this offer?')) return;

    try {
      const response = await fetch(`http://localhost:5000/api/offers/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchOffers();
        return;
      }
      throw new Error('API failed');
    } catch (error) {
      console.log('API failed, using localStorage');
      // Fallback to localStorage
      const existingOffers = JSON.parse(localStorage.getItem('specialOffers') || '[]');
      const updatedOffers = existingOffers.filter(offer => offer._id !== id);
      localStorage.setItem('specialOffers', JSON.stringify(updatedOffers));
      setOffers(updatedOffers);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const offerData = {
        image: formData.image,
        title: formData.title,
        rating: parseFloat(formData.rating) || 4.5,
        description: formData.description,
        price: parseFloat(formData.price)
      };

      if (editingOffer) {
        await updateOffer(editingOffer._id, offerData);
      } else {
        await createOffer(offerData);
      }

      resetForm();
      fetchOffers();
      alert(`Offer ${editingOffer ? 'updated' : 'created'} successfully!`);
    } catch (error) {
      console.error('Error saving offer:', error);
      alert('Failed to save offer');
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (offer) => {
    setEditingOffer(offer);
    setFormData({
      image: offer.image,
      title: offer.title,
      rating: offer.rating,
      description: offer.description,
      price: offer.price
    });
  };

  if (loading && offers.length === 0) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Manage Special Offers</h2>
      </div>

      {/* Add/Edit Form */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-xl font-semibold mb-4">
          {editingOffer ? 'Edit Offer' : 'Add New Offer'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Image URL *</label>
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="https://example.com/image.jpg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="Offer title"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rating *</label>
              <input
                type="number"
                name="rating"
                value={formData.rating}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="4.5"
                step="0.1"
                min="0"
                max="5"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="0.00"
                step="0.01"
                min="0"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              rows="3"
              placeholder="Offer description"
              required
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-amber-600 text-white py-2 px-6 rounded-lg hover:bg-amber-700 transition-colors disabled:bg-amber-400"
            >
              {loading ? 'Saving...' : (editingOffer ? 'Update Offer' : 'Create Offer')}
            </button>
            {editingOffer && (
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-500 text-white py-2 px-6 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Offers List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h3 className="text-xl font-semibold">Current Offers ({offers.length})</h3>
        </div>
        
        {offers.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No offers found. Create your first special offer!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {offers.map((offer) => (
                  <tr key={offer._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <img 
                        src={offer.image} 
                        alt={offer.title}
                        className="w-16 h-16 object-cover rounded"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{offer.title}</div>
                      <div className="text-sm text-gray-500 line-clamp-2">{offer.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {offer.rating} ⭐
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${offer.price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => startEdit(offer)}
                        className="text-amber-600 hover:text-amber-900 mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteOffer(offer._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOffers;