// src/components/PrivateRoute.js
import React, { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

function PrivateRoute({ children }) {
  const { user, loading } = useContext(AuthContext)

  if (loading) {
    // Chờ cho đến khi quá trình kiểm tra token hoàn tất
    return
  }

  if (!user) {
    // Nếu không có người dùng, chuyển hướng đến trang đăng nhập
    return <Navigate to="/login" replace />
  }

  if (user.role !== 'admin') {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <h1 className="text-6xl font-bold text-red-500">404</h1>
        <h2 className="mt-4 text-2xl font-semibold text-gray-800">Không tìm thấy trang</h2>
        <p className="mt-2 text-lg text-gray-600">
          Bạn không có quyền truy cập trang này. Vui lòng liên hệ với quản trị viên hoặc quay lại trang chủ.
        </p>
        <button
          onClick={() => {
            window.location.href = 'http://localhost:3001'
          }}
          className="mt-6 px-5 py-3 bg-blue-500 text-white text-lg font-medium rounded-lg hover:bg-blue-600 transition-colors duration-300"
        >
          Quay lại trang chủ
        </button>
      </div>
    )
  }
  return children
}

export default PrivateRoute
