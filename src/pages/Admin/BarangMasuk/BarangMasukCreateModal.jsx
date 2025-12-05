// src/pages/Admin/BarangMasuk/BarangMasukCreateModal.jsx

import { useState, useEffect } from 'react';
import Modal from '../../../components/Modal';
import Input from '../../../components/Input';
import Select from '../../../components/Select';
import Button from '../../../components/Button';
import { barangMasukAPI, barangAPI, supplierAPI } from '../../../services/api';

export default function BarangMasukCreateModal({ isOpen, onClose, onSuccess, showAlert }) {
  const [formData, setFormData] = useState({
    barangId: '',
    supplierId: '',
    jumlahMasuk: 0,
    hargaSatuan: 0,
    tanggalMasuk: new Date().toISOString().split('T')[0],
  });
  const [submitting, setSubmitting] = useState(false);
  const [barangList, setBarangList] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch barang dan supplier saat modal dibuka
  useEffect(() => {
    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch barang
      const barangResponse = await barangAPI.getAll();
      let barangData = [];
      if (Array.isArray(barangResponse)) {
        barangData = barangResponse;
      } else if (barangResponse && Array.isArray(barangResponse.data)) {
        barangData = barangResponse.data;
      } else if (barangResponse && barangResponse.$values) {
        barangData = barangResponse.$values;
      }
      setBarangList(barangData);

      // Fetch suppliers
      const supplierResponse = await supplierAPI.getAll();
      let supplierData = [];
      if (Array.isArray(supplierResponse)) {
        supplierData = supplierResponse;
      } else if (supplierResponse && Array.isArray(supplierResponse.data)) {
        supplierData = supplierResponse.data;
      } else if (supplierResponse && supplierResponse.$values) {
        supplierData = supplierResponse.$values;
      }
      setSuppliers(supplierData);
      
    } catch (error) {
      console.error('Error fetching data:', error);
      showAlert('error', 'Gagal memuat data barang/supplier');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: ['barangId', 'supplierId', 'jumlahMasuk'].includes(name)
        ? parseInt(value) || 0 
        : name === 'hargaSatuan'
        ? parseFloat(value) || 0
        : value 
    }));
  };

  const resetForm = () => {
    setFormData({
      barangId: '',
      supplierId: '',
      jumlahMasuk: 0,
      hargaSatuan: 0,
      tanggalMasuk: new Date().toISOString().split('T')[0],
    });
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();

    // Validasi
    if (!formData.barangId) {
      showAlert('error', 'Barang harus dipilih!');
      return;
    }

    if (formData.jumlahMasuk <= 0) {
      showAlert('error', 'Jumlah masuk harus lebih dari 0!');
      return;
    }

    if (formData.hargaSatuan <= 0) {
      showAlert('error', 'Harga satuan harus lebih dari 0!');
      return;
    }

    setSubmitting(true);

    try {
      await barangMasukAPI.create(formData);
      onSuccess('Barang masuk berhasil ditambahkan!');
      resetForm();
      onClose();
    } catch (error) {
      console.error('Error creating barang masuk:', error);
      showAlert('error', `Gagal menyimpan barang masuk: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  // Convert data untuk Select component
  const barangOptions = barangList.map(b => ({
    value: b.id,
    label: `${b.kodeBarang} - ${b.namaBarang} (Stok: ${b.stok})`
  }));

  const supplierOptions = suppliers.map(s => ({
    value: s.id,
    label: s.namaSupplier
  }));

  // Hitung total harga
  const totalHarga = formData.jumlahMasuk * formData.hargaSatuan;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="➕ Input Barang Masuk"
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
          label="Barang"
          name="barangId"
          value={formData.barangId}
          onChange={handleChange}
          options={barangOptions}
          placeholder={loading ? "Loading..." : "Pilih barang"}
          required
          disabled={loading}
        />

        <Select
          label="Supplier"
          name="supplierId"
          value={formData.supplierId}
          onChange={handleChange}
          options={supplierOptions}
          placeholder={loading ? "Loading..." : "Pilih supplier (opsional)"}
          disabled={loading}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Jumlah Masuk"
            name="jumlahMasuk"
            type="number"
            value={formData.jumlahMasuk}
            onChange={handleChange}
            placeholder="0"
            required
          />
          <Input
            label="Harga Satuan"
            name="hargaSatuan"
            type="number"
            value={formData.hargaSatuan}
            onChange={handleChange}
            placeholder="0"
            required
          />
        </div>

        <Input
          label="Tanggal Masuk"
          name="tanggalMasuk"
          type="date"
          value={formData.tanggalMasuk}
          onChange={handleChange}
          required
        />

        {/* Total Harga */}
        {totalHarga > 0 && (
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-gray-700">Total Harga:</span>
              <span className="text-xl font-bold text-blue-600">
                {new Intl.NumberFormat('id-ID', {
                  style: 'currency',
                  currency: 'IDR',
                  minimumFractionDigits: 0
                }).format(totalHarga)}
              </span>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}