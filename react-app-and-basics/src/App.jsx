import { useState } from 'react'
import { Routes, Route , BrowserRouter , Navigate } from 'react-router'
import Home from './pages/home'
import Products from './pages/products'
import Login from './pages/login'
function App() {




  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/products' element={<Products />} />
      <Route path='/login' element={<Login />} />
      <Route path='*' element={<Navigate to='/' />} />
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
