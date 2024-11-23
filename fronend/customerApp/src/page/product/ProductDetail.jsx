// src/components/ProductDetail/ProductDetail.js

import React, { useState, useEffect } from 'react'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import { useCart } from '../../context/CartContext'
import { useWishlist } from '../../context/WishlistContext'
import { useParams, NavLink } from 'react-router-dom'
import apiServer from '../../services/apiServer'
import { formatVND } from '../../utils/formatMoney'
import CompatibleVehicles from '../../componernProduct/CompatibleVehicles'
import Description from '../../componernProduct/Description'
import Specification from '../../componernProduct/Specification'
import Reviews from '../../componernProduct/Reviews'

export default function ProductDetail() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const { addToWishlist, wishlist } = useWishlist()
  const { addToCart } = useCart()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [reviews, setReviews] = useState([])
  const [compatibleVehicles, setCompatibleVehicles] = useState([])
  const [relatedProducts, setRelatedProducts] = useState([])
  const [allProducts, setAllProducts] = useState([])
  // State để quản lý tab hiện tại
  const [activeTab, setActiveTab] = useState('compatibleVehicles')

  // Lấy dữ liệu sản phẩm
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
    const fetchAllProducts = async () => {
      try {
        const data = await apiServer.getAllProducts()
        setAllProducts(data)
        console.log('All Products:', data)
      } catch (error) {
        console.error('Error fetching all products:', error)
      }
    }

    fetchAllProducts()
  }, [])

  useEffect(() => {
    if (product && allProducts.length > 0) {
      const filteredRelatedProducts = allProducts.filter(
        p => p.categoryId._id === product.categoryId._id && p._id !== product._id,
      )
      setRelatedProducts(filteredRelatedProducts)
      console.log('Filtered Related Products:', filteredRelatedProducts)
    }
  }, [product, allProducts])
  // Kiểm tra sản phẩm có trong wishlist không
  useEffect(() => {
    if (product && wishlist.find(item => item._id === product._id)) {
      setIsWishlisted(true)
    } else {
      setIsWishlisted(false)
    }
  }, [wishlist, product])

  // Lấy đánh giá và xe tương thích
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await apiServer.getProductReviews(id)
        setReviews(data)
      } catch (error) {
        console.error('Error fetching reviews:', error)
      }
    }
    const fetchCompatibleVehicles = async () => {
      try {
        const data = await apiServer.getCompatibleVehicles(id)
        setCompatibleVehicles(data)
        console.log('Compatible Vehicles:', data)
      } catch (error) {
        console.error('Error fetching compatible vehicles:', error)
      }
    }
    if (product && product.categoryId) {
      const fetchRelatedProducts = async () => {
        try {
          console.log('Category ID:', product.categoryId)
          const relatedData = await apiServer.getProductsByCategory(product.categoryId._id)
          console.log('Related Data:', relatedData)
          if (relatedData && Array.isArray(relatedData)) {
            const filteredRelatedProducts = relatedData.filter(p => p._id !== product._id)
            setRelatedProducts(filteredRelatedProducts)
          } else {
            console.error('No related products found or data format is incorrect.')
          }
        } catch (error) {
          console.error('Error fetching related products:', error)
        }
      }

      fetchRelatedProducts()
    }

    if (id) {
      fetchReviews()
      fetchCompatibleVehicles()
    }
  }, [id, product])

  if (!product) {
    return <div>Loading...</div>
  }

  const images = Array.isArray(product.imageUrl) ? product.imageUrl : [product.imageUrl]

  // Hàm xử lý chuyển ảnh
  const goToPreviousImage = () => {
    const newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1
    setCurrentIndex(newIndex)
  }

  const goToNextImage = () => {
    const newIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1
    setCurrentIndex(newIndex)
  }

  // Hàm xử lý số lượng
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
      imageUrl: images,
      price: product.price,
      quantity: quantity,
    }
    console.log('handleAddToCart', handleAddToCart)
    addToCart(productToAdd)
  }

  const handleWishlist = () => {
    const productToAdd = {
      _id: product._id,
      name: product.name,
      imageUrl: images,
      price: product.price,
      inStock: product.inStock,
    }

    addToWishlist(productToAdd)
    setIsWishlisted(true)
  }

  return (
    <div className="container mx-auto mt-4 p-10 flex flex-col px-20">
      {/* Hiển thị sản phẩm */}
      <div className="flex">
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

          <p className="text-xl text-gray-700 mt-2">{formatVND(product.price)}</p>
          <p className="text-gray-600 mt-4">{product.shortDescription}</p>

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
          <p className="text-gray-600">Category: {product.categoryId?.name || 'N/A'}</p>
          <p className="text-gray-600">Tags: {product.vehicleId?.name || 'N/A'}</p>

          <div className="mt-6 p-4 bg-blue-100 border border-blue-500 w-80 text-blue-800">
            <i className="fas fa-info-circle"></i> Need help? Call VN +84 337 325 729
            <div className="text-center">Monday - Friday 09:00 - 21:00</div>
          </div>
        </div>
      </div>

      {/* Các Tab */}
      <div className="mt-10">
        <div className="flex border-b border-gray-300">
          <button
            className={`py-2 px-4 focus:outline-none ${
              activeTab === 'compatibleVehicles' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-600'
            }`}
            onClick={() => setActiveTab('compatibleVehicles')}
          >
            Vehicle Types That Can Be Mounted
          </button>
          <button
            className={`py-2 px-4 focus:outline-none ${
              activeTab === 'description' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-600'
            }`}
            onClick={() => setActiveTab('description')}
          >
            Description
          </button>
          <button
            className={`py-2 px-4 focus:outline-none ${
              activeTab === 'specification' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-600'
            }`}
            onClick={() => setActiveTab('specification')}
          >
            Specification
          </button>
          <button
            className={`py-2 px-4 focus:outline-none ${
              activeTab === 'reviews' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-600'
            }`}
            onClick={() => setActiveTab('reviews')}
          >
            Reviews
          </button>
        </div>
      </div>

      {/* Nội dung Tab */}
      <div className="mt-6">
        {activeTab === 'compatibleVehicles' && <CompatibleVehicles vehicles={product.vehicleId} />}

        {activeTab === 'description' && <Description description={product.description} />}

        {activeTab === 'specification' && <Specification specification={product.specification} />}

        {activeTab === 'reviews' && <Reviews productId={product._id} initialReviews={reviews} />}
      </div>

      {/* Các Sản Phẩm Liên Quan */}
      <div className="w-full mt-10">
        <h3 className="text-2xl font-semibold mb-4">Related Products</h3>
        <div className="flex flex-wrap gap-4">
          {relatedProducts.length > 0 ? ( 
            relatedProducts.map(relatedProduct => (
              <div key={relatedProduct._id} className="w-1/4 p-4 border border-gray-200 rounded">
                <img
                  src={relatedProduct.imageUrl[0]}
                  alt={relatedProduct.name}
                  className="w-full h-32 object-cover rounded"
                />
                <h4 className="mt-2 text-lg font-medium">{relatedProduct.name}</h4>
                <p className="text-gray-700 mt-2">{formatVND(relatedProduct.price)}</p>
              </div>
            ))
          ) : (
            <p>Không có sản phẩm liên quan nào.</p>
          )}
        </div>
      </div>
    </div>
  )
}
