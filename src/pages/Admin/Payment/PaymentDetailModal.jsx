// src/pages/Admin/Payment/PaymentDetailModal.jsx

import { useState, useEffect } from 'react';
import Modal from '../../../components/Modal';
import Button from '../../../components/Button';
import Badge from '../../../components/Badge';
import Input from '../../../components/Input';
import { paymentAPI, supplierAPI } from '../../../services/api';

export default function PaymentDetailModal({ 
  isOpen, 
  onClose, 
  payment, 
  onSuccess, 
  showAlert,
  onUpdateStatus 
}) {
  const [supplier, setSupplier] = useState(null);
  const [loading, setLoading] = useState(false);
  const [buktiTransferInput, setBuktiTransferInput] = useState('');
  const [uploadingBukti, setUploadingBukti] = useState(false);

  useEffect(() => {
    if (payment && payment.supplierId) {
      fetchSupplierDetail(payment.supplierId);
    }
  }, [payment]);

  const fetchSupplierDetail = async (supplierId) => {
    try {
      setLoading(true);
      const response = await supplierAPI.getById(supplierId);
      setSupplier(response);
    } catch (error) {
      console.error('Error fetching supplier detail:', error);
      showAlert('error', 'Gagal memuat detail supplier');
    } finally {
      setLoading(false);
    }
  };

  const handleUploadBukti = async () => {
    if (!buktiTransferInput.trim()) {
      showAlert('error', 'Path bukti transfer harus diisi!');
      return;
    }

    try {
      setUploadingBukti(true);
      await paymentAPI.uploadBukti(payment.id, buktiTransferInput);
      showAlert('success', 'Bukti transfer berhasil diupload!');
      setBuktiTransferInput('');
      onSuccess('Bukti transfer berhasil diupload!');
      onClose();
    } catch (error) {
      console.error('Error uploading bukti:', error);
      showAlert('error', `Gagal upload bukti: ${error.message}`);
    } finally {
      setUploadingBukti(false);
    }
  };

  const handleStatusChange = (newStatus) => {
    const statusText = newStatus === 1 ? 'LUNAS' : 'DITOLAK';
    
    if (window.confirm(`Yakin ingin ubah status menjadi ${statusText}?`)) {
      onUpdateStatus(payment.id, newStatus);
      onClose();
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { 
      day: '2-digit', 
      month: 'long', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount || 0);
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

  if (!payment) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="💳 Detail Payment"
      size="lg"
      footer={
        <div className="flex justify-between w-full">
          <div className="flex gap-2">
            {payment.status === 0 && (
              <>
                <Button
                  label="Tandai Lunas"
                  variant="success"
                  size="sm"
                  onClick={() => handleStatusChange(1)}
                />
                <Button
                  label="Tolak"
                  variant="danger"
                  size="sm"
                  onClick={() => handleStatusChange(2)}
                />
              </>
            )}
          </div>
          <Button
            label="Tutup"
            variant="secondary"
            onClick={onClose}
          />
        </div>
      }
    >
      <div className="space-y-6">
        
        {/* Status Badge */}
        <div className="flex justify-between items-center pb-4 border-b">
          <h3 className="text-lg font-semibold text-gray-800">Payment ID: {payment.id}</h3>
          {getStatusBadge(payment.status)}
        </div>

        {/* Payment Info */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Total Harga</p>
            <p className="text-2xl font-bold text-blue-600">
              {formatCurrency(payment.totalHarga)}
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Tanggal Bayar</p>
            <p className="text-lg font-semibold text-gray-800">
              {formatDate(payment.tanggalBayar)}
            </p>
          </div>
        </div>

        {/* Supplier Info */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <span>🏢</span> Informasi Supplier
          </h4>
          {loading ? (
            <p className="text-sm text-gray-600">Loading...</p>
          ) : supplier ? (
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Nama:</span>
                <span className="font-medium">{supplier.namaSupplier}</span>
              </div>
              {supplier.alamat && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Alamat:</span>
                  <span className="font-medium text-right">{supplier.alamat}</span>
                </div>
              )}
              {supplier.telepon && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Telepon:</span>
                  <span className="font-medium">{supplier.telepon}</span>
                </div>
              )}
              {supplier.email && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium">{supplier.email}</span>
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-gray-600">Supplier tidak ditemukan</p>
          )}
        </div>

        {/* Keterangan */}
        {payment.keterangan && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-800 mb-2">📝 Keterangan</h4>
            <p className="text-sm text-gray-700">{payment.keterangan}</p>
          </div>
        )}

        {/* Bukti Transfer Section */}
        <div className="border-t pt-4">
          <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <span>📎</span> Bukti Transfer
          </h4>
          
          {payment.buktiTransfer ? (
            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">File Path:</p>
                  <p className="text-sm font-medium text-gray-800 break-all">
                    {payment.buktiTransfer}
                  </p>
                </div>
                <span className="text-3xl">✅</span>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-3">
                <p className="text-sm text-yellow-800">
                  ⚠️ Belum ada bukti transfer yang diupload
                </p>
              </div>
              
              {/* Upload Form */}
              <div className="flex gap-2">
                <Input
                  name="buktiTransfer"
                  type="text"
                  value={buktiTransferInput}
                  onChange={(e) => setBuktiTransferInput(e.target.value)}
                  placeholder="Masukkan path/URL bukti transfer"
                  className="flex-1"
                />
                <Button
                  label={uploadingBukti ? 'Uploading...' : 'Upload'}
                  variant="primary"
                  size="sm"
                  onClick={handleUploadBukti}
                  disabled={uploadingBukti}
                />
              </div>
            </div>
          )}
        </div>

        {/* Timeline Info */}
        <div className="bg-gray-50 rounded-lg p-4 text-xs text-gray-600">
          <div className="flex justify-between items-center">
            <span>Dibuat: {formatDate(payment.createdAt)}</span>
            {payment.updatedAt && (
              <span>Terakhir Update: {formatDate(payment.updatedAt)}</span>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}