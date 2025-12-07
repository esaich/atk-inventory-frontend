// src/pages/Admin/Barang/Barang.jsx (REVISI AKHIR)

import { useState, useEffect } from 'react';
import Card from '../../../components/Card';
import Table from '../../../components/Table';
import Button from '../../../components/Button';
import Alert from '../../../components/Alert';
import Badge from '../../../components/Badge';
import Loading from '../../../components/Loading'; 

// ✅ TAMBAHKAN ConfirmModal
import ConfirmModal from '../../../components/ConfirmModal'; 

import { barangAPI } from '../../../services/api';

import BarangCreateModal from './BarangCreateModal';
import BarangEditModal from './BarangEditModal'; 

export default function Barang() {
  const [barangList, setBarangList] = useState([]);
  const [loading, setLoading] = useState(true);
      
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
      
  const [selectedBarang, setSelectedBarang] = useState(null);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });

  const [error, setError] = useState(null); 
  
  // ✅ State untuk Confirm Modal Hapus (BARU)
  const [confirmDeleteModal, setConfirmDeleteModal] = useState({
    isOpen: false,
    id: null,
    loading: false,
    namaBarang: '',
  });
      
  useEffect(() => {
    fetchBarang();
  }, []);

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
    setTimeout(() => setAlert({ show: false, type: '', message: '' }), 3000);
  };

  const fetchBarang = async () => {
    try {
      setLoading(true);
      setError(null); 
      const response = await barangAPI.getAll();
      
      // ❌ HILANGKAN console.log
      
      if (Array.isArray(response)) {
        setBarangList(response);
      } else if (response && Array.isArray(response.data)) {
        setBarangList(response.data);
      } else if (response && response.$values) {
        setBarangList(response.$values);
      } else {
        setBarangList([]);
      }
    } catch (err) { 
      // ❌ HILANGKAN console.error
      setError(err.message); 
      showAlert('error', 'Gagal memuat data barang');
      setBarangList([]); 
    } finally {
      setLoading(false);
    }
  };

  // --- Handle Modal Open/Close ---
  const handleOpenCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  const handleOpenEditModal = (barang) => {
    setSelectedBarang(barang);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedBarang(null);
  };

  const handleSuccess = (message) => {
    showAlert('success', message);
    fetchBarang(); 
  };
  
  // ✅ Fungsi pemicu modal konfirmasi hapus (BARU)
  const handleOpenDeleteModal = (barang) => {
    setConfirmDeleteModal({
      isOpen: true,
      id: barang.id,
      loading: false,
      namaBarang: barang.namaBarang,
      title: 'Hapus Data Barang',
      message: `Anda yakin ingin menghapus barang: ${barang.namaBarang} (Kode: ${barang.kodeBarang})? Aksi ini tidak dapat dibatalkan.`,
      confirmText: 'Ya, Hapus',
      cancelText: 'Batal',
      type: 'danger',
    });
  };

  // ✅ Fungsi eksekusi penghapusan (DIREVISI dari handleDelete)
  const handleConfirmDelete = async () => {
    const id = confirmDeleteModal.id;
    if (!id) return;
    
    // ❌ HILANGKAN console.log('Attempting to delete ID:', id); 

    setConfirmDeleteModal(prev => ({ ...prev, loading: true }));

    try {
      await barangAPI.delete(id);
      showAlert('success', 'Barang berhasil dihapus!');
      fetchBarang();
    } catch (error) {
      // ❌ HILANGKAN console.error
      showAlert('error', `Gagal menghapus barang: ${error.message}`);
    } finally {
      // Tutup modal, meskipun ada error (error ditangani oleh Alert)
      setConfirmDeleteModal({ isOpen: false, id: null, loading: false, namaBarang: '' });
    }
  };

  const getStokBadge = (stok) => {
    if (stok === 0) return <Badge text="Habis" variant="danger" />;
    if (stok < 10) return <Badge text="Stok Rendah" variant="warning" />;
    return <Badge text="Tersedia" variant="success" />;
  };

  const columns = [
    { header: 'ID', field: 'id', width: '80px' }, 
    { header: 'Kode', field: 'kodeBarang', width: '100px' },
    { header: 'Nama Barang', field: 'namaBarang' },
    { 
      header: 'Stok', 
      width: '100px',
      render: (row) => (
        <span className="font-semibold">{row.stok}</span>
      )
    },
    { header: 'Satuan', field: 'satuan', width: '100px' },
    {
      header: 'Status',
      width: '150px',
      render: (row) => getStokBadge(row.stok),
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
            onClick={() => handleOpenDeleteModal(row)}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card
        title="📦 Data Barang"
        headerAction={
          <Button
            label="Tambah Barang"
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
            data={barangList}
            loading={loading}
            emptyMessage="Belum ada data barang"
          />
        )}
      </Card>

      {/* Modal Tambah Barang (Create) */}
      <BarangCreateModal
        isOpen={isCreateModalOpen}
        onClose={handleCloseCreateModal}
        onSuccess={handleSuccess}
        showAlert={showAlert}
      />
      
      {/* Modal Edit Barang (Edit) */}
      {selectedBarang && (
        <BarangEditModal
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          barang={selectedBarang}
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