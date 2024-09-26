// import React, { useState } from 'react'
// import { toast } from 'react-toastify'

// const AddBrandForm = () => {
//   // State để lưu trữ các thông tin của thương hiệu
//   const [brandName, setBrandName] = useState('')
//   const [description, setDescription] = useState('')
//   const [logoUrl, setLogoUrl] = useState('')
//   const [establishedYear, setEstablishedYear] = useState('')
//   const [country, setCountry] = useState('')
//   const [website, setWebsite] = useState('')

//   // Hàm xử lý khi nhấn nút thêm thương hiệu
//   const handleAddBrand = async () => {
//     // Kiểm tra xem tên thương hiệu đã được nhập chưa
//     if (!brandName) {
//       toast.error('Tên thương hiệu là bắt buộc!')
//       return
//     }

//     // Tạo đối tượng dữ liệu thương hiệu
//     const brandData = {
//       name: brandName,
//       description,
//       logoUrl,
//       establishedYear,
//       country,
//       website,
//     }

//     try {
//       // Gửi yêu cầu POST đến server để thêm thương hiệu
//       const response = await fetch('http://localhost:5000/api/admin/brands/add', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(brandData),
//       })

//       const data = await response.json()
//       console.log(data)
//       // Kiểm tra phản hồi từ server
//       if (response.ok) {
//         // Lưu thương hiệu vào localStorage để có thể sử dụng lại
//         localStorage.setItem('selectedBrand', JSON.stringify(data.brand))

//         // Xóa trắng các ô nhập liệu sau khi thêm thành công
//         setBrandName('')
//         setDescription('')
//         setLogoUrl('')
//         setEstablishedYear('')
//         setCountry('')
//         setWebsite('')

//         // Hiển thị thông báo thành công
//         toast.success('Thêm thương hiệu thành công!')
//       } else {
//         toast.error('Có lỗi xảy ra khi thêm thương hiệu!')
//       }
//     } catch (error) {
//       // Xử lý lỗi khi không kết nối được với server
//       toast.error('Không thể kết nối với server!')
//       console.error('Lỗi khi thêm thương hiệu:', error)
//     }
//   }

//   // Giao diện form nhập liệu
//   return (
//     <form
//       className="text-white"
//       onSubmit={e => {
//         e.preventDefault() // Ngăn chặn submit mặc định của form
//         handleAddBrand() // Gọi hàm thêm thương hiệu
//       }}
//     >
//       {/* Các trường nhập liệu */}
//       <input
//         type="text"
//         placeholder="Tên thương hiệu"
//         value={brandName}
//         onChange={e => setBrandName(e.target.value)}
//         className="bg-gray-700 text-white p-2 mb-2 block w-full rounded"
//         required
//       />
//       <textarea
//         placeholder="Mô tả"
//         value={description}
//         onChange={e => setDescription(e.target.value)}
//         className="bg-gray-700 text-white p-2 mb-2 block w-full rounded"
//       />
//       <input
//         type="url"
//         placeholder="Logo URL"
//         value={logoUrl}
//         onChange={e => setLogoUrl(e.target.value)}
//         className="bg-gray-700 text-white p-2 mb-2 block w-full rounded"
//       />
//       <input
//         type="number"
//         placeholder="Năm thành lập"
//         value={establishedYear}
//         onChange={e => setEstablishedYear(e.target.value)}
//         className="bg-gray-700 text-white p-2 mb-2 block w-full rounded"
//       />
//       <input
//         type="text"
//         placeholder="Quốc gia"
//         value={country}
//         onChange={e => setCountry(e.target.value)}
//         className="bg-gray-700 text-white p-2 mb-2 block w-full rounded"
//       />
//       <input
//         type="url"
//         placeholder="Website"
//         value={website}
//         onChange={e => setWebsite(e.target.value)}
//         className="bg-gray-700 text-white p-2 mb-2 block w-full rounded"
//       />
//       <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700">
//         Thêm Thương Hiệu
//       </button>
//     </form>
//   )
// }

// export default AddBrandForm

// import React, { useState, useContext } from 'react'
// import { toast } from 'react-toastify'
// import { EntitiesContext } from '../../context/EntitiesContext'

// const AddBrandForm = () => {
//   const [brandName, setBrandName] = useState('')
//   const [description, setDescription] = useState('')
//   const [logoUrl, setLogoUrl] = useState('')
//   const [establishedYear, setEstablishedYear] = useState('')
//   const [country, setCountry] = useState('')
//   const [website, setWebsite] = useState('')

//   const { addBrand } = useContext(EntitiesContext)

//   const handleAddBrand = async e => {
//     e.preventDefault()

//     if (!brandName) {
//       toast.error('Tên thương hiệu là bắt buộc!')
//       return
//     }

//     const newBrand = {
//       name: brandName,
//       description: description || null,
//       logoUrl: logoUrl || null,
//       establishedYear: establishedYear || null,
//       country: country || null,
//       website: website || null,
//     }

//     try {
//       const response = await fetch('http://localhost:5000/api/admin/brands/add', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(newBrand),
//       })

//       if (response.ok) {
//         const data = await response.json()
//         addBrand(data.brand) // Cập nhật context
//         setBrandName('')
//         setDescription('')
//         setLogoUrl('')
//         setEstablishedYear('')
//         setCountry('')
//         setWebsite('')
//         toast.success('Thêm thương hiệu thành công!')
//       } else {
//         toast.error('Có lỗi xảy ra khi thêm thương hiệu!')
//       }
//     } catch (error) {
//       toast.error('Không thể kết nối với server!')
//       console.error('Lỗi khi thêm thương hiệu:', error)
//     }
//   }

//   return (
//     <form onSubmit={handleAddBrand} className="bg-gray-800 p-4 rounded">
//       <h2 className="text-xl mb-4">Thêm Thương Hiệu</h2>
//       <input
//         type="text"
//         placeholder="Tên thương hiệu"
//         value={brandName}
//         onChange={e => setBrandName(e.target.value)}
//         className="bg-gray-700 text-white p-2 mb-2 block w-full rounded"
//         required
//       />
//       <textarea
//         placeholder="Mô tả"
//         value={description}
//         onChange={e => setDescription(e.target.value)}
//         className="bg-gray-700 text-white p-2 mb-2 block w-full rounded"
//       />
//       <input
//         type="url"
//         placeholder="Logo URL"
//         value={logoUrl}
//         onChange={e => setLogoUrl(e.target.value)}
//         className="bg-gray-700 text-white p-2 mb-2 block w-full rounded"
//       />
//       <input
//         type="number"
//         placeholder="Năm thành lập"
//         value={establishedYear}
//         onChange={e => setEstablishedYear(e.target.value)}
//         className="bg-gray-700 text-white p-2 mb-2 block w-full rounded"
//       />
//       <input
//         type="text"
//         placeholder="Quốc gia"
//         value={country}
//         onChange={e => setCountry(e.target.value)}
//         className="bg-gray-700 text-white p-2 mb-2 block w-full rounded"
//       />
//       <input
//         type="url"
//         placeholder="Website"
//         value={website}
//         onChange={e => setWebsite(e.target.value)}
//         className="bg-gray-700 text-white p-2 mb-2 block w-full rounded"
//       />
//       <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700">
//         Thêm Thương Hiệu
//       </button>
//     </form>
//   )
// }

// export default AddBrandForm

// src/components/forms/AddBrandForm.js
// src/components/forms/AddBrandForm.js
// src/components/forms/AddBrandForm.js
// src/components/forms/AddBrandForm.js
// src/components/forms/AddBrandForm.js
import React, { useState, useContext } from 'react'
import { toast } from 'react-toastify'
import { EntitiesContext } from '../../context/EntitiesContext'

const AddBrandForm = () => {
  const [brandName, setBrandName] = useState('')
  const [description, setDescription] = useState('')
  const [logoUrl, setLogoUrl] = useState('')
  const [establishedYear, setEstablishedYear] = useState('')
  const [country, setCountry] = useState('')
  const [website, setWebsite] = useState('')

  const { setBrands } = useContext(EntitiesContext)

  const handleAddBrand = async e => {
    e.preventDefault()

    if (!brandName) {
      toast.error('Tên thương hiệu là bắt buộc!')
      return
    }

    const brandData = {
      name: brandName,
      description,
      logoUrl,
      establishedYear,
      country,
      website,
    }

    try {
      const response = await fetch('http://localhost:5000/api/admin/brands/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(brandData),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || 'Thêm thương hiệu không thành công!')
      }

      const data = await response.json()
      console.log('Added brand:', data.brand)
      setBrands(prevBrands => [...prevBrands, data.brand])

      // Reset form
      setBrandName('')
      setDescription('')
      setLogoUrl('')
      setEstablishedYear('')
      setCountry('')
      setWebsite('')

      toast.success('Thêm thương hiệu thành công!')
    } catch (error) {
      toast.error(error.message || 'Lỗi khi thêm thương hiệu!')
      console.error('Error adding brand:', error)
    }
  }

  return (
    <form onSubmit={handleAddBrand} className="bg-gray-800 p-4 rounded">
      <h2 className="text-xl mb-4">Thêm Thương Hiệu</h2>
      <input
        type="text"
        placeholder="Tên thương hiệu"
        value={brandName}
        onChange={e => setBrandName(e.target.value)}
        className="bg-gray-700 text-white p-2 mb-2 block w-full rounded"
        required
      />
      <textarea
        placeholder="Mô tả"
        value={description}
        onChange={e => setDescription(e.target.value)}
        className="bg-gray-700 text-white p-2 mb-2 block w-full rounded"
      />
      <input
        type="url"
        placeholder="Logo URL"
        value={logoUrl}
        onChange={e => setLogoUrl(e.target.value)}
        className="bg-gray-700 text-white p-2 mb-2 block w-full rounded"
      />
      <input
        type="number"
        placeholder="Năm thành lập"
        value={establishedYear}
        onChange={e => setEstablishedYear(e.target.value)}
        className="bg-gray-700 text-white p-2 mb-2 block w-full rounded"
      />
      <input
        type="text"
        placeholder="Quốc gia"
        value={country}
        onChange={e => setCountry(e.target.value)}
        className="bg-gray-700 text-white p-2 mb-2 block w-full rounded"
      />
      <input
        type="url"
        placeholder="Website"
        value={website}
        onChange={e => setWebsite(e.target.value)}
        className="bg-gray-700 text-white p-2 mb-2 block w-full rounded"
      />
      <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700">
        Thêm Thương Hiệu
      </button>
    </form>
  )
}

export default AddBrandForm
