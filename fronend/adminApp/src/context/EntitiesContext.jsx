// src/context/EntitiesContext.js
import React, { createContext, useState, useEffect } from 'react'
import { toast } from 'react-toastify'

export const EntitiesContext = createContext()

export const EntitiesProvider = ({ children }) => {
  const [brands, setBrands] = useState([])
  const [categories, setCategories] = useState([])
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true) // Thêm state loading

  // Fetch Brands

  const fetchBrands = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/brands')
      if (!response.ok) {
        throw new Error('Failed to fetch brands')
      }
      const data = await response.json()
      console.log('Fetched brands:', data.brands)
      setBrands(data.brands)
    } catch (error) {
      toast.error(`Error fetching brands: ${error.message}`)
      console.error('Error fetching brands:', error)
    }
  }

  // Fetch Categories
  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/categories')
      if (!response.ok) {
        throw new Error('Failed to fetch categories')
      }
      const data = await response.json()
      console.log('Fetched categories:', data.categories)
      setCategories(data.categories)
    } catch (error) {
      toast.error(`Error fetching categories: ${error.message}`)
      console.error('Error fetching categories:', error)
    }
  }

  // Fetch Vehicles
  const fetchVehicles = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/vehicles')
      if (!response.ok) {
        throw new Error('Failed to fetch vehicles')
      }
      const data = await response.json()
      console.log('Fetched vehicles:', data.vehicles)
      setVehicles(data.vehicles)
    } catch (error) {
      toast.error(`Error fetching vehicles: ${error.message}`)
      console.error('Error fetching vehicles:', error)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([fetchBrands(), fetchCategories(), fetchVehicles()])
      setLoading(false)
    }
    fetchData()
  }, [])

  return (
    <EntitiesContext.Provider
      value={{
        brands,
        setBrands,
        categories,
        setCategories,
        vehicles,
        setVehicles,
        loading, // Cung cấp state loading
      }}
    >
      {children}
    </EntitiesContext.Provider>
  )
}
