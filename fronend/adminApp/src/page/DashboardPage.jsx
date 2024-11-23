// src/components/DashboardPage.js

import React, { useState, useEffect } from 'react'
import { Bar } from 'react-chartjs-2'
import { Chart, registerables } from 'chart.js'
import 'chart.js/auto'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { formatVND } from '../utils/formatVND' // Adjust the path as needed

// Đăng ký các thành phần của Chart.js
Chart.register(...registerables)

const DashboardPage = () => {
  // State để lưu trữ tổng số Users và Installments từ API
  const [totalUsers, setTotalUsers] = useState(0)
  const [installmentSummary, setInstallmentSummary] = useState({
    totalInstallments: 0,
    completedInstallments: 0,
    installmentsInProcess: 0,
    overdueInstallments: 0,
  })

  // State để lưu trữ thống kê chi tiết Installments
  const [detailedInstallmentSummary, setDetailedInstallmentSummary] = useState({
    totalAmount: 0,
    averageInterestRate: 0,
  })

  // State để lưu trữ các dữ liệu thống kê khác
  const [ordersSummary, setOrdersSummary] = useState({
    totalOrders: 0,
    completedOrders: 0,
    ordersInProcess: 0,
    revenue: 0,
  })

  const [topSellingProducts, setTopSellingProducts] = useState([]) // Sản phẩm bán chạy nhất
  const [lowStockProducts, setLowStockProducts] = useState([]) // Sản phẩm sắp hết hàng

  // Dữ liệu cho biểu đồ tổng hợp với 5 trường
  const [chartData, setChartData] = useState({
    labels: ['Total Users', 'Total Installments', 'Completed Orders', 'In Process Orders', 'Completed Installments'],
    datasets: [
      {
        label: 'Counts',
        data: [0, 0, 0, 0, 0],
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)', // Users
          'rgba(255, 99, 132, 0.6)', // Installments
          'rgba(54, 162, 235, 0.6)', // Completed Orders
          'rgba(255, 206, 86, 0.6)', // In Process Orders
          'rgba(153, 102, 255, 0.6)', // Completed Installments
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)', // Users
          'rgba(255, 99, 132, 1)', // Installments
          'rgba(54, 162, 235, 1)', // Completed Orders
          'rgba(255, 206, 86, 1)', // In Process Orders
          'rgba(153, 102, 255, 1)', // Completed Installments
        ],
        borderWidth: 1,
      },
    ],
  })

  // Tùy chọn cho biểu đồ Bar
  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: '#ffffff', // Đổi màu chữ trục y
        },
      },
      x: {
        ticks: {
          color: '#ffffff', // Đổi màu chữ trục x
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: '#ffffff', // Đổi màu chữ chú thích
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.dataset.label}: ${context.parsed.y}`
          },
        },
      },
    },
  }

  // Hàm fetch dữ liệu từ API
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch tổng số Users
        const usersResponse = await fetch('http://localhost:5000/api/users/users')
        if (!usersResponse.ok) {
          throw new Error('Error fetching total users')
        }
        const usersData = await usersResponse.json()
        setTotalUsers(usersData.count)
      } catch (error) {
        console.error('Error fetching total users:', error)
        toast.error('Failed to fetch total users')
      }

      try {
        // Fetch tổng hợp Installments
        const installmentSummaryResponse = await fetch('http://localhost:5000/api/installments/summary')
        if (!installmentSummaryResponse.ok) {
          throw new Error('Error fetching installment summary')
        }
        const installmentSummaryData = await installmentSummaryResponse.json()
        setInstallmentSummary(installmentSummaryData)
      } catch (error) {
        console.error('Error fetching installment summary:', error)
        toast.error('Failed to fetch installment summary')
      }

      try {
        // Fetch tổng hợp chi tiết Installments
        const detailedSummaryResponse = await fetch('http://localhost:5000/api/installments/detailed-summary')
        if (!detailedSummaryResponse.ok) {
          throw new Error('Error fetching detailed installment summary')
        }
        const detailedSummaryData = await detailedSummaryResponse.json()
        setDetailedInstallmentSummary({
          totalAmount: detailedSummaryData.totalAmount,
          averageInterestRate: detailedSummaryData.averageInterestRate,
        })
      } catch (error) {
        console.error('Error fetching detailed installment summary:', error)
        toast.error('Failed to fetch detailed installment summary')
      }

      try {
        // Fetch Orders Summary
        const ordersResponse = await fetch('http://localhost:5000/api/orders/summary')
        if (!ordersResponse.ok) {
          throw new Error('Error fetching orders summary')
        }
        const orders = await ordersResponse.json()
        setOrdersSummary({
          totalOrders: orders.totalOrders,
          completedOrders: orders.completedOrders,
          ordersInProcess: orders.ordersInProcess,
          revenue: orders.revenue,
        })
      } catch (error) {
        console.error('Error fetching orders summary:', error)
        toast.error('Failed to fetch orders summary')
      }

      try {
        // Fetch Top Selling Products
        const topProductsResponse = await fetch('http://localhost:5000/api/orders/topselling')
        if (!topProductsResponse.ok) {
          throw new Error('Error fetching top selling products')
        }
        const topProducts = await topProductsResponse.json()
        setTopSellingProducts(topProducts)
      } catch (error) {
        console.error('Error fetching top selling products:', error)
        toast.error('Failed to fetch top selling products')
      }

      try {
        // Fetch Low Stock Products
        const lowStockResponse = await fetch('http://localhost:5000/api/orders/lowstock')
        if (!lowStockResponse.ok) {
          throw new Error('Error fetching low stock products')
        }
        const lowStock = await lowStockResponse.json()
        setLowStockProducts(lowStock)
      } catch (error) {
        console.error('Error fetching low stock products:', error)
        toast.error('Failed to fetch low stock products')
      }
    }

    fetchData()
  }, [])

  // Cập nhật dữ liệu cho biểu đồ khi các state thay đổi
  useEffect(() => {
    setChartData({
      labels: ['Total Users', 'Total Installments', 'Completed Orders', 'In Process Orders', 'Completed Installments'],
      datasets: [
        {
          label: 'Counts',
          data: [
            totalUsers,
            installmentSummary.totalInstallments,
            ordersSummary.completedOrders,
            ordersSummary.ordersInProcess,
            installmentSummary.completedInstallments,
          ],
          backgroundColor: [
            'rgba(75, 192, 192, 0.6)', // Users
            'rgba(255, 99, 132, 0.6)', // Installments
            'rgba(54, 162, 235, 0.6)', // Completed Orders
            'rgba(255, 206, 86, 0.6)', // In Process Orders
            'rgba(153, 102, 255, 0.6)', // Completed Installments
          ],
          borderColor: [
            'rgba(75, 192, 192, 1)', // Users
            'rgba(255, 99, 132, 1)', // Installments
            'rgba(54, 162, 235, 1)', // Completed Orders
            'rgba(255, 206, 86, 1)', // In Process Orders
            'rgba(153, 102, 255, 1)', // Completed Installments
          ],
          borderWidth: 1,
        },
      ],
    })
  }, [totalUsers, installmentSummary, ordersSummary])

  return (
    <div className="p-4 bg-gray-900 min-h-screen mb-20 text-white">
      <ToastContainer position="bottom-center" />
      <div className="border-b border-gray-700 mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
      </div>

      {/* Biểu đồ Tổng hợp */}
      <div className="bg-gray-800 shadow-lg rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Dashboard Overview</h2>
        <div className="h-96">
          <Bar data={chartData} options={barOptions} />
        </div>
      </div>

      {/* Các danh sách Top Selling Products và Low Stock Products */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {/* Top Selling Products */}
        <div className="bg-gray-800 text-white rounded-lg p-6 shadow-lg">
          <h3 className="text-xl font-semibold mb-4">Top Selling Products</h3>
          <ul className="list-disc list-inside">
            {topSellingProducts.length === 0 ? (
              <p>No products available.</p>
            ) : (
              topSellingProducts.slice(0, 5).map((product, index) => (
                <li key={index}>
                  {product.name}: {product.unitsSold} units
                </li>
              ))
            )}
          </ul>
        </div>

        {/* Low Stock Products */}
        <div className="bg-gray-800 text-white rounded-lg p-6 shadow-lg">
          <h3 className="text-xl font-semibold mb-4">Low Stock Products</h3>
          <ul className="list-disc list-inside">
            {lowStockProducts.length === 0 ? (
              <p>No low stock products.</p>
            ) : (
              lowStockProducts.slice(0, 5).map((product, index) => (
                <li key={index}>
                  {product.name}: {product.stock} units left
                </li>
              ))
            )}
          </ul>
        </div>
      </div>

      {/* Các thẻ thống kê chi tiết */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {/* Orders Summary */}
        <div className="bg-gray-800 text-white rounded-lg p-6 shadow-lg">
          <h3 className="text-xl font-semibold mb-4">Orders Summary</h3>
          <p>
            Total Orders: <span className="font-semibold">{ordersSummary.totalOrders}</span>
          </p>
          <p>
            Completed Orders: <span className="font-semibold">{ordersSummary.completedOrders}</span>
          </p>
          <p>
            In Process Orders: <span className="font-semibold">{ordersSummary.ordersInProcess}</span>
          </p>
          <p>
            Revenue: <span className="font-semibold">{formatVND(ordersSummary.revenue)}</span>
          </p>
        </div>

        {/* Installment Summary */}
        <div className="bg-gray-800 text-white rounded-lg p-6 shadow-lg">
          <h3 className="text-xl font-semibold mb-4">Installment Summary</h3>
          <p>
            Total Installments: <span className="font-semibold">{installmentSummary.totalInstallments}</span>
          </p>
          <p>
            Completed Installments: <span className="font-semibold">{installmentSummary.completedInstallments}</span>
          </p>
          <p>
            In Process Installments: <span className="font-semibold">{installmentSummary.installmentsInProcess}</span>
          </p>
          <p>
            Overdue Installments: <span className="font-semibold">{installmentSummary.overdueInstallments}</span>
          </p>
          <p>
            Total Amount: <span className="font-semibold">{formatVND(detailedInstallmentSummary.totalAmount)}</span>
          </p>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
