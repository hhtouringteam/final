import React, { useEffect, useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { AuthContext } from '../context/AuthContext'
export default function OrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api'

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/orders/admin/allOrders', {
          headers: {
            Authorization: `Bearer ${user.token}`, // Sử dụng token từ AuthContext
          },
        })

        const data = await response.json()

        if (response.ok) {
          setOrders(data.data)
        } else {
          setError(data.message || 'Error fetching orders.')
          toast.error(data.message || 'Error fetching orders.')
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
  }, [API_BASE_URL])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg">Đang tải...</p>
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

  return (
    <div className="container mx-auto p-4 pb-20">
      <h1 className="text-2xl font-bold mb-4 text-white">Danh Sách Đơn Hàng</h1>
      {orders.length === 0 ? (
        <p>Không có đơn hàng nào.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Order Code</th>
                <th className="py-2 px-4 border-b">UserName</th>
                <th className="py-2 px-4 border-b">Phương Thức Thanh Toán</th>
                <th className="py-2 px-4 border-b">Trạng Thái Thanh Toán</th>
                <th className="py-2 px-4 border-b">Trạng Thái Đơn Hàng</th>
                <th className="py-2 px-4 border-b">Tổng Giá</th>
                <th className="py-2 px-4 border-b">Ngày Tạo</th>
                <th className="py-2 px-4 border-b">Chi Tiết</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order._id}>
                  <td className="py-2 px-4 border-b text-center">{order.orderCode}</td>
                  <td className="py-2 px-4 border-b text-center">{order.userId.username}</td>
                  <td className="py-2 px-4 border-b text-center">{order.paymentMethod}</td>
                  <td className="py-2 px-4 border-b text-center">{order.paymentStatus}</td>
                  <td className="py-2 px-4 border-b text-center">{order.orderStatus}</td>
                  <td className="py-2 px-4 border-b text-center">{order.totalPrice.toLocaleString()} VND</td>
                  <td className="py-2 px-4 border-b text-center">{new Date(order.createdAt).toLocaleString()}</td>
                  <td className="py-2 px-4 border-b text-center">
                    <button
                      onClick={() => navigate(`/orders/${order._id}`)}
                      className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                    >
                      Xem Chi Tiết
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
