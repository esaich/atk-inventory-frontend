// src/pages/Admin/Supplier/Supplier.jsx (REVISI AKHIR)

import { useState, useEffect } from 'react';
import Card from '../../../components/Card';
import Table from '../../../components/Table';
import Button from '../../../components/Button';
import Alert from '../../../components/Alert';
import Loading from '../../../components/Loading'; 

// ✅ Impor ConfirmModal
import ConfirmModal from '../../../components/ConfirmModal'; 

import { supplierAPI } from '../../../services/api';

import SupplierCreateModal from './SupplierCreateModal';
import SupplierEditModal from './SupplierEditModal';

export default function Supplier() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false); 
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); 
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });

  // ✅ State untuk Confirm Modal Hapus (BARU)
  const [confirmDeleteModal, setConfirmDeleteModal] = useState({
    isOpen: false,
    id: null,
    loading: false,
    namaSupplier: '',
  });

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
    setTimeout(() => setAlert({ show: false, type: '', message: '' }), 3000);
  };

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const response = await supplierAPI.getAll();
      
      if (Array.isArray(response)) {
        setSuppliers(response);
      } else if (response && Array.isArray(response.data)) {
        setSuppliers(response.data);
      } else if (response && response.$values) {
        setSuppliers(response.$values);
      } else {
        setSuppliers([]);
      }
    } catch {
      showAlert('error', 'Gagal memuat data supplier');
      setSuppliers([]);
    } finally {
      setLoading(false);
    }
  };

  // --- Handle Modal Open/Close ---
  const handleOpenCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const handleOpenEditModal = (supplier) => {
    setSelectedSupplier(supplier);
    setIsEditModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedSupplier(null);
  };

  // --- Handle CRUD Actions ---
  const handleSuccess = (message) => {
    showAlert('success', message);
    fetchSuppliers(); // Muat ulang data
  };
  
  // ✅ Fungsi pemicu modal konfirmasi hapus (BARU)
  const handleOpenDeleteModal = (supplier) => {
    setConfirmDeleteModal({
      isOpen: true,
      id: supplier.id,
      loading: false,
      namaSupplier: supplier.namaSupplier,
      title: 'Hapus Data Supplier',
      message: `Anda yakin ingin menghapus supplier ${supplier.namaSupplier}? Semua data terkait supplier ini mungkin ikut terpengaruh. Aksi ini tidak dapat dibatalkan.`,
      confirmText: 'Ya, Hapus',
      cancelText: 'Batal',
      type: 'danger',
    });
  };

  // ✅ Fungsi eksekusi penghapusan (MENGGANTIKAN LOGIKA handleDelete)
  const handleConfirmDelete = async () => {
    const id = confirmDeleteModal.id;
    if (!id) return;
    
    setConfirmDeleteModal(prev => ({ ...prev, loading: true }));

    try {
      await supplierAPI.delete(id);
      showAlert('success', 'Supplier berhasil dihapus!');
      fetchSuppliers();
    } catch (error) {
      // ❌ HILANGKAN console.error
      showAlert('error', `Gagal menghapus supplier: ${error.message}`);
    } finally {
      setConfirmDeleteModal({ isOpen: false, id: null, loading: false, namaSupplier: '' });
    }
  };

  const columns = [
    { header: 'No.', width: '80px', render: (row, index) =>(
      <span className="font-semibold">{index + 1}. </span>
    ) },
    { header: 'Nama Supplier', field: 'namaSupplier' },
    { header: 'Alamat', field: 'alamat' },
    { header: 'Telepon', field: 'telepon' },
    { header: 'Email', field: 'email' },
    {
      header: 'Aksi',
      width: '200px',
      render: (row) => (
        <div className="flex gap-2">
          <Button
            label="Edit"
            variant="info"
            size="sm"
            onClick={() => handleOpenEditModal(row)} // Panggil modal Edit
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
      {/* Header & Table */}
      <Card
        title="🏢 Data Supplier"
        headerAction={
          <Button
            label="Tambah Supplier"
            variant="success"
            size="sm"
            icon={<span>➕</span>}
            onClick={handleOpenCreateModal} // Panggil modal Create
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
                data={suppliers}
                emptyMessage="Belum ada data supplier"
            />
        )}
      </Card>

      {/* Modal Tambah Supplier */}
      <SupplierCreateModal
        isOpen={isCreateModalOpen}
        onClose={handleCloseCreateModal}
        onSuccess={handleSuccess}
        showAlert={showAlert}
      />
      
      {/* Modal Edit Supplier */}
      {selectedSupplier && (
        <SupplierEditModal
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          supplier={selectedSupplier}
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