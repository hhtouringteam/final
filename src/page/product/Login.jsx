import React from 'react'

export default function Login() {
  const handleFacebookLogin = () => {
    console.log('Facebook login clicked')
  }

  const handleGoogleLogin = () => {
    console.log('Google+ login clicked')
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="text-center">
        <h3 className="mb-4 text-2xl font-semibold">LOGIN WITH</h3>
        <div className="flex justify-center mb-6">
          <button className="bg-blue-600 text-white px-4 py-2 rounded mr-2" onClick={handleFacebookLogin}>
            Facebook
          </button>
          <button className="bg-red-600 text-white px-4 py-2 rounded" onClick={handleGoogleLogin}>
            Google+
          </button>
        </div>
        <hr className="w-118 border-t-2 border-gray-700 mb-6" />
      </div>

      <div className="flex w-full max-w-4xl">
        {/* Form Login */}
        <div className="flex-1 px-4">
          <h4 className="text-center mb-4 text-xl font-semibold">Login</h4>
          <form>
            <div className="mb-4">
              <input
                type="email"
                className="w-full px-4 py-2 border rounded border-gray-300"
                placeholder="Enter email"
              />
            </div>
            <div className="relative mb-4">
              <input
                type="password"
                className="w-full px-4 py-2 border rounded border-gray-300"
                placeholder="Password"
              />
              <button type="button" className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-600">
                <i className="fa fa-eye"></i>
              </button>
            </div>
            <div className="mb-4 text-center">
              <a href="/forgot-password" className="text-blue-600 hover:underline">
                Forgot Password?
              </a>
            </div>
            <div className="text-center">
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Login
              </button>
            </div>
          </form>
        </div>

        {/* Form Register */}
        <div className="flex-1 px-4">
          <h4 className="text-center mb-4 text-xl font-semibold">Register</h4>
          <form>
            <div className="mb-4">
              <input type="text" className="w-full px-4 py-2 border rounded border-gray-300" placeholder="First Name" />
            </div>
            <div className="mb-4">
              <input type="text" className="w-full px-4 py-2 border rounded border-gray-300" placeholder="Last Name" />
            </div>
            <div className="mb-4">
              <input type="email" className="w-full px-4 py-2 border rounded border-gray-300" placeholder="Email" />
            </div>
            <div className="mb-4">
              <input
                type="password"
                className="w-full px-4 py-2 border rounded border-gray-300"
                placeholder="Password"
              />
            </div>
            <div className="mb-4">
              <input
                type="password"
                className="w-full px-4 py-2 border rounded border-gray-300"
                placeholder="Confirm Password"
              />
            </div>
            <div className="text-center">
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Register
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
