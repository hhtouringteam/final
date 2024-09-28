import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { AuthContext } from '../../context/AuthContext' // Import UserContext

export default function Login() {
  // State cho form đăng nhập
  const [loginData, setLoginData] = useState({
    username: '',
    password: '',
  })

  // State cho form đăng ký
  const [registerData, setRegisterData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const navigate = useNavigate()
  const { login } = useContext(AuthContext) // Lấy hàm login từ UserContext

  // Xử lý thay đổi input cho form đăng nhập
  const handleLoginChange = e => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    })
  }

  // Xử lý submit form đăng nhập
  const handleLoginSubmit = async e => {
    e.preventDefault()
    try {
      const response = await fetch('http://localhost:5000/api/users/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: loginData.username, // Sử dụng email để đăng nhập
          password: loginData.password,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        // Đăng nhập thành công, gọi hàm login từ AuthContext
        login(data.token)

        toast.success('Đăng nhập thành công!')

        // Kiểm tra vai trò của người dùng
        if (data.user.role === 'admin') {
          // Điều hướng tới trang quản lý admin
          window.location.href = 'http://localhost:3000/admin'
        } else {
          // Điều hướng tới trang home cho customer
          navigate('/')
        }
      } else {
        // Xử lý lỗi nếu thông tin đăng nhập sai
        toast.error(data.error || 'Đăng nhập thất bại, vui lòng thử lại.')
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra, vui lòng thử lại.')
      console.error('Lỗi đăng nhập:', error)
    }
  }
  const handleRegisterChange = e => {
    setRegisterData({
      ...registerData,
      [e.target.name]: e.target.value,
    })
  }
  // Xử lý submit form đăng ký
  const handleRegisterSubmit = async e => {
    e.preventDefault()
    if (registerData.password !== registerData.confirmPassword) {
      toast.error('Mật khẩu xác nhận không khớp')
      return
    }
    try {
      const response = await fetch('http://localhost:5000/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: `${registerData.firstName} ${registerData.lastName}`,
          email: registerData.email,
          password: registerData.password,
        }),
      })

      const res = await response.json()

      if (response.ok) {
        toast.success('Đăng ký thành công!')

        // Thực hiện đăng nhập sau khi đăng ký thành công
        const loginResponse = await fetch('http://localhost:5000/api/users/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: registerData.email,
            password: registerData.password,
          }),
        })

        const loginRes = await loginResponse.json()

        if (loginResponse.ok) {
          localStorage.setItem('token', loginRes.token)

          // Gọi hàm login từ Context để cập nhật trạng thái người dùng
          login({
            userId: loginRes.user._id,
            username: loginRes.user.username,
            email: loginRes.user.email,
            avatar: loginRes.user.avatar,
            role: loginRes.user.role,
          })

          navigate('/') // Chuyển hướng đến trang chủ
        } else {
          toast.error(loginRes.message || 'Đã xảy ra lỗi khi đăng nhập')
        }
      } else {
        toast.error(res.message || 'Đã xảy ra lỗi')
      }
    } catch (error) {
      toast.error('Đã xảy ra lỗi')
    }
  }

  const handleFacebookLogin = () => {
    console.log('Facebook login clicked')
  }

  const handleGoogleLogin = () => {
    console.log('Google+ login clicked')
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="text-center">
        <h3 className="mb-4 text-2xl font-semibold">LOGIN WITH</h3>
        <div className="flex justify-center mb-6">
          <button className="bg-blue-600 text-white px-4 py-2 rounded mr-2" onClick={handleFacebookLogin}>
            Facebook
          </button>
          <button className="bg-red-600 text-white px-4 py-2 rounded" onClick={handleGoogleLogin}>
            Google+
          </button>
        </div>
        <hr className="w-118 border-t-2 border-gray-700 mb-6" />
      </div>

      <div className="flex flex-col md:flex-row w-full max-w-4xl">
        {/* Form Login */}
        <div className="flex-1 px-4">
          <h4 className="text-center mb-4 text-xl font-semibold">Login</h4>
          <form onSubmit={handleLoginSubmit}>
            <div className="mb-4">
              <input
                type="username"
                name="username"
                className="w-full px-4 py-2 border rounded border-gray-300"
                placeholder="Enter email"
                value={loginData.username}
                onChange={handleLoginChange}
                required
              />
            </div>
            <div className="relative mb-4">
              <input
                type="password"
                name="password"
                className="w-full px-4 py-2 border rounded border-gray-300"
                placeholder="Password"
                value={loginData.password}
                onChange={handleLoginChange}
                required
              />
            </div>
            <div className="mb-4 text-center">
              <a href="/forgot-password" className="text-blue-600 hover:underline">
                Forgot Password?
              </a>
            </div>
            <div className="text-center">
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Login
              </button>
            </div>
          </form>
        </div>

        {/* Form Register */}
        <div className="flex-1 px-4 mt-8 md:mt-0">
          <h4 className="text-center mb-4 text-xl font-semibold">Register</h4>
          <form onSubmit={handleRegisterSubmit}>
            <div className="mb-4">
              <input
                type="text"
                name="firstName"
                className="w-full px-4 py-2 border rounded border-gray-300"
                placeholder="First Name"
                value={registerData.firstName}
                onChange={handleRegisterChange}
                required
              />
            </div>
            <div className="mb-4">
              <input
                type="text"
                name="lastName"
                className="w-full px-4 py-2 border rounded border-gray-300"
                placeholder="Last Name"
                value={registerData.lastName}
                onChange={handleRegisterChange}
                required
              />
            </div>
            <div className="mb-4">
              <input
                type="email"
                name="email"
                className="w-full px-4 py-2 border rounded border-gray-300"
                placeholder="Email"
                value={registerData.email}
                onChange={handleRegisterChange}
                required
              />
            </div>
            <div className="mb-4">
              <input
                type="password"
                name="password"
                className="w-full px-4 py-2 border rounded border-gray-300"
                placeholder="Password"
                value={registerData.password}
                onChange={handleRegisterChange}
                required
              />
            </div>
            <div className="mb-4">
              <input
                type="password"
                name="confirmPassword"
                className="w-full px-4 py-2 border rounded border-gray-300"
                placeholder="Confirm Password"
                value={registerData.confirmPassword}
                onChange={handleRegisterChange}
                required
              />
            </div>
            <div className="text-center">
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Register
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
