// EmailLogs.js
import React, { useEffect, useState, useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

export default function EmailLogs() {
  const [emailLogs, setEmailLogs] = useState([])
  const { user } = useContext(AuthContext)

  useEffect(() => {
    if (!user || !user.token) return

    const fetchEmailLogs = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/emails', {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        })
        const data = await response.json()
        if (response.ok) {
          setEmailLogs(data.data)
        }
      } catch (error) {
        console.error('Error fetching email logs:', error)
      }
    }

    fetchEmailLogs()

    // Khi vào trang, đánh dấu tất cả email logs là đã đọc
    const markAsRead = async () => {
      try {
        await fetch('http://localhost:5000/api/emails/mark-all-as-read', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        })
      } catch (error) {
        console.error('Error marking email logs as read:', error)
      }
    }

    markAsRead()
  }, [user])

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Email Gửi Đến Admin</h2>
      {emailLogs.length === 0 ? (
        <p>Không có email nào.</p>
      ) : (
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Thời Gian Gửi</th>
              <th className="py-2 px-4 border-b">Mã Đơn Hàng</th>
              <th className="py-2 px-4 border-b">Tên Khách Hàng</th>
              <th className="py-2 px-4 border-b">Email Khách Hàng</th>
              <th className="py-2 px-4 border-b">Sản Phẩm</th>
              <th className="py-2 px-4 border-b">Tổng Giá</th>
              <th className="py-2 px-4 border-b">Số Lượng</th>
              <th className="py-2 px-4 border-b">Thông Tin Khách Hàng</th>
            </tr>
          </thead>
          <tbody>
            {emailLogs.map(email => {
              const products = email.products || []
              const totalQuantity = products.reduce((sum, item) => sum + item.quantity, 0)
              return (
                <tr key={email._id}>
                  <td className="py-2 px-4 border-b">{new Date(email.sentAt).toLocaleString()}</td>
                  <td className="py-2 px-4 border-b">{email.relatedOrderId?.orderCode || 'N/A'}</td>
                  <td className="py-2 px-4 border-b">{email.customerName || 'N/A'}</td>
                  <td className="py-2 px-4 border-b">{email.customerEmail || 'N/A'}</td>
                  <td className="py-2 px-4 border-b">
                    {products.map((item, index) => (
                      <div key={index}>
                        {item.name} - {item.quantity} x {item.price} VND
                      </div>
                    ))}
                  </td>
                  <td className="py-2 px-4 border-b">{email.totalPrice} VND</td>
                  <td className="py-2 px-4 border-b">{totalQuantity}</td>
                  <td className="py-2 px-4 border-b">
                    <div>Họ và tên: {email.billingInfo?.username || 'N/A'}</div>
                    <div>Email: {email.billingInfo?.email || 'N/A'}</div>
                    <div>Số điện thoại: {email.billingInfo?.phone || 'N/A'}</div>
                    <div>
                      Địa chỉ: {email.billingInfo?.streetAddress || 'N/A'}, {email.billingInfo?.country || 'N/A'}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      )}
    </div>
  )
}
