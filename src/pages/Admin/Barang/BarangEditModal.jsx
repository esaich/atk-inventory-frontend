// src/pages/Admin/Barang/BarangEditModal.jsx

import { useState, useEffect } from 'react';
import Modal from '../../../components/Modal';
import Input from '../../../components/Input';
import Button from '../../../components/Button';
import { barangAPI } from '../../../services/api';

// Menerima prop 'barang' untuk data yang akan diedit
export default function BarangEditModal({ isOpen, onClose, barang, onSuccess, showAlert }) {
const [formData, setFormData] = useState({
    kodeBarang: '',
    namaBarang: '',
    stok: 0,
    satuan: '',
});
const [submitting, setSubmitting] = useState(false);

// Efek untuk mengisi form ketika prop 'barang' berubah (saat modal dibuka)
useEffect(() => {
    if (barang) {
      setFormData({
    kodeBarang: barang.kodeBarang || '',
    namaBarang: barang.namaBarang || '',
    stok: barang.stok || 0,
    satuan: barang.satuan || '',
      });
    }
}, [barang]);

const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'stok' ? parseInt(value) || 0 : value 
    }));
};

const handleSubmit = async (e) => {
    // Karena dipanggil via onClick pada tombol di luar form, e mungkin bukan event submit.
    // Kita tetap coba panggil preventDefault, tapi pastikan logika utama dijalankan.
    if (e && e.preventDefault) e.preventDefault(); 

    // Pastikan ID tersedia untuk update
    if (!barang || !barang.id) {
     showAlert('error', 'ID Barang tidak ditemukan untuk update.');
     onClose();
     return;
    }
    
    setSubmitting(true);

    try {
      // Menggunakan barang.id untuk update
      await barangAPI.update(barang.id, formData); 
      onSuccess('Barang berhasil diupdate!');
      onClose();
    } catch (error) {
      console.error('Error updating barang:', error);
      showAlert('error', `Gagal mengupdate barang: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
};

return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`✏️ Edit Barang: ${barang?.namaBarang || ''}`}
      size="md"
      footer={
    <>
     <Button
      label="Batal"
      variant="secondary"
      onClick={onClose}
      disabled={submitting}
     />
     <Button
      label={submitting ? 'Mengupdate...' : 'Update'}
      variant="primary"
      // ✅ PERBAIKAN: Gunakan onClick untuk memicu fungsi langsung
      onClick={handleSubmit}
      // 🛑 Hapus: type="submit" dan form="barang-edit-form"
      disabled={submitting}
     />
    </>
      }
    >
      {/* 🛑 Hapus ID form (opsional, tapi disarankan jika tombol tidak lagi menggunakannya) */}
      <form onSubmit={handleSubmit} className="space-y-4">
    <Input
     label="Kode Barang"
     name="kodeBarang"
     value={formData.kodeBarang}
     onChange={handleChange}
     placeholder="Contoh: BRG001"
     required
    />
    <Input
     label="Nama Barang"
     name="namaBarang"
     value={formData.namaBarang}
     onChange={handleChange}
     placeholder="Masukkan nama barang"
     required
    />
    <Input
     label="Stok"
     name="stok"
     type="number"
     value={formData.stok}
     onChange={handleChange}
     placeholder="0"
     required
    />
    <Input
     label="Satuan"
     name="satuan"
     value={formData.satuan}
     onChange={handleChange}
     placeholder="Contoh: Pcs, Box, Pack"
     required
    />
      </form>
    </Modal>
  );
}