import React, { useContext } from 'react'
import { Menu, Notifications, Email, Settings } from '@mui/icons-material' // Import các biểu tượng
import { AuthContext } from '../../context/AuthContext' // Import AuthContext để lấy thông tin người dùng

const Header = ({ toggleSidebar, isSidebarVisible }) => {
  const { user } = useContext(AuthContext) // Lấy thông tin người dùng từ AuthContext

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

      {/* Biểu tượng thông báo và avatar bên phải */}
      <div className="flex items-center space-x-4">
        {/* Biểu tượng thông báo với số lượng */}
        <div className="relative">
          <Notifications className="text-white cursor-pointer" />
          <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-1">5</span>
        </div>

        {/* Biểu tượng Email với số lượng */}
        <div className="relative">
          <Email className="text-white cursor-pointer" />
          <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full px-1">5</span>
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
