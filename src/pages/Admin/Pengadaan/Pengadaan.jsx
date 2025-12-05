// src/pages/Admin/Pengadaan/Pengadaan.jsx

import { useState, useEffect } from 'react';
import Card from '../../../components/Card';
import Table from '../../../components/Table';
import Button from '../../../components/Button';
import Alert from '../../../components/Alert';
import Loading from '../../../components/Loading';

import { pengadaanAPI, supplierAPI } from '../../../services/api';

import PengadaanCreateModal from './PengadaanCreateModal';
import PengadaanEditModal from './PengadaanEditModal';

export default function Pengadaan() {
  const [pengadaanList, setPengadaanList] = useState([]);
  const [supplierList, setSupplierList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPengadaan, setSelectedPengadaan] = useState(null);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });

  useEffect(() => {
    fetchAllData();
  }, []);

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
    setTimeout(() => setAlert({ show: false, type: '', message: '' }), 3000);
  };

  // ✅ PERBAIKAN: Fetch pengadaan dan supplier bersamaan
  const fetchAllData = async () => {
    try {
      setLoading(true);

      // Fetch parallel (bersamaan)
      const [pengadaanResponse, supplierResponse] = await Promise.all([
        pengadaanAPI.getAll(),
        supplierAPI.getAll()
      ]);

      // Process Pengadaan
      let pengadaanData = [];
      if (Array.isArray(pengadaanResponse)) {
        pengadaanData = pengadaanResponse;
      } else if (pengadaanResponse && Array.isArray(pengadaanResponse.data)) {
        pengadaanData = pengadaanResponse.data;
      } else if (pengadaanResponse && pengadaanResponse.$values) {
        pengadaanData = pengadaanResponse.$values;
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

      setSupplierList(supplierData);
      setPengadaanList(pengadaanData);

      console.log('Pengadaan Data:', pengadaanData);
      console.log('Supplier Data:', supplierData);
    } catch (err) {
      console.error('Error fetching data:', err);
      showAlert('error', 'Gagal memuat data pengadaan');
      setPengadaanList([]);
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

  const handleOpenEditModal = (pengadaan) => {
    setSelectedPengadaan(pengadaan);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedPengadaan(null);
  };

  const handleSuccess = (message) => {
    showAlert('success', message);
    fetchAllData();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus pengadaan ini?')) return;

    try {
      await pengadaanAPI.delete(id);
      showAlert('success', 'Pengadaan berhasil dihapus!');
      fetchAllData();
    } catch (error) {
      console.error('Delete error:', error);
      showAlert('error', `Gagal menghapus pengadaan: ${error.message}`);
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

  // ✅ PERBAIKAN: Helper untuk join data supplier
  const getSupplierNama = (supplierId) => {
    if (!supplierId) return '-';
    const supplier = supplierList.find(s => s.id === supplierId);
    return supplier ? supplier.namaSupplier : '-';
  };

  const columns = [
    { header: 'ID', field: 'id', width: '60px' },
    { header: 'Nama Barang', field: 'namaBarang' },
    { 
      header: 'Jumlah', 
      width: '120px',
      render: (row) => (
        <span className="font-semibold">{row.jumlahDiajukan} {row.satuan}</span>
      )
    },
    { 
      header: 'Tanggal Pengajuan', 
      width: '150px',
      render: (row) => formatDate(row.tanggalPengajuan)
    },
    { 
      header: 'Supplier',
      width: '200px',
      render: (row) => getSupplierNama(row.supplierId)
    },
    { 
      header: 'Keterangan', 
      render: (row) => (
        <span className="text-sm text-gray-600">
          {row.keterangan || '-'}
        </span>
      )
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
            onClick={() => handleDelete(row.id)}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card
        title="🛒 Data Pengadaan Barang"
        headerAction={
          <Button
            label="Ajukan Pengadaan"
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
            data={pengadaanList}
            loading={loading}
            emptyMessage="Belum ada data pengadaan"
          />
        )}
      </Card>

      {/* Modal Create */}
      <PengadaanCreateModal
        isOpen={isCreateModalOpen}
        onClose={handleCloseCreateModal}
        onSuccess={handleSuccess}
        showAlert={showAlert}
      />

      {/* Modal Edit */}
      {selectedPengadaan && (
        <PengadaanEditModal
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          pengadaan={selectedPengadaan}
          onSuccess={handleSuccess}
          showAlert={showAlert}
        />
      )}
    </div>
  );
}