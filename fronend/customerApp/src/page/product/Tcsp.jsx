// // import React, { useState, useEffect } from 'react'
// // import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// // import { faChevronRight, faChevronDown } from '@fortawesome/free-solid-svg-icons'
// // import { Slider, Typography, Box, Collapse } from '@mui/material'

// // export default function Tcsp() {
// //   const [products, setProducts] = useState([])
// //   const [selectedCategories, setSelectedCategories] = useState([])
// //   const [selectedBrands, setSelectedBrands] = useState([])
// //   const [selectedVehicles, setSelectedVehicles] = useState([])
// //   const [activeFilter, setActiveFilter] = useState('')
// //   const [priceRange, setPriceRange] = useState([0, 7500])

// //   // Lấy danh sách sản phẩm từ API
// //   useEffect(() => {
// //     const fetchProducts = async () => {
// //       try {
// //         const response = await fetch('http://localhost:5000/api/customer/products') // Đổi thành endpoint API thực tế của bạn
// //         const data = await response.json()
// //         setProducts(data)
// //       } catch (error) {
// //         console.error('Error fetching products:', error)
// //       }
// //     }

// //     fetchProducts()
// //   }, [])

// //   const toggleFilter = filter => {
// //     setActiveFilter(activeFilter === filter ? '' : filter)
// //   }

// //   const handleCategoryChange = category => {
// //     setSelectedCategories(prev => (prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]))
// //   }

// //   const handleBrandChange = brand => {
// //     setSelectedBrands(prev => (prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]))
// //   }

// //   const handleVehicleChange = vehicle => {
// //     setSelectedVehicles(prev => (prev.includes(vehicle) ? prev.filter(v => v !== vehicle) : [...prev, vehicle]))
// //   }
// //   // const filteredProducts = products
// //   // Lọc sản phẩm dựa trên danh mục, thương hiệu và phương tiện đã chọn
// //   const filteredProducts = products.filter(
// //     product =>
// //       (selectedCategories.length === 0 || selectedCategories.includes(product.categoryId.name)) &&
// //       (selectedBrands.length === 0 || selectedBrands.includes(product.brandId.name)) &&
// //       (selectedVehicles.length === 0 || selectedVehicles.includes(product.vehicleId.name)) &&
// //       product.price >= priceRange[0] &&
// //       product.price <= priceRange[1],
// //   )

// //   // Hàm đếm số lượng sản phẩm theo category, brand, và vehicle
// //   const countProductsByCategory = category => products.filter(product => product.categoryId.name === category).length
// //   const countProductsByBrand = brand => products.filter(product => product.brandId.name === brand).length
// //   const countProductsByVehicle = vehicle => products.filter(product => product.vehicleId.name === vehicle).length

// //   const handlePriceChange = (event, newValue) => {
// //     setPriceRange(newValue)
// //   }

// //   return (
// //     <div className="container mx-auto mt-20 p-10">
// //       <div className="flex flex-wrap">
// //         <div className="w-full md:w-1/4 pr-4 border-r border-gray-300">
// //           <ul className="space-y-2">
// //             {/* Bộ lọc theo danh mục */}
// //             <li>
// //               <button
// //                 onClick={() => toggleFilter('category')}
// //                 className="font-bold text-left flex justify-between items-center"
// //               >
// //                 <FontAwesomeIcon icon={activeFilter === 'category' ? faChevronDown : faChevronRight} className="mr-2" />
// //                 Danh mục
// //               </button>
// //               <Collapse in={activeFilter === 'category'}>
// //                 <ul className="pl-4 mt-2 space-y-1">
// //                   {products.map(product => (
// //                     <li key={product.categoryId._id}>
// //                       <input
// //                         type="checkbox"
// //                         id={product.categoryId.name}
// //                         checked={selectedCategories.includes(product.categoryId.name)}
// //                         onChange={() => handleCategoryChange(product.categoryId.name)}
// //                       />
// //                       <label htmlFor={product.categoryId.name}>
// //                         {product.categoryId.name} ({countProductsByCategory(product.categoryId.name)})
// //                       </label>
// //                     </li>
// //                   ))}
// //                 </ul>
// //               </Collapse>
// //             </li>
// //             {/* Bộ lọc theo thương hiệu */}
// //             <li>
// //               <button
// //                 onClick={() => toggleFilter('brand')}
// //                 className="font-bold text-left flex justify-between items-center"
// //               >
// //                 <FontAwesomeIcon icon={activeFilter === 'brand' ? faChevronDown : faChevronRight} className="mr-2" />
// //                 Thương hiệu
// //               </button>
// //               <Collapse in={activeFilter === 'brand'}>
// //                 <ul className="pl-4 mt-2 space-y-1">
// //                   {products.map(product => (
// //                     <li key={product.brandId._id}>
// //                       <input
// //                         type="checkbox"
// //                         id={product.brandId.name}
// //                         checked={selectedBrands.includes(product.brandId.name)}
// //                         onChange={() => handleBrandChange(product.brandId.name)}
// //                       />
// //                       <label htmlFor={product.brandId.name}>
// //                         {product.brandId.name} ({countProductsByBrand(product.brandId.name)})
// //                       </label>
// //                     </li>
// //                   ))}
// //                 </ul>
// //               </Collapse>
// //             </li>
// //             {/* Bộ lọc theo phương tiện */}
// //             <li>
// //               <button
// //                 onClick={() => toggleFilter('vehicle')}
// //                 className="font-bold text-left flex justify-between items-center"
// //               >
// //                 <FontAwesomeIcon icon={activeFilter === 'vehicle' ? faChevronDown : faChevronRight} className="mr-2" />
// //                 Phương tiện
// //               </button>
// //               <Collapse in={activeFilter === 'vehicle'}>
// //                 <ul className="pl-4 mt-2 space-y-1">
// //                   {products.map(product => (
// //                     <li key={product.vehicleId._id}>
// //                       <input
// //                         type="checkbox"
// //                         id={product.vehicleId.name}
// //                         checked={selectedVehicles.includes(product.vehicleId.name)}
// //                         onChange={() => handleVehicleChange(product.vehicleId.name)}
// //                       />
// //                       <label htmlFor={product.vehicleId.name}>
// //                         {product.vehicleId.name} ({countProductsByVehicle(product.vehicleId.name)})
// //                       </label>
// //                     </li>
// //                   ))}
// //                 </ul>
// //               </Collapse>
// //             </li>
// //             {/* Bộ lọc theo giá */}
// //             <li>
// //               <button
// //                 onClick={() => toggleFilter('price')}
// //                 className="font-bold text-left flex justify-between items-center"
// //               >
// //                 <FontAwesomeIcon icon={activeFilter === 'price' ? faChevronDown : faChevronRight} className="mr-2" />
// //                 Lọc theo giá
// //               </button>
// //               <Collapse in={activeFilter === 'price'}>
// //                 <Box pl={2} mt={2} position="relative">
// //                   <Typography gutterBottom>Khoảng giá</Typography>
// //                   <Slider
// //                     value={priceRange}
// //                     onChange={handlePriceChange}
// //                     min={0}
// //                     max={7500}
// //                     valueLabelDisplay="auto"
// //                     aria-labelledby="range-slider"
// //                   />
// //                   <Typography className="text-sm text-center mt-2">
// //                     Giá: ${priceRange[0]} - ${priceRange[1]}
// //                   </Typography>
// //                 </Box>
// //               </Collapse>
// //             </li>
// //           </ul>
// //         </div>

// //         <div className="w-full md:w-3/4 ">
// //           <h2 className="text-2xl font-bold ml-4">Sản phẩm</h2>
// //           <div className="flex flex-wrap">
// //             {filteredProducts.map(product => (
// //               <div key={product._id} className="w-full sm:w-1/2 lg:w-1/4 p-4">
// //                 <div className="border border-gray-200 rounded overflow-hidden">
// //                   <img
// //                     src={product.imageUrl || '/default-image.jpg'}
// //                     className="w-full h-48 object-cover"
// //                     alt={product.name}
// //                   />
// //                   <div className="p-4">
// //                     <h5 className="text-lg font-semibold">{product.name}</h5>
// //                     <p className="text-sm">${product.price}</p>
// //                     <a href="!" className="inline-block mt-2 bg-blue-500 text-white py-1 px-3 rounded">
// //                       Xem chi tiết
// //                     </a>
// //                   </div>
// //                 </div>
// //               </div>
// //             ))}
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   )
// // }
import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight, faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { Slider, Typography, Box, Collapse } from '@mui/material'
import { useLocation, useNavigate } from 'react-router-dom'

export default function Tcsp() {
  const [products, setProducts] = useState([])
  const [selectedCategories, setSelectedCategories] = useState([])
  const [selectedBrands, setSelectedBrands] = useState([])
  const [selectedVehicles, setSelectedVehicles] = useState([])
  const [activeFilter, setActiveFilter] = useState('')
  const [priceRange, setPriceRange] = useState([0, 7500])
  const [allCategories, setAllCategories] = useState([])
  const [allBrands, setAllBrands] = useState([])
  const [allVehicles, setAllVehicles] = useState([])
  const [loading, setLoading] = useState(false) // Thêm state để quản lý trạng thái tải
  const [error, setError] = useState(null) // Thêm state để quản lý lỗi

  const location = useLocation()
  const navigate = useNavigate()

  // Hàm để lấy các tham số từ URL
  const useQuery = () => {
    return new URLSearchParams(location.search)
  }

  const query = useQuery()
  const searchName = query.get('name') || ''
  const searchCategories = query.get('category') ? query.get('category').split(',') : []
  const searchBrands = query.get('brand') ? query.get('brand').split(',') : []
  const searchVehicles = query.get('vehicle') ? query.get('vehicle').split(',') : []
  const searchPriceMin = query.get('priceMin') ? Number(query.get('priceMin')) : 0
  const searchPriceMax = query.get('priceMax') ? Number(query.get('priceMax')) : 7500

  // Cập nhật state từ URL khi component mount hoặc URL thay đổi
  useEffect(() => {
    // Kiểm tra trước khi cập nhật state để tránh vô hạn loop
    if (
      JSON.stringify(selectedCategories) !== JSON.stringify(searchCategories) ||
      JSON.stringify(selectedBrands) !== JSON.stringify(searchBrands) ||
      JSON.stringify(selectedVehicles) !== JSON.stringify(searchVehicles) ||
      priceRange[0] !== searchPriceMin ||
      priceRange[1] !== searchPriceMax
    ) {
      setSelectedCategories(searchCategories)
      setSelectedBrands(searchBrands)
      setSelectedVehicles(searchVehicles)
      setPriceRange([searchPriceMin, searchPriceMax])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchCategories, searchBrands, searchVehicles, searchPriceMin, searchPriceMax])

  // Hàm để lấy danh sách các danh mục, thương hiệu, phương tiện để hiển thị trong các bộ lọc
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const [categoriesRes, brandsRes, vehiclesRes] = await Promise.all([
          fetch('http://localhost:5000/api/admin/categories'),
          fetch('http://localhost:5000/api/admin/brands'),
          fetch('http://localhost:5000/api/admin/vehicles'),
        ])

        const [categoriesData, brandsData, vehiclesData] = await Promise.all([
          categoriesRes.json(),
          brandsRes.json(),
          vehiclesRes.json(),
        ])

        setAllCategories(categoriesData.categories || [])
        setAllBrands(brandsData.brands || [])
        setAllVehicles(vehiclesData.vehicles || [])
      } catch (error) {
        console.error('Error fetching filter data:', error)
      }
    }

    fetchFilters()
  }, [])

  // Hàm để fetch sản phẩm dựa trên các tham số tìm kiếm
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      setError(null)
      try {
        const params = new URLSearchParams()

        if (searchName) params.append('name', searchName)
        if (selectedCategories.length > 0) params.append('category', selectedCategories.join(','))
        if (selectedBrands.length > 0) params.append('brand', selectedBrands.join(','))
        if (selectedVehicles.length > 0) params.append('vehicle', selectedVehicles.join(','))
        if (priceRange[0] > 0) params.append('priceMin', priceRange[0])
        if (priceRange[1] < 7500) params.append('priceMax', priceRange[1])

        const response = await fetch(`http://localhost:5000/api/admin/products?${params.toString()}`)
        if (!response.ok) {
          throw new Error('Failed to fetch products')
        }
        const data = await response.json()
        setProducts(data.products)
      } catch (error) {
        console.error('Error fetching products:', error)
        setError('Đã xảy ra lỗi khi tải sản phẩm.')
      }
      setLoading(false)
    }

    fetchProducts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchName, selectedCategories, selectedBrands, selectedVehicles, priceRange])

  const toggleFilter = filter => {
    setActiveFilter(activeFilter === filter ? '' : filter)
  }

  const handleCategoryChange = categoryId => {
    let newSelectedCategories
    if (selectedCategories.includes(categoryId)) {
      newSelectedCategories = selectedCategories.filter(id => id !== categoryId)
    } else {
      newSelectedCategories = [...selectedCategories, categoryId]
    }
    setSelectedCategories(newSelectedCategories)
    updateURL({ category: newSelectedCategories })
  }

  const handleBrandChange = brandId => {
    let newSelectedBrands
    if (selectedBrands.includes(brandId)) {
      newSelectedBrands = selectedBrands.filter(id => id !== brandId)
    } else {
      newSelectedBrands = [...selectedBrands, brandId]
    }
    setSelectedBrands(newSelectedBrands)
    updateURL({ brand: newSelectedBrands })
  }

  const handleVehicleChange = vehicleId => {
    let newSelectedVehicles
    if (selectedVehicles.includes(vehicleId)) {
      newSelectedVehicles = selectedVehicles.filter(id => id !== vehicleId)
    } else {
      newSelectedVehicles = [...selectedVehicles, vehicleId]
    }
    setSelectedVehicles(newSelectedVehicles)
    updateURL({ vehicle: newSelectedVehicles })
  }

  const handlePriceChange = (event, newValue) => {
    setPriceRange(newValue)
    updateURL({ priceMin: newValue[0], priceMax: newValue[1] })
  }

  // Hàm để cập nhật URL với các tham số tìm kiếm mới
  const updateURL = updatedParams => {
    const params = new URLSearchParams(location.search)

    for (const key in updatedParams) {
      if (Array.isArray(updatedParams[key])) {
        if (updatedParams[key].length > 0) {
          params.set(key, updatedParams[key].join(','))
        } else {
          params.delete(key)
        }
      } else {
        if (updatedParams[key] !== undefined && updatedParams[key] !== null) {
          params.set(key, updatedParams[key])
        } else {
          params.delete(key)
        }
      }
    }

    navigate(`/Tcsp?${params.toString()}`, { replace: true }) // Sử dụng replace để tránh tạo lịch sử điều hướng mới
  }

  // Hàm để reset tất cả bộ lọc và quay lại trang Tcsp không có tham số
  const handleResetFilters = () => {
    setSelectedCategories([])
    setSelectedBrands([])
    setSelectedVehicles([])
    setPriceRange([0, 7500])
    navigate('/Tcsp', { replace: true }) // Điều hướng tới Tcsp mà không có query params
  }

  // Hàm đếm số lượng sản phẩm theo category, brand, và vehicle
  const countProductsByCategory = categoryId => {
    return products.filter(product => product.categoryId._id === categoryId).length
  }

  const countProductsByBrand = brandId => {
    return products.filter(product => product.brandId._id === brandId).length
  }

  const countProductsByVehicle = vehicleId => {
    return products.filter(product => product.vehicleId._id === vehicleId).length
  }

  return (
    <div className="container mx-auto mt-20 p-10">
      <div className="flex flex-wrap">
        {/* Bộ lọc bên trái */}
        <div className="w-full md:w-1/4 pr-4 border-r border-gray-300">
          <ul className="space-y-2">
            {/* Nút "Xem Tất Cả Sản Phẩm" */}
            {(selectedCategories.length > 0 ||
              selectedBrands.length > 0 ||
              selectedVehicles.length > 0 ||
              priceRange[0] > 0 ||
              priceRange[1] < 7500) && (
              <li>
                <button
                  onClick={handleResetFilters}
                  className=" bg-red-500 text-white px-4 py-2  hover:bg-red-600 transition-colors"
                >
                  View All Products
                </button>
              </li>
            )}

            {/* Bộ lọc theo danh mục */}
            <li>
              <button
                onClick={() => toggleFilter('category')}
                className="font-bold text-left flex justify-between items-center w-full"
              >
                <FontAwesomeIcon icon={activeFilter === 'category' ? faChevronDown : faChevronRight} className="mr-2" />
                Danh mục
              </button>
              <Collapse in={activeFilter === 'category'}>
                <ul className="pl-4 mt-2 space-y-1">
                  {allCategories.map(category => (
                    <li key={category._id}>
                      <input
                        type="checkbox"
                        id={`category-${category._id}`}
                        checked={selectedCategories.includes(category._id)}
                        onChange={() => handleCategoryChange(category._id)}
                      />
                      <label htmlFor={`category-${category._id}`} className="ml-2">
                        {category.name} ({countProductsByCategory(category._id)})
                      </label>
                    </li>
                  ))}
                </ul>
              </Collapse>
            </li>

            {/* Bộ lọc theo thương hiệu */}
            <li>
              <button
                onClick={() => toggleFilter('brand')}
                className="font-bold text-left flex justify-between items-center w-full"
              >
                <FontAwesomeIcon icon={activeFilter === 'brand' ? faChevronDown : faChevronRight} className="mr-2" />
                Thương hiệu
              </button>
              <Collapse in={activeFilter === 'brand'}>
                <ul className="pl-4 mt-2 space-y-1">
                  {allBrands.map(brand => (
                    <li key={brand._id}>
                      <input
                        type="checkbox"
                        id={`brand-${brand._id}`}
                        checked={selectedBrands.includes(brand._id)}
                        onChange={() => handleBrandChange(brand._id)}
                      />
                      <label htmlFor={`brand-${brand._id}`} className="ml-2">
                        {brand.name} ({countProductsByBrand(brand._id)})
                      </label>
                    </li>
                  ))}
                </ul>
              </Collapse>
            </li>

            {/* Bộ lọc theo phương tiện */}
            <li>
              <button
                onClick={() => toggleFilter('vehicle')}
                className="font-bold text-left flex justify-between items-center w-full"
              >
                <FontAwesomeIcon icon={activeFilter === 'vehicle' ? faChevronDown : faChevronRight} className="mr-2" />
                Phương tiện
              </button>
              <Collapse in={activeFilter === 'vehicle'}>
                <ul className="pl-4 mt-2 space-y-1">
                  {allVehicles.map(vehicle => (
                    <li key={vehicle._id}>
                      <input
                        type="checkbox"
                        id={`vehicle-${vehicle._id}`}
                        checked={selectedVehicles.includes(vehicle._id)}
                        onChange={() => handleVehicleChange(vehicle._id)}
                      />
                      <label htmlFor={`vehicle-${vehicle._id}`} className="ml-2">
                        {vehicle.name} ({countProductsByVehicle(vehicle._id)})
                      </label>
                    </li>
                  ))}
                </ul>
              </Collapse>
            </li>

            {/* Bộ lọc theo giá */}
            <li>
              <button
                onClick={() => toggleFilter('price')}
                className="font-bold text-left flex justify-between items-center w-full"
              >
                <FontAwesomeIcon icon={activeFilter === 'price' ? faChevronDown : faChevronRight} className="mr-2" />
                Lọc theo giá
              </button>
              <Collapse in={activeFilter === 'price'}>
                <Box pl={2} mt={2} position="relative">
                  <Typography gutterBottom>Khoảng giá</Typography>
                  <Slider
                    value={priceRange}
                    onChange={handlePriceChange}
                    min={0}
                    max={7500}
                    valueLabelDisplay="auto"
                    aria-labelledby="range-slider"
                  />
                  <Typography className="text-sm text-center mt-2">
                    Giá: ${priceRange[0]} - ${priceRange[1]}
                  </Typography>
                </Box>
              </Collapse>
            </li>
          </ul>
        </div>

        {/* Danh sách sản phẩm bên phải */}
        <div className="w-full md:w-3/4">
          <h2 className="text-2xl font-bold ml-4 mb-4">Sản phẩm</h2>

          {/* Hiển thị trạng thái tải hoặc lỗi */}
          {loading && <p className="w-full text-center">Đang tải sản phẩm...</p>}
          {error && <p className="w-full text-center text-red-500">{error}</p>}

          <div className="flex flex-wrap">
            {!loading &&
              !error &&
              (products.length > 0 ? (
                products.map(product => (
                  <div key={product._id} className="w-full sm:w-1/2 lg:w-1/4 p-4">
                    <div className="border border-gray-200 rounded overflow-hidden">
                      <img
                        src={product.imageUrl || '/default-image.jpg'}
                        className="w-full h-48 object-cover"
                        alt={product.name}
                      />
                      <div className="p-4">
                        <h5 className="text-lg font-semibold">{product.name}</h5>
                        <p className="text-sm">${product.price}</p>
                        <a
                          href={`/product/${product._id}`}
                          className="inline-block mt-2 bg-blue-500 text-white py-1 px-3 rounded"
                        >
                          Xem chi tiết
                        </a>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="w-full text-center">Không tìm thấy sản phẩm nào phù hợp.</p>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}
