require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
app.use(cors());
app.use(express.json());

// Konfigurasi koneksi MySQL
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'aquaponics_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Endpoint untuk mendapatkan daftar jenis ikan dari database
app.get('/api/fish-types', (req, res) => {
  pool.query('SELECT * FROM fish_types', (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: 'Gagal mengambil data dari database' });
    }
    res.json(results);
  });
});

// Endpoint untuk kalkulator aquaponik
app.post('/api/calculate', (req, res) => {
  const { length, width, height, fish_id } = req.body;

  // Validasi input
  if (!length || !width || !height || !fish_id) {
    return res.status(400).json({ error: 'Mohon lengkapi semua data' });
  }

  // Ambil data ikan dari database untuk mendapatkan kepadatan (liter per ikan)
  pool.query('SELECT * FROM fish_types WHERE id = ?', [fish_id], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: 'Gagal mengakses database' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Jenis ikan tidak ditemukan' });
    }

    const fishData = results[0];
    
    // Perbaikan Logika:
    // 1. Hitung volume dalam meter kubik (m^3)
    const volume_m3 = parseFloat(length) * parseFloat(width) * parseFloat(height);
    
    // 2. Konversi meter kubik ke Liter (1 m^3 = 1000 Liter)
    const volume_liter = volume_m3 * 1000;
    
    // 3. Hitung jumlah ikan yang direkomendasikan
    // (Berdasarkan nilai liter_per_fish dari database, misal Lele = 50 Liter/ikan)
    const liter_per_fish = fishData.liter_per_fish || 50; 
    const fish_count = Math.floor(volume_liter / liter_per_fish);
    
    // 4. Hitung jumlah tanaman (rasio: 1 ikan untuk 1.5 lubang tanam)
    const plant_count = Math.floor(fish_count * 1.5);

    // Kirim hasil perhitungan kembali ke frontend
    res.json({
      volume_liter: volume_liter,
      fish_count: fish_count,
      plant_count: plant_count,
      fish_name: fishData.name
    });
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server backend berjalan di http://localhost:${PORT}`);
});
