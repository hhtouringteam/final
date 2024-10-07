import React, { useEffect, useContext, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import { Navigate } from 'react-router-dom'

function AdminDashboard() {
  const { user, logout } = useContext(AuthContext) // Lấy user và logout từ context
  const [adminInfo, setAdminInfo] = useState({}) // Lưu trữ thông tin admin
  const [message, setMessage] = useState('') // Lưu trữ thông báo

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/users/dashboard', {
          headers: {
            Authorization: `Bearer ${user.token}`, // Truyền token để xác thực
          },
        })

        if (!res.ok) {
          const errorData = await res.json()
          throw new Error(errorData.error || 'Đã xảy ra lỗi')
        }

        const data = await res.json()
        setAdminInfo(data.admin) // Lưu thông tin admin từ phản hồi API
        setMessage('Thông tin admin đã được tải thành công.')
      } catch (err) {
        alert(err.message)
      }
    }

    if (user && user.role === 'admin') {
      fetchAdminData() // Gọi API chỉ khi user là admin
    }
  }, [user])

  if (!user) {
    // Chuyển hướng đến trang đăng nhập nếu chưa đăng nhập
    return <Navigate to="/login" replace />
  }

  if (user.role !== 'admin') {
    // Chuyển hướng đến trang thông báo không có quyền
    return <Navigate to="/no-access" replace />
  }

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">Chào mừng Admin!</h1>
        <p className="text-sm text-green-600 mb-4 text-center">{message}</p>
        {/* Hiển thị tên admin nếu đã tải thành công */}
        {adminInfo && (
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm mb-4">
            <p className="text-lg font-semibold text-gray-800">
              <strong>Tên Admin:</strong> {adminInfo.name}
            </p>
            <p className="text-lg text-gray-600">
              <strong>Email:</strong> {adminInfo.email}
            </p>
          </div>
        )}
        <button
          onClick={logout}
          className="w-full bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition duration-300"
        >
          Đăng xuất
        </button>
      </div>
    </div>
  )
}

export default AdminDashboard
