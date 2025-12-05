// src/pages/Admin/Supplier/SupplierEditModal.jsx

import { useState, useEffect } from 'react';
import Modal from '../../../components/Modal';
import Button from '../../../components/Button';
import Input from '../../../components/Input';
import { supplierAPI } from '../../../services/api';

export default function SupplierEditModal({ isOpen, onClose, supplier, onSuccess, showAlert }) {
  const [formData, setFormData] = useState({
    namaSupplier: '',
    alamat: '',
    telepon: '',
    email: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mengisi form data saat modal dibuka atau supplier berubah
  useEffect(() => {
    if (supplier) {
      setFormData({
        namaSupplier: supplier.namaSupplier || '',
        alamat: supplier.alamat || '',
        telepon: supplier.telepon || '',
        email: supplier.email || '',
      });
    }
  }, [supplier]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // src/pages/Admin/Supplier/SupplierEditModal.jsx (REVISI)

// ...

const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);
  
  // ❌ sebelumnya: const supplierId = supplier?.supplierId;
  // ✅ PERBAIKAN: Gunakan properti 'id' karena data supplier memiliki field 'id'
  const supplierId = supplier?.id; 

  console.log('Supplier yang akan diupdate:', supplier);
  console.log('ID Supplier yang dikirim ke API:', supplierId);
  console.log('Payload data yang dikirim:', formData);

  // Cek ID harus berupa angka yang valid (> 0)
  if (!supplierId || supplierId <= 0) { 
    showAlert('error', 'Gagal: ID Supplier tidak valid atau hilang.');
    setIsSubmitting(false);
    return;
  }

  try {
    // Panggil API UPDATE dengan ID SUPPLIER (yang sekarang sudah terisi angka 1)
    await supplierAPI.update(supplierId, formData); 
    
    onSuccess('Supplier berhasil diupdate!');
    onClose();
  } catch (error) {
    showAlert('error', `Gagal mengupdate supplier: ${error.message}`);
  } finally {
    setIsSubmitting(false);
  }
};


  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="✏️ Edit Supplier"
      size="md"
      footer={
        <>
          <Button
            label="Batal"
            variant="secondary"
            onClick={onClose}
            disabled={isSubmitting}
          />
          <Button
            label={isSubmitting ? 'Mengupdate...' : 'Update'}
            variant="primary"
            onClick={handleSubmit}
            disabled={isSubmitting}
          />
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Tampilkan ID Supplier untuk referensi */}
        <p className="text-sm text-gray-500">
            ID: <span className="font-mono font-semibold">{supplier?.supplierId}</span>
        </p>
        
        <Input
          label="Nama Supplier"
          name="namaSupplier"
          value={formData.namaSupplier}
          onChange={handleChange}
          placeholder="Masukkan nama supplier"
          required
        />
        
        <Input
          label="Alamat"
          name="alamat"
          value={formData.alamat}
          onChange={handleChange}
          placeholder="Masukkan alamat"
        />
        
        <Input
          label="Telepon"
          name="telepon"
          type="tel"
          value={formData.telepon}
          onChange={handleChange}
          placeholder="Masukkan nomor telepon"
        />
        
        <Input
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Masukkan email"
        />
      </form>
    </Modal>
  );
}