// src/services/api.js
const API_BASE_URL = 'http://localhost:5034'; // GANTI dengan URL API Anda

// Helper function untuk API calls
export const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  // Ambil token dari localStorage jika ada
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, config);
    
    // Cek jika response bukan JSON (misalnya 204 No Content)
    const contentType = response.headers.get('content-type');
    let data = null;
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    }
    
    if (!response.ok) {
      throw new Error(data?.message || `Error: ${response.status}`);
    }
    
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// ==========================================
// AUTH API
// ==========================================
export const authAPI = {
  login: async (username, password) => {
    return apiCall('/api/Auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  },
  
  logout: async () => {
    return apiCall('/api/Auth/logout', {
      method: 'POST',
    });
  },
};

// ==========================================
// BARANG API
// ==========================================
export const barangAPI = {
  getAll: async () => {
    return apiCall('/api/Barang');
  },
  
  getById: async (id) => {
    return apiCall(`/api/Barang/${id}`);
  },
  
  createBulk: async (barangList) => {
    return apiCall('/api/Barang/bulk', {
      method: 'POST',
      body: JSON.stringify(barangList),
    });
  },
  
  update: async (id, data) => {
    return apiCall(`/api/Barang/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  
  delete: async (id) => {
    return apiCall(`/api/Barang/${id}`, {
      method: 'DELETE',
    });
  },
};

// ==========================================
// SUPPLIER API
// ==========================================
export const supplierAPI = {
  getAll: async () => {
    return apiCall('/api/Supplier');
  },
  
  getById: async (id) => {
    return apiCall(`/api/Supplier/${id}`);
  },
  
  createBulk: async (supplierList) => {
    return apiCall('/api/Supplier/bulk', {
      method: 'POST',
      body: JSON.stringify(supplierList),
    });
  },
  
  update: async (id, data) => {
    return apiCall(`/api/Supplier/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data), // 'data' adalah formData dari komponen
    });
  },
  
  delete: async (id) => {
    return apiCall(`/api/Supplier/${id}`, {
      method: 'DELETE',
    });
  },
};

// ==========================================
// BARANG MASUK API
// ==========================================
export const barangMasukAPI = {
  getAll: async () => {
    return apiCall('/api/BarangMasuk');
  },
  
  getById: async (id) => {
    return apiCall(`/api/BarangMasuk/${id}`);
  },
  
  create: async (data) => {
    return apiCall('/api/BarangMasuk', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  
  createBulk: async (dataList) => {
    return apiCall('/api/BarangMasuk/bulk', {
      method: 'POST',
      body: JSON.stringify(dataList),
    });
  },
  
  update: async (id, data) => {
    return apiCall(`/api/BarangMasuk/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  
  delete: async (id) => {
    return apiCall(`/api/BarangMasuk/${id}`, {
      method: 'DELETE',
    });
  },
};

// ==========================================
// PERMINTAAN BARANG API
// ==========================================
export const permintaanBarangAPI = {
  getAll: async (status = null) => {
    const query = status !== null ? `?status=${status}` : '';
    return apiCall(`/api/PermintaanBarang${query}`);
  },
  
  create: async (data) => {
    return apiCall('/api/PermintaanBarang', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  
  updateStatus: async (id, status, keterangan = '') => {
    return apiCall(`/api/PermintaanBarang/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, keterangan }),
    });
  },
};

// ==========================================
// BARANG KELUAR API
// ==========================================
export const barangKeluarAPI = {
  getAll: async () => {
    return apiCall('/BarangKeluar');
  },
  
  getById: async (id) => {
    return apiCall(`/BarangKeluar/${id}`);
  },
  
  getByPermintaan: async (permintaanId) => {
    return apiCall(`/BarangKeluar/by-permintaan/${permintaanId}`);
  },
  
  getByBarang: async (barangId) => {
    return apiCall(`/BarangKeluar/by-barang/${barangId}`);
  },
};

// ==========================================
// PENGADAAN API
// ==========================================
export const pengadaanAPI = {
  getAll: async () => {
    return apiCall('/api/Pengadaan');
  },
  
  getById: async (id) => {
    return apiCall(`/api/Pengadaan/${id}`);
  },
  
  createBulk: async (dataList) => {
    return apiCall('/api/Pengadaan/bulk', {
      method: 'POST',
      body: JSON.stringify(dataList),
    });
  },
  
  update: async (id, data) => {
    return apiCall(`/api/Pengadaan/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  
  delete: async (id) => {
    return apiCall(`/api/Pengadaan/${id}`, {
      method: 'DELETE',
    });
  },
};

// ==========================================
// PAYMENT API
// ==========================================
export const paymentAPI = {
  getAll: async () => {
    return apiCall('/api/Payment');
  },
  
  getById: async (id) => {
    return apiCall(`/api/Payment/${id}`);
  },
  
  create: async (data) => {
    return apiCall('/api/Payment', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  
  updateStatus: async (id, status) => {
    return apiCall(`/api/Payment/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },
  
  uploadBukti: async (id, filePath) => {
    return apiCall(`/api/Payment/${id}/upload-bukti`, {
      method: 'POST',
      body: JSON.stringify({ filePath }),
    });
  },
  
  delete: async (id) => {
    return apiCall(`/api/Payment/${id}`, {
      method: 'DELETE',
    });
  },
};

// ==========================================
// DIVISI API
// ==========================================
export const divisiAPI = {
  getAll: async () => {
    return apiCall('/api/Divisi');
  },
  
  create: async (data) => {
    return apiCall('/api/Divisi', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  
  update: async (id, data) => {
    return apiCall(`/api/Divisi/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  
  delete: async (id) => {
    return apiCall(`/api/Divisi/${id}`, {
      method: 'DELETE',
    });
  },
};

// ==========================================
// USER DIVISI API
// ==========================================
export const userDivisiAPI = {
  getAll: async () => {
    return apiCall('/api/UserDivisi');
  },
  
  getById: async (id) => {
    return apiCall(`/api/UserDivisi/${id}`);
  },
  
  create: async (data) => {
    return apiCall('/api/UserDivisi', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  
  update: async (id, data) => {
    return apiCall(`/api/UserDivisi/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  
  delete: async (id) => {
    return apiCall(`/api/UserDivisi/${id}`, {
      method: 'DELETE',
    });
  },
};

// ==========================================
// ADMIN DASHBOARD API
// ==========================================
export const dashboardAPI = {
  getData: async () => {
    return apiCall('/api/AdminDashboard');
  },
};

// ==========================================
// CONSTANTS - Status Enums
// ==========================================
export const StatusPermintaan = {
  PENDING: 0,
  DISETUJUI: 1,
  DITOLAK: 2,
};

export const PaymentStatus = {
  PENDING: 0,
  LUNAS: 1,
  DITOLAK: 2,
};