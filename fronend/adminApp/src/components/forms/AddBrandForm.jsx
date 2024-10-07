import React, { useState, useContext } from 'react'
import { toast } from 'react-toastify'
import { EntitiesContext } from '../../context/EntitiesContext'

const AddBrandForm = () => {
  const [brandName, setBrandName] = useState('')
  const [description, setDescription] = useState('')

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

      const newBrand = await response.json()

      setBrands(prevBrands => [...prevBrands, newBrand])

      // Reset form
      setBrandName('')
      setDescription('')

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
      <h2 className="text-xl mb-4">Add Brand</h2>
      <input
        type="text"
        placeholder="brand name"
        value={brandName}
        onChange={e => setBrandName(e.target.value)}
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
        type="number"
        placeholder="year"
        value={establishedYear}
        onChange={e => setEstablishedYear(e.target.value)}
        className="bg-gray-700 text-white p-2 mb-2 block w-full rounded"
      />
      <input
        type="text"
        placeholder="Country"
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
      Add Brand
      </button>
    </form>
  )
}

export default AddBrandForm
