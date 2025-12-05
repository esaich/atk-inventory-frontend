// src/pages/Admin/UserDivisi/UserDivisiEditModal.jsx

import { useState, useEffect } from 'react';
import Modal from '../../../components/Modal';
import Input from '../../../components/Input';
import Button from '../../../components/Button';
import { userDivisiAPI } from '../../../services/api';

export default function UserDivisiEditModal({ isOpen, onClose, user, onSuccess, showAlert }) {
  const [formData, setFormData] = useState({
    username: '',
    nama: '',
    namaDivisi: '',
    password: '', // Optional untuk update
  });
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        nama: user.nama || '',
        namaDivisi: user.namaDivisi || '',
        password: '', // Kosongkan password saat edit
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();

    if (!user || !user.id) {
      showAlert('error', 'ID User tidak ditemukan untuk update.');
      onClose();
      return;
    }

    // Validasi
    if (!formData.username.trim()) {
      showAlert('error', 'Username harus diisi!');
      return;
    }

    if (formData.username.length > 100) {
      showAlert('error', 'Username maksimal 100 karakter!');
      return;
    }

    if (!formData.nama.trim()) {
      showAlert('error', 'Nama lengkap harus diisi!');
      return;
    }

    if (formData.nama.length > 100) {
      showAlert('error', 'Nama maksimal 100 karakter!');
      return;
    }

    if (!formData.namaDivisi.trim()) {
      showAlert('error', 'Nama divisi harus diisi!');
      return;
    }

    if (formData.namaDivisi.length > 150) {
      showAlert('error', 'Nama divisi maksimal 150 karakter!');
      return;
    }

    // Validasi password jika diisi
    if (formData.password && formData.password.length < 6) {
      showAlert('error', 'Password minimal 6 karakter!');
      return;
    }

    setSubmitting(true);

    try {
      // Kirim data sesuai DTO (password nullable)
      const updateData = {
        username: formData.username,
        nama: formData.nama,
        namaDivisi: formData.namaDivisi,
        password: formData.password || null, // Null jika tidak diisi
      };

      await userDivisiAPI.update(user.id, updateData);
      onSuccess('User divisi berhasil diupdate!');
      onClose();
    } catch (error) {
      console.error('Error updating user divisi:', error);
      showAlert('error', `Gagal mengupdate user divisi: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`✏️ Edit User: ${user?.username}`}
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
            onClick={handleSubmit}
            disabled={submitting}
          />
        </>
      }
    >
      <div className="space-y-4">
        
        {/* User ID (Read-only) */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
          <p className="text-xs text-gray-600">User ID</p>
          <p className="text-lg font-bold text-gray-800">{user?.id}</p>
        </div>

        {/* Username */}
        <Input
          label="Username"
          name="username"
          type="text"
          value={formData.username}
          onChange={handleChange}
          placeholder="Masukkan username"
          required
          helpText="Maksimal 100 karakter"
          maxLength="100"
          icon={<span>👤</span>}
        />

        {/* Nama Lengkap */}
        <Input
          label="Nama Lengkap"
          name="nama"
          type="text"
          value={formData.nama}
          onChange={handleChange}
          placeholder="Masukkan nama lengkap"
          required
          helpText="Maksimal 100 karakter"
          maxLength="100"
          icon={<span>📝</span>}
        />

        {/* Nama Divisi */}
        <Input
          label="Nama Divisi"
          name="namaDivisi"
          type="text"
          value={formData.namaDivisi}
          onChange={handleChange}
          placeholder="Contoh: IT, Marketing, Finance"
          required
          helpText="Maksimal 150 karakter"
          maxLength="150"
          icon={<span>🏢</span>}
        />

        {/* Password (Optional) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password Baru <span className="text-gray-400">(Opsional)</span>
          </label>
          <div className="relative">
            <Input
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              placeholder="Kosongkan jika tidak ingin mengubah password"
              helpText="Minimal 6 karakter jika diisi"
              maxLength="255"
              icon={<span>🔒</span>}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>
        </div>

        {/* Warning Box */}
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-lg">
          <div className="flex items-start">
            <span className="text-2xl mr-3">⚠️</span>
            <div>
              <p className="text-sm font-semibold text-yellow-800">Perhatian</p>
              <ul className="text-xs text-yellow-700 mt-1 list-disc list-inside space-y-1">
                <li>Kosongkan field password jika tidak ingin mengubahnya</li>
                <li>Jika password diubah, user harus login ulang</li>
                <li>Pastikan username tidak duplikat dengan user lain</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}