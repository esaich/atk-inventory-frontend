// src/layouts/MainLayout.jsx (REVISI)

import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import ConfirmModal from '../components/ConfirmModal'; // Pastikan ConfirmModal di-import

export default function MainLayout({ user, onLogout }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // ✅ State untuk Confirm Modal (BARU)
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    type: 'warning',
    title: '',
    message: '',
    onConfirm: null,
    confirmText: 'Ya, Logout',
    cancelText: 'Batal',
    loading: false, // Tambahkan state loading jika diperlukan
  });

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // ✅ Function untuk menampilkan Modal Logout (BARU)
  const handleLogoutClick = () => {
    setConfirmModal({
      isOpen: true,
      type: 'danger', // Ganti ke danger untuk logout
      title: 'Konfirmasi Logout',
      message: 'Apakah Anda yakin ingin keluar dari sistem? Anda harus login kembali.',
      onConfirm: handleLogoutConfirm,
      confirmText: 'Ya, Logout',
      cancelText: 'Batal',
      loading: false,
    });
  };

  // ✅ Function yang dipanggil setelah User Konfirmasi di Modal (BARU)
  const handleLogoutConfirm = () => {
    // Di sini Anda bisa menambahkan logika loading jika proses logout butuh waktu
    setConfirmModal(prev => ({ ...prev, loading: true })); 
    
    // Panggil function logout yang sebenarnya dari parent (App.jsx)
    onLogout(); 
    
    // Reset modal setelah proses selesai (biasanya tidak diperlukan karena onLogout akan mengalihkan halaman)
    // setConfirmModal({ ...confirmModal, isOpen: false }); 
  };
  
  // Function untuk menutup modal
  const closeConfirmModal = () => {
    setConfirmModal(prev => ({ ...prev, isOpen: false, loading: false }));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar - Menerima handleLogoutClick */}
      <Sidebar 
        user={user}
        onLogout={handleLogoutClick} // ✅ Arahkan onLogout ke function yang memicu modal
        isOpen={sidebarOpen}
        onToggle={toggleSidebar}
      />
      
      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        
        {/* Top Header Bar */}
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              
              {/* Toggle Button & Breadcrumb */}
              <div className="flex items-center gap-4">
                <button
                  onClick={toggleSidebar}
                  className="p-2 rounded-lg hover:bg-gray-100 transition"
                >
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Sistem ATK</h2>
                  <p className="text-sm text-gray-500">Pengadaan & Pengelolaan ATK</p>
                </div>
              </div>

              {/* User Info */}
              <div className="flex items-center gap-3">
                <div className="text-right hidden md:block">
                  <p className="text-sm font-semibold text-gray-800">
                    {user?.nama || user?.username || 'User'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {user?.role || user?.namaDivisi || 'Role'}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                  {(user?.nama || user?.username || 'U').charAt(0).toUpperCase()}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
        
        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 py-4 mt-auto">
          <div className="px-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-2 text-sm text-gray-600">
              <p>© 2024 <span className="font-semibold">Sistem ATK</span>. All rights reserved.</p>
              <div className="flex gap-4">
                <a href="#" className="hover:text-blue-600 transition">Help</a>
                <a href="#" className="hover:text-blue-600 transition">Documentation</a>
                <a href="#" className="hover:text-blue-600 transition">Support</a>
              </div>
            </div>
          </div>
        </footer>
      </div>

      {/* ✅ Implementasi Confirm Modal (BARU) */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={closeConfirmModal}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        type={confirmModal.type}
        confirmText={confirmModal.confirmText}
        cancelText={confirmModal.cancelText}
        loading={confirmModal.loading}
      />
    </div>
  );
}