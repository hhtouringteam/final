// src/components/PaymentResult.js

import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import axios from 'axios'

export default function PaymentResultInstallment() {
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
        const app_trans_id = query.get('app_trans_id')
        const orderId = query.get('orderId')
        const paymentId = query.get('paymentId')

        console.log('PaymentResultInstallment - Query Params:', {
          status,
          paymentMethod,
          app_trans_id,
          orderId,
          paymentId,
        })

        if (!orderId || !paymentId) {
          setResult('fail')
          toast.error('Invalid order information.')
          return
        }

        // Call API to update payment status
        const updatePaymentStatus = async () => {
          try {
            const response = await axios.post(`${API_BASE_URL}/payments/updateInstallmentPaymentStatus`, {
              status,
              paymentMethod,
              orderId,
              paymentId,
              app_trans_id,
            })

            if (response.data.isInstallment) {
              setIsInstallment(true)
            }

            if (response.status === 200) {
              setResult('success')
              toast.success(response.data.message || 'Payment successful!')
            } else {
              setResult('fail')
              toast.error(response.data.message || 'Payment failed.')
            }
          } catch (error) {
            console.error('Error updating payment status:', error.response?.data?.message || error.message)
            setResult('fail')
            toast.error('An error occurred while updating the payment status.')
          }
        }

        await updatePaymentStatus()
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
            onClick={() => navigate('/user/profile')}
            className="mt-6 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Go Back
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
