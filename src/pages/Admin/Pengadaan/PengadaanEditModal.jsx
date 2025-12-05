// src/pages/Admin/Pengadaan/PengadaanEditModal.jsx

import { useState, useEffect } from 'react';
import Modal from '../../../components/Modal';
import Input from '../../../components/Input';
import Select from '../../../components/Select';
import Button from '../../../components/Button';
import { pengadaanAPI, supplierAPI } from '../../../services/api';

export default function PengadaanEditModal({ isOpen, onClose, pengadaan, onSuccess, showAlert }) {
  const [formData, setFormData] = useState({
    namaBarang: '',
    satuan: '',
    jumlahDiajukan: 0,
    tanggalPengajuan: '',
    keterangan: '',
    supplierId: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [suppliers, setSuppliers] = useState([]);
  const [loadingSuppliers, setLoadingSuppliers] = useState(false);

  // Fetch suppliers saat modal dibuka
  useEffect(() => {
    if (isOpen) {
      fetchSuppliers();
    }
  }, [isOpen]);

  // Isi form dengan data pengadaan yang akan diedit
  useEffect(() => {
    if (pengadaan) {
      setFormData({
        namaBarang: pengadaan.namaBarang || '',
        satuan: pengadaan.satuan || '',
        jumlahDiajukan: pengadaan.jumlahDiajukan || 0,
        tanggalPengajuan: pengadaan.tanggalPengajuan 
          ? new Date(pengadaan.tanggalPengajuan).toISOString().split('T')[0]
          : '',
        keterangan: pengadaan.keterangan || '',
        supplierId: pengadaan.supplierId || '',
      });
    }
  }, [pengadaan]);

  const fetchSuppliers = async () => {
    try {
      setLoadingSuppliers(true);
      const response = await supplierAPI.getAll();
      
      let supplierData = [];
      if (Array.isArray(response)) {
        supplierData = response;
      } else if (response && Array.isArray(response.data)) {
        supplierData = response.data;
      } else if (response && response.$values) {
        supplierData = response.$values;
      }
      
      setSuppliers(supplierData);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
      showAlert('error', 'Gagal memuat data supplier');
    } finally {
      setLoadingSuppliers(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'jumlahDiajukan' || name === 'supplierId' 
        ? parseInt(value) || 0 
        : value 
    }));
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();

    if (!pengadaan || !pengadaan.id) {
      showAlert('error', 'ID Pengadaan tidak ditemukan untuk update.');
      onClose();
      return;
    }

    // Validasi
    if (!formData.namaBarang || !formData.satuan || !formData.supplierId) {
      showAlert('error', 'Nama barang, satuan, dan supplier harus diisi!');
      return;
    }

    if (formData.jumlahDiajukan <= 0) {
      showAlert('error', 'Jumlah diajukan harus lebih dari 0!');
      return;
    }

    setSubmitting(true);

    try {
      await pengadaanAPI.update(pengadaan.id, formData);
      onSuccess('Pengadaan berhasil diupdate!');
      onClose();
    } catch (error) {
      console.error('Error updating pengadaan:', error);
      showAlert('error', `Gagal mengupdate pengadaan: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  // Convert suppliers untuk Select component
  const supplierOptions = suppliers.map(s => ({
    value: s.id,
    label: s.namaSupplier
  }));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`✏️ Edit Pengadaan: ${pengadaan?.namaBarang || ''}`}
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
            disabled={submitting || loadingSuppliers}
          />
        </>
      }
    >
      <div className="space-y-4">
        <Input
          label="Nama Barang"
          name="namaBarang"
          value={formData.namaBarang}
          onChange={handleChange}
          placeholder="Contoh: Pulpen Pilot"
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Satuan"
            name="satuan"
            value={formData.satuan}
            onChange={handleChange}
            placeholder="Pcs, Box, Pack"
            required
          />
          <Input
            label="Jumlah Diajukan"
            name="jumlahDiajukan"
            type="number"
            value={formData.jumlahDiajukan}
            onChange={handleChange}
            placeholder="0"
            required
          />
        </div>

        <Input
          label="Tanggal Pengajuan"
          name="tanggalPengajuan"
          type="date"
          value={formData.tanggalPengajuan}
          onChange={handleChange}
          required
        />

        <Select
          label="Supplier"
          name="supplierId"
          value={formData.supplierId}
          onChange={handleChange}
          options={supplierOptions}
          placeholder={loadingSuppliers ? "Loading..." : "Pilih supplier"}
          required
          disabled={loadingSuppliers}
        />

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Keterangan
          </label>
          <textarea
            name="keterangan"
            value={formData.keterangan}
            onChange={handleChange}
            placeholder="Keterangan tambahan (opsional)"
            className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
            rows="3"
          />
        </div>
      </div>
    </Modal>
  );
}