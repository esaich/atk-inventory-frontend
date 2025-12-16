// src/pages/Admin/UserDivisi/UserDivisiEditModal.jsx (VERSI DIPERBARUI)

import { useState, useEffect } from 'react';
import Modal from '../../../components/Modal';
import Input from '../../../components/Input';
import Button from '../../../components/Button';
import { userDivisiAPI } from '../../../services/api';

// ✅ Tambahkan divisiList ke props
export default function UserDivisiEditModal({ isOpen, onClose, user, onSuccess, showAlert, divisiList }) {
  const [formData, setFormData] = useState({
    username: '',
    nama: '',
    // ❌ Ganti namaDivisi menjadi divisiId
    divisiId: '', 
    password: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        nama: user.nama || '',
        // ✅ Ambil DivisiId dari data user saat ini
        // Asumsi data user memiliki properti divisiId
        divisiId: user.divisiId ? user.divisiId.toString() : '', 
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

    // Validasi (dipersingkat)
    if (!formData.username.trim() || formData.username.length > 100) {
      showAlert('error', 'Username harus diisi dan maksimal 100 karakter!');
      return;
    }
    if (!formData.nama.trim() || formData.nama.length > 100) {
      showAlert('error', 'Nama lengkap harus diisi dan maksimal 100 karakter!');
      return;
    }
    // ✅ Validasi DivisiId
    if (!formData.divisiId) {
      showAlert('error', 'Divisi harus dipilih!');
      return;
    }
    // Validasi password jika diisi
    if (formData.password && formData.password.length < 6) {
      showAlert('error', 'Password minimal 6 karakter!');
      return;
    }

    setSubmitting(true);

    try {
        // ✅ Cari namaDivisi untuk payload, lalu kirim DivisiId
        const selectedDivisi = divisiList.find(d => d.id.toString() === formData.divisiId);
        
      // Kirim data sesuai DTO (password nullable)
      const updateData = {
        username: formData.username,
        nama: formData.nama,
        // ✅ Kirim DivisiId sebagai integer
        divisiId: parseInt(formData.divisiId), 
        // ✅ Kirim namaDivisi yang sesuai (jika diperlukan backend)
        namaDivisi: selectedDivisi?.nama || '', 
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
        {/* ... (Tidak diubah) */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
          <p className="text-xs text-gray-600">User ID</p>
          <p className="text-lg font-bold text-gray-800">{user?.id}</p>
        </div>

        {/* Username */}
        {/* ... (Tidak diubah) */}
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
        {/* ... (Tidak diubah) */}
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

        {/* 🏢 Dropdown Pilih Divisi (MENGGANTIKAN INPUT TEKS NAMA DIVISI) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Divisi <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              🏢
            </span>
            <select
              name="divisiId"
              value={formData.divisiId}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
            >
              <option value="">-- Pilih Divisi --</option>
              {divisiList && divisiList.map((divisi) => (
                <option key={divisi.id} value={divisi.id}>
                  {divisi.nama}
                </option>
              ))}
            </select>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Pilih divisi pengguna ini
          </p>
        </div>

        {/* Password (Optional) */}
        {/* ... (Tidak diubah, kecuali penempatan tag input) */}
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
        {/* ... (Tidak diubah) */}
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