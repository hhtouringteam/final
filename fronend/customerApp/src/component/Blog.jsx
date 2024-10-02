// src/components/Blog.js

import React from 'react';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaUser } from 'react-icons/fa';

// Mock Data cho các bài viết blog
const blogPosts = [
  {
    id: 1,
    title: '10 Mẹo Bảo Dưỡng Xe Máy Để Kéo Dài Tuổi Thọ',
    date: '2024-04-15',
    author: 'Nguyễn Văn A',
    excerpt: 'Bảo dưỡng xe máy định kỳ không chỉ giúp xe chạy mượt mà mà còn kéo dài tuổi thọ cho xe. Dưới đây là 10 mẹo bảo dưỡng xe máy hiệu quả...',
    imageUrl: 'https://via.placeholder.com/600x400', // Thay bằng URL hình ảnh thực tế nếu có
    content: 'Nội dung chi tiết của bài viết...',
  },
  {
    id: 2,
    title: 'Xu Hướng Mâm Xe Máy Năm 2024: Những Thiết Kế Đột Phá',
    date: '2024-03-22',
    author: 'Trần Thị B',
    excerpt: 'Mâm xe máy không chỉ là phần trang trí mà còn ảnh hưởng đến hiệu suất và thẩm mỹ của xe. Năm 2024, những xu hướng thiết kế mâm xe máy đang dần nổi lên...',
    imageUrl: 'https://via.placeholder.com/600x400',
    content: 'Nội dung chi tiết của bài viết...',
  },
  {
    id: 3,
    title: 'So Sánh Phuộc Xe Máy Truyền Thống và Phuộc Nâng Cao',
    date: '2024-02-10',
    author: 'Lê Văn C',
    excerpt: 'Phuộc xe máy đóng vai trò quan trọng trong việc cải thiện khả năng vận hành và cảm giác lái. Bài viết này sẽ so sánh giữa phuộc truyền thống và phuộc nâng cao...',
    imageUrl: 'https://via.placeholder.com/600x400',
    content: 'Nội dung chi tiết của bài viết...',
  },
  // Thêm các bài viết khác nếu cần
];

const Blog = () => {
  return (
    <div className="container mx-auto mt-10 p-6">
      <h2 className="text-3xl font-bold text-center mb-8">Blog</h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogPosts.map((post) => (
          <div key={post.id} className="bg-white shadow-md rounded-lg overflow-hidden">
            <img src={post.imageUrl} alt={post.title} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
              <div className="flex items-center text-gray-600 text-sm mb-4">
                <FaCalendarAlt className="mr-1" />
                <span>{new Date(post.date).toLocaleDateString()}</span>
                <FaUser className="ml-4 mr-1" />
                <span>{post.author}</span>
              </div>
              <p className="text-gray-700 mb-4">{post.excerpt}</p>
              <Link
                to={`/blog/${post.id}`}
                className="text-blue-500 hover:underline font-medium"
              >
                Đọc thêm
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Blog;
