import React, { useEffect, useState, useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([])
  const { user } = useContext(AuthContext)

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/notifications', {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        })
        const data = await response.json()
        if (response.ok) {
          setNotifications(data.data)
        }
      } catch (error) {
        console.error('Error fetching notifications:', error)
      }
    }

    fetchNotifications()

    // Khi vào trang thông báo, đánh dấu tất cả là đã đọc
    const markAsRead = async () => {
      try {
        await fetch('http://localhost:5000/api/notifications/mark-all-as-read', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        })
      } catch (error) {
        console.error('Error marking notifications as read:', error)
      }
    }

    markAsRead()
  }, [user.token])

  return (
    <div className="bg-white shadow-md rounded p-4">
      <h2 className="text-xl font-semibold mb-4">Thông Báo</h2>
      {notifications.length === 0 ? (
        <p>Không có thông báo nào.</p>
      ) : (
        <ul>
          {notifications.map(notification => (
            <li key={notification._id} className="mb-2">
              <p>{notification.message}</p>
              <small className="text-gray-500">{new Date(notification.createdAt).toLocaleString()}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
