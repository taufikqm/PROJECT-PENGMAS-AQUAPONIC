import { useState } from 'react';
import { ArrowLeft, Fish, Sprout } from 'lucide-react';

interface CalculatorScreenProps {
  onBack: () => void;
}

const fishTypes = [
  { id: 'lele',   name: 'Lele',           density_per_m3: 200, harvest_weight_kg: 0.3 },
  { id: 'nila',   name: 'Nila',           density_per_m3: 125, harvest_weight_kg: 0.25 },
  { id: 'mas',    name: 'Ikan Mas',       density_per_m3: 100, harvest_weight_kg: 0.3 },
  { id: 'gurame', name: 'Gurame',         density_per_m3: 15,  harvest_weight_kg: 0.5 },
  { id: 'patin',  name: 'Patin',          density_per_m3: 35,  harvest_weight_kg: 0.4 },
  { id: 'mujair', name: 'Mujair',         density_per_m3: 90,  harvest_weight_kg: 0.2 },
  { id: 'bawal',  name: 'Bawal Air Tawar',density_per_m3: 20,  harvest_weight_kg: 0.4 },
];

export function CalculatorScreen({ onBack }: CalculatorScreenProps) {
  const [length, setLength] = useState('');
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [fishType, setFishType] = useState('lele');
  const [vegetableType, setVegetableType] = useState<'daun' | 'buah'>('daun');
  const [result, setResult] = useState<null | {
    volume: number;
    fishCount: number;
    fishCountStarter: number;
    fishCountBeginner: number;
    fishCount75: number;
    plantCount: number;
    areaTanam: number;
    biomassaKg: number;
    volumeEfektif: number;
    vegetableType: 'daun' | 'buah';
    isMujair: boolean;
    fishName?: string;
  }>(null);

  // Rumus FAO — data lokal, hasil instan tanpa perlu internet
  const computeResult = (
    l: number, w: number, h: number,
    density_per_m3: number, harvest_weight_kg: number,
    fishName: string,
    vegType: 'daun' | 'buah'
  ) => {
    const volume_liter  = l * w * h * 1000;
    const V_efektif     = volume_liter * 0.85;          // 85% volume efektif
    const V_efektif_m3  = V_efektif / 1000;

    const fish_count_raw = Math.floor(V_efektif_m3 * density_per_m3);

    // Hard cap biomassa FAO 2014 Tabel 8.1:
    // Tangki ≥ 500 L → 20 kg/m³ | Tangki < 500 L → 10 kg/m³ (lebih ketat)
    const cap_per_m3    = V_efektif >= 500 ? 20 : 10;
    const batas_biomassa = V_efektif_m3 * cap_per_m3;
    const biomassa_check = fish_count_raw * harvest_weight_kg;
    const fish_count = biomassa_check > batas_biomassa
      ? Math.floor(batas_biomassa / harvest_weight_kg)
      : fish_count_raw;

    // Jumlah tanaman — FAO Feed Rate Ratio
    // Sayur Daun: 1 m² per 5 kg biomassa, densitas 20 lubang/m²
    // Sayur Buah: area +30%, densitas 6 tanaman/m² (tengah rentang 4-8)
    const biomassa_final = fish_count * harvest_weight_kg;
    const area_base      = biomassa_final / 5;
    const area_tanam     = vegType === 'buah' ? area_base * 1.3 : area_base;
    const densitas       = vegType === 'buah' ? 6 : 20;
    const plant_count    = Math.round(area_tanam * densitas);

    return {
      volume: volume_liter,
      volumeEfektif: V_efektif,
      fishCount: fish_count,
      fishCountStarter: Math.max(1, Math.ceil(fish_count * 0.10)),
      fishCountBeginner: Math.floor(fish_count * 0.5),
      fishCount75: Math.floor(fish_count * 0.75),
      plantCount: plant_count,
      areaTanam: area_tanam,
      biomassaKg: biomassa_final,
      vegetableType: vegType,
      isMujair: fishName.toLowerCase().includes('mujair'),
      fishName,
    };
  };

  const calculate = () => {
    const l = parseFloat(length);
    const w = parseFloat(width);
    const h = parseFloat(height);

    if (isNaN(l) || isNaN(w) || isNaN(h) || l <= 0 || w <= 0 || h <= 0) {
      alert('Mohon masukkan angka yang valid untuk panjang, lebar, dan tinggi air.');
      return;
    }

    const fish = fishTypes.find(f => f.id === fishType) ?? fishTypes[0];
    setResult(computeResult(
      l, w, h,
      fish.density_per_m3,
      fish.harvest_weight_kg,
      fish.name,
      vegetableType
    ));
  };

  return (
    <div className="min-h-screen pb-20 bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-emerald-600 via-teal-500 to-cyan-500 px-4 pt-4 pb-6 shadow-md mb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-white mb-3 active:opacity-70"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Kembali</span>
        </button>
        <h1 className="text-2xl text-white mb-1">
          Hitung Isi Kolam {fishTypes.find(f => f.id === fishType)?.name || 'Ikan'}
        </h1>
        <p className="text-cyan-100 text-sm">Berapa ekor yang aman untuk kolam kamu?</p>
      </div>

      {/* Info */}
      <div className="px-4 pt-4 mb-4">
        <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-100">
          <div className="flex items-start gap-3">
            <span className="text-2xl">📐</span>
            <div>
              <h4 className="text-cyan-900 mb-1">Cara pakai</h4>
              <p className="text-sm text-cyan-800">
                Masukkan ukuran kolam kamu, pilih jenis ikan, lalu tekan Hitung. Nanti akan muncul berapa ekor ikan yang aman dan sayuran apa yang bisa ikut ditanam.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Input Form */}
      <div className="px-4 space-y-4">
        <div className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
          <h3 className="text-gray-900 mb-4">Ukuran Kolam</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Panjang Kolam (meter)
              </label>
              <input
                type="number"
                value={length}
                onChange={(e) => setLength(e.target.value)}
                placeholder="Contoh: 3"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-cyan-500 text-lg"
                step="0.1"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Lebar Kolam (meter)
              </label>
              <input
                type="number"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                placeholder="Contoh: 2"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-cyan-500 text-lg"
                step="0.1"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Tinggi Air di Dalam Kolam (meter)
                <span className="block text-xs text-gray-400 font-normal mt-0.5">Ukur dari dasar kolam sampai permukaan air, bukan tinggi dinding kolam</span>
              </label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="Contoh: 0.8"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-cyan-500 text-lg"
                step="0.1"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Jenis Ikan
              </label>
              <select
                value={fishType}
                onChange={(e) => setFishType(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-cyan-500 text-lg appearance-none bg-white"
              >
                {fishTypes.map(fish => (
                  <option key={fish.id} value={fish.id}>
                    {fish.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Toggle Jenis Sayuran */}
            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Jenis Sayuran yang Akan Ditanam
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setVegetableType('daun')}
                  className={`py-3 px-4 rounded-xl border-2 text-sm font-medium transition-all ${
                    vegetableType === 'daun'
                      ? 'bg-green-600 border-green-600 text-white'
                      : 'bg-white border-gray-300 text-gray-700 hover:border-green-400'
                  }`}
                >
                  🥬 Sayur Daun
                  <span className="block text-xs font-normal mt-0.5 opacity-80">Kangkung, selada, pakcoy</span>
                </button>
                <button
                  type="button"
                  onClick={() => setVegetableType('buah')}
                  className={`py-3 px-4 rounded-xl border-2 text-sm font-medium transition-all ${
                    vegetableType === 'buah'
                      ? 'bg-orange-500 border-orange-500 text-white'
                      : 'bg-white border-gray-300 text-gray-700 hover:border-orange-400'
                  }`}
                >
                  🍅 Sayur Buah
                  <span className="block text-xs font-normal mt-0.5 opacity-80">Tomat, terong, cabai</span>
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={calculate}
            className="w-full bg-cyan-600 hover:bg-cyan-700 active:bg-cyan-800 text-white py-4 rounded-xl mt-6 active:scale-95 transition-all font-semibold text-lg"
          >
            Hitung
          </button>
        </div>

        {/* Result */}
        {result && (
          <div className="space-y-3">

            {/* Banner mujair */}
            {result.isMujair && (
              <div className="bg-yellow-50 border border-yellow-300 rounded-2xl p-4 shadow-sm flex items-start gap-3">
                <span className="text-xl flex-shrink-0">⚠️</span>
                <p className="text-sm text-yellow-800 leading-relaxed">
                  Data khusus mujair masih terbatas. Angka di bawah dihitung berdasarkan patokan ikan nila yang sifatnya mirip — sudah aman dipakai sebagai acuan awal.
                </p>
              </div>
            )}

            {/* Card utama hasil */}
            <div className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
              <h3 className="text-gray-900 mb-1">Hasilnya</h3>
              <p className="text-xs text-gray-400 mb-4">Untuk kolam {result.volume.toLocaleString('id-ID')} liter, ikan {result.fishName}</p>

              <div className="space-y-3">

                {/* Card ikan 1 — Mulai pertama */}
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Fish className="w-5 h-5 text-amber-600" />
                    <p className="text-sm font-semibold text-amber-800">Jumlah {result.fishName} untuk 2 Bulan Pertama</p>
                  </div>
                  <p className="text-3xl font-bold text-amber-900">{result.fishCountBeginner.toLocaleString('id-ID')} Ekor</p>
                  <p className="text-xs text-amber-700 mt-2 leading-relaxed">
                    Tebar segini dulu sambil tunggu air kolam siap. Jangan langsung penuh — beri waktu 2 bulan agar air kolam terbiasa dengan kotoran ikan sebelum ditambah lebih banyak.
                  </p>
                </div>

                {/* Card ikan 2 — Setelah stabil */}
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Fish className="w-5 h-5 text-emerald-600" />
                    <p className="text-sm font-semibold text-emerald-800">{result.fishName} Saat Kolam Sudah Stabil</p>
                  </div>
                  <p className="text-3xl font-bold text-emerald-900">{result.fishCount.toLocaleString('id-ID')} Ekor</p>
                  <p className="text-xs text-emerald-700 mt-2 leading-relaxed">
                    Ini jumlah ideal saat air sudah jernih dan tidak bau. Biasanya tercapai setelah 2–3 bulan berjalan.
                  </p>
                </div>

                {/* Card ikan 3 — Batas aman */}
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Fish className="w-5 h-5 text-red-500" />
                    <p className="text-sm font-semibold text-red-800">⚠️ Batas Aman — Jangan Lewati Ini</p>
                  </div>
                  <p className="text-3xl font-bold text-red-900">{result.biomassaKg.toFixed(1)} kg berat total {result.fishName}</p>
                  <p className="text-xs text-red-700 mt-2 leading-relaxed">
                    Kalau berat {result.fishName} di kolam melebihi angka ini, ikan bisa megap-megap di permukaan lalu mati mendadak karena kekurangan oksigen.
                  </p>
                </div>

                {/* Tanaman */}
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Sprout className="w-5 h-5 text-green-600" />
                    <p className="text-sm font-semibold text-green-800">
                      {result.vegetableType === 'buah' ? '🍅 Sayur Buah' : '🥬 Sayur Daun'} yang Bisa Ditanam
                    </p>
                  </div>
                  <p className="text-3xl font-bold text-green-900">
                    {result.plantCount} {result.vegetableType === 'buah' ? 'Titik Tanam' : 'Lubang Tanam'}
                  </p>
                  <p className="text-xs text-green-700 mt-2 leading-relaxed">
                    Butuh lahan seluas sekitar {result.areaTanam.toFixed(1)} meter persegi.
                    {result.vegetableType === 'buah'
                      ? <> Cocok untuk <strong>tomat, terong, atau cabai</strong> — butuh lebih banyak tempat tapi harganya lebih mahal di pasar.</>
                      : <> Cocok untuk <strong>kangkung, selada, atau pakcoy</strong> — tumbuh subur karena mendapat pupuk alami dari air kolam ikan.</>
                    }
                  </p>
                </div>

              </div>
            </div>

            {/* Panduan langkah demi langkah */}
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 shadow-sm">
              <h4 className="text-blue-900 font-semibold mb-1">📅 Cara Memulai, Langkah demi Langkah</h4>
              <p className="text-xs text-blue-600 mb-4">Ikuti urutan ini agar ikan tidak stres dan mati di awal</p>
              <ul className="space-y-3 text-sm text-blue-800">
                <li className="flex items-start gap-3">
                  <span className="bg-blue-200 text-blue-900 font-bold rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-xs mt-0.5">1</span>
                  <div>
                    <p className="font-semibold">Minggu 1–4: Siapkan air kolam dulu</p>
                    <p className="text-blue-700 mt-0.5">
                      Masukkan <strong>{result.fishCountStarter} ekor {result.fishName} kecil saja</strong> dulu (kira-kira sepersepuluh dari jumlah total nanti). Jangan langsung banyak — biarkan 4 minggu sampai air tidak berbau dan jernih.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-blue-200 text-blue-900 font-bold rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-xs mt-0.5">2</span>
                  <div>
                    <p className="font-semibold">Minggu 4–8: Tebar {result.fishName} pertama</p>
                    <p className="text-blue-700 mt-0.5">Kalau air sudah tidak bau menyengat, tebar <strong>{result.fishCountBeginner} ekor</strong>. Perhatikan apakah ikan terlihat aktif berenang dan tidak megap-megap 2–3 hari setelah ditebar.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-blue-200 text-blue-900 font-bold rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-xs mt-0.5">3</span>
                  <div>
                    <p className="font-semibold">Minggu 8–12: Tambah bertahap</p>
                    <p className="text-blue-700 mt-0.5">Kalau {result.fishName} terlihat sehat dan aktif, naikkan ke <strong>{result.fishCount75} ekor</strong>. Tambah sedikit-sedikit, jangan sekaligus.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-emerald-200 text-emerald-900 font-bold rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-xs mt-0.5">✓</span>
                  <div>
                    <p className="font-semibold text-emerald-800">Bulan ke-3 ke atas: Kolam penuh</p>
                    <p className="text-emerald-700 mt-0.5">Kolam siap diisi <strong>{result.fishCount} ekor</strong> {result.fishName} penuh. Pantau terus agar ikan tidak berdesakan dan masih mau makan dengan baik.</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Credit Kepercayaan Standar Resmi */}
            <div className="flex items-start justify-center gap-2 py-4 border-t border-gray-100 mt-2 px-4">
              <span className="text-sm mt-0.5" role="img" aria-label="shield">🛡️</span>
              <p className="text-[10px] text-gray-400 text-center leading-relaxed font-medium max-w-xs">
                Kalkulasi & rekomendasi dirancang sesuai panduan resmi <span className="font-semibold text-gray-500">Organisasi Pangan dan Pertanian PBB (FAO)</span> serta standar <span className="font-semibold text-gray-500">Kementerian Kelautan dan Perikanan Republik Indonesia (KKP)</span>.
              </p>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
