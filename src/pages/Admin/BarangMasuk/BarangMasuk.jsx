// src/pages/Admin/BarangMasuk/BarangMasuk.jsx

import { useState, useEffect, useMemo } from 'react'; 
import Card from '../../../components/Card';
import Table from '../../../components/Table';
import Button from '../../../components/Button';
import Alert from '../../../components/Alert';
// import Badge from '../../../components/Badge'; 
import Loading from '../../../components/Loading';

// Import API Master (PENTING untuk lookup)
import { barangMasukAPI, barangAPI, supplierAPI } from '../../../services/api'; 

import BarangMasukCreateModal from './BarangMasukCreateModal';
import BarangMasukEditModal from './BarangMasukEditModal';
import ConfirmModal from '../../../components/ConfirmModal'; // ✅ Import ConfirmModal

export default function BarangMasuk() {
    const [barangMasukList, setBarangMasukList] = useState([]);
    // State untuk data Master
    const [barangList, setBarangList] = useState([]); 
    const [supplierList, setSupplierList] = useState([]);
    
    const [loading, setLoading] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedBarangMasuk, setSelectedBarangMasuk] = useState(null);
    const [alert, setAlert] = useState({ show: false, type: '', message: '' });
    const [, setError] = useState(null);

    // ✅ STATE BARU UNTUK KONFIRMASI DELETE
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    // ------------------------------------

    useEffect(() => {
        fetchAllData(); // Panggil fungsi yang memuat SEMUA data
    }, []);

    const showAlert = (type, message) => {
        setAlert({ show: true, type, message });
        setTimeout(() => setAlert({ show: false, type: '', message: '' }), 3000);
    };
    
    // Helper untuk membersihkan response data dari format API C# ($values)
    const cleanData = (response) => {
        if (Array.isArray(response)) return response;
        if (response && Array.isArray(response.data)) return response.data;
        if (response && response.$values) return response.$values;
        return [];
    };
    
    // Fungsi: Ambil data Transaksi dan Master
    const fetchAllData = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // 1. Ambil data secara paralel
            const [bmResponse, barangResponse, supplierResponse] = await Promise.all([
                barangMasukAPI.getAll(),
                barangAPI.getAll(), 
                supplierAPI.getAll(), 
            ]);

            setBarangList(cleanData(barangResponse));
            setSupplierList(cleanData(supplierResponse));
            setBarangMasukList(cleanData(bmResponse));

        } catch (err) {
            console.error('Error fetching data:', err);
            setError(err.message);
            showAlert('error', 'Gagal memuat data utama.');
            setBarangMasukList([]);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenCreateModal = () => { setIsCreateModalOpen(true); };
    const handleCloseCreateModal = () => { setIsCreateModalOpen(false); fetchAllData(); }; 
    const handleOpenEditModal = (barangMasuk) => { setSelectedBarangMasuk(barangMasuk); setIsEditModalOpen(true); };
    const handleCloseEditModal = () => { setIsEditModalOpen(false); setSelectedBarangMasuk(null); fetchAllData(); }; 
    const handleSuccess = (message) => { showAlert('success', message); fetchAllData(); }; 

    // ✅ FUNGSI BARU: Buka modal konfirmasi delete
    const handleDelete = (item) => {
        setItemToDelete(item);
        setIsDeleteConfirmOpen(true);
    };

    // ✅ FUNGSI BARU: Konfirmasi dan jalankan delete
    const handleConfirmDelete = async () => {
        if (!itemToDelete) return;

        // Kita biarkan loading true (dari fetchAllData) atau tambahkan state loading khusus jika perlu
        // Kita langsung jalankan API delete
        
        try {
            await barangMasukAPI.delete(itemToDelete.id); 
            showAlert('success', 'Barang masuk berhasil dihapus!');
            fetchAllData(); 
        } catch (error) {
            console.error('Delete error:', error);
            showAlert('error', `Gagal menghapus barang masuk: ${error.message}`);
        } finally {
            setIsDeleteConfirmOpen(false); // Tutup modal di akhir proses
            setItemToDelete(null);
        }
    };

    const handleCancelDelete = () => {
        setIsDeleteConfirmOpen(false);
        setItemToDelete(null);
    };
    // ------------------------------------

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount || 0);
    };

    // ==========================================================
    // LOGIKA LOOKUP BERBASIS ID (Mencari Nama)
    // ==========================================================

    const barangLookup = useMemo(() => {
        return barangList.reduce((acc, b) => {
            const id = b.id || b.Id;
            const name = b.namaBarang || b.NamaBarang || b.nama || b.Nama || 'Barang Tidak Dikenal'; 
            if (id) acc[id] = name;
            return acc;
        }, {});
    }, [barangList]);

    const supplierLookup = useMemo(() => {
        return supplierList.reduce((acc, s) => {
            const id = s.id || s.Id;
            const name = s.namaSupplier || s.NamaSupplier || s.nama || s.Nama || 'Supplier Tidak Dikenal';
            if (id) acc[id] = name;
            return acc;
        }, {});
    }, [supplierList]);
    
    // ==========================================================
    

    const columns = [
        { header: 'No.', width: '60px',  render: (row, index) => (
          <span className="font-semibold">{index + 1}. </span>
        )  },
        { 
            header: 'Nama Barang',
            render: (row) => barangLookup[row.barangId] || 'Barang Tidak Dikenal'
        },
        { 
            header: 'Jumlah Masuk', 
            width: '120px',
            render: (row) => (
                <span className="font-semibold text-green-600">
                    +{row.jumlahMasuk}
                </span>
            )
        },
        { 
            header: 'Harga Satuan', 
            width: '130px',
            render: (row) => formatCurrency(row.hargaSatuan)
        },
        { 
            header: 'Total Harga', 
            width: '130px',
            render: (row) => (
                <span className="font-semibold">
                    {formatCurrency(row.jumlahMasuk * row.hargaSatuan)}
                </span>
            )
        },
        { 
            header: 'Supplier',
            render: (row) => row.supplierId 
                ? supplierLookup[row.supplierId] || 'Supplier Tidak Dikenal'
                : 'Tanpa Supplier'
        },
        { 
            header: 'Tanggal Masuk', 
            width: '130px',
            render: (row) => formatDate(row.tanggalMasuk)
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
                        // ✅ Panggil fungsi handleDelete BARU dengan object row
                        onClick={() => handleDelete(row)} 
                    />
                </div>
            ),
        },
    ];

    // Hitung total nilai barang masuk
    const totalNilai = barangMasukList.reduce((sum, item) => {
        return sum + (item.jumlahMasuk * item.hargaSatuan);
    }, 0);

    return (
        <div className="space-y-6">
            
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-gradient-to-br from-green-50 to-green-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Total Transaksi</p>
                            <p className="text-3xl font-bold text-green-700">{barangMasukList.length}</p>
                        </div>
                        <div className="text-5xl">📥</div>
                    </div>
                </Card>

                <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Total Nilai</p>
                            <p className="text-2xl font-bold text-blue-700">{formatCurrency(totalNilai)}</p>
                        </div>
                        <div className="text-5xl">💰</div>
                    </div>
                </Card>

                <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Bulan Ini</p>
                            <p className="text-3xl font-bold text-purple-700">
                                {barangMasukList.filter(item => {
                                    const date = new Date(item.tanggalMasuk);
                                    const now = new Date();
                                    return date.getMonth() === now.getMonth() && 
                                           date.getFullYear() === now.getFullYear();
                                }).length}
                            </p>
                        </div>
                        <div className="text-5xl">📊</div>
                    </div>
                </Card>
            </div>
            
            {/* Table */}
            <Card
                title="📥 Data Barang Masuk"
                headerAction={
                    <Button
                        label="Input Barang Masuk"
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
                        data={barangMasukList}
                        loading={loading}
                        emptyMessage="Belum ada data barang masuk"
                    />
                )}
            </Card>

            {/* Modal Create */}
            <BarangMasukCreateModal
                isOpen={isCreateModalOpen}
                onClose={handleCloseCreateModal}
                onSuccess={handleSuccess}
                showAlert={showAlert}
            />

            {/* Modal Edit */}
            {selectedBarangMasuk && (
                <BarangMasukEditModal
                    isOpen={isEditModalOpen}
                    onClose={handleCloseEditModal}
                    barangMasuk={selectedBarangMasuk}
                    onSuccess={handleSuccess}
                    showAlert={showAlert}
                />
            )}

            {/* ✅ IMPLEMENTASI CONFIRM MODAL BARU */}
            <ConfirmModal
                isOpen={isDeleteConfirmOpen}
                onClose={handleCancelDelete}
                onConfirm={handleConfirmDelete}
                title="Konfirmasi Penghapusan Data"
                // Menggunakan itemToDelete untuk menampilkan nama barang yang akan dihapus
                message={`Apakah Anda yakin ingin menghapus data barang masuk untuk: ${itemToDelete ? (barangLookup[itemToDelete.barangId] || itemToDelete.id) : 'Item ini'}? Aksi ini tidak dapat dibatalkan.`}
                confirmText="Ya, Hapus Permanen"
                type="danger"
                loading={loading}
            />
        </div>
    );
}