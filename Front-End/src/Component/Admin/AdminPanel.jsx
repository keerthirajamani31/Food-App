import React, { useState } from 'react';
import AdminOffers from './AdminOffers';

// Simple Dashboard component - create this separately or use this basic one
const AdminDashboard = () => {
  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Admin Dashboard</h1>
          <p className="text-gray-600">Welcome to your admin panel. Use the navigation above to manage different sections.</p>
          
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-2">Quick Stats</h3>
              <p className="text-gray-600">Manage your special offers, menu items, and more from here.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-2">Special Offers</h3>
              <p className="text-gray-600">Create and manage today's special offers for your customers.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-2">Menu Items</h3>
              <p className="text-gray-600">Add, edit, or remove items from your menu.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminPanel = () => {
  const [currentView, setCurrentView] = useState('dashboard');

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Admin Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex space-x-8">
              <button
                onClick={() => setCurrentView('dashboard')}
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  currentView === 'dashboard'
                    ? 'border-amber-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setCurrentView('offers')}
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  currentView === 'offers'
                    ? 'border-amber-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Special Offers
              </button>
              {/* Add other navigation items as needed */}
            </div>
            <div className="flex items-center">
              <span className="text-gray-700">Admin Panel</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>
        {currentView === 'offers' && <AdminOffers />}
        {currentView === 'dashboard' && <AdminDashboard />}
      </main>
    </div>
  );
};

export default AdminPanel;