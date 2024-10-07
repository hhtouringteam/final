// src/components/Header.js

import React, { useContext, useState, useEffect } from 'react'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { AuthContext } from '../context/AuthContext'
import Select from 'react-select'
import { toast } from 'react-toastify' // Nếu bạn sử dụng react-toastify

export default function Header() {
  const { totalItemsInCart } = useCart() // Tính tổng số lượng sản phẩm trong giỏ hàng
  const { totalItemsInWishlist } = useWishlist()
  const { user } = useContext(AuthContext) // Lấy trạng thái người dùng từ AuthContext
  const [searchQuery, setSearchQuery] = useState('') // State để lưu từ khóa tìm kiếm
  const [categories, setCategories] = useState([]) // State để lưu danh sách danh mục
  const navigate = useNavigate()
  const location = useLocation()

  // Fetch danh sách danh mục từ backend khi component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/admin/categories')
        const data = await response.json()
        if (response.ok) {
          // Chuyển đổi dữ liệu thành định dạng phù hợp với react-select
          const options = data.categories.map(category => ({
            value: category._id,
            label: category.name,
          }))
          // Thêm tùy chọn "All Categories" ở đầu danh sách
          setCategories([{ value: 'all', label: 'All Categories' }, ...options])
        } else {
          console.error('Error fetching categories:', data.message)
        }
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }

    fetchCategories()
  }, [])

  // Hàm xử lý khi người dùng chọn một danh mục
  const handleCategoryChange = selectedOption => {
    if (selectedOption.value === 'all') {
      // Nếu chọn "All Categories", điều hướng tới Tcsp không có bộ lọc
      navigate('/Tcsp')
    } else {
      // Nếu chọn một danh mục cụ thể, điều hướng tới Tcsp với tham số category
      const params = new URLSearchParams()
      params.append('category', selectedOption.value)
      navigate(`/Tcsp?${params.toString()}`)
    }
  }

  // Hàm xử lý khi tìm kiếm
  const handleSearch = async e => {
    e.preventDefault()

    if (searchQuery.trim()) {
      try {
        // Xây dựng query string với tham số name
        const params = new URLSearchParams()
        params.append('name', searchQuery.trim())

        // Điều hướng tới trang Tcsp với query string
        navigate(`/Tcsp?${params.toString()}`)
      } catch (error) {
        console.error('Error navigating to search results:', error)
      }
    } else {
      // Nếu tìm kiếm rỗng, điều hướng tới Tcsp không có bộ lọc
      navigate('/Tcsp')
    }
  }

  // Hàm xử lý khi nhấn nút "View All Products"
  const handleViewAll = () => {
    navigate('/Tcsp', { replace: true }) // Sử dụng replace để tránh tạo lịch sử điều hướng mới
  }

  return (
    <header className="bg-secondary">
      {/* Phần Welcome và các liên kết ở trên cùng */}
      <div className="container mx-auto py-1 flex justify-between items-center border-b-2 p-4 bg-slate-500">
        <div className="text-white font-semibold">WELCOME TO PCSTAR STORE</div>

        <div className="flex items-center">
          <NavLink to="/store-locator" className="text-white no-underline mx-3 ">
            STORE LOCATOR
          </NavLink>
          <NavLink to="/free-shipping-returns" className="text-white no-underline mx-3">
            FREE SHIPPING & RETURNS
          </NavLink>
          {/* Hiển thị ảnh đại diện hoặc nút MY ACCOUNT */}
          {!user ? (
            <NavLink to="/login" className="text-white no-underline mx-3">
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
              <span className="text-white mr-3">{user.username}</span>
            </div>
          )}
        </div>
      </div>

      {/* Phần chính giữa chứa tên website, tìm kiếm và giỏ hàng */}
      <div className="container mx-auto py-8 flex justify-between items-center p-10">
        <NavLink to="/" className="text-4xl font-bold text-black">
          HHtouringteam
        </NavLink>
        <div className="flex items-center gap-4 mr-80 ">
          <div className="w-64 rounded-full text-center px-4 py-1">
            <Select
              options={categories}
              onChange={handleCategoryChange}
              placeholder="Select Category"
              isSearchable
              classNamePrefix="react-select"
              styles={{
                control: provided => ({
                  ...provided,
                  borderColor: '#e5e7eb', // Tailwind gray-300
                  borderRadius: '9999px', // Tailwind full rounded
                  boxShadow: 'none',
                  '&:hover': {
                    borderColor: '#d1d5db', // Tailwind gray-300
                  },
                }),
                menu: provided => ({
                  ...provided,
                  zIndex: 9999,
                }),
              }}
            />
          </div>
          <div className="relative">
            <form onSubmit={handleSearch} className="flex">
              <input
                type="text"
                className="border-2 rounded-full pl-4 pr-12 py-1 w-80"
                placeholder="Search for product..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)} // Cập nhật giá trị từ khóa tìm kiếm
              />
              <button className="absolute inset-y-0 right-0 pr-3 flex items-center" type="submit">
                <i className="fas fa-search text-gray-600" />
              </button>
            </form>
          </div>
          {/* Nút "View All Products" */}
          {location.pathname === '/Tcsp' && location.search && (
            <button
              onClick={handleViewAll}
              className="ml-4 bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition-colors"
            >
              View All Products
            </button>
          )}
        </div>

        {/* Phần chứa các icon */}
      </div>

      {/* Phần điều hướng chính */}
      <nav className="bg-blue-500 py-3 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex gap-4">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `text-white no-underline text-lg px-3 py-2 rounded ${isActive ? 'bg-blue-700' : 'hover:bg-blue-600'}`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/support"
              className={({ isActive }) =>
                `text-white no-underline text-lg px-3 py-2 rounded ${isActive ? 'bg-blue-700' : 'hover:bg-blue-600'}`
              }
            >
              Support
            </NavLink>
            <NavLink
              to="/Tcsp"
              className={({ isActive }) =>
                `text-white no-underline text-lg px-3 py-2 rounded ${isActive ? 'bg-blue-700' : 'hover:bg-blue-600'}`
              }
            >
              Shop
            </NavLink>
            <NavLink
              to="/blog"
              className={({ isActive }) =>
                `text-white no-underline text-lg px-3 py-2 rounded ${isActive ? 'bg-blue-700' : 'hover:bg-blue-600'}`
              }
            >
              Blog
            </NavLink>
          </div>
          <div className="flex items-center gap-4 mr-10">
            {user ? (
              <NavLink to="/profile" className="text-white no-underline text-2xl hover:text-gray-300">
                <i className="fas fa-user" />
              </NavLink>
            ) : (
              <NavLink to="/login" className="text-black no-underline text-2xl hover:text-gray-300">
                <i className="fas fa-user" />
              </NavLink>
            )}

            <NavLink to="/wishlist" className="relative">
              <i className="fas fa-heart text-white text-2xl hover:text-gray-300" />
              <span className="absolute -top-1 -right-2 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
                {totalItemsInWishlist}
              </span>
            </NavLink>

            <NavLink to="/cart" className="relative">
              <i className="fas fa-shopping-cart text-white text-2xl hover:text-gray-300" />
              <span className="absolute -top-1 -right-2 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
                {totalItemsInCart}
              </span>
            </NavLink>
          </div>
          {/* <NavLink
            to="/weekly-discount"
            className="inline-flex items-center text-center rounded gap-2 group text-lg px-5 text-white hover:bg-blue-600"
          >
            <span className="transition-opacity duration-300 group-hover:opacity-100">Weekly Discount</span>
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
          </NavLink> */}
        </div>
      </nav>
    </header>
  )
}
