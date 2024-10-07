import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'

const UpdateProduct = () => {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description:'',
    categoryId: '',
    brandId: '',
    vehicleId: '',
    stock: '',
    specifications: {
      size: '',
      material: '',
      color: '',
      spokeCount: '',
      weight: '',
    },
  })

  useEffect(() => {
    // Fetch sản phẩm bằng ID
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/admin/products/${id}`)
        const data = await response.json()
        setProduct(data.product)
        setFormData({
          name: data.product.name || '',
          price: data.product.price || '',
          description: data.product.description || '',
          categoryId: data.product.categoryId._id.name || '',
          brandId: data.product.brandId._id.name || '',
          vehicleId: data.product.vehicleId._id.name || '',
          stock: data.product.stock || '',
          specifications: {
            size: data.product.specifications.size || '',
            material: data.product.specifications.material || '',
            color: data.product.specifications.color || '',
            spokeCount: data.product.specifications.spokeCount || '',
            weight: data.product.specifications.weight || '',
          },
        })
      } catch (error) {
        console.error('Error fetching product:', error)
      }
    }
    fetchProduct()
  }, [id])

  const handleInputChange = e => {
    const { name, value } = e.target
    if (name.includes('specifications')) {
      const specField = name.split('.')[1]
      setFormData({
        ...formData,
        specifications: {
          ...formData.specifications,
          [specField]: value,
        },
      })
    } else {
      setFormData({ ...formData, [name]: value })
    }
  }

  const handleUpdateProduct = async e => {
    e.preventDefault()

    const updatedData = {
      name: formData.name,
      price: formData.price,
      description: formData.description, // Chỉnh sửa description
      categoryId: formData.categoryId, // Đây là tên chứ không phải ObjectId
      brandId: formData.brandId, // Tương tự với brandId
      vehicleId: formData.vehicleId, // Tương tự với vehicleId
      stock: formData.stock,
      specifications: formData.specifications,
    }

    try {
      const response = await fetch(`http://localhost:5000/api/admin/products/update/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || 'Cập nhật sản phẩm không thành công!')
      }

      const data = await response.json()
      toast.success('Cập nhật sản phẩm thành công!')
    } catch (error) {
      toast.error(error.message || 'Lỗi khi cập nhật sản phẩm!')
      console.error('Error updating product:', error)
    }
  }

  if (!product) {
    return <p>Đang tải dữ liệu...</p>
  }

  return (
    <div className="text-white px-8 pb-20">
      <h1 className="text-4xl font-bold mb-8 text-center">Cập Nhật Sản Phẩm</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Bảng Thông Tin Hiện Tại */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Thông Tin Hiện Tại</h2>
          {product && (
            <div>
              <p>Danh mục: {product.categoryId?.name || 'N/A'}</p>
              <p>Thương hiệu: {product.brandId?.name || 'N/A'}</p>
              <p>Phương tiện: {product.vehicleId?.name || 'N/A'}</p>
              <p>Số lượng tồn kho: {product.stock}</p>
              <p>Thông số kỹ thuật:</p>
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
            <div>
              <label className="block mb-1">Tên sản phẩm</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full bg-gray-700 text-white p-2 rounded"
              />
            </div>

            <div>
              <label className="block mb-1">Giá sản phẩm</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className="w-full bg-gray-700 text-white p-2 rounded"
              />
            </div>

            <div>
              <label className="block mb-1">Mô tả sản phẩm</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full bg-gray-700 text-white p-2 rounded"
              />
            </div>

            <div>
              <label className="block mb-1">Danh mục</label>
              <input
                type="text"
                name="categoryId"
                value={formData.categoryId}
                onChange={handleInputChange}
                className="w-full bg-gray-700 text-white p-2 rounded"
              />
            </div>

            <div>
              <label className="block mb-1">Thương hiệu</label>
              <input
                type="text"
                name="brandId"
                value={formData.brandId}
                onChange={handleInputChange}
                className="w-full bg-gray-700 text-white p-2 rounded"
              />
            </div>

            <div>
              <label className="block mb-1">Phương tiện</label>
              <input
                type="text"
                name="vehicleId"
                value={formData.vehicleId}
                onChange={handleInputChange}
                className="w-full bg-gray-700 text-white p-2 rounded"
              />
            </div>

            <div>
              <label className="block mb-1">Số lượng tồn kho</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleInputChange}
                className="w-full bg-gray-700 text-white p-2 rounded"
              />
            </div>

            <div>
              <label className="block mb-1">Kích thước</label>
              <input
                type="text"
                name="specifications.size"
                value={formData.specifications.size}
                onChange={handleInputChange}
                className="w-full bg-gray-700 text-white p-2 rounded"
              />
            </div>

            <div>
              <label className="block mb-1">Chất liệu</label>
              <input
                type="text"
                name="specifications.material"
                value={formData.specifications.material}
                onChange={handleInputChange}
                className="w-full bg-gray-700 text-white p-2 rounded"
              />
            </div>

            <div>
              <label className="block mb-1">Màu sắc</label>
              <input
                type="text"
                name="specifications.color"
                value={formData.specifications.color}
                onChange={handleInputChange}
                className="w-full bg-gray-700 text-white p-2 rounded"
              />
            </div>

            <div>
              <label className="block mb-1">Số căm</label>
              <input
                type="number"
                name="specifications.spokeCount"
                value={formData.specifications.spokeCount}
                onChange={handleInputChange}
                className="w-full bg-gray-700 text-white p-2 rounded"
              />
            </div>

            <div>
              <label className="block mb-1">Trọng lượng (kg)</label>
              <input
                type="number"
                name="specifications.weight"
                value={formData.specifications.weight}
                onChange={handleInputChange}
                className="w-full bg-gray-700 text-white p-2 rounded"
              />
            </div>

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
