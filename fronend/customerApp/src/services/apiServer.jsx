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
      const response = await fetch(`${config.apiUrl}/products/featured`)
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

  getAllProducts: async () => {
    try {
      const response = await fetch(`${config.apiUrl}/products/trending`)
      if (!response.ok) {
        throw new Error('Error fetching all products')
      }
      const data = await response.json() // Sử dụng await để lấy dữ liệu JSON thực tế
      return data // Trả về dữ liệu JSON đã parse
    } catch (error) {
      console.error('Error fetching all products:', error)
      throw error // Ném lỗi ra để có thể xử lý ở phía gọi hàm
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
