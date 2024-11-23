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
  const [imageFiles, setImageFiles] = useState([])
  const [imageUrl, setImageUrl] = useState([])

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
      setImageUrl(data.imageUrls) // Save the uploaded image URLs
      return data.imageUrls
    } catch (error) {
      toast.error(error.message || 'Error uploading images!')
      throw error
    }
  }

  const handleAddVehicle = async e => {
    e.preventDefault()

    if (!vehicleName) {
      toast.error('Vehicle name is required!')
      return
    }

    try {
      const uploadedImageUrls = await handleUploadImages()
      const vehicleData = {
        name: vehicleName,
        description,
        manufacturer,
        year,
        imageUrl: uploadedImageUrls,
        type,
        engineSize,
      }

      const response = await fetch('http://localhost:5000/api/admin/vehicles/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vehicleData),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || 'Failed to add vehicle!')
      }

      const newVehicle = await response.json()

      setVehicles(prevVehicles => [...prevVehicles, newVehicle])

      // Reset the form
      setVehicleName('')
      setDescription('')
      setManufacturer('')
      setYear('')
      setType('')
      setEngineSize('')
      setImageFiles([])
      setImageUrl([])
      toast.success('Vehicle added successfully!')
    } catch (error) {
      toast.error(error.message || 'Error adding vehicle!')
    }
  }

  return (
    <form onSubmit={handleAddVehicle} className="bg-gray-800 p-10 rounded">
      <h2 className="text-xl mb-4">Add Vehicle</h2>
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
        placeholder="Type"
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
