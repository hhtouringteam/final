// src/components/ProductDetail/Reviews.js

import React, { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

export default function Reviews({ productId }) {
  const [reviews, setReviews] = useState([])
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' })
  const { user } = useContext(AuthContext)
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/reviews/${productId}/reviews`)
        const data = await response.json()
        if (data.success) {
          setReviews(data.data)
        }
      } catch (error) {
        console.error('Error fetching reviews:', error)
      }
    }

    fetchReviews()
  }, [productId])
  const handleReviewSubmit = async e => {
    e.preventDefault()
    if (!user) {
      alert('Bạn cần đăng nhập để thêm đánh giá.')
      return
    }
    try {
      const response = await fetch(`http://localhost:5000/api/reviews/${productId}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(newReview),
      })
      const data = await response.json()
      if (response.ok) {
        setReviews([...reviews, data.data])
        setNewReview({ rating: 5, comment: '' })
      } else {
        alert(data.message)
      }
    } catch (error) {
      console.error('Error adding review:', error)
    }
  }

  return (
    <div>
      <h3 className="text-2xl font-semibold mb-4">Đánh Giá Sản Phẩm</h3>

      {/* Hiển thị các đánh giá */}
      <div className="space-y-4">
        {reviews.length > 0 ? (
          reviews.map(review => (
            <div key={review._id} className="p-4 border border-gray-200 rounded">
              <div className="flex justify-between">
                <span className="font-semibold">{review.username}</span>
                <span className="text-yellow-500">⭐ {review.rating}</span>
              </div>
              <p className="mt-2">{review.comment}</p>
              <span className="text-gray-500 text-sm">{new Date(review.createdAt).toLocaleDateString()}</span>
            </div>
          ))
        ) : (
          <p>Chưa có đánh giá nào.</p>
        )}
      </div>
      {user ? (
        <form className="mt-6" onSubmit={handleReviewSubmit}>
          <h4 className="text-xl font-semibold mb-2">Thêm Đánh Giá Của Bạn</h4>
          <div className="flex items-center mb-4">
            <label className="mr-2">Rating:</label>
            <select
              value={newReview.rating}
              onChange={e => setNewReview({ ...newReview, rating: e.target.value })}
              className="border border-gray-300 p-2 rounded"
              required
            >
              <option value={5}>5 - Xuất sắc</option>
              <option value={4}>4 - Tốt</option>
              <option value={3}>3 - Trung bình</option>
              <option value={2}>2 - Kém</option>
              <option value={1}>1 - Rất kém</option>
            </select>
          </div>
          <div className="mb-4">
            <textarea
              value={newReview.comment}
              onChange={e => setNewReview({ ...newReview, comment: e.target.value })}
              placeholder="Viết bình luận của bạn..."
              className="w-full border border-gray-300 p-2 rounded"
              rows={4}
              required
            ></textarea>
          </div>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Gửi Đánh Giá
          </button>
        </form>
      ) : (
        <p className="mt-4">
          Bạn cần{' '}
          <a href="/login" className="text-blue-500 underline">
            đăng nhập
          </a>{' '}
          để thêm đánh giá.
        </p>
      )}
    </div>
  )
}
