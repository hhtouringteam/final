import React from 'react'
import { NavLink } from 'react-router-dom'
import { useCart } from '../page/product/context/CartContext'

export default function Header() {
  const { cart } = useCart(0) // Lấy giỏ hàng từ CartContext

  // Tính tổng số lượng sản phẩm trong giỏ hàng
  const { totalItemsInCart } = useCart()

  return (
    <header className="bg-secondary ">
      <div className="container mx-auto py-1 flex justify-between items-center border-b-2 p-10 bg-slate-500">
        <div className="">WELCOME TO PCSTAR STORE</div>
        <div className="flex">
          <NavLink to="!" className="text-dark no-underline mx-3">
            STORE LOCATOR
          </NavLink>
          <NavLink to="!" className="text-dark no-underline mx-3">
            FREE SHIPPING & RETURNS
          </NavLink>
          <NavLink to="Login" className="text-dark no-underline mx-3">
            MY ACCOUNT
          </NavLink>
        </div>
      </div>
      <div className="container mx-auto py-8 flex justify-between items-center p-10">
        <div className="text-4xl font-bold">HHtouringteam</div>
        <div className="flex items-center gap-4">
          <select className=" border-2 rounded-full text-center px-4 py-1">
            <option value="all">all categories</option>
            <option value="all">all categories</option>
            <option value="all">all categories</option>
          </select>
          <div className="relative ">
            <input
              type="text"
              className=" border-2 rounded-full pl-4 pr-12 py-1 w-full"
              placeholder="Search for product..."
            />
            <button className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <i className="fas fa-search" />
            </button>
          </div>
        </div>
        <div className="flex items-center gap-3 ">
          <NavLink to="!" className="text-dark no-underline text-2xl">
            <i className="fas fa-sync-alt" />
          </NavLink>
          <NavLink to="!" className="text-dark no-underline text-2xl">
            <i className="fas fa-user" />
          </NavLink>
          <NavLink to="/wishlist" className="text-dark no-underline text-2xl">
            <i className="fas fa-heart" />
          </NavLink>
          <NavLink to="/cart" className="relative">
            <i className="fas fa-shopping-cart text-2xl" />
            <span className="absolute -top-1 -right-2 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
              {totalItemsInCart}
            </span>
          </NavLink>
        </div>
      </div>
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

          <NavLink
            to="!"
            className="inline-flex items-center text-center rounded gap-2  group text-lg  px-5   text-white"
          >
            <span className="qodef-m-text "> Weekly Discount </span>
            <span className="qodef-m-icon flex items-center justify-center relative w-3 h-3  ">
              <svg
                className=" absolute  group-hover:opacity-100 duration-300 transition-all opacity-0   "
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
                className=" absolute group-hover:opacity-0 duration-300 transition-all opacity-100  "
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
