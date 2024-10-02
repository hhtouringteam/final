// src/components/PaymentResult.js
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

export default function PaymentResult() {
  const location = useLocation()
  const navigate = useNavigate()
  const [result, setResult] = useState(null)
  const [orderStatus, setOrderStatus] = useState(null)
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api'

  useEffect(() => {
    // Lấy query params từ URL nếu có
    const query = new URLSearchParams(location.search)
    const status = query.get('status') // Nếu MoMo truyền trạng thái trong query params

    if (status === 'success') {
      setResult('success')
      toast.success('Thanh toán thành công!')
    } else if (status === 'fail') {
      setResult('fail')
      toast.error('Thanh toán thất bại. Vui lòng thử lại.')
    } else {
      // Nếu không có query params, bạn có thể lấy thông tin từ localStorage hoặc gọi API để kiểm tra trạng thái đơn hàng
      const savedOrderData = localStorage.getItem('orderData')
      if (savedOrderData) {
        const parsedOrder = JSON.parse(savedOrderData)
        // Gọi API để kiểm tra trạng thái đơn hàng
        const fetchOrderStatus = async () => {
          try {
            const response = await fetch(`${API_BASE_URL}/orders/${parsedOrder.userId}`)
            const orders = await response.json()
            // Tìm đơn hàng vừa tạo
            const currentOrder = orders.find(order => order._id === parsedOrder._id)
            if (currentOrder) {
              setOrderStatus(currentOrder.status)
              if (currentOrder.status === 'paid') {
                setResult('success')
                toast.success('Thanh toán thành công!')
              } else {
                setResult('fail')
                toast.error('Thanh toán chưa hoàn tất hoặc thất bại.')
              }
            } else {
              setResult('fail')
              toast.error('Không tìm thấy đơn hàng. Vui lòng thử lại.')
            }
          } catch (error) {
            console.error('Error fetching order status:', error)
            setResult('fail')
            toast.error('Đã xảy ra lỗi khi kiểm tra trạng thái đơn hàng.')
          }
        }
        fetchOrderStatus()
      } else {
        setResult('fail')
        toast.error('Không tìm thấy thông tin đơn hàng.')
      }
    }
  }, [location.search, API_BASE_URL])

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      {result === 'success' && (
        <div className="bg-white p-8 rounded shadow-md text-center">
          <h1 className="text-3xl font-bold text-green-600 mb-4">Thanh Toán Thành Công!</h1>
          <p className="text-lg">Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi.</p>
          <button
            onClick={() => navigate('/profile')}
            className="mt-6 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Về Trang Cá Nhân
          </button>
        </div>
      )}

      {result === 'fail' && (
        <div className="bg-white p-8 rounded shadow-md text-center">
          <h1 className="text-3xl font-bold text-red-600 mb-4">Thanh Toán Thất Bại!</h1>
          <p className="text-lg">Đã xảy ra lỗi trong quá trình thanh toán. Vui lòng thử lại.</p>
          <button
            onClick={() => navigate('/checkout')}
            className="mt-6 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Thử Lại Thanh Toán
          </button>
        </div>
      )}

      {result === null && (
        <div className="bg-white p-8 rounded shadow-md text-center">
          <h1 className="text-3xl font-bold text-gray-600 mb-4">Đang Xử Lý Thanh Toán...</h1>
          <p className="text-lg">Vui lòng đợi trong giây lát.</p>
        </div>
      )}
    </div>
  )
}
