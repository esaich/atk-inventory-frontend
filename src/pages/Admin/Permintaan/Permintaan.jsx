// src/pages/Admin/Permintaan/Permintaan.jsx

import { useState, useEffect } from 'react';
import Card from '../../../components/Card';
import Table from '../../../components/Table';
import Button from '../../../components/Button';
import Badge from '../../../components/Badge';
import Loading from '../../../components/Loading';
import Alert from '../../../components/Alert';

import { permintaanBarangAPI, barangAPI } from '../../../services/api';

import PermintaanDetailModal from './PermintaanDetailModal';

export default function Permintaan() {
  const [permintaanList, setPermintaanList] = useState([]);
  const [barangList, setBarangList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, approved, rejected
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedPermintaan, setSelectedPermintaan] = useState(null);
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

      // Sort by date (newest first) and status (pending first)
      permintaanData.sort((a, b) => {
        // Pending di atas
        if (a.status === 0 && b.status !== 0) return -1;
        if (a.status !== 0 && b.status === 0) return 1;
        
        // Sort by date
        const dateA = new Date(a.tanggalPermintaan || a.createdAt);
        const dateB = new Date(b.tanggalPermintaan || b.createdAt);
        return dateB - dateA;
      });

      setBarangList(barangData);
      setPermintaanList(permintaanData);

      console.log('Permintaan Data:', permintaanData);
      console.log('Barang Data:', barangData);
    } catch (error) {
      console.error('Error fetching data:', error);
      showAlert('error', 'Gagal memuat data permintaan');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDetailModal = (permintaan) => {
    setSelectedPermintaan(permintaan);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedPermintaan(null);
  };

  const handleSuccess = (message) => {
    showAlert('success', message);
    fetchAllData();
  };

  const handleUpdateStatus = async (id, status, keterangan = '') => {
    try {
      await permintaanBarangAPI.updateStatus(id, status, keterangan);
      const statusText = status === 1 ? 'disetujui' : 'ditolak';
      showAlert('success', `Permintaan berhasil ${statusText}!`);
      fetchAllData();
    } catch (error) {
      console.error('Error updating status:', error);
      showAlert('error', `Gagal update status: ${error.message}`);
    }
  };

  // Get barang info
  const getBarangInfo = (barangId) => {
    const barang = barangList.find(b => b.id === barangId);
    if (barang) {
      return {
        nama: barang.namaBarang,
        kode: barang.kodeBarang,
        satuan: barang.satuan,
        stok: barang.stok
      };
    }
    return { nama: '-', kode: '-', satuan: '-', stok: 0 };
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
        return <Badge text="Unknown" variant="secondary" />;
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
            <p className="font-medium text-gray-800">{info.nama}</p>
            <p className="text-xs text-gray-500">Kode: {info.kode}</p>
          </div>
        );
      }
    },
    { 
      header: 'Jumlah Diminta', 
      width: '130px',
      render: (row) => {
        const info = getBarangInfo(row.barangId);
        const isOverStock = row.jumlahDiminta > info.stok;
        return (
          <div>
            <p className={`font-semibold ${isOverStock ? 'text-red-600' : 'text-gray-800'}`}>
              {row.jumlahDiminta} {info.satuan}
            </p>
            <p className="text-xs text-gray-500">
              Stok: {info.stok} {info.satuan}
            </p>
          </div>
        );
      }
    },
    { 
      header: 'Divisi',
      width: '150px',
      render: (row) => (
        <div>
          <p className="font-medium text-gray-800">{row.namaDivisi || '-'}</p>
          <p className="text-xs text-gray-500">{row.namaUser || '-'}</p>
        </div>
      )
    },
    { 
      header: 'Tanggal', 
      width: '180px',
      render: (row) => formatDate(row.tanggalPermintaan || row.createdAt)
    },
    { 
      header: 'Status', 
      width: '120px',
      render: (row) => getStatusBadge(row.status)
    },
    {
      header: 'Aksi',
      width: '280px',
      render: (row) => (
        <div className="flex gap-2">
          <Button
            label="Detail"
            variant="info"
            size="sm"
            onClick={() => handleOpenDetailModal(row)}
          />
          {row.status === 0 && (
            <>
              <Button
                label="Setuju"
                variant="success"
                size="sm"
                onClick={() => handleUpdateStatus(row.id, 1, 'Permintaan disetujui')}
              />
              <Button
                label="Tolak"
                variant="danger"
                size="sm"
                onClick={() => handleOpenDetailModal(row)}
              />
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl p-6 shadow-lg">
        <h1 className="text-3xl font-bold mb-2">📋 Kelola Permintaan Barang</h1>
        <p className="text-purple-100">
          Review dan proses permintaan barang dari divisi
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
              <p className="text-sm text-gray-600">Total Permintaan</p>
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
              <p className="text-sm text-gray-600">Menunggu Review</p>
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
      <Card title="📝 Daftar Permintaan">
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

      {/* Modal Detail */}
      {selectedPermintaan && (
        <PermintaanDetailModal
          isOpen={isDetailModalOpen}
          onClose={handleCloseDetailModal}
          permintaan={selectedPermintaan}
          barangInfo={getBarangInfo(selectedPermintaan.barangId)}
          onSuccess={handleSuccess}
          showAlert={showAlert}
          onUpdateStatus={handleUpdateStatus}
        />
      )}
    </div>
  );
}