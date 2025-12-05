// src/pages/Admin/Barang/Barang.jsx

import { useState, useEffect } from 'react';
import Card from '../../../components/Card';
import Table from '../../../components/Table';
import Button from '../../../components/Button';
import Alert from '../../../components/Alert';
import Badge from '../../../components/Badge';
import Loading from '../../../components/Loading'; 
import { barangAPI } from '../../../services/api';

import BarangCreateModal from './BarangCreateModal';
import BarangEditModal from './BarangEditModal'; 

export default function Barang() {
  const [barangList, setBarangList] = useState([]);
  const [loading, setLoading] = useState(true);
     
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
     
  const [selectedBarang, setSelectedBarang] = useState(null);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });

  // ✅ PERBAIKAN: Deklarasi state error yang benar
  const [error, setError] = useState(null); 
     
  useEffect(() => {
   fetchBarang();
  }, []);

const showAlert = (type, message) => {
   setAlert({ show: true, type, message });
   setTimeout(() => setAlert({ show: false, type: '', message: '' }), 3000);
  };

const fetchBarang = async () => {
  try {
   setLoading(true);
   setError(null); // Panggilan setError sekarang valid
   const response = await barangAPI.getAll();
   console.log('Barang Response:', response); 
   
   if (Array.isArray(response)) {
   setBarangList(response);
   } else if (response && Array.isArray(response.data)) {
   setBarangList(response.data);
   } else if (response && response.$values) {
   setBarangList(response.$values);
   } else {
   setBarangList([]);
   }
  } catch (err) { // Ubah 'error' menjadi 'err' agar tidak bentrok dengan state 'error' (opsional tapi disarankan)
   console.error('Error fetching barang:', err);
   setError(err.message); // Panggilan setError sekarang valid
   showAlert('error', 'Gagal memuat data barang');
   setBarangList([]); 
  } finally {
   setLoading(false);
  }
};

  // --- Handle Modal Open/Close ---
  const handleOpenCreateModal = () => {
   setIsCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
   setIsCreateModalOpen(false);
  };

  const handleOpenEditModal = (barang) => {
   setSelectedBarang(barang);
   setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
   setIsEditModalOpen(false);
   setSelectedBarang(null);
  };

  // Fungsi ini dipanggil dari Modal Create/Edit setelah sukses CRUD
  const handleSuccess = (message) => {
   showAlert('success', message);
   fetchBarang(); // Muat ulang data
  };

  const handleDelete = async (id) => {
   console.log('Attempting to delete ID:', id); 

   if (!window.confirm('Yakin ingin menghapus barang ini?')) return;
   
   try {
   await barangAPI.delete(id);
   showAlert('success', 'Barang berhasil dihapus!');
   fetchBarang();
   } catch (error) {
   console.error('Delete error:', error);
   showAlert('error', `Gagal menghapus barang: ${error.message}`);
   }
  };

  const getStokBadge = (stok) => {
   if (stok === 0) return <Badge text="Habis" variant="danger" />;
   if (stok < 10) return <Badge text="Stok Rendah" variant="warning" />;
   return <Badge text="Tersedia" variant="success" />;
  };

  const columns = [
   { header: 'ID', field: 'id', width: '80px' }, 
   { header: 'Kode', field: 'kodeBarang', width: '100px' },
   { header: 'Nama Barang', field: 'namaBarang' },
   { 
   header: 'Stok', 
   width: '100px',
   render: (row) => (
 <span className="font-semibold">{row.stok}</span>
   )
   },
   { header: 'Satuan', field: 'satuan', width: '100px' },
   {
   header: 'Status',
   width: '150px',
   render: (row) => getStokBadge(row.stok),
   },
   {
   header: 'Aksi',
   width: '200px',
   render: (row) => (
 <div className="flex gap-2">
  <Button
  label="Edit"
  variant="info"
  size="sm"
  onClick={() => handleOpenEditModal(row)}
  />
  <Button
  label="Hapus"
  variant="danger"
  size="sm"
  onClick={() => handleDelete(row.id)}
  />
 </div>
   ),
   },
  ];

  return (
   <div className="space-y-6">
   {/* Header */}
   <Card
 title="📦 Data Barang"
 headerAction={
  <Button
  label="Tambah Barang"
  variant="success"
  size="sm"
  icon={<span>➕</span>}
  onClick={handleOpenCreateModal}
  />
 }
   >
 {alert.show && (
  <div className="mb-4">
  <Alert type={alert.type} message={alert.message} />
  </div>
 )}
 
 {loading ? (
  <Loading />
 ) : (
  <Table
  columns={columns}
  data={barangList}
  loading={loading}
  emptyMessage="Belum ada data barang"
  />
 )}
   </Card>

   {/* Modal Tambah Barang (Create) */}
   <BarangCreateModal
 isOpen={isCreateModalOpen}
 onClose={handleCloseCreateModal}
 onSuccess={handleSuccess}
 showAlert={showAlert}
   />
  
   {/* Modal Edit Barang (Edit) */}
   {selectedBarang && (
 <BarangEditModal
  isOpen={isEditModalOpen}
  onClose={handleCloseEditModal}
  barang={selectedBarang}
  onSuccess={handleSuccess}
  showAlert={showAlert}
 />
   )}
   </div>
  );
}