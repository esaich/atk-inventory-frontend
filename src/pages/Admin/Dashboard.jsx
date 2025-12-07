// src/pages/Admin/Dashboard.jsx

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/Card';
import Badge from '../../components/Badge';
import Loading from '../../components/Loading';
import Button from '../../components/Button';
import Alert from '../../components/Alert';
import { dashboardAPI } from '../../services/api';

export default function AdminDashboard({ user }) {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await dashboardAPI.getData();
      console.log('Dashboard Response:', response);
      
      setDashboardData(response);
    } catch (err) {
      console.error('Error fetching dashboard:', err);
      setError('Gagal memuat data dashboard');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    switch(status?.toLowerCase()) {
      case 'pending':
        return <Badge text="Pending" variant="warning" />;
      case 'disetujui':
        return <Badge text="Disetujui" variant="success" />;
      case 'ditolak':
        return <Badge text="Ditolak" variant="danger" />;
      default:
        return <Badge text={status || 'Unknown'} variant="gray" />;
    }
  };

  if (loading) {
    return <Loading message="Memuat dashboard..." />;
  }

  if (error) {
    return (
      <div className="space-y-4">
        <Alert type="error" message={error} />
        <Button label="Coba Lagi" onClick={fetchDashboard} variant="primary" />
      </div>
    );
  }

  const summary = dashboardData?.summary || {};
  const barangStokRendah = dashboardData?.barangStokRendah || [];
  const permintaanTerbaru = dashboardData?.permintaanTerbaru || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl p-6 shadow-lg">
        <h1 className="text-3xl font-bold mb-2">Dashboard Admin</h1>
        <p className="text-blue-100">
          Selamat datang, {user?.nama || user?.username}! 
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* Total Barang */}
        <Card className="hover:shadow-xl transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-semibold">Total Barang</p>
              <h3 className="text-3xl font-bold text-blue-600 mt-2">
                {summary.totalBarang || 0}
              </h3>
            </div>
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center">
              <span className="text-3xl">📦</span>
            </div>
          </div>
        </Card>

        {/* Permintaan Pending */}
        <Card className="hover:shadow-xl transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-semibold">Pending</p>
              <h3 className="text-3xl font-bold text-orange-600 mt-2">
                {summary.totalPermintaanPending || 0}
              </h3>
            </div>
            <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center">
              <span className="text-3xl">⏳</span>
            </div>
          </div>
        </Card>

        {/* Permintaan Disetujui */}
        <Card className="hover:shadow-xl transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-semibold">Disetujui</p>
              <h3 className="text-3xl font-bold text-green-600 mt-2">
                {summary.totalPermintaanDisetujui || 0}
              </h3>
            </div>
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center">
              <span className="text-3xl">✅</span>
            </div>
          </div>
        </Card>

        {/* Permintaan Ditolak */}
        <Card className="hover:shadow-xl transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-semibold">Ditolak</p>
              <h3 className="text-3xl font-bold text-red-600 mt-2">
                {summary.totalPermintaanDitolak || 0}
              </h3>
            </div>
            <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center">
              <span className="text-3xl">❌</span>
            </div>
          </div>
        </Card>

        {/* Barang Hampir Habis */}
        <Card className="hover:shadow-xl transition bg-gradient-to-br from-yellow-50 to-orange-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-semibold">Stok Rendah</p>
              <h3 className="text-3xl font-bold text-yellow-600 mt-2">
                {summary.totalBarangHampirHabis || 0}
              </h3>
            </div>
            <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center">
              <span className="text-3xl">⚠️</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card title="⚡ Aksi Cepat">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          
          <Link to="/admin/barang">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg border-2 border-blue-200 hover:shadow-lg transition cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="bg-blue-500 w-12 h-12 rounded-full flex items-center justify-center">
                  <span className="text-2xl">📦</span>
                </div>
                <div>
                  <h3 className="font-bold text-blue-900">Kelola Barang</h3>
                  <p className="text-sm text-blue-700">Master data barang</p>
                </div>
              </div>
            </div>
          </Link>

          <Link to="/admin/permintaan">
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-lg border-2 border-orange-200 hover:shadow-lg transition cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="bg-orange-500 w-12 h-12 rounded-full flex items-center justify-center">
                  <span className="text-2xl">📝</span>
                </div>
                <div>
                  <h3 className="font-bold text-orange-900">Permintaan</h3>
                  <p className="text-sm text-orange-700">Review permintaan</p>
                </div>
              </div>
            </div>
          </Link>

          <Link to="/admin/barangmasuk">
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg border-2 border-green-200 hover:shadow-lg transition cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="bg-green-500 w-12 h-12 rounded-full flex items-center justify-center">
                  <span className="text-2xl">📥</span>
                </div>
                <div>
                  <h3 className="font-bold text-green-900">Barang Masuk</h3>
                  <p className="text-sm text-green-700">Input barang masuk</p>
                </div>
              </div>
            </div>
          </Link>

          <Link to="/admin/pengadaan">
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg border-2 border-purple-200 hover:shadow-lg transition cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="bg-purple-500 w-12 h-12 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🛒</span>
                </div>
                <div>
                  <h3 className="font-bold text-purple-900">Pengadaan</h3>
                  <p className="text-sm text-purple-700">Ajukan pengadaan</p>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </Card>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Barang Stok Rendah */}
        <Card 
          title="⚠️ Barang Stok Rendah"
          headerAction={
            <Link to="/admin/barang">
              <Button label="Lihat Semua" variant="outline" size="sm" />
            </Link>
          }
        >
          {barangStokRendah.length > 0 ? (
            <div className="space-y-3">
              {barangStokRendah.map((item, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border-l-4 border-yellow-500"
                >
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">{item.namaBarang}</p>
                    <p className="text-sm text-gray-600">ID: {item.barangId}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-red-600">{item.stok}</p>
                    <p className="text-xs text-gray-500">{item.satuan}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <span className="text-5xl mb-3 block">✅</span>
              <p>Semua barang stok aman</p>
            </div>
          )}
        </Card>

        {/* Permintaan Terbaru */}
        <Card 
          title="📋 Permintaan Terbaru"
          headerAction={
            <Link to="/admin/permintaan">
              <Button label="Lihat Semua" variant="outline" size="sm" />
            </Link>
          }
        >
          {permintaanTerbaru.length > 0 ? (
            <div className="space-y-3">
              {permintaanTerbaru.map((item, index) => (
                <div 
                  key={index} 
                  className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">{item.namaBarang}</p>
                      <p className="text-sm text-gray-600">
                        Pemohon: {item.namaPemohon} | Jumlah: {item.jumlah}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatDate(item.tanggalPermintaan)}
                      </p>
                    </div>
                    <div>
                      {getStatusBadge(item.status)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <span className="text-5xl mb-3 block">📭</span>
              <p>Belum ada permintaan</p>
            </div>
          )}
        </Card>
      </div>

      {/* Info Panel */}
      <Card>
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
          <div className="flex items-start gap-4">
            <div className="bg-blue-500 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">💡</span>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">Tips Dashboard Admin</h3>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>• Periksa permintaan pending secara berkala</li>
                <li>• Segera lakukan pengadaan untuk barang dengan stok rendah</li>
                <li>• Pastikan semua transaksi barang masuk tercatat</li>
                <li>• Review laporan secara rutin untuk monitoring yang baik</li>
              </ul>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}