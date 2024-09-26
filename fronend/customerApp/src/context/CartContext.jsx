import React, { createContext, useContext, useState } from 'react'

const CartContext = createContext()

export function useCart() {
  return useContext(CartContext)
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState([])

  // const addToCart = (product) => {
  //     setCart((prevCart) => {
  //         const existingProduct = prevCart.find((item) => item.id === product.id);
  //         if (existingProduct) {
  //             return prevCart.map((item) =>
  //                 item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
  //             );
  //         } else {
  //             return [...prevCart, { ...product, quantity: 1 }];
  //         }
  //     });
  // };
  const addToCart = product => {
    setCart(prevCart => {
      const existingProduct = prevCart.find(item => item.id === product.id)
      const quantityToAdd = product.quantity || 1 // Đảm bảo quantity luôn có giá trị, mặc định là 1

      if (existingProduct) {
        return prevCart.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantityToAdd } : item,
        )
      } else {
        return [...prevCart, { ...product, quantity: quantityToAdd }]
      }
    })
  }

  const updateQuantity = (id, quantity) => {
    setCart(prevCart => prevCart.map(item => (item.id === id ? { ...item, quantity: quantity } : item)))
  }

  const removeFromCart = id => {
    setCart(prevCart => {
      const existingProduct = prevCart.find(item => item.id === id)
      if (existingProduct.quantity > 1) {
        return prevCart.map(item => (item.id === id ? { ...item, quantity: item.quantity - 1 } : item))
      } else {
        return prevCart.filter(item => item.id !== id)
      }
    })
  }

  const totalItemsInCart = cart.reduce((total, item) => total + item.quantity, 0)
  const totalPriceInCart = cart.reduce((total, item) => total + item.quantity * item.price, 0)

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQuantity, totalItemsInCart, totalPriceInCart }}
    >
      {children}
    </CartContext.Provider>
  )
}
