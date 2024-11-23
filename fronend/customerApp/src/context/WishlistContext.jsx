// src/context/WishlistContext.js
import React, { createContext, useContext, useState, useEffect } from 'react'
import { toast } from 'react-toastify'
const WishlistContext = createContext()
export const useWishlist = () => {
  return useContext(WishlistContext)
}

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState(() => {
    const savedWishlist = localStorage.getItem('wishlist')
    return savedWishlist ? JSON.parse(savedWishlist) : []
  })
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist))
  }, [wishlist])
  const addToWishlist = product => {
    setWishlist(prevWishlist => {
      if (prevWishlist.find(item => item._id === product._id)) {
        toast.warn(`${product.name} đã nằm trong wishlist của bạn!`)
        return prevWishlist
      }
      toast.success(`${product.name} đã được thêm vào wishlist!`)
      return [...prevWishlist, product]
    })
  }
  const totalItemsInWishlist = wishlist.length
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
