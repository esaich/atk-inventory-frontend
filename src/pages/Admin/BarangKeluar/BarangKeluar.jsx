// src/pages/Admin/BarangKeluar/BarangKeluar.jsx

import { useState, useEffect, useMemo } from 'react';
import Card from '../../../components/Card';
import Table from '../../../components/Table';
import Button from '../../../components/Button';
import Badge from '../../../components/Badge';
import Loading from '../../../components/Loading';
import Alert from '../../../components/Alert';
import Select from '../../../components/Select';

import { barangKeluarAPI, barangAPI } from '../../../services/api'; 

import BarangKeluarDetailModal from './BarangKeluarDetailModal';

export default function BarangKeluar() {
    const [barangKeluarList, setBarangKeluarList] = useState([]);
    const [barangList, setBarangList] = useState([]);
    
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState({ show: false, type: '', message: '' });
    
    // Filter states
    const [filterBarang, setFilterBarang] = useState('');
    const [filterPeriod, setFilterPeriod] = useState('all'); 
    
    // Modal state
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedBarangKeluar, setSelectedBarangKeluar] = useState(null);

    useEffect(() => {
        fetchAllData();
    }, []);

    const showAlert = (type, message) => {
        setAlert({ show: true, type, message });
        setTimeout(() => setAlert({ show: false, type: '', message: '' }), 3000);
    };

    const cleanData = (response) => {
        if (Array.isArray(response)) return response;
        if (response && Array.isArray(response.data)) return response.data;
        if (response && response.$values) return response.$values;
        return [];
    };

    const fetchAllData = async () => {
        try {
            setLoading(true);

            const [barangKeluarResponse, barangResponse] = await Promise.all([
                barangKeluarAPI.getAll(),
                barangAPI.getAll()
            ]);

            let barangKeluarData = cleanData(barangKeluarResponse);
            let barangData = cleanData(barangResponse);

            // Sort by date (newest first)
            barangKeluarData.sort((a, b) => {
                const dateA = new Date(a.tanggalKeluar || a.createdAt);
                const dateB = new Date(b.tanggalKeluar || b.createdAt);
                return dateB - dateA;
            });

            setBarangList(barangData);
            setBarangKeluarList(barangKeluarData);

            // ✅ DEBUG: Lihat struktur data
            console.log('=== DEBUG BARANG KELUAR ===');
            if (barangKeluarData.length > 0) {
                console.log('Sample Data:', barangKeluarData[0]);
                console.log('PermintaanBarang:', barangKeluarData[0]?.permintaanBarang);
                console.log('User:', barangKeluarData[0]?.permintaanBarang?.user);
            }

        } catch (error) {
            console.error('Error fetching data:', error);
            showAlert('error', 'Gagal memuat data barang keluar');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDetailModal = (barangKeluar) => {
        setSelectedBarangKeluar(barangKeluar);
        setIsDetailModalOpen(true);
    };

    const handleCloseDetailModal = () => {
        setIsDetailModalOpen(false);
        setSelectedBarangKeluar(null);
    };

    // ==========================================================
    // ✅ FUNGSI UNTUK AKSES DATA NESTED
    // ==========================================================
    
    const barangLookup = useMemo(() => {
        return barangList.reduce((acc, b) => {
            const id = b.id || b.Id;
            const nama = b.namaBarang || b.NamaBarang || b.nama || b.Nama || '-';
            const kode = b.kodeBarang || b.KodeBarang || '-';
            const satuan = b.satuan || b.Satuan || '-';
            if (id) acc[id.toString()] = { nama, kode, satuan }; 
            return acc;
        }, {});
    }, [barangList]);
    
    const getBarangInfo = (barangId) => {
        return barangLookup[barangId.toString()] || { nama: '-', kode: '-', satuan: '-' };
    };
    
    // ✅ Ambil nama divisi dari PermintaanBarang.User.NamaDivisi (STRING)
    const getDivisiName = (barangKeluar) => {
        try {
            // Akses nested object
            const permintaan = barangKeluar.permintaanBarang || barangKeluar.PermintaanBarang;
            if (!permintaan) {
                console.warn('PermintaanBarang tidak ditemukan:', barangKeluar);
                return 'Tanpa Permintaan';
            }

            const user = permintaan.user || permintaan.User;
            if (!user) {
                console.warn('User tidak ditemukan di PermintaanBarang:', permintaan);
                return 'Tanpa User';
            }

            // ✅ Ambil NamaDivisi (string, bukan relasi!)
            const namaDivisi = user.namaDivisi || user.NamaDivisi;
            
            // Jika null atau kosong, berarti Admin (tidak punya divisi)
            if (!namaDivisi || namaDivisi.trim() === '') {
                return 'Admin'; // atau 'Tanpa Divisi'
            }

            return namaDivisi;

        } catch (error) {
            console.error('Error getting divisi name:', error, barangKeluar);
            return 'Error';
        }
    };

    // ✅ Ambil nama user
    const getUserName = (barangKeluar) => {
        try {
            const permintaan = barangKeluar.permintaanBarang || barangKeluar.PermintaanBarang;
            if (!permintaan) return '-';

            const user = permintaan.user || permintaan.User;
            if (!user) return '-';

            return user.nama || user.Nama || user.username || user.Username || '-';
        } catch (error) {
            console.error('Error getting user name:', error);
            return '-';
        }
    };
    // ==========================================================

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', { 
            day: '2-digit', 
            month: 'short', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getFilteredData = () => {
        let filtered = [...barangKeluarList];

        if (filterBarang) {
            filtered = filtered.filter(item => item.barangId && item.barangId.toString() === filterBarang.toString()); 
        }

        if (filterPeriod !== 'all') {
            const now = new Date();
            filtered = filtered.filter(item => {
                const itemDate = new Date(item.tanggalKeluar || item.createdAt);
                
                if (filterPeriod === 'today') {
                    return itemDate.toDateString() === now.toDateString();
                } else if (filterPeriod === 'week') {
                    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                    return itemDate >= weekAgo;
                } else if (filterPeriod === 'month') {
                    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                    return itemDate >= monthAgo;
                }
                return true;
            });
        }

        return filtered;
    };

    const filteredData = getFilteredData();

    const totalKeluar = barangKeluarList.length;
    const totalHariIni = barangKeluarList.filter(item => {
        const itemDate = new Date(item.tanggalKeluar || item.createdAt);
        const today = new Date();
        return itemDate.toDateString() === today.toDateString();
    }).length;

    const totalMingguIni = barangKeluarList.filter(item => {
        const itemDate = new Date(item.tanggalKeluar || item.createdAt);
        const weekAgo = new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000);
        return itemDate >= weekAgo;
    }).length;

    const totalItem = barangKeluarList.reduce((sum, item) => sum + (item.jumlahKeluar || 0), 0);

    const columns = [
        { 
            header: 'ID', 
            render: (row, index) => (
                <span className="font-semibold">{index + 1} .</span>
            ) ,
            width: '60px' 
        },
        { 
            header: 'Barang',
            render: (row) => {
                const info = getBarangInfo(row.barangId);
                return (
                    <div>
                        <p className="font-medium text-gray-800">{info.nama}</p>
                        <p className="text-xs text-gray-500">Kode: {info.kode}</p>
                    </div>
                );
            }
        },
        { 
            header: 'Jumlah Keluar', 
            width: '130px',
            render: (row) => {
                const info = getBarangInfo(row.barangId);
                return (
                    <span className="font-semibold text-red-600">
                        -{row.jumlahKeluar} {info.satuan}
                    </span>
                );
            }
        },
        // ✅ KOLOM DIVISI - Ambil dari User.NamaDivisi (STRING)
        { 
            header: 'Divisi',
            width: '150px',
            render: (row) => {
                const divisiName = getDivisiName(row);
                return (
                    <Badge 
                        text={divisiName} 
                        variant={
                            divisiName === 'Admin' ? 'warning' :
                            divisiName.includes('Tanpa') || divisiName.includes('Error') 
                                ? 'secondary' 
                                : 'info'
                        } 
                    />
                );
            }
        },
        // ✅ KOLOM PEMOHON
        { 
            header: 'Pemohon',
            width: '150px',
            render: (row) => (
                <p className="font-medium text-gray-700">
                    {getUserName(row)}
                </p>
            )
        },
        { 
            header: 'Permintaan ID',
            width: '120px',
            render: (row) => row.permintaanId ? (
                <Badge text={`#${row.permintaanId}`} variant="primary" />
            ) : '-'
        },
        { 
            header: 'Tanggal Keluar', 
            width: '180px',
            render: (row) => formatDate(row.tanggalKeluar || row.createdAt)
        },
        {
            header: 'Aksi',
            width: '120px',
            render: (row) => (
                <Button
                    label="Detail"
                    variant="info"
                    size="sm"
                    onClick={() => handleOpenDetailModal(row)}
                />
            ),
        },
    ];

    const barangOptions = [
        { value: '', label: 'Semua Barang' },
        ...barangList.map(b => ({
            value: (b.id || b.Id).toString(),
            label: `${b.namaBarang || b.NamaBarang} (${b.kodeBarang || b.KodeBarang})`
        }))
    ];

    const periodOptions = [
        { value: 'all', label: 'Semua Periode' },
        { value: 'today', label: 'Hari Ini' },
        { value: 'week', label: '7 Hari Terakhir' },
        { value: 'month', label: '30 Hari Terakhir' },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-xl p-6 shadow-lg">
                <h1 className="text-3xl font-bold mb-2">📤 Barang Keluar</h1>
                <p className="text-red-100">
                    Monitoring barang yang keluar dari gudang
                </p>
            </div>

            {/* Alert */}
            {alert.show && (
                <Alert type={alert.type} message={alert.message} />
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Total Transaksi</p>
                            <p className="text-3xl font-bold text-blue-700">{totalKeluar}</p>
                        </div>
                        <div className="text-5xl">📤</div>
                    </div>
                </Card>

                <Card className="bg-gradient-to-br from-green-50 to-green-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Hari Ini</p>
                            <p className="text-3xl font-bold text-green-700">{totalHariIni}</p>
                        </div>
                        <div className="text-5xl">📅</div>
                    </div>
                </Card>

                <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Minggu Ini</p>
                            <p className="text-3xl font-bold text-purple-700">{totalMingguIni}</p>
                        </div>
                        <div className="text-5xl">📊</div>
                    </div>
                </Card>

                <Card className="bg-gradient-to-br from-orange-50 to-orange-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Total Item</p>
                            <p className="text-3xl font-bold text-orange-700">{totalItem}</p>
                        </div>
                        <div className="text-5xl">📦</div>
                    </div>
                </Card>
            </div>

            {/* Filters */}
            <Card>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select
                        label="Filter Barang"
                        value={filterBarang}
                        onChange={(e) => setFilterBarang(e.target.value)}
                        options={barangOptions}
                    />
                    
                    <Select
                        label="Filter Periode"
                        value={filterPeriod}
                        onChange={(e) => setFilterPeriod(e.target.value)}
                        options={periodOptions}
                    />
                </div>

                {(filterBarang || filterPeriod !== 'all') && (
                    <div className="mt-4 flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <p className="text-sm text-blue-800">
                            Menampilkan <strong>{filteredData.length}</strong> dari <strong>{totalKeluar}</strong> transaksi
                        </p>
                        <Button
                            label="Reset Filter"
                            variant="secondary"
                            size="sm"
                            onClick={() => {
                                setFilterBarang('');
                                setFilterPeriod('all');
                            }}
                        />
                    </div>
                )}
            </Card>

            {/* Table */}
            <Card title="📋 Daftar Barang Keluar">
                {loading ? (
                    <Loading />
                ) : (
                    <Table
                        columns={columns}
                        data={filteredData}
                        loading={loading}
                        emptyMessage={
                            filterBarang || filterPeriod !== 'all'
                                ? "Tidak ada data sesuai filter"
                                : "Belum ada data barang keluar"
                        }
                    />
                )}
            </Card>

            {/* Info Panel */}
            <Card>
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg">
                    <div className="flex items-start gap-3">
                        <span className="text-2xl">ℹ️</span>
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-2">Informasi:</h3>
                            <ul className="space-y-1 text-sm text-gray-700">
                                <li>• Data barang keluar dibuat otomatis saat permintaan disetujui</li>
                                <li>• Stok barang akan otomatis berkurang sesuai jumlah keluar</li>
                                <li>• Divisi ditampilkan berdasarkan user pemohon</li>
                                <li>• Gunakan filter untuk mempermudah pencarian data</li>
                                <li>• Klik "Detail" untuk melihat informasi lengkap transaksi</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Modal Detail */}
            {selectedBarangKeluar && (
                <BarangKeluarDetailModal
                    isOpen={isDetailModalOpen}
                    onClose={handleCloseDetailModal}
                    barangKeluar={selectedBarangKeluar}
                    barangInfo={getBarangInfo(selectedBarangKeluar.barangId)}
                    divisiName={getDivisiName(selectedBarangKeluar)}
                    userName={getUserName(selectedBarangKeluar)}
                />
            )}
        </div>
    );
}