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
import IndexAnhThanh from './page/home/IndexAnhThanh'
import Camera from './page/home/Camera'
import WishList from './page/product/WishList'

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
        <Route path="/thanh" element={<IndexAnhThanh />} />
        <Route path="/camera" element={<Camera />} />
        <Route path="/wishlist" element={<WishList />} />
      </Route>
    </Routes>
  )
}
export default App
