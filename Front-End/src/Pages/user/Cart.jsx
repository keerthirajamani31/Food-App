 import React, { useState, useEffect } from 'react';
import { FaTrash, FaPlus, FaMinus, FaShoppingCart, FaArrowLeft, FaUser } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Check if user is logged in - with real-time updates
  useEffect(() => {
    const checkAuth = () => {
      try {
        const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
        const userData = JSON.parse(localStorage.getItem('user') || 'null');
        
        console.log('🔄 Auth check - Logged in:', loggedIn, 'User:', userData);
        
        setIsLoggedIn(loggedIn);
        setUser(userData);
        
        if (!loggedIn) {
          setTimeout(() => {
            alert('Please login to access your cart!');
            navigate('/login');
          }, 100);
          return;
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        setIsLoggedIn(false);
      }
    };

    // Check immediately
    checkAuth();

    // Listen for storage changes (when login happens in another tab/component)
    const handleStorageChange = () => {
      console.log('📦 Storage changed, checking auth...');
      checkAuth();
    };

    // Listen for custom login event (triggered from Login component)
    const handleLoginEvent = () => {
      console.log('🔑 Login event received, updating user...');
      checkAuth();
    };

    // Set up event listeners
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('userLoggedIn', handleLoginEvent);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userLoggedIn', handleLoginEvent);
    };
  }, [navigate]);

  // Load cart function
  const loadCart = () => {
    try {
      const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
      setCartItems(savedCart);
    } catch (error) {
      console.error('Error loading cart:', error);
      setCartItems([]);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      loadCart();

      const handleCartUpdate = () => {
        loadCart();
      };

      window.addEventListener('cartUpdate', handleCartUpdate);
      
      return () => {
        window.removeEventListener('cartUpdate', handleCartUpdate);
      };
    }
  }, [isLoggedIn]);

  const increaseQuantity = (itemId) => {
    const updatedCart = cartItems.map(item =>
      item.id === itemId
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const decreaseQuantity = (itemId) => {
    const updatedCart = cartItems
      .map(item =>
        item.id === itemId
          ? { ...item, quantity: Math.max(0, item.quantity - 1) }
          : item
      )
      .filter(item => item.quantity > 0);
    
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const removeFromCart = (itemId) => {
    const updatedCart = cartItems.filter(item => item.id !== itemId);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.setItem('cart', '[]');
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
    setUser(null);
    alert('Logged out successfully!');
    navigate('/');
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    // Create order object - FIXED: Use emailAddress instead of email
    const order = {
      id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      customerName: user?.username || 'Customer',
      customerEmail: user?.emailAddress || user?.email || 'No email provided', // FIXED THIS LINE
      items: cartItems.map(item => ({
        ...item,
        // Ensure all items have required fields
        image: item.image || 'https://via.placeholder.com/150',
        variety: item.variety || 'Standard'
      })),
      totalAmount: total.toFixed(2),
      status: 'pending',
      date: new Date().toISOString(),
      address: user?.address || 'No address provided',
      phone: user?.phoneNumber || user?.phone || 'No phone provided',
      paymentMethod: 'cash-on-delivery' // Add default payment method
    };

    console.log('📦 Saving order:', order); // Debug log

    // Save order to localStorage
    try {
      const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      existingOrders.push(order);
      localStorage.setItem('orders', JSON.stringify(existingOrders));
      
      // Trigger order update events
      window.dispatchEvent(new Event('newOrder'));
      window.dispatchEvent(new Event('orderUpdate'));
      window.dispatchEvent(new Event('storage')); // Add this for broader compatibility
      
      console.log('✅ Order saved successfully'); // Debug log
      alert(`Order placed successfully! Thank you, ${user?.username || 'Customer'}`);
      clearCart();
      
      // Redirect to orders page after checkout
      navigate('/orders');
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Error placing order. Please try again.');
    }
  };

  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const tax = subtotal * 0.1;
  const deliveryFee = subtotal > 0 ? 40 : 0;
  const total = subtotal + tax + deliveryFee;

  // If not logged in, show login prompt
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center max-w-md">
          <FaShoppingCart className="text-orange-400 text-6xl mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Login Required</h2>
          <p className="text-gray-600 mb-6">Please login to access your shopping cart</p>
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
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Your Cart</h1>
            <div className="flex items-center justify-center gap-2 text-gray-600">
              <FaUser className="text-orange-500" />
              <span>Welcome, {user?.username || 'User'}!</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {cartItems.length > 0 && (
              <button 
                onClick={clearCart}
                className="text-red-500 hover:text-red-700 transition-colors font-semibold"
              >
                Clear Cart
              </button>
            )}
            <button 
              onClick={handleLogout}
              className="text-gray-600 hover:text-gray-800 transition-colors font-semibold text-sm"
            >
              Logout
            </button>
            <Link 
              to="/orders"
              className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors font-semibold"
            >
              View Orders
            </Link>
          </div>
        </div>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <FaShoppingCart className="text-orange-400 text-6xl mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h3>
            <p className="text-gray-600 mb-6">Add some delicious items from our menu</p>
            <Link 
              to="/menu"
              className="bg-orange-500 text-white px-8 py-3 rounded-lg hover:bg-orange-600 transition-colors font-semibold inline-block"
            >
              Browse Menu
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="space-y-4">
                {cartItems.map(item => (
                  <div key={item.id} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center gap-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/150';
                        }}
                      />
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg text-gray-800 truncate">{item.name}</h3>
                        <p className="text-gray-600 text-sm mb-2 line-clamp-2">{item.description}</p>
                        <span className="text-green-600 font-bold text-lg">₹{item.price}</span>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => decreaseQuantity(item.id)}
                          className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-gray-200 transition-colors disabled:opacity-50"
                          disabled={item.quantity <= 1}
                        >
                          <FaMinus size={12} />
                        </button>
                        
                        <span className="w-8 text-center font-semibold text-gray-800 text-lg">
                          {item.quantity}
                        </span>
                        
                        <button 
                          onClick={() => increaseQuantity(item.id)}
                          className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-gray-200 transition-colors"
                        >
                          <FaPlus size={12} />
                        </button>
                      </div>
                      
                      <div className="text-right min-w-20">
                        <div className="font-bold text-gray-800 text-lg">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </div>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-500 hover:text-red-700 transition-colors mt-2 flex items-center gap-1 text-sm"
                        >
                          <FaTrash size={14} />
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-lg p-6 sticky top-4">
                <div className="flex items-center gap-2 mb-4">
                  <FaUser className="text-orange-500" />
                  <span className="font-semibold text-gray-800">{user?.username || 'User'}</span>
                </div>
                
                <h3 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h3>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({cartItems.reduce((total, item) => total + item.quantity, 0)} items)</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax (10%)</span>
                    <span>₹{tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery Fee</span>
                    <span>₹{deliveryFee.toFixed(2)}</span>
                  </div>
                  <hr className="my-3" />
                  <div className="flex justify-between text-lg font-bold text-gray-800">
                    <span>Total</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                </div>

                <button 
                  onClick={handleCheckout}
                  className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors mb-3 shadow-md"
                >
                  Place Order
                </button>
                
                <Link 
                  to="/menu"
                  className="w-full bg-orange-500 text-white py-2 rounded-lg font-semibold hover:bg-orange-600 transition-colors text-center block shadow-md"
                >
                  Continue Shopping
                </Link>

                {subtotal > 0 && subtotal < 299 && (
                  <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-center">
                    <p className="text-amber-700 text-sm">
                      Add ₹{(299 - subtotal).toFixed(2)} more for free delivery!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;