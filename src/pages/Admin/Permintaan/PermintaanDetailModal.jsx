// src/pages/Admin/Permintaan/PermintaanDetailModal.jsx

import { useState } from 'react';
import Modal from '../../../components/Modal';
import Button from '../../../components/Button';
import Badge from '../../../components/Badge';

export default function PermintaanDetailModal({ 
  isOpen, 
  onClose, 
  permintaan, 
  barangInfo,
  onSuccess, 
  showAlert,
  onUpdateStatus 
}) {
  const [keterangan, setKeterangan] = useState('');
  const [processing, setProcessing] = useState(false);

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

  const handleApprove = async () => {
    if (!window.confirm('Yakin ingin menyetujui permintaan ini?')) return;

    setProcessing(true);
    try {
      await onUpdateStatus(permintaan.id, 1, keterangan || 'Permintaan disetujui');
      onSuccess('Permintaan berhasil disetujui!');
      onClose();
    } catch (error) {
      showAlert('error', `Gagal menyetujui: ${error.message}`);
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!keterangan.trim()) {
      showAlert('error', 'Keterangan harus diisi saat menolak permintaan!');
      return;
    }

    if (!window.confirm('Yakin ingin menolak permintaan ini?')) return;

    setProcessing(true);
    try {
      await onUpdateStatus(permintaan.id, 2, keterangan);
      onSuccess('Permintaan berhasil ditolak!');
      onClose();
    } catch (error) {
      showAlert('error', `Gagal menolak: ${error.message}`);
    } finally {
      setProcessing(false);
    }
  };

  if (!permintaan) return null;

  const isStockSufficient = permintaan.jumlahDiminta <= barangInfo.stok;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="📋 Detail Permintaan Barang"
      size="lg"
      footer={
        <div className="flex justify-between w-full">
          <div className="flex gap-2">
            {permintaan.status === 0 && (
              <>
                <Button
                  label={processing ? 'Processing...' : 'Setujui'}
                  variant="success"
                  onClick={handleApprove}
                  disabled={processing || !isStockSufficient}
                />
                <Button
                  label={processing ? 'Processing...' : 'Tolak'}
                  variant="danger"
                  onClick={handleReject}
                  disabled={processing}
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
      <div className="space-y-4">
        
        {/* Status Badge */}
        <div className="flex justify-between items-center pb-4 border-b">
          <h3 className="text-lg font-semibold text-gray-800">
            Permintaan ID: {permintaan.id}
          </h3>
          {getStatusBadge(permintaan.status)}
        </div>

        {/* Informasi Barang */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <span>📦</span> Informasi Barang
          </h4>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-gray-600">Kode Barang:</p>
              <p className="font-medium text-gray-800">{barangInfo.kode}</p>
            </div>
            <div>
              <p className="text-gray-600">Nama Barang:</p>
              <p className="font-medium text-gray-800">{barangInfo.nama}</p>
            </div>
            <div>
              <p className="text-gray-600">Jumlah Diminta:</p>
              <p className="font-bold text-blue-600 text-lg">
                {permintaan.jumlahDiminta} {barangInfo.satuan}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Stok Tersedia:</p>
              <p className={`font-bold text-lg ${isStockSufficient ? 'text-green-600' : 'text-red-600'}`}>
                {barangInfo.stok} {barangInfo.satuan}
              </p>
            </div>
          </div>

          {/* Warning jika stok tidak cukup */}
          {!isStockSufficient && (
            <div className="mt-3 bg-red-50 border-l-4 border-red-500 p-3 rounded">
              <p className="text-sm text-red-800 font-semibold">
                ⚠️ Stok tidak mencukupi permintaan!
              </p>
            </div>
          )}
        </div>

        {/* Informasi Peminta */}
        <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4">
          <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <span>👤</span> Informasi Peminta
          </h4>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-gray-600">Divisi:</p>
              <p className="font-medium text-gray-800">{permintaan.namaDivisi || '-'}</p>
            </div>
            <div>
              <p className="text-gray-600">Nama Peminta:</p>
              <p className="font-medium text-gray-800">{permintaan.namaUser || '-'}</p>
            </div>
            <div>
              <p className="text-gray-600">Tanggal Permintaan:</p>
              <p className="font-medium text-gray-800">
                {formatDate(permintaan.tanggalPermintaan || permintaan.createdAt)}
              </p>
            </div>
            <div>
              <p className="text-gray-600">User ID:</p>
              <p className="font-medium text-gray-800">{permintaan.userId || '-'}</p>
            </div>
          </div>
        </div>

        {/* Alasan Permintaan */}
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
          <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
            <span>📝</span> Alasan Permintaan
          </h4>
          <p className="text-sm text-gray-700">
            {permintaan.alasan || 'Tidak ada alasan yang diberikan'}
          </p>
        </div>

        {/* Keterangan dari Admin */}
        {permintaan.status !== 0 && permintaan.keterangan && (
          <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
              <span>💬</span> Keterangan Admin
            </h4>
            <p className="text-sm text-gray-700">{permintaan.keterangan}</p>
          </div>
        )}

        {/* Input Keterangan (untuk approve/reject) */}
        {permintaan.status === 0 && (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Keterangan {permintaan.status === 0 && <span className="text-red-500">*</span>}
            </label>
            <textarea
              value={keterangan}
              onChange={(e) => setKeterangan(e.target.value)}
              placeholder="Berikan keterangan untuk keputusan Anda (wajib jika menolak)"
              rows="3"
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              Keterangan akan dilihat oleh peminta
            </p>
          </div>
        )}

        {/* Info Box */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
          <div className="flex items-start">
            <span className="text-2xl mr-3">ℹ️</span>
            <div>
              <p className="text-sm font-semibold text-blue-800">Informasi</p>
              <ul className="text-xs text-blue-700 mt-1 list-disc list-inside space-y-1">
                <li>Pastikan stok mencukupi sebelum menyetujui</li>
                <li>Berikan keterangan yang jelas saat menolak</li>
                <li>Keputusan tidak dapat diubah setelah diproses</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}