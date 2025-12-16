// src/pages/Admin/Barang/Barang.jsx (FIXED VERSION)

import { useState, useEffect } from 'react';
import Card from '../../../components/Card';
import Table from '../../../components/Table';
import Button from '../../../components/Button';
import Alert from '../../../components/Alert';
import Badge from '../../../components/Badge';
import Loading from '../../../components/Loading'; 
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

  // ✅ State untuk Confirm Modal Hapus
  const [confirmDeleteModal, setConfirmDeleteModal] = useState({
    isOpen: false,
    id: null,
    loading: false,
    namaBarang: '',
    title: '',
    message: '',
    confirmText: '',
    cancelText: '',
    type: 'danger',
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
      const response = await barangAPI.getAll();
      
      console.log('Raw API Response:', response); // ✅ Debug log
      
      // ✅ PERBAIKAN: Handle berbagai format response
      let barangData = [];
      
      if (Array.isArray(response)) {
        barangData = response;
      } else if (response && Array.isArray(response.data)) {
        barangData = response.data;
      } else if (response && response.$values) {
        barangData = response.$values;
      } else {
        console.warn('Unexpected response format:', response);
        barangData = [];
      }
      
      console.log('Processed Barang Data:', barangData); // ✅ Debug log
      setBarangList(barangData);
      
    } catch (err) { 
      console.error('Fetch Barang Error:', err); // ✅ Debug log
      showAlert('error', 'Gagal memuat data barang: ' + err.message);
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
  
  // ✅ Fungsi pemicu modal konfirmasi hapus
  const handleOpenDeleteModal = (barang) => {
    setConfirmDeleteModal({
      isOpen: true,
      id: barang.id,
      loading: false,
      namaBarang: barang.namaBarang,
      title: 'Hapus Data Barang?',
      message: `Anda yakin ingin menghapus barang: "${barang.namaBarang}" (Kode: ${barang.kodeBarang})? Aksi ini tidak dapat dibatalkan.`,
      confirmText: 'Ya, Hapus',
      cancelText: 'Batal',
      type: 'danger',
    });
  };

  // ✅ Fungsi eksekusi penghapusan
  const handleConfirmDelete = async () => {
    const id = confirmDeleteModal.id;
    if (!id) return;

    setConfirmDeleteModal(prev => ({ ...prev, loading: true }));

    try {
      await barangAPI.delete(id);
      showAlert('success', 'Barang berhasil dihapus!');
      setConfirmDeleteModal({ 
        isOpen: false, 
        id: null, 
        loading: false, 
        namaBarang: '',
        title: '',
        message: '',
        confirmText: '',
        cancelText: '',
        type: 'danger',
      });
      fetchBarang();
    } catch (error) {
      console.error('Delete error:', error);
      showAlert('error', `Gagal menghapus barang: ${error.message}`);
      setConfirmDeleteModal(prev => ({ ...prev, loading: false, isOpen: false }));
    }
  };

  const getStokBadge = (stok) => {
    if (stok === 0) return <Badge text="Habis" variant="danger" />;
    if (stok < 10) return <Badge text="Stok Rendah" variant="warning" />;
    return <Badge text="Tersedia" variant="success" />;
  };

  const columns = [
    { header: 'No.', width: '80px', render: (row, index) => (
          <span className="font-semibold">{index + 1}. </span>
        ) 
    }, 
    { header: 'Kode', field: 'kodeBarang', width: '120px' },
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
            onClick={() => handleOpenDeleteModal(row)}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Barang</p>
              <p className="text-3xl font-bold text-blue-700">{barangList.length}</p>
            </div>
            <div className="text-5xl">📦</div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Stok Tersedia</p>
              <p className="text-3xl font-bold text-green-700">
                {barangList.filter(b => b.stok >= 10).length}
              </p>
            </div>
            <div className="text-5xl">✅</div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Stok Rendah</p>
              <p className="text-3xl font-bold text-red-700">
                {barangList.filter(b => b.stok < 10 && b.stok > 0).length}
              </p>
            </div>
            <div className="text-5xl">⚠️</div>
          </div>
        </Card>
      </div>

      {/* Table */}
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
          <>
            {barangList.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📭</div>
                <p className="text-gray-500 text-lg">Belum ada data barang</p>
                <p className="text-gray-400 text-sm mt-2">
                  Klik tombol "Tambah Barang" untuk mulai menambahkan data
                </p>
              </div>
            ) : (
              <Table
                columns={columns}
                data={barangList}
                loading={loading}
                emptyMessage="Belum ada data barang"
              />
            )}
          </>
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
      
      {/* Confirm Modal Hapus */}
      <ConfirmModal
        isOpen={confirmDeleteModal.isOpen}
        onClose={() => setConfirmDeleteModal({ 
          ...confirmDeleteModal, 
          isOpen: false 
        })}
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