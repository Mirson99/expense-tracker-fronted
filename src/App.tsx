import './App.css'
import { BrowserRouter, Routes } from 'react-router'
import { Route } from 'react-router'
import HomePage from './pages/HomePage'
import RegisterPage from './pages/RegisterPage'
import LoginPage from './pages/LoginPage'
import { AuthProvider } from './contexts/AuthProvider'
import { Toaster } from 'react-hot-toast'
import { ProtectedRoute } from './components/ProtectedRoute'
import { Layout } from './components/Layout'

function App() {
  return (
    <>
      <div><Toaster /></div>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route index element={<ProtectedRoute><Layout><HomePage /></Layout></ProtectedRoute>} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </>
  )
}

export default App
