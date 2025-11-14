import React, { useState, useEffect } from 'react';
import { FaShoppingCart, FaUser, FaArrowLeft, FaClock, FaCheck, FaTimes, FaInfoCircle, FaExclamationTriangle } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

const OrderBooking = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [userOrders, setUserOrders] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Check if user is logged in
  useEffect(() => {
    const checkAuth = () => {
      try {
        const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
        const userData = JSON.parse(localStorage.getItem('user') || 'null');
        
        console.log('🔐 Auth check:', { loggedIn, userData });
        
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

  // FIXED: Improved order loading with multiple email field checks
  const loadUserOrders = () => {
    try {
      console.log('🔄 Loading orders...');
      
      // Get all orders from localStorage
      const ordersData = localStorage.getItem('orders');
      console.log('📦 Raw orders data from localStorage:', ordersData);
      
      if (!ordersData || ordersData === 'undefined' || ordersData === 'null') {
        console.log('❌ No orders found in localStorage');
        setUserOrders([]);
        return;
      }

      const allOrders = JSON.parse(ordersData);
      console.log('📋 Parsed all orders:', allOrders);
      
      // Get user email from multiple possible fields
      const userEmail = user?.emailAddress || user?.email || user?.username;
      console.log('👤 Current user email/username:', userEmail);
      
      if (!userEmail) {
        console.log('❌ No user identifier found');
        setUserOrders([]);
        return;
      }

      // FIXED: More flexible filtering - check multiple fields and be case insensitive
      const userOrders = allOrders
        .filter(order => {
          // Check multiple possible email fields in order
          const orderEmail = order.customerEmail?.toLowerCase().trim() || 
                           order.email?.toLowerCase().trim() ||
                           order.customerName?.toLowerCase().trim();
          
          const userIdentifier = userEmail.toLowerCase().trim();
          
          const match = orderEmail === userIdentifier;
          
          console.log('🔍 Order match check:', { 
            orderId: order.id,
            orderEmail,
            userIdentifier, 
            match
          });
          
          return match;
        })
        .sort((a, b) => new Date(b.date) - new Date(a.date));
      
      console.log('✅ Final user orders found:', userOrders.length);
      console.log('📝 User orders:', userOrders);
      setUserOrders(userOrders);
      
    } catch (error) {
      console.error('❌ Error loading orders:', error);
      setUserOrders([]);
    }
  };

  // Load orders when user changes
  useEffect(() => {
    if (isLoggedIn && user) {
      console.log('🚀 Loading orders for authenticated user');
      loadUserOrders();
    }
  }, [isLoggedIn, user]);

  // Listen for order updates with better timing
  useEffect(() => {
    const handleOrderUpdate = () => {
      console.log('📢 Order update event received in OrderBooking');
      setTimeout(() => {
        if (isLoggedIn && user) {
          console.log('🔄 Reloading orders after update');
          loadUserOrders();
        }
      }, 1000); // Increased delay to ensure data is saved
    };

    window.addEventListener('newOrder', handleOrderUpdate);
    window.addEventListener('orderUpdate', handleOrderUpdate);
    window.addEventListener('storage', handleOrderUpdate);
    
    return () => {
      window.removeEventListener('newOrder', handleOrderUpdate);
      window.removeEventListener('orderUpdate', handleOrderUpdate);
      window.removeEventListener('storage', handleOrderUpdate);
    };
  }, [isLoggedIn, user]);

  // Also load orders when component mounts
  useEffect(() => {
    if (isLoggedIn && user) {
      loadUserOrders();
    }
  }, []);

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
      
      // Update local state
      loadUserOrders();
      
      // Trigger events
      window.dispatchEvent(new Event('orderUpdate'));
      
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
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'preparing':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'out-for-delivery':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Debug function to check localStorage
  const debugOrders = () => {
    console.log('🐛 DEBUG ORDERS:');
    console.log('User:', user);
    const allOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    console.log('All orders in localStorage:', allOrders);
    console.log('Current userOrders state:', userOrders);
    
    // Show detailed debug info
    alert(`Debug Info:
User: ${user?.username}
User Email: ${user?.emailAddress || user?.email}
Total Orders in Storage: ${allOrders.length}
Your Orders Found: ${userOrders.length}

Check browser console for detailed logs
    `);
  };

  // Test function to create a sample order
  const createTestOrder = () => {
    const testOrder = {
      id: `test_order_${Date.now()}`,
      customerName: user?.username || 'Test User',
      customerEmail: user?.emailAddress || user?.email || 'test@example.com',
      items: [
        {
          id: 'test_item_1',
          name: 'Test Item',
          price: 100,
          quantity: 2,
          image: 'https://via.placeholder.com/150'
        }
      ],
      totalAmount: '240.00',
      status: 'pending',
      date: new Date().toISOString(),
      address: 'Test Address',
      phone: '1234567890',
      paymentMethod: 'cash-on-delivery'
    };

    try {
      const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      existingOrders.push(testOrder);
      localStorage.setItem('orders', JSON.stringify(existingOrders));
      
      window.dispatchEvent(new Event('newOrder'));
      alert('Test order created! Check if it appears in your orders.');
    } catch (error) {
      console.error('Error creating test order:', error);
    }
  };

  // If not logged in, show login prompt
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center max-w-md w-full">
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <Link 
            to="/menu" 
            className="flex items-center gap-2 text-orange-600 hover:text-orange-700 transition-colors font-semibold self-start"
          >
            <FaArrowLeft />
            <span>Back to Menu</span>
          </Link>
          
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">Your Orders</h1>
            <div className="flex items-center justify-center gap-2 text-gray-600">
              <FaUser className="text-orange-500" />
              <span>Welcome, {user?.username}!</span>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {user?.emailAddress || user?.email}
            </p>
          </div>
          
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <Link 
              to="/cart"
              className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors font-semibold text-sm sm:text-base"
            >
              View Cart
            </Link>
            {/* Debug buttons */}
            <button 
              onClick={debugOrders}
              className="bg-gray-500 text-white px-3 py-2 rounded-lg hover:bg-gray-600 transition-colors font-semibold text-sm"
              title="Debug Orders"
            >
              🐛
            </button>
            <button 
              onClick={createTestOrder}
              className="bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition-colors font-semibold text-sm"
              title="Create Test Order"
            >
              Test
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {userOrders.length === 0 ? (
            <div className="bg-white rounded-lg shadow-lg p-8 sm:p-12 text-center">
              <FaShoppingCart className="text-orange-400 text-5xl sm:text-6xl mx-auto mb-4" />
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">No orders yet</h3>
              <p className="text-gray-600 mb-6">Your order history will appear here once you place an order</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link 
                  to="/menu"
                  className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors font-semibold"
                >
                  Start Shopping
                </Link>
                <button 
                  onClick={debugOrders}
                  className="flex items-center justify-center gap-2 bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors font-semibold"
                >
                  <FaExclamationTriangle />
                  Debug Orders
                </button>
                <button 
                  onClick={createTestOrder}
                  className="flex items-center justify-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors font-semibold"
                >
                  Create Test Order
                </button>
              </div>
            </div>
          ) : (
            userOrders.map(order => (
              <div key={order.id} className="bg-white rounded-lg shadow-lg p-4 sm:p-6 hover:shadow-xl transition-all duration-300">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg sm:text-xl text-gray-800">
                      Order #{order.id.slice(-8).toUpperCase()}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {new Date(order.date).toLocaleDateString()} at {new Date(order.date).toLocaleTimeString()}
                    </p>
                    {order.customerEmail && (
                      <p className="text-gray-500 text-xs mt-1">
                        Email: {order.customerEmail}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(order.status)}`}>
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
                    {order.status === 'pending' && (
                      <button
                        onClick={() => cancelOrder(order.id)}
                        className="text-red-500 hover:text-red-700 transition-colors text-sm font-semibold whitespace-nowrap"
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
                      {order.items && order.items.map((item, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <div className="flex-shrink-0">
                            <img 
                              src={item.image || 'https://via.placeholder.com/150'} 
                              alt={item.name}
                              className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-lg"
                              onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/150';
                              }}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h5 className="font-semibold text-gray-800 text-sm sm:text-base truncate">{item.name}</h5>
                            <p className="text-sm text-gray-600">
                              Quantity: {item.quantity}
                            </p>
                            {item.variety && item.variety !== 'Standard' && (
                              <p className="text-xs text-gray-500">
                                Variety: {item.variety}
                              </p>
                            )}
                            <p className="text-sm text-green-600 font-semibold">
                              ₹{item.price} each
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-800 text-sm sm:text-base">
                              ₹{(item.price * item.quantity).toFixed(2)}
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
                        <span>₹{order.items?.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tax (10%):</span>
                        <span>₹{(order.items?.reduce((sum, item) => sum + (item.price * item.quantity), 0) * 0.1).toFixed(2)}</span>
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
                        <h4 className="font-semibold text-gray-800 mb-2 text-sm">Delivery Address</h4>
                        <p className="text-gray-600 text-sm">{order.address}</p>
                      </div>
                    )}

                    {/* Contact Info */}
                    {(order.phone && order.phone !== 'No phone provided') && (
                      <div className="mt-3 pt-3 border-t border-gray-300">
                        <h4 className="font-semibold text-gray-800 mb-1 text-sm">Contact</h4>
                        <p className="text-gray-600 text-sm">{order.phone}</p>
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