// src/pages/Admin/UserDivisi/UserDivisi.jsx (FINAL DENGAN CRUD DIVISI DIHAMPARKAN)

import { useState, useEffect } from 'react';
import Card from '../../../components/Card';
import Table from '../../../components/Table';
import Button from '../../../components/Button';
import Badge from '../../../components/Badge';
import Alert from '../../../components/Alert';
import Loading from '../../../components/Loading';
import ConfirmModal from '../../../components/ConfirmModal'; 

import { userDivisiAPI, divisiAPI } from '../../../services/api';

import UserDivisiCreateModal from './UserDivisiCreateModal';
import UserDivisiEditModal from './UserDivisiEditModal';
// Pastikan path ini benar, jika DivisiCreateModal berada di folder Divisi
import DivisiCreateModal from '../Divisi/DivisiCreateModal'; 
import DivisiEditModal from '../Divisi/DivisiEditModal'; 

export default function UserDivisi() {
    // --- STATE MANAGEMENT ---
    const [userList, setUserList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [divisiList, setDivisiList] = useState([]);
    const [alert, setAlert] = useState({ show: false, type: '', message: '' });

    // State Modal User
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    // State Modal Divisi
    const [isDivisiCreateModalOpen, setIsDivisiCreateModalOpen] = useState(false); 
    const [isDivisiEditModalOpen, setIsDivisiEditModalOpen] = useState(false); // ✅ BARU: State Edit Divisi
    const [selectedDivisi, setSelectedDivisi] = useState(null); // ✅ BARU: Data Divisi yang dipilih

    // State untuk Confirm Modal, digunakan untuk Hapus User dan Hapus Divisi
    const [confirmDeleteModal, setConfirmDeleteModal] = useState({
        isOpen: false,
        id: null,
        loading: false,
        title: '',
        message: '',
        confirmText: '',
        cancelText: 'Batal',
        type: 'danger',
        actionType: null, // ✅ BARU: 'user' atau 'divisi'
        extraData: null, // ✅ BARU: Menyimpan data tambahan (e.g., nama divisi)
    });

    // --- EFFECT & UTILS ---
    useEffect(() => {
        fetchUsers();
        fetchDivisi();
    }, []);

    const showAlert = (type, message) => {
        setAlert({ show: true, type, message });
        setTimeout(() => setAlert({ show: false, type: '', message: '' }), 3000);
    };

    // Fungsi fetchDivisi dan fetchUsers (Tidak berubah)
    const fetchDivisi = async () => { 
        try {
            const response = await divisiAPI.getAll();
            let data = [];
            if (Array.isArray(response)) {
                data = response;
            } else if (response && response.$values) {
                data = response.$values;
            }
            setDivisiList(data);
        } catch (err) {
            console.error('Fetch Divisi Error:', err); 
            showAlert('error', 'Gagal memuat daftar divisi.');
        }
    };

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await userDivisiAPI.getAll();

            let userData = [];
            if (Array.isArray(response)) {
                userData = response;
            } else if (response && Array.isArray(response.data)) {
                userData = response.data;
            } else if (response && response.$values) {
                userData = response.$values;
            }

            setUserList(userData);
        } catch {
            showAlert('error', 'Gagal memuat data user divisi');
            setUserList([]);
        } finally {
            setLoading(false);
        }
    };
    
    // --- HANDLERS USER ---
    const handleOpenCreateModal = () => { setIsCreateModalOpen(true); };
    const handleCloseCreateModal = () => { setIsCreateModalOpen(false); };
    const handleOpenEditModal = (user) => { setSelectedUser(user); setIsEditModalOpen(true); };
    const handleCloseEditModal = () => { setIsEditModalOpen(false); setSelectedUser(null); };

    const handleSuccess = (message) => {
        showAlert('success', message);
        fetchUsers();
    };

    // --- HANDLERS DIVISI ---
    const handleOpenDivisiCreateModal = () => {
        setIsDivisiCreateModalOpen(true);
    };

    const handleCloseDivisiCreateModal = () => {
        setIsDivisiCreateModalOpen(false);
    };
    
    const handleDivisiSuccess = (message) => {
        showAlert('success', message);
        fetchDivisi(); // Muat ulang daftar divisi setelah sukses dibuat
    };

    // ✅ BARU: Handler Buka Modal Edit Divisi
    const handleOpenDivisiEditModal = (divisi) => {
        setSelectedDivisi(divisi);
        setIsDivisiEditModalOpen(true);
    };

    // ✅ BARU: Handler Tutup Modal Edit Divisi
    const handleCloseDivisiEditModal = () => {
        setIsDivisiEditModalOpen(false);
        setSelectedDivisi(null);
    };


    // --- HANDLERS CONFIRM DELETE (Digunakan untuk User dan Divisi) ---

    // Handler Buka Modal Hapus User
    const handleOpenDeleteModal = (user) => {
        setConfirmDeleteModal({
            isOpen: true,
            id: user.id,
            loading: false,
            title: 'Hapus User Divisi',
            message: `Anda yakin ingin menghapus user ${user.nama} (${user.username}) dari divisi ${user.namaDivisi}? Aksi ini tidak dapat dibatalkan.`,
            confirmText: 'Ya, Hapus User',
            actionType: 'user', // Menandakan aksi adalah untuk User
            extraData: { nama: user.nama },
            type: 'danger',
            cancelText: 'Batal',
        });
    };

    // ✅ BARU: Handler Buka Modal Hapus Divisi
    const handleOpenDivisiDeleteModal = (divisi) => {
        setConfirmDeleteModal({
            isOpen: true,
            id: divisi.id,
            loading: false,
            title: 'Hapus Divisi',
            message: `Anda yakin ingin menghapus divisi "${divisi.nama}"? Semua user yang terasosiasi mungkin perlu diperbarui. Aksi ini tidak dapat dibatalkan.`,
            confirmText: 'Ya, Hapus Divisi',
            actionType: 'divisi', // Menandakan aksi adalah untuk Divisi
            extraData: { nama: divisi.nama },
            type: 'danger',
            cancelText: 'Batal',
        });
    };

    // Handler Utama untuk Konfirmasi Hapus
    const handleConfirmDelete = async () => {
        const { id, actionType, extraData } = confirmDeleteModal;
        if (!id || !actionType) return;
        
        setConfirmDeleteModal(prev => ({ ...prev, loading: true }));

        try {
            if (actionType === 'user') {
                await userDivisiAPI.delete(id);
                showAlert('success', 'User divisi berhasil dihapus!');
                fetchUsers();
            } else if (actionType === 'divisi') {
                await divisiAPI.delete(id);
                showAlert('success', `Divisi "${extraData.nama}" berhasil dihapus!`);
                fetchDivisi(); // Muat ulang daftar divisi
                fetchUsers(); // Mungkin perlu memuat ulang user jika status divisi terpengaruh
            }
        } catch (error) {
            showAlert('error', `Gagal menghapus ${actionType}: ${error.response?.data?.message || error.message}`);
        } finally {
            setConfirmDeleteModal({ 
                isOpen: false, 
                id: null, 
                loading: false, 
                title: '', 
                message: '', 
                confirmText: '', 
                actionType: null,
                extraData: null,
                type: 'danger',
                cancelText: 'Batal',
            });
        }
    };

    // --- KOLOM TABEL ---
    
    // ✅ BARU: Kolom untuk Tabel Daftar Divisi
    const divisiColumns = [
        { header: 'ID', field: 'id', width: '60px' },
        { header: 'Nama Divisi', field: 'nama' },
        { 
            header: 'Jml. User', 
            width: '120px',
            render: (row) => {
                // Hitung jumlah user yang memiliki namaDivisi yang sama
                const count = userList.filter(user => user.namaDivisi === row.nama).length;
                return <Badge text={`${count} User`} variant={count > 0 ? 'primary' : 'secondary'} />;
            } 
        },
        {
            header: 'Aksi',
            width: '180px',
            render: (row) => (
                <div className="flex gap-2">
                    <Button
                        label="Edit"
                        variant="warning"
                        size="sm"
                        onClick={() => handleOpenDivisiEditModal(row)}
                    />
                    <Button
                        label="Hapus"
                        variant="danger"
                        size="sm"
                        onClick={() => handleOpenDivisiDeleteModal(row)} // Panggil handler Hapus Divisi
                    />
                </div>
            ),
        },
    ];

    // Kolom untuk Tabel User Divisi (Tidak berubah)
    const columns = [
        { header: 'ID', width: '60px', render: (row, index) =>(
      <span className="font-semibold">{index + 1}. </span>
    ) },
        { 
            header: 'Username',
            render: (row) => (
                <div>
                    <p className="font-medium text-gray-800">{row.username}</p>
                    <p className="text-xs text-gray-500">Login ID</p>
                </div>
            )
        },
        { header: 'Nama Lengkap', render: (row) => (<span className="font-medium">{row.nama}</span>) },
        { header: 'Divisi', render: (row) => (<Badge text={row.namaDivisi} variant="info" />) },
        { header: 'Status', width: '100px', render: () => (<Badge text="Aktif" variant="success" />) },
        {
            header: 'Aksi',
            width: '200px',
            render: (row) => (
                <div className="flex gap-2">
                    <Button
                        label="Edit"
                        variant="warning"
                        size="sm"
                        onClick={() => handleOpenEditModal(row)}
                    />
                    <Button
                        label="Hapus"
                        variant="danger"
                        size="sm"
                        onClick={() => handleOpenDeleteModal(row)}
                    />
                </div>
            ),
        },
    ];

    const totalDivisi = divisiList.length; 

    return (
        <div className="space-y-6">
            {/* ALERT BOX */}
            {alert.show && (
                <Alert type={alert.type} message={alert.message} />
            )}

            {/* SUMMARY CARDS (Tidak Berubah) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Total User Divisi</p>
                            <p className="text-3xl font-bold text-blue-700">{userList.length}</p>
                        </div>
                        <div className="text-5xl">👥</div>
                    </div>
                </Card>

                <Card className="bg-gradient-to-br from-green-50 to-green-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Total Divisi Terdaftar</p>
                            <p className="text-3xl font-bold text-green-700">{totalDivisi}</p>
                        </div>
                        <div className="text-5xl">🏢</div>
                    </div>
                </Card>

                <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">User Aktif</p>
                            <p className="text-3xl font-bold text-purple-700">{userList.length}</p>
                        </div>
                        <div className="text-5xl">✅</div>
                    </div>
                </Card>
            </div>
            
            {/* DAFTAR DIVISI (MENGGUNAKAN TABLE UNTUK Aksi EDIT/HAPUS) */}
            <Card
                title={`📋 Daftar Divisi (${totalDivisi})`}
                className="col-span-3"
                headerAction={
                    <Button
                        label="Buat Divisi Baru"
                        variant="info"
                        size="sm"
                        icon={<span>➕🏢</span>}
                        onClick={handleOpenDivisiCreateModal}
                    />
                }
            >
                {loading ? (
                    <Loading />
                ) : (
                    <Table
                        columns={divisiColumns} // ✅ Menggunakan kolom Divisi
                        data={divisiList} // ✅ Menggunakan data Divisi
                        loading={loading}
                        emptyMessage="Belum ada divisi yang terdaftar. Silakan buat divisi baru."
                        compact // Asumsi komponen Table mendukung prop compact
                    />
                )}
            </Card>

            {/* TABLE USER DIVISI (Tidak Berubah) */}
            <Card
                title="👥 Data User Divisi"
                headerAction={
                    <Button
                        label="Tambah User Divisi"
                        variant="success"
                        size="sm"
                        icon={<span>➕</span>}
                        onClick={handleOpenCreateModal}
                    />
                }
            >
                {loading ? (
                    <Loading />
                ) : (
                    <Table
                        columns={columns}
                        data={userList}
                        loading={loading}
                        emptyMessage="Belum ada data user divisi"
                    />
                )}
            </Card>

            {/* --- MODALS --- */}
            
            {/* Modal Create Divisi */}
            <DivisiCreateModal
                isOpen={isDivisiCreateModalOpen}
                onClose={handleCloseDivisiCreateModal}
                onSuccess={handleDivisiSuccess} 
                showAlert={showAlert}
            />
            
            {/* ✅ Modal Edit Divisi (Perlu DivisiEditModal.jsx terpisah) */}
            {selectedDivisi && (
                <DivisiEditModal
                    isOpen={isDivisiEditModalOpen}
                    onClose={handleCloseDivisiEditModal}
                    divisi={selectedDivisi}
                    onSuccess={handleDivisiSuccess} 
                    showAlert={showAlert}
                />
            )}
            
            {/* Modal Create User (Tidak Berubah) */}
            <UserDivisiCreateModal
                isOpen={isCreateModalOpen}
                onClose={handleCloseCreateModal}
                onSuccess={handleSuccess}
                showAlert={showAlert}
                divisiList={divisiList} 
            />

            {/* Modal Edit User (Tidak Berubah) */}
            {selectedUser && (
                <UserDivisiEditModal
                    isOpen={isEditModalOpen}
                    onClose={handleCloseEditModal}
                    user={selectedUser}
                    onSuccess={handleSuccess}
                    showAlert={showAlert}
                    divisiList={divisiList} 
                />
            )}
            
            {/* Confirm Modal Hapus (Digunakan untuk Hapus User dan Hapus Divisi) */}
            <ConfirmModal
                isOpen={confirmDeleteModal.isOpen}
                onClose={() => setConfirmDeleteModal({ ...confirmDeleteModal, isOpen: false })}
                onConfirm={handleConfirmDelete} // Handler tunggal yang menangani kedua tipe aksi
                title={confirmDeleteModal.title}
                message={confirmDeleteModal.message}
                confirmText={confirmDeleteModal.confirmText}
                cancelText={confirmDeleteModal.cancelText}
                type={confirmDeleteModal.type}
                loading={confirmDeleteModal.loading}
            />
        </div>
    );
}