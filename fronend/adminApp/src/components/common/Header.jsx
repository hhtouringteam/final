import React, { useContext, useState, useEffect } from 'react'
import { Menu, Notifications, Email, Settings } from '@mui/icons-material' // Import các biểu tượng
import { AuthContext } from '../../context/AuthContext' // Import AuthContext để lấy thông tin người dùng
import { NavLink } from 'react-router-dom'
const Header = ({ toggleSidebar, isSidebarVisible }) => {
  const { user } = useContext(AuthContext) // Lấy thông tin người dùng từ AuthContext
  const [unreadCounts, setUnreadCounts] = useState({
    notifications: 0,
    emails: 0,
  })
  useEffect(() => {
    if (!user || !user.token) return

    const fetchUnreadCounts = async () => {
      try {
        const [notificationsRes, emailsRes] = await Promise.all([
          fetch('http://localhost:5000/api/notifications/unread-count', {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }),
          fetch('http://localhost:5000/api/emails/unread-count', {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }),
        ])

        const notificationsData = await notificationsRes.json()
        const emailsData = await emailsRes.json()

        if (notificationsRes.ok && emailsRes.ok) {
          setUnreadCounts({
            notifications: notificationsData.count,
            emails: emailsData.count,
          })
        }
      } catch (error) {
        console.error('Error fetching unread counts:', error)
      }
    }

    fetchUnreadCounts()

    const interval = setInterval(() => {
      fetchUnreadCounts()
    }, 60000)

    return () => {
      clearInterval(interval)
    }
  }, [user])

  return (
    <div
      className={`fixed border-b border-gray-700 top-0 left-0 h-16 flex items-center justify-between bg-gray-900 text-white z-1000 px-4 transition-all duration-300 ${
        isSidebarVisible ? 'ml-64 w-[calc(100%-16rem)]' : 'ml-0 w-full'
      }`}
    >
      {/* Tiêu đề và điều hướng bên trái */}
      <div className="flex items-center space-x-4">
        {/* Biểu tượng hamburger menu */}
        <Menu className="text-white cursor-pointer" onClick={toggleSidebar} />
        <nav className="hidden md:flex space-x-4 text-white">
          {/* Ẩn menu trên màn hình nhỏ hơn */}
          <a href="/dashboard" className="hover:underline">
            Dashboard
          </a>
          <a href="/users" className="hover:underline">
            Users
          </a>
          <a href="/admin" className="hover:underline">
            Admin
          </a>
        </nav>
      </div>

      <div className="flex items-center space-x-4">
        {/* Biểu tượng thông báo với số lượng */}
        <div className="relative">
          <NavLink to="/notifications" className="flex items-center">
            <Notifications className="text-white cursor-pointer" />
            {unreadCounts.notifications > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-1">
                {unreadCounts.notifications}
              </span>
            )}
          </NavLink>
        </div>

        {/* Biểu tượng Email với số lượng */}
        <div className="relative">
          <NavLink to="/emailogs" className="flex items-center">
            <Email className="text-white cursor-pointer" />
            {unreadCounts.emails > 0 && (
              <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full px-1">
                {unreadCounts.emails}
              </span>
            )}
          </NavLink>
        </div>

        {/* Hiển thị tên người dùng */}

        {/* Biểu tượng cài đặt với liên kết đến trang Settings */}
        <a href="/admin">
          <Settings className="text-white cursor-pointer" />
        </a>

        {/* Hiển thị avatar người dùng */}
        <img
          src={user.avatar} // Sử dụng avatar từ AuthContext, hoặc ảnh mặc định nếu không có
          alt="User Avatar"
          className="w-8 h-8 rounded-full cursor-pointer"
        />
      </div>
    </div>
  )
}

export default Header
