// src/pages/Admin/UserDivisi/UserDivisi.jsx (REVISI AKHIR)

import { useState, useEffect } from 'react';
import Card from '../../../components/Card';
import Table from '../../../components/Table';
import Button from '../../../components/Button';
import Badge from '../../../components/Badge';
import Alert from '../../../components/Alert';
import Loading from '../../../components/Loading';

// ✅ Impor ConfirmModal
import ConfirmModal from '../../../components/ConfirmModal'; 

import { userDivisiAPI } from '../../../services/api';

import UserDivisiCreateModal from './UserDivisiCreateModal';
import UserDivisiEditModal from './UserDivisiEditModal';

export default function UserDivisi() {
  const [userList, setUserList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });

  // ✅ State untuk Confirm Modal Hapus (BARU)
  const [confirmDeleteModal, setConfirmDeleteModal] = useState({
    isOpen: false,
    id: null,
    loading: false,
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
    setTimeout(() => setAlert({ show: false, type: '', message: '' }), 3000);
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
      // ❌ HILANGKAN console.log
    } catch (err) {
      // ❌ HILANGKAN console.error
      showAlert('error', 'Gagal memuat data user divisi');
      setUserList([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  const handleOpenEditModal = (user) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedUser(null);
  };

  const handleSuccess = (message) => {
    showAlert('success', message);
    fetchUsers();
  };

  // ✅ Fungsi pemicu modal konfirmasi hapus (BARU)
  const handleOpenDeleteModal = (user) => {
    setConfirmDeleteModal({
      isOpen: true,
      id: user.id,
      loading: false,
      title: 'Hapus User Divisi',
      message: `Anda yakin ingin menghapus user ${user.nama} (${user.username}) dari divisi ${user.namaDivisi}? Aksi ini tidak dapat dibatalkan.`,
      confirmText: 'Ya, Hapus',
      cancelText: 'Batal',
      type: 'danger',
    });
  };

  // ✅ Fungsi eksekusi penghapusan (MENGGANTIKAN LOGIKA handleDelete)
  const handleConfirmDelete = async () => {
    const id = confirmDeleteModal.id;
    if (!id) return;
    
    setConfirmDeleteModal(prev => ({ ...prev, loading: true }));

    try {
      await userDivisiAPI.delete(id);
      showAlert('success', 'User divisi berhasil dihapus!');
      fetchUsers();
    } catch (error) {
      // ❌ HILANGKAN console.error
      showAlert('error', `Gagal menghapus user divisi: ${error.message}`);
    } finally {
      setConfirmDeleteModal({ isOpen: false, id: null, loading: false });
    }
  };

  const columns = [
    { 
      header: 'ID', 
      field: 'id', 
      width: '60px' 
    },
    { 
      header: 'Username',
      render: (row) => (
        <div>
          <p className="font-medium text-gray-800">{row.username}</p>
          <p className="text-xs text-gray-500">Login ID</p>
        </div>
      )
    },
    { 
      header: 'Nama Lengkap',
      render: (row) => (
        <span className="font-medium">{row.nama}</span>
      )
    },
    { 
      header: 'Divisi',
      render: (row) => (
        <Badge text={row.namaDivisi} variant="info" />
      )
    },
    { 
      header: 'Status',
      width: '100px',
      render: () => (
        <Badge text="Aktif" variant="success" />
      )
    },
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
            // ✅ Ubah ini untuk memicu modal konfirmasi
            onClick={() => handleOpenDeleteModal(row)}
          />
        </div>
      ),
    },
  ];

  // Group users by division
  const usersByDivision = userList.reduce((acc, user) => {
    const divisi = user.namaDivisi || 'Tidak Ada Divisi';
    if (!acc[divisi]) {
      acc[divisi] = [];
    }
    acc[divisi].push(user);
    return acc;
  }, {});

  const totalDivisi = Object.keys(usersByDivision).length;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
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
              <p className="text-sm text-gray-600">Total Divisi</p>
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

      {/* Users by Division */}
      {!loading && userList.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(usersByDivision).map(([divisi, users]) => (
            <Card key={divisi} className="hover:shadow-lg transition">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold text-gray-800">{divisi}</h3>
                  <p className="text-sm text-gray-600">{users.length} user</p>
                </div>
                <div className="bg-blue-100 w-10 h-10 rounded-full flex items-center justify-center">
                  <span className="text-xl">🏢</span>
                </div>
              </div>
              <div className="space-y-2">
                {users.slice(0, 3).map(user => (
                  <div key={user.id} className="flex items-center gap-2 text-sm">
                    <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-xs font-bold">
                      {user.nama.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-gray-700">{user.nama}</span>
                  </div>
                ))}
                {users.length > 3 && (
                  <p className="text-xs text-gray-500 mt-2">
                    +{users.length - 3} user lainnya
                  </p>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Table */}
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
            data={userList}
            loading={loading}
            emptyMessage="Belum ada data user divisi"
          />
        )}
      </Card>

      {/* Modal Create */}
      <UserDivisiCreateModal
        isOpen={isCreateModalOpen}
        onClose={handleCloseCreateModal}
        onSuccess={handleSuccess}
        showAlert={showAlert}
      />

      {/* Modal Edit */}
      {selectedUser && (
        <UserDivisiEditModal
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          user={selectedUser}
          onSuccess={handleSuccess}
          showAlert={showAlert}
        />
      )}
      
      {/* ✅ Confirm Modal Hapus (BARU) */}
      <ConfirmModal
        isOpen={confirmDeleteModal.isOpen}
        onClose={() => setConfirmDeleteModal({ ...confirmDeleteModal, isOpen: false })}
        onConfirm={handleConfirmDelete}
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