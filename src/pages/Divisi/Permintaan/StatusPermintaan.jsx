// src/pages/Divisi/Permintaan/StatusPermintaan.jsx

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Card from '../../../components/Card';
import Table from '../../../components/Table';
import Button from '../../../components/Button';
import Badge from '../../../components/Badge';
import Loading from '../../../components/Loading';
import Alert from '../../../components/Alert';
import { permintaanBarangAPI, barangAPI } from '../../../services/api';

export default function StatusPermintaan({ user }) {
  const [permintaanList, setPermintaanList] = useState([]);
  const [barangList, setBarangList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, approved, rejected
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });

  useEffect(() => {
    fetchAllData();
  }, []);

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
    setTimeout(() => setAlert({ show: false, type: '', message: '' }), 3000);
  };

  const fetchAllData = async () => {
    try {
      setLoading(true);

      const [permintaanResponse, barangResponse] = await Promise.all([
        permintaanBarangAPI.getAll(),
        barangAPI.getAll()
      ]);

      // Process Permintaan
      let permintaanData = [];
      if (Array.isArray(permintaanResponse)) {
        permintaanData = permintaanResponse;
      } else if (permintaanResponse && Array.isArray(permintaanResponse.data)) {
        permintaanData = permintaanResponse.data;
      } else if (permintaanResponse && permintaanResponse.$values) {
        permintaanData = permintaanResponse.$values;
      }

      // Process Barang
      let barangData = [];
      if (Array.isArray(barangResponse)) {
        barangData = barangResponse;
      } else if (barangResponse && Array.isArray(barangResponse.data)) {
        barangData = barangResponse.data;
      } else if (barangResponse && barangResponse.$values) {
        barangData = barangResponse.$values;
      }

      setBarangList(barangData);
      setPermintaanList(permintaanData);
    } catch (error) {
      console.error('Error fetching data:', error);
      showAlert('error', 'Gagal memuat data permintaan');
    } finally {
      setLoading(false);
    }
  };

  // Get barang name by ID
  const getBarangName = (barangId) => {
    const barang = barangList.find(b => b.id === barangId);
    return barang ? barang.namaBarang : '-';
  };

  // Get barang info
  const getBarangInfo = (barangId) => {
    const barang = barangList.find(b => b.id === barangId);
    if (barang) {
      return {
        nama: barang.namaBarang,
        kode: barang.kodeBarang,
        satuan: barang.satuan
      };
    }
    return { nama: '-', kode: '-', satuan: '-' };
  };

  // Format date
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

  // Get status badge
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

  // Filter data
  const getFilteredData = () => {
    if (filter === 'all') return permintaanList;
    if (filter === 'pending') return permintaanList.filter(p => p.status === 0);
    if (filter === 'approved') return permintaanList.filter(p => p.status === 1);
    if (filter === 'rejected') return permintaanList.filter(p => p.status === 2);
    return permintaanList;
  };

  const filteredData = getFilteredData();

  // Calculate stats
  const stats = {
    total: permintaanList.length,
    pending: permintaanList.filter(p => p.status === 0).length,
    approved: permintaanList.filter(p => p.status === 1).length,
    rejected: permintaanList.filter(p => p.status === 2).length,
  };

  const columns = [
    { 
      header: 'ID', 
      field: 'id', 
      width: '60px' 
    },
    { 
      header: 'Barang',
      render: (row) => {
        const info = getBarangInfo(row.barangId);
        return (
          <div>
            <p className="font-medium">{info.nama}</p>
            <p className="text-xs text-gray-500">Kode: {info.kode}</p>
          </div>
        );
      }
    },
    { 
      header: 'Jumlah', 
      width: '100px',
      render: (row) => {
        const info = getBarangInfo(row.barangId);
        return (
          <span className="font-semibold">
            {row.jumlahDiminta} {info.satuan}
          </span>
        );
      }
    },
    { 
      header: 'Tanggal', 
      width: '180px',
      render: (row) => formatDate(row.tanggalPermintaan || row.createdAt)
    },
    { 
      header: 'Alasan',
      render: (row) => (
        <span className="text-sm text-gray-600 line-clamp-2">
          {row.alasan || '-'}
        </span>
      )
    },
    { 
      header: 'Status', 
      width: '120px',
      render: (row) => getStatusBadge(row.status)
    },
    {
      header: 'Keterangan',
      render: (row) => (
        <span className="text-sm text-gray-600">
          {row.keterangan || '-'}
        </span>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-xl p-6 shadow-lg">
        <h1 className="text-3xl font-bold mb-2">📊 Status Permintaan Barang</h1>
        <p className="text-green-100">
          Pantau status permintaan barang Anda
        </p>
      </div>

      {/* Alert */}
      {alert.show && (
        <Alert type={alert.type} message={alert.message} />
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card 
          className={`cursor-pointer transition hover:shadow-lg ${filter === 'all' ? 'ring-2 ring-blue-500' : ''}`}
          onClick={() => setFilter('all')}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
            </div>
            <div className="text-4xl">📋</div>
          </div>
        </Card>

        <Card 
          className={`cursor-pointer transition hover:shadow-lg ${filter === 'pending' ? 'ring-2 ring-orange-500' : ''}`}
          onClick={() => setFilter('pending')}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-3xl font-bold text-orange-600">{stats.pending}</p>
            </div>
            <div className="text-4xl">⏳</div>
          </div>
        </Card>

        <Card 
          className={`cursor-pointer transition hover:shadow-lg ${filter === 'approved' ? 'ring-2 ring-green-500' : ''}`}
          onClick={() => setFilter('approved')}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Disetujui</p>
              <p className="text-3xl font-bold text-green-600">{stats.approved}</p>
            </div>
            <div className="text-4xl">✅</div>
          </div>
        </Card>

        <Card 
          className={`cursor-pointer transition hover:shadow-lg ${filter === 'rejected' ? 'ring-2 ring-red-500' : ''}`}
          onClick={() => setFilter('rejected')}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Ditolak</p>
              <p className="text-3xl font-bold text-red-600">{stats.rejected}</p>
            </div>
            <div className="text-4xl">❌</div>
          </div>
        </Card>
      </div>

      {/* Table */}
      <Card
        title="📝 Daftar Permintaan"
        headerAction={
          <Link to="/divisi/permintaan/create">
            <Button
              label="Buat Permintaan Baru"
              variant="success"
              size="sm"
              icon={<span>➕</span>}
            />
          </Link>
        }
      >
        {loading ? (
          <Loading />
        ) : (
          <Table
            columns={columns}
            data={filteredData}
            loading={loading}
            emptyMessage={
              filter === 'all' 
                ? "Belum ada permintaan" 
                : `Tidak ada permintaan dengan status: ${filter}`
            }
          />
        )}
      </Card>

      {/* Info Panel */}
      <Card>
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
          <div className="flex items-start gap-3">
            <span className="text-2xl">ℹ️</span>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Informasi Status:</h3>
              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex items-center gap-2">
                  <Badge text="Pending" variant="warning" size="sm" />
                  <span>Permintaan sedang diproses oleh admin</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge text="Disetujui" variant="success" size="sm" />
                  <span>Permintaan disetujui, barang dapat diambil</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge text="Ditolak" variant="danger" size="sm" />
                  <span>Permintaan ditolak, lihat keterangan dari admin</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}