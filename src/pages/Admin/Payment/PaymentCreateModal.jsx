// src/pages/Admin/Payment/PaymentCreateModal.jsx

import { useState, useEffect } from 'react';
import Modal from '../../../components/Modal';
import Input from '../../../components/Input';
import Select from '../../../components/Select';
import Button from '../../../components/Button';
import { paymentAPI, supplierAPI } from '../../../services/api';

export default function PaymentCreateModal({ isOpen, onClose, onSuccess, showAlert }) {
  const [formData, setFormData] = useState({
    supplierId: '',
    totalHarga: 0,
    tanggalBayar: new Date().toISOString().split('T')[0],
    keterangan: '',
    buktiTransfer: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchSuppliers();
    }
  }, [isOpen]);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
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
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'supplierId'
        ? parseInt(value) || '' 
        : name === 'totalHarga'
        ? parseFloat(value) || 0
        : value 
    }));
  };

  const resetForm = () => {
    setFormData({
      supplierId: '',
      totalHarga: 0,
      tanggalBayar: new Date().toISOString().split('T')[0],
      keterangan: '',
      buktiTransfer: '',
    });
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();

    // Validasi
    if (!formData.supplierId) {
      showAlert('error', 'Supplier harus dipilih!');
      return;
    }

    if (formData.totalHarga <= 0) {
      showAlert('error', 'Total harga harus lebih dari 0!');
      return;
    }

    if (!formData.tanggalBayar) {
      showAlert('error', 'Tanggal bayar harus diisi!');
      return;
    }

    setSubmitting(true);

    try {
      await paymentAPI.create(formData);
      onSuccess('Payment berhasil ditambahkan!');
      resetForm();
      onClose();
    } catch (error) {
      console.error('Error creating payment:', error);
      showAlert('error', `Gagal menyimpan payment: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const supplierOptions = suppliers.map(s => ({
    value: s.id,
    label: `${s.namaSupplier} - ${s.telepon || 'No telp'}`
  }));

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="➕ Tambah Payment"
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
            disabled={submitting || loading}
          />
        </>
      }
    >
      <div className="space-y-4">
        <Select
          label="Supplier"
          name="supplierId"
          value={formData.supplierId}
          onChange={handleChange}
          options={supplierOptions}
          placeholder={loading ? "Loading..." : "Pilih supplier"}
          required
          disabled={loading}
        />

        <Input
          label="Total Harga"
          name="totalHarga"
          type="number"
          value={formData.totalHarga}
          onChange={handleChange}
          placeholder="0"
          required
          helpText="Minimal Rp 0.01"
        />

        <Input
          label="Tanggal Bayar"
          name="tanggalBayar"
          type="date"
          value={formData.tanggalBayar}
          onChange={handleChange}
          required
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Keterangan <span className="text-gray-400">(Opsional)</span>
          </label>
          <textarea
            name="keterangan"
            value={formData.keterangan}
            onChange={handleChange}
            rows="3"
            maxLength="500"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Catatan atau keterangan pembayaran..."
          />
          <p className="text-xs text-gray-500 mt-1">
            Maksimal 500 karakter
          </p>
        </div>

        <Input
          label="Bukti Transfer"
          name="buktiTransfer"
          type="text"
          value={formData.buktiTransfer}
          onChange={handleChange}
          placeholder="Path/URL bukti transfer (opsional)"
          helpText="Maksimal 255 karakter"
          maxLength="255"
        />

        {/* Info Box */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
          <div className="flex items-start">
            <span className="text-2xl mr-3">ℹ️</span>
            <div>
              <p className="text-sm font-semibold text-blue-800">Informasi</p>
              <p className="text-xs text-blue-700 mt-1">
                Payment akan dibuat dengan status <strong>PENDING</strong>. 
                Status dapat diubah menjadi LUNAS atau DITOLAK setelah payment dibuat.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}