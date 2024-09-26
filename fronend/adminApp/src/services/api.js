// src/services/api.js

const BASE_URL = 'http://localhost:5000/api/admin'; // Thay bằng URL của backend

// Hàm tiện ích để thực hiện yêu cầu với `fetch`
const apiRequest = async (endpoint, method = 'GET', data) => {
  const token = localStorage.getItem('token');

  const config = {
    method,
    headers: {
      'Content-Type': 'application/json',
      // Thêm Authorization header nếu có token
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    // Thêm body nếu có dữ liệu gửi đi và phương thức không phải GET
    ...(data && { body: JSON.stringify(data) }),
  };

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);

    // Kiểm tra phản hồi HTTP
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Có lỗi xảy ra');
    }

    // Trả về dữ liệu JSON
    return await response.json();
  } catch (error) {
    // Xử lý lỗi
    console.error('Lỗi trong apiRequest:', error);
    throw error;
  }
};

export default apiRequest;
