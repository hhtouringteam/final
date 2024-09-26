import React, { useState } from 'react'
import Header from '../components/common/Header'
import Sidebar from '../components/common/Sidebar'
import Footer from '../components/common/Footer'
import { Outlet } from 'react-router-dom'

function AdminLayout() {
  const [isSidebarVisible, setIsSidebarVisible] = useState(true)

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible)
  }

  return (
    <div className="flex">
      {/* Header */}
      <Header toggleSidebar={toggleSidebar} isSidebarVisible={isSidebarVisible} />

      {/* Sidebar */}
      <Sidebar isSidebarVisible={isSidebarVisible} />

      {/* Main content */}
      <div
        className={`flex-grow p-3 bg-gray-900 transition-margin duration-300 ${
          isSidebarVisible ? 'ml-64' : 'ml-0'
        } mt-16 bg-gray-100 min-h-screen overflow-x-hidden`}
      >
        <div className="container mx-auto">
          {/* Sử dụng Outlet để hiển thị các trang con */}
       
          <Outlet />
        </div>
      </div>

      {/* Footer */}
      <Footer isSidebarVisible={isSidebarVisible} />
    </div>
  )
}

export default AdminLayout
