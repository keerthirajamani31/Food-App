import React, { useState, useEffect } from 'react';
import { FaTrash, FaPlus, FaMinus, FaShoppingCart, FaArrowLeft, FaUser, FaSignInAlt } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Check authentication
  useEffect(() => {
    const checkAuth = () => {
      try {
        const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
        const userData = JSON.parse(localStorage.getItem('user') || 'null');
        setIsLoggedIn(loggedIn);
        setUser(userData);
      } catch (error) {
        console.error('Error checking auth:', error);
        setIsLoggedIn(false);
      }
    };

    checkAuth();

    const handleStorageChange = () => checkAuth();
    const handleLoginEvent = () => checkAuth();

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
    loadCart();

    const handleCartUpdate = () => {
      loadCart();
    };

    window.addEventListener('cartUpdate', handleCartUpdate);
    
    return () => {
      window.removeEventListener('cartUpdate', handleCartUpdate);
    };
  }, []);

  const updateCart = (updatedCart) => {
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    window.dispatchEvent(new Event('cartUpdate'));
  };

  const increaseQuantity = (itemId) => {
    const updatedCart = cartItems.map(item =>
      item.id === itemId
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );
    updateCart(updatedCart);
  };

  const decreaseQuantity = (itemId) => {
    const updatedCart = cartItems
      .map(item =>
        item.id === itemId
          ? { ...item, quantity: Math.max(0, item.quantity - 1) }
          : item
      )
      .filter(item => item.quantity > 0);
    
    updateCart(updatedCart);
  };

  const removeFromCart = (itemId) => {
    const updatedCart = cartItems.filter(item => item.id !== itemId);
    updateCart(updatedCart);
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.setItem('cart', '[]');
    window.dispatchEvent(new Event('cartUpdate'));
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
    setUser(null);
    window.dispatchEvent(new Event('userLoggedOut'));
    alert('Logged out successfully!');
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    if (!isLoggedIn) {
      const proceedToLogin = window.confirm(
        'To complete your order, please login or create an account. Continue to login?'
      );
      if (proceedToLogin) {
        navigate('/login');
      }
      return;
    }

    // Create order object
    const order = {
      id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      customerName: user?.username || 'Customer',
      customerEmail: user?.emailAddress || user?.email || 'No email provided',
      items: cartItems.map(item => ({
        ...item,
        image: item.image || 'https://via.placeholder.com/150',
        variety: item.variety || 'Standard'
      })),
      totalAmount: total.toFixed(2),
      status: 'pending',
      date: new Date().toISOString(),
      address: user?.address || 'No address provided',
      phone: user?.phoneNumber || user?.phone || 'No phone provided',
      paymentMethod: 'cash-on-delivery'
    };

    try {
      const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      existingOrders.push(order);
      localStorage.setItem('orders', JSON.stringify(existingOrders));
      
      window.dispatchEvent(new Event('newOrder'));
      window.dispatchEvent(new Event('orderUpdate'));
      window.dispatchEvent(new Event('storage'));
      
      alert(`Order placed successfully! Thank you, ${user?.username || 'Customer'}`);
      clearCart();
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

  return (
    <div className="min-h-screen bg-gray-50 py-4 px-3 sm:px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header - Mobile Responsive */}
        <div className={`flex items-center justify-between mb-6 ${isMobile ? 'flex-col gap-4 text-center' : ''}`}>
          <Link 
            to="/menu" 
            className="flex items-center gap-2 text-orange-600 hover:text-orange-700 transition-colors font-semibold text-sm sm:text-base"
          >
            <FaArrowLeft />
            <span>{isMobile ? 'Back' : 'Back to Menu'}</span>
          </Link>
          
          <div className={`${isMobile ? 'order-first' : ''}`}>
            <h1 className={`font-bold text-gray-800 mb-2 ${isMobile ? 'text-2xl' : 'text-4xl'}`}>
              Your Cart
            </h1>
            {isLoggedIn ? (
              <div className="flex items-center justify-center gap-2 text-gray-600 text-sm">
                <FaUser className="text-orange-500" />
                <span>Welcome, {user?.username || 'User'}!</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2 text-amber-600 text-sm">
                <FaSignInAlt className="text-amber-500" />
                <span>Guest User - <button onClick={handleLogin} className="underline">Login</button></span>
              </div>
            )}
          </div>
          
          <div className={`flex items-center gap-3 ${isMobile ? 'flex-wrap justify-center' : ''}`}>
            {cartItems.length > 0 && (
              <button 
                onClick={clearCart}
                className="text-red-500 hover:text-red-700 transition-colors font-semibold text-xs sm:text-sm"
              >
                {isMobile ? 'Clear' : 'Clear Cart'}
              </button>
            )}
            {isLoggedIn ? (
              <>
                <button 
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-gray-800 transition-colors font-semibold text-xs sm:text-sm"
                >
                  {isMobile ? 'Logout' : 'Logout'}
                </button>
                <Link 
                  to="/orders"
                  className="bg-orange-500 text-white px-3 py-2 rounded-lg hover:bg-orange-600 transition-colors font-semibold text-xs sm:text-sm"
                >
                  {isMobile ? 'Orders' : 'View Orders'}
                </Link>
              </>
            ) : (
              <button 
                onClick={handleLogin}
                className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors font-semibold text-xs sm:text-sm"
              >
                {isMobile ? 'Login' : 'Login to Order'}
              </button>
            )}
          </div>
        </div>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-6 sm:p-12 text-center">
            <FaShoppingCart className="text-orange-400 text-4xl sm:text-6xl mx-auto mb-4" />
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h3>
            <p className="text-gray-600 mb-6 text-sm sm:text-base">Add some delicious items from our menu</p>
            <Link 
              to="/menu"
              className="bg-orange-500 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-lg hover:bg-orange-600 transition-colors font-semibold inline-block text-sm sm:text-base"
            >
              Browse Menu
            </Link>
          </div>
        ) : (
          <div className={`${isMobile ? 'flex flex-col gap-4' : 'grid grid-cols-1 lg:grid-cols-3 gap-8'}`}>
            {/* Cart Items - Mobile Responsive */}
            <div className={isMobile ? '' : 'lg:col-span-2'}>
              <div className="space-y-3 sm:space-y-4">
                {cartItems.map(item => (
                  <div key={item.id} className="bg-white rounded-lg shadow-lg p-4 sm:p-6 hover:shadow-xl transition-all duration-300">
                    <div className={`flex items-center gap-3 sm:gap-4 ${isMobile ? 'flex-col sm:flex-row text-center sm:text-left' : ''}`}>
                      <img
                        src={item.image}
                        alt={item.name}
                        className={`object-cover rounded-lg flex-shrink-0 ${isMobile ? 'w-16 h-16 mx-auto sm:mx-0' : 'w-20 h-20'}`}
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/150';
                        }}
                      />
                      
                      <div className={`flex-1 min-w-0 ${isMobile ? 'w-full' : ''}`}>
                        <h3 className="font-semibold text-gray-800 truncate text-sm sm:text-lg">{item.name}</h3>
                        <p className="text-gray-600 text-xs sm:text-sm mb-2 line-clamp-2">{item.description}</p>
                        <span className="text-green-600 font-bold text-sm sm:text-lg">₹{item.price}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 sm:gap-3 justify-center">
                        <button 
                          onClick={() => decreaseQuantity(item.id)}
                          className={`rounded-full bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-gray-200 transition-colors disabled:opacity-50 ${
                            isMobile ? 'w-7 h-7' : 'w-8 h-8'
                          }`}
                          disabled={item.quantity <= 1}
                        >
                          <FaMinus size={isMobile ? 10 : 12} />
                        </button>
                        
                        <span className={`font-semibold text-gray-800 ${
                          isMobile ? 'w-6 text-sm' : 'w-8 text-lg'
                        } text-center`}>
                          {item.quantity}
                        </span>
                        
                        <button 
                          onClick={() => increaseQuantity(item.id)}
                          className={`rounded-full bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-gray-200 transition-colors ${
                            isMobile ? 'w-7 h-7' : 'w-8 h-8'
                          }`}
                        >
                          <FaPlus size={isMobile ? 10 : 12} />
                        </button>
                      </div>
                      
                      <div className={`text-right ${isMobile ? 'w-full flex justify-between items-center mt-2' : 'min-w-20'}`}>
                        <div className={`font-bold text-gray-800 ${isMobile ? 'text-base' : 'text-lg'}`}>
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </div>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-500 hover:text-red-700 transition-colors flex items-center gap-1 text-xs sm:text-sm"
                        >
                          <FaTrash size={isMobile ? 12 : 14} />
                          {isMobile ? '' : 'Remove'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary - Mobile Responsive */}
            <div className={isMobile ? 'sticky bottom-0 bg-white p-4 rounded-t-lg shadow-2xl border-t' : 'lg:col-span-1'}>
              <div className={`bg-white rounded-lg shadow-lg p-4 sm:p-6 ${isMobile ? '' : 'sticky top-4'}`}>
                {isLoggedIn ? (
                  <div className="flex items-center gap-2 mb-4">
                    <FaUser className="text-orange-500" />
                    <span className="font-semibold text-gray-800 text-sm sm:text-base">{user?.username || 'User'}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 mb-4 p-3 bg-amber-50 rounded-lg">
                    <FaSignInAlt className="text-amber-500" />
                    <span className="font-semibold text-amber-700 text-sm">Guest User</span>
                    <button 
                      onClick={handleLogin}
                      className="ml-auto text-amber-600 hover:text-amber-800 text-xs font-semibold underline"
                    >
                      Login
                    </button>
                  </div>
                )}
                
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">Order Summary</h3>
                
                <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                  <div className="flex justify-between text-gray-600 text-sm sm:text-base">
                    <span>Subtotal ({cartItems.reduce((total, item) => total + item.quantity, 0)} items)</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600 text-sm sm:text-base">
                    <span>Tax (10%)</span>
                    <span>₹{tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600 text-sm sm:text-base">
                    <span>Delivery Fee</span>
                    <span>₹{deliveryFee.toFixed(2)}</span>
                  </div>
                  <hr className="my-2 sm:my-3" />
                  <div className="flex justify-between font-bold text-gray-800 text-base sm:text-lg">
                    <span>Total</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                </div>

                <button 
                  onClick={handleCheckout}
                  className={`w-full text-white py-3 rounded-lg font-semibold transition-colors mb-3 shadow-md ${
                    isLoggedIn 
                      ? 'bg-green-600 hover:bg-green-700' 
                      : 'bg-amber-500 hover:bg-amber-600'
                  }`}
                >
                  {isLoggedIn 
                    ? (isMobile ? 'Place Order 🚀' : 'Place Order') 
                    : (isMobile ? 'Login to Order' : 'Login to Place Order')
                  }
                </button>
                
                <Link 
                  to="/menu"
                  className="w-full bg-orange-500 text-white py-2 sm:py-2 rounded-lg font-semibold hover:bg-orange-600 transition-colors text-center block shadow-md text-sm sm:text-base"
                >
                  {isMobile ? 'Add More Items' : 'Continue Shopping'}
                </Link>

                {subtotal > 0 && subtotal < 299 && (
                  <div className="mt-3 sm:mt-4 p-2 sm:p-3 bg-amber-50 border border-amber-200 rounded-lg text-center">
                    <p className="text-amber-700 text-xs sm:text-sm">
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