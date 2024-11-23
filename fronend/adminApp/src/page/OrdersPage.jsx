// OrdersPage.js

import React, { useEffect, useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { AuthContext } from '../context/AuthContext'
import axios from 'axios'

export default function OrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()

  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api'

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/orders/admin/allOrders`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        })

        if (response.status === 200) {
          setOrders(response.data.data)
        } else {
          setError(response.data.message || 'Error fetching orders.')
          toast.error(response.data.message || 'Error fetching orders.')
        }
      } catch (err) {
        console.error('Error fetching orders:', err)
        setError('Error fetching orders.')
        toast.error('Error fetching orders.')
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [API_BASE_URL, user.token])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg">Loading...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg text-red-500">{error}</p>
      </div>
    )
  }

  // Filter and search functionality
  const filteredOrders = orders.filter(order => {
    const orderCode = String(order.orderCode ?? '')
    const username = String(order.userId?.username ?? '')

    const matchesSearch =
      orderCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      username.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus =
      filterStatus === 'all' || (order.orderStatus && order.orderStatus.toLowerCase() === filterStatus.toLowerCase())

    return matchesSearch && matchesStatus
  })

  return (
    <div className="container mx-auto p-4 pb-20">
      <h1 className="text-2xl font-bold mb-4 text-white">Order List</h1>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row justify-between mb-4">
        <input
          type="text"
          className="border border-gray-300 p-2 rounded-md mb-2 md:mb-0"
          placeholder="Search by Order Code or Username..."
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
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="received">Received</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {filteredOrders.length === 0 ? (
        <p>No orders available.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Order Code</th>
                <th className="py-2 px-4 border-b">Username</th>
                <th className="py-2 px-4 border-b">Payment Method</th>
                <th className="py-2 px-4 border-b">Payment Status</th>
                <th className="py-2 px-4 border-b">Order Status</th>
                <th className="py-2 px-4 border-b">Total Price</th>
                <th className="py-2 px-4 border-b">Created At</th>
                <th className="py-2 px-4 border-b">Details</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map(order => (
                <tr key={order._id} className={`text-center ${order.installmentId ? 'bg-yellow-100' : ''}`}>
                  <td className="py-2 px-4 border-b">{order.orderCode}</td>
                  <td className="py-2 px-4 border-b">{order.userId?.username ?? 'N/A'}</td>
                  <td className="py-2 px-4 border-b">{order.paymentMethod}</td>
                  <td className="py-2 px-4 border-b">{order.paymentStatus}</td>
                  <td className="py-2 px-4 border-b">{order.orderStatus}</td>
                  <td className="py-2 px-4 border-b">{order.totalPrice.toLocaleString()} VND</td>
                  <td className="py-2 px-4 border-b">{new Date(order.createdAt).toLocaleString()}</td>
                  <td className="py-2 px-4 border-b">
                    <button
                      onClick={() => navigate(`/orders/${order._id}`)}
                      className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
