// src/pages/Login/Login.jsx
import { useState } from 'react';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Alert from '../../components/Alert';
import Card from '../../components/Card';
import { authAPI } from '../../services/api';

export default function Login({ onLogin }) {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validasi form
      if (!formData.username || !formData.password) {
        setError('Username dan password harus diisi!');
        setLoading(false);
        return;
      }

      // Call API login
      const response = await authAPI.login(formData.username, formData.password);
      
      // Simpan token dan user data
      if (response.token) {
        localStorage.setItem('token', response.token);
      }
      
      // Simpan user data
      const userData = {
        id: response.userId || response.id,
        username: response.username,
        nama: response.nama,
        role: response.role, // 'Admin' atau 'Divisi'
        namaDivisi: response.namaDivisi || null,
      };
      
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Panggil callback onLogin
      onLogin(userData);
      
    } catch (err) {
      setError(err.message || 'Login gagal! Periksa username dan password Anda.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <div className="bg-white w-20 h-20 rounded-2xl shadow-lg mx-auto mb-4 flex items-center justify-center">
            <span className="text-5xl">📦</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Sistem ATK</h1>
          <p className="text-white/90 text-lg">Pengadaan & Pengelolaan ATK</p>
        </div>

        {/* Login Card */}
        <Card className="shadow-2xl">
          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Login ke Sistem
            </h2>

            {/* Error Alert */}
            {error && (
              <div className="mb-4">
                <Alert 
                  type="error" 
                  message={error}
                  closable={true}
                  onClose={() => setError('')}
                />
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Username Input */}
              <Input
                label="Username"
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Masukkan username"
                required={true}
                disabled={loading}
                icon={<span>👤</span>}
              />

              {/* Password Input */}
              <Input
                label="Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Masukkan password"
                required={true}
                disabled={loading}
                icon={<span>🔒</span>}
              />

              {/* Submit Button */}
              <Button
                type="submit"
                label={loading ? "Loading..." : "Login"}
                variant="primary"
                fullWidth={true}
                size="lg"
                disabled={loading}
                icon={loading ? <span className="animate-spin">⏳</span> : <span>🚀</span>}
              />
            </form>

            {/* Info Text */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Gunakan akun yang telah terdaftar di sistem
              </p>
            </div>

            {/* Demo Accounts Info */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-xs text-blue-800 font-semibold mb-2">
                ℹ️ Akun Demo (untuk testing):
              </p>
              <div className="text-xs text-blue-700 space-y-1">
                <p>👨‍💼 Admin: admin / admin123</p>
                <p>👤 Divisi: divisi1 / divisi123</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-white/80 text-sm">
            © 2024 Sistem ATK. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}