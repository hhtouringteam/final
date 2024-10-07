

import React from 'react'
import { FaShippingFast, FaExchangeAlt, FaBoxOpen } from 'react-icons/fa'

const FreeShippingReturns = () => {
  return (
    <div className="container mx-auto mt-10 p-6">
      <h2 className="text-3xl font-bold text-center mb-8">Free Shipping & Returns</h2>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Free Shipping */}
        <div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center text-center">
          <FaShippingFast className="text-4xl text-blue-500 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Free Shipping</h3>
          <p className="text-gray-600">
            Enjoy free shipping on all orders over $50. We deliver nationwide with fast and reliable service.
          </p>
        </div>

    
        <div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center text-center">
          <FaExchangeAlt className="text-4xl text-green-500 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Easy Returns</h3>
          <p className="text-gray-600">
            Not satisfied with your purchase? Return it within 30 days for a full refund or exchange.
          </p>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center text-center">
          <FaBoxOpen className="text-4xl text-yellow-500 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Secure Packaging</h3>
          <p className="text-gray-600">
            All products are carefully packaged to ensure they arrive in perfect condition.
          </p>
        </div>
      </div>

      <div className="mt-12 text-center">
        <h3 className="text-2xl font-semibold mb-4">Our Commitment</h3>
        <p className="text-gray-700">
          We are committed to providing the best shopping experience for our customers. Our free shipping and easy
          returns policies are designed to ensure your satisfaction with every purchase.
        </p>
      </div>
    </div>
  )
}

export default FreeShippingReturns
