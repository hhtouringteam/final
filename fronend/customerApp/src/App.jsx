import React from 'react'
import './App.css'
import 'leaflet/dist/leaflet.css'
import { Routes, Route } from 'react-router-dom'
import Layout from './component/Layout'
import Index from './page/home/Index'
import Cart from './page/product/Cart'
import Checkout from './page/product/Checkout'
import Login from './page/product/Login'
import ProductDetail from './page/product/ProductDetail'
import Tcsp from './page/product/Tcsp'
import WishList from './page/product/WishList'
import Text from './page/product/Text'
import 'react-toastify/dist/ReactToastify.css'
import UserProfile from './page/product/UserProfile'
import PaymentResult from './page/product/PaymentResult'
import StoreLocator from './component/StoreLocator'
import FreeShippingReturns from './component/FreeShippingReturns'
import Support from './component/Support' // Import Support component
import Blog from './component/Blog'
import BlogDetail from './component/BlogDetail'
function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="" element={<Index />} />
        <Route path="cart" element={<Cart />} />
        <Route path="Checkout" element={<Checkout />} />
        <Route path="login" element={<Login />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/Tcsp" element={<Tcsp />} />
        <Route path="/wishlist" element={<WishList />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/payment-result" element={<PaymentResult />} />
        <Route path="/store-locator" element={<StoreLocator />} />
        <Route path="/free-shipping-returns" element={<FreeShippingReturns />} />
        <Route path="/support" element={<Support />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<BlogDetail />} />
        <Route path="/Text/:slug" element={<Text />} />

        <Route path="/admin" element={<Text />} />
        <Route path="/admin/product" element={<Text />} />
        <Route path="/admin/cateogry" element={<Text />} />
      </Route>
    </Routes>
  )
}
export default App
