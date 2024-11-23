import React, { useState, useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

function Login() {
  const [formData, setFormData] = useState({ username: '', password: '' })
  const { login } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      const res = await fetch('http://localhost:5000/api/users/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || 'An error occurred')
      }

      const data = await res.json()
      console.log(data)
      login(data.token)
      console.log(data.token)
      alert(' Login successful!')
      navigate('/dashboard')
    } catch (err) {
      alert(err.message || 'erros')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="username" placeholder="Tên người dùng" onChange={handleChange} required />
      <input type="password" name="password" placeholder="Mật khẩu" onChange={handleChange} required />
      <button type="submit">Đăng nhập</button>
    </form>
  )
}

export default Login
