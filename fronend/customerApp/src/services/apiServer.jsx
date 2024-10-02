import config from '../configs/config'

const apiServer = {
  getSpecialProducts: async () => {
    try {
      const response = await fetch(`${config.apiUrl}/products/special`)
      if (!response.ok) {
        throw new Error('Error fetching special products')
      }
      return response.json()
    } catch (error) {
      console.error('Error:', error)
      throw error
    }
  },

  getFeaturedProducts: async () => {
    try {
      const response = await fetch(`${config.apiUrl}/products`)
      if (!response.ok) {
        throw new Error('Error fetching featured products')
      }
      return response.json()
    } catch (error) {
      console.error('Error:', error)
      throw error
    }
  },

  getBannerProducts: async () => {
    try {
      const response = await fetch(`${config.apiUrl}/products/banner`)
      if (!response.ok) {
        throw new Error('Error fetching banner products')
      }
      return response.json()
    } catch (error) {
      console.error('Error:', error)
      throw error
    }
  },

  getTrendingProducts: async () => {
    try {
      const response = await fetch(`${config.apiUrl}/products/trending`)
      if (!response.ok) {
        throw new Error('Error fetching trending products')
      }
      return response.json()
    } catch (error) {
      console.error('Error:', error)
      throw error
    }
  },

  getProductById: async id => {
    try {
      const response = await fetch(`${config.apiUrl}/products/${id}`)
      if (!response.ok) {
        throw new Error('Error fetching product by id')
      }
      return await response.json()
    } catch (error) {
      console.error('Error:', error)
      throw error
    }
  },
}

export default apiServer
