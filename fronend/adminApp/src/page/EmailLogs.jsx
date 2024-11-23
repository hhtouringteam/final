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

    // When entering the page, mark all email logs as read
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
      <h2 className="text-xl font-semibold mb-4 text-white">Emails Sent to Admin</h2>
      {emailLogs.length === 0 ? (
        <p>No emails.</p>
      ) : (
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Sent Time</th>
              <th className="py-2 px-4 border-b">Order Code</th>
              <th className="py-2 px-4 border-b">Customer Name</th>
              <th className="py-2 px-4 border-b">Customer Email</th>
              <th className="py-2 px-4 border-b">Products</th>
              <th className="py-2 px-4 border-b">Total Price</th>
              <th className="py-2 px-4 border-b">Quantity</th>
              <th className="py-2 px-4 border-b">Customer Information</th>
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
                    <div>Full Name: {email.billingInfo?.username || 'N/A'}</div>
                    <div>Email: {email.billingInfo?.email || 'N/A'}</div>
                    <div>Phone Number: {email.billingInfo?.phone || 'N/A'}</div>
                    <div>
                      Address: {email.billingInfo?.streetAddress || 'N/A'}, {email.billingInfo?.country || 'N/A'}
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
