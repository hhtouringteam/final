import React from 'react'

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white px-5 mt-4 p-10">
      <div className="py-4">
        <div className="grid grid-cols-3 text-center">
          <div>
            <div className="footer-links">
              <h3 className="text-lg font-semibold">Quick Links</h3>
              <ul className="list-none">
                <li>
                  <a href="!" className="text-white hover:text-gray-300">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="!" className="text-white hover:text-gray-300">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="!" className="text-white hover:text-gray-300">
                    Quality & Sustainability
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div>
            <div className="footer-links">
              <h3 className="text-lg font-semibold">Get Involved</h3>
              <ul className="list-none">
                <li>
                  <a href="!" className="text-white hover:text-gray-300">
                    Orders & Shipping
                  </a>
                </li>
                <li>
                  <a href="!" className="text-white hover:text-gray-300">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="!" className="text-white hover:text-gray-300">
                    Customer Service
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div>
            <div className="social-icons">
              <h3 className="text-lg font-semibold">Follow us on:</h3>
              <a href="!" className="text-white mr-3">
                <i className="fab fa-facebook-f" />
              </a>
              <a href="!" className="text-white mr-3">
                <i className="fab fa-twitter" />
              </a>
              <a href="!" className="text-white mr-3">
                <i className="fab fa-youtube" />
              </a>
              <a href="!" className="text-white">
                <i className="fab fa-instagram" />
              </a>
            </div>
          </div>
        </div>

        <hr className="my-4 border-gray-500" />
        <div className="grid grid-cols-3 text-center">
          <div>
            <h3 className="text-lg font-semibold">HHtouringteam</h3>
          </div>
          <div>
            <p>Phone: +84 337325729</p>
          </div>
          <div>
            <p>Email: Huynhgcs190363@fpt.edu.vn</p>
          </div>
        </div>
        <hr className="my-4 border-gray-500" />
        <div className="grid grid-cols-2">
          <div>
            <p>© 2022 QODE INTERACTIVE, ALL RIGHTS RESERVED</p>
          </div>
          <div>
            <img src="" alt="Payment Methods" className="object-cover" />
          </div>
        </div>
      </div>
    </footer>
  )
}
