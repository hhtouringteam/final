// OrderDetailPage.js
import React, { useEffect, useState, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { toast } from 'react-toastify'
import axios from 'axios'

export default function OrderDetailPage() {
  const { orderId } = useParams()
  const [order, setOrder] = useState(null)
  const { user } = useContext(AuthContext)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const [installmentDetails, setInstallmentDetails] = useState(null)

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api'

  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        // Fetch order details
        const response = await axios.get(`${API_BASE_URL}/orders/admin/${orderId}`, {
          headers: {
            Authorization: `Bearer ${user.token}`, // Use token from AuthContext
          },
        })

        if (response.status === 200) {
          setOrder(response.data.data)

          // If the order has an installmentId, fetch installment details
          if (response.data.data.installmentId) {
            const installmentIdRaw = response.data.data.installmentId
            // Ensure installmentId is a string
            const installmentId =
              typeof installmentIdRaw === 'object' && installmentIdRaw._id ? installmentIdRaw._id : installmentIdRaw

            await fetchInstallmentDetails(installmentId)
          }
        } else {
          toast.error(response.data.message || 'Error fetching order details.')
        }
      } catch (err) {
        console.error('Error fetching order details:', err)
        toast.error('Error fetching order details.')
      } finally {
        setLoading(false)
      }
    }

    const fetchInstallmentDetails = async installmentId => {
      try {
        const response = await axios.get(`${API_BASE_URL}/installments/${installmentId}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        })

        if (response.status === 200) {
          setInstallmentDetails(response.data)
        } else {
          toast.error(response.data.message || 'Error fetching installment details.')
        }
      } catch (err) {
        console.error('Error fetching installment details:', err)
        toast.error('Error fetching installment details.')
      }
    }

    fetchOrderDetail()
  }, [API_BASE_URL, orderId, user.token])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg">Loading order details...</p>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg text-red-500">Order not found.</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 pb-20">
      {/* Back Button */}
      <button onClick={() => navigate(-1)} className="mb-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
        Go Back
      </button>

      {/* Title */}
      <h1 className="text-3xl font-bold mb-6 text-white">Order Details #{order.orderCode}</h1>

      {/* Customer and Order Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Customer Information */}
        <div className="bg-white shadow-md rounded p-6">
          <h2 className="text-2xl font-semibold mb-4">Customer Information</h2>
          <p className="mb-2">
            <strong>Full Name:</strong> {order.billingInfo.username}
          </p>
          <p className="mb-2">
            <strong>Email:</strong> {order.billingInfo.email}
          </p>
          <p className="mb-2">
            <strong>Phone Number:</strong> {order.billingInfo.phone}
          </p>
          <p className="mb-2">
            <strong>Address:</strong> {order.billingInfo.streetAddress}, {order.billingInfo.country}
          </p>
        </div>

        {/* Order Information */}
        <div className="bg-white shadow-md rounded p-6">
          <h2 className="text-2xl font-semibold mb-4">Order Information</h2>
          <p className="mb-2">
            <strong>Payment Method:</strong> {order.paymentMethod}
          </p>
          <p className="mb-2">
            <strong>Payment Status:</strong>{' '}
            <span
              className={
                order.paymentStatus.toLowerCase() === 'paid'
                  ? 'text-green-600'
                  : order.paymentStatus.toLowerCase() === 'pending'
                  ? 'text-yellow-600'
                  : 'text-red-600'
              }
            >
              {order.paymentStatus}
            </span>
          </p>
          <p className="mb-2">
            <strong>Order Status:</strong>{' '}
            <span
              className={
                order.orderStatus.toLowerCase() === 'confirmed'
                  ? 'text-green-600'
                  : order.orderStatus.toLowerCase() === 'processing'
                  ? 'text-yellow-600'
                  : 'text-red-600'
              }
            >
              {order.orderStatus}
            </span>
          </p>
          <p className="mb-2">
            <strong>Total Price:</strong> {order.totalPrice.toLocaleString()} VND
          </p>
          <p className="mb-2">
            <strong>Created At:</strong> {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Product List */}
      <div className="bg-white shadow-md rounded p-6 mb-6">
        <h2 className="text-2xl font-semibold mb-4">Products</h2>
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b text-left">Product</th>
              <th className="py-2 px-4 border-b text-right">Price</th>
              <th className="py-2 px-4 border-b text-center">Quantity</th>
              <th className="py-2 px-4 border-b text-right">Total</th>
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

        {/* Total */}
        <div className="flex justify-end mt-4">
          <div className="text-xl font-semibold">Total: {order.totalPrice.toLocaleString()} VND</div>
        </div>
      </div>

      {/* Installment Details */}
      {order.installmentId && installmentDetails && (
        <div className="bg-white shadow-md rounded p-6">
          <h2 className="text-2xl font-semibold mb-4">Installment Details</h2>
          <p className="mb-2">
            <strong>Number of Installments:</strong> {installmentDetails.installment.plan}
          </p>
          <p className="mb-2">
            <strong>Interest Rate:</strong> {installmentDetails.installment.interestRate * 100}%
          </p>
          <p className="mb-2">
            <strong>Monthly Payment:</strong> {installmentDetails.installment.monthlyPayment.toLocaleString()} VND
          </p>
          <p className="mb-2">
            <strong>Total Amount:</strong> {installmentDetails.installment.totalAmount.toLocaleString()} VND
          </p>

          {/* Payment Schedule */}
          <h3 className="text-xl font-semibold mt-6 mb-4">Payment Schedule</h3>
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Installment No.</th>
                <th className="py-2 px-4 border-b">Due Date</th>
                <th className="py-2 px-4 border-b">Amount</th>
                <th className="py-2 px-4 border-b">Status</th>
              </tr>
            </thead>
            <tbody>
              {installmentDetails.payments.map(payment => (
                <tr key={payment._id} className="text-center">
                  <td className="py-2 px-4 border-b">{payment.paymentNumber}</td>
                  <td className="py-2 px-4 border-b">{new Date(payment.dueDate).toLocaleDateString()}</td>
                  <td className="py-2 px-4 border-b">{payment.amount.toLocaleString()} VND</td>
                  <td className="py-2 px-4 border-b">{payment.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
