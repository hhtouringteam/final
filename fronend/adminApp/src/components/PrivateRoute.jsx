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
    // Nếu người dùng không phải admin, chuyển hướng đến trang thông báo lỗi hoặc trang chủ
    return <Navigate to="/no-access" replace />
  }
  return children
}

export default PrivateRoute
