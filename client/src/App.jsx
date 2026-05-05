import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { CartProvider } from './context/CartContext' 
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import Analytics from './components/Analytics'
import Orders from './components/Orders'
import Prescriptions from './components/Prescriptions'
import Products from './components/Products'
import Customers from './components/Customers'
import Threepot from './components/Threepot'
import Invoices from './components/Invoices'
import Commission from './components/Commission'
import Setting from './components/Setting'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import './App.css'
import Home from './pages/Home'
import TrendPro from './pages/TrendPro'
import CartPage from './pages/CartPage';

const DashboardLayout = () => {
  const [activePage, setActivePage] = useState('dashboard')

  const pages = {
    dashboard:     <Dashboard />,
    analytics:     <Analytics />,
    orders:        <Orders />,
    prescriptions: <Prescriptions />,
    products:      <Products />,
    customers:     <Customers />,
    threepot:      <Threepot />,
    invoices:      <Invoices />,
    commission:    <Commission />,
    settings:      <Setting />,
    livesite:      <div className="p-8"><h1 className="text-2xl font-semibold">Live Site</h1></div>,
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      <main className="flex-1 overflow-y-auto">
        {pages[activePage]}
      </main>
    </div>
  )
}

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token')
  const user = JSON.parse(localStorage.getItem('user'))

  // Check for admin role logic
  if (!token || user?.role?.toLowerCase() !== 'admin') {
    return <Navigate to="/login" replace />
  }

  return children
}

const App = () => {
  return (
    <CartProvider>
      <BrowserRouter>
        <Toaster position="top-center" reverseOrder={false} />
        
        <Routes>
          {/* Public Routes */}
          <Route path="/home" element={<Home />} />
          <Route path="/trendpro" element={<TrendPro/>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          
          {/* FIXED: Explicit Cart Route to prevent redirection to login */}
          <Route path="/cart" element={<CartPage />} />

          {/* Protected Admin Routes */}
          <Route path="/admin/*" element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          } />

          {/* Root Redirect */}
          <Route path="/" element={<Navigate to="/home" replace />} />

          {/* Catch-all: Redirect to home instead of login for invalid URLs */}
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  )
}

export default App