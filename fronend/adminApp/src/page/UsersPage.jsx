import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify' // Để hiển thị thông báo
import 'react-toastify/dist/ReactToastify.css' // Đảm bảo bạn đã cài đặt react-toastify
const token = localStorage.getItem('token')
const UserPage = () => {
  const [users, setUsers] = useState([])
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    role: 'user',
    password: '',
  })
  const [editUserId, setEditUserId] = useState(null) // Lưu id của người dùng đang được chỉnh sửa

  // Lấy danh sách người dùng từ API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/users')
        const data = await response.json()
        setUsers(data)
      } catch (error) {
        console.error('Lỗi khi lấy danh sách người dùng:', error)
      }
    }
    fetchUsers()
  }, [])

  // Xử lý thêm hoặc cập nhật người dùng
  const handleSubmit = async e => {
    e.preventDefault()
    try {
      const method = editUserId ? 'PUT' : 'POST' // PUT cho cập nhật, POST cho thêm mới
      const url = editUserId ? `http://localhost:5000/api/users/${editUserId}` : 'http://localhost:5000/api/users'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
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
  const handleDelete = async userId => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        toast.success('Xóa thành công!')
        setUsers(users.filter(user => user._id !== userId))
      } else {
        toast.error('Có lỗi xảy ra khi xóa người dùng!')
      }
    } catch (error) {
      console.error('Lỗi khi xóa người dùng:', error)
    }
  }

  return (
    <div className="p-8  ">
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
                <button className="bg-red-500 text-white px-4 py-1 rounded" onClick={() => handleDelete(user._id)}>
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Form thêm/chỉnh sửa người dùng */}
      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <h2 className="text-xl font-semibold mb-4 text-white">
          {editUserId ? 'Chỉnh sửa người dùng' : 'Thêm người dùng mới'}
        </h2>

        <div>
          <label className="block text-lg  font-medium text-gray-400 mb-2">Tên người dùng</label>
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
