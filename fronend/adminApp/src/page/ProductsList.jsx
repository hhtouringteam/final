// src/components/ProductsList.jsx

import React, { useState, useEffect, useContext } from 'react'
import { toast } from 'react-toastify'
import { Link } from 'react-router-dom'
import { EntitiesContext } from '../context/EntitiesContext'

const ProductsList = () => {
  const { brands, categories, vehicles, loading } = useContext(EntitiesContext)
  const [products, setProducts] = useState([])
  const [filters, setFilters] = useState({
    name: '',
    category: '',
    brand: '',
    vehicle: '',
    stock: '',
  })
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [productToDelete, setProductToDelete] = useState(null)

  const fetchProducts = async () => {
    try {
      const query = new URLSearchParams(filters).toString()
      const response = await fetch(`http://localhost:5000/api/admin/products?${query}`)
      if (!response.ok) {
        throw new Error('Unable to fetch product list!')
      }
      const data = await response.json()
      setProducts(data.products || [])
      console.log('Fetched Products:', data.products)
    } catch (error) {
      console.error('Error fetching products:', error)
      toast.error('Error fetching product list!')
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [filters])

  const handleInputChange = e => {
    const { name, value } = e.target
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value,
    }))
  }

  const handleSearch = e => {
    e.preventDefault()
    fetchProducts()
  }

  const handleDeleteClick = product => {
    setProductToDelete(product)
    setShowConfirmation(true)
  }

  const confirmDeleteProduct = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/products/delete/${productToDelete._id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success('Product has been deleted!')
        setProducts(prevProducts => prevProducts.filter(product => product._id !== productToDelete._id))
      } else {
        const errorData = await response.json()
        toast.error(errorData.message || 'Failed to delete product!')
      }
    } catch (error) {
      console.error('Error deleting product:', error)
      toast.error('Error deleting product!')
    }
    setShowConfirmation(false)
  }

  const cancelDelete = () => {
    setShowConfirmation(false)
  }

  return (
    <div className="text-white mb-20 px-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Product List</h1>

      {/* Search and Filter Form */}
      <form className="mb-8" onSubmit={handleSearch}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={filters.name}
            onChange={handleInputChange}
            className="w-full bg-gray-700 text-white p-2 rounded"
          />
          <select
            name="category"
            value={filters.category}
            onChange={handleInputChange}
            className="w-full bg-gray-700 text-white p-2 rounded"
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
          <select
            name="brand"
            value={filters.brand}
            onChange={handleInputChange}
            className="w-full bg-gray-700 text-white p-2 rounded"
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
          <select
            name="vehicle"
            value={filters.vehicle}
            onChange={handleInputChange}
            className="w-full bg-gray-700 text-white p-2 rounded"
          >
            <option value="">Select Vehicle</option>
            {Array.isArray(vehicles) && vehicles.length > 0 ? (
              vehicles.map(vehicle => (
                <option key={vehicle._id} value={vehicle._id}>
                  {vehicle.name}
                </option>
              ))
            ) : (
              <option disabled>No vehicles available</option>
            )}
          </select>
          <input
            type="number"
            name="stock"
            placeholder="Stock Quantity"
            value={filters.stock}
            onChange={handleInputChange}
            className="w-full bg-gray-700 text-white p-2 rounded"
            min="0"
          />
        </div>
        <button type="submit" className="mt-4 bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-700">
          Search
        </button>
      </form>

      <div className="overflow-x-auto bg-gray-800 shadow-md rounded-lg">
        {loading ? (
          <p className="text-center py-8">Loading data...</p>
        ) : products && products.length === 0 ? (
          <p className="text-center py-8">No products available.</p>
        ) : (
          <table className="min-w-full leading-normal">
            <thead>
              <tr className="bg-gray-900">
                <th className="px-5 py-3 border-b-2 border-gray-700 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  No.
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-700 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-700 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Image
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-700 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-700 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-700 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Brand
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-700 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Vehicle
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-700 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Stock Quantity
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-700 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Specifications
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-700 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr key={product._id} className="hover:bg-gray-700 transition-colors">
                  <td className="px-5 py-5 border-b border-gray-700 text-sm">{index + 1}</td>
                  <td className="px-5 py-5 border-b border-gray-700 text-sm">{product.name}</td>
                  <td className="px-5 py-5 border-b border-gray-700 text-sm">
                    {Array.isArray(product.imageUrl) && product.imageUrl.length > 0 ? (
                      <img
                        src={product.imageUrl[0]}
                        alt={`${product.name} 1`}
                        className="w-16 h-16 object-cover rounded"
                      />
                    ) : (
                      'No image'
                    )}
                  </td>
                  <td className="px-5 py-5 border-b border-gray-700 text-sm">{product.price.toLocaleString()} VND</td>
                  <td className="px-5 py-5 border-b border-gray-700 text-sm">{product.categoryId?.name || 'N/A'}</td>
                  <td className="px-5 py-5 border-b border-gray-700 text-sm">{product.brandId?.name || 'N/A'}</td>
                  <td className="px-5 py-5 border-b border-gray-700 text-sm">
                    {Array.isArray(product.vehicleId) && product.vehicleId.length > 0
                      ? product.vehicleId.map(v => v.name).join(', ')
                      : 'N/A'}
                  </td>
                  <td className="px-5 py-5 border-b border-gray-700 text-sm">{product.stock}</td>
                  <td className="px-5 py-5 border-b border-gray-700 text-sm">
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
                      <strong>Spoke Count:</strong> {product.specifications?.spokeCount || 'N/A'}
                    </p>
                    <p>
                      <strong>Weight:</strong> {product.specifications?.weight || 'N/A'} kg
                    </p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-700 text-sm">
                    <div className="flex space-x-2">
                      <Link
                        to={`/update/${product._id}`}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
                      >
                        Update
                      </Link>
                      <button
                        onClick={() => handleDeleteClick(product)}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-800 p-6 rounded-lg w-1/3 text-white">
            <h2 className="text-xl font-semibold mb-4">Confirm Delete Product</h2>
            <p>
              Are you sure you want to delete the product "<strong>{productToDelete?.name}</strong>"?
            </p>
            <div className="mt-6 flex justify-end">
              <button
                onClick={confirmDeleteProduct}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 mr-2"
              >
                Delete
              </button>
              <button onClick={cancelDelete} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductsList
