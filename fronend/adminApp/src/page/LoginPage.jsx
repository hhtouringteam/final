import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const [loginData, setLoginData] = useState({ email: '', password: '' })
  const navigate = useNavigate()

  // Xử lý khi có sự thay đổi trong input
  const handleInputChange = e => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    })
  }

  // Gửi form đăng nhập
  const handleSubmit = async e => {
    e.preventDefault()
    try {
      const response = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      })

      const data = await response.json()

      if (response.ok) {
        // Lưu token vào localStorage
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        alert('Đăng nhập thành công!')
        navigate('/admin') // Điều hướng đến trang admin
      } else {
        alert(data.message || 'Đăng nhập thất bại')
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  return (
    <div>
      <h2>Đăng Nhập</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Nhập email"
          value={loginData.email}
          onChange={handleInputChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Nhập mật khẩu"
          value={loginData.password}
          onChange={handleInputChange}
          required
        />
        <button type="submit">Đăng nhập</button>
      </form>
    </div>
  )
}

export default Login
