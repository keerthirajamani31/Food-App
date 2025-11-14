import React, { useState, useEffect } from 'react';
import { FaShoppingCart, FaUser, FaArrowLeft, FaClock, FaCheck, FaTimes, FaInfoCircle, FaBox } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

const Userorder = () => {
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

  // Load orders for current user
  const loadUserOrders = () => {
    try {
      const ordersData = localStorage.getItem('orders');
      
      if (!ordersData || ordersData === 'undefined' || ordersData === 'null') {
        setUserOrders([]);
        return;
      }

      const allOrders = JSON.parse(ordersData);
      const currentUser = JSON.parse(localStorage.getItem('user') || 'null');
      
      if (!currentUser) {
        setUserOrders([]);
        return;
      }

      // Filter orders for current user
      const userOrders = allOrders.filter(order => 
        order.customerEmail === currentUser.emailAddress || 
        order.customerEmail === currentUser.email ||
        order.customerName === currentUser.username
      );
      
      const userOrdersSorted = userOrders.sort((a, b) => new Date(b.date) - new Date(a.date));
      setUserOrders(userOrdersSorted);
      
    } catch (error) {
      console.error('Error loading orders:', error);
      setUserOrders([]);
    }
  };

  // Load orders on component mount
  useEffect(() => {
    if (isLoggedIn) {
      loadUserOrders();
    }
  }, [isLoggedIn]);

  // Listen for order updates
  useEffect(() => {
    const handleOrderUpdate = () => {
      setTimeout(loadUserOrders, 500);
    };

    window.addEventListener('newOrder', handleOrderUpdate);
    window.addEventListener('orderUpdate', handleOrderUpdate);
    
    return () => {
      window.removeEventListener('newOrder', handleOrderUpdate);
      window.removeEventListener('orderUpdate', handleOrderUpdate);
    };
  }, []);

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
    <div className="min-h-screen bg-gray-50 py-4 px-3 sm:px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header - Mobile Optimized */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <Link 
            to="/menu" 
            className="flex items-center gap-2 text-orange-600 hover:text-orange-700 transition-colors font-semibold text-sm sm:text-base"
          >
            <FaArrowLeft />
            <span>Back to Menu</span>
          </Link>
          
          <div className="text-center order-first sm:order-none">
            <h1 className="text-2xl sm:text-4xl font-bold text-gray-800 mb-1 sm:mb-2">Your Orders</h1>
            <div className="flex items-center justify-center gap-2 text-gray-600 text-sm sm:text-base">
              <FaUser className="text-orange-500" />
              <span>Welcome, {user?.username}!</span>
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-3 sm:gap-4 order-last sm:order-none">
            <Link 
              to="/cart"
              className="bg-orange-500 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg hover:bg-orange-600 transition-colors font-semibold text-sm flex items-center gap-2"
            >
              <FaShoppingCart size={14} />
              <span className="hidden sm:inline">Cart</span>
            </Link>
          </div>
        </div>

        {/* Orders List */}
        {userOrders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-6 sm:p-12 text-center">
            <FaBox className="text-orange-400 text-4xl sm:text-6xl mx-auto mb-4" />
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">No orders found</h3>
            <p className="text-gray-600 mb-6 text-sm sm:text-base">Orders will appear here once you place them</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link 
                to="/menu"
                className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors font-semibold text-sm sm:text-base"
              >
                Start Shopping
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            {userOrders.map(order => (
              <div key={order.id} className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
                {/* Order Header - Mobile Optimized */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800 text-lg sm:text-xl mb-1">
                      Order #{order.id.slice(-8).toUpperCase()}
                    </h3>
                    <p className="text-gray-600 text-xs sm:text-sm">
                      {new Date(order.date).toLocaleDateString()} at {new Date(order.date).toLocaleTimeString()}
                    </p>
                    <p className="text-gray-500 text-xs mt-1">
                      Customer: {order.customerName}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs sm:text-sm font-semibold ${getStatusColor(order.status)} self-start sm:self-auto`}>
                    <div className="flex items-center gap-1">
                      {getStatusIcon(order.status)}
                      <span className="hidden sm:inline">
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1).replace('-', ' ')}
                      </span>
                      <span className="sm:hidden">
                        {order.status.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </span>
                </div>

                {/* Order Content - Mobile Optimized */}
                <div className="flex flex-col gap-4 sm:gap-6">
                  {/* Order Items - Mobile Scrollable */}
                  <div className="sm:col-span-2">
                    <h4 className="font-semibold text-gray-800 mb-3 text-sm sm:text-base">Order Items</h4>
                    <div className="space-y-2 max-h-40 sm:max-h-none overflow-y-auto">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex items-center gap-3 p-2 sm:p-3 bg-gray-50 rounded-lg">
                          <img 
                            src={item.image} 
                            alt={item.name}
                            className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-lg flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h5 className="font-semibold text-gray-800 text-sm sm:text-base truncate">{item.name}</h5>
                            <p className="text-gray-600 text-xs sm:text-sm">Qty: {item.quantity} × ₹{item.price}</p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="font-semibold text-gray-800 text-sm sm:text-base">
                              ₹{(item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Summary - Mobile Compact */}
                  <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                    <h4 className="font-semibold text-gray-800 mb-3 text-sm sm:text-base">Order Summary</h4>
                    <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
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
                      <hr className="my-2" />
                      <div className="flex justify-between font-semibold text-sm sm:text-base">
                        <span>Total:</span>
                        <span className="text-orange-600">₹{order.totalAmount}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Delivery Info - Mobile Only */}
                <div className="mt-4 pt-4 border-t border-gray-200 sm:hidden">
                  <div className="text-xs text-gray-600">
                    <p><strong>Delivery to:</strong> {order.address || 'No address provided'}</p>
                    <p className="mt-1"><strong>Payment:</strong> {order.paymentMethod?.replace('-', ' ') || 'Cash on delivery'}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bottom Spacing for Mobile */}
        <div className="h-8 sm:h-4"></div>
      </div>
    </div>
  );
};

export default Userorder;