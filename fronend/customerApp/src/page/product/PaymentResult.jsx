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
        const status = query.get('status') || ''
        const paymentMethod = query.get('paymentMethod')
        const orderCode = query.get('orderCode')
        const app_trans_id = query.get('app_trans_id')

        console.log('PaymentResult - Query Params:', { status, paymentMethod, orderCode, app_trans_id })

        if (paymentMethod === 'PayOS') {
          if (status === 'PAID' && orderCode) {
            // Gửi yêu cầu cập nhật trạng thái đơn hàng thành 'paid'
            try {
              const response = await fetch(`${API_BASE_URL}/payments/updatePaymentStatus`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ orderCode, status: 'paid' }),
              })

              const data = await response.json()

              if (response.ok) {
                setResult('success')
                toast.success('Thanh toán qua PayOS thành công!')
              } else {
                setResult('fail')
                toast.error(`Lỗi cập nhật đơn hàng: ${data.message || 'Unknown error'}`)
              }
            } catch (error) {
              console.error('Error updating order status:', error)
              setResult('fail')
              toast.error('Đã xảy ra lỗi khi cập nhật đơn hàng.')
            }
          } else if (status === 'FAILED' || status === 'CANCELLED') {
            // Gửi yêu cầu cập nhật trạng thái đơn hàng thành 'failed'
            if (orderCode) {
              try {
                const response = await fetch(`${API_BASE_URL}/payments/updatePaymentStatus`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ orderCode, status: 'failed' }),
                })

                const data = await response.json()

                if (response.ok) {
                  setResult('fail')
                  toast.error('Thanh toán qua PayOS thất bại. Vui lòng thử lại.')
                } else {
                  setResult('fail')
                  toast.error(`Lỗi cập nhật đơn hàng: ${data.message || 'Unknown error'}`)
                }
              } catch (error) {
                console.error('Error updating order status:', error)
                setResult('fail')
                toast.error('Đã xảy ra lỗi khi cập nhật đơn hàng.')
              }
            } else {
              setResult('fail')
              toast.error('Không tìm thấy orderCode để cập nhật trạng thái thanh toán.')
            }
          } else {
            setResult('fail')
            toast.error('Không xác định được trạng thái thanh toán.')
          }
        } else if (paymentMethod === 'ZaloPay') {
          if (status === '1' && app_trans_id) {
            // Gửi yêu cầu cập nhật trạng thái đơn hàng thành 'paid'
            try {
              const response = await fetch(`${API_BASE_URL}/payments/updatePaymentStatus`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ app_trans_id, status: 'paid' }),
              })

              const data = await response.json()

              if (response.ok) {
                setResult('success')
                toast.success('Thanh toán qua ZaloPay thành công!')
              } else {
                setResult('fail')
                toast.error(`Lỗi cập nhật đơn hàng: ${data.message || 'Unknown error'}`)
              }
            } catch (error) {
              console.error('Error updating order status:', error)
              setResult('fail')
              toast.error('Đã xảy ra lỗi khi cập nhật đơn hàng.')
            }
          } else if (status === '-49' || status === 'CANCELED') {
            // Gửi yêu cầu cập nhật trạng thái đơn hàng thành 'failed'
            if (app_trans_id) {
              try {
                const response = await fetch(`${API_BASE_URL}/payments/updatePaymentStatus`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ app_trans_id, status: 'failed' }),
                })

                const data = await response.json()

                if (response.ok) {
                  setResult('fail')
                  toast.error('Thanh toán qua ZaloPay thất bại. Vui lòng thử lại.')
                } else {
                  setResult('fail')
                  toast.error(`Lỗi cập nhật đơn hàng: ${data.message || 'Unknown error'}`)
                }
              } catch (error) {
                console.error('Error updating order status:', error)
                setResult('fail')
                toast.error('Đã xảy ra lỗi khi cập nhật đơn hàng.')
              }
            } else {
              setResult('fail')
              toast.error('Không tìm thấy app_trans_id để cập nhật trạng thái thanh toán.')
            }
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
  }, [location.search, API_BASE_URL])

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

      {result === 'pending' && (
        <div className="bg-white p-8 rounded shadow-md text-center">
          <h1 className="text-3xl font-bold text-yellow-600 mb-4">Đơn Hàng Đang Được Xử Lý</h1>
          <p className="text-lg">Chúng tôi đang xác nhận thanh toán của bạn. Vui lòng đợi trong giây lát.</p>
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
