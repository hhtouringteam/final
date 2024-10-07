
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

export default function PaymentResult() {
  const location = useLocation()
  const navigate = useNavigate()
  const [result, setResult] = useState(null)
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api'

  useEffect(() => {
    const fetchPaymentResult = async () => {
      try {
  
        const query = new URLSearchParams(location.search)
        const status = query.get('status') 
        const paymentMethod = query.get('paymentMethod') || 'COD' 

        console.log('PaymentResult - Query Params:', { status, paymentMethod })

        if (paymentMethod === 'MoMo') {
        
          if (status === 'success') {
            setResult('success')
            toast.success('Thanh toán qua MoMo thành công!')
          } else if (status === 'fail') {
            setResult('fail')
            toast.error('Thanh toán qua MoMo thất bại. Vui lòng thử lại.')
          } else {
         
            setResult('fail')
            toast.error('Không xác định được trạng thái thanh toán.')
          }
        } else if (paymentMethod === 'COD') {
          
          setResult('cod')
          toast.success('Đơn hàng của bạn đã được đặt thành công. Bạn sẽ thanh toán khi nhận hàng.')
        } else {
       
          setResult('fail')
          toast.error('Phương thức thanh toán không xác định.')
        }
      } catch (error) {
        console.error('Error in PaymentResult:', error)
        setResult('fail')
        toast.error('Đã xảy ra lỗi trong quá trình xử lý thanh toán.')
      }
    }

    fetchPaymentResult()
  }, [location.search])

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      {result === 'success' && (
        <div className="bg-white p-8 rounded shadow-md text-center">
          <h1 className="text-3xl font-bold text-green-600 mb-4">Thanh Toán Thành Công!</h1>
          <p className="text-lg">Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi.</p>
          <button
            onClick={() => navigate('/')}
            className="mt-6 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Về Trang Chủ
          </button>
        </div>
      )}

      {result === 'cod' && (
        <div className="bg-white p-8 rounded shadow-md text-center">
          <h1 className="text-3xl font-bold text-green-600 mb-4">Đặt Hàng Thành Công!</h1>
          <p className="text-lg">Cảm ơn bạn đã đặt hàng. Bạn sẽ thanh toán khi nhận hàng.</p>
          <button
            onClick={() => navigate('/')}
            className="mt-6 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Về Trang Chủ
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
          <h1 className="text-3xl font-bold text-gray-600 mb-4">Đang Xử Lý...</h1>
          <p className="text-lg">Vui lòng đợi trong giây lát.</p>
        </div>
      )}
    </div>
  )
}
