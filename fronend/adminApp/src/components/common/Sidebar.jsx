// components/common/Sidebar.jsx
import React from 'react'
import { NavLink } from 'react-router-dom'
import { Home, ColorLens, TextFields, Widgets, Notifications, ListAlt } from '@mui/icons-material'

function Sidebar({ isSidebarVisible }) {
  const navItems = [
    { name: 'Dashboard', icon: <Home />, path: 'dashboard' },
    { name: 'Create New Product', icon: <ColorLens />, path: '/create' },
    { name: 'Related Information', icon: <TextFields />, path: '/createrelatedinformation' },
    { name: 'ProductsList', icon: <Widgets />, path: '/list' },
    { name: 'Notifications', icon: <Notifications />, path: '/notifications' },
    { name: 'Widgets', icon: <ListAlt />, path: '/widgets' },
  ]

  return (
    <div
      className={`w-64 h-screen bg-gray-900 text-white fixed shadow-lg border-r border-gray-700 transform transition-transform duration-300 ease-in-out ${
        isSidebarVisible ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* Logo và Tiêu đề */}
      <div className="p-4 flex items-center justify-center border-b border-gray-700">
        <span className="text-xl font-semibold pt-1">HHTOURINGTEAM</span>
      </div>
      {/* Mục điều hướng */}
      <nav className="mt-4">
        <ul>
          {navItems.map((item, index) => (
            <li key={index} className="border-b border-gray-700">
              <NavLink
                to={item.path}
                className="p-4 hover:bg-gray-800 flex items-center"
                activeClassName="bg-gray-800"
                exact
              >
                <span className="mr-3">{item.icon}</span>
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}

export default Sidebar
