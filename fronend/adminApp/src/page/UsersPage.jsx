import React, { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const UserPage = () => {
  const { user } = useContext(AuthContext)
  const [users, setUsers] = useState([])

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    role: 'user',
    password: '',
    code: '',
  })
  const [editUserId, setEditUserId] = useState(null)
  const [deleteUserId, setDeleteUserId] = useState(null)
  const [isModalVisible, setIsModalVisible] = useState(false)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/users', {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        })
        const data = await response.json()
        if (!response.ok) {
          throw new Error(data.message || 'An error occurred while fetching the user list!')
        }
        setUsers(data)
        console.log(data)
      } catch (error) {
        console.error('Error fetching the user list:', error)
        toast.error('Error retrieving the user list')
      }
    }

    if (user) {
      fetchUsers()
    }
  }, [user])

  // Handle adding or updating user
  const handleSubmit = async e => {
    e.preventDefault()
    try {
      const method = editUserId ? 'PUT' : 'POST'
      const url = editUserId
        ? `http://localhost:5000/api/users/update/${editUserId}`
        : 'http://localhost:5000/api/users/auth/register'

      // Include the 'code' field only when adding a new admin user
      let bodyData = {
        username: formData.username,
        email: formData.email,
        role: formData.role,
        password: formData.password,
      }

      if (!editUserId && formData.role === 'admin') {
        bodyData.code = formData.code
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(bodyData),
      })

      const data = await response.json()
      if (response.ok) {
        toast.success(editUserId ? 'Update successful!' : 'Addition successful!')

        setUsers(prevUsers => {
          if (editUserId) {
            return prevUsers.map(user => (user._id === editUserId ? data : user))
          } else {
            return [...prevUsers, data]
          }
        })
        // Reset form and edit state
        setFormData({
          username: '',
          email: '',
          role: 'user',
          password: '',
          code: '', // Reset code field
        })
        setEditUserId(null)
      } else {
        toast.error(data.message || 'An error occurred!')
      }
    } catch (error) {
      console.error('Error adding/updating user:', error)
      toast.error('Error adding/updating user')
    }
  }

  // Handle editing user
  const handleEdit = user => {
    setFormData({
      username: user.username,
      email: user.email,
      role: user.role,
      password: '', 
      code: '', 
    })
    setEditUserId(user._id)
  }

  // Handle deleting user
  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/delete/${deleteUserId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      if (response.ok) {
        toast.success('Deleted successfully!')
        setUsers(users.filter(user => user._id !== deleteUserId))
        setDeleteUserId(null) // Close modal after successful deletion
        setIsModalVisible(false) // Close modal
      } else {
        const data = await response.json()
        toast.error(data.message || 'An error occurred while deleting the user!')
      }
    } catch (error) {
      console.error('Error deleting user:', error)
      toast.error('Error deleting user!')
    }
  }

  return (
    <div className="p-8 pb-20">
      <h1 className="text-2xl font-bold mb-4 text-white">User Management</h1>

      {/* User table */}
      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">ID</th>
            <th className="py-2 px-4 border-b">Username</th>
            <th className="py-2 px-4 border-b">Email</th>
            <th className="py-2 px-4 border-b">Role</th>
            <th className="py-2 px-4 border-b">Actions</th>
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
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-1 rounded"
                  onClick={() => {
                    setDeleteUserId(user._id)
                    setIsModalVisible(true) // Show modal when delete button is clicked
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Delete confirmation modal */}
      {isModalVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          {users
            .filter(user => user._id === deleteUserId)
            .map(user => (
              <div key={user._id} className="bg-white p-6 rounded-lg shadow-lg transition-transform transform scale-95">
                <h2 className="text-xl font-semibold mb-4">Are you sure you want to delete user {user.username}?</h2>
                <div className="flex justify-end space-x-4">
                  <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600" onClick={handleDelete}>
                    Delete
                  </button>
                  <button
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                    onClick={() => setIsModalVisible(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ))}
        </div>
      )}

      {/* Add/Edit user form */}
      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <h2 className="text-xl font-semibold mb-4 text-white">{editUserId ? 'Edit User' : 'Add New User'}</h2>

        <div>
          <label className="block text-lg font-medium text-gray-400 mb-2">Username</label>
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
          <label className="block text-lg font-medium text-gray-400 mb-2">Role</label>
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

        {!editUserId && formData.role === 'admin' && (
          <div>
            <label className="block text-lg font-medium text-gray-400 mb-2">Admin Secret Code</label>
            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={e => setFormData({ ...formData, code: e.target.value })}
              required
              className="w-full border px-4 py-2 rounded"
            />
          </div>
        )}

        {!editUserId && (
          <div>
            <label className="block text-lg font-medium text-gray-400 mb-2">Password</label>
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
            {editUserId ? 'Update' : 'Add New'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default UserPage
