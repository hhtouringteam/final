// src/components/Checkout.js
import React, { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { AuthContext } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'

export default function Checkout() {
  const navigate = useNavigate()
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api'

  const { user } = useContext(AuthContext)
  const { cart, clearCart, totalPriceInCart } = useCart()

  // State cho thông tin thanh toán
  const [username, setUsername] = useState('')
  const [country, setCountry] = useState('')
  const [streetAddress, setStreetAddress] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')

  // State cho phương thức thanh toán và kỳ trả góp
  const [paymentMethod, setPaymentMethod] = useState('')
  const [installmentPlan, setInstallmentPlan] = useState('')

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Kiểm tra nếu giỏ hàng trống, điều hướng về trang giỏ hàng
    if (!cart || cart.length === 0) {
      navigate('/cart')
    }
  }, [cart, navigate])

  const handlePlaceOrder = async () => {
    if (!username || !country || !streetAddress || !phone || !email) {
      toast.error('Vui lòng nhập đầy đủ thông tin thanh toán.')
      return
    }

    if (!paymentMethod) {
      toast.error('Vui lòng chọn phương thức thanh toán.')
      return
    }

    if ((paymentMethod === 'payos' || paymentMethod === 'zalopay') && !installmentPlan) {
      toast.error('Vui lòng chọn số kỳ trả góp.')
      return
    }

    try {
      setLoading(true)

      // Tạo payload để tạo đơn hàng
      const orderPayload = {
        userId: user.userId, // Lấy từ AuthContext
        cartItems: cart.map(item => ({
          productId: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        totalPrice: totalPriceInCart,
        billingInfo: {
          username,
          country,
          streetAddress,
          phone,
          email,
        },
        paymentMethod: paymentMethod === 'zalopay' ? 'ZaloPay' : paymentMethod === 'payos' ? 'PayOS' : 'COD',
        installmentPlan: paymentMethod === 'payos' || paymentMethod === 'zalopay' ? installmentPlan : null,
      }
      console.log('Payload gửi đến backend:', orderPayload)
      // Gọi API để tạo đơn hàng
      const response = await fetch(`${API_BASE_URL}/orders/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Thêm token vào header nếu cần thiết
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(orderPayload),
      })

      const createdOrderData = await response.json()

      if (!response.ok) {
        toast.error(createdOrderData.message || 'Lỗi khi tạo đơn hàng. Vui lòng thử lại.')
        setLoading(false)
        return
      }

      // Tiến hành thanh toán tùy theo phương thức
      if (paymentMethod === 'zalopay') {
        // Gọi API tạo thanh toán với ZaloPay
        const paymentResponse = await fetch(`${API_BASE_URL}/payments/createZaloPay`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({ orderId: createdOrderData.order._id, userId: user.userId }),
        })

        const paymentData = await paymentResponse.json()

        if (paymentData.payUrl) {
          toast.success('Đang chuyển hướng đến ZaloPay để thanh toán...')
          clearCart()
          window.location.href = paymentData.payUrl
        } else {
          console.error('ZaloPay payment failed:', paymentData.message || 'Unknown error')
          toast.error('Thanh toán qua ZaloPay thất bại. Vui lòng thử lại sau.')
          setLoading(false)
        }
      } else if (paymentMethod === 'payos') {
        // Gọi API tạo thanh toán với PayOS
        const paymentResponse = await fetch(`${API_BASE_URL}/payments/createPayOS`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({ orderId: createdOrderData.order._id, userId: user.userId }),
        })

        const paymentData = await paymentResponse.json()

        if (paymentData.payUrl) {
          toast.success('Đang chuyển hướng đến PayOS để thanh toán...')
          clearCart()
          window.location.href = paymentData.payUrl
        } else {
          console.error('PayOS payment failed:', paymentData.message || 'Unknown error')
          toast.error('Thanh toán qua PayOS thất bại. Vui lòng thử lại sau.')
          setLoading(false)
        }
      } else if (paymentMethod === 'cod') {
        // Nếu là COD, đơn hàng đã được tạo, bạn có thể điều hướng người dùng đến trang xác nhận
        toast.success('Đơn hàng của bạn đã được đặt thành công. Chúng tôi sẽ giao hàng sớm nhất.')
        clearCart() // Xóa giỏ hàng
        navigate('/payment-result?paymentMethod=COD')
      }
    } catch (error) {
      console.error('Error placing order', error)
      toast.error('Đã xảy ra lỗi trong quá trình xử lý đơn hàng. Vui lòng thử lại.')
      setLoading(false)
    }
  }

  return (
    <div className="py-5 mt-4 p-10 bg-white shadow-md">
      <div className="mb-3">
        <h2 className="text-2xl font-semibold">Thông tin thanh toán</h2>
        <form id="billing-form">
          <div className="mb-3">
            <input
              type="text"
              className="form-input w-full px-4 py-2 border border-gray-300 rounded-md"
              placeholder="Tên người nhận *"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="text"
              className="form-input w-full px-4 py-2 border border-gray-300 rounded-md"
              placeholder="Quốc gia"
              value={country}
              onChange={e => setCountry(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="text"
              className="form-input w-full px-4 py-2 border border-gray-300 rounded-md"
              placeholder="Địa chỉ *"
              value={streetAddress}
              onChange={e => setStreetAddress(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="tel"
              className="form-input w-full px-4 py-2 border border-gray-300 rounded-md"
              placeholder="Số điện thoại *"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="email"
              className="form-input w-full px-4 py-2 border border-gray-300 rounded-md"
              placeholder="Email *"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
        </form>
      </div>

      <div className="py-5 mt-4 p-10 bg-white shadow-md">
        <h2 className="text-2xl font-semibold">Đơn hàng của bạn</h2>
        {cart && cart.length > 0 ? (
          cart.map(item => (
            <div key={item._id} className="mb-2">
              <p>
                <strong>Sản phẩm:</strong> {item.name}
              </p>
              <p>
                <strong>Số lượng:</strong> {item.quantity}
              </p>
              <p>
                <strong>Giá:</strong> {item.price} VND
              </p>
              <hr />
            </div>
          ))
        ) : (
          <p>Không có sản phẩm trong đơn hàng.</p>
        )}

        <p className="mt-4">
          <strong>Tổng cộng:</strong> {totalPriceInCart} VND
        </p>

        <div className="mb-3 mt-6">
          <h2 className="text-2xl font-semibold">Phương thức thanh toán</h2>
          <form id="payment-form">
            <div className="form-check mb-2">
              <input
                className="form-radio text-blue-600"
                type="radio"
                name="payment"
                id="zalopay"
                value="zalopay"
                checked={paymentMethod === 'zalopay'}
                onChange={e => setPaymentMethod(e.target.value)}
              />
              <label className="ml-2" htmlFor="zalopay">
                Thanh toán qua ZaloPay
              </label>
            </div>
            <div className="form-check mb-2">
              <input
                className="form-radio text-blue-600"
                type="radio"
                name="payment"
                id="payos"
                value="payos"
                checked={paymentMethod === 'payos'}
                onChange={e => setPaymentMethod(e.target.value)}
              />
              <label className="ml-2" htmlFor="payos">
                Thanh toán qua PayOS (Trả góp)
              </label>
            </div>
            <div className="form-check mb-2">
              <input
                className="form-radio text-blue-600"
                type="radio"
                name="payment"
                id="cod"
                value="cod"
                checked={paymentMethod === 'cod'}
                onChange={e => setPaymentMethod(e.target.value)}
              />
              <label className="ml-2" htmlFor="cod">
                Thanh toán khi nhận hàng
              </label>
            </div>
          </form>
        </div>

        {/* Hiển thị lựa chọn số kỳ trả góp nếu chọn PayOS hoặc ZaloPay */}
        {(paymentMethod === 'payos' || paymentMethod === 'zalopay') && (
          <div className="mb-3">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="installmentPlan">
              Chọn số kỳ trả góp:
            </label>
            <select
              id="installmentPlan"
              className="form-select w-full px-4 py-2 border border-gray-300 rounded-md"
              value={installmentPlan}
              onChange={e => setInstallmentPlan(e.target.value)}
              required
            >
              <option value="">-- Chọn số kỳ --</option>
              <option value="3">3 kỳ</option>
              <option value="6">6 kỳ</option>
              <option value="12">12 kỳ</option>
            </select>
          </div>
        )}

        {/* Hiển thị số tiền phải trả mỗi kỳ nếu đã chọn số kỳ */}
        {(paymentMethod === 'payos' || paymentMethod === 'zalopay') && installmentPlan && (
          <p>
            Số tiền phải trả mỗi kỳ:{' '}
            {(
              (totalPriceInCart * (1 + (installmentPlan === '3' ? 0.02 : installmentPlan === '6' ? 0.04 : 0.08))) /
              parseInt(installmentPlan, 10)
            ).toFixed(2)}{' '}
            VND
          </p>
        )}

        <button
          type="button"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          onClick={handlePlaceOrder}
          disabled={loading || !paymentMethod}
        >
          {loading ? 'Đang đặt hàng...' : 'Đặt hàng'}
        </button>
      </div>
    </div>
  )
}
