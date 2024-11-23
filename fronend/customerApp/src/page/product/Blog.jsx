// src/components/Blog.js

import React from 'react'
import { Link } from 'react-router-dom'
import { FaCalendarAlt, FaUser } from 'react-icons/fa'

const blogPosts = [
  {
    id: 1,
    title: '10 Motorcycle Maintenance Tips to Extend Its Lifespan',
    date: '2024-04-15',
    author: 'Nguyen Van Tung',
    excerpt:
      'Regular motorcycle maintenance not only ensures smooth rides but also extends the lifespan of your bike. Here are 10 effective maintenance tips...',
    imageUrl: 'https://images.pexels.com/photos/1191109/pexels-photo-1191109.jpeg?auto=compress&cs=tinysrgb&w=600',
    content: 'Detailed content of the article...',
  },
  {
    id: 2,
    title: '2024 Motorcycle Rim Trends: Innovative Designs',
    date: '2024-03-22',
    author: 'Tran Thi My Hang',
    excerpt:
      'Motorcycle rims are not just decorative elements; they also impact the performance and aesthetics of your bike. In 2024, new rim design trends are emerging...',
    imageUrl: 'https://images.pexels.com/photos/1191146/pexels-photo-1191146.jpeg?auto=compress&cs=tinysrgb&w=600',
    content: 'Detailed content of the article...',
  },
  {
    id: 3,
    title: 'Comparing Traditional and Advanced Motorcycle Forks',
    date: '2024-02-10',
    author: 'Le Van Khai',
    excerpt:
      'Motorcycle forks play a crucial role in enhancing the handling and ride comfort. This article compares traditional forks with advanced suspension systems...',
    imageUrl:
      'https://images.pexels.com/photos/52538/motorcycle-motor-cylinder-technology-52538.jpeg?auto=compress&cs=tinysrgb&w=600',
    content: 'Detailed content of the article...',
  },
]

const Blog = () => {
  return (
    <div className="container mx-auto mt-10 p-6">
      <h2 className="text-3xl font-bold text-center mb-8">Blog</h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogPosts.map(post => (
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
              <Link to={`/blog/${post.id}`} className="text-blue-500 hover:underline font-medium">
                Read More
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Blog
