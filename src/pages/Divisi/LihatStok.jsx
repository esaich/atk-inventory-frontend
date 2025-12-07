// src/pages/Divisi/LihatStok.jsx

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/Card';
import Table from '../../components/Table';
import Button from '../../components/Button';
import Badge from '../../components/Badge';
import Loading from '../../components/Loading';
import Input from '../../components/Input';
import { barangAPI } from '../../services/api';

export default function LihatStok() {
  const [barangList, setBarangList] = useState([]);
  const [filteredBarang, setFilteredBarang] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchBarang();
  }, []);

  useEffect(() => {
    // Filter barang based on search term
    if (searchTerm) {
      const filtered = barangList.filter(b => 
        b.namaBarang.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.kodeBarang.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredBarang(filtered);
    } else {
      setFilteredBarang(barangList);
    }
  }, [searchTerm, barangList]);

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
      setFilteredBarang(barangData);
    } catch (error) {
      console.error('Error fetching barang:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get stock status badge
  const getStockBadge = (stok) => {
    if (stok === 0) return <Badge text="Habis" variant="danger" />;
    if (stok < 10) return <Badge text="Stok Rendah" variant="warning" />;
    return <Badge text="Tersedia" variant="success" />;
  };

  // Calculate stats
  const stats = {
    total: barangList.length,
    tersedia: barangList.filter(b => b.stok >= 10).length,
    rendah: barangList.filter(b => b.stok > 0 && b.stok < 10).length,
    habis: barangList.filter(b => b.stok === 0).length,
  };

  const columns = [
    { header: 'Kode', field: 'kodeBarang', width: '100px' },
    { 
      header: 'Nama Barang', 
      field: 'namaBarang',
      render: (row) => (
        <div>
          <p className="font-medium">{row.namaBarang}</p>
          <p className="text-xs text-gray-500">Kode: {row.kodeBarang}</p>
        </div>
      )
    },
    { 
      header: 'Stok', 
      width: '120px',
      render: (row) => (
        <div className="text-center">
          <p className="text-2xl font-bold text-blue-600">{row.stok}</p>
          <p className="text-xs text-gray-500">{row.satuan}</p>
        </div>
      )
    },
    { 
      header: 'Satuan', 
      field: 'satuan', 
      width: '100px' 
    },
    { 
      header: 'Status', 
      width: '150px',
      render: (row) => getStockBadge(row.stok)
    },
    {
      header: 'Aksi',
      width: '150px',
      render: (row) => (
        <Link to="/divisi/permintaan/create" state={{ selectedBarangId: row.id }}>
          <Button
            label="Minta Barang"
            variant="primary"
            size="sm"
            disabled={row.stok === 0}
          />
        </Link>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-xl p-6 shadow-lg">
        <h1 className="text-3xl font-bold mb-2">📊 Stok Barang</h1>
        <p className="text-green-100">
          Cek ketersediaan barang di gudang
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Barang</p>
              <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
            </div>
            <div className="text-5xl">📦</div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Tersedia</p>
              <p className="text-3xl font-bold text-green-600">{stats.tersedia}</p>
            </div>
            <div className="text-5xl">✅</div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Stok Rendah</p>
              <p className="text-3xl font-bold text-yellow-600">{stats.rendah}</p>
            </div>
            <div className="text-5xl">⚠️</div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Habis</p>
              <p className="text-3xl font-bold text-red-600">{stats.habis}</p>
            </div>
            <div className="text-5xl">❌</div>
          </div>
        </Card>
      </div>

      {/* Search & Table */}
      <Card title="📦 Daftar Barang">
        <div className="mb-4">
          <Input
            placeholder="Cari berdasarkan nama atau kode barang..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            }
          />
        </div>

        {loading ? (
          <Loading />
        ) : (
          <Table
            columns={columns}
            data={filteredBarang}
            emptyMessage="Tidak ada barang ditemukan"
          />
        )}
      </Card>

      {/* Info Panel */}
      <Card>
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg">
          <div className="flex items-start gap-3">
            <span className="text-2xl">💡</span>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Keterangan Status Stok:</h3>
              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex items-center gap-2">
                  <Badge text="Tersedia" variant="success" size="sm" />
                  <span>Stok ≥ 10 unit, siap untuk diminta</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge text="Stok Rendah" variant="warning" size="sm" />
                  <span>Stok 1-9 unit, segera lakukan pengadaan</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge text="Habis" variant="danger" size="sm" />
                  <span>Stok 0, tidak dapat diminta</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}