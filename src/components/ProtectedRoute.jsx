// src/components/ProtectedRoute.jsx

import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ isAuthenticated, children }) {
  // Jika user belum login, redirect ke halaman login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Jika sudah login, tampilkan children (komponen yang dilindungi)
  return children;
}