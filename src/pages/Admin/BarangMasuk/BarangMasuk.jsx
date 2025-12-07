// src/pages/Admin/BarangMasuk/BarangMasuk.jsx (REVISI)

import { useState, useEffect } from 'react';
import Card from '../../../components/Card';
import Table from '../../../components/Table';
import Button from '../../../components/Button';
import Alert from '../../../components/Alert';
import Loading from '../../../components/Loading';

// ✅ Tambahkan ConfirmModal di sini
import ConfirmModal from '../../../components/ConfirmModal'; 

import { barangMasukAPI, barangAPI, supplierAPI } from '../../../services/api';

import BarangMasukCreateModal from './BarangMasukCreateModal';
import BarangMasukEditModal from './BarangMasukEditModal';

export default function BarangMasuk() {
  const [barangMasukList, setBarangMasukList] = useState([]);
  const [barangList, setBarangList] = useState([]);
  const [supplierList, setSupplierList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedBarangMasuk, setSelectedBarangMasuk] = useState(null);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });
  
  // ✅ State untuk Confirm Modal Hapus (BARU)
  const [confirmDeleteModal, setConfirmDeleteModal] = useState({
    isOpen: false,
    id: null,
    loading: false,
  });

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

      const [barangMasukResponse, barangResponse, supplierResponse] = await Promise.all([
        barangMasukAPI.getAll(),
        barangAPI.getAll(),
        supplierAPI.getAll()
      ]);

      // Process Barang Masuk
      let barangMasukData = [];
      if (Array.isArray(barangMasukResponse)) {
        barangMasukData = barangMasukResponse;
      } else if (barangMasukResponse && Array.isArray(barangMasukResponse.data)) {
        barangMasukData = barangMasukResponse.data;
      } else if (barangMasukResponse && barangMasukResponse.$values) {
        barangMasukData = barangMasukResponse.$values;
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

      // Process Supplier
      let supplierData = [];
      if (Array.isArray(supplierResponse)) {
        supplierData = supplierResponse;
      } else if (supplierResponse && Array.isArray(supplierResponse.data)) {
        supplierData = supplierResponse.data;
      } else if (supplierResponse && supplierResponse.$values) {
        supplierData = supplierResponse.$values;
      }

      setBarangList(barangData);
      setSupplierList(supplierData);
      setBarangMasukList(barangMasukData);

      // ❌ HILANGKAN console.log('Barang Masuk Data:', barangMasukData);
      // ❌ HILANGKAN console.log('Barang Data:', barangData);
      // ❌ HILANGKAN console.log('Supplier Data:', supplierData);
    } catch (err) {
      // ❌ HILANGKAN console.error('Error fetching data:', err);
      showAlert('error', 'Gagal memuat data');
      setBarangMasukList([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  const handleOpenEditModal = (barangMasuk) => {
    setSelectedBarangMasuk(barangMasuk);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedBarangMasuk(null);
  };

  const handleSuccess = (message) => {
    showAlert('success', message);
    fetchAllData();
  };

  // ✅ Fungsi pemicu modal konfirmasi hapus (BARU)
  const handleOpenDeleteModal = (id) => {
    const barangInfo = getBarangInfo(barangMasukList.find(b => b.id === id)?.barangId);
    
    setConfirmDeleteModal({
      isOpen: true,
      id: id,
      loading: false,
      title: 'Hapus Data Barang Masuk',
      message: `Anda yakin ingin menghapus data barang masuk untuk: ${barangInfo.nama}? Aksi ini tidak dapat dibatalkan.`,
      confirmText: 'Ya, Hapus',
      cancelText: 'Batal',
      type: 'danger',
    });
  };

  // ✅ Fungsi eksekusi penghapusan (DIREVISI)
  const handleConfirmDelete = async () => {
    const id = confirmDeleteModal.id;
    if (!id) return;
    
    setConfirmDeleteModal(prev => ({ ...prev, loading: true }));

    try {
      await barangMasukAPI.delete(id);
      showAlert('success', 'Barang masuk berhasil dihapus!');
      fetchAllData();
    } catch (error) {
      // ❌ HILANGKAN console.error('Delete error:', error);
      showAlert('error', `Gagal menghapus barang masuk: ${error.message}`);
    } finally {
      setConfirmDeleteModal({ isOpen: false, id: null, loading: false });
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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount || 0);
  };

  const getBarangInfo = (barangId) => {
    const barang = barangList.find(b => b.id === barangId);
    if (barang) {
      return {
        nama: barang.namaBarang,
        kode: barang.kodeBarang
      };
    }
    return { nama: '-', kode: '-' };
  };

  const getSupplierNama = (supplierId) => {
    if (!supplierId) return '-';
    const supplier = supplierList.find(s => s.id === supplierId);
    return supplier ? supplier.namaSupplier : '-';
  };

  const columns = [
    { header: 'ID', field: 'id', width: '60px' },
    { 
      header: 'Nama Barang',
      render: (row) => {
        const barangInfo = getBarangInfo(row.barangId);
        return (
          <div>
            <p className="font-medium">{barangInfo.nama}</p>
            <p className="text-xs text-gray-500">Kode: {barangInfo.kode}</p>
          </div>
        );
      }
    },
    { 
      header: 'Jumlah Masuk', 
      width: '120px',
      render: (row) => (
        <span className="font-semibold text-green-600">
          +{row.jumlahMasuk}
        </span>
      )
    },
    { 
      header: 'Harga Satuan', 
      width: '130px',
      render: (row) => formatCurrency(row.hargaSatuan)
    },
    { 
      header: 'Total Harga', 
      width: '130px',
      render: (row) => (
        <span className="font-semibold">
          {formatCurrency(row.jumlahMasuk * row.hargaSatuan)}
        </span>
      )
    },
    { 
      header: 'Supplier',
      render: (row) => getSupplierNama(row.supplierId)
    },
    { 
      header: 'Tanggal Masuk', 
      width: '130px',
      render: (row) => formatDate(row.tanggalMasuk)
    },
    {
      header: 'Aksi',
      width: '200px',
      render: (row) => (
        <div className="flex gap-2">
          <Button
            label="Edit"
            variant="info"
            size="sm"
            onClick={() => handleOpenEditModal(row)}
          />
          <Button
            label="Hapus"
            variant="danger"
            size="sm"
            // ✅ Ubah ini untuk memicu modal konfirmasi
            onClick={() => handleOpenDeleteModal(row.id)} 
          />
        </div>
      ),
    },
  ];

  // Hitung total nilai barang masuk
  const totalNilai = barangMasukList.reduce((sum, item) => {
    return sum + (item.jumlahMasuk * item.hargaSatuan);
  }, 0);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-green-50 to-green-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Transaksi</p>
              <p className="text-3xl font-bold text-green-700">{barangMasukList.length}</p>
            </div>
            <div className="text-5xl">📥</div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Nilai</p>
              <p className="text-2xl font-bold text-blue-700">{formatCurrency(totalNilai)}</p>
            </div>
            <div className="text-5xl">💰</div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Bulan Ini</p>
              <p className="text-3xl font-bold text-purple-700">
                {barangMasukList.filter(item => {
                  const date = new Date(item.tanggalMasuk);
                  const now = new Date();
                  return date.getMonth() === now.getMonth() && 
                            date.getFullYear() === now.getFullYear();
                }).length}
              </p>
            </div>
            <div className="text-5xl">📊</div>
          </div>
        </Card>
      </div>

      {/* Table */}
      <Card
        title="📥 Data Barang Masuk"
        headerAction={
          <Button
            label="Input Barang Masuk"
            variant="success"
            size="sm"
            icon={<span>➕</span>}
            onClick={handleOpenCreateModal}
          />
        }
      >
        {alert.show && (
          <div className="mb-4">
            <Alert type={alert.type} message={alert.message} />
          </div>
        )}

        {loading ? (
          <Loading />
        ) : (
          <Table
            columns={columns}
            data={barangMasukList}
            loading={loading}
            emptyMessage="Belum ada data barang masuk"
          />
        )}
      </Card>

      {/* Modal Create */}
      <BarangMasukCreateModal
        isOpen={isCreateModalOpen}
        onClose={handleCloseCreateModal}
        onSuccess={handleSuccess}
        showAlert={showAlert}
      />

      {/* Modal Edit */}
      {selectedBarangMasuk && (
        <BarangMasukEditModal
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          barangMasuk={selectedBarangMasuk}
          onSuccess={handleSuccess}
          showAlert={showAlert}
        />
      )}
      
      {/* ✅ Confirm Modal Hapus (BARU) */}
      <ConfirmModal
        isOpen={confirmDeleteModal.isOpen}
        onClose={() => setConfirmDeleteModal({ ...confirmDeleteModal, isOpen: false })}
        onConfirm={handleConfirmDelete}
        title={confirmDeleteModal.title}
        message={confirmDeleteModal.message}
        confirmText={confirmDeleteModal.confirmText}
        cancelText={confirmDeleteModal.cancelText}
        type={confirmDeleteModal.type}
        loading={confirmDeleteModal.loading}
      />
    </div>
  );
}