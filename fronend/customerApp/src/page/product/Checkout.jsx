import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

export default function Checkout() {
  const [orderData, setOrderData] = useState(null)
  const navigate = useNavigate()
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api'

  const [username, setUsername] = useState('')
  const [country, setCountry] = useState('')
  const [streetAddress, setStreetAddress] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')

  const [paymentMethod, setPaymentMethod] = useState('momo')

  useEffect(() => {
    const savedOrderData = localStorage.getItem('orderData')
    if (savedOrderData) {
      setOrderData(JSON.parse(savedOrderData))
    } else {
      navigate('/cart')
    }
  }, [navigate])

  const handlePlaceOrder = async () => {
    if (!username || !country || !streetAddress || !phone || !email) {
      toast.error('Vui lòng nhập đầy đủ thông tin thanh toán.')
      return
    }

    if (orderData) {
      try {
        const orderPayload = {
          orderId: orderData._id,
          totalPrice: orderData.totalPrice,
          billingInfo: {
            username,
            country,
            streetAddress,
            phone,
            email,
          },
          cartItems: orderData.cartItems,
          userId: orderData.userId,
          paymentMethod: paymentMethod === 'momo' ? 'MoMo' : 'COD',
        }

        console.log('Selected Payment Method:', paymentMethod)
        console.log('Order Payload:', orderPayload)

        if (paymentMethod === 'momo') {
          const response = await fetch(`${API_BASE_URL}/orders/momo`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderPayload),
          })

          const data = await response.json()

          if (data.payUrl) {
            toast.success('Đang chuyển hướng đến MoMo để thanh toán...')
            window.location.href = data.payUrl
          } else {
            console.error('MoMo payment failed:', data.message || 'Unknown error')
            toast.error('Thanh toán qua MoMo thất bại. Vui lòng thử lại sau.')
          }
        } else if (paymentMethod === 'cod') {
         
          const response = await fetch(`${API_BASE_URL}/orders/cod`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderPayload),
          })

          const data = await response.json()

          if (data.success) {
            toast.success('Đơn hàng của bạn đã được đặt thành công. Chúng tôi sẽ giao hàng sớm nhất.')
         
            navigate('/payment-result?paymentMethod=COD')
          } else {
            console.error('Cash on Delivery failed:', data.message || 'Unknown error')
            toast.error('Đặt hàng thất bại. Vui lòng thử lại sau.')
          }
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
    
      <div className="mb-3">
        <h2 className="text-2xl font-semibold">Billing details</h2>
        <form id="billing-form">
          <div className="mb-3">
            <input
              type="text"
              className="form-input w-full px-4 py-2 border border-gray-300 rounded-md"
              placeholder="Username *"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="text"
              className="form-input w-full px-4 py-2 border border-gray-300 rounded-md"
              placeholder="Country"
              value={country}
              onChange={e => setCountry(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="text"
              className="form-input w-full px-4 py-2 border border-gray-300 rounded-md"
              placeholder="Street address *"
              value={streetAddress}
              onChange={e => setStreetAddress(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="tel"
              className="form-input w-full px-4 py-2 border border-gray-300 rounded-md"
              placeholder="Phone *"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="email"
              className="form-input w-full px-4 py-2 border border-gray-300 rounded-md"
              placeholder="Email address *"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
        </form>
      </div>

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
              <strong>Price:</strong> {item.price} VND
            </p>
            <hr />
          </div>
        ))}

        <p className="mt-4">
          <strong>Total:</strong> {orderData.totalPrice} VND
        </p>

     
        <div className="mb-3 mt-6">
          <h2 className="text-2xl font-semibold">Payment method</h2>
          <form id="payment-form">
            <div className="form-check mb-2">
              <input
                className="form-radio text-blue-600"
                type="radio"
                name="payment"
                id="momo"
                value="momo"
                checked={paymentMethod === 'momo'}
                onChange={e => setPaymentMethod(e.target.value)}
              />
              <label className="ml-2" htmlFor="momo">
                Thanh toán qua MoMo
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

        <button
          type="button"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          onClick={handlePlaceOrder} 
        >
          Place Order
        </button>
      </div>
    </div>
  )
}
