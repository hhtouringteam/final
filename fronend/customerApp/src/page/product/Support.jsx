

import React, { useState } from 'react'
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaQuestionCircle } from 'react-icons/fa'
import { toast, ToastContainer } from 'react-toastify'
import { NavLink } from 'react-router-dom'

const Support = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })

  const [loading, setLoading] = useState(false)


  const handleChange = e => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }


  const handleSubmit = async e => {
    e.preventDefault()

    
    const { name, email, subject, message } = formData
    if (!name || !email || !subject || !message) {
      toast.error('Vui lòng điền đầy đủ các trường.')
      return
    }

    setLoading(true)

    try {
    
     
      await new Promise(resolve => setTimeout(resolve, 2000))


      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      })

      toast.success('Gửi liên hệ thành công! Chúng tôi sẽ phản hồi bạn sớm.')
    } catch (error) {
      toast.error('Đã xảy ra lỗi khi gửi liên hệ. Vui lòng thử lại sau.')
    }

    setLoading(false)
  }

  return (
    <div className="container mx-auto mt-10 p-6">
      <h2 className="text-3xl font-bold text-center mb-8">Support</h2>

      <div className="grid md:grid-cols-2 gap-8">

        <div>
          <h3 className="text-2xl font-semibold mb-4">Liên Hệ Với Chúng Tôi</h3>
          <div className="flex items-center mb-4">
            <FaEnvelope className="text-blue-500 mr-3" />
            <div>
              <h4 className="font-medium">Email:</h4>
              <p className="text-gray-600">Huynhgcs190363@fpt.edu.vn</p>
            </div>
          </div>
          <div className="flex items-center mb-4">
            <FaPhone className="text-green-500 mr-3" />
            <div>
              <h4 className="font-medium">Điện Thoại:</h4>
              <p className="text-gray-600">+84 337 325 729</p>
            </div>
          </div>
          <div className="flex items-center">
            <FaMapMarkerAlt className="text-red-500 mr-3" />
            <div>
              <h4 className="font-medium">Địa Chỉ:</h4>
              <p className="text-gray-600">20 Cộng Hòa, Thành phố HỒ CHí MINH</p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-2xl font-semibold mb-4">Gửi Tin Nhắn</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-gray-700">
                Tên:
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.name}
                onChange={handleChange}
                placeholder="Nhập tên của bạn"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-gray-700">
                Email:
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.email}
                onChange={handleChange}
                placeholder="Nhập email của bạn"
              />
            </div>
            <div>
              <label htmlFor="subject" className="block text-gray-700">
                Chủ Đề:
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Nhập chủ đề"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-gray-700">
                Tin Nhắn:
              </label>
              <textarea
                id="message"
                name="message"
                rows="5"
                className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.message}
                onChange={handleChange}
                placeholder="Nhập tin nhắn của bạn"
              ></textarea>
            </div>
            <div>
              <button
                type="submit"
                className={`w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300 ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={loading}
              >
                {loading ? 'Đang gửi...' : 'Gửi Tin Nhắn'}
              </button>
            </div>
          </form>
        </div>
      </div>


      <div className="mt-12">
        <h3 className="text-2xl font-semibold mb-4">Câu Hỏi Thường Gặp</h3>
        <div className="space-y-4">
     
          <details className="group">
            <summary className="flex justify-between items-center cursor-pointer bg-gray-100 p-4 rounded-md">
              <span>Chính sách vận chuyển của bạn là gì?</span>
              <FaQuestionCircle className="text-gray-500 group-open:transform group-open:rotate-180 transition-transform duration-300" />
            </summary>
            <div className="mt-2 p-4 bg-gray-50 rounded-md">
              <p>
                Chúng tôi cung cấp vận chuyển miễn phí cho tất cả đơn hàng trên 50$. Thời gian vận chuyển trung bình là
                3-5 ngày làm việc.
              </p>
            </div>
          </details>

   
          <details className="group">
            <summary className="flex justify-between items-center cursor-pointer bg-gray-100 p-4 rounded-md">
              <span>Quy trình đổi trả sản phẩm như thế nào?</span>
              <FaQuestionCircle className="text-gray-500 group-open:transform group-open:rotate-180 transition-transform duration-300" />
            </summary>
            <div className="mt-2 p-4 bg-gray-50 rounded-md">
              <p>
                Bạn có thể đổi sản phẩm trong vòng 30 ngày kể từ ngày nhận hàng. Sản phẩm phải còn mới, chưa qua sử dụng
                và trong bao bì nguyên vẹn.
              </p>
            </div>
          </details>


          <details className="group">
            <summary className="flex justify-between items-center cursor-pointer bg-gray-100 p-4 rounded-md">
              <span>Liệu tôi có thể theo dõi đơn hàng của mình không?</span>
              <FaQuestionCircle className="text-gray-500 group-open:transform group-open:rotate-180 transition-transform duration-300" />
            </summary>
            <div className="mt-2 p-4 bg-gray-50 rounded-md">
              <p>
                Có, bạn có thể theo dõi đơn hàng của mình qua trang{' '}
                <NavLink to="/profile" className="text-blue-500 underline">
                  Hồ Sơ Người Dùng
                </NavLink>
                .
              </p>
            </div>
          </details>

        </div>
      </div>

 
      <ToastContainer />
    </div>
  )
}

export default Support
