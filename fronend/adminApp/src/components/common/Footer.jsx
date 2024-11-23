// Footer.jsxTemplate
import React from 'react'

const Footer = ({ isSidebarVisible }) => {
  return (
    <div
      className={`fixed border-t border-gray-700 bottom-0 left-0 h-16 flex items-center justify-between bg-gray-900 text-white z-1000 px-4 transition-all duration-300 ${
        isSidebarVisible ? 'ml-64 w-[calc(100%-16rem)]' : 'ml-0 w-full'
      }`}
    >
      <div className="text-center w-full px-4 text-sm md:text-base  ">
        <p>
          <a href="!" className="text-blue-400 hover:underline">
          Hhtouringteam Admin Dashboard
          </a>{' '}
          © 2024 creativeLabs. Powered by{' '}
          <a href="!/" className="text-blue-400 hover:underline">
          Product Management Solutions
          </a>
        </p>
      </div>
    </div>
  )
}

export default Footer
