// src/context/UserContext.js

import React, { createContext, useState, useEffect } from 'react'

// Tạo Context
export const UserContext = createContext()

// Tạo Provider
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null)

  // Kiểm tra localStorage khi ứng dụng khởi động
    useEffect(() => {
      const storedUser = localStorage.getItem('user')
      if (storedUser) {
        setUser(JSON.parse(storedUser))
      }
      console.log(storedUser)
    }, [])

  // Hàm đăng nhập
  const login = userData => {
    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  // Hàm đăng xuất
  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
    localStorage.removeItem('token')
  }

  return <UserContext.Provider value={{ user, setUser, login, logout }}>{children}</UserContext.Provider>
}
