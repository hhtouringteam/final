// src/services/productService.js

import apiRequest from './api';

export const getProducts = async () => {
  const data = await apiRequest('/products');
  return data;
};

export const createProduct = async (productData) => {
  const data = await apiRequest('/products', 'POST', productData);
  return data;
};

// Các hàm updateProduct, deleteProduct tương tự
