// src/pages/Admin/BarangKeluar/BarangKeluarDetailModal.jsx

import Modal from '../../../components/Modal';
import Button from '../../../components/Button';
import Badge from '../../../components/Badge';

export default function BarangKeluarDetailModal({ 
  isOpen, 
  onClose, 
  barangKeluar,
  barangInfo,
  divisiName,
  userName
}) {
  
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { 
      day: '2-digit', 
      month: 'long', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  if (!barangKeluar) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="📤 Detail Barang Keluar"
      size="lg"
      footer={
        <Button
          label="Tutup"
          variant="secondary"
          onClick={onClose}
          fullWidth
        />
      }
    >
      <div className="space-y-4">
        
        {/* Header Info */}
        <div className="flex justify-between items-center pb-4 border-b">
          <h3 className="text-lg font-semibold text-gray-800">
            Transaksi ID: {barangKeluar.id}
          </h3>
          <Badge text="Completed" variant="success" />
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
              <p className="text-gray-600">Jumlah Keluar:</p>
              <p className="font-bold text-red-600 text-lg">
                -{barangKeluar.jumlahKeluar} {barangInfo.satuan}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Satuan:</p>
              <p className="font-medium text-gray-800">{barangInfo.satuan}</p>
            </div>
          </div>
        </div>

        {/* Informasi Divisi Penerima */}
        <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4">
          <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <span>🏢</span> Divisi Penerima
          </h4>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-gray-600">Nama Divisi:</p>
              <p className="font-medium text-gray-800">{divisiName || '-'}</p>
            </div>
            
          </div>
        </div>

        {/* Informasi Permintaan */}
        {barangKeluar.permintaanId && (
          <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <span>📝</span> Referensi Permintaan
            </h4>
            <div className="text-sm">
              <p className="text-gray-600">Nomor Permintaan:</p>
              <p className="font-bold text-green-700 text-lg">
                #{barangKeluar.permintaanId}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Barang keluar berdasarkan permintaan yang telah disetujui
              </p>
            </div>
          </div>
        )}

        {/* Tanggal & Waktu */}
        <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4">
          <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <span>📅</span> Waktu Transaksi
          </h4>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-gray-600">Tanggal Keluar:</p>
              <p className="font-medium text-gray-800">
                {formatDate(barangKeluar.tanggalKeluar)}
              </p>
            </div>
            {barangKeluar.createdAt && (
              <div>
                <p className="text-gray-600">Dibuat:</p>
                <p className="font-medium text-gray-800">
                  {formatDate(barangKeluar.createdAt)}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Keterangan */}
        {barangKeluar.keterangan && (
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
              <span>💬</span> Keterangan
            </h4>
            <p className="text-sm text-gray-700">{barangKeluar.keterangan}</p>
          </div>
        )}

        {/* Summary */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-300 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Ringkasan Transaksi:</p>
              <p className="text-lg font-bold text-gray-800 mt-1">
                {barangKeluar.jumlahKeluar} {barangInfo.satuan} {barangInfo.nama}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Untuk:</p>
              <p className="text-lg font-bold text-purple-700">
                {divisiName}
              </p>
            </div>
          </div>
        </div>

        {/* Info Footer */}
        <div className="bg-gray-100 rounded-lg p-3 text-xs text-gray-600 text-center">
          <p>
            ℹ️ Data ini bersifat read-only dan tidak dapat diubah atau dihapus
          </p>
        </div>
      </div>
    </Modal>
  );
}