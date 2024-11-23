import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { AuthContext } from '../../context/AuthContext' // Import UserContext
import { GoogleLogin, useGoogleLogin } from '@react-oauth/google'
export default function Login() {
 
  const [loginData, setLoginData] = useState({
    username: '',
    password: '',
  })

 
  const [registerData, setRegisterData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const navigate = useNavigate()
  const { login } = useContext(AuthContext)


  const handleChange = (setState, e) => {
    setState(prevState => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }))
  }


  const handleFetch = async (url, method, body) => {
    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const data = await response.json()
    if (!response.ok) {
      toast.error(data.error || 'Có lỗi xảy ra, vui lòng thử lại.')
      throw new Error(data.error || 'Request failed')
    }
    return data
  }

 
  const processLogin = (data, navigate) => {
    localStorage.setItem('token', data.token)
    login(data.token)

    toast.success('Đăng nhập thành công!')

    if (data.user.role === 'admin') {
      window.location.href = 'http://localhost:3000/admin'
    } else {
      navigate('/')
    }
  }

 
  const handleLoginSubmit = async e => {
    e.preventDefault()
    try {
      const data = await handleFetch('http://localhost:5000/api/users/auth/login', 'POST', {
        username: loginData.username,
        password: loginData.password,
      })
      processLogin(data, navigate)
    } catch (error) {
      console.error('Lỗi đăng nhập:', error)
    }
  }
  const handleRegisterSubmit = async e => {
    e.preventDefault()
    if (registerData.password !== registerData.confirmPassword) {
      toast.error('Confirmation password does not match')
      return
    }
    const username = `${registerData.firstName}${registerData.lastName}`.replace(/\s+/g, '')
    try {
      await handleFetch('http://localhost:5000/api/users/auth/register', 'POST', {
        username,
        email: registerData.email,
        password: registerData.password,
      })
      toast.success('Registration successful!')
      const data = await handleFetch('http://localhost:5000/api/users/auth/login', 'POST', {
        username,
        password: registerData.password,
      })
      processLogin(data, navigate)
    } catch (error) {
      console.error(' Error during registration:', error)
    }
  }


  const handleLoginChange = e => handleChange(setLoginData, e)
  const handleRegisterChange = e => handleChange(setRegisterData, e)

  // const handleFacebookLogin = () => {
  //   console.log('Facebook login clicked')
  // }

  const handleGoogleLoginSuccess = async response => {
    try {
 
      const res = await fetch('http://localhost:5000/api/users/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: response.credential, 
        }),
      })

      const data = await res.json()
      console.log('Response from backend:', data) 
      if (res.ok) {
        login(data.token)
        toast.success('Google login successful!')
        navigate('/')
      } else {
        toast.error('Google login failed')
      }
    } catch (error) {
      console.error('Google login error:', error)
      toast.error('An error occurred during Google login.')
    }
  }

  const handleGoogleLoginFailure = error => {
    console.error('Google login error:', error)
    toast.error('Đăng nhập bằng Google thất bại!')
  }

  // const googleLogin = useGoogleLogin({
  //   onSuccess: handleGoogleLoginSuccess,
  //   onError: handleGoogleLoginFailure,
  //   flow: 'auth-code',
  // })

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="text-center">
        <h3 className="mb-4 text-2xl font-semibold">LOGIN WITH</h3>
        <div className="flex justify-center mb-6">
          {/* <button className="bg-blue-600 text-white px-4 py-2 rounded mr-2" onClick={handleFacebookLogin}>
            Facebook
          </button> */}
          {/* <button className="bg-red-600 text-white px-4 py-2 rounded flex items-center" onClick={googleLogin}>
            Google+
          </button> */}

          <div className="">
            <GoogleLogin onSuccess={handleGoogleLoginSuccess} onError={handleGoogleLoginFailure} />
          </div>
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
