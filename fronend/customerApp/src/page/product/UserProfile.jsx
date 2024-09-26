import React, { useEffect, useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserContext } from '../../context/UserContext' // Import UserContext

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState('profile')
  const [orders, setOrders] = useState([]) // Lưu trữ lịch sử đơn hàng
  const [avatarFile, setAvatarFile] = useState(null) // Để lưu trữ ảnh đại diện
  const [showChangePassword, setShowChangePassword] = useState(false) // Quản lý hiển thị form đổi mật khẩu
  const navigate = useNavigate()

  const { user, logout, setUser } = useContext(UserContext) // Lấy user và logout từ UserContext

  // Kiểm tra nếu người dùng chưa đăng nhập, điều hướng về trang đăng nhập

  useEffect(() => {
    if (!user) {
      navigate('/login')
    }

    // Fetch lịch sử đơn hàng (giả sử có API)
    const fetchOrders = async () => {
      try {
        const response = await fetch('/api/orders', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        const orderData = await response.json()
        setOrders(orderData)
      } catch (error) {
        console.error('Error fetching orders:', error)
      }
    }

    fetchOrders()
  }, [user, navigate])

  const handleLogout = () => {
    logout() // Gọi hàm logout từ UserContext
    navigate('/login')
  }

  const handleAvatarChange = e => {
    setAvatarFile(e.target.files[0])
  }

  const handleUploadAvatar = async e => {
    e.preventDefault()
    const formData = new FormData()
    formData.append('avatar', avatarFile)

    try {
      const response = await fetch('http://localhost:5000/api/users/upload-avatar', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      })

      const res = await response.json()

      if (response.ok) {
        const updatedUser = { ...user, avatar: res.avatar }
        setUser(updatedUser) // Cập nhật avatar trong context hoặc state
        localStorage.setItem('user', JSON.stringify(updatedUser)) // Lưu thông tin user vào localStorage
        alert('Avatar uploaded successfully!')
      } else {
        alert(res.message)
      }
    } catch (error) {
      console.error('Error uploading avatar:', error)
    }
  }

  // Hàm xử lý thay đổi mật khẩu
  const handleChangePassword = () => {
    setShowChangePassword(!showChangePassword)
  }
  // Hàm render nội dung các tabs
  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Thông tin cá nhân</h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <span className="w-32 font-medium">Tên người dùng:</span>
                <span>{user.username}</span>
              </div>
              <div className="flex items-center">
                <span className="w-32 font-medium">Email:</span>
                <span>{user.email}</span>
              </div>
              <div className="flex items-center">
                <span className="w-32 font-medium">Vai trò:</span>
                <span className="capitalize">{user.role}</span>
              </div>
            </div>
          </div>
        )
      case 'orders':
        return (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Lịch sử đơn hàng</h2>
            {orders.length > 0 ? (
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b">Mã đơn hàng</th>
                    <th className="py-2 px-4 border-b">Ngày đặt</th>
                    <th className="py-2 px-4 border-b">Trạng thái</th>
                    <th className="py-2 px-4 border-b">Tổng tiền</th>
                    <th className="py-2 px-4 border-b">Chi tiết</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order.id} className="text-center">
                      <td className="py-2 px-4 border-b">#{order.id}</td>
                      <td className="py-2 px-4 border-b">{order.date}</td>
                      <td className="py-2 px-4 border-b">{order.status}</td>
                      <td className="py-2 px-4 border-b">{order.total}</td>
                      <td className="py-2 px-4 border-b">
                        <button className="text-blue-500 hover:underline">Xem</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>Chưa có đơn hàng nào.</p>
            )}
          </div>
        )
      case 'settings':
        return (
          <div>
            <h2 className="text-2xl font-semibold mb-6">Cài đặt tài khoản</h2>
            <form onSubmit={handleUploadAvatar} className="space-y-6">
              {/* Tải lên ảnh đại diện */}
              <div>
                <label className="block text-lg font-medium text-gray-700 mb-2">Ảnh đại diện</label>
                <div className="flex items-center">
                  {user.avatar ? (
                    <img src={user.avatar} alt="Avatar" className="w-24 h-24 rounded-full mr-4 object-cover" />
                  ) : (
                    <div className="w-24 h-24 bg-gray-400 text-white rounded-full flex items-center justify-center mr-4">
                      {user.username[0]}
                    </div>
                  )}
                  <div>
                    <label className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300">
                      <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                      Chọn ảnh
                    </label>
                    {avatarFile && (
                      <button
                        type="submit"
                        className="ml-4 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-300"
                      >
                        Tải lên
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Thay đổi mật khẩu */}
              <div>
                <label className="block text-lg font-medium text-gray-700 mb-2">Mật khẩu</label>
                <button
                  type="button"
                  onClick={handleChangePassword}
                  className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition duration-300"
                >
                  {showChangePassword ? 'Ẩn form đổi mật khẩu' : 'Thay đổi mật khẩu'}
                </button>

                {showChangePassword && (
                  <div className="mt-4 space-y-4">
                    <input
                      type="password"
                      name="currentPassword"
                      placeholder="Mật khẩu hiện tại"
                      className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="password"
                      name="newPassword"
                      placeholder="Mật khẩu mới"
                      className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="password"
                      name="confirmNewPassword"
                      placeholder="Xác nhận mật khẩu mới"
                      className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 transition duration-300"
                    >
                      Cập nhật mật khẩu
                    </button>
                  </div>
                )}
              </div>

              {/* Nút Đăng xuất */}
              <div className="mt-6">
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600 transition duration-300"
                >
                  Đăng xuất
                </button>
              </div>
            </form>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      {user ? (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6">
            <div className="flex items-center">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt="Avatar"
                  className="w-20 h-20 rounded-full border-4 border-white mr-4 object-cover"
                />
              ) : (
                <div className="w-20 h-20 bg-gray-400 text-white rounded-full flex items-center justify-center mr-4 text-2xl font-bold">
                  {user.username[0]}
                </div>
              )}
              <div className="text-white">
                <h2 className="text-2xl font-semibold">{user.username}</h2>
                <p>{user.email}</p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b">
            <nav className="flex space-x-6 px-6">
              <button
                className={`py-4 text-lg font-medium ${
                  activeTab === 'profile'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
                onClick={() => setActiveTab('profile')}
              >
                Thông tin cá nhân
              </button>
              <button
                className={`py-4 text-lg font-medium ${
                  activeTab === 'orders'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
                onClick={() => setActiveTab('orders')}
              >
                Lịch sử đơn hàng
              </button>
              <button
                className={`py-4 text-lg font-medium ${
                  activeTab === 'settings'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
                onClick={() => setActiveTab('settings')}
              >
                Cài đặt tài khoản
              </button>
            </nav>
          </div>

          {/* Nội dung Tab */}
          <div className="p-6">{renderTabContent()}</div>
        </div>
      ) : (
        <p>Đang tải thông tin...</p>
      )}
    </div>
  )
}

export default UserProfile
