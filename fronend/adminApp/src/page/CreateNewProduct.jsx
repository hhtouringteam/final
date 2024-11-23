// src/page/AdminPanel.js
import React, { useState, useContext } from 'react'
import { toast } from 'react-toastify'
import Select from 'react-select'
import { EntitiesContext } from '../context/EntitiesContext'

const CreateNewProduct = () => {
  const { brands = [], categories = [], vehicles = [], loading } = useContext(EntitiesContext)

  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [description, setDescription] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [brandId, setBrandId] = useState('')
  const [vehicleId, setVehicleId] = useState([])
  const [itemCode, setItemCode] = useState('')
  const [stock, setStock] = useState(0)
  const [imageUrl, setImageUrl] = useState([])
  const [imageFiles, setImageFiles] = useState([])
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [products, setProducts] = useState([])
  const [specifications, setSpecifications] = useState({
    size: '',
    material: '',
    color: '',
    spokeCount: '',
    weight: '',
  })

  const handleSpecificationsChange = e => {
    const { name, value } = e.target
    setSpecifications({
      ...specifications,
      [name]: value,
    })
  }
  const handleImageChange = e => {
    const files = Array.from(e.target.files)
    setImageFiles(prevFiles => [...prevFiles, ...files])
  }

  const handleUploadImages = async () => {
    const formData = new FormData()
    imageFiles.forEach(file => {
      formData.append('images', file)
    })

    try {
      const response = await fetch('http://localhost:5000/api/uploads', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Error uploading images!')
      }

      const data = await response.json()
      setImageUrl(data.imageUrls) // Save the URLs of the uploaded images
    } catch (error) {
      toast.error(error.message || 'Error uploading images!')
    }
  }
  const handleAddProduct = async e => {
    e.preventDefault()

    if (!name || !price || !description || !categoryId || !brandId || !vehicleId) {
      toast.error('Please fill in all required information!')
      return
    }

    if (price <= 0) {
      toast.error('Product price must be greater than 0!')
      return
    }
    await handleUploadImages()
    setShowConfirmation(true)
  }

  const confirmAddProduct = async () => {
    const productData = {
      name,
      price: parseFloat(price),
      description,
      categoryId,
      brandId,
      vehicleId,
      itemCode: itemCode || '', // If not entered, assign default value as empty string
      stock: parseInt(stock, 10) || 0, // If not entered, assign default value as 0
      imageUrl: imageUrl,
      specifications: {
        size: specifications.size || '', // If not entered, assign default value as empty string
        material: specifications.material || '', // Similarly for other fields
        color: specifications.color || '',
        spokeCount: specifications.spokeCount || 0,
        weight: specifications.weight || 0,
      },
    }

    try {
      const response = await fetch('http://localhost:5000/api/admin/products/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      })
      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || 'Failed to add product!')
      }
      const data = await response.json()
      toast.success('Product added successfully!')
      setProducts(prevProducts => [...prevProducts, data.product])
      setName('')
      setPrice('')
      setDescription('')
      setCategoryId('')
      setBrandId('')
      setVehicleId([])
      setItemCode('')
      setStock(0)
      setImageUrl([])
      setImageFiles([])
      setSpecifications({
        size: '',
        material: '',
        color: '',
        spokeCount: '',
        weight: '',
      })

      setShowConfirmation(false)
    } catch (error) {
      toast.error(error.message || 'Error adding product!')
    }
  }

  const cancelAddProduct = () => {
    setShowConfirmation(false)
  }

  if (loading) {
    return <p className="text-white">Loading data...</p>
  }
  const selectedCategory = categoryId ? categories.find(cat => cat?._id === categoryId) : null
  const selectedBrand = brandId ? brands.find(brand => brand?._id === brandId) : null
  const selectedVehicle = vehicleId ? vehicles.find(vehicle => vehicle?._id === vehicleId) : null
  const vehicleOptions = vehicles.map(vehicle => ({
    value: vehicle._id,
    label: vehicle.name,
  }))
  return (
    <div className="text-white mb-20">
      <h1 className="text-3xl mb-6">Add Product</h1>
      <form onSubmit={handleAddProduct} className="space-y-4">
        {/* Product Name */}
        <div>
          <label className="block mb-1">Product Name</label>
          <input
            type="text"
            placeholder="Product Name"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full bg-gray-700 text-white p-2 rounded"
            required
          />
        </div>

        {/* Product Price */}
        <div>
          <label className="block mb-1">Product Price</label>
          <input
            type="number"
            placeholder="Product Price"
            value={price}
            onChange={e => setPrice(e.target.value)}
            className="w-full bg-gray-700 text-white p-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Description</label>
          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="w-full bg-gray-700 text-white p-2 rounded"
            required
          />
        </div>

        {/* Category */}
        <div>
          <label className="block mb-1">Category</label>
          <select
            value={categoryId}
            onChange={e => setCategoryId(e.target.value)}
            className="w-full bg-gray-700 text-white p-2 rounded"
            required
          >
            <option value="">Select Category</option>
            {categories.length > 0 ? (
              categories.map(category => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))
            ) : (
              <option disabled>No categories available</option>
            )}
          </select>
        </div>

        {/* Brand */}
        <div>
          <label className="block mb-1">Brand</label>
          <select
            value={brandId}
            onChange={e => setBrandId(e.target.value)}
            className="w-full bg-gray-700 text-white p-2 rounded"
            required
          >
            <option value="">Select Brand</option>
            {brands.length > 0 ? (
              brands.map(brand => (
                <option key={brand._id} value={brand._id}>
                  {brand.name}
                </option>
              ))
            ) : (
              <option disabled>No brands available</option>
            )}
          </select>
        </div>

        {/* Vehicle */}
        <div>
          <label className="block mb-1">Vehicle</label>
          <Select
            isMulti
            options={vehicleOptions}
            value={vehicleOptions.filter(option => vehicleId.includes(option.value))}
            onChange={selectedOptions => setVehicleId(selectedOptions.map(option => option.value))}
            className="text-black"
            placeholder="Select Vehicle..."
          />
        </div>
        {/* Product Code */}
        <div>
          <label className="block mb-1">Product Code</label>
          <input
            type="text"
            placeholder="Product Code"
            value={itemCode}
            onChange={e => setItemCode(e.target.value)}
            className="w-full bg-gray-700 text-white p-2 rounded"
          />
        </div>

        {/* Stock Quantity */}
        <div>
          <label className="block mb-1">Stock Quantity</label>
          <input
            type="number"
            placeholder="Stock Quantity"
            value={stock}
            onChange={e => setStock(e.target.value)}
            className="w-full bg-gray-700 text-white p-2 rounded"
            min="0"
          />
        </div>

        {/* Choose Images */}

        <div>
          <label className="block mb-1">Choose Images</label>
          <button
            type="button"
            className="bg-blue-500 text-white py-2 px-4 rounded"
            onClick={() => document.getElementById('customFileInput').click()}
          >
            Choose File
          </button>
          <input id="customFileInput" type="file" multiple onChange={handleImageChange} className="hidden" />
          <div className="mt-2 flex flex-wrap gap-2">
            {imageFiles.map((file, index) => (
              <img
                key={index}
                src={URL.createObjectURL(file)}
                alt={`Vehicle Preview ${index + 1}`}
                className="w-20 h-20 object-cover rounded"
              />
            ))}
          </div>
        </div>
        <div>
          <label className="block mb-1">Size</label>
          <input
            type="text"
            name="size"
            placeholder="Size"
            value={specifications.size}
            onChange={handleSpecificationsChange}
            className="w-full bg-gray-700 text-white p-2 rounded"
          />
        </div>

        {/* Specifications: material */}
        <div>
          <label className="block mb-1">Material</label>
          <input
            type="text"
            name="material"
            placeholder="Material"
            value={specifications.material}
            onChange={handleSpecificationsChange}
            className="w-full bg-gray-700 text-white p-2 rounded"
          />
        </div>

        {/* Specifications: color */}
        <div>
          <label className="block mb-1">Color</label>
          <input
            type="text"
            name="color"
            placeholder="Color"
            value={specifications.color}
            onChange={handleSpecificationsChange}
            className="w-full bg-gray-700 text-white p-2 rounded"
          />
        </div>

        {/* Specifications: spokeCount */}
        <div>
          <label className="block mb-1">Number of Spokes</label>
          <input
            type="number"
            name="spokeCount"
            placeholder="Number of Spokes"
            value={specifications.spokeCount}
            onChange={handleSpecificationsChange}
            className="w-full bg-gray-700 text-white p-2 rounded"
          />
        </div>

        {/* Specifications: weight */}
        <div>
          <label className="block mb-1">Weight (kg)</label>
          <input
            type="number"
            name="weight"
            placeholder="Weight"
            value={specifications.weight}
            onChange={handleSpecificationsChange}
            className="w-full bg-gray-700 text-white p-2 rounded"
          />
        </div>

        {/* Add Product Button */}
        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700">
          Add Product
        </button>
      </form>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-800 p-6 rounded w-1/2">
            <h2 className="text-xl mb-4">Confirm Product Information</h2>
            <p>
              <strong>Name:</strong> {name}
            </p>
            <p>
              <strong>Price:</strong> {price}
            </p>
            <p>
              <strong>Category:</strong> {selectedCategory?.name || 'N/A'}
            </p>
            <p>
              <strong>Brand:</strong> {selectedBrand?.name || 'N/A'}
            </p>
            
            <p>
              <strong>Vehicle:</strong> {selectedVehicle?.name || 'N/A'}
            </p>
            <p>
              <strong>Product Code:</strong> {itemCode || 'N/A'}
            </p>
            <p>
              <strong>Stock Quantity:</strong> {stock}
            </p>
            <p>
              <strong>Image URLs:</strong> {imageUrl || 'N/A'}
            </p>
            <p>
              <strong>Size:</strong> {specifications.size || 'N/A'}
            </p>
            <p>
              <strong>Material:</strong> {specifications.material || 'N/A'}
            </p>
            <p>
              <strong>Color:</strong> {specifications.color || 'N/A'}
            </p>
            <p>
              <strong>Number of Spokes:</strong> {specifications.spokeCount || 'N/A'}
            </p>
            <p>
              <strong>Weight:</strong> {specifications.weight || 'N/A'} kg
            </p>

            <div className="mt-4 flex justify-end">
              <button
                onClick={confirmAddProduct}
                className="bg-green-500 text-white py-2 px-4 rounded mr-2 hover:bg-green-700"
              >
                Confirm
              </button>
              <button onClick={cancelAddProduct} className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CreateNewProduct
