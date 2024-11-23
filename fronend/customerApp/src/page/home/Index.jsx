import React, { useEffect, useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import apiServer from '../../services/apiServer'
import { AuthContext } from '../../context/AuthContext'
import { formatVND } from '../../utils/formatMoney'

export default function Index() {
  const { addToCart } = useCart()
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [specialProducts, setSpecialProducts] = useState([])
  const [trendingProducts, setTrendingProducts] = useState([])
  const [bannerProducts, setBannerProducts] = useState([])
  const navigate = useNavigate()
  const { user } = useContext(AuthContext)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const featuredData = await apiServer.getFeaturedProducts()
        console.log('Featured Products:', featuredData)
        setFeaturedProducts(featuredData)
        const specialData = await apiServer.getSpecialProducts()
        setSpecialProducts(specialData)
        const trendingData = await apiServer.getTrendingProducts()
        setTrendingProducts(trendingData)
        const bannerData = await apiServer.getBannerProducts()
        console.log('bannerData Products:', bannerData)
        setBannerProducts(bannerData)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    fetchData()
  }, [navigate])
  const handleProductClick = id => {
    console.log('ID--------:', id)
    navigate(`/product/${id}`)
  }

  return (
    <div className="container mx-auto px-20">
      {user && (
        <div className="flex items-center mb-6 mt-6">
          <div>
            <p>Hello, {user.username}</p>
          </div>
        </div>
      )}

      <div className="flex flex-wrap -mx-4 my-4 p-10">
        {specialProducts.length > 0 ? (
          specialProducts.map(special => (
            <div className="w-full md:w-1/3 px-4 mb-4" key={special._id}>
              <div className="card shadow-lg relative">
                <div className="card-body flex items-center p-4">
                  <div className="flex-grow">
                    <h2 className="text-xl">{special.name}</h2>
                    <p className="text-sm">{special.idProduct}</p>
                    <a
                      href="/tcsp"
                      className="inline-flex items-center py-2 px-4 bg-blue-200 text-black rounded gap-2 mt-4 group"
                    >
                      <span className="qodef-m-text">Shop Now</span>
                      <span className="qodef-m-icon flex items-center justify-center relative w-3 h-3">
                        <svg
                          className="absolute group-hover:opacity-100 duration-300 transition-all opacity-0"
                          xmlns="http://www.w3.org/2000/svg"
                          width="12"
                          height="12"
                          viewBox="0 0 12 12"
                        >
                          <path d="M4.293 1.293a1 1 0 011.414 0L9.707 5.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L7.586 6 4.293 2.707a1 1 0 010-1.414z"></path>
                        </svg>
                        <svg
                          className="absolute group-hover:opacity-0 duration-300 transition-all opacity-100"
                          xmlns="http://www.w3.org/2000/svg"
                          width="12"
                          height="12"
                          viewBox="0 0 12 12"
                        >
                          <path d="M6 0a1 1 0 011 1v4h4a1 1 0 110 2H7v4a1 1 0 11-2 0V7H1a1 1 0 110-2h4V1a1 1 0 011-1z"></path>
                        </svg>
                      </span>
                    </a>
                  </div>
                  <img src={special.imageUrl[0]} className="w-52 h-52 " alt={special.name} />
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-4xl text-red-500 text-center">Loading products...</p>
        )}
      </div>

      {/* ----------------------------------Featured ------------------------ */}
      <hr className="w-11/12 mx-auto border-t-2 border-gray-300 my-10" />
      <h1 className="txmau text-left my-4 text-4xl">Featured Products</h1>

      <div className="flex flex-wrap -mx-4">
        {featuredProducts.map(featured => (
          <div className="w-full md:w-1/4 px-4 mb-4" key={featured._id}>
            <div className="card shadow-lg relative h-118 group overflow-hidden rounded-lg    hover:shadow-lg transition ">
              <div
                onClick={() => {
                  console.log('featuredProducts ID:', featured._id)
                  handleProductClick(featured._id)
                }}
              >
                <div className="overflow-hidden transform transition-transform duration-300 group-hover:-translate-y-4">
                  <img
                    src={featured.imageUrl[0]}
                    className="w-full mt-5 pt-10 h-80 transform transition-transform duration-300 group-hover:-translate-y-4"
                    alt={featured.name}
                  />
                  <div className="card-body flex flex-col pl-4 text-sm mt-10 py-2 transform transition-transform duration-300 group-hover:-translate-y-4">
                    <p>{featured.name}</p>
                    <p className="text-lg font-bold py-2 pt-3">{formatVND(featured.price)}</p>
                  </div>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 w-full bg-blue-600 text-white text-center py-4 opacity-0 transform translate-y-full group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 rounded-t-lg">
                <button
                  className="w-full  rounded-lg"
                  onClick={() => addToCart(featured)} // Thêm sản phẩm nổi bật vào giỏ hàng
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* -----------------------------------------panel-------------------------------- */}

      <hr className="w-11/12 mx-auto border-t-2 border-gray-300 my-10" />

      <div className="flex flex-wrap -mx-4 my-4">
        {bannerProducts.map(panel => (
          <div className="w-full md:w-1/2 px-4 mb-4">
            <div className="card shadow-lg">
              <div className="card-body flex items-center p-4  rounded-lg overflow-hidden shadow-md hover:shadow-lg transition">
                <div className="flex-grow">
                  <h2 className="text-xl pb-5">{panel.name}</h2>
                  <p className="text-sm">{formatVND(panel.price)}</p>
                  <p className="text-green-600">{panel.content}</p>
                </div>
                <img src={panel.imageUrl[0]} className="w-48 h-60 ml-auto" alt={panel.name} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* .......................................................... Trending............................................................. */}
      <hr className="w-11/12 mx-auto border-t-2 border-gray-300 my-10" />
      <h1 className="text-left my-4 text-4xl">Trending Products</h1>
      <div className="flex flex-wrap -mx-4 my-4">
        {trendingProducts.map(trending => (
          <div className="w-full md:w-1/3 px-4 mb-4" key={trending._id}>
            <div className="card shadow-lg relative group">
              <div className="card-body flex items-center p-4  rounded-lg overflow-hidden shadow-md hover:shadow-lg transition">
                <img src={trending.imageUrl[0]} className="w-52 h-52 ml-auto" alt={trending.name} />
                <div className="flex-grow pl-5">
                  <h2 className="text-lg pt-5">{trending.name}</h2>
                  <p className="text-lg">{formatVND(trending.price)}</p>
                </div>
              </div>
              <div className="absolute bottom-0 right-0 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 rounded-t-lg">
                <button
                  className="w-12 h-12 bg-blue-600 text-white flex items-center justify-center rounded-lg"
                  onClick={() => addToCart(trending)} // Thêm sản phẩm xu hướng vào giỏ hàng
                >
                  <i className="fas fa-shopping-cart text-lg"></i>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}


// import React, { useEffect, useState, useContext } from 'react'
// import { useNavigate } from 'react-router-dom'
// import { useCart } from '../../context/CartContext'
// import apiServer from '../../services/apiServer'
// import { AuthContext } from '../../context/AuthContext'
// import { formatVND } from '../../utils/formatMoney'
// import { FaShoppingCart, FaArrowRight, FaStar, FaRegStar } from 'react-icons/fa'
// import Slider from 'react-slick'
// import Modal from 'react-modal'
// import { ToastContainer, toast } from 'react-toastify'
// import 'react-toastify/dist/ReactToastify.css'

// Modal.setAppElement('#root') // Đảm bảo rằng phần tử root đã được thiết lập

// export default function Index() {
//   const { addToCart } = useCart()
//   const [featuredProducts, setFeaturedProducts] = useState([])
//   const [specialProducts, setSpecialProducts] = useState([])
//   const [trendingProducts, setTrendingProducts] = useState([])
//   const [bannerProducts, setBannerProducts] = useState([])
//   const navigate = useNavigate()
//   const { user } = useContext(AuthContext)
//   const [loading, setLoading] = useState(true) // Trạng thái tải
//   const [error, setError] = useState(null) // Trạng thái lỗi
//   const [couponCode, setCouponCode] = useState('') // Mã coupon
//   const [discount, setDiscount] = useState(0) // Giảm giá từ coupon
//   const [modalIsOpen, setModalIsOpen] = useState(false) // Trạng thái modal
//   const [selectedProduct, setSelectedProduct] = useState(null) // Sản phẩm được chọn để xem nhanh

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const featuredData = await apiServer.getFeaturedProducts()
//         console.log('Featured Products:', featuredData)
//         setFeaturedProducts(featuredData)

//         const specialData = await apiServer.getSpecialProducts()
//         setSpecialProducts(specialData)

//         const trendingData = await apiServer.getTrendingProducts()
//         setTrendingProducts(trendingData)

//         const bannerData = await apiServer.getBannerProducts()
//         console.log('Banner Products:', bannerData)
//         setBannerProducts(bannerData)
//       } catch (error) {
//         console.error('Error fetching data:', error)
//         setError('Failed to load products. Please try again later.')
//       } finally {
//         setLoading(false)
//       }
//     }
//     fetchData()
//   }, [navigate])

//   const handleProductClick = id => {
//     console.log('Product ID:', id)
//     navigate(`/product/${id}`)
//   }

//   const handleAddToCart = product => {
//     addToCart(product)
//     toast.success(`${product.name} added to cart!`)
//   }

//   const openModal = product => {
//     setSelectedProduct(product)
//     setModalIsOpen(true)
//   }

//   const closeModal = () => {
//     setSelectedProduct(null)
//     setModalIsOpen(false)
//   }

//   const handleApplyCoupon = async () => {
//     if (!couponCode.trim()) {
//       setError('Please enter a coupon code.')
//       return
//     }
//     try {
//       const response = await apiServer.applyCoupon(couponCode.trim())
//       if (response.success) {
//         setDiscount(response.discount)
//         toast.success('Coupon applied successfully!')
//         setError(null)
//       } else {
//         setError(response.message || 'Invalid coupon code.')
//       }
//     } catch (error) {
//       console.error('Error applying coupon:', error)
//       setError('Failed to apply coupon. Please try again.')
//     }
//   }

//   // Cài đặt cho Carousel
//   const carouselSettings = {
//     dots: true,
//     infinite: true,
//     speed: 500,
//     slidesToShow: 1,
//     slidesToScroll: 1,
//     autoplay: true,
//     autoplaySpeed: 3000,
//   }

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <ToastContainer />
//       {/* Greeting Section */}
//       {user && (
//         <div className="flex items-center mb-8">
//           <div>
//             <p className="text-lg">
//               Hello, <span className="font-semibold">{user.username}</span>!
//             </p>
//           </div>
//         </div>
//       )}

//       {/* Error Message */}
//       {error && (
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6" role="alert">
//           <strong className="font-bold">Error:</strong>
//           <span className="block sm:inline"> {error}</span>
//         </div>
//       )}

//       {/* Loading State */}
//       {loading ? (
//         <div className="flex justify-center items-center h-64">
//           <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
//         </div>
//       ) : (
//         <>
//           {/* Hero Carousel Section */}
//           <section className="mb-16">
//             <Slider {...carouselSettings}>
//               {bannerProducts.map(banner => (
//                 <div key={banner._id} className="relative">
//                   <img src={banner.imageUrl[0]} alt={banner.name} className="w-full h-96 object-cover" loading="lazy" />
//                   <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-white">
//                     <h2 className="text-4xl font-bold mb-4">{banner.name}</h2>
//                     <p className="text-xl mb-6">{banner.content}</p>
//                     <button
//                       onClick={() => handleProductClick(banner._id)}
//                       className="flex items-center bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition-colors duration-300"
//                     >
//                       <span className="mr-2">Shop Now</span>
//                       <FaArrowRight />
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </Slider>
//           </section>

//           {/* Special Products Section */}
//           <section className="mb-16">
//             <h2 className="text-3xl font-bold mb-6">Special Products</h2>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//               {specialProducts.length > 0 ? (
//                 specialProducts.map(special => (
//                   <div
//                     className="bg-white shadow-md rounded-lg overflow-hidden relative hover:shadow-xl transition-shadow duration-300"
//                     key={special._id}
//                   >
//                     {/* Badge */}
//                     {special.isNew && (
//                       <span className="absolute top-4 left-4 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded">
//                         New
//                       </span>
//                     )}
//                     {special.isOnSale && (
//                       <span className="absolute top-4 right-4 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
//                         Sale
//                       </span>
//                     )}
//                     <div className="flex flex-col md:flex-row">
//                       <img
//                         src={special.imageUrl[0]}
//                         alt={special.name}
//                         className="w-full md:w-1/2 h-48 object-cover cursor-pointer"
//                         onClick={() => handleProductClick(special._id)}
//                         loading="lazy"
//                       />
//                       <div className="p-6 flex flex-col justify-between">
//                         <div>
//                           <h3 className="text-xl font-semibold mb-2">{special.name}</h3>
//                           <div className="flex items-center mb-4">
//                             {Array.from({ length: 5 }, (_, index) =>
//                               index < special.rating ? (
//                                 <FaStar key={index} className="text-yellow-400" />
//                               ) : (
//                                 <FaRegStar key={index} className="text-yellow-400" />
//                               ),
//                             )}
//                             <span className="ml-2 text-gray-600">({special.reviewCount})</span>
//                           </div>
//                           <p className="text-gray-600 mb-4">Product ID: {special.idProduct}</p>
//                         </div>
//                         <div className="flex items-center justify-between">
//                           <span className="text-lg font-bold">{formatVND(special.price)}</span>
//                           <button
//                             onClick={() => handleAddToCart(special)}
//                             className="flex items-center bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded transition-colors duration-300"
//                           >
//                             <FaShoppingCart className="mr-2" />
//                             Add to Cart
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 ))
//               ) : (
//                 <p className="text-center text-2xl text-red-500">No special products available.</p>
//               )}
//             </div>
//           </section>

//           {/* Featured Products Section */}
//           <section className="mb-16">
//             <h2 className="text-3xl font-bold mb-6">Featured Products</h2>
//             <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
//               {featuredProducts.map(featured => (
//                 <div
//                   className="bg-white shadow-md rounded-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 relative group"
//                   key={featured._id}
//                 >
//                   <div onClick={() => handleProductClick(featured._id)} className="cursor-pointer">
//                     <img
//                       src={featured.imageUrl[0]}
//                       alt={featured.name}
//                       className="w-full h-60 object-cover transition-transform duration-300 group-hover:-translate-y-4"
//                       loading="lazy"
//                     />
//                     <div className="p-4">
//                       <h3 className="text-xl font-semibold mb-2">{featured.name}</h3>
//                       <p className="text-gray-600 mb-4">Price: {formatVND(featured.price)}</p>
//                     </div>
//                   </div>
//                   <button
//                     onClick={() => handleAddToCart(featured)}
//                     className="w-full bg-green-500 text-white py-2 px-4 rounded-b-lg hover:bg-green-600 transition-colors duration-300 flex items-center justify-center"
//                   >
//                     <FaShoppingCart className="mr-2" />
//                     Add to Cart
//                   </button>
//                 </div>
//               ))}
//             </div>
//           </section>

//           {/* Coupon Code Section */}
//           <section className="mb-16">
//             <div className="flex flex-col md:flex-row items-center justify-between bg-white shadow-md rounded-lg p-6">
//               <input
//                 type="text"
//                 className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 placeholder="Enter coupon code"
//                 value={couponCode}
//                 onChange={e => setCouponCode(e.target.value)}
//               />
//               <button
//                 onClick={handleApplyCoupon}
//                 className="mt-4 md:mt-0 bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors"
//               >
//                 Apply Coupon
//               </button>
//             </div>
//             {discount > 0 && (
//               <div className="mt-2 text-green-600 text-center">Coupon applied! You saved {formatVND(discount)}.</div>
//             )}
//           </section>

//           {/* Trending Products Section */}
//           <section className="mb-16">
//             <h2 className="text-3xl font-bold mb-6">Trending Products</h2>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//               {trendingProducts.map(trending => (
//                 <div
//                   className="bg-white shadow-md rounded-lg overflow-hidden group relative transform hover:scale-105 transition-transform duration-300"
//                   key={trending._id}
//                 >
//                   <div className="flex flex-col md:flex-row">
//                     <img
//                       src={trending.imageUrl[0]}
//                       alt={trending.name}
//                       className="w-full md:w-1/2 h-48 object-cover cursor-pointer"
//                       onClick={() => handleProductClick(trending._id)}
//                       loading="lazy"
//                     />
//                     <div className="p-6 flex flex-col justify-between">
//                       <div>
//                         <h3 className="text-xl font-semibold mb-2">{trending.name}</h3>
//                         <div className="flex items-center mb-4">
//                           {Array.from({ length: 5 }, (_, index) =>
//                             index < trending.rating ? (
//                               <FaStar key={index} className="text-yellow-400" />
//                             ) : (
//                               <FaRegStar key={index} className="text-yellow-400" />
//                             ),
//                           )}
//                           <span className="ml-2 text-gray-600">({trending.reviewCount})</span>
//                         </div>
//                         <p className="text-gray-600">Price: {formatVND(trending.price)}</p>
//                       </div>
//                     </div>
//                   </div>
//                   {/* Add to Cart Button */}
//                   <button
//                     onClick={() => handleAddToCart(trending)}
//                     className="absolute bottom-4 right-4 bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100"
//                     aria-label={`Add ${trending.name} to cart`}
//                   >
//                     <FaShoppingCart />
//                   </button>
//                   {/* Quick View Button */}
//                   <button
//                     onClick={() => openModal(trending)}
//                     className="absolute bottom-4 left-4 bg-gray-700 text-white p-3 rounded-full shadow-lg hover:bg-gray-800 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100"
//                     aria-label={`Quick view of ${trending.name}`}
//                   >
//                     <FaArrowRight />
//                   </button>
//                 </div>
//               ))}
//             </div>
//           </section>

//           {/* Quick View Modal */}
//           {selectedProduct && (
//             <Modal
//               isOpen={modalIsOpen}
//               onRequestClose={closeModal}
//               contentLabel="Quick View Modal"
//               className="max-w-3xl mx-auto my-20 bg-white rounded-lg shadow-lg overflow-hidden"
//               overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
//             >
//               <div className="flex flex-col md:flex-row">
//                 <img
//                   src={selectedProduct.imageUrl[0]}
//                   alt={selectedProduct.name}
//                   className="w-full md:w-1/2 h-64 object-cover"
//                   loading="lazy"
//                 />
//                 <div className="p-6 flex flex-col justify-between">
//                   <div>
//                     <h2 className="text-2xl font-semibold mb-2">{selectedProduct.name}</h2>
//                     <div className="flex items-center mb-4">
//                       {Array.from({ length: 5 }, (_, index) =>
//                         index < selectedProduct.rating ? (
//                           <FaStar key={index} className="text-yellow-400" />
//                         ) : (
//                           <FaRegStar key={index} className="text-yellow-400" />
//                         ),
//                       )}
//                       <span className="ml-2 text-gray-600">({selectedProduct.reviewCount} Reviews)</span>
//                     </div>
//                     <p className="text-gray-600 mb-4">Price: {formatVND(selectedProduct.price)}</p>
//                     <p className="text-gray-700 mb-4">{selectedProduct.description}</p>
//                   </div>
//                   <div className="flex items-center justify-between">
//                     <button
//                       onClick={() => handleAddToCart(selectedProduct)}
//                       className="flex items-center bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded transition-colors duration-300"
//                     >
//                       <FaShoppingCart className="mr-2" />
//                       Add to Cart
//                     </button>
//                     <button
//                       onClick={closeModal}
//                       className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded transition-colors duration-300"
//                     >
//                       Close
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </Modal>
//           )}
//         </>
//       )}
//     </div>
//   )
// }
