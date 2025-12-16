// src/pages/Admin/Divisi/DivisiCreateModal.jsx

import { useState } from 'react';
import Modal from '../../../components/Modal';
import Input from '../../../components/Input';
import Button from '../../../components/Button';
import { divisiAPI } from '../../../services/api';

export default function DivisiCreateModal({ isOpen, onClose, onSuccess, showAlert }) {
  const [formData, setFormData] = useState({
    nama: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({ nama: '' });
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();

    // --- Validasi ---
    if (!formData.nama.trim()) {
      showAlert('error', 'Nama Divisi harus diisi!');
      return;
    }

    if (formData.nama.length > 150) {
      showAlert('error', 'Nama Divisi maksimal 150 karakter!');
      return;
    }
    // ----------------

    setSubmitting(true);

    try {
      const newDivisi = {
        nama: formData.nama.trim(),
      };

      await divisiAPI.create(newDivisi);
      
      // Panggil fungsi sukses dan berikan pesan yang relevan
      onSuccess(`Divisi "${formData.nama}" berhasil ditambahkan!`);
      resetForm();
      onClose();
    } catch (error) {
      console.error('Error creating divisi:', error);
      // Tangani error duplikasi atau error server lainnya
      const errorMessage = error.response?.data?.message || `Gagal membuat divisi: ${error.message}`;
      showAlert('error', errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="➕ Buat Divisi Baru"
      size="sm"
      footer={
        <>
          <Button
            label="Batal"
            variant="secondary"
            onClick={handleClose}
            disabled={submitting}
          />
          <Button
            label={submitting ? 'Menyimpan...' : 'Simpan Divisi'}
            variant="success"
            onClick={handleSubmit}
            disabled={submitting}
          />
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Nama Divisi"
          name="nama"
          type="text"
          value={formData.nama}
          onChange={handleChange}
          placeholder="Contoh: Keuangan, IT, Marketing"
          required
          helpText="Maksimal 150 karakter"
          maxLength="150"
          icon={<span>🏢</span>}
        />

        {/* Informasi tambahan untuk Admin */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded-lg text-sm text-blue-800">
          <p className="font-semibold">Informasi:</p>
          <p>Setelah divisi dibuat, Anda dapat langsung menggunakannya pada formulir pembuatan atau pengeditan User Divisi.</p>
        </div>
      </form>
    </Modal>
  );
}