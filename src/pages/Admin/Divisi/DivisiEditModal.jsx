// src/pages/Admin/Divisi/DivisiEditModal.jsx

import { useState, useEffect } from 'react';
import Modal from '../../../components/Modal';
import Input from '../../../components/Input';
import Button from '../../../components/Button';
import { divisiAPI } from '../../../services/api';

export default function DivisiEditModal({ isOpen, onClose, divisi, onSuccess, showAlert }) {
  const [formData, setFormData] = useState({
    nama: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (divisi) {
      setFormData({
        nama: divisi.nama || '',
      });
    }
  }, [divisi]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();

    if (!divisi || !divisi.id) {
      showAlert('error', 'ID Divisi tidak ditemukan untuk update.');
      onClose();
      return;
    }

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
      const updateData = {
        nama: formData.nama.trim(),
      };

      await divisiAPI.update(divisi.id, updateData);
      
      onSuccess(`Divisi "${updateData.nama}" berhasil diupdate!`);
      onClose();
    } catch (error) {
      console.error('Error updating divisi:', error);
      const errorMessage = error.response?.data?.message || `Gagal mengupdate divisi: ${error.message}`;
      showAlert('error', errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`✏️ Edit Divisi: ${divisi?.nama}`}
      size="sm"
      footer={
        <>
          <Button
            label="Batal"
            variant="secondary"
            onClick={onClose}
            disabled={submitting}
          />
          <Button
            label={submitting ? 'Mengupdate...' : 'Update Divisi'}
            variant="primary"
            onClick={handleSubmit}
            disabled={submitting}
          />
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
          <p className="text-xs text-gray-600">Divisi ID</p>
          <p className="text-lg font-bold text-gray-800">{divisi?.id}</p>
        </div>

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

      </form>
    </Modal>
  );
}