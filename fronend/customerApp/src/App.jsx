import React from 'react'
import './App.css'
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
import 'react-toastify/dist/ReactToastify.css';
import UserProfile from './page/product/UserProfile'
function App() {
  return (
  
    <Routes>
    
      <Route path="/" element={<Layout />}>
        <Route path="" element={<Index />} />
        <Route path="cart" element={<Cart />} />
        <Route path="Checkout" element={<Checkout />} />
        <Route path="login" element={<Login />} />
        <Route path="/products/:slug" element={<ProductDetail />} />
        <Route path="/Tcsp" element={<Tcsp />} />
        <Route path="/wishlist" element={<WishList />} />
        <Route path="/user" element={<UserProfile />} />


        <Route path="/Text/:slug" element={<Text />} />

        <Route path="/admin" element={<Text />} />
        <Route path="/admin/product" element={<Text />} />
        <Route path="/admin/cateogry" element={<Text />} />
      </Route>
      
    </Routes>
     
  )
}
export default App
