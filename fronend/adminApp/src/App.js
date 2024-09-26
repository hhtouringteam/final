import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { EntitiesProvider } from './context/EntitiesContext' // Import EntitiesProvider
import AdminLayout from './layouts/AdminLayout'
import LoginPage from './page/LoginPage'
import DashboardPage from './page/DashboardPage'

import OrdersPage from './page/OrdersPage' // Import OrdersPage
import UsersPage from './page/UsersPage' // Import UsersPage


import ProductsList from './page/ProductsList'

import { ToastContainer } from 'react-toastify' // Import ToastContainer
import 'react-toastify/dist/ReactToastify.css' // Import CSS cho react-toastify
import UpdateProduct from './page/UpdateProduct'
import CreateNewProduct from './page/CreateNewProduct'
import RelatedInformation from './page/RelatedInformation'
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <AuthProvider>
      <EntitiesProvider>
        <ToastContainer position="top-right" autoClose={3000} />
        <Routes>
          {/* Route cho trang login */}
          <Route path="/login" element={<LoginPage />} />

          {/* Route cho layout admin với bảo vệ ProtectedRoute */}
          <Route
            path="/*"
            element={
              <PrivateRoute>
                <AdminLayout />
              </PrivateRoute>
            }
          >
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="create" element={<CreateNewProduct />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="createrelatedinformation" element={<RelatedInformation />} />
            <Route path="list" element={<ProductsList />} />
            <Route path="update/:id" element={<UpdateProduct />} />
            <Route path="users" element={<UsersPage />} />
          </Route>
        </Routes>
      </EntitiesProvider>
    </AuthProvider>
  )
}

export default App
