// src/App.jsx

import { useState, useMemo } from "react";
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from "./layouts/MainLayout";

// Import components and pages
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login/Login";

// Admin Pages
import AdminDashboard from "./pages/Admin/Dashboard";
import Barang from "./pages/Admin/Barang/Barang";
import Supplier from "./pages/Admin/Supplier/Supplier";
import PengadaanPage from "./pages/Admin/Pengadaan/Pengadaan";
import BarangMasukPage from "./pages/Admin/BarangMasuk/BarangMasuk";
import PaymentPage from "./pages/Admin/Payment/Payment";
import PermintaanPage from "./pages/Admin/Permintaan/Permintaan";
import UserDivisiPage from "./pages/Admin/UserDivisi/UserDivisi";

// Divisi Pages
import DivisiDashboard from "./pages/Divisi/Dashboard";
import CreatePermintaan from "./pages/Divisi/Permintaan/CreatePermintaan";
import StatusPermintaan from "./pages/Divisi/Permintaan/StatusPermintaan";
import LihatStok from "./pages/Divisi/LihatStok";

// Komponen Placeholder
const PlaceholderPage = ({ pageName }) => (
  <div className="text-center py-12">
    <div className="bg-white rounded-xl shadow-md p-8 max-w-md mx-auto">
      <span className="text-6xl">🚧</span>
      <h1 className="text-2xl font-bold mt-4 text-gray-800">{pageName}</h1>
      <p className="text-gray-600 mt-2">Halaman dalam pengembangan...</p>
    </div>
  </div>
);

export default function App() {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const isAuthenticated = useMemo(() => !!user, [user]);
  const userRole = user?.role?.toLowerCase() || (user?.namaDivisi ? 'divisi' : 'guest');

  const getRedirectPath = () => {
    if (!isAuthenticated) return '/login';
    if (userRole === 'admin') return '/admin';
    if (userRole === 'divisi') return '/divisi';
    return '/login';
  };

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <Routes>
      {/* Login Route */}
      <Route
        path="/login"
        element={
          isAuthenticated 
            ? <Navigate to={getRedirectPath()} replace />
            : <Login onLogin={handleLogin} />
        }
      />

      {/* Root redirect */}
      <Route path="/" element={<Navigate to={getRedirectPath()} replace />} />

      {/* Admin Routes */}
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated} requiredRole="admin" userRole={userRole}>
            <MainLayout user={user} onLogout={handleLogout} />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard user={user} />} />
        <Route path="barang" element={<Barang user={user} />} />
        <Route path="supplier" element={<Supplier user={user} />} />
        <Route path="barangmasuk" element={<BarangMasukPage />} />
        <Route path="permintaan" element={<PermintaanPage />} />
        <Route path="pengadaan" element={<PengadaanPage />} />
        <Route path="payment" element={<PaymentPage/>} />
        <Route path="userdivisi" element={<UserDivisiPage />} />
      </Route>

      {/* Divisi Routes */}
      <Route
        path="/divisi/*"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated} requiredRole="divisi" userRole={userRole}>
            <MainLayout user={user} onLogout={handleLogout} />
          </ProtectedRoute>
        }
      >
        <Route index element={<DivisiDashboard user={user} />} />
        <Route path="permintaan/create" element={<CreatePermintaan user={user} />} />
        <Route path="permintaan/status" element={<StatusPermintaan user={user} />} />
        <Route path="stok" element={<LihatStok />} />
      </Route>

      {/* 404 Route */}
      <Route 
        path="*" 
        element={
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <h1 className="text-6xl font-bold text-gray-800">404</h1>
              <p className="text-xl text-gray-600 mt-4">Halaman Tidak Ditemukan</p>
              <a href={getRedirectPath()} className="mt-6 inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Kembali ke Dashboard
              </a>
            </div>
          </div>
        } 
      />
    </Routes>
  );
}