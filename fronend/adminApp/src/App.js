import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { EntitiesProvider } from './context/EntitiesContext'
import AdminLayout from './layouts/AdminLayout'
import LoginPage from './page/LoginPage'
import DashboardPage from './page/DashboardPage'
import OrdersPage from './page/OrdersPage'
import UsersPage from './page/UsersPage'
import ProductsList from './page/ProductsList'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import UpdateProduct from './page/UpdateProduct'
import CreateNewProduct from './page/CreateNewProduct'
import RelatedInformation from './page/RelatedInformation'
import AdminDashboard from './page/AdminDashboard'
import OrderDetailPage from './page/OrderDetailPage'
import PrivateRoute from './components/PrivateRoute'
import EmailLogs from './page/EmailLogs'
import Notifications from './page/Notifications'
function App() {
  return (
    <AuthProvider>
      <EntitiesProvider>
        <ToastContainer position="top-right" autoClose={3000} />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
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
            <Route path="orders/:orderId" element={<OrderDetailPage />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="createrelatedinformation" element={<RelatedInformation />} />
            <Route path="list" element={<ProductsList />} />
            <Route path="update/:id" element={<UpdateProduct />} />
            <Route path="admin" element={<AdminDashboard />} />
            <Route path="emailogs" element={<EmailLogs />} />
            <Route path="notifications" element={<Notifications />} />
          </Route>
          <Route path="" element={<Navigate to="/login" replace />} />
        </Routes>
      </EntitiesProvider>
    </AuthProvider>
  )
}

export default App
