import { useState } from 'react';
import { ArrowLeft, Fish, Sprout } from 'lucide-react';

interface CalculatorScreenProps {
  onBack: () => void;
}

const fishTypes = [
  { id: 'lele', name: 'Lele', density: 50 },
  { id: 'nila', name: 'Nila', density: 40 },
  { id: 'gurame', name: 'Gurame', density: 30 },
  { id: 'patin', name: 'Patin', density: 45 },
  { id: 'mas', name: 'Ikan Mas', density: 35 }
];

export function CalculatorScreen({ onBack }: CalculatorScreenProps) {
  const [length, setLength] = useState('');
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [fishType, setFishType] = useState('lele');
  const [result, setResult] = useState<null | {
    volume: number;
    fishCount: number;
    plantCount: number;
    fishName?: string;
  }>(null);

  const [isLoading, setIsLoading] = useState(false);

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
      const response = await fetch('http://localhost:3001/api/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          length: l,
          width: w,
          height: h,
          fish_id: fishType,
        }),
      });

      if (!response.ok) {
        throw new Error('Gagal menghubungi server');
      }

      const data = await response.json();
      setResult({ 
        volume: data.volume_liter, 
        fishCount: data.fish_count, 
        plantCount: data.plant_count,
        fishName: data.fish_name
      });
    } catch (error) {
      alert('Terjadi kesalahan saat menghitung. Pastikan server backend sudah berjalan.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="bg-cyan-600 px-4 pt-4 pb-5">
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
