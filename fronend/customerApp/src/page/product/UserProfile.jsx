// src/components/UserProfile.js
import React, { useEffect, useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext' // Import AuthContext
import { toast } from 'react-toastify' // Import react-toastify
import axios from 'axios' // Sử dụng axios để thực hiện các yêu cầu HTTP

const UserProfile = () => {
  const { user, logout } = useContext(AuthContext) // Lấy user và logout từ AuthContext
  const [activeTab, setActiveTab] = useState('profile')
  const [orders, setOrders] = useState([]) // Lưu trữ lịch sử đơn hàng
  const [loading, setLoading] = useState(true)
  const [expandedOrder, setExpandedOrder] = useState(null)
  const [searchTerm, setSearchTerm] = useState('') // State cho tìm kiếm đơn hàng
  const [filterStatus, setFilterStatus] = useState('all') // State cho lọc theo trạng thái
  const navigate = useNavigate()

  // Base URL của API
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api'

  // Kiểm tra nếu người dùng chưa đăng nhập, điều hướng về trang đăng nhập
  useEffect(() => {
    if (!user) {
      navigate('/login')
    }

    // Fetch lịch sử đơn hàng
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/orders/${user.userId}`)
        setOrders(response.data) // Lưu danh sách đơn hàng vào state
      } catch (error) {
        console.error('Không tìm thấy đơn hàng', error.response?.data?.message || error.message)
        toast.error('Không tìm thấy đơn hàng hoặc đã xảy ra lỗi.')
      }
      setLoading(false)
    }

    if (user && user.userId) {
      fetchOrders() // Chỉ gọi API nếu userId có tồn tại
    }
  }, [user, navigate, API_BASE_URL])

  // Hàm xử lý mở chi tiết đơn hàng
  const handleExpandOrder = orderId => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null) // Đóng chi tiết đơn hàng nếu đang mở
    } else {
      setExpandedOrder(orderId) // Mở chi tiết đơn hàng
    }
  }

  // Hàm đánh dấu đơn hàng đã nhận hàng
  const handleMarkAsReceived = async orderId => {
    try {
      const response = await axios.put(`${API_BASE_URL}/orders/${orderId}/status`, { status: 'Received' })

      const updatedOrder = response.data

      // Cập nhật trạng thái trong UI
      setOrders(prevOrders =>
        prevOrders.map(order => (order._id === orderId ? { ...order, status: updatedOrder.status } : order)),
      )
      toast.success('Đã nhận hàng thành công!')
    } catch (error) {
      console.error('Error marking order as received:', error.response?.data?.message || error.message)
      toast.error('Đánh dấu nhận hàng thất bại.')
    }
  }

  // Hàm xử lý khi nhấn "Logout"
  const handleLogout = () => {
    logout() // Gọi hàm logout từ AuthContext
    navigate('/login')
  }

  // Hàm lọc và tìm kiếm đơn hàng
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order._id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus
    return matchesSearch && matchesStatus
  })

  if (loading) {
    return <p className="text-center mt-10">Loading...</p>
  }

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

            {/* Tìm kiếm và lọc đơn hàng */}
            <div className="flex flex-col md:flex-row justify-between mb-4">
              <input
                type="text"
                className="border border-gray-300 p-2 rounded-md mb-2 md:mb-0"
                placeholder="Tìm kiếm đơn hàng theo mã..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
              <select
                className="border border-gray-300 p-2 rounded-md"
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="Pending">Pending</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
                <option value="paid">Paid</option>
              </select>
            </div>

            {filteredOrders.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead>
                    <tr>
                      <th className="py-2 px-4 border-b">Mã đơn hàng</th>
                      <th className="py-2 px-4 border-b">Ngày đặt</th>
                      <th className="py-2 px-4 border-b">Trạng thái</th>
                      <th className="py-2 px-4 border-b">Phương thức thanh toán</th>
                      <th className="py-2 px-4 border-b">Tổng tiền</th>
                      <th className="py-2 px-4 border-b">Chi tiết</th>
                      <th className="py-2 px-4 border-b">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map(order => (
                      <React.Fragment key={order._id}>
                        <tr className="text-center">
                          <td className="py-2 px-4 border-b">#{order._id}</td>
                          <td className="py-2 px-4 border-b">{new Date(order.createdAt).toLocaleString()}</td>
                          <td className="py-2 px-4 border-b capitalize">{order.status}</td>
                          <td className="py-2 px-4 border-b">{order.paymentMethod || 'MoMo'}</td>
                          <td className="py-2 px-4 border-b">{order.totalPrice.toLocaleString()} VND</td>
                          <td className="py-2 px-4 border-b">
                            <button
                              className="text-blue-500 hover:underline"
                              onClick={() => handleExpandOrder(order._id)}
                            >
                              {expandedOrder === order._id ? 'Ẩn' : 'Xem'}
                            </button>
                          </td>
                          <td className="py-2 px-4 border-b">
                            {/* Thêm nút "Đã Nhận Hàng" nếu trạng thái là "Delivered" */}
                            {order.status === 'Delivered' && (
                              <button
                                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                                onClick={() => handleMarkAsReceived(order._id)}
                              >
                                Đã Nhận Hàng
                              </button>
                            )}
                            {/* Nếu đơn hàng đã nhận hàng, hiển thị trạng thái */}
                            {order.status === 'Received' && (
                              <span className="text-green-600 font-semibold">Đã Nhận Hàng</span>
                            )}
                          </td>
                        </tr>
                        {expandedOrder === order._id && (
                          <tr>
                            <td colSpan="7" className="bg-gray-100">
                              <div className="p-4">
                                <h4 className="font-semibold mb-2">Chi tiết sản phẩm:</h4>
                                <ul className="list-disc list-inside">
                                  {order.cartItems.map(item => (
                                    <li key={item.productId}>
                                      <span className="font-semibold">Sản phẩm:</span> {item.name} -{' '}
                                      <span className="font-semibold">Số lượng:</span> {item.quantity} -{' '}
                                      <span className="font-semibold">Giá:</span> {item.price.toLocaleString()} VND
                                    </li>
                                  ))}
                                </ul>
                                {order.paymentMethod === 'MoMo' && order.status === 'paid' && (
                                  <div className="mt-4">
                                    <span className="font-semibold">Thanh toán qua:</span> MoMo
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p>Chưa có đơn hàng nào.</p>
            )}
          </div>
        )
      case 'settings':
        return (
          <div>
            <h2 className="text-2xl font-semibold mb-6">Cài đặt tài khoản</h2>

            {/* Nút Đăng xuất */}
            <div className="mt-6">
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600 transition duration-300"
              >
                Đăng xuất
              </button>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-8">
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
                  {user.username[0].toUpperCase()}
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
        <p className="text-center mt-10">Đang tải thông tin...</p>
      )}
    </div>
  )
}

export default UserProfile
