import React, { useState, useEffect } from 'react';
import { FaShoppingCart, FaUser, FaArrowLeft, FaClock, FaCheck, FaTimes, FaInfoCircle } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

const OrderBooking = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [userOrders, setUserOrders] = useState([]);
  const navigate = useNavigate();

  // Check if user is logged in
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
        console.error('Error checking auth:', error);
        setIsLoggedIn(false);
      }
    };

    checkAuth();
  }, [navigate]);

  // Load user orders
  useEffect(() => {
    const loadUserOrders = () => {
      try {
        const allOrders = JSON.parse(localStorage.getItem('orders') || '[]');
        const userEmail = user?.emailAddress || user?.email; // Check both fields
        
        console.log('📋 Loading orders for user:', userEmail);
        console.log('📦 All orders:', allOrders);
        
        // Filter orders for current user - check both email fields
        const userOrders = allOrders.filter(order => {
          const orderEmail = order.customerEmail?.toLowerCase();
          const userEmailLower = userEmail?.toLowerCase();
          return orderEmail === userEmailLower;
        }).sort((a, b) => new Date(b.date) - new Date(a.date));
        
        console.log('✅ User orders found:', userOrders);
        setUserOrders(userOrders);
      } catch (error) {
        console.error('Error loading orders:', error);
        setUserOrders([]);
      }
    };

    if (isLoggedIn && user) {
      loadUserOrders();
    }

    // Listen for new orders
    const handleNewOrder = () => {
      console.log('🔄 New order event received');
      loadUserOrders();
    };

    window.addEventListener('newOrder', handleNewOrder);
    window.addEventListener('orderUpdate', handleNewOrder);
    window.addEventListener('storage', handleNewOrder);
    
    return () => {
      window.removeEventListener('newOrder', handleNewOrder);
      window.removeEventListener('orderUpdate', handleNewOrder);
      window.removeEventListener('storage', handleNewOrder);
    };
  }, [isLoggedIn, user]);

  const cancelOrder = (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) {
      return;
    }

    try {
      const allOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      const updatedOrders = allOrders.map(order => 
        order.id === orderId 
          ? { ...order, status: 'cancelled' }
          : order
      );
      
      localStorage.setItem('orders', JSON.stringify(updatedOrders));
      
      // Reload orders
      const userEmail = user?.emailAddress || user?.email;
      const userOrders = updatedOrders.filter(order => 
        order.customerEmail?.toLowerCase() === userEmail?.toLowerCase()
      ).sort((a, b) => new Date(b.date) - new Date(a.date));
      
      setUserOrders(userOrders);
      
      // Trigger update events
      window.dispatchEvent(new Event('orderUpdate'));
      window.dispatchEvent(new Event('storage'));
      
      alert('Order cancelled successfully!');
    } catch (error) {
      console.error('Error cancelling order:', error);
      alert('Error cancelling order. Please try again.');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <FaClock className="text-yellow-500" />;
      case 'confirmed':
        return <FaCheck className="text-blue-500" />;
      case 'preparing':
        return <FaInfoCircle className="text-orange-500" />;
      case 'out-for-delivery':
        return <FaInfoCircle className="text-purple-500" />;
      case 'delivered':
        return <FaCheck className="text-green-500" />;
      case 'cancelled':
        return <FaTimes className="text-red-500" />;
      default:
        return <FaInfoCircle className="text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'preparing':
        return 'bg-orange-100 text-orange-800';
      case 'out-for-delivery':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // If not logged in, show login prompt
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center max-w-md">
          <FaShoppingCart className="text-orange-400 text-6xl mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Login Required</h2>
          <p className="text-gray-600 mb-6">Please login to view your orders</p>
          <div className="space-y-3">
            <button 
              onClick={() => navigate('/login')}
              className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
            >
              Go to Login
            </button>
            <button 
              onClick={() => navigate('/menu')}
              className="w-full bg-gray-500 text-white py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors"
            >
              Continue Browsing
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header with User Info */}
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
            <Link 
              to="/cart"
              className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors font-semibold"
            >
              View Cart
            </Link>
          </div>
        </div>

        <div className="space-y-6">
          {userOrders.length === 0 ? (
            <div className="bg-white rounded-lg shadow-lg p-12 text-center">
              <FaShoppingCart className="text-orange-400 text-6xl mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-800 mb-2">No orders yet</h3>
              <p className="text-gray-600 mb-6">Your order history will appear here</p>
              <Link 
                to="/menu"
                className="bg-orange-500 text-white px-8 py-3 rounded-lg hover:bg-orange-600 transition-colors font-semibold inline-block"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            userOrders.map(order => (
              <div key={order.id} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all duration-300">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg text-gray-800">
                      Order #{order.id.slice(-8).toUpperCase()}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {new Date(order.date).toLocaleDateString()} at {new Date(order.date).toLocaleTimeString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(order.status)}
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1).replace('-', ' ')}
                      </div>
                    </span>
                    {order.status === 'pending' && (
                      <button
                        onClick={() => cancelOrder(order.id)}
                        className="text-red-500 hover:text-red-700 transition-colors text-sm font-semibold"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Order Items with Images */}
                  <div className="lg:col-span-2">
                    <h4 className="font-semibold text-gray-800 mb-3">Order Items</h4>
                    <div className="space-y-3">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <div className="flex-shrink-0">
                            <img 
                              src={item.image || 'https://via.placeholder.com/150'} 
                              alt={item.name}
                              className="w-16 h-16 object-cover rounded-lg"
                              onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/150';
                              }}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h5 className="font-semibold text-gray-800 truncate">{item.name}</h5>
                            <p className="text-sm text-gray-600">
                              Quantity: {item.quantity}
                            </p>
                            {item.variety && (
                              <p className="text-xs text-gray-500">
                                Variety: {item.variety}
                              </p>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-800">
                              ₹{(item.price * item.quantity).toFixed(2)}
                            </p>
                            <p className="text-sm text-gray-600">
                              ₹{item.price} each
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="bg-gray-50 rounded-lg p-4 h-fit">
                    <h4 className="font-semibold text-gray-800 mb-3">Order Summary</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Subtotal:</span>
                        <span>₹{order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tax (10%):</span>
                        <span>₹{(order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0) * 0.1).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Delivery Fee:</span>
                        <span>₹40.00</span>
                      </div>
                      <hr className="my-2 border-gray-300" />
                      <div className="flex justify-between font-semibold text-base">
                        <span>Total:</span>
                        <span className="text-orange-600">₹{order.totalAmount}</span>
                      </div>
                    </div>

                    {/* Delivery Address */}
                    {order.address && order.address !== 'No address provided' && (
                      <div className="mt-4 pt-4 border-t border-gray-300">
                        <h4 className="font-semibold text-gray-800 mb-2">Delivery Address</h4>
                        <p className="text-gray-600 text-sm">{order.address}</p>
                      </div>
                    )}

                    {/* Payment Method */}
                    {order.paymentMethod && (
                      <div className="mt-3 pt-3 border-t border-gray-300">
                        <h4 className="font-semibold text-gray-800 mb-1">Payment Method</h4>
                        <p className="text-gray-600 text-sm capitalize">
                          {order.paymentMethod.replace('-', ' ')}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderBooking;