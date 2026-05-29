import { ArrowLeft, ArrowDown } from 'lucide-react';

interface FilterScreenProps {
  onBack: () => void;
}

export function FilterScreen({ onBack }: FilterScreenProps) {
  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-emerald-600 via-teal-500 to-cyan-500 px-4 pt-4 pb-5">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-white mb-3 active:opacity-70"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Kembali</span>
        </button>
        <h1 className="text-2xl text-white mb-1">Susunan Saringan</h1>
        <p className="text-indigo-100 text-sm">Cara kerja saringan air</p>
      </div>

      {/* Info */}
      <div className="px-4 pt-4 mb-4">
        <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-100">
          <div className="flex items-start gap-3">
            <span className="text-2xl">📖</span>
            <div>
              <h4 className="text-indigo-900 mb-1">Penjelasan</h4>
              <p className="text-sm text-indigo-800">
                Gimana caranya air kotor dari ikan jadi bersih lagi
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Flow Diagram */}
      <div className="px-4 space-y-3">
        {/* Stage 1 */}
        <div className="bg-blue-100 border-2 border-blue-300 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">🐟</span>
            <div>
              <h3 className="text-blue-900">1. Kolam Ikan</h3>
              <p className="text-sm text-blue-800">Air kotor dari kotoran ikan</p>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <ArrowDown className="w-6 h-6 text-gray-400 animate-bounce" />
        </div>

        {/* Stage 2 */}
        <div className="bg-gray-100 border-2 border-gray-300 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">🔍</span>
            <div>
              <h3 className="text-gray-900">2. Filter Mekanik</h3>
              <p className="text-sm text-gray-700">Menyaring kotoran padat</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            <span className="bg-white px-3 py-1 rounded-full text-xs text-gray-700">Busa filter</span>
            <span className="bg-white px-3 py-1 rounded-full text-xs text-gray-700">Jaring halus</span>
          </div>
        </div>

        <div className="flex justify-center">
          <ArrowDown className="w-6 h-6 text-gray-400 animate-bounce" style={{ animationDelay: '0.2s' }} />
        </div>

        {/* Stage 3 */}
        <div className="bg-emerald-100 border-2 border-emerald-300 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">✨</span>
            <div>
              <h3 className="text-emerald-900">3. Biofilter</h3>
              <p className="text-sm text-emerald-800">Bakteri baik membersihkan racun</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            <span className="bg-white px-3 py-1 rounded-full text-xs text-emerald-700">Bio ball</span>
            <span className="bg-white px-3 py-1 rounded-full text-xs text-emerald-700">Kerikil</span>
          </div>
        </div>

        <div className="flex justify-center">
          <ArrowDown className="w-6 h-6 text-gray-400 animate-bounce" style={{ animationDelay: '0.4s' }} />
        </div>

        {/* Stage 4 */}
        <div className="bg-green-100 border-2 border-green-300 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">🌱</span>
            <div>
              <h3 className="text-green-900">4. Media Tanam</h3>
              <p className="text-sm text-green-800">Tanaman menyerap nutrisi</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            <span className="bg-white px-3 py-1 rounded-full text-xs text-green-700">Hidroton</span>
            <span className="bg-white px-3 py-1 rounded-full text-xs text-green-700">Batu apung</span>
          </div>
        </div>

        <div className="flex justify-center">
          <ArrowDown className="w-6 h-6 text-gray-400 animate-bounce" style={{ animationDelay: '0.6s' }} />
        </div>

        {/* Stage 5 */}
        <div className="bg-cyan-100 border-2 border-cyan-300 rounded-2xl p-5">
          <div className="flex items-center gap-3">
            <span className="text-3xl">💧</span>
            <div>
              <h3 className="text-cyan-900">5. Kembali ke Kolam</h3>
              <p className="text-sm text-cyan-800">Air bersih untuk ikan</p>
            </div>
          </div>
        </div>

        {/* Maintenance Tips */}
        <div className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow border border-gray-100 mt-6">
          <h3 className="text-gray-900 mb-4">Yang Harus Dibersihkan</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <span className="bg-emerald-500 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-sm">1</span>
              <p className="text-sm text-gray-700 pt-0.5">
                <strong>Saringan Kasar:</strong> Bersihkan tiap 3-7 hari
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="bg-emerald-500 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-sm">2</span>
              <p className="text-sm text-gray-700 pt-0.5">
                <strong>Saringan Halus:</strong> Cuci pakai air kolam sebulan sekali
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="bg-emerald-500 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-sm">3</span>
              <p className="text-sm text-gray-700 pt-0.5">
                <strong>Pompa:</strong> Cek tiap 2 minggu sekali
              </p>
            </div>
          </div>
        </div>

        {/* Warning */}
        <div className="bg-red-50 border border-red-100 rounded-2xl p-4 shadow-sm">
          <h4 className="text-red-900 mb-2">⚠️ Jangan Ya!</h4>
          <ul className="space-y-1 text-sm text-red-800">
            <li>✗ Cuci saringan pakai air keran (bakteri baiknya mati)</li>
            <li>✗ Ganti semua air sekaligus (ikannya kaget)</li>
            <li>✗ Bersihkan semua saringan barengan</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
