// src/pages/Admin/Payment/Payment.jsx (REVISI AKHIR)

import { useState, useEffect } from 'react';
import Card from '../../../components/Card';
import Table from '../../../components/Table';
import Button from '../../../components/Button';
import Badge from '../../../components/Badge';
import Alert from '../../../components/Alert';
import Loading from '../../../components/Loading';

// ✅ TAMBAHKAN ConfirmModal
import ConfirmModal from '../../../components/ConfirmModal'; 

import { paymentAPI, supplierAPI } from '../../../services/api';

import PaymentCreateModal from './PaymentCreateModal';
import PaymentDetailModal from './PaymentDetailModal';

export default function Payment() {
  const [paymentList, setPaymentList] = useState([]);
  const [supplierList, setSupplierList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
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

      const [paymentResponse, supplierResponse] = await Promise.all([
        paymentAPI.getAll(),
        supplierAPI.getAll()
      ]);

      // Process Payment
      let paymentData = [];
      if (Array.isArray(paymentResponse)) {
        paymentData = paymentResponse;
      } else if (paymentResponse && Array.isArray(paymentResponse.data)) {
        paymentData = paymentResponse.data;
      } else if (paymentResponse && paymentResponse.$values) {
        paymentData = paymentResponse.$values;
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
      setPaymentList(paymentData);

      // ❌ HILANGKAN console.log
    } catch (err) {
      // ❌ HILANGKAN console.error
      showAlert('error', 'Gagal memuat data');
      setPaymentList([]);
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

  const handleOpenDetailModal = (payment) => {
    setSelectedPayment(payment);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedPayment(null);
  };

  const handleSuccess = (message) => {
    showAlert('success', message);
    fetchAllData();
  };
  
  // ✅ Fungsi pemicu modal konfirmasi hapus (BARU)
  const handleOpenDeleteModal = (id) => {
    const payment = paymentList.find(p => p.id === id);
    // Tambahkan cek agar tidak error jika payment tidak ditemukan
    if (!payment) return; 
    
    const supplierName = getSupplierNama(payment.supplierId);

    setConfirmDeleteModal({
      isOpen: true,
      id: id,
      loading: false,
      title: 'Hapus Data Payment',
      message: `Anda yakin ingin menghapus data payment ID: ${id} untuk Supplier: ${supplierName}? Aksi ini tidak dapat dibatalkan.`,
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
      await paymentAPI.delete(id);
      showAlert('success', 'Payment berhasil dihapus!');
      fetchAllData();
    } catch (error) {
      // ❌ HILANGKAN console.error
      showAlert('error', `Gagal menghapus payment: ${error.message}`);
    } finally {
      setConfirmDeleteModal({ isOpen: false, id: null, loading: false });
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await paymentAPI.updateStatus(id, newStatus);
      showAlert('success', 'Status payment berhasil diupdate!');
      fetchAllData();
    } catch (error) {
      // ❌ HILANGKAN console.error
      showAlert('error', `Gagal update status: ${error.message}`);
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

  const getSupplierNama = (supplierId) => {
    if (!supplierId) return '-';
    const supplier = supplierList.find(s => s.id === supplierId);
    return supplier ? supplier.namaSupplier : '-';
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 0: // PENDING
        return <Badge text="Pending" variant="warning" />;
      case 1: // LUNAS
        return <Badge text="Lunas" variant="success" />;
      case 2: // DITOLAK
        return <Badge text="Ditolak" variant="danger" />;
      default:
        return <Badge text="Unknown" variant="secondary" />;
    }
  };

  const columns = [
    { header: 'ID', field: 'id', width: '60px' },
    { 
      header: 'Supplier',
      render: (row) => (
        <div>
          <p className="font-medium">{getSupplierNama(row.supplierId)}</p>
          <p className="text-xs text-gray-500">ID: {row.supplierId}</p>
        </div>
      )
    },
    { 
      header: 'Total Harga', 
      width: '150px',
      render: (row) => (
        <span className="font-semibold text-blue-600">
          {formatCurrency(row.totalHarga)}
        </span>
      )
    },
    { 
      header: 'Tanggal Bayar', 
      width: '130px',
      render: (row) => formatDate(row.tanggalBayar)
    },
    { 
      header: 'Status', 
      width: '120px',
      render: (row) => getStatusBadge(row.status)
    },
    { 
      header: 'Bukti Transfer', 
      width: '130px',
      render: (row) => row.buktiTransfer ? (
        <span className="text-green-600 text-sm">✓ Ada</span>
      ) : (
        <span className="text-gray-400 text-sm">Belum</span>
      )
    },
    {
      header: 'Aksi',
      width: '200px',
      render: (row) => (
        <div className="flex gap-2">
          <Button
            label="Detail"
            variant="info"
            size="sm"
            onClick={() => handleOpenDetailModal(row)}
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

  // Summary statistics
  const totalPayments = paymentList.length;
  const totalPending = paymentList.filter(p => p.status === 0).length;
  const totalLunas = paymentList.filter(p => p.status === 1).length;
  const totalNilai = paymentList.reduce((sum, p) => sum + (p.totalHarga || 0), 0);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Payment</p>
              <p className="text-3xl font-bold text-blue-700">{totalPayments}</p>
            </div>
            <div className="text-5xl">💳</div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-3xl font-bold text-yellow-700">{totalPending}</p>
            </div>
            <div className="text-5xl">⏳</div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Lunas</p>
              <p className="text-3xl font-bold text-green-700">{totalLunas}</p>
            </div>
            <div className="text-5xl">✅</div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Nilai</p>
              <p className="text-xl font-bold text-purple-700">{formatCurrency(totalNilai)}</p>
            </div>
            <div className="text-5xl">💰</div>
          </div>
        </Card>
      </div>

      {/* Table */}
      <Card
        title="💳 Data Payment"
        headerAction={
          <Button
            label="Tambah Payment"
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
            data={paymentList}
            loading={loading}
            emptyMessage="Belum ada data payment"
          />
        )}
      </Card>

      {/* Modal Create */}
      <PaymentCreateModal
        isOpen={isCreateModalOpen}
        onClose={handleCloseCreateModal}
        onSuccess={handleSuccess}
        showAlert={showAlert}
      />

      {/* Modal Detail */}
      {selectedPayment && (
        <PaymentDetailModal
          isOpen={isDetailModalOpen}
          onClose={handleCloseDetailModal}
          payment={selectedPayment}
          onSuccess={handleSuccess}
          showAlert={showAlert}
          onUpdateStatus={handleUpdateStatus}
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