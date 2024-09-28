import React, { useState, useEffect } from 'react'
import { Line } from 'react-chartjs-2'
import { Chart, registerables } from 'chart.js'
import 'chart.js/auto'

// Đăng ký các thành phần của Chart.js
Chart.register(...registerables)

const DashboardPage = () => {
  const [trafficData, setTrafficData] = useState([]) // Dữ liệu traffic cho biểu đồ
  const [topSellingProducts, setTopSellingProducts] = useState([]) // Sản phẩm bán chạy nhất
  const [lowStockProducts, setLowStockProducts] = useState([]) // Sản phẩm sắp hết hàng
  const [ordersSummary, setOrdersSummary] = useState({
    totalOrders: 0,
    ordersInProcess: 0,
    completedOrders: 0,
    revenue: 0,
  })

  // Hàm fetch dữ liệu từ API
  const fetchData = async () => {
    try {
      // Giả sử API trả về dữ liệu traffic và users (cho biểu đồ)
      const trafficResponse = await fetch('/api/traffic')
      const trafficData = await trafficResponse.json()
      setTrafficData(trafficData)

      // API trả về các sản phẩm bán chạy nhất
      const topProductsResponse = await fetch('/api/products/top-selling')
      const topProducts = await topProductsResponse.json()
      setTopSellingProducts(topProducts)

      // API trả về các sản phẩm sắp hết hàng
      const lowStockResponse = await fetch('/api/products/low-stock')
      const lowStock = await lowStockResponse.json()
      setLowStockProducts(lowStock)

      // API trả về thông tin tổng quan đơn hàng
      const ordersResponse = await fetch('/api/orders/summary')
      const orders = await ordersResponse.json()
      setOrdersSummary(orders)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  // Fetch dữ liệu khi trang dashboard được render
  useEffect(() => {
    fetchData()
  }, [])

  // Dữ liệu cho biểu đồ Line (Traffic và Users)
  const data = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'Traffic',
        data: trafficData.map(item => item.traffic), // Dữ liệu từ API
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Users',
        data: trafficData.map(item => item.users), // Dữ liệu từ API
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: false,
        tension: 0.4,
      },
    ],
  }

  // Tùy chọn cho biểu đồ
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: 250,
      },
    },
  }

  return (
    <div className="p-4 bg-gray-900 min-h-screen mb-20">
      <div className="border-b mb-6">
        <h1 className="text-3xl font-bold text-white mb-4">Dashboard</h1>
      </div>

      {/* Biểu đồ Traffic */}
      <div className="bg-gray-800 shadow-lg rounded-lg p-6 mb-8">
        <h2 className="text-white text-2xl font-semibold mb-4">Traffic</h2>
        <div className="h-[300px]">
          <Line data={data} options={options} />
        </div>
      </div>

      {/* Các số liệu thống kê */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {/* Top Selling Products */}
        <div className="bg-gray-800 text-white rounded-lg p-4 shadow-lg hover:bg-gray-700 transition duration-300">
          <h3 className="text-lg font-bold">Top Selling Products</h3>
          <ul>
            {topSellingProducts.length === 0 ? (
              <p>No products available.</p>
            ) : (
              topSellingProducts.map((product, index) => (
                <li key={index}>
                  - {product.name}: {product.unitsSold} units
                </li>
              ))
            )}
          </ul>
        </div>

        {/* Low Stock Products */}
        <div className="bg-gray-800 text-white rounded-lg p-4 shadow-lg hover:bg-gray-700 transition duration-300">
          <h3 className="text-lg font-bold">Low Stock Products</h3>
          <ul>
            {lowStockProducts.length === 0 ? (
              <p>No low stock products.</p>
            ) : (
              lowStockProducts.map((product, index) => (
                <li key={index}>
                  - {product.name}: {product.stock} units left
                </li>
              ))
            )}
          </ul>
        </div>

        {/* Orders Summary */}
        <div className="bg-gray-800 text-white rounded-lg p-4 shadow-lg hover:bg-gray-700 transition duration-300">
          <h3 className="text-lg font-bold">Orders Summary</h3>
          <p>- Total Orders: {ordersSummary.totalOrders}</p>
          <p>- Orders in Process: {ordersSummary.ordersInProcess}</p>
          <p>- Completed Orders: {ordersSummary.completedOrders}</p>
          <p>- Revenue: ${ordersSummary.revenue}</p>
        </div>

        {/* New Users */}
        <div className="bg-gray-800 text-white rounded-lg p-4 shadow-lg hover:bg-gray-700 transition duration-300">
          <h3 className="text-lg font-bold">New Users</h3>
          <p>{trafficData.length > 0 ? trafficData[0].newUsers : 'No data'}</p>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage