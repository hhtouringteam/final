// src/components/BlogDetail.js

import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { FaCalendarAlt, FaUser } from 'react-icons/fa'


const blogPosts = [
  {
    id: 1,
    title: '10 Mẹo Bảo Dưỡng Xe Máy Để Kéo Dài Tuổi Thọ',
    date: '2024-04-15',
    author: 'Nguyễn Văn A',
    excerpt:
      'Bảo dưỡng xe máy định kỳ không chỉ giúp xe chạy mượt mà mà còn kéo dài tuổi thọ cho xe. Dưới đây là 10 mẹo bảo dưỡng xe máy hiệu quả...',
    imageUrl: 'https://images.pexels.com/photos/1191109/pexels-photo-1191109.jpeg?auto=compress&cs=tinysrgb&w=600',
    content: `1. Lợi ích của bảo dưỡng xe máy định kỳ?
Việc bảo dưỡng xe máy định kỳ theo đúng hướng dẫn của nhà sản xuất sẽ mang đến cho những lợi ích thiết thực như sau:

Tăng công suất hoạt động tốt nhất: Bảo dưỡng xe máy đúng định kỳ sẽ giúp xe hoạt động ổn định, tránh tình trạng xe “chết máy” hoặc phát sinh trục trặc khi đang đi đường.
Tăng tuổi thọ sử dụng xe: Các hoạt động bảo trì như thay nhớt, bảo dưỡng chế hoà khí, rửa bầu lọc khí, chỉnh chế độ nhiên liệu, vệ sinh bugi, điều chỉnh côn, đổ thêm nước nạp ắc quy giúp làm sạch các cặn bẩn, nấm mốc tích tụ trong động cơ, từ đó góp phần nâng cao hiệu suất vận hành của xe máy.
`,
  },
  {
    id: 2,
    title: 'Xu Hướng Mâm Xe Máy Năm 2024: Những Thiết Kế Đột Phá',
    date: '2024-03-22',
    author: 'Trần Thị B',
    excerpt:
      'Mâm xe máy không chỉ là phần trang trí mà còn ảnh hưởng đến hiệu suất và thẩm mỹ của xe. Năm 2024, những xu hướng thiết kế mâm xe máy đang dần nổi lên...',
    imageUrl: 'https://images.pexels.com/photos/1191146/pexels-photo-1191146.jpeg?auto=compress&cs=tinysrgb&w=600',
    content: ``,
  },
  {
    id: 3,
    title: 'So Sánh Phuộc Xe Máy Truyền Thống và Phuộc Nâng Cao',
    date: '2024-02-10',
    author: 'Lê Văn C',
    excerpt:
      'Phuộc xe máy đóng vai trò quan trọng trong việc cải thiện khả năng vận hành và cảm giác lái. Bài viết này sẽ so sánh giữa phuộc truyền thống và phuộc nâng cao...',
    imageUrl: 'https://images.pexels.com/photos/52538/motorcycle-motor-cylinder-technology-52538.jpeg?auto=compress&cs=tinysrgb&w=600',
    content: ``,
  },

]

const BlogDetail = () => {
  const { id } = useParams()

  const post = blogPosts.find(p => p.id === parseInt(id))

  if (!post) {
    return (
      <div className="container mx-auto mt-10 p-6">
        <h2 className="text-3xl font-bold text-center mb-8">Bài viết không tồn tại</h2>
        <div className="text-center">
          <Link to="/blog" className="text-blue-500 hover:underline">
            Quay lại Blog
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto mt-10 p-6">
      <h2 className="text-3xl font-bold mb-4">{post.title}</h2>
      <div className="flex items-center text-gray-600 text-sm mb-4">
        <FaCalendarAlt className="mr-1" />
        <span>{new Date(post.date).toLocaleDateString()}</span>
        <FaUser className="ml-4 mr-1" />
        <span>{post.author}</span>
      </div>
      <img src={post.imageUrl} alt={post.title} className="w-full h-64 object-cover mb-6 rounded-md" />
      <p className="text-gray-700">{post.content}</p>
      <div className="mt-6">
        <Link to="/blog" className="text-blue-500 hover:underline">
          Quay lại Blog
        </Link>
      </div>
    </div>
  )
}

export default BlogDetail
