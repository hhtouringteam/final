import React, { useState, useEffect } from 'react'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import { useCart } from '../../context/CartContext'
import { useWishlist } from '../../context/WishlistContext' // Import useWishlist
import { useParams } from 'react-router-dom'
import { NavLink } from 'react-router-dom'
import apiServer from '../../services/apiServer'

export default function ProductDetail() {
  const { id } = useParams()

  const [products, setProduct] = useState(null)

  const { addToWishlist } = useWishlist()
  const { addToCart } = useCart()

  const [currentIndex, setCurrentIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await apiServer.getProductById(id)
        setProduct(data)
        console.log(data)
      } catch (error) {
        console.error('Error fetching product:', error)
      }
    }

    if (id) {
      fetchProduct()
    }
  }, [id])
  if (!products || products.length === 0) {
    return <div>Product not found!</div>
  }

  const images = Array.isArray(products.image) ? products.image : [products.image]

  const goToPreviousImage = () => {
    const newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1
    setCurrentIndex(newIndex)
  }

  const goToNextImage = () => {
    const newIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1
    setCurrentIndex(newIndex)
  }

  const increaseQuantity = () => {
    setQuantity(prevQuantity => prevQuantity + 1)
  }

  const decreaseQuantity = () => {
    setQuantity(prevQuantity => (prevQuantity > 1 ? prevQuantity - 1 : 1))
  }

  const handleAddToCart = () => {
    const productToAdd = {
      name: products.displayName,
      image: images[currentIndex],
      price: products.price,
      quantity: quantity,
    }

    addToCart(productToAdd)
  }

  const handleWishlist = () => {
    const productToAdd = {
      name: products.displayName,
      image: images[currentIndex],
      price: products.price,
    }
    console.log(products.displayName)

    addToWishlist(productToAdd)
    setIsWishlisted(true)
  }

  return (
    <div className="container mx-auto mt-4 p-10 flex px-20">
      {/* Phần bên trái cho hình ảnh sản phẩm */}
      <div className="w-1/2 flex flex-col items-center">
        <img
          src={images[currentIndex]}
          alt="Main product"
          className="w-full h-auto rounded-lg border border-gray-300"
        />

        <div className="flex items-center mt-4">
          <button
            onClick={goToPreviousImage}
            className="w-6 h-6 flex items-center justify-center cursor-pointer transition-colors duration-300 ease-out mr-5"
          >
            <ArrowBackIosIcon className="text-black hover:text-gray-700" />
          </button>

          <div className="flex justify-center space-x-2 px-4">
            {images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Thumbnail ${index + 1}`}
                className={`w-24 h-24 cursor-pointer rounded-lg border ${
                  index === currentIndex ? 'border-blue-500' : 'border-gray-300'
                }`}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>

          <button
            onClick={goToNextImage}
            className="w-6 h-6 flex items-center justify-center cursor-pointer transition-colors duration-300 ease-out ml-5"
          >
            <ArrowForwardIosIcon className="text-black hover:text-gray-700" />
          </button>
        </div>
      </div>

      {/* Phần bên phải cho thông tin sản phẩm */}
      <div className="w-1/2 pl-10">
        <h2 className="text-3xl font-semibold">{products.displayName}</h2>

        <p className="text-xl text-gray-700 mt-2">${products.price}</p>
        <p className="text-gray-600 mt-4">{products.description}</p>

        {/* Phần số lượng sản phẩm */}
        <div className="mt-6">
          <div className="relative flex items-center">
            <input
              className="border border-gray-300 text-center w-12 h-12 rounded"
              type="number"
              value={quantity}
              readOnly
            />
            <div className="absolute left-14  top-0 flex flex-col justify-center h-full">
              <button
                className="w-4 h-4 items-center justify-center cursor-pointer transition-colors duration-300 ease-out"
                onClick={increaseQuantity}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-4 h-4 text-black hover:text-gray-700"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              </button>
              <button
                className="w-4 h-4 items-center justify-center cursor-pointer transition-colors duration-300 ease-out mt-1"
                onClick={decreaseQuantity}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-4 h-4 text-black hover:text-gray-700"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <button className="w-40 mt-4 bg-blue-500 text-white py-2 rounded hover:bg-blue-600" onClick={handleAddToCart}>
          ADD TO CART
        </button>
        <div className="mt-4">
          {isWishlisted ? (
            <NavLink to="/wishlist" className="text-dark no-underline">
              Browse wishlist
            </NavLink>
          ) : (
            <button className="text-dark no-underline" onClick={handleWishlist}>
              <i className="fas fa-heart" />
              <span className="ml-3">Add to wishlist</span>
            </button>
          )}
        </div>
        <p className="text-gray-600 mt-4">SKU: 10</p>
        <p className="text-gray-600">Category: Gadgets</p>
        <p className="text-gray-600">Tags: USB, Wireless</p>

        <div className="mt-6 p-4 bg-blue-100 border border-blue-500 text-blue-800 rounded">
          <i className="fas fa-info-circle"></i> Need help? Call Us +001 234 56 789
          <div>Monday - Friday 09:00 - 21:00</div>
        </div>
      </div>
    </div>
  )
}

// import React, { useEffect, useState } from 'react'
// import { useParams } from 'react-router-dom' // Import useParams để lấy slug

// export default function Text() {
//   const { id } = useParams()
//   const [product, setProduct] = useState(null)

//   useEffect(() => {
//     const fetchProduct = async () => {
//       try {
//         const response = await fetch(`http://localhost:5000/api/customer/products/${id}`)
//         const data = await response.json()
//         setProduct(data)
//       } catch (error) {
//         console.error('Error fetching product:', error)
//       }
//     }

//     fetchProduct()
//   }, [id])

//   if (!product) {
//     return <div>Product not found!</div>
//   }

//   return (
//     <div>
//       <h1>{product.name}</h1>
//       <p>{product.description}</p>
//       <p>{product.price}</p>
//       <img src={product.image} alt={product.name} />
//     </div>
//   )
// }
