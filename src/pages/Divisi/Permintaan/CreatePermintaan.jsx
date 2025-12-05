// src/pages/Divisi/Permintaan/CreatePermintaan.jsx

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../../components/Card';
import Input from '../../../components/Input';
import Select from '../../../components/Select';
import Button from '../../../components/Button';
import Alert from '../../../components/Alert';
import Loading from '../../../components/Loading';
import { permintaanBarangAPI, barangAPI } from '../../../services/api';

export default function CreatePermintaan({ user }) {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    barangId: '',
    jumlahDiminta: 0,
    alasan: '',
  });
  
  const [barangList, setBarangList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });
  const [selectedBarang, setSelectedBarang] = useState(null);

  useEffect(() => {
    fetchBarang();
  }, []);

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
    setTimeout(() => setAlert({ show: false, type: '', message: '' }), 5000);
  };

  const fetchBarang = async () => {
    try {
      setLoading(true);
      const response = await barangAPI.getAll();
      
      let barangData = [];
      if (Array.isArray(response)) {
        barangData = response;
      } else if (response && Array.isArray(response.data)) {
        barangData = response.data;
      } else if (response && response.$values) {
        barangData = response.$values;
      }
      
      setBarangList(barangData);
    } catch (error) {
      console.error('Error fetching barang:', error);
      showAlert('error', 'Gagal memuat data barang');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Jika barangId berubah, update selectedBarang
    if (name === 'barangId') {
      const barang = barangList.find(b => b.id === parseInt(value));
      setSelectedBarang(barang || null);
    }
    
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'jumlahDiminta' || name === 'barangId'
        ? parseInt(value) || 0 
        : value 
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasi
    if (!formData.barangId) {
      showAlert('error', 'Barang harus dipilih!');
      return;
    }

    if (formData.jumlahDiminta <= 0) {
      showAlert('error', 'Jumlah harus lebih dari 0!');
      return;
    }

    if (!formData.alasan.trim()) {
      showAlert('error', 'Alasan harus diisi!');
      return;
    }

    // Validasi stok
    if (selectedBarang && formData.jumlahDiminta > selectedBarang.stok) {
      showAlert('error', `Stok tidak cukup! Tersedia: ${selectedBarang.stok} ${selectedBarang.satuan}`);
      return;
    }

    setSubmitting(true);

    try {
      await permintaanBarangAPI.create(formData);
      showAlert('success', 'Permintaan berhasil diajukan!');
      
      // Redirect ke status permintaan setelah 2 detik
      setTimeout(() => {
        navigate('/divisi/permintaan/status');
      }, 2000);
    } catch (error) {
      console.error('Error creating permintaan:', error);
      showAlert('error', `Gagal mengajukan permintaan: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      barangId: '',
      jumlahDiminta: 0,
      alasan: '',
    });
    setSelectedBarang(null);
  };

  // Convert barang untuk Select component
  const barangOptions = barangList.map(b => ({
    value: b.id,
    label: `${b.namaBarang} (Stok: ${b.stok} ${b.satuan})`
  }));

  if (loading) {
    return <Loading message="Memuat data barang..." />;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl p-6 shadow-lg">
        <h1 className="text-3xl font-bold mb-2">📝 Buat Permintaan Barang</h1>
        <p className="text-blue-100">
          Ajukan permintaan barang untuk divisi {user?.namaDivisi}
        </p>
      </div>

      {/* Alert */}
      {alert.show && (
        <Alert type={alert.type} message={alert.message} closable onClose={() => setAlert({ ...alert, show: false })} />
      )}

      {/* Form */}
      <Card title="Formulir Permintaan">
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Pilih Barang */}
          <Select
            label="Barang"
            name="barangId"
            value={formData.barangId}
            onChange={handleChange}
            options={barangOptions}
            placeholder="Pilih barang yang diminta"
            required
          />

          {/* Info Barang Terpilih */}
          {selectedBarang && (
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">Informasi Barang:</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-gray-600">Kode Barang:</p>
                  <p className="font-semibold text-gray-800">{selectedBarang.kodeBarang}</p>
                </div>
                <div>
                  <p className="text-gray-600">Nama Barang:</p>
                  <p className="font-semibold text-gray-800">{selectedBarang.namaBarang}</p>
                </div>
                <div>
                  <p className="text-gray-600">Stok Tersedia:</p>
                  <p className="font-semibold text-green-600">
                    {selectedBarang.stok} {selectedBarang.satuan}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Satuan:</p>
                  <p className="font-semibold text-gray-800">{selectedBarang.satuan}</p>
                </div>
              </div>
            </div>
          )}

          {/* Jumlah Diminta */}
          <Input
            label="Jumlah Diminta"
            name="jumlahDiminta"
            type="number"
            value={formData.jumlahDiminta}
            onChange={handleChange}
            placeholder="Masukkan jumlah"
            required
            helperText={selectedBarang ? `Maksimal: ${selectedBarang.stok} ${selectedBarang.satuan}` : ''}
          />

          {/* Alasan */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Alasan <span className="text-red-500">*</span>
            </label>
            <textarea
              name="alasan"
              value={formData.alasan}
              onChange={handleChange}
              placeholder="Jelaskan alasan permintaan barang ini..."
              className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              rows="4"
              required
            />
            <p className="mt-1 text-sm text-gray-500">
              Berikan alasan yang jelas dan detail untuk mempercepat persetujuan
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              label="Reset"
              variant="secondary"
              onClick={resetForm}
              disabled={submitting}
            />
            <Button
              type="submit"
              label={submitting ? 'Mengajukan...' : 'Ajukan Permintaan'}
              variant="primary"
              disabled={submitting}
              fullWidth
            />
          </div>
        </form>
      </Card>

      {/* Info Panel */}
      <Card>
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg">
          <div className="flex items-start gap-3">
            <span className="text-2xl">💡</span>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Tips Pengajuan Permintaan:</h3>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>• Pastikan barang yang diminta tersedia (cek stok)</li>
                <li>• Berikan alasan yang jelas dan spesifik</li>
                <li>• Permintaan akan diproses maksimal 2x24 jam</li>
                <li>• Status permintaan dapat dicek di menu "Status Permintaan"</li>
              </ul>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}