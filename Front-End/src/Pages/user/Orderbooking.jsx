import React, { useState, useEffect } from 'react';
import { FaShoppingCart, FaUser, FaArrowLeft, FaClock, FaCheck, FaTimes, FaInfoCircle } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

const Orderbooking = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [userOrders, setUserOrders] = useState([]);
  const navigate = useNavigate();

  // Check authentication
  useEffect(() => {
    const checkAuth = () => {
      try {
        const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
        const userData = JSON.parse(localStorage.getItem('user') || 'null');
        
        setIsLoggedIn(loggedIn);
        setUser(userData);
        
        if (!loggedIn) {
          alert('Please login to view your orders!');
          navigate('/login');
          return;
        }
      } catch (error) {
        console.error('Auth error:', error);
        setIsLoggedIn(false);
      }
    };

    checkAuth();
  }, [navigate]);

  // SIMPLE FIX: Load ALL orders without filtering for testing
  const loadAllOrders = () => {
    try {
      console.log('🔄 Loading ALL orders...');
      
      const ordersData = localStorage.getItem('orders');
      console.log('📦 Raw orders data:', ordersData);
      
      if (!ordersData || ordersData === 'undefined' || ordersData === 'null') {
        console.log('❌ No orders found');
        setUserOrders([]);
        return;
      }

      const allOrders = JSON.parse(ordersData);
      console.log('📋 ALL orders from storage:', allOrders);
      
      // TEMPORARY: Show ALL orders without filtering
      const allOrdersSorted = allOrders.sort((a, b) => new Date(b.date) - new Date(a.date));
      
      console.log('✅ Showing ALL orders (no filtering):', allOrdersSorted.length);
      setUserOrders(allOrdersSorted);
      
    } catch (error) {
      console.error('Error loading orders:', error);
      setUserOrders([]);
    }
  };

  // Load orders on component mount
  useEffect(() => {
    if (isLoggedIn) {
      loadAllOrders();
    }
  }, [isLoggedIn]);

  // Listen for order updates
  useEffect(() => {
    const handleOrderUpdate = () => {
      console.log('📢 Order update received');
      setTimeout(loadAllOrders, 500);
    };

    window.addEventListener('newOrder', handleOrderUpdate);
    window.addEventListener('orderUpdate', handleOrderUpdate);
    
    return () => {
      window.removeEventListener('newOrder', handleOrderUpdate);
      window.removeEventListener('orderUpdate', handleOrderUpdate);
    };
  }, []);

  // Debug function
  const debugStorage = () => {
    const allOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    const currentUser = JSON.parse(localStorage.getItem('user') || 'null');
    
    console.log('🐛 DEBUG STORAGE:');
    console.log('Current User:', currentUser);
    console.log('All Orders:', allOrders);
    console.log('Displayed Orders:', userOrders);
    
    alert(`Debug Info:
User: ${currentUser?.username}
User Email: ${currentUser?.emailAddress || currentUser?.email}
Total Orders: ${allOrders.length}
Displayed: ${userOrders.length}

Check console for details
    `);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <FaClock className="text-yellow-500" />;
      case 'confirmed': return <FaCheck className="text-blue-500" />;
      case 'preparing': return <FaInfoCircle className="text-orange-500" />;
      case 'out-for-delivery': return <FaInfoCircle className="text-purple-500" />;
      case 'delivered': return <FaCheck className="text-green-500" />;
      case 'cancelled': return <FaTimes className="text-red-500" />;
      default: return <FaInfoCircle className="text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'preparing': return 'bg-orange-100 text-orange-800';
      case 'out-for-delivery': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center max-w-md w-full">
          <FaShoppingCart className="text-orange-400 text-6xl mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Login Required</h2>
          <p className="text-gray-600 mb-6">Please login to view your orders</p>
          <button 
            onClick={() => navigate('/login')}
            className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Link 
            to="/menu" 
            className="flex items-center gap-2 text-orange-600 hover:text-orange-700 transition-colors font-semibold"
          >
            <FaArrowLeft />
            <span>Back to Menu</span>
          </Link>
          
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Your Orders</h1>
            <div className="flex items-center justify-center gap-2 text-gray-600">
              <FaUser className="text-orange-500" />
              <span>Welcome, {user?.username}!</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={debugStorage}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors font-semibold"
            >
              Debug 🐛
            </button>
            <Link 
              to="/cart"
              className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors font-semibold"
            >
              View Cart
            </Link>
          </div>
        </div>

        {/* TEMPORARY WARNING */}
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded mb-6">
          <strong>Note:</strong> Currently showing ALL orders from storage for debugging
        </div>

        {userOrders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <FaShoppingCart className="text-orange-400 text-6xl mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No orders found</h3>
            <p className="text-gray-600 mb-6">Orders will appear here once you place them</p>
            <button 
              onClick={debugStorage}
              className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors font-semibold mr-4"
            >
              Check Storage
            </button>
            <Link 
              to="/menu"
              className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors font-semibold"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {userOrders.map(order => (
              <div key={order.id} className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg text-gray-800">
                      Order #{order.id.slice(-8).toUpperCase()}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {new Date(order.date).toLocaleDateString()} at {new Date(order.date).toLocaleTimeString()}
                    </p>
                    <p className="text-gray-500 text-xs">
                      Customer: {order.customerName} ({order.customerEmail})
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                    <div className="flex items-center gap-1">
                      {getStatusIcon(order.status)}
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1).replace('-', ' ')}
                    </div>
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <h4 className="font-semibold text-gray-800 mb-3">Order Items</h4>
                    <div className="space-y-3">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <img 
                            src={item.image} 
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <h5 className="font-semibold text-gray-800">{item.name}</h5>
                            <p className="text-sm text-gray-600">Qty: {item.quantity} × ₹{item.price}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-800">
                              ₹{(item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-800 mb-3">Order Summary</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>₹{order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tax (10%):</span>
                        <span>₹{(order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0) * 0.1).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Delivery Fee:</span>
                        <span>₹40.00</span>
                      </div>
                      <hr />
                      <div className="flex justify-between font-semibold">
                        <span>Total:</span>
                        <span className="text-orange-600">₹{order.totalAmount}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orderbooking;