// src/pages/Admin/UserDivisi/UserDivisiCreateModal.jsx

import { useState } from 'react';
import Modal from '../../../components/Modal';
import Input from '../../../components/Input';
import Button from '../../../components/Button';
import { userDivisiAPI } from '../../../services/api';

export default function UserDivisiCreateModal({ isOpen, onClose, onSuccess, showAlert }) {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    nama: '',
    namaDivisi: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      username: '',
      password: '',
      nama: '',
      namaDivisi: '',
    });
    setShowPassword(false);
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();

    // Validasi
    if (!formData.username.trim()) {
      showAlert('error', 'Username harus diisi!');
      return;
    }

    if (formData.username.length > 100) {
      showAlert('error', 'Username maksimal 100 karakter!');
      return;
    }

    if (!formData.password.trim()) {
      showAlert('error', 'Password harus diisi!');
      return;
    }

    if (formData.password.length < 6) {
      showAlert('error', 'Password minimal 6 karakter!');
      return;
    }

    if (formData.password.length > 255) {
      showAlert('error', 'Password maksimal 255 karakter!');
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

    setSubmitting(true);

    try {
      await userDivisiAPI.create(formData);
      onSuccess('User divisi berhasil ditambahkan!');
      resetForm();
      onClose();
    } catch (error) {
      console.error('Error creating user divisi:', error);
      showAlert('error', `Gagal menyimpan user divisi: ${error.message}`);
    } finally {
      setSubmitting(false);
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
      title="➕ Tambah User Divisi"
      size="md"
      footer={
        <>
          <Button
            label="Batal"
            variant="secondary"
            onClick={handleClose}
            disabled={submitting}
          />
          <Button
            onClick={handleSubmit}
            label={submitting ? 'Menyimpan...' : 'Simpan'}
            variant="primary"
            disabled={submitting}
          />
        </>
      }
    >
      <div className="space-y-4">
        
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

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                🔒
              </span>
              <input
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                placeholder="Masukkan password"
                required
                maxLength="255"
                className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Minimal 6 karakter, maksimal 255 karakter
          </p>
        </div>

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

        {/* Info Box */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
          <div className="flex items-start">
            <span className="text-2xl mr-3">ℹ️</span>
            <div>
              <p className="text-sm font-semibold text-blue-800">Informasi</p>
              <ul className="text-xs text-blue-700 mt-1 list-disc list-inside space-y-1">
                <li>Username akan digunakan untuk login</li>
                <li>Password minimal 6 karakter</li>
                <li>Nama divisi akan digunakan untuk grouping user</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}