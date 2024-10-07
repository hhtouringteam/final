import React, { useState, useContext } from 'react'
import { toast } from 'react-toastify'
import { EntitiesContext } from '../../context/EntitiesContext'

const AddCategoryForm = () => {
  const [categoryName, setCategoryName] = useState('')
  const [description, setDescription] = useState('')

  const { setCategories } = useContext(EntitiesContext)

  const handleAddCategory = async e => {
    e.preventDefault()

    if (!categoryName) {
      toast.error('Tên danh mục là bắt buộc!')
      return
    }

    const categoryData = {
      name: categoryName,
      description,
    }
    console.log(categoryData)

    try {
      const response = await fetch('http://localhost:5000/api/admin/categories/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoryData),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || 'Thêm danh mục không thành công!')
      }

      const newCategory  = await response.json()
 
      setCategories(prevCategories => [...prevCategories, newCategory ])

      // Reset form
      setCategoryName('')
      setDescription('')

      toast.success('Thêm danh mục thành công!')
    } catch (error) {
      toast.error(error.message || 'Lỗi khi thêm danh mục!')
      console.error('Error adding category:', error)
    }
  }

  return (
    <form onSubmit={handleAddCategory} className="bg-gray-800 p-4 rounded">
      <h2 className="text-xl mb-4">Add Category</h2>
      <input
        type="text"
        placeholder=" category name"
        value={categoryName}
        onChange={e => setCategoryName(e.target.value)}
        className="bg-gray-700 text-white p-2 mb-2 block w-full rounded"
        required
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={e => setDescription(e.target.value)}
        className="bg-gray-700 text-white p-2 mb-2 block w-full rounded"
      />
      <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700">
      Add Category
      </button>
    </form>
  )
}

export default AddCategoryForm
