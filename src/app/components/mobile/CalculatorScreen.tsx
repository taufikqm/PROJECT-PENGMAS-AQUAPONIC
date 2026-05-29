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
        <h1 className="text-2xl text-white mb-1">Jumlah Ikan yang Cocok</h1>
        <p className="text-cyan-100 text-sm">Berapa ikan yang pas</p>
      </div>

      {/* Info */}
      <div className="px-4 pt-4 mb-4">
        <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-100">
          <div className="flex items-start gap-3">
            <span className="text-2xl">📐</span>
            <div>
              <h4 className="text-cyan-900 mb-1">Penjelasan</h4>
              <p className="text-sm text-cyan-800">
                Hitung berapa ikan yang pas untuk ukuran kolam kamu
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
                Tinggi Air (meter)
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
            <div className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
              <h3 className="text-gray-900 mb-4">Hasilnya</h3>

              <div className="space-y-3">
                <div className="bg-blue-50 rounded-xl p-4">
                  <p className="text-sm text-blue-800 mb-1">Volume Kolam</p>
                  <p className="text-3xl text-blue-900">{result.volume.toLocaleString('id-ID')} Liter</p>
                </div>

                <div className="bg-emerald-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Fish className="w-5 h-5 text-emerald-600" />
                    <p className="text-sm text-emerald-800">Jumlah Ikan</p>
                  </div>
                  <p className="text-3xl text-emerald-900">{result.fishCount.toLocaleString('id-ID')} Ekor</p>
                  <p className="text-xs text-emerald-700 mt-1">
                    {result.fishName || fishTypes.find(f => f.id === fishType)?.name}
                  </p>
                </div>

                <div className="bg-green-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Sprout className="w-5 h-5 text-green-600" />
                    <p className="text-sm text-green-800">Jumlah Tanaman</p>
                  </div>
                  <p className="text-3xl text-green-900">{result.plantCount} Lubang</p>
                  <p className="text-xs text-green-700 mt-1">
                    Kangkung, selada, pakcoy
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 shadow-sm">
              <h4 className="text-blue-900 mb-2">Ingat Ya</h4>
              <ul className="space-y-1 text-sm text-blue-800">
                <li>• Kalau baru mulai, isi setengahnya dulu</li>
                <li>• Tambah ikan pelan-pelan tiap 2-3 bulan</li>
                <li>• Pastikan saringan jalan terus</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
