// src/components/Sidebar.jsx

import { Link, useLocation } from 'react-router-dom';

// --- DEFINISI MENU ADMIN ---
const ADMIN_MENU = [
  { 
    name: 'Dashboard', 
    path: '/admin',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ) 
  },
  { 
    name: 'Barang', 
    path: '/admin/barang', 
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ) 
  },
  { 
    name: 'Supplier', 
    path: '/admin/supplier', 
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ) 
  },
  { 
    name: 'Barang Masuk', 
    path: '/admin/barang-masuk',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
      </svg>
    ) 
  },
  { 
    name: 'Barang Keluar', 
    path: '/admin/barang-keluar',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
      </svg>
    ) 
  },
  { 
    name: 'Permintaan', 
    path: '/admin/permintaan', 
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ) 
  },
  { 
    name: 'Pengadaan', 
    path: '/admin/pengadaan', 
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ) 
  },
  { 
    name: 'Payment', 
    path: '/admin/payment', 
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    ) 
  },
  { 
    name: 'User Divisi', 
    path: '/admin/user-divisi',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ) 
  },
];

// --- DEFINISI MENU DIVISI ---
const DIVISI_MENU = [
  { 
    name: 'Dashboard', 
    path: '/divisi',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ) 
  },
  { 
    name: 'Buat Permintaan', 
    path: '/divisi/permintaan/create', 
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ) 
  },
  { 
    name: 'Status Permintaan', 
    path: '/divisi/permintaan/status', 
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ) 
  },
  { 
    name: 'Lihat Stok', 
    path: '/divisi/stok', 
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ) 
  },
];

export default function Sidebar({ user, onLogout, isOpen }) {
  const location = useLocation();
  const currentPath = location.pathname;

  const userRole = user?.role?.toLowerCase() || (user?.namaDivisi ? 'divisi' : 'guest'); 
  const menuItems = userRole === 'admin' ? ADMIN_MENU : DIVISI_MENU;

  const isMenuActive = (path) => {
    if (path === '/admin' || path === '/divisi') {
      return currentPath === path;
    }
    return currentPath === path || currentPath.startsWith(`${path}/`);
  }

  const handleLogout = () => {
    onLogout();
  };

  return (
    <aside
      className={`
        fixed top-0 left-0 h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 
        text-white shadow-2xl transition-all duration-300 z-40
        ${isOpen ? 'w-64' : 'w-20'}
      `}
    >
      <div className="h-16 flex items-center justify-center border-b border-gray-700 bg-gray-900/50">
        <Link 
          to={userRole === 'admin' ? '/admin' : '/divisi'}
          className="flex items-center gap-3 px-4 hover:opacity-80 transition"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0 shadow-lg">
            <span className="text-2xl">📦</span>
          </div>
          {isOpen && (
            <div>
              <h1 className="text-lg font-bold">Sistem ATK</h1>
              <p className="text-xs text-gray-400">Management</p>
            </div>
          )}
        </Link>
      </div>

      <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto h-[calc(100vh-16rem)]">
        {menuItems.map((item) => {
          const isActive = isMenuActive(item.path);
    
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-xl transition-all group
                ${isActive 
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg scale-105' 
                  : 'hover:bg-gray-700/50 hover:translate-x-1'
                }
              `}
              title={!isOpen ? item.name : ''}
            >
              <div className={`flex-shrink-0 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'}`}>
                {item.icon}
              </div>
              {isOpen && (
                <span className={`font-medium text-sm ${isActive ? 'text-white' : 'text-gray-300'}`}>
                  {item.name}
                </span>
              )}
              {isActive && isOpen && (
                <div className="ml-auto w-2 h-2 rounded-full bg-white animate-pulse" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-gray-700 p-3 bg-gray-900/50">
        <div className={`
          flex items-center gap-3 px-3 py-3 rounded-xl bg-gray-700/30 mb-2
          ${!isOpen && 'justify-center'}
        `}>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold flex-shrink-0">
            {(user?.nama || user?.username || 'U').charAt(0).toUpperCase()}
          </div>
          {isOpen && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">
                {user?.nama || user?.username || 'User'}
              </p>
              <p className="text-xs text-gray-400 truncate">
                {user?.role || user?.namaDivisi || 'Role'}
              </p>
            </div>
          )}
        </div>

        <button
          onClick={handleLogout}
          className={`
            w-full flex items-center gap-3 px-4 py-3 rounded-xl
            bg-red-600 hover:bg-red-700 transition-all group
            ${!isOpen && 'justify-center'}
          `}
          title={!isOpen ? 'Logout' : ''}
        >
          <svg className="w-5 h-5 text-white flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          {isOpen && (
            <span className="font-medium text-sm text-white">Logout</span>
          )}
        </button>
      </div>
    </aside>
  );
}