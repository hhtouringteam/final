import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import './custom.css'
import { useCart } from '../product/context/CartContext'
import { useNavigate } from 'react-router-dom'
import { products } from '../../data'

export default function Index() {
  const navigate = useNavigate()
  const handleProductClick = name => {
    const productNameSlug = name.replace(/\s+/g, '-').toLowerCase()
    navigate(`/product/${productNameSlug}`)
  }
  const [cameras, setCameras] = useState([
    {
      name: 'E-77 Camera',
      number: 'V20',
      image: 'img/z5502132260652_b8cbbdb721bf9a03a9f02228f75bd145.jpg',
    },
    {
      name: 'E-78 Camera',
      number: 'V21',
      image: 'img/z5502132260652_b8cbbdb721bf9a03a9f02228f75bd145.jpg',
    },
    {
      name: 'E-79 Camera',
      number: 'V22',
      image: 'img/z5502132260652_b8cbbdb721bf9a03a9f02228f75bd145.jpg',
    },
  ])
  const [arrCameras, setArrCameras] = useState(cameras)

  const [Featureds, setFeatureds] = useState([...products])

  const [arrFeatureds, setArrFeatureds] = useState(Featureds)

  const [panels, setPanels] = useState([
    {
      name: 'E- 77 Camera',
      title: 'MF841HN/A 13”',
      content: 'Weekend Sale 20%',
    },
    {
      name: 'HP Ultimate',
      title: 'With Bluetooth 5.1',
      content: 'Discount 30%',
    },
  ])
  const [arrPanels, setArrPanels] = useState(panels)

  const [Trendings, setTrendings] = useState([
    {
      name: 'Camera CCW5 4k Waterproof',
      title: 'RX5800xt 16GB 32GB',
      price: '11212',
      image: 'img/z5502132260652_b8cbbdb721bf9a03a9f02228f75bd145.jpg',
    },
    {
      name: 'Camera CCW5 4k Waterproof',
      title: 'RX5800xt 16GB 32GB',
      price: '3212',
      image: 'img/z5502132260652_b8cbbdb721bf9a03a9f02228f75bd145.jpg',
    },

    {
      name: 'Camera CCW5 4k Waterproof',
      title: 'RX5800xt 16GB 32GB',
      price: '12312',
      image: 'img/z5502132260652_b8cbbdb721bf9a03a9f02228f75bd145.jpg',
    },

    {
      name: 'Camera CCW5 4k Waterproof',
      title: 'RX5800xt 16GB 32GB',
      price: '123',
      image: 'img/z5502132260652_b8cbbdb721bf9a03a9f02228f75bd145.jpg',
    },

    {
      name: 'Camera CCW5 4k Waterproof',
      title: 'RX5800xt 16GB 32GB',
      price: '12312',
      image: 'img/z5502132260652_b8cbbdb721bf9a03a9f02228f75bd145.jpg',
    },

    {
      name: 'Camera CCW5 4k Waterproof',
      title: 'RX5800xt 16GB 32GB',
      price: '21312',
      image: 'img/z5502132260652_b8cbbdb721bf9a03a9f02228f75bd145.jpg',
    },
  ])
  const [arrTrendings, setArrTrendings] = useState(Trendings)

  const [users, setUsers] = useState([])
  const [query, setQuery] = useState('')

  const { addToCart } = useCart()

  const search = timkiem => {
    setQuery(timkiem)
    const dulieumoi = cameras.filter(c => c.name.includes(timkiem) || c.number.includes(timkiem))
    console.log(dulieumoi)
    setArrCameras(dulieumoi)
  }

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/users')
      .then(response => response.json())
      .then(json => setUsers(json))
  }, [])

  return (
    <div className="container mx-auto">
      <div className="flex flex-wrap -mx-4 my-4 p-10">
        {arrCameras.map(camera => (
          <div className="w-full md:w-1/3 px-4 mb-4">
            <div className="card shadow-lg relative">
              <div className="card-body flex items-center p-4">
                <div className="flex-grow">
                  <h2 className="text-xl">{camera.name}</h2>
                  <p className="text-sm">{camera.number}</p>
                  <a
                    href="!"
                    className="inline-flex items-center py-2 px-4 bg-blue-200 text-black rounded gap-2 mt-4 group"
                  >
                    <span className="qodef-m-text">Shop Now</span>
                    <span className="qodef-m-icon flex items-center justify-center relative w-3 h-3">
                      <svg
                        className=" absolute  group-hover:opacity-100 duration-300 transition-all opacity-0 "
                        xmlns="http://www.w3.org/2000/svg"
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                      >
                        <path d="M4.293 1.293a1 1 0 011.414 0L9.707 5.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L7.586 6 4.293 2.707a1 1 0 010-1.414z"></path>
                      </svg>
                      <svg
                        className=" absolute group-hover:opacity-0 duration-300 transition-all opacity-100 "
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
                <img src={camera.image} className="w-48 h-auto ml-auto mr-10" alt="E-77 Camera" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ----------------------------------Featured ------------------------ */}
      <hr className="w-11/12 mx-auto border-t-2 border-gray-300 my-10" />
      <h1 className="txmau text-left my-4 text-4xl">Featured Products</h1>

      <div className="flex flex-wrap -mx-4">
        {arrFeatureds.map(featured => (
          <div className="w-full md:w-1/4 px-4 mb-4" key={featured.name}>
            <div className="card shadow-lg relative h-118 group overflow-hidden rounded-lg">
              <div onClick={() => handleProductClick(featured.name)}>
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
                    {/* Điều chỉnh py-10 thành py-2 để giảm khoảng cách */}
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
        {panels.map(panel => (
          <div className="w-full md:w-1/2 px-4 mb-4">
            <div className="card shadow-lg">
              <div className="card-body flex items-center p-4">
                <div className="flex-grow">
                  <h2 className="text-xl pb-5">{panel.name}</h2>
                  <p className="text-sm">{panel.title}”</p>
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
        {Trendings.map(trending => (
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
