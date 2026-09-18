import { Routes, Route } from 'react-router-dom'
import { StorefrontLayout } from './layouts/StorefrontLayout'
import { AdminLayout } from './layouts/AdminLayout'
import { ProtectedRoute } from './components/ProtectedRoute'
import { DynamicTitle } from './components/ui/DynamicTitle'

import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import Categories from './pages/Categories'
import About from './pages/About'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'
import { Privacy, Terms } from './pages/Legal'

import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminProducts from './pages/admin/AdminProducts'
import AdminProductForm from './pages/admin/AdminProductForm'
import AdminCategories from './pages/admin/AdminCategories'
import AdminSettings from './pages/admin/AdminSettings'

export default function App() {
  return (
    <>
      <DynamicTitle />
      <Routes>
        <Route element={<StorefrontLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:slug" element={<ProductDetail />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
        </Route>

        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="products/new" element={<AdminProductForm />} />
          <Route path="products/:id/edit" element={<AdminProductForm />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        <Route path="*" element={<StorefrontLayout />}>
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  )
}