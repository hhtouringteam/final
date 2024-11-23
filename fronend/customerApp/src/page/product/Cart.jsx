// import React, { useContext } from 'react'
// import { useCart } from '../../context/CartContext'
// import { useNavigate } from 'react-router-dom'
// import { formatVND } from '../../utils/formatMoney'

// import { AuthContext } from '../../context/AuthContext'
// export default function Cart() {
//   const { cart, removeFromCart, updateQuantity, totalPriceInCart, totalItemsInCart } = useCart()
//   console.log("cart",cart)
//   const navigate = useNavigate()
//   const { user } = useContext(AuthContext)
//   console.log('user', user)

//   const handleIncreaseQuantity = id => {
//     const item = cart.find(item => item._id === id)
//     if (item) {
//       updateQuantity(id, item.quantity + 1)
//     }
//   }
//   const handleDecreaseQuantity = id => {
//     const item = cart.find(item => item._id === id)
//     if (item.quantity > 1) {
//       updateQuantity(id, item.quantity - 1)
//     } else {
//       removeFromCart(id)
//     }
//   }
//   const handleRemoveProduct = id => {
//     const item = cart.find(item => item._id === id)

//     if (item.quantity > 1) {
//       updateQuantity(id, item.quantity - 1)
//     } else {
//       removeFromCart(id)
//     }
//   }
//   const handleProceedToCheckout = () => {
//     if (totalItemsInCart !== 0) {
//       const cartItems = cart.map(item => ({
//         productId: item._id,
//         name: item.name,
//         price: item.price,
//         quantity: item.quantity,
//         imageUrl: item.imageUrl,
//       }))
//       const cartData = {
//         cartItems,
//         totalPrice: totalPriceInCart,
//         totalItems: totalItemsInCart,
//       }

//       localStorage.setItem('cartData', JSON.stringify(cartData))
//       navigate('/checkout')
//     } else {
//       alert('Your cart is empty! Please add items to proceed.')
//     }
//   }

//   return (
//     <div className="container mx-auto mt-4 px-5 p-10">
//       <div className="mb-5 ml-5">
//         <h1 className="text-2xl font-bold mb-4">Shopping Cart</h1>
//       </div>

//       <div className="overflow-x-auto bg-white shadow-md rounded-lg">
//         <table className="min-w-full bg-white">
//           <thead className="bg-gray-200">
//             <tr>
//               <th className="p-3"></th>
//               <th className="p-3 text-left">Product</th>
//               <th className="p-3 text-left">Price</th>
//               <th className="p-3 text-left">Quantity</th>
//               <th className="p-3 text-left">Subtotal</th>
//             </tr>
//           </thead>
//           <tbody>
//             {cart.map(item => (
//               <tr className="bg-gray-100 border-b" key={item._id}>
//                 <td className="p-3">
//                   <button
//                     className="bg-red-500 text-white px-3 py-1 rounded"
//                     onClick={() => handleRemoveProduct(item._id)}
//                   >
//                     X
//                   </button>
//                 </td>
//                 <td className="pt-4 flex items-center">
//                   <img src={item.imageUrl[0]} alt={item.name} className="w-20 h-20 mr-4 mb-4 rounded" />
//                   {item.name}
//                 </td>
//                 <td className="p-3">{formatVND(item.price)}</td>
//                 <td className="p-3">
//                   <div className="relative flex items-center">
//                     <input
//                       className="border border-gray-300 text-center w-12 h-12 rounded"
//                       type="number"
//                       value={item.quantity}
//                       readOnly
//                     />

//                     <div className="absolute right-20 top-0 flex flex-col justify-center h-full">
//                       <button
//                         className="w-4 h-4 flex items-center justify-center cursor-pointer transition-colors duration-300 ease-out"
//                         onClick={() => handleIncreaseQuantity(item._id)}
//                       >
//                         <svg
//                           xmlns="http://www.w3.org/2000/svg"
//                           fill="none"
//                           viewBox="0 0 24 24"
//                           stroke="currentColor"
//                           className="w-4 h-4 text-black hover:text-gray-700"
//                         >
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
//                         </svg>
//                       </button>
//                       <button
//                         className="w-4 h-4 flex items-center justify-center cursor-pointer transition-colors duration-300 ease-out mt-1"
//                         onClick={() => handleDecreaseQuantity(item._id)}
//                       >
//                         <svg
//                           xmlns="http://www.w3.org/2000/svg"
//                           fill="none"
//                           viewBox="0 0 24 24"
//                           stroke="currentColor"
//                           className="w-4 h-4 text-black hover:text-gray-700"
//                         >
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//                         </svg>
//                       </button>
//                     </div>
//                   </div>
//                 </td>
//                 <td className="p-3">{formatVND(item.price * item.quantity)}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       <div className="flex flex-wrap mt-4">
//         <div className="w-full md:w-1/3 p-2">
//           <input
//             type="text"
//             className="border border-gray-300 p-2 w-full rounded"
//             placeholder="Coupon code"
//             id="coupon-code"
//           />
//         </div>
//         <div className="w-full md:w-2/3 p-2 flex justify-between items-center">
//           <button className="bg-blue-500 text-white px-4 py-2 rounded">Apply Coupon</button>{' '}
//         </div>
//       </div>

//       <div className="mt-5 bg-gray-100 p-4 rounded-lg">
//         <h2 className="text-xl font-semibold mb-2">Cart totals</h2>
//         <div className="border-b pb-2">
//           <div className="flex">
//             <span className="mr-4">Total quantity</span>
//             <span>{totalItemsInCart} product</span>
//           </div>
//         </div>

//         <div className="border-b pb-2">
//           <div className="flex">
//             <span className="mr-4">Subtotal</span>
//             <span>{formatVND(totalPriceInCart)}</span>
//           </div>
//         </div>

//         <div className="mt-2">
//           <div className="flex">
//             <span className="mr-4 mb-4">Total</span>
//             <span>{formatVND(totalPriceInCart)}</span>
//           </div>
//         </div>

//         <button
//           onClick={handleProceedToCheckout}
//           className="bg-green-500 hover:bg-green-600 text-white py-2 px-8 rounded mt-4 block text-center"
//         >
//           Proceed to Checkout
//         </button>
//       </div>
//     </div>
//   )
// }
// src/components/Cart.js

import React, { useContext } from 'react'
import { useCart } from '../../context/CartContext'
import { useNavigate } from 'react-router-dom'
import { formatVND } from '../../utils/formatMoney'
import { AuthContext } from '../../context/AuthContext'
import { FaTrash, FaPlus, FaMinus } from 'react-icons/fa'

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, totalPriceInCart, totalItemsInCart } = useCart()
  const navigate = useNavigate()
  const { user } = useContext(AuthContext)

  const handleIncreaseQuantity = id => {
    const item = cart.find(item => item._id === id)
    if (item) {
      updateQuantity(id, item.quantity + 1)
    }
  }

  const handleDecreaseQuantity = id => {
    const item = cart.find(item => item._id === id)
    if (item.quantity > 1) {
      updateQuantity(id, item.quantity - 1)
    } else {
      removeFromCart(id)
    }
  }

  const handleRemoveProduct = id => {
    removeFromCart(id)
  }

  const handleProceedToCheckout = () => {
    if (totalItemsInCart !== 0) {
      const cartItems = cart.map(item => ({
        productId: item._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        imageUrl: item.imageUrl,
      }))
      const cartData = {
        cartItems,
        totalPrice: totalPriceInCart,
        totalItems: totalItemsInCart,
      }

      localStorage.setItem('cartData', JSON.stringify(cartData))
      navigate('/checkout')
    } else {
      alert('Your cart is empty! Please add items to proceed.')
    }
  }

  return (
    <div className="container mx-auto mt-8 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Shopping Cart</h1>

      {cart.length === 0 ? (
        <div className="text-center">
          <p className="text-xl">Your cart is currently empty.</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row">
          {/* Cart Items */}
          <div className="lg:w-3/4">
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <table className="min-w-full bg-white">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-3 px-5 text-left">Product</th>
                    <th className="py-3 px-5 text-left">Price</th>
                    <th className="py-3 px-5 text-left">Quantity</th>
                    <th className="py-3 px-5 text-left">Subtotal</th>
                    <th className="py-3 px-5 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map(item => (
                    <tr key={item._id} className="border-b hover:bg-gray-50">
                      {/* Product */}
                      <td className="py-4 px-5 flex items-center">
                        <img src={item.imageUrl[0]} alt={item.name} className="w-20 h-20 object-cover rounded mr-4" />
                        <span className="font-medium">{item.name}</span>
                      </td>

                      {/* Price */}
                      <td className="py-4 px-5">{formatVND(item.price)}</td>

                      {/* Quantity */}
                      <td className="py-4 px-5">
                        <div className="flex items-center">
                          <button
                            onClick={() => handleDecreaseQuantity(item._id)}
                            className="text-gray-700 hover:text-gray-900 focus:outline-none"
                          >
                            <FaMinus />
                          </button>
                          <input
                            type="text"
                            value={item.quantity}
                            readOnly
                            className="w-10 text-center mx-2 border border-gray-300 rounded"
                          />
                          <button
                            onClick={() => handleIncreaseQuantity(item._id)}
                            className="text-gray-700 hover:text-gray-900 focus:outline-none"
                          >
                            <FaPlus />
                          </button>
                        </div>
                      </td>

                      {/* Subtotal */}
                      <td className="py-4 px-5">{formatVND(item.price * item.quantity)}</td>

                      {/* Actions */}
                      <td className="py-4 px-5 text-center">
                        <button
                          onClick={() => handleRemoveProduct(item._id)}
                          className="text-red-500 hover:text-red-700 focus:outline-none"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Coupon Code */}
            <div className="mt-4 flex flex-col md:flex-row items-start md:items-center justify-between bg-white shadow-md rounded-lg p-4">
              <div className="mb-4 md:mb-0">
                <input
                  type="text"
                  className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter coupon code"
                  id="coupon-code"
                />
              </div>
              <button className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors">
                Apply Coupon
              </button>
            </div>
          </div>

          {/* Cart Totals */}
          <div className="lg:w-1/4 lg:ml-8 mt-8 lg:mt-0">
            <div className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-4">Cart Totals</h2>
              <div className="flex justify-between mb-2">
                <span>Total Quantity</span>
                <span>
                  {totalItemsInCart} {totalItemsInCart > 1 ? 'products' : 'product'}
                </span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Subtotal</span>
                <span>{formatVND(totalPriceInCart)}</span>
              </div>
              {/* Add more totals like tax, shipping if needed */}
              <div className="flex justify-between font-bold text-lg mt-4 border-t pt-4">
                <span>Total</span>
                <span>{formatVND(totalPriceInCart)}</span>
              </div>
              <button
                onClick={handleProceedToCheckout}
                className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition-colors mt-6"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
