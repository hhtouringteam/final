import React, { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { AuthContext } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import { formatVND } from '../../utils/formatMoney'
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

  const calculateMonthlyPayment = plan => {
    const interestRate = plan === '3' ? 0.02 : plan === '6' ? 0.04 : 0.08
    const totalAmount = totalPriceInCart * (1 + interestRate)
    const monthlyPayment = totalAmount / parseInt(plan, 10)
    return Math.round(monthlyPayment)
  }

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
      const orderPayload = {
        userId: user.userId,
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
      console.log('Payload sent to the backend:', orderPayload)
      const response = await fetch(`${API_BASE_URL}/orders/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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
          toast.success('Redirecting to ZaloPay for payment...')
          clearCart()
          window.location.href = paymentData.payUrl
        } else {
          console.error('ZaloPay payment failed:', paymentData.message || 'Unknown error')
          toast.error('ZaloPay payment failed. Please try again later.')
          setLoading(false)
        }
      } else if (paymentMethod === 'payos') {
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
          toast.success(' Redirecting to PayOS for payment....')
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
                <strong>Giá:</strong> {formatVND(item.price)}
              </p>
              <hr />
            </div>
          ))
        ) : (
          <p>Không có sản phẩm trong đơn hàng.</p>
        )}

        <p className="mt-4">
          <strong>Tổng cộng:</strong> {formatVND(totalPriceInCart)}
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
          <p>Số tiền phải trả mỗi kỳ: {formatVND(calculateMonthlyPayment(installmentPlan))}</p>
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
// src/components/Checkout.js

// src/components/Checkout.js

// src/components/Checkout.js

// src/components/Checkout.js

// import React, { useState, useEffect, useContext } from 'react'
// import { useNavigate } from 'react-router-dom'
// import { toast } from 'react-toastify'
// import { AuthContext } from '../../context/AuthContext'
// import { useCart } from '../../context/CartContext'
// import { formatVND } from '../../utils/formatMoney'
// import { FaCreditCard, FaMoneyCheckAlt, FaMobileAlt } from 'react-icons/fa'

// export default function Checkout() {
//   const navigate = useNavigate()
//   const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api'

//   const { user } = useContext(AuthContext)
//   const { cart, clearCart, totalPriceInCart } = useCart()

//   // State for billing information
//   const [username, setUsername] = useState('')
//   const [country, setCountry] = useState('')
//   const [streetAddress, setStreetAddress] = useState('')
//   const [phone, setPhone] = useState('')
//   const [email, setEmail] = useState('')

//   // State for payment method and installment plan
//   const [paymentMethod, setPaymentMethod] = useState('')
//   const [installmentPlan, setInstallmentPlan] = useState('')

//   const [loading, setLoading] = useState(false)

//   useEffect(() => {
//     // Redirect to cart page if cart is empty
//     if (!cart || cart.length === 0) {
//       navigate('/cart')
//     }
//   }, [cart, navigate])

//   const calculateMonthlyPayment = plan => {
//     const interestRate = plan === '3' ? 0.02 : plan === '6' ? 0.04 : plan === '12' ? 0.08 : 0
//     const totalAmount = totalPriceInCart * (1 + interestRate)
//     const monthlyPayment = totalAmount / parseInt(plan, 10)
//     return Math.round(monthlyPayment)
//   }

//   const handlePlaceOrder = async () => {
//     // Validate billing information
//     if (!username || !country || !streetAddress || !phone || !email) {
//       toast.error('Please fill in all the billing information.')
//       return
//     }

//     if (!paymentMethod) {
//       toast.error('Please select a payment method.')
//       return
//     }

//     // Only require installment plan if payment method is installment
//     const isInstallment = paymentMethod === 'payos_installment' || paymentMethod === 'zalopay_installment'
//     if (isInstallment && !installmentPlan) {
//       toast.error('Please select an installment plan.')
//       return
//     }

//     try {
//       setLoading(true)
//       const orderPayload = {
//         userId: user.userId,
//         cartItems: cart.map(item => ({
//           productId: item._id,
//           name: item.name,
//           price: item.price,
//           quantity: item.quantity,
//         })),
//         totalPrice: totalPriceInCart,
//         billingInfo: {
//           username,
//           country,
//           streetAddress,
//           phone,
//           email,
//         },
//         paymentMethod:
//           paymentMethod === 'zalopay_installment'
//             ? 'ZaloPay'
//             : paymentMethod === 'payos_installment'
//             ? 'PayOS'
//             : paymentMethod === 'zalopay'
//             ? 'ZaloPay'
//             : paymentMethod === 'payos'
//             ? 'PayOS'
//             : 'COD',
//         installmentPlan: isInstallment ? parseInt(installmentPlan, 10) : null,
//       }
//       console.log('Payload sent to the backend:', orderPayload)
//       const response = await fetch(`${API_BASE_URL}/orders/create`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${user.token}`,
//         },
//         body: JSON.stringify(orderPayload),
//       })
//       const createdOrderData = await response.json()
//       if (!response.ok) {
//         toast.error(createdOrderData.message || 'Error creating order. Please try again.')
//         setLoading(false)
//         return
//       }

//       let installmentPayments = []

//       if (isInstallment) {
//         // Create installment payments
//         const installmentResponse = await fetch(`${API_BASE_URL}/installments/createZaloPay`, {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//             Authorization: `Bearer ${user.token}`,
//           },
//           body: JSON.stringify({ orderId: createdOrderData.order._id, plan: installmentPlan}),
//         })
//         const installmentData = await installmentResponse.json()
//         if (!installmentResponse.ok) {
//           toast.error(installmentData.message || 'Error creating installment payments. Please try again.')
//           setLoading(false)
//           return
//         }
//         installmentPayments = installmentData.installments
//       }

//       // Proceed with payment based on selected method
//       if (paymentMethod === 'zalopay') {
//         // Standard payment via ZaloPay
//         const paymentResponse = await fetch(`${API_BASE_URL}/payments/createZaloPay`, {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//             Authorization: `Bearer ${user.token}`,
//           },
//           body: JSON.stringify({ orderId: createdOrderData.order._id, userId: user.userId }),
//         })
//         const paymentData = await paymentResponse.json()
//         if (paymentData.payUrl) {
//           toast.success('Redirecting to ZaloPay for payment...')
//           clearCart()
//           window.location.href = paymentData.payUrl
//         } else {
//           console.error('ZaloPay payment failed:', paymentData.message || 'Unknown error')
//           toast.error('ZaloPay payment failed. Please try again later.')
//           setLoading(false)
//         }
//       } else if (paymentMethod === 'payos') {
//         // Standard payment via PayOS
//         const paymentResponse = await fetch(`${API_BASE_URL}/payments/createPayOS`, {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//             Authorization: `Bearer ${user.token}`,
//           },
//           body: JSON.stringify({ orderId: createdOrderData.order._id, userId: user.userId }),
//         })
//         const paymentData = await paymentResponse.json()
//         if (paymentData.payUrl) {
//           toast.success('Redirecting to PayOS for payment...')
//           clearCart()
//           window.location.href = paymentData.payUrl
//         } else {
//           console.error('PayOS payment failed:', paymentData.message || 'Unknown error')
//           toast.error('PayOS payment failed. Please try again later.')
//           setLoading(false)
//         }
//       } else if (paymentMethod === 'payos_installment' || paymentMethod === 'zalopay_installment') {
//         // Installment payment: initiate payment for the first installment
//         const firstPayment = installmentPayments[0]
//         const paymentEndpoint = paymentMethod === 'payos_installment' ? 'createPayOS' : 'createZaloPay'
//         const paymentPayload =
//           paymentMethod === 'payos_installment'
//             ? { orderId: createdOrderData.order._id, userId: user.userId, paymentId: firstPayment._id }
//             : { orderId: createdOrderData.order._id, userId: user.userId, paymentId: firstPayment._id }

//         const paymentResponse = await fetch(`${API_BASE_URL}/payments/${paymentEndpoint}`, {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//             Authorization: `Bearer ${user.token}`,
//           },
//           body: JSON.stringify(paymentPayload),
//         })
//         const paymentData = await paymentResponse.json()
//         if (paymentData.payUrl) {
//           const successMessage =
//             paymentMethod === 'payos_installment'
//               ? 'Redirecting to PayOS for payment...'
//               : 'Redirecting to ZaloPay for payment...'
//           toast.success(successMessage)
//           clearCart()
//           window.location.href = paymentData.payUrl
//         } else {
//           const errorMessage =
//             paymentMethod === 'payos_installment'
//               ? 'PayOS payment failed. Please try again later.'
//               : 'ZaloPay payment failed. Please try again later.'
//           console.error(`${paymentMethod} payment failed:`, paymentData.message || 'Unknown error')
//           toast.error(errorMessage)
//           setLoading(false)
//         }
//       } else if (paymentMethod === 'cod') {
//         // COD: Order is placed successfully
//         toast.success('Your order has been placed successfully. We will deliver it as soon as possible.')
//         clearCart() // Clear cart
//         navigate('/payment-result?paymentMethod=COD')
//       }
//     } catch (error) {
//       console.error('Error placing order', error)
//       toast.error('An error occurred while processing your order. Please try again.')
//       setLoading(false)
//     }
//   }

//   return (
//     <div className="container mx-auto p-6">
//       <h1 className="text-3xl font-bold mb-6 text-center">Checkout</h1>
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//         {/* Billing Information */}
//         <div className="bg-white shadow-md rounded-lg p-6">
//           <h2 className="text-2xl font-semibold mb-4">Billing Information</h2>
//           <form id="billing-form">
//             <div className="mb-4">
//               <label htmlFor="username" className="block text-gray-700 mb-2">
//                 Recipient Name *
//               </label>
//               <input
//                 type="text"
//                 id="username"
//                 className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 placeholder="Enter recipient's name"
//                 value={username}
//                 onChange={e => setUsername(e.target.value)}
//                 required
//               />
//             </div>
//             <div className="mb-4">
//               <label htmlFor="country" className="block text-gray-700 mb-2">
//                 Country
//               </label>
//               <input
//                 type="text"
//                 id="country"
//                 className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 placeholder="Enter country"
//                 value={country}
//                 onChange={e => setCountry(e.target.value)}
//                 required
//               />
//             </div>
//             <div className="mb-4">
//               <label htmlFor="streetAddress" className="block text-gray-700 mb-2">
//                 Street Address *
//               </label>
//               <input
//                 type="text"
//                 id="streetAddress"
//                 className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 placeholder="Enter street address"
//                 value={streetAddress}
//                 onChange={e => setStreetAddress(e.target.value)}
//                 required
//               />
//             </div>
//             <div className="mb-4">
//               <label htmlFor="phone" className="block text-gray-700 mb-2">
//                 Phone Number *
//               </label>
//               <input
//                 type="tel"
//                 id="phone"
//                 className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 placeholder="Enter phone number"
//                 value={phone}
//                 onChange={e => setPhone(e.target.value)}
//                 required
//               />
//             </div>
//             <div className="mb-4">
//               <label htmlFor="email" className="block text-gray-700 mb-2">
//                 Email *
//               </label>
//               <input
//                 type="email"
//                 id="email"
//                 className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 placeholder="Enter email"
//                 value={email}
//                 onChange={e => setEmail(e.target.value)}
//                 required
//               />
//             </div>
//           </form>
//         </div>

//         {/* Your Order */}
//         <div className="bg-white shadow-md rounded-lg p-6">
//           <h2 className="text-2xl font-semibold mb-4">Your Order</h2>
//           {cart && cart.length > 0 ? (
//             <div className="space-y-4">
//               {cart.map(item => (
//                 <div key={item._id} className="flex justify-between items-center">
//                   <div>
//                     <p className="font-medium">{item.name}</p>
//                     <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
//                   </div>
//                   <div>
//                     <p className="font-medium">{formatVND(item.price * item.quantity)}</p>
//                   </div>
//                 </div>
//               ))}
//               <div className="flex justify-between items-center border-t pt-4">
//                 <p className="text-xl font-semibold">Total:</p>
//                 <p className="text-xl font-semibold">{formatVND(totalPriceInCart)}</p>
//               </div>
//             </div>
//           ) : (
//             <p>No products in your order.</p>
//           )}
//         </div>
//       </div>

//       {/* Payment Method */}
//       <div className="mt-8 bg-white shadow-md rounded-lg p-6">
//         <h2 className="text-2xl font-semibold mb-4">Payment Method</h2>
//         <form id="payment-form">
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//             {/* ZaloPay */}
//             <div
//               className={`border rounded-lg p-4 cursor-pointer flex items-center ${
//                 paymentMethod === 'zalopay' ? 'border-blue-500' : 'border-gray-300'
//               } hover:border-blue-500`}
//               onClick={() => setPaymentMethod('zalopay')}
//             >
//               <FaCreditCard className="text-2xl text-blue-500 mr-4" />
//               <div>
//                 <p className="font-medium">ZaloPay</p>
//                 <p className="text-sm text-gray-600">Pay directly via ZaloPay</p>
//               </div>
//               <input
//                 type="radio"
//                 name="payment"
//                 value="zalopay"
//                 checked={paymentMethod === 'zalopay'}
//                 onChange={e => setPaymentMethod(e.target.value)}
//                 className="ml-auto"
//               />
//             </div>

//             {/* ZaloPay (Installment) */}
//             <div
//               className={`border rounded-lg p-4 cursor-pointer flex items-center ${
//                 paymentMethod === 'zalopay_installment' ? 'border-blue-500' : 'border-gray-300'
//               } hover:border-blue-500`}
//               onClick={() => setPaymentMethod('zalopay_installment')}
//             >
//               <FaCreditCard className="text-2xl text-blue-500 mr-4" />
//               <div>
//                 <p className="font-medium">ZaloPay (Installment)</p>
//                 <p className="text-sm text-gray-600">Pay in installments via ZaloPay</p>
//               </div>
//               <input
//                 type="radio"
//                 name="payment"
//                 value="zalopay_installment"
//                 checked={paymentMethod === 'zalopay_installment'}
//                 onChange={e => setPaymentMethod(e.target.value)}
//                 className="ml-auto"
//               />
//             </div>

//             {/* PayOS */}
//             <div
//               className={`border rounded-lg p-4 cursor-pointer flex items-center ${
//                 paymentMethod === 'payos' ? 'border-blue-500' : 'border-gray-300'
//               } hover:border-blue-500`}
//               onClick={() => setPaymentMethod('payos')}
//             >
//               <FaMobileAlt className="text-2xl text-blue-500 mr-4" />
//               <div>
//                 <p className="font-medium">PayOS</p>
//                 <p className="text-sm text-gray-600">Pay directly via PayOS</p>
//               </div>
//               <input
//                 type="radio"
//                 name="payment"
//                 value="payos"
//                 checked={paymentMethod === 'payos'}
//                 onChange={e => setPaymentMethod(e.target.value)}
//                 className="ml-auto"
//               />
//             </div>

//             {/* PayOS (Installment) */}
//             <div
//               className={`border rounded-lg p-4 cursor-pointer flex items-center ${
//                 paymentMethod === 'payos_installment' ? 'border-blue-500' : 'border-gray-300'
//               } hover:border-blue-500`}
//               onClick={() => setPaymentMethod('payos_installment')}
//             >
//               <FaMobileAlt className="text-2xl text-blue-500 mr-4" />
//               <div>
//                 <p className="font-medium">PayOS (Installment)</p>
//                 <p className="text-sm text-gray-600">Pay in installments via PayOS</p>
//               </div>
//               <input
//                 type="radio"
//                 name="payment"
//                 value="payos_installment"
//                 checked={paymentMethod === 'payos_installment'}
//                 onChange={e => setPaymentMethod(e.target.value)}
//                 className="ml-auto"
//               />
//             </div>

//             {/* Cash on Delivery */}
//             <div
//               className={`border rounded-lg p-4 cursor-pointer flex items-center ${
//                 paymentMethod === 'cod' ? 'border-blue-500' : 'border-gray-300'
//               } hover:border-blue-500`}
//               onClick={() => setPaymentMethod('cod')}
//             >
//               <FaMoneyCheckAlt className="text-2xl text-blue-500 mr-4" />
//               <div>
//                 <p className="font-medium">Cash on Delivery (COD)</p>
//                 <p className="text-sm text-gray-600">Pay directly when receiving the product</p>
//               </div>
//               <input
//                 type="radio"
//                 name="payment"
//                 value="cod"
//                 checked={paymentMethod === 'cod'}
//                 onChange={e => setPaymentMethod(e.target.value)}
//                 className="ml-auto"
//               />
//             </div>
//           </div>
//         </form>

//         {/* Display installment plan selection if payment method is installment */}
//         {(paymentMethod === 'payos_installment' || paymentMethod === 'zalopay_installment') && (
//           <div className="mt-6">
//             <label className="block text-gray-700 font-bold mb-2" htmlFor="installmentPlan">
//               Select Installment Plan:
//             </label>
//             <select
//               id="installmentPlan"
//               className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               value={installmentPlan}
//               onChange={e => setInstallmentPlan(e.target.value)}
//               required
//             >
//               <option value="">-- Select Plan --</option>
//               <option value="3">3 Installments</option>
//               <option value="6">6 Installments</option>
//               <option value="12">12 Installments</option>
//             </select>
//             {/* Display monthly payment amount if installment plan is selected */}
//             {installmentPlan && (
//               <p className="mt-2 text-gray-600">
//                 Monthly Payment:{' '}
//                 <span className="font-medium">{formatVND(calculateMonthlyPayment(installmentPlan))}</span>
//               </p>
//             )}
//           </div>
//         )}

//         {/* Place Order Button */}
//         <div className="mt-6 text-center">
//           <button
//             type="button"
//             className={`w-full bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-300 ${
//               loading || !paymentMethod ? 'opacity-50 cursor-not-allowed' : ''
//             }`}
//             onClick={handlePlaceOrder}
//             disabled={loading || !paymentMethod}
//           >
//             {loading ? 'Placing Order...' : 'Place Order'}
//           </button>
//         </div>
//       </div>
//     </div>
//   )
// }
