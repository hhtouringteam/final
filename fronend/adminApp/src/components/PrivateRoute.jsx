// PrivateRoute.js
import React, { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

const PrivateRoute = ({ children, adminOnly }) => {
  const { user } = useContext(AuthContext)

  if (!user) {
    return <Navigate to="/login" />
  }

  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/not-authorized" />
  }

  return children
}

export default PrivateRoute
