// src/components/Support.js

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
      toast.error('Please fill in all fields.')
      return
    }

    setLoading(true)

    try {
      // Simulate sending data to the server
      await new Promise(resolve => setTimeout(resolve, 2000))

      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      })

      toast.success('Contact sent successfully! We will respond to you soon.')
    } catch (error) {
      toast.error('An error occurred while sending your message. Please try again later.')
    }

    setLoading(false)
  }

  return (
    <div className="container mx-auto mt-10 p-6">
      <h2 className="text-3xl font-bold text-center mb-8">Support</h2>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-2xl font-semibold mb-4">Contact Us</h3>
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
              <h4 className="font-medium">Phone:</h4>
              <p className="text-gray-600">+84 337 325 729</p>
            </div>
          </div>
          <div className="flex items-center">
            <FaMapMarkerAlt className="text-red-500 mr-3" />
            <div>
              <h4 className="font-medium">Address:</h4>
              <p className="text-gray-600">20 Cong Hoa, Ho Chi Minh City</p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-2xl font-semibold mb-4">Send a Message</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-gray-700">
                Name:
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
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
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label htmlFor="subject" className="block text-gray-700">
                Subject:
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Enter subject"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-gray-700">
                Message:
              </label>
              <textarea
                id="message"
                name="message"
                rows="5"
                className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.message}
                onChange={handleChange}
                placeholder="Enter your message"
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
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="mt-12">
        <h3 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h3>
        <div className="space-y-4">
          <details className="group">
            <summary className="flex justify-between items-center cursor-pointer bg-gray-100 p-4 rounded-md">
              <span>What is your shipping policy?</span>
              <FaQuestionCircle className="text-gray-500 group-open:transform group-open:rotate-180 transition-transform duration-300" />
            </summary>
            <div className="mt-2 p-4 bg-gray-50 rounded-md">
              <p>We offer free shipping for all orders over $50. The average shipping time is 3-5 business days.</p>
            </div>
          </details>

          <details className="group">
            <summary className="flex justify-between items-center cursor-pointer bg-gray-100 p-4 rounded-md">
              <span>What is your return policy?</span>
              <FaQuestionCircle className="text-gray-500 group-open:transform group-open:rotate-180 transition-transform duration-300" />
            </summary>
            <div className="mt-2 p-4 bg-gray-50 rounded-md">
              <p>
                You can return products within 30 days from the date of receipt. Products must be new, unused, and in
                their original packaging.
              </p>
            </div>
          </details>

          <details className="group">
            <summary className="flex justify-between items-center cursor-pointer bg-gray-100 p-4 rounded-md">
              <span>Can I track my order?</span>
              <FaQuestionCircle className="text-gray-500 group-open:transform group-open:rotate-180 transition-transform duration-300" />
            </summary>
            <div className="mt-2 p-4 bg-gray-50 rounded-md">
              <p>
                Yes, you can track your order through the{' '}
                <NavLink to="/profile" className="text-blue-500 underline">
                  User Profile
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
