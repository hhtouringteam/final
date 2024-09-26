import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useWishlist } from '../../context/WishlistContext'
export default function Wishlist() {
  const { wishlist, removeFromWishlist } = useWishlist() // Lấy wishlist từ context

  return (
    <div className="container mx-auto mt-10 p-4">
      <h1 className="text-4xl font-bold mb-6">My Wishlist</h1>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {wishlist.length > 0 ? (
          <table className="min-w-full bg-white">
            <tbody>
              {wishlist.map(item => (
                <tr className="border-b" key={item.id}>
                  <td className="p-4">
                    <button className="text-red-500" onClick={() => removeFromWishlist(item.id)}>
                      <i className="fas fa-times" />
                    </button>
                  </td>
                  <td className="p-4">
                    <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg" />
                  </td>
                  <td className="p-4">
                    <NavLink
                      to={`/product-detail/${item.id}`}
                      className="text-xl font-semibold text-black no-underline"
                    >
                      {item.name}
                    </NavLink>
                  </td>
                  <td className="p-4 text-xl font-semibold">{item.price}</td>
                  <td className="p-4 text-gray-600">{item.inStock ? 'In stock' : 'Out of stock'}</td>
                  <td className="p-4">
                    <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 flex items-center">
                      <span className="mr-2">ADD TO CART</span>
                      <i className="fas fa-shopping-cart"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center text-gray-600 mt-4">Your wishlist is empty.</p>
        )}
      </div>
    </div>
  )
}
