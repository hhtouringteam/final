import React, { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const UserPage = () => {
  const { user } = useContext(AuthContext) // Lấy thông tin người dùng từ AuthContext
  const [users, setUsers] = useState([])

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    role: 'user',
    password: '',
  })
  const [editUserId, setEditUserId] = useState(null) // Lưu id của người dùng đang được chỉnh sửa
  const [deleteUserId, setDeleteUserId] = useState(null)
  const [isModalVisible, setIsModalVisible] = useState(false)
  // Lấy danh sách người dùng từ API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/users', {
          headers: {
            Authorization: `Bearer ${user.token}`, // Sử dụng token từ AuthContext
          },
        })
        const data = await response.json()
        if (!response.ok) {
          throw new Error(data.message || 'Có lỗi xảy ra khi lấy danh sách người dùng!')
        }
        setUsers(data)
        console.log(data)
      } catch (error) {
        console.error('Lỗi khi lấy danh sách người dùng:', error)
        toast.error('Lỗi khi lấy danh sách người dùng')
      }
    }

    if (user) {
      fetchUsers()
    }
  }, [user])

  // Xử lý thêm hoặc cập nhật người dùng
  const handleSubmit = async e => {
    e.preventDefault()
    try {
      const method = editUserId ? 'PUT' : 'POST' // PUT cho cập nhật, POST cho thêm mới
      const url = editUserId
        ? `http://localhost:5000/api/users/update/${editUserId}`
        : 'http://localhost:5000/api/users/auth/register'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`, // Thêm token xác thực vào headers
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()
      if (response.ok) {
        toast.success(editUserId ? 'Cập nhật thành công!' : 'Thêm mới thành công!')
        // Cập nhật lại danh sách người dùng
        setUsers(prevUsers => {
          if (editUserId) {
            return prevUsers.map(user => (user._id === editUserId ? data : user))
          } else {
            return [...prevUsers, data]
          }
        })
        // Reset form và trạng thái chỉnh sửa
        setFormData({
          username: '',
          email: '',
          role: 'user',
          password: '',
        })
        setEditUserId(null)
      } else {
        toast.error(data.message || 'Có lỗi xảy ra!')
      }
    } catch (error) {
      console.error('Lỗi khi thêm/cập nhật người dùng:', error)
      toast.error('Lỗi khi thêm/cập nhật người dùng')
    }
  }

  // Xử lý chỉnh sửa người dùng
  const handleEdit = user => {
    setFormData({
      username: user.username,
      email: user.email,
      role: user.role,
      password: '', // Không hiển thị mật khẩu
    })
    setEditUserId(user._id)
  }

  // Xử lý xóa người dùng
  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/delete/${deleteUserId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      if (response.ok) {
        toast.success('Xóa thành công!')
        setUsers(users.filter(user => user._id !== deleteUserId))
        setDeleteUserId(null) // Đóng modal sau khi xóa thành công
        setIsModalVisible(false) // Đóng modal
      } else {
        const data = await response.json()
        toast.error(data.message || 'Có lỗi xảy ra khi xóa người dùng!')
      }
    } catch (error) {
      console.error('Lỗi khi xóa người dùng:', error)
      toast.error('Lỗi khi xóa người dùng!')
    }
  }

  return (
    <div className="p-8 pb-20">
      <h1 className="text-2xl font-bold mb-4 text-white">Quản lý tài khoản</h1>

      {/* Bảng hiển thị người dùng */}
      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">ID</th>
            <th className="py-2 px-4 border-b">Tên người dùng</th>
            <th className="py-2 px-4 border-b">Email</th>
            <th className="py-2 px-4 border-b">Vai trò</th>
            <th className="py-2 px-4 border-b">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id}>
              <td className="py-2 px-4 border-b">{user._id}</td>
              <td className="py-2 px-4 border-b">{user.username}</td>
              <td className="py-2 px-4 border-b">{user.email}</td>
              <td className="py-2 px-4 border-b">{user.role}</td>
              <td className="py-2 px-4 border-b">
                <button className="bg-blue-500 text-white px-4 py-1 rounded mr-2" onClick={() => handleEdit(user)}>
                  Sửa
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-1 rounded"
                  onClick={() => {
                    setDeleteUserId(user._id)
                    setIsModalVisible(true) // Hiển thị modal khi nhấn nút xóa
                  }}
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Modal xác nhận xóa */}
      {isModalVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          {users
            .filter(user => user._id === deleteUserId)
            .map(user => (
              <div key={user._id} className="bg-white p-6 rounded-lg shadow-lg transition-transform transform scale-95">
                <h2 className="text-xl font-semibold mb-4">
                  Bạn có chắc chắn muốn xóa người dùng {user.username} không?
                </h2>
                <div className="flex justify-end space-x-4">
                  <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600" onClick={handleDelete}>
                    Xóa
                  </button>
                  <button
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                    onClick={() => setIsModalVisible(false)}
                  >
                    Hủy
                  </button>
                </div>
              </div>
            ))}
        </div>
      )}

      {/* Form thêm/chỉnh sửa người dùng */}
      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <h2 className="text-xl font-semibold mb-4 text-white">
          {editUserId ? 'Chỉnh sửa người dùng' : 'Thêm người dùng mới'}
        </h2>

        <div>
          <label className="block text-lg font-medium text-gray-400 mb-2">Tên người dùng</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={e => setFormData({ ...formData, username: e.target.value })}
            required
            className="w-full border px-4 py-2 rounded"
          />
        </div>

        <div>
          <label className="block text-lg font-medium text-gray-400 mb-2">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={e => setFormData({ ...formData, email: e.target.value })}
            required
            className="w-full border px-4 py-2 rounded"
          />
        </div>

        <div>
          <label className="block text-lg font-medium text-gray-400 mb-2">Vai trò</label>
          <select
            name="role"
            value={formData.role}
            onChange={e => setFormData({ ...formData, role: e.target.value })}
            required
            className="w-full border px-4 py-2 rounded"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {!editUserId && (
          <div>
            <label className="block text-lg font-medium text-gray-400 mb-2">Mật khẩu</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={e => setFormData({ ...formData, password: e.target.value })}
              required
              className="w-full border px-4 py-2 rounded"
            />
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition duration-300"
          >
            {editUserId ? 'Cập nhật' : 'Thêm mới'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default UserPage
