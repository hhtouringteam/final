// src/services/authService.js

import apiRequest from './api'

export const login = async (email, password) => {
  const data = await apiRequest('/auth/login', 'POST', { email, password })
  return data
}
