import React, { createContext, useState, useEffect } from 'react'
import { jwtDecode } from 'jwt-decode'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const login = token => {
    try {
      const decoded = jwtDecode(token) 
      const currentTime = Date.now() / 1000 
      if (decoded.exp < currentTime) {
        console.error('Token has expired')
        return
      }
      const userData = {
        userId: decoded._id,
        role: decoded.role,
        username: decoded.username,
        email: decoded.email,
        avatar: decoded.avatar,
        token, 
      }
      setUser(userData)
      localStorage.setItem('authToken', token) 
      localStorage.setItem('user', JSON.stringify(userData)) 
    } catch (error) {
      console.error('Token is invalid', error)
    }
  }
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
