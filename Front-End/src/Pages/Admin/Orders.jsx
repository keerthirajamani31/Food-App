import React, { useState } from 'react';
import { FaSearch, FaFilter, FaTimes, FaCheck, FaClock, FaTruck, FaBox, FaTrash, FaBan } from 'react-icons/fa';

const Orders = ({ orders, updateOrderStatus, cancelOrder, deleteOrder }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Filter and sort orders
  const filteredOrders = orders
    .filter(order => {
      const matchesSearch = 
        order.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.id?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.date) - new Date(a.date);
        case 'oldest':
          return new Date(a.date) - new Date(b.date);
        case 'amount-high':
          return parseFloat(b.totalAmount) - parseFloat(a.totalAmount);
        case 'amount-low':
          return parseFloat(a.totalAmount) - parseFloat(b.totalAmount);
        default:
          return new Date(b.date) - new Date(a.date);
      }
    });

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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <FaClock className="inline mr-1" size={14} />;
      case 'confirmed':
        return <FaCheck className="inline mr-1" size={14} />;
      case 'preparing':
        return <FaBox className="inline mr-1" size={14} />;
      case 'out-for-delivery':
        return <FaTruck className="inline mr-1" size={14} />;
      case 'delivered':
        return <FaCheck className="inline mr-1" size={14} />;
      case 'cancelled':
        return <FaBan className="inline mr-1" size={14} />;
      default:
        return <FaClock className="inline mr-1" size={14} />;
    }
  };

  const getNextStatus = (currentStatus) => {
    switch (currentStatus) {
      case 'pending':
        return 'confirmed';
      case 'confirmed':
        return 'preparing';
      case 'preparing':
        return 'out-for-delivery';
      case 'out-for-delivery':
        return 'delivered';
      default:
        return null;
    }
  };

  const handleStatusUpdate = (orderId, currentStatus) => {
    const nextStatus = getNextStatus(currentStatus);
    if (nextStatus) {
      updateOrderStatus(orderId, nextStatus);
    }
  };

  return (
    <div className="space-y-6">
      
     

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="preparing">Preparing</option>
              <option value="out-for-delivery">Out for Delivery</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Sort */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="amount-high">Amount: High to Low</option>
              <option value="amount-low">Amount: Low to High</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Summary */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Orders Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-2xl font-bold text-blue-800">{orders.filter(o => o.status === 'pending').length}</div>
            <div className="text-sm text-blue-600">Pending</div>
          </div>
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="text-2xl font-bold text-green-800">{orders.filter(o => o.status === 'delivered').length}</div>
            <div className="text-sm text-green-600">Delivered</div>
          </div>
          <div className="p-4 bg-red-50 rounded-lg border border-red-200">
            <div className="text-2xl font-bold text-red-800">{orders.filter(o => o.status === 'cancelled').length}</div>
            <div className="text-sm text-red-600">Cancelled</div>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
            <div className="text-2xl font-bold text-purple-800">{orders.length}</div>
            <div className="text-sm text-purple-600">Total</div>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-6">
        {filteredOrders.map((order) => (
          <div key={order.id} className="bg-white rounded-lg shadow border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1).replace('-', ' ')}
                  </span>
                  <span className="font-mono text-sm text-gray-600">#{order.id.slice(-8)}</span>
                  <span className="text-gray-500 text-sm">
                    {new Date(order.date).toLocaleDateString()} at {new Date(order.date).toLocaleTimeString()}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="font-semibold text-gray-800">{order.customerName}</span>
                  <span className="text-gray-600">{order.customerEmail}</span>
                  {order.phone && <span className="text-gray-600">{order.phone}</span>}
                </div>
              </div>

              <div className="text-right">
                <div className="text-2xl font-bold text-gray-800 mb-1">₹{order.totalAmount}</div>
                <div className="text-sm text-gray-600">{order.items.length} items</div>
              </div>
            </div>

            {/* Order Items */}
            <div className="mb-4">
              <h4 className="font-semibold text-gray-800 mb-3">Order Items:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-10 h-10 object-cover rounded-lg"
                      />
                      <div>
                        <span className="font-medium text-gray-800 block">{item.name}</span>
                        <span className="text-sm text-gray-600">Qty: {item.quantity}</span>
                      </div>
                    </div>
                    <span className="font-semibold text-green-600">₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Address */}
            {order.address && order.address !== 'No address provided' && (
              <div className="mb-4">
                <h4 className="font-semibold text-gray-800 mb-2">Delivery Address:</h4>
                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{order.address}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200">
              {order.status !== 'cancelled' && order.status !== 'delivered' && getNextStatus(order.status) && (
                <button
                  onClick={() => handleStatusUpdate(order.id, order.status)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                >
                  Mark as {getNextStatus(order.status).replace('-', ' ')}
                </button>
              )}

              {order.status === 'pending' && (
                <button
                  onClick={() => cancelOrder(order.id)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                >
                  Cancel Order
                </button>
              )}

              <button
                onClick={() => deleteOrder(order.id)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
              >
                Delete Order
              </button>

              {order.status === 'delivered' && (
                <span className="px-3 py-2 bg-green-100 text-green-800 rounded-lg text-sm font-medium">
                  Order Completed
                </span>
              )}

              {order.status === 'cancelled' && (
                <span className="px-3 py-2 bg-red-100 text-red-800 rounded-lg text-sm font-medium">
                  Order Cancelled
                </span>
              )}
            </div>
          </div>
        ))}

        {filteredOrders.length === 0 && (
          <div className="bg-white rounded-lg shadow border border-gray-200 p-12 text-center">
            <FaSearch className="text-gray-400 text-4xl mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No orders found</h3>
            <p className="text-gray-600">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'No orders have been placed yet'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;