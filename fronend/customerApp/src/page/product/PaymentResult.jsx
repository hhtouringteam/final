// src/components/PaymentResult.js

import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import axios from 'axios'

export default function PaymentResult() {
  const location = useLocation()
  const navigate = useNavigate()
  const [result, setResult] = useState(null)
  const [isInstallment, setIsInstallment] = useState(false)

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api'

  useEffect(() => {
    const fetchPaymentResult = async () => {
      try {
        const query = new URLSearchParams(location.search)
        const status = query.get('status') || ''
        const paymentMethod = query.get('paymentMethod')
        const orderCode = query.get('orderCode')
        const app_trans_id = query.get('app_trans_id')
        const orderId = query.get('orderId')
        const paymentId = query.get('paymentId')

        console.log('PaymentResult - Query Params:', {
          status,
          paymentMethod,
          orderCode,
          app_trans_id,
          paymentId,
          orderId,
        })

        let order = null
        let amount = null

        // Fetch order information from the server
        if (app_trans_id || orderCode) {
          const response = await fetch(`${API_BASE_URL}/orders/getOrderByTransId`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ app_trans_id, orderCode }),
          })

          const data = await response.json()

          if (response.ok) {
            order = data.order
            setIsInstallment(!!order.installmentId)

            // Retrieve amount from order information
            if (order.installmentId) {
              // If it's an installment order, get the amount of the next pending payment
              try {
                const installmentResponse = await fetch(`${API_BASE_URL}/installments/${order.installmentId}`)
                const installmentData = await installmentResponse.json()

                if (installmentResponse.ok) {
                  const nextPayment = installmentData.payments.find(p => p.status === 'Pending')
                  if (nextPayment) {
                    amount = nextPayment.amount
                  } else {
                    amount = 0 // All payments completed
                  }
                } else {
                  console.error('Error fetching installment details:', installmentData.message)
                  toast.error('Unable to retrieve installment information.')
                }
              } catch (error) {
                console.error('Error fetching installment details:', error)
                toast.error('An error occurred while retrieving installment information.')
              }
            } else {
              // If it's a one-time payment, amount is totalPrice
              amount = order.totalPrice
            }
          } else {
            console.error('Error fetching order:', data.message || 'Unknown error')
            setResult('fail')
            toast.error('Order not found.')
            return
          }
        }

        if (!amount || Number(amount) <= 0) {
          setResult('fail')
          toast.error('Unable to determine the payment amount.')
          return
        }

        // Convert amount to string to send to the server
        amount = amount.toString()

        if (paymentMethod === 'ZaloPay') {
          if (status === '1' && app_trans_id) {
            // Send request to update order status to 'Paid'
            try {
              const response = await fetch(`${API_BASE_URL}/payments/updatePaymentStatus`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ app_trans_id, status: 'Paid', amount }),
              })

              const data = await response.json()

              if (response.status === 200) {
                setResult('success')
                if (isInstallment) {
                  toast.success('Installment payment successful!')
                } else {
                  toast.success('Payment via ZaloPay successful!')
                }
              } else {
                setResult('fail')
                toast.error(`Order update error: ${data.message || 'Unknown error'}`)
              }
            } catch (error) {
              console.error('Error updating order status:', error)
              setResult('fail')
              toast.error('An error occurred while updating the order.')
            }
          } else if (status === '-49' || status === 'CANCELED') {
            setResult('fail')
            toast.error('Payment was canceled. Please try again.')
          } else {
            setResult('fail')
            toast.error('Unable to determine the payment status.')
          }
        } else if (paymentMethod === 'PayOS') {
          if (status === 'PAID' && orderCode) {
            // Send request to update order status to 'Paid'
            try {
              const response = await fetch(`${API_BASE_URL}/payments/updatePaymentStatus`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ orderCode, status: 'Paid', amount }),
              })

              const data = await response.json()

              if (response.ok) {
                setResult('success')
                if (isInstallment) {
                  toast.success('Installment payment successful!')
                } else {
                  toast.success('Payment via PayOS successful!')
                }
              } else {
                setResult('fail')
                toast.error(`Order update error: ${data.message || 'Unknown error'}`)
              }
            } catch (error) {
              console.error('Error updating order status:', error)
              setResult('fail')
              toast.error('An error occurred while updating the order.')
            }
          } else if (status === 'FAILED' || status === 'CANCELLED') {
            setResult('fail')
            toast.error('Payment was canceled. Please try again.')
          } else {
            setResult('fail')
            toast.error('Unable to determine the payment status.')
          }
        } else if (paymentMethod === 'COD') {
          setResult('cod')
          toast.success('Your order has been successfully placed. You will pay upon delivery.')
        } else {
          setResult('fail')
          toast.error('Unknown payment method.')
        }
      } catch (error) {
        console.error('Error in PaymentResult:', error)
        setResult('fail')
        toast.error('An error occurred during the payment process.')
      }
    }

    fetchPaymentResult()
  }, [location.search, API_BASE_URL])

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      {result === 'success' && (
        <div className="bg-white p-8 rounded shadow-md text-center">
          {isInstallment ? (
            <>
              <h1 className="text-3xl font-bold text-green-600 mb-4">Installment Payment Successful!</h1>
              <p className="text-lg">
                Thank you for making your installment payment. Please ensure to make subsequent payments on time.
              </p>
            </>
          ) : (
            <>
              <h1 className="text-3xl font-bold text-green-600 mb-4">Payment Successful!</h1>
              <p className="text-lg">Thank you for using our services.</p>
            </>
          )}
          <button
            onClick={() => navigate('/')}
            className="mt-6 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Go to Home
          </button>
        </div>
      )}

      {result === 'fail' && (
        <div className="bg-white p-8 rounded shadow-md text-center">
          <h1 className="text-3xl font-bold text-red-600 mb-4">Payment Failed!</h1>
          <p className="text-lg">An error occurred during the payment process. Please try again.</p>
          <button
            onClick={() => navigate('/checkout')}
            className="mt-6 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Retry Payment
          </button>
        </div>
      )}

      {result === 'cod' && (
        <div className="bg-white p-8 rounded shadow-md text-center">
          <h1 className="text-3xl font-bold text-green-600 mb-4">Order Placed Successfully!</h1>
          <p className="text-lg">Thank you for placing an order. You will pay upon delivery.</p>
          <button
            onClick={() => navigate('/')}
            className="mt-6 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Go to Home
          </button>
        </div>
      )}

      {result === null && (
        <div className="bg-white p-8 rounded shadow-md text-center">
          <h1 className="text-3xl font-bold text-gray-600 mb-4">Processing...</h1>
          <p className="text-lg">Please wait a moment.</p>
        </div>
      )}
    </div>
  )
}
