import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
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

// ── Main Dashboard Layout ─────────────────────────────────────────────────────
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

// ── Protected Route ───────────────────────────────────────────────────────────
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token')
  return token ? children : <Navigate to="/login" />
}

// ── App ───────────────────────────────────────────────────────────────────────
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Pages */}
        <Route path="/login"                   element={<Login />} />
        <Route path="/register"                element={<Register />} />
        <Route path="/forgot-password"         element={<ForgotPassword />} />
        <Route path="/reset-password/:token"   element={<ResetPassword />} />

        {/* Protected Dashboard */}
        <Route path="/*" element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App