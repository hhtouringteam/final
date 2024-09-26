// // import React, { useState } from 'react'
// // import { toast } from 'react-toastify'

// // const AddVehicleForm = () => {
// //   const [vehicleName, setVehicleName] = useState('')
// //   const [manufacturer, setManufacturer] = useState('')
// //   const [year, setYear] = useState('')
// //   const [type, setType] = useState('')
// //   const [engineSize, setEngineSize] = useState('')

// //   const handleAddVehicle = async () => {
// //     if (!vehicleName) {
// //       toast.error('Tên loại xe là bắt buộc!')
// //       return
// //     }

// //     const vehicleData = {
// //       name: vehicleName,
// //       manufacturer: manufacturer,
// //       year: year,
// //       type: type,
// //       engineSize: engineSize,
// //     }

// //     try {
// //       const response = await fetch('http://localhost:5000/api/admin/vehicles/add', {
// //         method: 'POST',
// //         headers: { 'Content-Type': 'application/json' },
// //         body: JSON.stringify(vehicleData),
// //       })

// //       const data = await response.json()
// //       if (response.ok) {
// //         localStorage.setItem('selectedVehicle', JSON.stringify(data.vehicle))
// //         setVehicleName('')
// //         setManufacturer('')
// //         setYear('')
// //         setType('')
// //         setEngineSize('')
// //         toast.success('Thêm loại xe thành công!')
// //       } else {
// //         toast.error('Có lỗi xảy ra khi thêm loại xe!')
// //       }
// //     } catch (error) {
// //       toast.error('Không thể kết nối với server!')
// //       console.error('Lỗi khi thêm loại xe:', error)
// //     }
// //   }

// //   return (
// //     <div>
// //       <input
// //         type="text"
// //         placeholder="Tên loại xe"
// //         value={vehicleName}
// //         onChange={e => setVehicleName(e.target.value)}
// //         className="bg-gray-700 text-white p-2 mb-2 block w-full rounded"
// //       />
// //       <input
// //         type="text"
// //         placeholder="Nhà sản xuất"
// //         value={manufacturer}
// //         onChange={e => setManufacturer(e.target.value)}
// //         className="bg-gray-700 text-white p-2 mb-2 block w-full rounded"
// //       />
// //       <input
// //         type="number"
// //         placeholder="Năm sản xuất"
// //         value={year}
// //         onChange={e => setYear(e.target.value)}
// //         className="bg-gray-700 text-white p-2 mb-2 block w-full rounded"
// //       />
// //       <input
// //         type="text"
// //         placeholder="Loại xe"
// //         value={type}
// //         onChange={e => setType(e.target.value)}
// //         className="bg-gray-700 text-white p-2 mb-2 block w-full rounded"
// //       />
// //       <input
// //         type="text"
// //         placeholder="Dung tích động cơ"
// //         value={engineSize}
// //         onChange={e => setEngineSize(e.target.value)}
// //         className="bg-gray-700 text-white p-2 mb-2 block w-full rounded"
// //       />
// //       <button onClick={handleAddVehicle} className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700">
// //         Thêm Loại Xe
// //       </button>
// //     </div>
// //   )
// // }

// // export default AddVehicleForm

import React, { useState, useContext } from 'react'
import { toast } from 'react-toastify'
import { EntitiesContext } from '../../context/EntitiesContext'

const AddVehicleForm = () => {
  const [vehicleName, setVehicleName] = useState('')
  const [description, setDescription] = useState('')
  const [manufacturer, setManufacturer] = useState('')
  const [year, setYear] = useState('')
  const [type, setType] = useState('')
  const [engineSize, setEngineSize] = useState('')
  const { setVehicles } = useContext(EntitiesContext)

  const handleAddVehicle = async e => {
    e.preventDefault()

    if (!vehicleName) {
      toast.error('Tên phương tiện là bắt buộc!')
      return
    }

    const vehicleData = {
      name: vehicleName,
      description,
      manufacturer: manufacturer,
      year: year,
      type: type,
      engineSize: engineSize,
    }

    try {
      const response = await fetch('http://localhost:5000/api/admin/vehicles/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vehicleData),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || 'Thêm phương tiện không thành công!')
      }

      const data = await response.json()
      console.log('Added vehicle:', data.vehicle)
      setVehicles(prevVehicles => [...prevVehicles, data.vehicle])

      // Reset form
      setVehicleName('')
      setDescription('')
      setManufacturer('')
      setYear('')
      setType('')
      setEngineSize('')

      toast.success('Thêm phương tiện thành công!')
    } catch (error) {
      toast.error(error.message || 'Lỗi khi thêm phương tiện!')
      console.error('Error adding vehicle:', error)
    }
  }

  return (
    <form onSubmit={handleAddVehicle} className="bg-gray-800 p-4 rounded">
      <h2 className="text-xl mb-4">Thêm Phương Tiện</h2>
      <input
        type="text"
        placeholder="Tên phương tiện"
        value={vehicleName}
        onChange={e => setVehicleName(e.target.value)}
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
        type="text"
        placeholder="Nhà sản xuất"
        value={manufacturer}
        onChange={e => setManufacturer(e.target.value)}
        className="bg-gray-700 text-white p-2 mb-2 block w-full rounded"
      />
      <input
        type="number"
        placeholder="Năm sản xuất"
        value={year}
        onChange={e => setYear(e.target.value)}
        className="bg-gray-700 text-white p-2 mb-2 block w-full rounded"
      />
      <input
        type="text"
        placeholder="Loại xe"
        value={type}
        onChange={e => setType(e.target.value)}
        className="bg-gray-700 text-white p-2 mb-2 block w-full rounded"
      />
      <input
        type="text"
        placeholder="Dung tích động cơ"
        value={engineSize}
        onChange={e => setEngineSize(e.target.value)}
        className="bg-gray-700 text-white p-2 mb-2 block w-full rounded"
      />
      <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700">
        Thêm Phương Tiện
      </button>
    </form>
  )
}

export default AddVehicleForm
