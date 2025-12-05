// src/pages/Admin/Supplier/SupplierCreateModal.jsx

import { useState } from 'react';
import Modal from '../../../components/Modal';
import Button from '../../../components/Button';
import Input from '../../../components/Input';
import { supplierAPI } from '../../../services/api';

export default function SupplierCreateModal({ isOpen, onClose, onSuccess, showAlert }) {
  const [formData, setFormData] = useState({
    namaSupplier: '',
    alamat: '',
    telepon: '',
    email: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      namaSupplier: '',
      alamat: '',
      telepon: '',
      email: '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Menggunakan createBulk seperti yang ada di api.js
      await supplierAPI.createBulk([formData]); 
      onSuccess('Supplier berhasil ditambahkan!');
      onClose();
      resetForm();
    } catch (error) {
      showAlert('error', `Gagal menyimpan supplier: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="➕ Tambah Supplier Baru"
      size="md"
      footer={
        <>
          <Button
            label="Batal"
            variant="secondary"
            onClick={handleClose}
            disabled={isSubmitting}
          />
          <Button
            label={isSubmitting ? 'Menyimpan...' : 'Simpan'}
            variant="primary"
            onClick={handleSubmit}
            disabled={isSubmitting}
          />
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
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