// src/components/ProtectedRoute.jsx (Diperbarui)

import { Navigate } from 'react-router-dom';

/**
 * Komponen rute yang melindungi akses berdasarkan Otentikasi dan Otorisasi (Role).
 * * @param {boolean} isAuthenticated - Apakah user sudah login.
 * @param {string} requiredRole - Peran yang dibutuhkan ('admin' atau 'divisi').
 * @param {string} userRole - Peran user yang sedang login.
 * @param {JSX.Element} children - Komponen yang akan dirender jika akses diizinkan.
 */
export default function ProtectedRoute({ isAuthenticated, requiredRole, userRole, children }) {
  
  // 1. Cek Otentikasi (WAJIB)
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 2. Cek Otorisasi (Peran)
  // Membandingkan peran (diubah ke lowercase untuk konsistensi)
  // Jika requiredRole tidak disetel, anggap saja akses diizinkan
  const isAuthorized = !requiredRole || requiredRole.toLowerCase() === userRole.toLowerCase();

  if (!isAuthorized) {
    // Tentukan path fallback yang benar (Dashboard yang sesuai dengan role user)
    const fallbackPath = userRole === 'admin' ? '/admin' : '/divisi';
    
    // Jika user sudah login tetapi mencoba mengakses rute yang tidak sesuai dengan perannya,
    // arahkan mereka ke dashboard yang benar.
    console.warn(`Akses ditolak. User role: ${userRole}, Required role: ${requiredRole}. Redirecting to ${fallbackPath}`);
    return <Navigate to={fallbackPath} replace />; 
  }

  // 3. Jika otentikasi dan otorisasi berhasil, tampilkan children
  return children;
}