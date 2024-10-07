// src/components/ProductDetail/ProductDetail.js
import React, { useState, useEffect } from 'react'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import { useCart } from '../../context/CartContext'
import { useWishlist } from '../../context/WishlistContext'
import { useParams, NavLink } from 'react-router-dom'
import apiServer from '../../services/apiServer'

export default function ProductDetail() {
  const { id } = useParams()
  const [product, setProduct] = useState(null) 
  const { addToWishlist, wishlist } = useWishlist()
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

  useEffect(() => {
    if (product && wishlist.find(item => item._id === product._id)) {
      setIsWishlisted(true)
    } else {
      setIsWishlisted(false)
    }
  }, [wishlist, product])

  if (!product) {
    return <div>Loading...</div>
  }

  const images = Array.isArray(product.imageUrl) ? product.imageUrl : [product.imageUrl]

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
      _id: product._id,
      name: product.name,
      imageUrl: images[currentIndex],
      price: product.price,
      quantity: quantity,
    }

    addToCart(productToAdd)
  }

  const handleWishlist = () => {
    const productToAdd = {
      _id: product._id,
      name: product.name,
      imageUrl: images[currentIndex],
      price: product.price,
      inStock: product.inStock,
    }

    addToWishlist(productToAdd)
    setIsWishlisted(true)
  }

  return (
    <div className="container mx-auto mt-4 p-10 flex px-20">
      <div className="w-1/2 flex flex-col items-center">
        <img src={images[currentIndex]} alt="Main product" className="w-96 h-96 rounded-lg border border-gray-300" />

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

      <div className="w-1/2 pl-10">
        <h2 className="text-3xl font-semibold">{product.name}</h2>

        <p className="text-xl text-gray-700 mt-2">
          {' '}
          {product.price.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
        </p>
        <p className="text-gray-600 mt-4">{product.description}</p>

        <div className="mt-6">
          <div className="relative flex items-center">
            <input
              className="border border-gray-300 text-center w-12 h-12 rounded"
              type="number"
              value={quantity}
              readOnly
            />
            <div className="absolute left-14 top-0 flex flex-col justify-center h-full">
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
            <button className="text-dark no-underline flex items-center" onClick={handleWishlist}>
              <i className="fas fa-heart" />
              <span className="ml-3">Add to wishlist</span>
            </button>
          )}
        </div>
        <p className="text-gray-600 mt-4">SKU: {product.stock || 'N/A'}</p>
        <p className="text-gray-600">Category: {product.categoryId.name || 'N/A'}</p>
        <p className="text-gray-600">Tags: {product.vehicleId.name || 'N/A'}</p>

        <div className="mt-6 p-4 bg-blue-100 border border-blue-500 w-80 text-blue-800">
          <i className="fas fa-info-circle"></i> Need help? Call VN +84 337 325 729
          <div className="text-center">Monday - Friday 09:00 - 21:00</div>
        </div>
      </div>
    </div>
  )
}
