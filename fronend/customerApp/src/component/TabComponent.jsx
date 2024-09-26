import React, { useState } from 'react'

function TabComponent() {
  const [activeTab, setActiveTab] = useState('accessories')

  const handleTabClick = tab => {
    setActiveTab(tab)
  }

  return (
    <div>
      <div className="flex border-b">
        <button
          className={`mr-5 text-center py-2 ${activeTab === 'accessories' ? 'text-blue-600 border-blue-600' : 'text-gray-500 border-transparent'} border-b-2`}
          onClick={() => handleTabClick('accessories')}
        >
          Accessories
        </button>
        <button
          className={`mr-5 text-center py-2 ${activeTab === 'specification' ? 'text-blue-600 border-blue-600' : 'text-gray-500 border-transparent'} border-b-2`}
          onClick={() => handleTabClick('specification')}
        >
          Specification
        </button>
        <button
          className={` text-center py-2 ${activeTab === 'reviews' ? 'text-blue-600 border-blue-600' : 'text-gray-500 border-transparent'} border-b-2`}
          onClick={() => handleTabClick('reviews')}
        >
          Reviews
        </button>
      </div>
      <div className="tab-content mt-4">
        {activeTab === 'accessories' && <div>Content for Accessories</div>}
        {activeTab === 'specification' && <div>Content for Specification</div>}
        {activeTab === 'reviews' && (
          <div className="bg-white shadow p-4 rounded-lg">
            <h1 className="text-xl font-semibold">Reviews</h1>
            <p>There are no reviews yet.</p>
            <h2 className="text-lg">Be the first to review "Chuột Không Dây Dare-U LM106G - BLACK"</h2>
            <form action="#" method="POST">
              <div className="mb-4">
                <label htmlFor="rating" className="block text-sm font-medium text-gray-700">
                  Your Rating *
                </label>
                <input
                  type="text"
                  id="rating"
                  name="rating"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="review" className="block text-sm font-medium text-gray-700">
                  Your Review *
                </label>
                <textarea
                  id="review"
                  name="review"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Your Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Your Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  id="save-info"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 text-sm text-gray-900" htmlFor="save-info">
                  Save my name, email, and website in this browser for the next time I comment.
                </label>
              </div>
              <button type="submit" className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">
                Submit
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}

export default TabComponent
