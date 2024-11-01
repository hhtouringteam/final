// src/components/ProductsList.jsx

import React, { useState, useEffect, useContext } from 'react'
import { toast } from 'react-toastify'
import { Link } from 'react-router-dom'
import { EntitiesContext } from '../context/EntitiesContext'

const ProductsList = () => {
  const { brands, categories, vehicles, loading } = useContext(EntitiesContext)
  const [products, setProducts] = useState([]) // Khởi tạo với mảng rỗng
  const [filters, setFilters] = useState({
    name: '',
    category: '',
    brand: '',
    vehicle: '',
    stock: '',
  })

  const [showConfirmation, setShowConfirmation] = useState(false)
  const [productToDelete, setProductToDelete] = useState(null)

  // Fetch danh sách sản phẩm từ API
  const fetchProducts = async () => {
    try {
      const query = new URLSearchParams(filters).toString() // Tạo query string từ filters
      const response = await fetch(`http://localhost:5000/api/admin/products?${query}`)
      if (!response.ok) {
        throw new Error('Không thể fetch danh sách sản phẩm!')
      }
      const data = await response.json()
      setProducts(data.products || []) // Nếu không có products, trả về mảng rỗng
      console.log('Fetched Products:', data.products) // Debug dữ liệu trả về
    } catch (error) {
      console.error('Error fetching products:', error)
      toast.error('Lỗi khi fetch danh sách sản phẩm!')
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
    fetchProducts() // Gọi lại hàm fetchProducts khi người dùng tìm kiếm
  }

  // Hiển thị modal xác nhận
  const handleDeleteClick = product => {
    setProductToDelete(product)
    setShowConfirmation(true)
  }

  // Xử lý xóa sản phẩm
  const confirmDeleteProduct = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/products/delete/${productToDelete._id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success('Sản phẩm đã được xóa!')
        setProducts(prevProducts => prevProducts.filter(product => product._id !== productToDelete._id))
      } else {
        const errorData = await response.json()
        toast.error(errorData.message || 'Xóa sản phẩm không thành công!')
      }
    } catch (error) {
      console.error('Error deleting product:', error)
      toast.error('Lỗi khi xóa sản phẩm!')
    }
    setShowConfirmation(false)
  }

  const cancelDelete = () => {
    setShowConfirmation(false)
  }

  return (
    <div className="text-white mb-20 px-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Danh Sách Sản Phẩm</h1>

      {/* Form Tìm kiếm và Lọc */}
      <form className="mb-8" onSubmit={handleSearch}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <input
            type="text"
            name="name"
            placeholder="Tên sản phẩm"
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
            <option value="">Chọn danh mục</option>
            {Array.isArray(categories) && categories.length > 0 ? (
              categories.map(category => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))
            ) : (
              <option disabled>Không có danh mục nào</option>
            )}
          </select>
          <select
            name="brand"
            value={filters.brand}
            onChange={handleInputChange}
            className="w-full bg-gray-700 text-white p-2 rounded"
          >
            <option value="">Chọn thương hiệu</option>
            {Array.isArray(brands) && brands.length > 0 ? (
              brands.map(brand => (
                <option key={brand._id} value={brand._id}>
                  {brand.name}
                </option>
              ))
            ) : (
              <option disabled>Không có thương hiệu nào</option>
            )}
          </select>
          <select
            name="vehicle"
            value={filters.vehicle}
            onChange={handleInputChange}
            className="w-full bg-gray-700 text-white p-2 rounded"
          >
            <option value="">Chọn phương tiện</option>
            {Array.isArray(vehicles) && vehicles.length > 0 ? (
              vehicles.map(vehicle => (
                <option key={vehicle._id} value={vehicle._id}>
                  {vehicle.name}
                </option>
              ))
            ) : (
              <option disabled>Không có phương tiện nào</option>
            )}
          </select>
          <input
            type="number"
            name="stock"
            placeholder="Số lượng tồn kho"
            value={filters.stock}
            onChange={handleInputChange}
            className="w-full bg-gray-700 text-white p-2 rounded"
            min="0"
          />
        </div>
        <button type="submit" className="mt-4 bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-700">
          Tìm kiếm
        </button>
      </form>

      <div className="overflow-x-auto bg-gray-800 shadow-md rounded-lg">
        {loading ? (
          <p className="text-center py-8">Đang tải dữ liệu...</p>
        ) : products && products.length === 0 ? (
          <p className="text-center py-8">Chưa có sản phẩm nào.</p>
        ) : (
          <table className="min-w-full leading-normal">
            <thead>
              <tr className="bg-gray-900">
                <th className="px-5 py-3 border-b-2 border-gray-700 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  STT
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-700 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Tên
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-700 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Ảnh
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-700 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Giá
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-700 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Danh mục
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-700 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Thương hiệu
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-700 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Phương tiện
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-700 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Số lượng tồn kho
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-700 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Thông số kỹ thuật
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-700 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Hành động
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
                      'Không có ảnh'
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
                      <strong>Kích thước:</strong> {product.specifications?.size || 'N/A'}
                    </p>
                    <p>
                      <strong>Chất liệu:</strong> {product.specifications?.material || 'N/A'}
                    </p>
                    <p>
                      <strong>Màu sắc:</strong> {product.specifications?.color || 'N/A'}
                    </p>
                    <p>
                      <strong>Số căm:</strong> {product.specifications?.spokeCount || 'N/A'}
                    </p>
                    <p>
                      <strong>Trọng lượng:</strong> {product.specifications?.weight || 'N/A'} kg
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

      {/* Modal xác nhận xóa */}
      {showConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-800 p-6 rounded-lg w-1/3 text-white">
            <h2 className="text-xl font-semibold mb-4">Xác nhận xóa sản phẩm</h2>
            <p>
              Bạn có chắc chắn muốn xóa sản phẩm "<strong>{productToDelete?.name}</strong>" không?
            </p>
            <div className="mt-6 flex justify-end">
              <button
                onClick={confirmDeleteProduct}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 mr-2"
              >
                Xóa
              </button>
              <button onClick={cancelDelete} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700">
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductsList
