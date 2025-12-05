// src/pages/Admin/Barang/BarangCreateModal.jsx

import { useState } from 'react';
import Modal from '../../../components/Modal';
import Input from '../../../components/Input';
import Button from '../../../components/Button';
import { barangAPI } from '../../../services/api';

export default function BarangCreateModal({ isOpen, onClose, onSuccess, showAlert }) {
            const [formData, setFormData] = useState({
         kodeBarang: '',
         namaBarang: '',
         stok: 0,
         satuan: '',
            });
            const [submitting, setSubmitting] = useState(false);

            const handleChange = (e) => {
         const { name, value } = e.target;
         setFormData(prev => ({ 
                ...prev, 
                [name]: name === 'stok' ? parseInt(value) || 0 : value 
         }));
            };

            const resetForm = () => {
         setFormData({
                kodeBarang: '',
                namaBarang: '',
                stok: 0,
                satuan: '',
         });
            };

            const handleSubmit = async (e) => {
         // Ketika dipanggil via onClick, 'e' mungkin event mouse/button, 
         // tapi preventDefault tetap aman jika form disubmit secara tradisional.
        // Karena kita menggunakan onClick pada tombol di luar form, preventDefault tidak diperlukan 
        // namun kita biarkan saja.
         if (e && e.preventDefault) e.preventDefault(); 

         setSubmitting(true);

         try {
                await barangAPI.createBulk([formData]); 
                onSuccess('Barang berhasil ditambahkan!');
                resetForm();
                onClose();
         } catch (error) {
                console.error('Error creating barang:', error);
                showAlert('error', `Gagal menyimpan barang: ${error.message}`);
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
                title="➕ Tambah Barang Baru"
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
                                // ✅ PERBAIKAN: Gunakan onClick untuk memicu fungsi langsung
                                onClick={handleSubmit}
                                label={submitting ? 'Menyimpan...' : 'Simpan'}
                                variant="primary"
                                disabled={submitting}
                    />
                     </>
                }
         >
                {/* 🛑 Hapus ID form (opsional, tapi disarankan jika tombol tidak lagi menggunakannya) */}
                <form onSubmit={handleSubmit} className="space-y-4">
                     <Input
                    label="Kode Barang"
                    name="kodeBarang"
                    value={formData.kodeBarang}
                    onChange={handleChange}
                    placeholder="Contoh: BRG001"
                    required
                     />
                     <Input
                    label="Nama Barang"
                    name="namaBarang"
                    value={formData.namaBarang}
                    onChange={handleChange}
                    placeholder="Masukkan nama barang"
                    required
                     />
                     <Input
                    label="Stok"
                    name="stok"
                    type="number"
                    value={formData.stok}
                    onChange={handleChange}
                    placeholder="0"
                    required
                     />
                     <Input
                    label="Satuan"
                    name="satuan"
                    value={formData.satuan}
                    onChange={handleChange}
                    placeholder="Contoh: Pcs, Box, Pack"
                    required
                     />
                </form>
         </Modal>
            );
}