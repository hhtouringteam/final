// src/context/WishlistContext.js
import React, { createContext, useContext, useState, useEffect } from 'react'
import { toast } from 'react-toastify'

// Tạo context cho wishlist
const WishlistContext = createContext()

// Hook để dễ dàng truy cập wishlist
export const useWishlist = () => {
  return useContext(WishlistContext)
}

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState(() => {
    // Lấy dữ liệu từ localStorage khi khởi tạo
    const savedWishlist = localStorage.getItem('wishlist')
    return savedWishlist ? JSON.parse(savedWishlist) : []
  })

  // Cập nhật localStorage khi wishlist thay đổi
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist))
  }, [wishlist])

  // Hàm thêm sản phẩm vào wishlist
  const addToWishlist = product => {
    setWishlist(prevWishlist => {
      // Kiểm tra sản phẩm đã tồn tại trong wishlist chưa bằng _id
      if (prevWishlist.find(item => item._id === product._id)) {
        toast.warn(`${product.name} đã nằm trong wishlist của bạn!`)
        return prevWishlist
      }
      toast.success(`${product.name} đã được thêm vào wishlist!`)
      return [...prevWishlist, product]
    })
  }

  // Tính tổng số lượng sản phẩm trong wishlist
  const totalItemsInWishlist = wishlist.length

  // Hàm xoá sản phẩm khỏi wishlist
  const removeFromWishlist = id => {
    setWishlist(prevWishlist => prevWishlist.filter(item => item._id !== id))
    toast.info('Sản phẩm đã được xoá khỏi wishlist.')
  }

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, totalItemsInWishlist }}>
      {children}
    </WishlistContext.Provider>
  )
}
