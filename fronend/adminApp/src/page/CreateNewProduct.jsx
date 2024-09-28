// src/page/AdminPanel.js
import React, { useState, useContext } from 'react'
import { toast } from 'react-toastify'
import { EntitiesContext } from '../context/EntitiesContext'

const CreateNewProduct = () => {
  const { brands, categories, vehicles, loading } = useContext(EntitiesContext)

  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [brandId, setBrandId] = useState('')
  const [vehicleId, setVehicleId] = useState('')
  const [itemCode, setItemCode] = useState('')
  const [stock, setStock] = useState(0)
  const [imageUrl, setImageUrl] = useState('')
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
  const handleAddProduct = e => {
    e.preventDefault()

    if (!name || !price || !categoryId || !brandId || !vehicleId) {
      toast.error('Vui lòng nhập đầy đủ thông tin bắt buộc!')
      return
    }

    if (price <= 0) {
      toast.error('Giá sản phẩm phải lớn hơn 0!')
      return
    }

    setShowConfirmation(true)
  }

  const confirmAddProduct = async () => {
    const productData = {
      name,
      price: parseFloat(price),
      categoryId,
      brandId,
      vehicleId,
      itemCode: itemCode || '', // Nếu không nhập thì gán giá trị mặc định là chuỗi trống
      stock: parseInt(stock, 10) || 0, // Nếu không nhập thì gán giá trị mặc định là 0
      imageUrl: imageUrl || '', // Nếu không nhập thì gán giá trị mặc định là chuỗi trống
      specifications: {
        size: specifications.size || '', // Nếu không nhập thì gán giá trị mặc định là chuỗi trống
        material: specifications.material || '', // Tương tự cho các trường khác
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
        throw new Error(errorText || 'Thêm sản phẩm không thành công!')
      }

      const data = await response.json()
      toast.success('Thêm sản phẩm thành công!')
      setProducts(prevProducts => [...prevProducts, data.product])

      // Reset form sau khi thêm thành công
      setName('')
      setPrice('')
      setCategoryId('')
      setBrandId('')
      setVehicleId('')
      setItemCode('')
      setStock(0)
      setImageUrl('')
      setSpecifications({
        size: '',
        material: '',
        color: '',
        spokeCount: '',
        weight: '',
      })

      setShowConfirmation(false)
    } catch (error) {
      toast.error(error.message || 'Lỗi khi thêm sản phẩm!')
    }
  }

  const cancelAddProduct = () => {
    setShowConfirmation(false)
  }

  if (loading) {
    return <p className="text-white">Đang tải dữ liệu...</p>
  }

  return (
    <div className="text-white mb-20">
      <h1 className="text-3xl mb-6">Thêm Sản Phẩm</h1>
      <form onSubmit={handleAddProduct} className="space-y-4">
        {/* Tên sản phẩm */}
        <div>
          <label className="block mb-1">Tên sản phẩm</label>
          <input
            type="text"
            placeholder="Tên sản phẩm"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full bg-gray-700 text-white p-2 rounded"
            required
          />
        </div>

        {/* Giá sản phẩm */}
        <div>
          <label className="block mb-1">Giá sản phẩm</label>
          <input
            type="number"
            placeholder="Giá sản phẩm"
            value={price}
            onChange={e => setPrice(e.target.value)}
            className="w-full bg-gray-700 text-white p-2 rounded"
            required
          />
        </div>

        {/* Danh mục */}
        <div>
          <label className="block mb-1">Danh mục</label>
          <select
            value={categoryId}
            onChange={e => setCategoryId(e.target.value)}
            className="w-full bg-gray-700 text-white p-2 rounded"
            required
          >
            <option value="">Chọn danh mục</option>
            {categories.length > 0 ? (
              categories.map(category => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))
            ) : (
              <option disabled>Không có danh mục nào</option>
            )}
          </select>
        </div>

        {/* Thương hiệu */}
        <div>
          <label className="block mb-1">Thương hiệu</label>
          <select
            value={brandId}
            onChange={e => setBrandId(e.target.value)}
            className="w-full bg-gray-700 text-white p-2 rounded"
            required
          >
            <option value="">Chọn thương hiệu</option>
            {brands.length > 0 ? (
              brands.map(brand => (
                <option key={brand._id} value={brand._id}>
                  {brand.name}
                </option>
              ))
            ) : (
              <option disabled>Không có thương hiệu nào</option>
            )}
          </select>
        </div>

        {/* Phương tiện */}
        <div>
          <label className="block mb-1">Phương tiện</label>
          <select
            value={vehicleId}
            onChange={e => setVehicleId(e.target.value)}
            className="w-full bg-gray-700 text-white p-2 rounded"
            required
          >
            <option value="">Chọn phương tiện</option>
            {vehicles.length > 0 ? (
              vehicles.map(vehicle => (
                <option key={vehicle._id} value={vehicle._id}>
                  {vehicle.name}
                </option>
              ))
            ) : (
              <option disabled>Không có phương tiện nào</option>
            )}
          </select>
        </div>

        {/* Mã sản phẩm */}
        <div>
          <label className="block mb-1">Mã sản phẩm</label>
          <input
            type="text"
            placeholder="Mã sản phẩm"
            value={itemCode}
            onChange={e => setItemCode(e.target.value)}
            className="w-full bg-gray-700 text-white p-2 rounded"
          />
        </div>

        {/* Số lượng tồn kho */}
        <div>
          <label className="block mb-1">Số lượng tồn kho</label>
          <input
            type="number"
            placeholder="Số lượng tồn kho"
            value={stock}
            onChange={e => setStock(e.target.value)}
            className="w-full bg-gray-700 text-white p-2 rounded"
            min="0"
          />
        </div>

        {/* URL Hình ảnh */}
        <div>
          <label className="block mb-1">URL Hình ảnh</label>
          <input
            type="url"
            placeholder="URL Hình ảnh"
            value={imageUrl}
            onChange={e => setImageUrl(e.target.value)}
            className="w-full bg-gray-700 text-white p-2 rounded"
          />
        </div>
        <div>
          <label className="block mb-1">Kích thước</label>
          <input
            type="text"
            name="size"
            placeholder="Kích thước"
            value={specifications.size}
            onChange={handleSpecificationsChange}
            className="w-full bg-gray-700 text-white p-2 rounded"
          />
        </div>

        {/* Specifications: material */}
        <div>
          <label className="block mb-1">Chất liệu</label>
          <input
            type="text"
            name="material"
            placeholder="Chất liệu"
            value={specifications.material}
            onChange={handleSpecificationsChange}
            className="w-full bg-gray-700 text-white p-2 rounded"
          />
        </div>

        {/* Specifications: color */}
        <div>
          <label className="block mb-1">Màu sắc</label>
          <input
            type="text"
            name="color"
            placeholder="Màu sắc"
            value={specifications.color}
            onChange={handleSpecificationsChange}
            className="w-full bg-gray-700 text-white p-2 rounded"
          />
        </div>

        {/* Specifications: spokeCount */}
        <div>
          <label className="block mb-1">Số căm</label>
          <input
            type="number"
            name="spokeCount"
            placeholder="Số căm"
            value={specifications.spokeCount}
            onChange={handleSpecificationsChange}
            className="w-full bg-gray-700 text-white p-2 rounded"
          />
        </div>

        {/* Specifications: weight */}
        <div>
          <label className="block mb-1">Trọng lượng (kg)</label>
          <input
            type="number"
            name="weight"
            placeholder="Trọng lượng"
            value={specifications.weight}
            onChange={handleSpecificationsChange}
            className="w-full bg-gray-700 text-white p-2 rounded"
          />
        </div>

        {/* Nút thêm sản phẩm */}
        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700">
          Thêm sản phẩm
        </button>
      </form>

      {/* Cửa sổ xác nhận */}
      {showConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-800 p-6 rounded w-1/2">
            <h2 className="text-xl mb-4">Xác Nhận Thông Tin Sản Phẩm</h2>
            <p>
              <strong>Tên:</strong> {name}
            </p>
            <p>
              <strong>Giá:</strong> {price}
            </p>
            <p>
              <strong>Danh mục:</strong> {categories.find(cat => cat._id === categoryId)?.name || 'N/A'}
            </p>
            <p>
              <strong>Thương hiệu:</strong> {brands.find(br => br._id === brandId)?.name || 'N/A'}
            </p>
            <p>
              <strong>Phương tiện:</strong> {vehicles.find(v => v._id === vehicleId)?.name || 'N/A'}
            </p>
            <p>
              <strong>Mã sản phẩm:</strong> {itemCode || 'N/A'}
            </p>
            <p>
              <strong>Số lượng tồn kho:</strong> {stock}
            </p>
            <p>
              <strong>URL Hình ảnh:</strong> {imageUrl || 'N/A'}
            </p>
            <p>
              <strong>Kích thước:</strong> {specifications.size || 'N/A'}
            </p>
            <p>
              <strong>Chất liệu:</strong> {specifications.material || 'N/A'}
            </p>
            <p>
              <strong>Màu sắc:</strong> {specifications.color || 'N/A'}
            </p>
            <p>
              <strong>Số căm:</strong> {specifications.spokeCount || 'N/A'}
            </p>
            <p>
              <strong>Trọng lượng:</strong> {specifications.weight || 'N/A'} kg
            </p>

            <div className="mt-4 flex justify-end">
              <button
                onClick={confirmAddProduct}
                className="bg-green-500 text-white py-2 px-4 rounded mr-2 hover:bg-green-700"
              >
                Xác Nhận
              </button>
              <button onClick={cancelAddProduct} className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700">
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CreateNewProduct