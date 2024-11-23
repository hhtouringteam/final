// src/components/UpdateProduct.jsx

import React, { useState, useEffect, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import Select from 'react-select'
import { EntitiesContext } from '../context/EntitiesContext'

const UpdateProduct = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { brands, categories, vehicles, loading } = useContext(EntitiesContext)

  const [product, setProduct] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    categoryId: '',
    brandId: '',
    vehicleId: [],
    stock: '',
    specifications: {
      size: '',
      material: '',
      color: '',
      spokeCount: '',
      weight: '',
      // 'vachi' has been removed
    },
  })

  useEffect(() => {
    // Fetch product by ID
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/admin/products/${id}`)
        if (!response.ok) {
          throw new Error('Cannot fetch product!')
        }
        const data = await response.json()
        const fetchedProduct = data.product

        console.log('Fetched Product:', fetchedProduct)

        // Check and ensure that fetchedProduct.vehicleId is an array
        const vehicleIds = Array.isArray(fetchedProduct.vehicleId)
          ? fetchedProduct.vehicleId.map(vehicle => vehicle._id)
          : []

        setProduct(fetchedProduct)
        setFormData({
          name: fetchedProduct.name || '',
          price: fetchedProduct.price || '',
          description: fetchedProduct.description || '',
          categoryId: fetchedProduct.categoryId?._id || '',
          brandId: fetchedProduct.brandId?._id || '',
          vehicleId: vehicleIds || [], // Ensure vehicleId is an array of ObjectIds
          stock: fetchedProduct.stock || '',
          specifications: {
            size: fetchedProduct.specifications?.size || '',
            material: fetchedProduct.specifications?.material || '',
            color: fetchedProduct.specifications?.color || '',
            spokeCount: fetchedProduct.specifications?.spokeCount || '',
            weight: fetchedProduct.specifications?.weight || '',
          },
        })
      } catch (error) {
        toast.error(error.message || 'Error fetching product!')
        console.error('Error fetching product:', error)
      }
    }
    fetchProduct()
  }, [id])

  const handleInputChange = e => {
    const { name, value } = e.target
    if (name.startsWith('specifications.')) {
      const specField = name.split('.')[1]
      setFormData(prevFormData => ({
        ...prevFormData,
        specifications: {
          ...prevFormData.specifications,
          [specField]: value,
        },
      }))
    } else {
      setFormData(prevFormData => ({
        ...prevFormData,
        [name]: value,
      }))
    }
  }

  // Handle changes for vehicleId using react-select
  const handleVehicleChange = selectedOptions => {
    const selectedVehicleIds = selectedOptions ? selectedOptions.map(option => option.value) : []
    setFormData(prevFormData => ({
      ...prevFormData,
      vehicleId: selectedVehicleIds,
    }))
  }

  const handleUpdateProduct = async e => {
    e.preventDefault()

    // Validate data if necessary
    if (
      !formData.name ||
      !formData.price ||
      !formData.description ||
      !formData.categoryId ||
      !formData.brandId ||
      formData.vehicleId.length === 0
    ) {
      toast.error('Please fill in all required information!')
      return
    }

    const updatedData = {
      name: formData.name,
      price: parseFloat(formData.price),
      description: formData.description,
      categoryId: formData.categoryId,
      brandId: formData.brandId,
      vehicleId: formData.vehicleId, // Ensure vehicleId is an array
      stock: parseInt(formData.stock, 10) || 0,
      specifications: {
        size: formData.specifications.size,
        material: formData.specifications.material,
        color: formData.specifications.color,
        spokeCount: parseInt(formData.specifications.spokeCount, 10) || 0,
        weight: parseFloat(formData.specifications.weight) || 0,
      },
    }

    try {
      const response = await fetch(`http://localhost:5000/api/admin/products/update/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Product update failed!')
      }

      const data = await response.json()
      toast.success('Product updated successfully!')
      navigate('/list') // Redirect to product list after update
    } catch (error) {
      toast.error(error.message || 'Error updating product!')
      console.error('Error updating product:', error)
    }
  }

  if (loading || !product) {
    return <p className="text-white">Loading data...</p>
  }

  // Map vehicles from EntitiesContext to options for react-select
  const vehicleOptions = Array.isArray(vehicles)
    ? vehicles.map(vehicle => ({
        value: vehicle._id,
        label: vehicle.name,
      }))
    : []

  // Create a list of selected options based on formData.vehicleId
  const selectedVehicles = vehicleOptions.filter(option => formData.vehicleId.includes(option.value))

  return (
    <div className="text-white px-8 pb-20">
      <h1 className="text-4xl font-bold mb-8 text-center">Update Product</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Current Information */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Current Information</h2>
          {product && (
            <div>
              <p>
                <strong>Name:</strong> {product.name}
              </p>
              <p>
                <strong>Price:</strong> {product.price.toLocaleString()} VND
              </p>
              <p>
                <strong>Description:</strong> {product.description}
              </p>
              <p>
                <strong>Category:</strong> {product.categoryId?.name || 'N/A'}
              </p>
              <p>
                <strong>Brand:</strong> {product.brandId?.name || 'N/A'}
              </p>
              <p>
                <strong>Vehicle:</strong>{' '}
                {Array.isArray(product.vehicleId) && product.vehicleId.length > 0
                  ? product.vehicleId.map(v => v.name).join(', ')
                  : 'N/A'}
              </p>
              <p>
                <strong>Stock Quantity:</strong> {product.stock}
              </p>
              <p>
                <strong>Specifications:</strong>
              </p>
              <p>
                <strong>Size:</strong> {product.specifications?.size || 'N/A'}
              </p>
              <p>
                <strong>Material:</strong> {product.specifications?.material || 'N/A'}
              </p>
              <p>
                <strong>Color:</strong> {product.specifications?.color || 'N/A'}
              </p>
              <p>
                <strong>Number of Spokes:</strong> {product.specifications?.spokeCount || 'N/A'}
              </p>
              <p>
                <strong>Weight:</strong> {product.specifications?.weight || 'N/A'} kg
              </p>
            </div>
          )}
        </div>

        {/* Update Form */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Update Information</h2>
          <form onSubmit={handleUpdateProduct} className="space-y-4 text-white">
            {/* Product Name */}
            <div>
              <label className="block mb-1">Product Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full bg-gray-700 text-white p-2 rounded"
                required
              />
            </div>

            {/* Product Price */}
            <div>
              <label className="block mb-1">Product Price</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className="w-full bg-gray-700 text-white p-2 rounded"
                required
                min="0"
              />
            </div>

            {/* Product Description */}
            <div>
              <label className="block mb-1">Product Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full bg-gray-700 text-white p-2 rounded"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="block mb-1">Category</label>
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleInputChange}
                className="w-full bg-gray-700 text-white p-2 rounded"
                required
              >
                <option value="">Select Category</option>
                {Array.isArray(categories) && categories.length > 0 ? (
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
                name="brandId"
                value={formData.brandId}
                onChange={handleInputChange}
                className="w-full bg-gray-700 text-white p-2 rounded"
                required
              >
                <option value="">Select Brand</option>
                {Array.isArray(brands) && brands.length > 0 ? (
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

            {/* Vehicle using react-select */}
            <div>
              <label className="block mb-1">Vehicle</label>
              <Select
                isMulti
                options={vehicleOptions}
                value={selectedVehicles}
                onChange={handleVehicleChange}
                className="text-black"
                placeholder="Select Vehicle..."
              />
            </div>

            {/* Stock Quantity */}
            <div>
              <label className="block mb-1">Stock Quantity</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleInputChange}
                className="w-full bg-gray-700 text-white p-2 rounded"
                min="0"
              />
            </div>

            {/* Specifications: size */}
            <div>
              <label className="block mb-1">Size</label>
              <input
                type="text"
                name="specifications.size"
                placeholder="Size"
                value={formData.specifications.size}
                onChange={handleInputChange}
                className="w-full bg-gray-700 text-white p-2 rounded"
              />
            </div>

            {/* Specifications: material */}
            <div>
              <label className="block mb-1">Material</label>
              <input
                type="text"
                name="specifications.material"
                placeholder="Material"
                value={formData.specifications.material}
                onChange={handleInputChange}
                className="w-full bg-gray-700 text-white p-2 rounded"
              />
            </div>

            {/* Specifications: color */}
            <div>
              <label className="block mb-1">Color</label>
              <input
                type="text"
                name="specifications.color"
                placeholder="Color"
                value={formData.specifications.color}
                onChange={handleInputChange}
                className="w-full bg-gray-700 text-white p-2 rounded"
              />
            </div>

            {/* Specifications: spokeCount */}
            <div>
              <label className="block mb-1">Number of Spokes</label>
              <input
                type="number"
                name="specifications.spokeCount"
                placeholder="Number of Spokes"
                value={formData.specifications.spokeCount}
                onChange={handleInputChange}
                className="w-full bg-gray-700 text-white p-2 rounded"
                min="0"
              />
            </div>

            {/* Specifications: weight */}
            <div>
              <label className="block mb-1">Weight (kg)</label>
              <input
                type="number"
                name="specifications.weight"
                placeholder="Weight"
                value={formData.specifications.weight}
                onChange={handleInputChange}
                className="w-full bg-gray-700 text-white p-2 rounded"
                min="0"
              />
            </div>

            {/* Submit Button */}
            <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700">
              Update Product
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default UpdateProduct
