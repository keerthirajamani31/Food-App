import React, { useState, useEffect } from 'react';
import AddItems from '../../Pages/Admin/AddItems';
import ListItems from '../../Pages/Admin/ListItems';
import Orders from '../../Pages/Admin/Orders';

const AdminDashboard = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [menuItems, setMenuItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Load menu items
  useEffect(() => {
    const loadMenuItems = () => {
      try {
        const storedItems = JSON.parse(localStorage.getItem('menuItems') || '[]');
        console.log('🔄 AdminDashboard - Loading items from localStorage:', storedItems.length);
        setMenuItems(storedItems);
      } catch (error) {
        console.error('❌ Error loading menu items:', error);
        setMenuItems([]);
      }
    };

    loadMenuItems();

    const handleStorageChange = (e) => {
      if (e.key === 'menuItems' || !e.key) {
        console.log('🔄 Storage changed, reloading items...');
        loadMenuItems();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('menuItemsUpdated', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('menuItemsUpdated', handleStorageChange);
    };
  }, []);

  // Load orders and calculate customers
  useEffect(() => {
    const loadOrders = () => {
      try {
        const storedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
        console.log('🔄 AdminDashboard - Loading orders from localStorage:', storedOrders.length);
        
        // Sort orders by date (newest first)
        const sortedOrders = storedOrders.sort((a, b) => new Date(b.date) - new Date(a.date));
        setOrders(sortedOrders);

        // Extract unique customers from orders
        const uniqueCustomers = [];
        const customerEmails = new Set();

        storedOrders.forEach(order => {
          if (order.customerEmail && !customerEmails.has(order.customerEmail)) {
            customerEmails.add(order.customerEmail);
            uniqueCustomers.push({
              name: order.customerName,
              email: order.customerEmail,
              ordersCount: storedOrders.filter(o => o.customerEmail === order.customerEmail).length,
              totalSpent: storedOrders
                .filter(o => o.customerEmail === order.customerEmail)
                .reduce((sum, o) => sum + parseFloat(o.totalAmount || 0), 0)
            });
          }
        });

        setCustomers(uniqueCustomers);
      } catch (error) {
        console.error('❌ Error loading orders:', error);
        setOrders([]);
        setCustomers([]);
      }
    };

    loadOrders();

    // Listen for order updates
    const handleOrderUpdate = () => {
      console.log('🔄 Order update detected, reloading orders...');
      loadOrders();
    };

    window.addEventListener('newOrder', handleOrderUpdate);
    window.addEventListener('orderUpdate', handleOrderUpdate);
    window.addEventListener('storage', handleOrderUpdate);

    return () => {
      window.removeEventListener('newOrder', handleOrderUpdate);
      window.removeEventListener('orderUpdate', handleOrderUpdate);
      window.removeEventListener('storage', handleOrderUpdate);
    };
  }, []);

  // Order management functions
  const updateOrderStatus = (orderId, newStatus) => {
    try {
      const allOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      const updatedOrders = allOrders.map(order => 
        order.id === orderId 
          ? { ...order, status: newStatus }
          : order
      );
      
      localStorage.setItem('orders', JSON.stringify(updatedOrders));
      setOrders(updatedOrders.sort((a, b) => new Date(b.date) - new Date(a.date)));
      
      // Trigger update events
      window.dispatchEvent(new Event('orderUpdate'));
      
      console.log(`✅ Order ${orderId} status updated to: ${newStatus}`);
      return true;
    } catch (error) {
      console.error('❌ Error updating order status:', error);
      return false;
    }
  };

  const cancelOrder = (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order? This action cannot be undone.')) {
      return false;
    }

    const success = updateOrderStatus(orderId, 'cancelled');
    if (success) {
      alert('Order cancelled successfully!');
    } else {
      alert('Error cancelling order. Please try again.');
    }
    return success;
  };

  const deleteOrder = (orderId) => {
    if (!window.confirm('Are you sure you want to permanently delete this order? This action cannot be undone.')) {
      return false;
    }

    try {
      const allOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      const updatedOrders = allOrders.filter(order => order.id !== orderId);
      
      localStorage.setItem('orders', JSON.stringify(updatedOrders));
      setOrders(updatedOrders);
      
      // Trigger update events
      window.dispatchEvent(new Event('orderUpdate'));
      
      alert('Order deleted successfully!');
      return true;
    } catch (error) {
      console.error('❌ Error deleting order:', error);
      alert('Error deleting order. Please try again.');
      return false;
    }
  };

  // Calculate real statistics
  const calculateStats = () => {
    // Calculate total revenue from all orders (excluding cancelled)
    const totalRevenue = orders.reduce((sum, order) => {
      if (order.status !== 'cancelled') {
        return sum + parseFloat(order.totalAmount || 0);
      }
      return sum;
    }, 0);

    // Calculate today's revenue
    const today = new Date().toDateString();
    const todayRevenue = orders.reduce((sum, order) => {
      const orderDate = new Date(order.date).toDateString();
      return (orderDate === today && order.status !== 'cancelled') 
        ? sum + parseFloat(order.totalAmount || 0) 
        : sum;
    }, 0);

    // Count orders by status
    const pendingOrders = orders.filter(order => order.status === 'pending').length;
    const completedOrders = orders.filter(order => order.status === 'completed' || order.status === 'delivered').length;
    const cancelledOrders = orders.filter(order => order.status === 'cancelled').length;
    const activeOrders = orders.filter(order => 
      order.status === 'pending' || order.status === 'confirmed' || order.status === 'preparing' || order.status === 'out-for-delivery'
    ).length;

    return {
      totalRevenue: totalRevenue.toFixed(2),
      todayRevenue: todayRevenue.toFixed(2),
      totalOrders: orders.length,
      pendingOrders,
      completedOrders,
      cancelledOrders,
      activeOrders,
      totalCustomers: customers.length,
    };
  };

  const stats = calculateStats();

  const Dashboard = () => {
    return (
      <>
        {/* Mobile Header */}
        <div className="lg:hidden bg-amber-700 text-white p-4 mb-6 rounded-lg">
          <h1 className="text-xl font-bold">Admin Dashboard</h1>
          <p className="text-amber-100 text-sm">Welcome to Foodie-Bazar Admin</p>
        </div>

        {/* Stats Grid - Mobile Responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          {/* Total Revenue */}
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow border border-green-200">
            <div className="flex items-center">
              <div className="p-2 sm:p-3 bg-green-100 rounded-lg">
                <span className="text-xl sm:text-2xl">💰</span>
              </div>
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm text-gray-600">Total Revenue</p>
                <p className="text-lg sm:text-2xl font-bold text-green-800">₹{stats.totalRevenue}</p>
                <p className="text-xs text-green-600">₹{stats.todayRevenue} today</p>
              </div>
            </div>
          </div>

          {/* Total Orders */}
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow border border-blue-200">
            <div className="flex items-center">
              <div className="p-2 sm:p-3 bg-blue-100 rounded-lg">
                <span className="text-xl sm:text-2xl">🛒</span>
              </div>
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm text-gray-600">Total Orders</p>
                <p className="text-lg sm:text-2xl font-bold text-blue-800">{stats.totalOrders}</p>
                <div className="flex gap-1 sm:gap-2 text-xs">
                  <span className="text-orange-600">{stats.activeOrders} active</span>
                  <span className="text-green-600">{stats.completedOrders} completed</span>
                </div>
              </div>
            </div>
          </div>

          {/* Customers */}
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow border border-purple-200">
            <div className="flex items-center">
              <div className="p-2 sm:p-3 bg-purple-100 rounded-lg">
                <span className="text-xl sm:text-2xl">👥</span>
              </div>
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm text-gray-600">Customers</p>
                <p className="text-lg sm:text-2xl font-bold text-purple-800">{stats.totalCustomers}</p>
                <p className="text-xs text-purple-600">Unique customers</p>
              </div>
            </div>
          </div>

          {/* Order Status Overview */}
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow border border-amber-200">
            <div className="flex items-center">
              <div className="p-2 sm:p-3 bg-amber-100 rounded-lg">
                <span className="text-xl sm:text-2xl">📊</span>
              </div>
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm text-gray-600">Order Status</p>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-orange-600">Pending:</span>
                    <span>{stats.pendingOrders}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-red-600">Cancelled:</span>
                    <span>{stats.cancelledOrders}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow border border-amber-200 p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold text-amber-800 mb-3 sm:mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <button 
              onClick={() => setCurrentView('addItems')}
              className="text-center p-3 sm:p-4 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors cursor-pointer border border-amber-200"
            >
              <span className="text-2xl sm:text-3xl block mb-1 sm:mb-2">➕</span>
              <p className="font-medium text-sm sm:text-base">Add New Items</p>
              <p className="text-xs sm:text-sm text-gray-600">Create new menu items</p>
            </button>
            
            <button 
              onClick={() => setCurrentView('listItems')}
              className="text-center p-3 sm:p-4 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors cursor-pointer border border-amber-200"
            >
              <span className="text-2xl sm:text-3xl block mb-1 sm:mb-2">📋</span>
              <p className="font-medium text-sm sm:text-base">Manage Menu</p>
              <p className="text-xs sm:text-sm text-gray-600">View and edit items</p>
            </button>
            
            <button 
              onClick={() => setCurrentView('orders')}
              className="text-center p-3 sm:p-4 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors cursor-pointer border border-amber-200"
            >
              <span className="text-2xl sm:text-3xl block mb-1 sm:mb-2">🛒</span>
              <p className="font-medium text-sm sm:text-base">Order Management</p>
              <p className="text-xs sm:text-sm text-gray-600">Process customer orders</p>
            </button>
          </div>
        </div>
      </>
    );
  };

  const renderContent = () => {
    switch (currentView) {
      case 'addItems':
        return <AddItems 
          menuItems={menuItems} 
          setMenuItems={setMenuItems} 
          setCurrentView={setCurrentView} 
        />;
      case 'listItems':
        return <ListItems 
          menuItems={menuItems} 
          setMenuItems={setMenuItems} 
          setCurrentView={setCurrentView} 
        />;
      case 'orders':
        return <Orders 
          orders={orders} 
          setOrders={setOrders}
          updateOrderStatus={updateOrderStatus}
          cancelOrder={cancelOrder}
          deleteOrder={deleteOrder}
        />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-amber-50">
      {/* Mobile Header */}
      <div className="lg:hidden bg-amber-800 text-white p-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg bg-amber-700"
          >
            <span className="text-xl">☰</span>
          </button>
          <h1 className="text-lg font-bold">Foodie-Bazar Admin</h1>
          <div className="w-8"></div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar - Hidden on mobile by default */}
        <div className={`${isSidebarOpen ? 'block' : 'hidden'} lg:block w-64 bg-amber-800 min-h-screen p-4 lg:p-6 fixed lg:relative z-50 lg:z-auto`}>
          <div className="space-y-2 sm:space-y-4">
            <div className="hidden lg:block mb-6">
              <h1 className="text-xl font-bold text-amber-100">Foodie-Bazar Admin</h1>
            </div>
            
            <button 
              onClick={() => {
                setCurrentView('dashboard');
                setIsSidebarOpen(false);
              }}
              className={`flex items-center gap-3 text-amber-100 hover:bg-amber-700 p-3 rounded-lg transition-colors w-full text-left ${
                currentView === 'dashboard' ? 'bg-amber-700' : ''
              }`}
            >
              <span>📊</span>
              <span className="text-sm lg:text-base">Dashboard</span>
            </button>
            
            <button 
              onClick={() => {
                setCurrentView('addItems');
                setIsSidebarOpen(false);
              }}
              className={`flex items-center gap-3 text-amber-100 hover:bg-amber-700 p-3 rounded-lg transition-colors w-full text-left ${
                currentView === 'addItems' ? 'bg-amber-700' : ''
              }`}
            >
              <span>➕</span>
              <span className="text-sm lg:text-base">Add Items</span>
            </button>
            
            <button 
              onClick={() => {
                setCurrentView('listItems');
                setIsSidebarOpen(false);
              }}
              className={`flex items-center gap-3 text-amber-100 hover:bg-amber-700 p-3 rounded-lg transition-colors w-full text-left ${
                currentView === 'listItems' ? 'bg-amber-700' : ''
              }`}
            >
              <span>📋</span>
              <span className="text-sm lg:text-base">List Items</span>
            </button>
            
            <button 
              onClick={() => {
                setCurrentView('orders');
                setIsSidebarOpen(false);
              }}
              className={`flex items-center gap-3 text-amber-100 hover:bg-amber-700 p-3 rounded-lg transition-colors w-full text-left ${
                currentView === 'orders' ? 'bg-amber-700' : ''
              }`}
            >
              <span>🛒</span>
              <span className="text-sm lg:text-base">Orders</span>
              {orders.filter(order => order.status === 'pending').length > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full ml-auto">
                  {orders.filter(order => order.status === 'pending').length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8">
          {/* Desktop Header */}
          <div className="hidden lg:block mb-6">
            <h1 className="text-2xl lg:text-3xl font-bold text-amber-800 mb-2">
              {currentView === 'dashboard' ? 'Dashboard' : 
               currentView === 'addItems' ? 'Add New Item' :
               currentView === 'listItems' ? 'Menu Items' : 'Orders Management'}
            </h1>
            <p className="text-amber-600">
              {currentView === 'dashboard' ? 'Welcome to Foodie-Bazar Admin' : 'Manage your restaurant operations'}
            </p>
          </div>

          {renderContent()}
        </div>
      </div>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default AdminDashboard;