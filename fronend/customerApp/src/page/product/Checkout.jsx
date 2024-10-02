// src/components/Checkout.js
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
export default function Checkout() {
  const [orderData, setOrderData] = useState(null)
  const navigate = useNavigate()
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api'

  // Lấy dữ liệu đơn hàng từ localStorage khi trang được tải
  useEffect(() => {
    const savedOrderData = localStorage.getItem('orderData')
    if (savedOrderData) {
      setOrderData(JSON.parse(savedOrderData))
    } else {
      // Nếu không có dữ liệu đơn hàng, điều hướng người dùng về trang giỏ hàng
      navigate('/cart')
    }
  }, [navigate])

  // Hàm xử lý khi nhấn nút "Place Order"
  const handlePlaceOrder = async () => {
    if (orderData) {
      try {
        // Gửi yêu cầu thanh toán qua MoMo
        const response = await fetch(`${API_BASE_URL}/orders/momo` || 'http://localhost:5000/api/orders/momo', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'any_value',
          },
          body: JSON.stringify({
            orderId: orderData._id,
            totalPrice: orderData.totalPrice,
          }),
        })

        const data = await response.json()

        if (data.payUrl) {
          toast.success('Đang chuyển hướng đến MoMo để thanh toán...')
          window.location.href = data.payUrl
        } else {
          console.error('MoMo payment failed:', data.message || 'Unknown error')
          toast.error('Thanh toán qua MoMo thất bại. Vui lòng thử lại sau.')
        }
      } catch (error) {
        console.error('Error placing order', error)
        toast.error('Đã xảy ra lỗi trong quá trình xử lý đơn hàng. Vui lòng thử lại.')
      }
    }
  }

  if (!orderData) {
    return <div>Loading...</div>
  }

  return (
    <div className="py-5 mt-4 p-10 bg-white shadow-md">
      {/* Billing Information */}
      <div className="mb-3">
        <h2 className="text-2xl font-semibold">Billing details</h2>
        <form id="billing-form">
          <div className="mb-3">
            <input
              type="text"
              className="form-input w-full px-4 py-2 border border-gray-300 rounded-md"
              placeholder="Username *"
              required
            />
          </div>
          {/* Thêm các trường địa chỉ */}
          <div className="mb-3">
            <input
              type="text"
              className="form-input w-full px-4 py-2 border border-gray-300 rounded-md"
              placeholder="Country"
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="text"
              className="form-input w-full px-4 py-2 border border-gray-300 rounded-md"
              placeholder="Street address *"
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="tel"
              className="form-input w-full px-4 py-2 border border-gray-300 rounded-md"
              placeholder="Phone *"
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="email"
              className="form-input w-full px-4 py-2 border border-gray-300 rounded-md"
              placeholder="Email address *"
              required
            />
          </div>
        </form>
      </div>

      {/* Order Summary */}
      <div className="py-5 mt-4 p-10 bg-white shadow-md">
        <h2 className="text-2xl font-semibold">Your order</h2>
        {orderData.cartItems.map(item => (
          <div key={item.productId} className="mb-2">
            <p>
              <strong>Product:</strong> {item.name}
            </p>
            <p>
              <strong>Quantity:</strong> {item.quantity}
            </p>
            <p>
              <strong>Price:</strong> ${item.price} VND
            </p>
            <hr />
          </div>
        ))}

        <p className="mt-4">
          <strong>Total:</strong> ${orderData.totalPrice} VND
        </p>

        {/* Payment Methods */}
        <div className="mb-3 mt-6">
          <h2 className="text-2xl font-semibold">Payment method</h2>
          <form id="payment-form">
            <div className="form-check mb-2">
              <input className="form-radio text-blue-600" type="radio" name="payment" id="momo" defaultChecked />
              <label className="ml-2" htmlFor="momo">
                Thanh toán qua MoMo
              </label>
            </div>
          </form>
        </div>

        <button
          type="button"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          onClick={handlePlaceOrder} // Gọi hàm thanh toán khi nhấn "Place Order"
        >
          Place Order
        </button>
      </div>
    </div>
  )
}
