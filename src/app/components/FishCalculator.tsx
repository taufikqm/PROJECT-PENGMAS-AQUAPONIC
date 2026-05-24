import { useState } from 'react';
import { Fish, Sprout, Calculator } from 'lucide-react';

const fishTypes = [
  { id: 'lele', name: 'Lele', density: 50 },
  { id: 'nila', name: 'Nila', density: 40 },
  { id: 'gurame', name: 'Gurame', density: 30 },
  { id: 'patin', name: 'Patin', density: 45 },
  { id: 'mas', name: 'Ikan Mas', density: 35 }
];

export function FishCalculator() {
  const [length, setLength] = useState('');
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [fishType, setFishType] = useState('lele');
  const [result, setResult] = useState<null | {
    volume: number;
    fishCount: number;
    plantCount: number;
    densityStatus: string;
  }>(null);

  const calculate = () => {
    const l = parseFloat(length);
    const w = parseFloat(width);
    const h = parseFloat(height);

    if (isNaN(l) || isNaN(w) || isNaN(h) || l <= 0 || w <= 0 || h <= 0) {
      alert('Mohon masukkan angka yang valid');
      return;
    }

    const volume = l * w * h;
    const selectedFish = fishTypes.find(f => f.id === fishType);
    const fishPerLiter = selectedFish ? selectedFish.density : 50;

    const fishCount = Math.floor(volume / fishPerLiter);
    const plantCount = Math.floor(fishCount * 1.5);

    let densityStatus = 'Optimal';
    if (fishCount < 10) densityStatus = 'Terlalu Rendah';
    if (fishCount > 200) densityStatus = 'Terlalu Tinggi';

    setResult({
      volume,
      fishCount,
      plantCount,
      densityStatus
    });
  };

  const reset = () => {
    setLength('');
    setWidth('');
    setHeight('');
    setFishType('lele');
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="mb-2 text-emerald-900">Kalkulator Padat Tebar</h1>
          <p className="text-gray-600">Hitung jumlah ikan dan tanaman ideal untuk kolam Anda</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Form */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-emerald-500 rounded-lg p-3">
                <Calculator className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-emerald-900">Input Data Kolam</h2>
            </div>

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
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
                  step="0.1"
                  min="0"
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
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
                  step="0.1"
                  min="0"
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
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
                  step="0.1"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Jenis Ikan
                </label>
                <select
                  value={fishType}
                  onChange={(e) => setFishType(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
                >
                  {fishTypes.map(fish => (
                    <option key={fish.id} value={fish.id}>
                      {fish.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={calculate}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg transition-colors"
                >
                  Hitung
                </button>
                <button
                  onClick={reset}
                  className="px-6 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-lg transition-colors"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="space-y-6">
            {result ? (
              <>
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h2 className="text-emerald-900 mb-4">Hasil Perhitungan</h2>

                  <div className="space-y-4">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <p className="text-sm text-blue-800 mb-1">Volume Kolam</p>
                      <p className="text-2xl text-blue-900">{result.volume.toFixed(1)} Liter</p>
                    </div>

                    <div className="bg-emerald-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Fish className="w-5 h-5 text-emerald-600" />
                        <p className="text-sm text-emerald-800">Jumlah Ikan Ideal</p>
                      </div>
                      <p className="text-2xl text-emerald-900">{result.fishCount} Ekor</p>
                      <p className="text-xs text-emerald-700 mt-1">
                        Untuk {fishTypes.find(f => f.id === fishType)?.name}
                      </p>
                    </div>

                    <div className="bg-green-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Sprout className="w-5 h-5 text-green-600" />
                        <p className="text-sm text-green-800">Jumlah Tanaman Ideal</p>
                      </div>
                      <p className="text-2xl text-green-900">{result.plantCount} Lubang</p>
                      <p className="text-xs text-green-700 mt-1">
                        Untuk sayuran (kangkung, selada, pakcoy)
                      </p>
                    </div>

                    <div className={`rounded-lg p-4 ${
                      result.densityStatus === 'Optimal'
                        ? 'bg-emerald-50 border-2 border-emerald-300'
                        : result.densityStatus === 'Terlalu Rendah'
                        ? 'bg-amber-50 border-2 border-amber-300'
                        : 'bg-red-50 border-2 border-red-300'
                    }`}>
                      <p className="text-sm mb-1">Status Padat Tebar</p>
                      <p className={`text-xl ${
                        result.densityStatus === 'Optimal'
                          ? 'text-emerald-900'
                          : result.densityStatus === 'Terlalu Rendah'
                          ? 'text-amber-900'
                          : 'text-red-900'
                      }`}>
                        {result.densityStatus}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
                  <h3 className="text-blue-900 mb-3">Catatan Penting</h3>
                  <ul className="space-y-2 text-sm text-blue-800">
                    <li>• Jumlah ikan dihitung untuk ukuran konsumsi (200-300g)</li>
                    <li>• Mulai dengan 50% jumlah yang direkomendasikan untuk pemula</li>
                    <li>• Tambah ikan secara bertahap setiap 2-3 bulan</li>
                    <li>• Pastikan sistem filter berfungsi dengan baik</li>
                    <li>• Monitor kualitas air setiap hari</li>
                  </ul>
                </div>
              </>
            ) : (
              <div className="bg-white rounded-xl shadow-md p-12 text-center">
                <Calculator className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">
                  Masukkan data kolam Anda untuk melihat rekomendasi
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
