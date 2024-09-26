import React, { useEffect, useState, useContext } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import apiServer from '../../services/apiServer'
import { UserContext } from '../../context/UserContext' // Import UserContext

export default function Index() {
  const { addToCart } = useCart()
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [specialProducts, setSpecialProducts] = useState([])
  const [trendingProducts, setTrendingProducts] = useState([])
  const [bannerProducts, setBannerProducts] = useState([])
  const navigate = useNavigate()

  const { user } = useContext(UserContext) // Lấy user từ UserContext

  useEffect(() => {
    // Gọi API để lấy sản phẩm
    const fetchData = async () => {
      try {
        const featuredData = await apiServer.getFeaturedProducts()
        setFeaturedProducts(featuredData)

        const specialData = await apiServer.getSpecialProducts()
        setSpecialProducts(specialData)

        const trendingData = await apiServer.getTrendingProducts()
        setTrendingProducts(trendingData)

        const bannerData = await apiServer.getBannerProducts()
        setBannerProducts(bannerData)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [navigate])

  const handleProductClick = slug => {
    navigate(`/products/${slug}`)
  }
  return (
    <div className="container mx-auto px-20">
      {user && (
        <div className="flex items-center mb-6 mt-6">
          <div>
            <p>Xin chào, {user.username}</p>
          </div>
        </div>
      )}
      {/*hiện thị 3 sản phẩm chính của cửa hàn*/}
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
                      href="!"
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
                  <img src={special.image} className="w-48 h-52 ml-auto mr-10" alt={special.name} />
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
          <div className="w-full md:w-1/4 px-4 mb-4" key={featured.name}>
            <div className="card shadow-lg relative h-118 group overflow-hidden rounded-lg">
              <div key={featured._id} onClick={() => handleProductClick(featured.slug)}>
                <div className="card-icons absolute top-0 right-0 p-2 flex space-x-2">
                  <NavLink to="/wishlist" className="btn btn-outline-primary">
                    <i className="fas fa-heart" />
                  </NavLink>
                  <NavLink to="/compare" className="btn btn-outline-primary">
                    <i className="fas fa-sync-alt" />
                  </NavLink>
                </div>
                <div className="overflow-hidden transform transition-transform duration-300 group-hover:-translate-y-4">
                  <img
                    src={featured.image}
                    className="w-full mt-5 pt-10 h-auto transform transition-transform duration-300 group-hover:-translate-y-4"
                    alt={featured.name}
                  />

                  <div className="card-body flex flex-col pl-4 text-sm mt-10 py-2 transform transition-transform duration-300 group-hover:-translate-y-4">
                    <p>{featured.name}</p>
                    <p className="text-lg font-bold py-2 pt-3">{featured.price}</p>{' '}
                  </div>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 w-full bg-blue-600 text-white text-center py-4 opacity-0 transform translate-y-full group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 rounded-t-lg">
                <button
                  className="w-full  rounded-lg"
                  onClick={() => addToCart(featured)} // Gọi hàm addToCart khi người dùng nhấn vào nút
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
              <div className="card-body flex items-center p-4">
                <div className="flex-grow">
                  <h2 className="text-xl pb-5">{panel.name}</h2>
                  <p className="text-sm">{panel.price}”</p>
                  <p className="text-green-600">{panel.content}</p>
                </div>
                <img
                  src="img/z5502132260652_b8cbbdb721bf9a03a9f02228f75bd145.jpg"
                  className="w-48 h-auto ml-auto"
                  alt="E-77 Camera"
                />
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
          <div className="w-full md:w-1/3 px-4 mb-4" key={trending.id}>
            <div className="card shadow-lg relative group">
              <div className="card-body flex items-center p-4">
                <img src={trending.image} className="w-48 h-auto ml-auto" alt={trending.name} />
                <div className="card-icons absolute top-0 right-0 p-2 flex space-x-2">
                  <NavLink to="!" className="btn btn-outline-primary">
                    <i className="fas fa-heart" />
                  </NavLink>
                  <NavLink to="!" className="btn btn-outline-primary">
                    <i className="fas fa-sync-alt" />
                  </NavLink>
                </div>
                <div className="flex-grow pl-5">
                  <h2 className="text-lg pt-5">{trending.name}</h2>
                  <p className="text-lg">{trending.price}</p>
                </div>
              </div>
              <div className="absolute bottom-0 right-0 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300  rounded-t-lg">
                <button
                  className="w-12 h-12 bg-blue-600 text-white flex items-center justify-center rounded-lg"
                  onClick={() => addToCart(trending)}
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
