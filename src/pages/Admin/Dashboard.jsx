import { useState, useEffect } from 'react';
import Card from '../../components/Card';
import Loading from '../../components/Loading';
import Badge from '../../components/Badge';
import { dashboardAPI } from '../../services/api';

export default function Dashboard({ user }) {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await dashboardAPI.getData();
      setDashboardData(response);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading message="Memuat dashboard..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl p-6 shadow-lg">
        <h1 className="text-3xl font-bold mb-2">Dashboard Admin</h1>
        <p className="text-blue-100">Selamat datang, {user?.nama}!</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Total Barang */}
        <Card className="hover:shadow-xl transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-semibold">Total Barang</p>
              <h3 className="text-3xl font-bold text-blue-600 mt-2">
                {dashboardData?.totalBarang || 0}
              </h3>
            </div>
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center">
              <span className="text-3xl">📦</span>
            </div>
          </div>
        </Card>

        {/* Total Supplier */}
        <Card className="hover:shadow-xl transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-semibold">Total Supplier</p>
              <h3 className="text-3xl font-bold text-green-600 mt-2">
                {dashboardData?.totalSupplier || 0}
              </h3>
            </div>
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center">
              <span className="text-3xl">🏢</span>
            </div>
          </div>
        </Card>

        {/* Barang Masuk (Bulan Ini) */}
        <Card className="hover:shadow-xl transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-semibold">Barang Masuk</p>
              <h3 className="text-3xl font-bold text-purple-600 mt-2">
                {dashboardData?.barangMasukBulanIni || 0}
              </h3>
              <p className="text-xs text-gray-500 mt-1">Bulan ini</p>
            </div>
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center">
              <span className="text-3xl">📥</span>
            </div>
          </div>
        </Card>

        {/* Permintaan Pending */}
        <Card className="hover:shadow-xl transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-semibold">Permintaan Pending</p>
              <h3 className="text-3xl font-bold text-orange-600 mt-2">
                {dashboardData?.permintaanPending || 0}
              </h3>
            </div>
            <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center">
              <span className="text-3xl">⏳</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Barang Stok Rendah */}
        <Card title="⚠️ Barang Stok Rendah" className="h-full">
          <div className="space-y-3">
            {dashboardData?.barangStokRendah?.length > 0 ? (
              dashboardData.barangStokRendah.slice(0, 5).map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                  <div>
                    <p className="font-semibold text-gray-800">{item.namaBarang}</p>
                    <p className="text-sm text-gray-600">{item.kodeBarang}</p>
                  </div>
                  <Badge text={`Stok: ${item.stok}`} variant="danger" />
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">Semua barang stok aman</p>
            )}
          </div>
        </Card>

        {/* Aktivitas Terbaru */}
        <Card title="🕒 Aktivitas Terbaru" className="h-full">
          <div className="space-y-3">
            {dashboardData?.aktivitasTerbaru?.length > 0 ? (
              dashboardData.aktivitasTerbaru.slice(0, 5).map((item, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="bg-blue-100 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
                    <span>{item.icon || '📌'}</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{item.aktivitas}</p>
                    <p className="text-sm text-gray-600">{item.tanggal}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">Belum ada aktivitas</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
