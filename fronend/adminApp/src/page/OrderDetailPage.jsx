// OrderDetailPage.js
import React, { useEffect, useState, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { toast } from 'react-toastify'

export default function OrderDetailPage() {
  const { orderId } = useParams()
  const [order, setOrder] = useState(null)
  const { user } = useContext(AuthContext)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api'

  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/orders/admin/${orderId}`, {
          headers: {
            Authorization: `Bearer ${user.token}`, // Sử dụng token từ AuthContext
          },
        })

        const data = await response.json()

        if (response.ok) {
          setOrder(data.data)
        } else {
          toast.error(data.message || 'Error fetching order details.')
        }
      } catch (err) {
        console.error('Error fetching order details:', err)
        toast.error('Error fetching order details.')
      } finally {
        setLoading(false)
      }
    }

    fetchOrderDetail()
  }, [API_BASE_URL, orderId, user.token])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg">Đang tải chi tiết đơn hàng...</p>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg text-red-500">Không tìm thấy đơn hàng.</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 pb-20">
      {/* Nút Quay Lại */}
      <button onClick={() => navigate(-1)} className="mb-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
        Quay Lại
      </button>

      {/* Tiêu đề */}
      <h1 className="text-3xl font-bold mb-6 text-white">Chi Tiết Đơn Hàng #{order.orderCode}</h1>

      {/* Thông tin khách hàng và đơn hàng */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Thông tin khách hàng */}
        <div className="bg-white shadow-md rounded p-6">
          <h2 className="text-2xl font-semibold mb-4">Thông Tin Khách Hàng</h2>
          <p className="mb-2">
            <strong>Họ và Tên:</strong> {order.billingInfo.username}
          </p>
          <p className="mb-2">
            <strong>Email:</strong> {order.billingInfo.email}
          </p>
          <p className="mb-2">
            <strong>Số Điện Thoại:</strong> {order.billingInfo.phone}
          </p>
          <p className="mb-2">
            <strong>Địa Chỉ:</strong> {order.billingInfo.streetAddress}, {order.billingInfo.country}
          </p>
        </div>

        {/* Thông tin đơn hàng */}
        <div className="bg-white shadow-md rounded p-6">
          <h2 className="text-2xl font-semibold mb-4">Thông Tin Đơn Hàng</h2>
          <p className="mb-2">
            <strong>Phương Thức Thanh Toán:</strong> {order.paymentMethod}
          </p>
          <p className="mb-2">
            <strong>Trạng Thái Thanh Toán:</strong>{' '}
            <span
              className={
                order.paymentStatus === 'paid'
                  ? 'text-green-600'
                  : order.paymentStatus === 'pending'
                  ? 'text-yellow-600'
                  : 'text-red-600'
              }
            >
              {order.paymentStatus}
            </span>
          </p>
          <p className="mb-2">
            <strong>Trạng Thái Đơn Hàng:</strong>{' '}
            <span
              className={
                order.orderStatus === 'Confirmed'
                  ? 'text-green-600'
                  : order.orderStatus === 'Processing'
                  ? 'text-yellow-600'
                  : 'text-red-600'
              }
            >
              {order.orderStatus}
            </span>
          </p>
          <p className="mb-2">
            <strong>Tổng Giá:</strong> {order.totalPrice.toLocaleString()} VND
          </p>
          <p className="mb-2">
            <strong>Ngày Tạo:</strong> {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Danh sách sản phẩm */}
      <div className="bg-white shadow-md rounded p-6">
        <h2 className="text-2xl font-semibold mb-4">Sản Phẩm</h2>
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b text-left">Sản Phẩm</th>
              <th className="py-2 px-4 border-b text-right">Giá</th>
              <th className="py-2 px-4 border-b text-center">Số Lượng</th>
              <th className="py-2 px-4 border-b text-right">Tổng</th>
            </tr>
          </thead>
          <tbody>
            {order.cartItems.map(item => (
              <tr key={item._id}>
                <td className="py-2 px-4 border-b">{item.name}</td>
                <td className="py-2 px-4 border-b text-right">{item.price.toLocaleString()} VND</td>
                <td className="py-2 px-4 border-b text-center">{item.quantity}</td>
                <td className="py-2 px-4 border-b text-right">{(item.price * item.quantity).toLocaleString()} VND</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Tổng cộng */}
        <div className="flex justify-end mt-4">
          <div className="text-xl font-semibold">Tổng Cộng: {order.totalPrice.toLocaleString()} VND</div>
        </div>
      </div>
    </div>
  )
}
