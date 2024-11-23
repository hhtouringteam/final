// src/context/AuthContext.js

import React, { createContext, useState, useEffect } from 'react'
import { jwtDecode } from 'jwt-decode'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null) 
  const [loading, setLoading] = useState(true)

  const login = token => {
    try {
      const decoded = jwtDecode(token) 
      console.log('token', decoded)
      const userData = {
        userId: decoded.userId || decoded._id,
        role: decoded.role,
        username: decoded.username,
        email: decoded.email,
        avatar: decoded.avatar,
        token, 
      }
      console.log('  console.log(userData)', userData)
      setUser(userData)
      localStorage.setItem('authToken', token)
      localStorage.setItem('user', JSON.stringify(userData)) 
    } catch (error) {
      console.error('Token không hợp lệ', error)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
  }

  useEffect(() => {
    const token = localStorage.getItem('authToken')
    if (token) {
      try {
        const decoded = jwtDecode(token)
        if (decoded.exp * 1000 > Date.now()) {
          const userData = {
            userId: decoded.userId || decoded._id,
            role: decoded.role,
            username: decoded.username,
            email: decoded.email,
            avatar: decoded.avatar,
            token,
          }
          setUser(userData)
        } else {
          console.log('Token has expired')
          localStorage.removeItem('authToken')
          localStorage.removeItem('user')
        }
      } catch (error) {
        console.error('Token decoding error:', error)
        localStorage.removeItem('authToken')
        localStorage.removeItem('user')
      }
    }
    setLoading(false)
  }, [])

  return <AuthContext.Provider value={{ user, login, logout, loading }}>{children}</AuthContext.Provider>
}
