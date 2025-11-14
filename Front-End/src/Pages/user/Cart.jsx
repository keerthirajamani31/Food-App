import React, { useState, useEffect } from 'react';
import { FaTrash, FaPlus, FaMinus, FaShoppingCart, FaArrowLeft, FaUser, FaSignInAlt, FaTimes, FaCreditCard, FaCheck, FaBox } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [showCartDrawer, setShowCartDrawer] = useState(false);
  const [showOrderConfirmation, setShowOrderConfirmation] = useState(false);
  const [recentOrder, setRecentOrder] = useState(null);
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

  // Authentication check
  useEffect(() => {
    const checkAuth = () => {
      try {
        const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
        const userData = JSON.parse(localStorage.getItem('user') || 'null');
        
        setIsLoggedIn(loggedIn);
        setUser(userData);
      } catch (error) {
        console.error('Auth error:', error);
        setIsLoggedIn(false);
      }
    };

    checkAuth();

    const handleAuthChange = () => setTimeout(checkAuth, 100);
    window.addEventListener('userLoggedIn', handleAuthChange);
    window.addEventListener('userLoggedOut', handleAuthChange);
    
    return () => {
      window.removeEventListener('userLoggedIn', handleAuthChange);
      window.removeEventListener('userLoggedOut', handleAuthChange);
    };
  }, []);

  // Load cart function
  const loadCart = () => {
    try {
      const savedCart = localStorage.getItem('cart');
      
      if (!savedCart || savedCart === 'undefined' || savedCart === 'null') {
        setCartItems([]);
        localStorage.setItem('cart', '[]');
        return;
      }

      const parsedCart = JSON.parse(savedCart);
      
      const normalizedCart = Array.isArray(parsedCart) ? parsedCart
        .filter(item => item && typeof item === 'object')
        .map(item => ({
          id: item.id || item._id || `item_${Date.now()}_${Math.random()}`,
          name: item.name || 'Unknown Item',
          price: Number(item.price) || 0,
          quantity: Number(item.quantity) || 1,
          image: item.image || item.img || 'https://via.placeholder.com/150',
          description: item.description || '',
          variety: item.variety || 'Standard'
        })) : [];

      setCartItems(normalizedCart);
    } catch (error) {
      console.error('Cart load error:', error);
      setCartItems([]);
      localStorage.setItem('cart', '[]');
    }
  };

  // Load cart and listen for updates
  useEffect(() => {
    loadCart();

    const handleCartUpdate = () => {
      console.log('🔄 Cart update received in Cart component');
      setTimeout(loadCart, 50);
    };

    window.addEventListener('cartUpdate', handleCartUpdate);
    return () => window.removeEventListener('cartUpdate', handleCartUpdate);
  }, []);

  // Update cart function
  const updateCart = (updatedCart) => {
    const normalizedCart = updatedCart.map(item => ({
      id: item.id,
      name: item.name,
      price: Number(item.price),
      quantity: Number(item.quantity),
      image: item.image,
      description: item.description,
      variety: item.variety
    }));
    
    setCartItems(normalizedCart);
    localStorage.setItem('cart', JSON.stringify(normalizedCart));
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
    if (isMobile) setShowCartDrawer(false);
  };

  const handleLogin = () => {
    navigate('/login');
    if (isMobile) setShowCartDrawer(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.setItem('isLoggedIn', 'false');
    setIsLoggedIn(false);
    setUser(null);
    
    window.dispatchEvent(new CustomEvent('userLoggedOut'));
    alert('Logged out successfully!');
  };

  // FIXED: Show order confirmation in cart instead of immediate navigation
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
        if (isMobile) setShowCartDrawer(false);
      }
      return;
    }

    const order = {
      id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      customerName: user?.username || 'Customer',
      customerEmail: user?.emailAddress || user?.email || 'No email provided',
      items: [...cartItems],
      totalAmount: total.toFixed(2),
      status: 'pending',
      date: new Date().toISOString(),
      address: user?.address || 'No address provided',
      phone: user?.phoneNumber || user?.phone || 'No phone provided',
      paymentMethod: 'cash-on-delivery'
    };

    try {
      console.log('💾 Saving order:', order);
      
      // Get existing orders or initialize empty array
      const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      console.log('📦 Existing orders:', existingOrders);
      
      // Add new order
      existingOrders.push(order);
      
      // Save back to localStorage
      localStorage.setItem('orders', JSON.stringify(existingOrders));
      console.log('✅ Order saved successfully');
      
      // Set recent order and show confirmation
      setRecentOrder(order);
      setShowOrderConfirmation(true);
      
      // Clear cart
      clearCart();
      
      // Dispatch events for other components
      window.dispatchEvent(new Event('newOrder'));
      window.dispatchEvent(new Event('orderUpdate'));
      window.dispatchEvent(new Event('storage'));
      
    } catch (error) {
      console.error('❌ Error placing order:', error);
      alert('Error placing order. Please try again.');
    }
  };

  const handleViewOrders = () => {
    setShowOrderConfirmation(false);
    navigate('/orders');
  };

  const handleContinueShopping = () => {
    setShowOrderConfirmation(false);
    if (isMobile) setShowCartDrawer(false);
    navigate('/menu');
  };

  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const tax = subtotal * 0.1;
  const deliveryFee = subtotal > 0 ? 40 : 0;
  const total = subtotal + tax + deliveryFee;

  // Order Confirmation Component
  const OrderConfirmation = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-green-500 text-white p-6 rounded-t-lg text-center">
          <FaCheck className="text-4xl mx-auto mb-3" />
          <h2 className="text-2xl font-bold">Order Placed Successfully!</h2>
          <p className="text-green-100 mt-2">Thank you for your order</p>
        </div>
        
        <div className="p-6">
          {recentOrder && (
            <>
              <div className="text-center mb-4">
                <p className="text-gray-600">Order ID: <span className="font-semibold">{recentOrder.id.slice(-8).toUpperCase()}</span></p>
                <p className="text-gray-600">Total Amount: <span className="font-semibold text-green-600">₹{recentOrder.totalAmount}</span></p>
                <p className="text-gray-500 text-sm mt-2">Status: <span className="font-semibold text-orange-500">Pending</span></p>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h3 className="font-semibold text-gray-800 mb-3">Order Items:</h3>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {recentOrder.items.map((item, index) => (
                    <div key={index} className="flex items-center gap-3 text-sm">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-10 h-10 object-cover rounded"
                      />
                      <div className="flex-1">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-gray-600">Qty: {item.quantity} × ₹{item.price}</p>
                      </div>
                      <p className="font-semibold">₹{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 mt-4">
                <p className="text-sm text-gray-600">
                  <strong>Delivery to:</strong> {recentOrder.address}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  <strong>Payment:</strong> {recentOrder.paymentMethod.replace('-', ' ')}
                </p>
              </div>
            </>
          )}

          <div className="flex flex-col gap-3 mt-6">
            <button 
              onClick={handleViewOrders}
              className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
            >
              <FaBox />
              View All Orders
            </button>
            <button 
              onClick={handleContinueShopping}
              className="w-full bg-gray-500 text-white py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Mobile Cart Drawer
  const MobileCartDrawer = () => (
    <div className={`fixed inset-0 z-50 transform transition-transform duration-300 ease-in-out ${
      showCartDrawer ? 'translate-x-0' : 'translate-x-full'
    }`}>
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={() => setShowCartDrawer(false)}
      />
      
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl overflow-hidden flex flex-col">
        <div className="bg-orange-500 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FaShoppingCart className="text-white" />
            <h2 className="text-xl font-bold">Your Cart</h2>
            {cartItems.length > 0 && (
              <span className="bg-white text-orange-500 rounded-full w-6 h-6 text-sm flex items-center justify-center font-bold">
                {cartItems.reduce((total, item) => total + item.quantity, 0)}
              </span>
            )}
          </div>
          <button 
            onClick={() => setShowCartDrawer(false)}
            className="p-2 hover:bg-orange-600 rounded-full transition-colors"
          >
            <FaTimes size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {cartItems.length === 0 ? (
            <div className="text-center py-8">
              <FaShoppingCart className="text-orange-400 text-4xl mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Your cart is empty</h3>
              <p className="text-gray-600 mb-4">Add some delicious items from our menu</p>
              <button 
                onClick={() => {
                  setShowCartDrawer(false);
                  navigate('/menu');
                }}
                className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
              >
                Browse Menu
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {cartItems.map((item, index) => (
                <div key={item.id || index} className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/150?text=No+Image';
                      }}
                    />
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-800 text-sm truncate">{item.name}</h3>
                      <p className="text-green-600 font-bold text-sm">₹{item.price}</p>
                      {item.variety && item.variety !== 'Standard' && (
                        <p className="text-gray-500 text-xs">Variety: {item.variety}</p>
                      )}
                    </div>
                    
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => decreaseQuantity(item.id)}
                          className="w-6 h-6 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-gray-200 transition-colors"
                        >
                          <FaMinus size={10} />
                        </button>
                        
                        <span className="w-6 text-center font-semibold text-gray-800 text-sm">
                          {item.quantity}
                        </span>
                        
                        <button 
                          onClick={() => increaseQuantity(item.id)}
                          className="w-6 h-6 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-gray-200 transition-colors"
                        >
                          <FaPlus size={10} />
                        </button>
                      </div>
                      
                      <div className="text-right">
                        <div className="font-bold text-gray-800 text-sm">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </div>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-500 hover:text-red-700 transition-colors text-xs flex items-center gap-1"
                        >
                          <FaTrash size={10} />
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="border-t border-gray-200 p-4 bg-white">
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span>Subtotal ({cartItems.reduce((total, item) => total + item.quantity, 0)} items)</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tax (10%)</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Delivery Fee</span>
                <span>₹{deliveryFee.toFixed(2)}</span>
              </div>
              <hr />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>

            <button 
              onClick={handleCheckout}
              className={`w-full text-white py-3 rounded-lg font-semibold transition-colors mb-2 flex items-center justify-center gap-2 ${
                isLoggedIn ? 'bg-green-600 hover:bg-green-700' : 'bg-amber-500 hover:bg-amber-600'
              }`}
            >
              <FaCreditCard />
              {isLoggedIn ? 'Place Order' : 'Login to Checkout'}
            </button>

            {!isLoggedIn && (
              <button 
                onClick={handleLogin}
                className="w-full bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600 transition-colors text-sm mb-2"
              >
                Create Account / Login
              </button>
            )}

            <button 
              onClick={clearCart}
              className="w-full text-red-500 py-2 rounded-lg font-semibold hover:text-red-700 transition-colors text-sm border border-red-200"
            >
              Clear Cart
            </button>
          </div>
        )}
      </div>
    </div>
  );

  // Mobile Floating Cart Button
  const MobileFloatingCart = () => (
    !showCartDrawer && (
      <div className="fixed bottom-6 right-6 z-40">
        <button 
          onClick={() => setShowCartDrawer(true)}
          className="bg-orange-500 text-white p-4 rounded-full shadow-lg hover:bg-orange-600 transition-colors relative"
        >
          <FaShoppingCart size={24} />
          {cartItems.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center font-bold">
              {cartItems.reduce((total, item) => total + item.quantity, 0)}
            </span>
          )}
        </button>
      </div>
    )
  );

  // Show order confirmation if active
  if (showOrderConfirmation) {
    return <OrderConfirmation />;
  }

  // Desktop: Show cart regardless of login status
  if (!isMobile) {
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
              <h1 className="text-4xl font-bold text-gray-800 mb-2">Your Cart</h1>
              {isLoggedIn ? (
                <div className="flex items-center justify-center gap-2 text-gray-600">
                  <FaUser className="text-orange-500" />
                  <span>Welcome, {user?.username || 'User'}!</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2 text-amber-600">
                  <FaSignInAlt className="text-amber-500" />
                  <span>Guest User - Login to checkout</span>
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
                  {cartItems.map((item, index) => (
                    <div key={item.id || index} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all duration-300">
                      <div className="flex items-center gap-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/150?text=No+Image';
                          }}
                        />
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-lg text-gray-800 truncate">{item.name}</h3>
                          {item.variety && item.variety !== 'Standard' && (
                            <p className="text-gray-600 text-sm mb-2">Variety: {item.variety}</p>
                          )}
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
                  {isLoggedIn ? (
                    <div className="flex items-center gap-2 mb-4">
                      <FaUser className="text-orange-500" />
                      <span className="font-semibold text-gray-800">{user?.username || 'User'}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 mb-4 p-3 bg-amber-50 rounded-lg">
                      <FaSignInAlt className="text-amber-500" />
                      <span className="font-semibold text-amber-700">Guest User</span>
                    </div>
                  )}
                  
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
                    className={`w-full text-white py-3 rounded-lg font-semibold transition-colors mb-3 shadow-md ${
                      isLoggedIn 
                        ? 'bg-green-600 hover:bg-green-700' 
                        : 'bg-amber-500 hover:bg-amber-600'
                    }`}
                  >
                    {isLoggedIn ? 'Place Order' : 'Login to Checkout'}
                  </button>
                  
                  <Link 
                    to="/menu"
                    className="w-full bg-orange-500 text-white py-2 rounded-lg font-semibold hover:bg-orange-600 transition-colors text-center block shadow-md"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Mobile view
  return (
    <>
      {/* Mobile Floating Cart Button - Only shows when drawer is closed */}
      <MobileFloatingCart />
      
      {/* Mobile Cart Drawer - This is the main cart for mobile */}
      <MobileCartDrawer />

      {/* Mobile: Show empty state when drawer is closed */}
      {!showCartDrawer && cartItems.length === 0 && (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center max-w-md">
            <FaShoppingCart className="text-orange-400 text-6xl mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Cart is Empty</h2>
            <p className="text-gray-600 mb-6">Tap the cart icon to add items</p>
            <button 
              onClick={() => navigate('/menu')}
              className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
            >
              Browse Menu
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Cart;