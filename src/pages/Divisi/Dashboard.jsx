// src/pages/Divisi/Dashboard.jsx

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/Card';
import Badge from '../../components/Badge';
import Loading from '../../components/Loading';
import Button from '../../components/Button';
import { permintaanBarangAPI, barangAPI } from '../../services/api';

export default function DivisiDashboard({ user }) {
  const [permintaanList, setPermintaanList] = useState([]);
  const [barangList, setBarangList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      const permintaanResponse = await permintaanBarangAPI.getAll();
      let permintaanData = [];
      if (Array.isArray(permintaanResponse)) {
        permintaanData = permintaanResponse;
      } else if (permintaanResponse && Array.isArray(permintaanResponse.data)) {
        permintaanData = permintaanResponse.data;
      } else if (permintaanResponse && permintaanResponse.$values) {
        permintaanData = permintaanResponse.$values;
      }
      
      const barangResponse = await barangAPI.getAll();
      let barangData = [];
      if (Array.isArray(barangResponse)) {
        barangData = barangResponse;
      } else if (barangResponse && Array.isArray(barangResponse.data)) {
        barangData = barangResponse.data;
      } else if (barangResponse && barangResponse.$values) {
        barangData = barangResponse.$values;
      }

      setPermintaanList(permintaanData);
      setBarangList(barangData);
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    totalPermintaan: permintaanList.length,
    pending: permintaanList.filter(p => p.status === 0).length,
    disetujui: permintaanList.filter(p => p.status === 1).length,
    ditolak: permintaanList.filter(p => p.status === 2).length,
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 0:
        return <Badge text="Pending" variant="warning" />;
      case 1:
        return <Badge text="Disetujui" variant="success" />;
      case 2:
        return <Badge text="Ditolak" variant="danger" />;
      default:
        return <Badge text="Unknown" variant="gray" />;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  const getBarangName = (barangId) => {
    const barang = barangList.find(b => b.id === barangId);
    return barang ? barang.namaBarang : 'Unknown';
  };

  if (loading) {
    return <Loading message="Memuat dashboard..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-xl p-6 shadow-lg">
        <h1 className="text-3xl font-bold mb-2">Dashboard Divisi</h1>
        <p className="text-green-100">
          Selamat datang, {user?.nama}! {user?.namaDivisi}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-xl transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-semibold">Total Permintaan</p>
              <h3 className="text-3xl font-bold text-blue-600 mt-2">
                {stats.totalPermintaan}
              </h3>
            </div>
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center">
              <span className="text-3xl">📝</span>
            </div>
          </div>
        </Card>

        <Card className="hover:shadow-xl transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-semibold">Menunggu Persetujuan</p>
              <h3 className="text-3xl font-bold text-orange-600 mt-2">
                {stats.pending}
              </h3>
            </div>
            <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center">
              <span className="text-3xl">⏳</span>
            </div>
          </div>
        </Card>

        <Card className="hover:shadow-xl transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-semibold">Disetujui</p>
              <h3 className="text-3xl font-bold text-green-600 mt-2">
                {stats.disetujui}
              </h3>
            </div>
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center">
              <span className="text-3xl">✅</span>
            </div>
          </div>
        </Card>

        <Card className="hover:shadow-xl transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-semibold">Ditolak</p>
              <h3 className="text-3xl font-bold text-red-600 mt-2">
                {stats.ditolak}
              </h3>
            </div>
            <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center">
              <span className="text-3xl">❌</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions - FIXED ROUTING */}
      <Card title="⚡ Aksi Cepat">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Buat Permintaan */}
          <Link to="/divisi/permintaan/create">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg border-2 border-blue-200 hover:shadow-lg transition cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="bg-blue-500 w-12 h-12 rounded-full flex items-center justify-center">
                  <span className="text-2xl">📝</span>
                </div>
                <div>
                  <h3 className="font-bold text-blue-900">Buat Permintaan</h3>
                  <p className="text-sm text-blue-700">Ajukan permintaan barang baru</p>
                </div>
              </div>
            </div>
          </Link>

          {/* Lihat Stok */}
          <Link to="/divisi/stok">
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg border-2 border-green-200 hover:shadow-lg transition cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="bg-green-500 w-12 h-12 rounded-full flex items-center justify-center">
                  <span className="text-2xl">📊</span>
                </div>
                <div>
                  <h3 className="font-bold text-green-900">Lihat Stok</h3>
                  <p className="text-sm text-green-700">Cek ketersediaan barang</p>
                </div>
              </div>
            </div>
          </Link>

          {/* Riwayat */}
          <Link to="/divisi/permintaan/status">
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg border-2 border-purple-200 hover:shadow-lg transition cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="bg-purple-500 w-12 h-12 rounded-full flex items-center justify-center">
                  <span className="text-2xl">📜</span>
                </div>
                <div>
                  <h3 className="font-bold text-purple-900">Riwayat</h3>
                  <p className="text-sm text-purple-700">Lihat permintaan sebelumnya</p>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </Card>

      {/* Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Permintaan Terbaru */}
        <Card title="📋 Permintaan Terbaru">
          <div className="space-y-3">
            {permintaanList.length > 0 ? (
              permintaanList.slice(0, 5).map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">
                      {getBarangName(item.barangId)}
                    </p>
                    <p className="text-sm text-gray-600">
                      Jumlah: {item.jumlahDiminta} | {formatDate(item.tanggalPermintaan)}
                    </p>
                  </div>
                  <div>
                    {getStatusBadge(item.status)}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <span className="text-5xl mb-3 block">📭</span>
                <p>Belum ada permintaan</p>
                <Link to="/divisi/permintaan/create">
                  <Button
                    label="Buat Permintaan Pertama"
                    variant="primary"
                    size="sm"
                    className="mt-4"
                  />
                </Link>
              </div>
            )}
          </div>
        </Card>

        {/* Barang Tersedia */}
        <Card title="📦 Barang Tersedia">
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {barangList.length > 0 ? (
              barangList.slice(0, 10).map((barang) => (
                <div key={barang.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">{barang.namaBarang}</p>
                    <p className="text-sm text-gray-600">Kode: {barang.kodeBarang}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-blue-600">{barang.stok}</p>
                    <p className="text-xs text-gray-500">{barang.satuan}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">Belum ada data barang</p>
            )}
          </div>
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
              <h3 className="font-bold text-gray-900 mb-2">Tips Penggunaan Sistem</h3>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>• Pastikan stok barang tersedia sebelum membuat permintaan</li>
                <li>• Berikan alasan yang jelas saat mengajukan permintaan</li>
                <li>• Cek status permintaan secara berkala</li>
                <li>• Hubungi admin jika ada pertanyaan</li>
              </ul>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}