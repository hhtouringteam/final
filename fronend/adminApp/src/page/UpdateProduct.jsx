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
      // vachi đã được loại bỏ
    },
  })

  useEffect(() => {
    // Fetch sản phẩm bằng ID
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/admin/products/${id}`)
        if (!response.ok) {
          throw new Error('Không thể fetch sản phẩm!')
        }
        const data = await response.json()
        const fetchedProduct = data.product

        console.log('Fetched Product:', fetchedProduct)

        // Kiểm tra và đảm bảo rằng fetchedProduct.vehicleId là mảng
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
          vehicleId: vehicleIds || [], // Đảm bảo vehicleId là mảng các ObjectId
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
        toast.error(error.message || 'Lỗi khi fetch sản phẩm!')
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

  // Xử lý thay đổi cho vehicleId sử dụng react-select
  const handleVehicleChange = selectedOptions => {
    const selectedVehicleIds = selectedOptions ? selectedOptions.map(option => option.value) : []
    setFormData(prevFormData => ({
      ...prevFormData,
      vehicleId: selectedVehicleIds,
    }))
  }

  const handleUpdateProduct = async e => {
    e.preventDefault()

    // Kiểm tra dữ liệu nếu cần thiết
    if (
      !formData.name ||
      !formData.price ||
      !formData.description ||
      !formData.categoryId ||
      !formData.brandId ||
      formData.vehicleId.length === 0
    ) {
      toast.error('Vui lòng nhập đầy đủ thông tin bắt buộc!')
      return
    }

    const updatedData = {
      name: formData.name,
      price: parseFloat(formData.price),
      description: formData.description,
      categoryId: formData.categoryId,
      brandId: formData.brandId,
      vehicleId: formData.vehicleId, // Đảm bảo vehicleId là mảng
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
        throw new Error(errorData.message || 'Cập nhật sản phẩm không thành công!')
      }

      const data = await response.json()
      toast.success('Cập nhật sản phẩm thành công!')
      navigate('/list') // Chuyển hướng về danh sách sản phẩm sau khi cập nhật
    } catch (error) {
      toast.error(error.message || 'Lỗi khi cập nhật sản phẩm!')
      console.error('Error updating product:', error)
    }
  }

  if (loading || !product) {
    return <p className="text-white">Đang tải dữ liệu...</p>
  }

  // Map vehicles từ EntitiesContext thành các option cho react-select
  const vehicleOptions = Array.isArray(vehicles)
    ? vehicles.map(vehicle => ({
        value: vehicle._id,
        label: vehicle.name,
      }))
    : []

  // Tạo danh sách các option đã chọn dựa trên formData.vehicleId
  const selectedVehicles = vehicleOptions.filter(option => formData.vehicleId.includes(option.value))

  return (
    <div className="text-white px-8 pb-20">
      <h1 className="text-4xl font-bold mb-8 text-center">Cập Nhật Sản Phẩm</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Bảng Thông Tin Hiện Tại */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Thông Tin Hiện Tại</h2>
          {product && (
            <div>
              <p>
                <strong>Tên:</strong> {product.name}
              </p>
              <p>
                <strong>Giá:</strong> {product.price.toLocaleString()} VND
              </p>
              <p>
                <strong>Mô tả:</strong> {product.description}
              </p>
              <p>
                <strong>Danh mục:</strong> {product.categoryId?.name || 'N/A'}
              </p>
              <p>
                <strong>Thương hiệu:</strong> {product.brandId?.name || 'N/A'}
              </p>
              <p>
                <strong>Phương tiện:</strong>
                {Array.isArray(product.vehicleId) && product.vehicleId.length > 0
                  ? product.vehicleId.map(v => v.name).join(', ')
                  : 'N/A'}
              </p>
              <p>
                <strong>Số lượng tồn kho:</strong> {product.stock}
              </p>
              <p>
                <strong>Thông số kỹ thuật:</strong>
              </p>
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
            </div>
          )}
        </div>

        {/* Form Cập Nhật */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Cập Nhật Thông Tin</h2>
          <form onSubmit={handleUpdateProduct} className="space-y-4 text-white">
            {/* Tên sản phẩm */}
            <div>
              <label className="block mb-1">Tên sản phẩm</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full bg-gray-700 text-white p-2 rounded"
                required
              />
            </div>

            {/* Giá sản phẩm */}
            <div>
              <label className="block mb-1">Giá sản phẩm</label>
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

            {/* Mô tả sản phẩm */}
            <div>
              <label className="block mb-1">Mô tả sản phẩm</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full bg-gray-700 text-white p-2 rounded"
                required
              />
            </div>

            {/* Danh mục */}
            <div>
              <label className="block mb-1">Danh mục</label>
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleInputChange}
                className="w-full bg-gray-700 text-white p-2 rounded"
                required
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
            </div>

            {/* Thương hiệu */}
            <div>
              <label className="block mb-1">Thương hiệu</label>
              <select
                name="brandId"
                value={formData.brandId}
                onChange={handleInputChange}
                className="w-full bg-gray-700 text-white p-2 rounded"
                required
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
            </div>

            {/* Phương tiện sử dụng react-select */}
            <div>
              <label className="block mb-1">Phương tiện</label>
              <Select
                isMulti
                options={vehicleOptions}
                value={selectedVehicles}
                onChange={handleVehicleChange}
                className="text-black"
                placeholder="Chọn phương tiện..."
              />
            </div>

            {/* Số lượng tồn kho */}
            <div>
              <label className="block mb-1">Số lượng tồn kho</label>
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
              <label className="block mb-1">Kích thước</label>
              <input
                type="text"
                name="specifications.size"
                placeholder="Kích thước"
                value={formData.specifications.size}
                onChange={handleInputChange}
                className="w-full bg-gray-700 text-white p-2 rounded"
              />
            </div>

            {/* Specifications: material */}
            <div>
              <label className="block mb-1">Chất liệu</label>
              <input
                type="text"
                name="specifications.material"
                placeholder="Chất liệu"
                value={formData.specifications.material}
                onChange={handleInputChange}
                className="w-full bg-gray-700 text-white p-2 rounded"
              />
            </div>

            {/* Specifications: color */}
            <div>
              <label className="block mb-1">Màu sắc</label>
              <input
                type="text"
                name="specifications.color"
                placeholder="Màu sắc"
                value={formData.specifications.color}
                onChange={handleInputChange}
                className="w-full bg-gray-700 text-white p-2 rounded"
              />
            </div>

            {/* Specifications: spokeCount */}
            <div>
              <label className="block mb-1">Số căm</label>
              <input
                type="number"
                name="specifications.spokeCount"
                placeholder="Số căm"
                value={formData.specifications.spokeCount}
                onChange={handleInputChange}
                className="w-full bg-gray-700 text-white p-2 rounded"
                min="0"
              />
            </div>

            {/* Specifications: weight */}
            <div>
              <label className="block mb-1">Trọng lượng (kg)</label>
              <input
                type="number"
                name="specifications.weight"
                placeholder="Trọng lượng"
                value={formData.specifications.weight}
                onChange={handleInputChange}
                className="w-full bg-gray-700 text-white p-2 rounded"
                min="0"
              />
            </div>

            {/* Nút Submit */}
            <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700">
              Cập nhật sản phẩm
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default UpdateProduct
