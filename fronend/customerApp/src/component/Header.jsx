// src/components/Header.js

import React, { useContext } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { AuthContext } from '../context/AuthContext'

export default function Header() {
  const { cart } = useCart() // Lấy giỏ hàng từ CartContext
  const { totalItemsInCart } = useCart() // Tính tổng số lượng sản phẩm trong giỏ hàng
  const { user } = useContext(AuthContext) // Lấy trạng thái người dùng từ UserContext
  console.log(user)
  return (
    <header className="bg-secondary">
      {/* Phần Welcome và các liên kết ở trên cùng */}
      <div className="container mx-auto py-1 flex justify-between items-center border-b-2 p-10 bg-slate-500">
        <div>WELCOME TO PCSTAR STORE</div>
        <div className="flex items-center">
          <NavLink to="!" className="text-dark no-underline mx-3">
            STORE LOCATOR
          </NavLink>
          <NavLink to="!" className="text-dark no-underline mx-3">
            FREE SHIPPING & RETURNS
          </NavLink>
          {/* Hiển thị ảnh đại diện hoặc nút MY ACCOUNT */}
          {!user ? (
            <NavLink to="/login" className="text-dark no-underline mx-3">
              MY ACCOUNT
            </NavLink>
          ) : (
            <div className="flex items-center gap-2">
              {user.avatar ? (
                <img src={user.avatar} alt="Avatar" className="w-8 h-8 rounded-full mr-2" />
              ) : (
                <div className="w-8 h-8 bg-gray-400 text-white rounded-full flex items-center justify-center">
                  {user.username && user.username[0].toUpperCase()}
                </div>
              )}
              <span className="text-dark mr-3">{user.username}</span>
            </div>
          )}
        </div>
      </div>

      {/* Phần chính giữa chứa tên website, tìm kiếm và giỏ hàng */}
      <div className="container mx-auto py-8 flex justify-between items-center p-10">
        <div className="text-4xl font-bold">HHtouringteam</div>
        <div className="flex items-center gap-4">
          <select className="border-2 rounded-full text-center px-4 py-1">
            <option value="all">all categories</option>
            {/* Thêm các tùy chọn khác nếu cần */}
          </select>
          <div className="relative">
            <input
              type="text"
              className="border-2 rounded-full pl-4 pr-12 py-1 w-full"
              placeholder="Search for product..."
            />
            <button className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <i className="fas fa-search" />
            </button>
          </div>
        </div>

        {/* Phần chứa các icon */}
        <div className="flex items-center gap-3">
          <NavLink to="!" className="text-dark no-underline text-2xl">
            <i className="fas fa-sync-alt" />
          </NavLink>

          {/* Icon người dùng để vào trang cá nhân */}
          {user ? (
            <NavLink to="/user" className="text-dark no-underline text-2xl">
              <i className="fas fa-user" />
            </NavLink>
          ) : (
            <NavLink to="/login" className="text-dark no-underline text-2xl">
              <i className="fas fa-user" />
            </NavLink>
          )}

          <NavLink to="/wishlist" className="text-dark no-underline text-2xl">
            <i className="fas fa-heart" />
          </NavLink>

          {/* Icon giỏ hàng */}
          <NavLink to="/cart" className="relative">
            <i className="fas fa-shopping-cart text-2xl" />
            <span className="absolute -top-1 -right-2 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
              {totalItemsInCart}
            </span>
          </NavLink>
        </div>
      </div>

      {/* Phần điều hướng chính */}
      <nav className="bg-blue-500 py-3 p-10">
        <div className="container mx-auto flex justify-between">
          <div className="flex gap-4">
            <NavLink className="text-white no-underline text-lg" to="/" activeClassName="font-bold">
              Home
            </NavLink>
            <NavLink className="text-white no-underline text-lg" to="!" activeClassName="font-bold">
              Support
            </NavLink>
            <NavLink className="text-white no-underline text-lg" to="/Tcsp" activeClassName="font-bold">
              Shop
            </NavLink>
            <NavLink className="text-white no-underline text-lg" to="/blog" activeClassName="font-bold">
              Blog
            </NavLink>
          </div>

          <NavLink to="!" className="inline-flex items-center text-center rounded gap-2 group text-lg px-5 text-white">
            <span className="qodef-m-text"> Weekly Discount </span>
            <span className="qodef-m-icon flex items-center justify-center relative w-3 h-3">
              <svg
                className="absolute group-hover:opacity-100 duration-300 transition-all opacity-0"
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 12 12"
              >
                <path
                  fill="white"
                  d="M4.293 1.293a1 1 0 011.414 0L9.707 5.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L7.586 6 4.293 2.707a1 1 0 010-1.414z"
                ></path>
              </svg>
              <svg
                className="absolute group-hover:opacity-0 duration-300 transition-all opacity-100"
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 12 12"
              >
                <path
                  fill="white"
                  d="M6 0a1 1 0 011 1v4h4a1 1 0 110 2H7v4a1 1 0 11-2 0V7H1a1 1 0 110-2h4V1a1 1 0 011-1z"
                ></path>
              </svg>
            </span>
          </NavLink>
        </div>
      </nav>
    </header>
  )
}
