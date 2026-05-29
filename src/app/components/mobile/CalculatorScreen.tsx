import { useState } from 'react';
import { ArrowLeft, Fish, Sprout } from 'lucide-react';
import { supabase } from '../../../lib/supabase';

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
  const [result, setResult] = useState<null | {
    volume: number;
    fishCount: number;
    fishCountBeginner: number;
    fishCount75: number;
    plantCount: number;
    biomassaKg: number;
    volumeEfektif: number;
    isMujair: boolean;
    fishName?: string;
  }>(null);

  const [isLoading, setIsLoading] = useState(false);

  // Rumus FAO — dipakai di path online maupun offline
  const computeResult = (
    l: number, w: number, h: number,
    density_per_m3: number, harvest_weight_kg: number,
    fishName: string
  ) => {
    const volume_liter  = l * w * h * 1000;
    const V_efektif     = volume_liter * 0.85;          // 85% volume efektif
    const V_efektif_m3  = V_efektif / 1000;

    const fish_count_raw = Math.floor(V_efektif_m3 * density_per_m3);

    // Hard cap biomassa FAO (20 kg/m³)
    const batas_biomassa = V_efektif_m3 * 20;
    const biomassa_check = fish_count_raw * harvest_weight_kg;
    const fish_count = biomassa_check > batas_biomassa
      ? Math.floor(batas_biomassa / harvest_weight_kg)
      : fish_count_raw;

    // Jumlah tanaman (FAO Feed Rate Ratio: 1 m² per 5 kg biomassa, 20 lubang/m²)
    const biomassa_final = fish_count * harvest_weight_kg;
    const area_tanam     = biomassa_final / 5;
    const plant_count    = Math.round(area_tanam * 20);

    return {
      volume: volume_liter,
      volumeEfektif: V_efektif,
      fishCount: fish_count,
      fishCountBeginner: Math.floor(fish_count * 0.5),
      fishCount75: Math.floor(fish_count * 0.75),
      plantCount: plant_count,
      biomassaKg: biomassa_final,
      isMujair: fishName.toLowerCase().includes('mujair'),
      fishName,
    };
  };

  const calculate = async () => {
    const l = parseFloat(length);
    const w = parseFloat(width);
    const h = parseFloat(height);

    if (isNaN(l) || isNaN(w) || isNaN(h) || l <= 0 || w <= 0 || h <= 0) {
      alert('Mohon masukkan angka yang valid');
      return;
    }

    setIsLoading(true);
    try {
      // Ambil data ikan dari Supabase (kolom baru)
      const { data, error } = await supabase
        .from('fish_types')
        .select('id, name, density_per_m3, harvest_weight_kg')
        .eq('id', fishType)
        .single();

      if (error) throw error;

      setResult(computeResult(
        l, w, h,
        data.density_per_m3,
        data.harvest_weight_kg,
        data.name
      ));
    } catch (error) {
      console.error(error);
      console.warn('Menggunakan kalkulator lokal (Offline Fallback)...');

      // Offline fallback — rumus identik via computeResult()
      const localFish = fishTypes.find(f => f.id === fishType);
      setResult(computeResult(
        l, w, h,
        localFish?.density_per_m3 ?? 125,
        localFish?.harvest_weight_kg ?? 0.25,
        localFish?.name ?? 'Ikan'
      ));
    } finally {
      setIsLoading(false);
    }
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
        <h1 className="text-2xl text-white mb-1">Hitung Isi Kolam Lele</h1>
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
          </div>

          <button
            onClick={calculate}
            disabled={isLoading}
            className="w-full bg-cyan-600 hover:bg-cyan-700 disabled:bg-cyan-400 text-white py-4 rounded-xl mt-6 active:scale-98 transition-all"
          >
            {isLoading ? 'Menghitung...' : 'Hitung'}
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
              <p className="text-xs text-gray-400 mb-4">Untuk kolam {result.volume.toLocaleString('id-ID')} liter · {result.fishName}</p>

              <div className="space-y-3">

                {/* Card ikan 1 — Mulai pertama */}
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Fish className="w-5 h-5 text-amber-600" />
                    <p className="text-sm font-semibold text-amber-800">Jumlah Lele untuk 2 Bulan Pertama</p>
                  </div>
                  <p className="text-3xl font-bold text-amber-900">{result.fishCountBeginner.toLocaleString('id-ID')} Ekor</p>
                  <p className="text-xs text-amber-700 mt-2 leading-relaxed">
                    Tebar segini dulu sambil tunggu air kolam siap. Jangan langsung penuh — beri waktu 2 bulan agar bakteri di saringan terbentuk.
                  </p>
                </div>

                {/* Card ikan 2 — Setelah stabil */}
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Fish className="w-5 h-5 text-emerald-600" />
                    <p className="text-sm font-semibold text-emerald-800">Lele Saat Kolam Sudah Stabil</p>
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
                  <p className="text-3xl font-bold text-red-900">{result.biomassaKg.toFixed(1)} kg berat total lele</p>
                  <p className="text-xs text-red-700 mt-2 leading-relaxed">
                    Kalau berat lele di kolam sudah melebihi angka ini, ikan bisa kekurangan oksigen dan mati mendadak.
                  </p>
                </div>

                {/* Tanaman */}
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Sprout className="w-5 h-5 text-green-600" />
                    <p className="text-sm font-semibold text-green-800">Sayuran yang Bisa Ditanam</p>
                  </div>
                  <p className="text-3xl font-bold text-green-900">{result.plantCount} Lubang Tanam</p>
                  <p className="text-xs text-green-700 mt-2 leading-relaxed">
                    Sekitar {(result.plantCount / 20).toFixed(0)} meter persegi area tanam. Cocok untuk <strong>kangkung, selada, atau pakcoy</strong> — ketiganya tumbuh subur dari kotoran lele dan tidak butuh perawatan khusus.
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
                    <p className="text-blue-700 mt-0.5">Masukkan <strong>2–3 ekor lele kecil saja</strong> sebagai percobaan. Jangan langsung banyak. Biarkan 4 minggu sampai air tidak berbau dan jernih.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-blue-200 text-blue-900 font-bold rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-xs mt-0.5">2</span>
                  <div>
                    <p className="font-semibold">Minggu 4–8: Tebar lele pertama</p>
                    <p className="text-blue-700 mt-0.5">Kalau air sudah tidak bau menyengat, tebar <strong>{result.fishCountBeginner} ekor</strong>. Amati kondisi air 2–3 hari setelah ditebar.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-blue-200 text-blue-900 font-bold rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-xs mt-0.5">3</span>
                  <div>
                    <p className="font-semibold">Minggu 8–12: Tambah bertahap</p>
                    <p className="text-blue-700 mt-0.5">Kalau lele sehat dan air jernih, naikkan ke <strong>{result.fishCount75} ekor</strong>. Jangan tambah sekaligus, tambah sedikit-sedikit.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-emerald-200 text-emerald-900 font-bold rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-xs mt-0.5">✓</span>
                  <div>
                    <p className="font-semibold text-emerald-800">Bulan ke-3 ke atas: Kolam penuh</p>
                    <p className="text-emerald-700 mt-0.5">Kolam siap diisi <strong>{result.fishCount} ekor</strong> lele penuh. Pantau terus agar ikan tidak berdesakan.</p>
                  </div>
                </li>
              </ul>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
