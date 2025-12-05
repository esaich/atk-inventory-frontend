// src/App.jsx

import { useState, useMemo } from "react";
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from "./layouts/MainLayout";

// Import components and pages
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login/Login";
import AdminDashboard from "./pages/Admin/Dashboard";
import Barang from "./pages/Admin/Barang/Barang";
import Supplier from "./pages/Admin/Supplier/Supplier";
import PengadaanPage from "./pages/Admin/Pengadaan/Pengadaan";
import BarangMasukPage from "./pages/Admin/BarangMasuk/BarangMasuk";
import PaymentPage from "./pages/Admin/Payment/Payment";
import UserDivisiPage from "./pages/Admin/UserDivisi/UserDivisi";

// Komponen Placeholder untuk rute yang belum dibuat
const PlaceholderPage = ({ pageName }) => (
  <div className="text-center py-12">
    <div className="bg-white rounded-xl shadow-md p-8 max-w-md mx-auto">
      <span className="text-6xl">🚧</span>
      <h1 className="text-2xl font-bold mt-4 text-gray-800">
        {pageName}
      </h1>
      <p className="text-gray-600 mt-2">
        Halaman dalam pengembangan...
      </p>
    </div>
  </div>
);

export default function App() {
  // State user, diinisialisasi dari localStorage
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // Penentuan status otentikasi berdasarkan state user
  const isAuthenticated = useMemo(() => !!user, [user]);

  // Handle login: Set state dan simpan ke localStorage
  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  // Handle logout: Hapus state dan localStorage
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <Routes>
      {/* 1. Rute Login (Public) */}
      <Route
        path="/login"
        element={
          isAuthenticated ? <Navigate to="/" replace /> : <Login onLogin={handleLogin} />
        }
      />

      {/* 2. Rute Admin (Protected/Private) */}
      <Route
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <MainLayout user={user} onLogout={handleLogout} />
          </ProtectedRoute>
        }
      >
        {/* ✅ PERBAIKAN: Hapus duplikasi, gunakan real component */}
        <Route path="/" element={<AdminDashboard user={user} />} />
        <Route path="/admin/barang" element={<Barang user={user} />} />
        <Route path="/admin/supplier" element={<Supplier user={user} />} />
        <Route path="/admin/barangmasuk" element={<BarangMasukPage />} />
        <Route path="/admin/permintaan" element={<PlaceholderPage pageName="Permintaan" />} />
        <Route path="/admin/pengadaan" element={<PengadaanPage />} />
        <Route path="/admin/payment" element={<PaymentPage />} />
        <Route path="/admin/userdivisi" element={<UserDivisiPage />} />
      </Route>

      {/* 3. Rute Halaman Tidak Ditemukan (404) */}
      <Route 
        path="*" 
        element={
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <h1 className="text-6xl font-bold text-gray-800">404</h1>
              <p className="text-xl text-gray-600 mt-4">Halaman Tidak Ditemukan</p>
              <a href="/" className="mt-6 inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Kembali ke Dashboard
              </a>
            </div>
          </div>
        } 
      />
    </Routes>
  );
}