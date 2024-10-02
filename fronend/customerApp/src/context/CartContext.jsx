import React, { createContext, useContext, useState, useEffect } from 'react'

// Tạo context cho giỏ hàng
const CartContext = createContext()

// Hook để dễ dàng truy cập giỏ hàng
export function useCart() {
  return useContext(CartContext)
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    // Lấy dữ liệu từ localStorage khi khởi tạo
    const savedCart = localStorage.getItem('cart')
    return savedCart ? JSON.parse(savedCart) : []
  })
  // Mỗi khi giỏ hàng thay đổi, lưu vào localStorage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart))
  }, [cart])

  // Hàm thêm sản phẩm vào giỏ hàng
  const addToCart = product => {
    setCart(prevCart => {
      const existingProduct = prevCart.find(item => item._id === product._id)

      // Kiểm tra giá trị price và quantity của sản phẩm
      const validPrice = typeof product.price === 'string' ? parseFloat(product.price.replace('$', '')) : product.price

      const quantityToAdd = product.quantity || 1

      if (existingProduct) {
        console.log('Product already in cart, updating quantity')
        return prevCart.map(item =>
          item._id === product._id ? { ...item, quantity: item.quantity + quantityToAdd } : item,
        )
      } else {
        console.log('Product not in cart, adding new product')
        return [...prevCart, { ...product, price: validPrice, quantity: quantityToAdd }]
      }
    })
  }

  // Hàm cập nhật số lượng sản phẩm
  const updateQuantity = (id, quantity) => {
    if (quantity < 1) return // Không cho phép số lượng nhỏ hơn 1
    setCart(prevCart => prevCart.map(item => (item._id === id ? { ...item, quantity: quantity } : item)))
  }

  // Hàm xoá sản phẩm khỏi giỏ hàng
  const removeFromCart = id => {
    setCart(prevCart => prevCart.filter(item => item._id !== id))
  }
  const clearCart = () => {
    setCart([])
  }
  // Tính tổng số lượng sản phẩm trong giỏ
  const totalItemsInCart = cart.reduce((total, item) => total + item.quantity, 0)

  // Tính tổng giá trị của giỏ hàng
  const totalPriceInCart = cart.reduce((total, item) => total + item.quantity * item.price, 0)

  // Lưu giỏ hàng vào localStorage khi giỏ hàng thay đổi
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart))
  }, [cart])

  return (
    <CartContext.Provider
      value={{ cart, addToCart, clearCart, updateQuantity, removeFromCart, totalItemsInCart, totalPriceInCart }}
    >
      {children}
    </CartContext.Provider>
  )
}
