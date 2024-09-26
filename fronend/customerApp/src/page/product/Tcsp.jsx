import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight, faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { Slider, Typography, Box, Collapse, Button } from '@mui/material'

export default function Tcsp() {
  const [products, setProducts] = useState([])
  // const [categ, setcate] = useState([]) //cate

  // React.useEffect(()=>{
  //   const api = fetch('/mongo..../producs')
  //   .then(...)
  //   setProducts(api)

   //   const cate = fetch('/mongo..../caateg')
  //   .then(...)
  //   setcate(cate)
  // },[])

  const [selectedCategories, setSelectedCategories] = useState([])
  const [selectedBrands, setSelectedBrands] = useState([])
  const [selectedModels, setSelectedModels] = useState([])
  const [activeFilter, setActiveFilter] = useState('')
  const [priceRange, setPriceRange] = useState([0, 7500])

  const toggleFilter = filter => {
    setActiveFilter(activeFilter === filter ? '' : filter)
  }

  const handleCategoryChange = category => {
    setSelectedCategories(prev => (prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]))
  }

  const handleBrandChange = brand => {
    setSelectedBrands(prev => (prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]))
  }

  const handleModelChange = model => {
    setSelectedModels(prev => (prev.includes(model) ? prev.filter(m => m !== model) : [...prev, model]))
  }

  // Lọc sản phẩm dựa trên danh mục, thương hiệu và model đã chọn
  const filteredProducts = products.filter(
    product =>
      (selectedCategories.length === 0 || selectedCategories.includes(product.category)) &&
      (selectedBrands.length === 0 || selectedBrands.includes(product.brand)) &&
      (selectedModels.length === 0 || selectedModels.includes(product.model)) &&
      product.price >= priceRange[0] &&
      product.price <= priceRange[1],
  )

  // Hàm đếm số lượng sản phẩm theo category, brand, model
  const countProductsByCategory = category => products.filter(product => product.category === category).length
  const countProductsByBrand = brand => products.filter(product => product.brand === brand).length
  const countProductsByModel = model => products.filter(product => product.model === model).length

  const handlePriceChange = (event, newValue) => {
    // 500, 700
    setPriceRange(newValue)
  }
  // [800, 1500]

  return (
    <div className="container mx-auto mt-20 p-10">
      <div className="flex flex-wrap">
        <div className="w-full md:w-1/4 pr-4 border-r border-gray-300">
          <ul className="space-y-2">
            {/* Category Filter */}
            <li>
              <button
                onClick={() => toggleFilter('category')}
                className="font-bold text-left flex justify-between items-center"
              >
                <FontAwesomeIcon icon={activeFilter === 'category' ? faChevronDown : faChevronRight} className="mr-2" />
                Category
              </button>
              <Collapse in={activeFilter === 'category'}>
                <ul className="pl-4 mt-2 space-y-1">
                  <li>
                    <input
                      type="checkbox"
                      id="3d-printers"
                      checked={selectedCategories.includes('3D Printers')}
                      onChange={() => handleCategoryChange('3D Printers')}
                    />
                    <label htmlFor="3d-printers">3D Printers ({countProductsByCategory('3D Printers')})</label>
                  </li>
                  <li>
                    <input
                      type="checkbox"
                      id="activated-carbon"
                      checked={selectedCategories.includes('Activated Carbon')}
                      onChange={() => handleCategoryChange('Activated Carbon')}
                    />
                    <label htmlFor="activated-carbon">
                      Activated Carbon ({countProductsByCategory('Activated Carbon')})
                    </label>
                  </li>
                  <li>
                    <input
                      type="checkbox"
                      id="adapters"
                      checked={selectedCategories.includes('Adapters')}
                      onChange={() => handleCategoryChange('Adapters')}
                    />
                    <label htmlFor="adapters">Adapters ({countProductsByCategory('Adapters')})</label>
                  </li>
                  <li>
                    <input
                      type="checkbox"
                      id="air-to-air"
                      checked={selectedCategories.includes('Air-To-Air')}
                      onChange={() => handleCategoryChange('Air-To-Air')}
                    />
                    <label htmlFor="air-to-air">Air-To-Air ({countProductsByCategory('Air-To-Air')})</label>
                  </li>
                </ul>
              </Collapse>
            </li>
            {/* Brand Filter */}
            <li>
              <button
                onClick={() => toggleFilter('brand')}
                className="font-bold text-left flex justify-between items-center"
              >
                <FontAwesomeIcon icon={activeFilter === 'brand' ? faChevronDown : faChevronRight} className="mr-2" />
                Brand
              </button>
              <Collapse in={activeFilter === 'brand'}>
                <ul className="pl-4 mt-2 space-y-1">
                  <li>
                    <input
                      type="checkbox"
                      id="samsung"
                      checked={selectedBrands.includes('Samsung')}
                      onChange={() => handleBrandChange('Samsung')}
                    />
                    <label htmlFor="samsung">Samsung ({countProductsByBrand('Samsung')})</label>
                  </li>
                  <li>
                    <input
                      type="checkbox"
                      id="apple"
                      checked={selectedBrands.includes('Apple')}
                      onChange={() => handleBrandChange('Apple')}
                    />
                    <label htmlFor="apple">Apple ({countProductsByBrand('Apple')})</label>
                  </li>
                  <li>
                    <input
                      type="checkbox"
                      id="sony"
                      checked={selectedBrands.includes('Sony')}
                      onChange={() => handleBrandChange('Sony')}
                    />
                    <label htmlFor="sony">Sony ({countProductsByBrand('Sony')})</label>
                  </li>
                </ul>
              </Collapse>
            </li>
            {/* Model Filter */}
            <li>
              <button
                onClick={() => toggleFilter('model')}
                className="font-bold text-left flex justify-between items-center"
              >
                <FontAwesomeIcon icon={activeFilter === 'model' ? faChevronDown : faChevronRight} className="mr-2" />
                Model
              </button>
              <Collapse in={activeFilter === 'model'}>
                <ul className="pl-4 mt-2 space-y-1">
                  <li>
                    <input
                      type="checkbox"
                      id="model-x"
                      checked={selectedModels.includes('Model X')}
                      onChange={() => handleModelChange('Model X')}
                    />
                    <label htmlFor="model-x">Model X ({countProductsByModel('Model X')})</label>
                  </li>
                  <li>
                    <input
                      type="checkbox"
                      id="model-y"
                      checked={selectedModels.includes('Model Y')}
                      onChange={() => handleModelChange('Model Y')}
                    />
                    <label htmlFor="model-y">Model Y ({countProductsByModel('Model Y')})</label>
                  </li>
                  <li>
                    <input
                      type="checkbox"
                      id="model-Z"
                      checked={selectedModels.includes('Model Z')}
                      onChange={() => handleModelChange('Model Z')}
                    />
                    <label htmlFor="model-Z">Model Z ({countProductsByModel('Model Z')})</label>
                  </li>
                </ul>
              </Collapse>
            </li>
            {/* Price Filter */}
            <li>
              <button
                onClick={() => toggleFilter('price')}
                className="font-bold text-left flex justify-between items-center"
              >
                <FontAwesomeIcon icon={activeFilter === 'price' ? faChevronDown : faChevronRight} className="mr-2" />
                Filter by Price
              </button>
              <Collapse in={activeFilter === 'price'}>
                <Box pl={2} mt={2} position="relative">
                  <Typography gutterBottom>Price range</Typography>
                  <Slider
                    value={priceRange}
                    onChange={handlePriceChange}
                    min={0}
                    max={7500}
                    valueLabelDisplay="auto"
                    aria-labelledby="range-slider"
                    sx={{
                      width: '80%',
                      height: 4,
                      '& .MuiSlider-thumb': {
                        width: 12,
                        height: 12,
                        '&:hover': {
                          boxShadow: '0px 0px 0px 8px rgba(58, 133, 255, 0.16)',
                        },
                      },
                      '& .MuiSlider-track': {
                        height: 4,
                      },
                      '& .MuiSlider-rail': {
                        height: 4,
                      },
                    }}
                  />
                  <Typography className="text-sm text-center mt-2">
                    Price: ${priceRange[0]} - ${priceRange[1]}
                  </Typography>
                </Box>
              </Collapse>
            </li>
          </ul>
        </div>

        <div className="w-full md:w-3/4 ">
          <h2 className="text-2xl font-bold ml-4">Products</h2>
          <div className="flex flex-wrap">
            {filteredProducts.map(product => (
              <div key={product.id} className="w-full sm:w-1/2 lg:w-1/4 p-4">
                <div className="border border-gray-200 rounded overflow-hidden">
                  <img src={product.image} className="w-full h-48 object-cover" alt={product.name} />
                  <div className="p-4">
                    <h5 className="text-lg font-semibold">{product.name}</h5>
                    <p className="text-sm">{product.price}</p>
                    <a href="!" className="inline-block mt-2 bg-blue-500 text-white py-1 px-3 rounded">
                      {product.view}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
