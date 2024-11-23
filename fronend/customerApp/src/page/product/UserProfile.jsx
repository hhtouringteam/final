// src/components/UserProfile.js

import React, { useEffect, useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import { toast } from 'react-toastify'
import axios from 'axios'

const UserProfile = () => {
  const { user, logout } = useContext(AuthContext)
  const [activeTab, setActiveTab] = useState('profile')
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedOrder, setExpandedOrder] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [installmentDetails, setInstallmentDetails] = useState({})
  const [unpaidOrders, setUnpaidOrders] = useState([])
  const navigate = useNavigate()

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api'

  useEffect(() => {
    if (!user) {
      navigate('/login')
    }
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/orders/${user.userId}`)
        const ordersData = response.data
        setOrders(ordersData)
        const unpaid = ordersData.filter(
          order => order.paymentStatus === 'Pending' || order.paymentStatus === 'Partial',
        )
        setUnpaidOrders(unpaid)
      } catch (error) {
        console.error('Order not found', error.response?.data?.message || error.message)
        toast.error('Order not found or an error occurred.')
      }
      setLoading(false)
    }
    if (user && user.userId) {
      fetchOrders()
    }
  }, [user, navigate, API_BASE_URL])

  const handleExpandOrder = async order => {
    if (expandedOrder === order._id) {
      setExpandedOrder(null)
    } else {
      setExpandedOrder(order._id)
      if (order.installmentId && !installmentDetails[order._id]) {
        try {
          const response = await axios.get(`${API_BASE_URL}/installments/${order.installmentId}`)
          setInstallmentDetails(prevDetails => ({
            ...prevDetails,
            [order._id]: response.data,
          }))
        } catch (error) {
          console.error('Error fetching installment details:', error.response?.data?.message || error.message)
          toast.error('Unable to retrieve installment information.')
        }
      }
    }
  }

  const handleMarkAsReceived = async orderId => {
    try {
      const response = await axios.put(`${API_BASE_URL}/orders/${orderId}/status`, { status: 'Received' })

      const updatedOrder = response.data

      setOrders(prevOrders =>
        prevOrders.map(order => (order._id === orderId ? { ...order, orderStatus: updatedOrder.orderStatus } : order)),
      )
      toast.success('Order marked as received successfully!')
    } catch (error) {
      console.error('Error marking order as received:', error.response?.data?.message || error.message)
      toast.error('Failed to mark order as received.')
    }
  }

  const handlePayInstallment = async (orderId, paymentId) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/payments/payInstallment`, {
        orderId,
        paymentId,
      })

      const { paymentUrl } = response.data
      window.location.href = paymentUrl
    } catch (error) {
      console.error('Error initiating installment payment:', error.response?.data?.message || error.message)
      toast.error('An error occurred while creating the payment request.')
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order._id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus =
      filterStatus === 'all' ||
      (order.paymentStatus && order.paymentStatus.toLowerCase() === filterStatus.toLowerCase())
    return matchesSearch && matchesStatus
  })

  if (loading) {
    return <p className="text-center mt-10">Loading...</p>
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        // ... (keep this part unchanged)
        return (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Personal Information</h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <span className="w-32 font-medium">Username:</span>
                <span>{user.username}</span>
              </div>
              <div className="flex items-center">
                <span className="w-32 font-medium">Email:</span>
                <span>{user.email}</span>
              </div>
              <div className="flex items-center">
                <span className="w-32 font-medium">Role:</span>
                <span className="capitalize">{user.role}</span>
              </div>
            </div>
          </div>
        )
      case 'orders':
        return (
          <div>
            {/* Display alert if there are unpaid orders */}
            {unpaidOrders.length > 0 && (
              <div className="bg-yellow-100 text-yellow-800 p-4 mb-4">
                You have {unpaidOrders.length} unpaid orders. Please check and make timely payments.
              </div>
            )}
            {/* ... (rest of the orders tab) */}
            <h2 className="text-2xl font-semibold mb-4">Order History</h2>

            {/* Search and filter orders */}
            <div className="flex flex-col md:flex-row justify-between mb-4">
              <input
                type="text"
                className="border border-gray-300 p-2 rounded-md mb-2 md:mb-0"
                placeholder="Search orders by ID..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
              <select
                className="border border-gray-300 p-2 rounded-md"
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="partial">Partial</option>
                <option value="paid">Paid</option>
                <option value="failed">Failed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {filteredOrders.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead>
                    <tr>
                      {/* ... (keep table headers as they are but translate) */}
                      <th className="py-2 px-4 border-b">Order ID</th>
                      <th className="py-2 px-4 border-b">Order Date</th>
                      <th className="py-2 px-4 border-b">Payment Status</th>
                      <th className="py-2 px-4 border-b">Order Status</th>
                      <th className="py-2 px-4 border-b">Payment Method</th>
                      <th className="py-2 px-4 border-b">Total Amount</th>
                      <th className="py-2 px-4 border-b">Details</th>
                      <th className="py-2 px-4 border-b">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map(order => (
                      <React.Fragment key={order._id}>
                        <tr className={`text-center ${order.installmentId ? 'bg-blue-50' : ''}`}>
                          {/* ... (keep displaying order information but translate labels) */}
                          <td className="py-2 px-4 border-b">#{order._id}</td>
                          <td className="py-2 px-4 border-b">{new Date(order.createdAt).toLocaleString()}</td>
                          <td className="py-2 px-4 border-b capitalize">{order.paymentStatus}</td>
                          <td className="py-2 px-4 border-b capitalize">{order.orderStatus}</td>
                          <td className="py-2 px-4 border-b">{order.paymentMethod}</td>
                          <td className="py-2 px-4 border-b">{order.totalPrice.toLocaleString()} VND</td>
                          <td className="py-2 px-4 border-b">
                            {order.installmentId && <span className="text-blue-600 font-semibold">(Installment)</span>}
                            <button
                              className="text-blue-500 hover:underline ml-2"
                              onClick={() => handleExpandOrder(order)}
                            >
                              {expandedOrder === order._id ? 'Hide' : 'View'}
                            </button>
                          </td>
                          <td className="py-2 px-4 border-b">
                            {/* Add "Mark as Received" button if order status is "Delivered" */}
                            {order.orderStatus === 'Delivered' && order.paymentStatus === 'Paid' && (
                              <button
                                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                                onClick={() => handleMarkAsReceived(order._id)}
                              >
                                Mark as Received
                              </button>
                            )}
                            {/* If order is marked as received, display status */}
                            {order.orderStatus === 'Received' && (
                              <span className="text-green-600 font-semibold">Received</span>
                            )}
                          </td>
                        </tr>
                        {expandedOrder === order._id && (
                          <tr>
                            <td colSpan="8" className="bg-gray-100">
                              <div className="p-4">
                                {/* ... (keep displaying product details but translate labels) */}
                                <h4 className="font-semibold mb-2">Product Details:</h4>
                                <ul className="list-disc list-inside">
                                  {order.cartItems.map(item => (
                                    <li key={item.productId}>
                                      <span className="font-semibold">Product:</span> {item.name} -{' '}
                                      <span className="font-semibold">Quantity:</span> {item.quantity} -{' '}
                                      <span className="font-semibold">Price:</span> {item.price.toLocaleString()} VND
                                    </li>
                                  ))}
                                </ul>
                                {/* Display installment information if available */}
                                {order.installmentId && installmentDetails[order._id] && (
                                  <div className="mt-4">
                                    <h4 className="font-semibold mb-2">Installment Information:</h4>
                                    <p>Number of Installments: {installmentDetails[order._id].installment.plan}</p>
                                    <p>
                                      Interest Rate: {installmentDetails[order._id].installment.interestRate * 100}%
                                    </p>
                                    <p>
                                      Amount per Installment:{' '}
                                      {installmentDetails[order._id].installment.monthlyPayment.toLocaleString()} VND
                                    </p>
                                    <p>
                                      Total Amount to Pay:{' '}
                                      {installmentDetails[order._id].installment.totalAmount.toLocaleString()} VND
                                    </p>
                                    <h5 className="font-semibold mt-2">Installment Payments:</h5>
                                    <table className="min-w-full bg-white">
                                      <thead>
                                        <tr>
                                          <th className="py-2 px-4 border-b">Installment No.</th>
                                          <th className="py-2 px-4 border-b">Due Date</th>
                                          <th className="py-2 px-4 border-b">Amount</th>
                                          <th className="py-2 px-4 border-b">Status</th>
                                          <th className="py-2 px-4 border-b">Action</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {installmentDetails[order._id].payments.map(payment => (
                                          <tr key={payment._id} className="text-center">
                                            <td className="py-2 px-4 border-b">{payment.paymentNumber}</td>
                                            <td className="py-2 px-4 border-b">
                                              {new Date(payment.dueDate).toLocaleDateString()}
                                            </td>
                                            <td className="py-2 px-4 border-b">
                                              {payment.amount.toLocaleString()} VND
                                            </td>
                                            <td className="py-2 px-4 border-b">{payment.status}</td>
                                            <td className="py-2 px-4 border-b">
                                              {payment.status === 'Pending' ? (
                                                <button
                                                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                                                  onClick={() => handlePayInstallment(order._id, payment._id)}
                                                >
                                                  Pay
                                                </button>
                                              ) : (
                                                <span className="text-green-600 font-semibold">Paid</span>
                                              )}
                                            </td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                )}
                                {/* ... (keep displaying additional information but translate labels) */}
                                <div className="mt-4">
                                  <span className="font-semibold">Payment Method:</span> {order.paymentMethod}
                                </div>
                                <div className="mt-2">
                                  <span className="font-semibold">Order Status:</span> {order.orderStatus}
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p>No orders found.</p>
            )}
          </div>
        )
      case 'settings':
        return (
          <div>
            <h2 className="text-2xl font-semibold mb-6">Account Settings</h2>

            {/* Logout Button */}
            <div className="mt-6">
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600 transition duration-300"
              >
                Logout
              </button>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-8">
      {user ? (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6">
            <div className="flex items-center">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt="Avatar"
                  className="w-20 h-20 rounded-full border-4 border-white mr-4 object-cover"
                />
              ) : (
                <div className="w-20 h-20 bg-gray-400 text-white rounded-full flex items-center justify-center mr-4 text-2xl font-bold">
                  {user.username[0].toUpperCase()}
                </div>
              )}
              <div className="text-white">
                <h2 className="text-2xl font-semibold">{user.username}</h2>
                <p>{user.email}</p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b">
            <nav className="flex space-x-6 px-6">
              <button
                className={`py-4 text-lg font-medium ${
                  activeTab === 'profile'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
                onClick={() => setActiveTab('profile')}
              >
                Personal Information
              </button>
              <button
                className={`py-4 text-lg font-medium ${
                  activeTab === 'orders'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
                onClick={() => setActiveTab('orders')}
              >
                Order History
              </button>
              <button
                className={`py-4 text-lg font-medium ${
                  activeTab === 'settings'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
                onClick={() => setActiveTab('settings')}
              >
                Account Settings
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">{renderTabContent()}</div>
        </div>
      ) : (
        <p className="text-center mt-10">Loading information...</p>
      )}
    </div>
  )
}

export default UserProfile
