// src/components/PrivateRoute.js
import React, { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

function PrivateRoute({ children }) {
  const { user, loading } = useContext(AuthContext)

  if (loading) {
    return
  }
  if (!user) {
    return <Navigate to="/login" replace />
  }
  if (user.role !== 'admin') {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <h1 className="text-6xl font-bold text-red-500">404</h1>
        <h2 className="mt-4 text-2xl font-semibold text-gray-800">Page not found</h2>
        <p className="mt-2 text-lg text-gray-600">
        You do not have permission to access this page. Please contact the administrator or return to the homepage
        </p>
        <button
          onClick={() => {
            window.location.href = 'http://localhost:3001'
          }}
          className="mt-6 px-5 py-3 bg-blue-500 text-white text-lg font-medium rounded-lg hover:bg-blue-600 transition-colors duration-300"
        >
          Return to the homepage
        </button>
      </div>
    )
  }
  return children
}

export default PrivateRoute
