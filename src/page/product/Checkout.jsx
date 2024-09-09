import React from 'react'
import { useCart } from './context/CartContext' // Giả sử bạn đã tạo CartContext

export default function Checkout() {
  const { cart, totalPriceInCart, totalItemsInCart } = useCart()

  return (
    <div className="py-5 mt-4 p-10 bg-white shadow-md">
      {/* Coupon Section */}
      <div className="flex mb-3">
        <div className="flex-1">
          <input
            type="text"
            className="form-input w-full px-4 py-2 border border-gray-300 rounded-md"
            placeholder="Have a coupon?"
          />
        </div>
        <div className="ml-4">
          <button className="btn bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            Click here to enter your code
          </button>
        </div>
      </div>

      {/* Billing Information */}
      <div className="mb-3">
        <h2 className="text-2xl font-semibold">Billing details</h2>
        <form id="billing-form">
          <div className="flex flex-wrap -mx-2">
            <div className="w-full md:w-1/2 px-2 mb-3">
              <input
                type="text"
                className="form-input w-full px-4 py-2 border border-gray-300 rounded-md"
                placeholder="First name *"
                required
              />
            </div>
            <div className="w-full md:w-1/2 px-2 mb-3">
              <input
                type="text"
                className="form-input w-full px-4 py-2 border border-gray-300 rounded-md"
                placeholder="Last name *"
                required
              />
            </div>
          </div>
          <div className="mb-3">
            <input
              type="text"
              className="form-input w-full px-4 py-2 border border-gray-300 rounded-md"
              placeholder="Company name (optional)"
            />
          </div>
          <div className="mb-3">
            <input
              type="text"
              className="form-input w-full px-4 py-2 border border-gray-300 rounded-md"
              placeholder="Country / Region *"
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="text"
              className="form-input w-full px-4 py-2 border border-gray-300 rounded-md"
              placeholder="Street address *"
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="text"
              className="form-input w-full px-4 py-2 border border-gray-300 rounded-md"
              placeholder="Town / City *"
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="text"
              className="form-input w-full px-4 py-2 border border-gray-300 rounded-md"
              placeholder="State / County"
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="text"
              className="form-input w-full px-4 py-2 border border-gray-300 rounded-md"
              placeholder="ZIP / Postal Code *"
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="tel"
              className="form-input w-full px-4 py-2 border border-gray-300 rounded-md"
              placeholder="Phone *"
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="email"
              className="form-input w-full px-4 py-2 border border-gray-300 rounded-md"
              placeholder="Email address *"
              required
            />
          </div>
        </form>
      </div>

      {/* Order Summary */}
      <div className="mb-3">
        <h2 className="text-2xl font-semibold">Your order</h2>
        {cart.map(item => (
          <p key={item.id}>{item.name}</p>
        ))}
        <p>Total quantity: {totalItemsInCart} product</p>
        <p>Subtotal: ${totalPriceInCart}</p>
        <p>Total: ${totalPriceInCart}</p>
      </div>

      {/* Payment Methods */}
      <div className="mb-3">
        <h2 className="text-2xl font-semibold">Payment method</h2>
        <form id="payment-form">
          <div className="form-check mb-2">
            <input className="form-radio text-blue-600" type="radio" name="payment" id="direct-bank" defaultChecked />
            <label className="ml-2" htmlFor="direct-bank">
              Direct Bank Transfer
            </label>
          </div>
          <div className="form-check mb-2">
            <input className="form-radio text-blue-600" type="radio" name="payment" id="check-payment" />
            <label className="ml-2" htmlFor="check-payment">
              Check Payment
            </label>
          </div>
          <div className="form-check mb-2">
            <input className="form-radio text-blue-600" type="radio" name="payment" id="cash-delivery" />
            <label className="ml-2" htmlFor="cash-delivery">
              Cash on Delivery
            </label>
          </div>
        </form>
      </div>

      {/* Submit Button */}
      <button
        form="billing-form"
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700"
      >
        Place Order
      </button>
    </div>
  )
}
