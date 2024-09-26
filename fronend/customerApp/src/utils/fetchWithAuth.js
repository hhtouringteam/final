// src/utils/fetchWithAuth.js

export async function fetchWithAuth(url, options = {}) {
  const token = localStorage.getItem('token')

  const headers = {
    ...options.headers,
    'Content-Type': 'application/json',
  }

  if (token) {
    headers['Authorization'] = 'Bearer ' + token
  }

  const response = await fetch(url, {
    ...options,
    headers,
  })

  return response
}
