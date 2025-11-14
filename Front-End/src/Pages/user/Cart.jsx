import React, { useState, useEffect } from 'react';
import { FaTrash, FaPlus, FaMinus, FaShoppingCart, FaArrowLeft, FaUser, FaSignInAlt } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { MobileAuth } from '../../utils/auth';

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

  // Check authentication - HYBRID APPROACH
  useEffect(() => {
    const checkAuth = () => {
      try {
        // Try backend login first
        const backendLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        const backendUser = JSON.parse(localStorage.getItem('user') || 'null');
        
        // Try mobile auth as fallback
        const mobileLoggedIn = MobileAuth.isLoggedIn();
        const mobileUser = MobileAuth.getCurrentUser();
        
        // Use whichever is available
        const loggedIn = backendLoggedIn || mobileLoggedIn;
        const userData = backendUser || mobileUser;
        
        console.log('🔑 Hybrid Auth Check:', { 
          mobile: isMobile, 
          backendLoggedIn, 
          mobileLoggedIn,
          finalLoggedIn: loggedIn
        });
        
        setIsLoggedIn(loggedIn);
        setUser(userData);
        
        // ALWAYS load cart on mobile, only load when logged in on desktop
        if (isMobile) {
          loadCart();
        } else if (loggedIn) {
          loadCart();
        } else {
          setCartItems([]); // Clear cart if not logged in on desktop
        }
      } catch (error) {
        console.error('Auth error:', error);
        setIsLoggedIn(false);
        // Still load cart on mobile even if auth fails
        if (isMobile) {
          loadCart();
        }
      }
    };

    checkAuth();

    // Enhanced event listeners
    const handleLoginEvent = () => {
      console.log('🔄 Login event received in Cart');
      setTimeout(checkAuth, 200);
    };

    const handleStorageChange = () => {
      console.log('💾 Storage change in Cart');
      checkAuth();
    };

    window.addEventListener('userLoggedIn', handleLoginEvent);
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('userLoggedOut', checkAuth);
    
    return () => {
      window.removeEventListener('userLoggedIn', handleLoginEvent);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userLoggedOut', checkAuth);
    };
  }, [navigate, isMobile]);

  // Load cart function
  const loadCart = () => {
    try {
      const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
      console.log('🛒 Cart loaded:', savedCart.length, 'items');
      setCartItems(savedCart);
    } catch (error) {
      console.error('Cart load error:', error);
      setCartItems([]);
    }
  };

  // Rest of your cart functions remain the same...
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
    console.log('🔑 Redirecting to login');
    navigate('/login');
  };

  const handleLogout = () => {
    console.log('🚪 Logging out from both systems');
    
    // Logout from both backend and mobile systems
    localStorage.removeItem('user');
    localStorage.setItem('isLoggedIn', 'false');
    MobileAuth.logout();
    
    setIsLoggedIn(false);
    setUser(null);
    
    // Dispatch logout event
    const logoutEvent = new CustomEvent('userLoggedOut');
    window.dispatchEvent(logoutEvent);
    
    // Force storage event
    window.dispatchEvent(new Event('storage'));
    
    alert('Logged out successfully!');
    
    // Reload cart for mobile (guest mode)
    if (isMobile) {
      loadCart();
    }
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    // Always require login for checkout
    if (!isLoggedIn) {
      const proceedToLogin = window.confirm(
        'To complete your order, please login or create an account. Continue to login?'
      );
      if (proceedToLogin) {
        navigate('/login');
      }
      return;
    }

    // Create order (same as before)
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
      
      alert(`Order placed successfully! Thank you, ${user?.username || 'Customer'}`);
      clearCart();
      navigate('/orders');
    } catch (error) {
      alert('Error placing order. Please try again.');
    }
  };

  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const tax = subtotal * 0.1;
  const deliveryFee = subtotal > 0 ? 40 : 0;
  const total = subtotal + tax + deliveryFee;

  // Desktop: Show login prompt if not logged in
  if (!isMobile && !isLoggedIn) {
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

  // Rest of your cart JSX remains the same...
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
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
            {isLoggedIn ? (
              <div className="flex items-center justify-center gap-2 text-gray-600">
                <FaUser className="text-orange-500" />
                <span>Welcome, {user?.username || 'User'}!</span>
              </div>
            ) : isMobile ? (
              <div className="flex items-center justify-center gap-2 text-blue-600">
                <FaShoppingCart className="text-blue-500" />
                <span>Guest Shopping</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2 text-amber-600">
                <FaSignInAlt className="text-amber-500" />
                <span>Please login</span>
              </div>
            )}
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
            {isLoggedIn ? (
              <button 
                onClick={handleLogout}
                className="text-gray-600 hover:text-gray-800 transition-colors font-semibold text-sm"
              >
                Logout
              </button>
            ) : (
              <button 
                onClick={handleLogin}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-semibold"
              >
                Login
              </button>
            )}
          </div>
        </div>

        {/* Rest of your cart JSX... */}
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
            {/* Your cart items display... */}
            <div className="lg:col-span-2">
              <div className="space-y-4">
                {cartItems.map(item => (
                  <div key={item.id} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all duration-300">
                    {/* Your item display code... */}
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-lg p-6 sticky top-4">
                {/* Your order summary code... */}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;