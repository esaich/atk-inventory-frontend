// src/pages/Admin/Supplier/Supplier.jsx

import { useState, useEffect } from 'react';
import Card from '../../../components/Card';
import Table from '../../../components/Table';
import Button from '../../../components/Button';
import Alert from '../../../components/Alert';
import Loading from '../../../components/Loading'; // Pastikan Loading diimpor
import { supplierAPI } from '../../../services/api';

// Impor komponen Modal yang baru
import SupplierCreateModal from './SupplierCreateModal';
import SupplierEditModal from './SupplierEditModal';

export default function Supplier() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false); // State untuk Modal Create
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);     // State untuk Modal Edit
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });

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
    } catch (error) {
      console.error('Error fetching suppliers:', error);
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
  // Fungsi ini akan dipanggil dari Modal Create/Edit setelah sukses
  const handleSuccess = (message) => {
    showAlert('success', message);
    fetchSuppliers(); // Muat ulang data
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus supplier ini?')) return;
    
    try {
      await supplierAPI.delete(id);
      showAlert('success', 'Supplier berhasil dihapus!');
      fetchSuppliers();
    } catch (error) {
      showAlert('error', `Gagal menghapus supplier: ${error.message}`);
    }
  };

  const columns = [
    { header: 'ID', field: 'id', width: '80px' },
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
            onClick={() => handleDelete(row.id)}
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
    </div>
  );
}