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
  const [imageUrl, setImageUrl] = useState('')
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
      imageUrl,
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

      const newVehicle = await response.json()

      setVehicles(prevVehicles => [...prevVehicles, newVehicle])

      // Reset form
      setVehicleName('')
      setDescription('')
      setManufacturer('')
      setYear('')
      setType('')
      setEngineSize('')
      setImageUrl('')
      toast.success('Thêm phương tiện thành công!')
    } catch (error) {
      toast.error(error.message || 'Lỗi khi thêm phương tiện!')
      console.error('Error adding vehicle:', error)
    }
  }

  return (
    <form onSubmit={handleAddVehicle} className="bg-gray-800 p-4 rounded">
      <h2 className="text-xl mb-4"> Add Vehicle</h2>
      <input
        type="text"
        placeholder="Vehicle Name"
        value={vehicleName}
        onChange={e => setVehicleName(e.target.value)}
        className="bg-gray-700 text-white p-2 mb-2 block w-full rounded"
        required
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={e => setDescription(e.target.value)}
        className="bg-gray-700 text-white p-2 mb-2 block w-full rounded"
      />
      <input
        type="url"
        placeholder="Image URL"
        value={imageUrl}
        onChange={e => setImageUrl(e.target.value)}
        className="bg-gray-700 text-white p-2 mb-2 block w-full rounded"
      />
      <input
        type="text"
        placeholder="Manufacturer"
        value={manufacturer}
        onChange={e => setManufacturer(e.target.value)}
        className="bg-gray-700 text-white p-2 mb-2 block w-full rounded"
      />
      <input
        type="number"
        placeholder="Year"
        value={year}
        onChange={e => setYear(e.target.value)}
        className="bg-gray-700 text-white p-2 mb-2 block w-full rounded"
      />
      <input
        type="text"
        placeholder="type"
        value={type}
        onChange={e => setType(e.target.value)}
        className="bg-gray-700 text-white p-2 mb-2 block w-full rounded"
      />
      <input
        type="text"
        placeholder="Engine Capacity"
        value={engineSize}
        onChange={e => setEngineSize(e.target.value)}
        className="bg-gray-700 text-white p-2 mb-2 block w-full rounded"
      />
      <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700">
        Add Vehicle
      </button>
    </form>
  )
}

export default AddVehicleForm
