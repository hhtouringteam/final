// src/context/AuthContext.js

import React, { createContext, useState, useEffect } from 'react'
import { jwtDecode } from 'jwt-decode'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null) // Giu thong tin cua User
  const [loading, setLoading] = useState(true)

  // Hàm đăng nhập
  const login = token => {
    try {
      const decoded = jwtDecode(token) // Giải mã token
      console.log('decoded  ---------', decoded)
      const userData = {
        userId: decoded._id,
        role: decoded.role,
        username: decoded.username,
        email: decoded.email,
        avatar: decoded.avatar,
        token, // Lưu token vào userData để sử dụng sau
      }
      setUser(userData)
      localStorage.setItem('authToken', token) // Lưu token vào localStorage
      localStorage.setItem('user', JSON.stringify(userData)) // Lưu thông tin người dùng vào localStorage
    } catch (error) {
      console.error('Token không hợp lệ', error)
    }
  }

  // Hàm đăng xuất
  const logout = () => {
    setUser(null)
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
  }

  // Kiểm tra token khi ứng dụng khởi động
  useEffect(() => {
    const token = localStorage.getItem('authToken')
    if (token) {
      try {
        const decoded = jwtDecode(token)
        if (decoded.exp * 1000 > Date.now()) {
          const userData = {
            userId: decoded._id,
            role: decoded.role,
            username: decoded.username,
            email: decoded.email,
            avatar: decoded.avatar,
            token,
          }
          setUser(userData)
        } else {
          console.log('Token đã hết hạn')
          localStorage.removeItem('authToken')
          localStorage.removeItem('user')
        }
      } catch (error) {
        console.error('Lỗi giải mã token:', error)
        localStorage.removeItem('authToken')
        localStorage.removeItem('user')
      }
    }
    setLoading(false)
  }, [])

  return <AuthContext.Provider value={{ user, login, logout, loading }}>{children}</AuthContext.Provider>
}
