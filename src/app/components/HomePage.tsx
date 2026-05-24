import { Droplets, Sprout, Fish, Activity } from 'lucide-react';

export function HomePage({ onStartLearning }: { onStartLearning: () => void }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      {/* Hero Section */}
      <div className="px-4 py-12 md:py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl mb-4 text-emerald-900">
            Panduan Operasional Akuaponik Pintar
          </h1>
          <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
            Pelajari cara merawat sistem akuaponik menggunakan data sensor dan tutorial praktis untuk hasil panen yang optimal
          </p>
          <button
            onClick={onStartLearning}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-xl transition-colors"
          >
            Mulai Belajar
          </button>
        </div>

        {/* Illustration */}
        <div className="max-w-5xl mx-auto mt-12 bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Fish Tank Section */}
            <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl p-6 relative overflow-hidden">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-blue-500 rounded-full p-3">
                  <Fish className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg text-blue-900">Kolam Ikan</h3>
              </div>
              <div className="space-y-2 text-sm text-blue-800">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Sensor pH & Suhu</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Monitor Kualitas Air</span>
                </div>
              </div>
              <div className="absolute bottom-2 right-2 opacity-20">
                <Fish className="w-20 h-20" />
              </div>
            </div>

            {/* Plant Section */}
            <div className="bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl p-6 relative overflow-hidden">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-emerald-500 rounded-full p-3">
                  <Sprout className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg text-emerald-900">Tanaman</h3>
              </div>
              <div className="space-y-2 text-sm text-emerald-800">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <span>Nutrisi Otomatis</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <span>Pertumbuhan Optimal</span>
                </div>
              </div>
              <div className="absolute bottom-2 right-2 opacity-20">
                <Sprout className="w-20 h-20" />
              </div>
            </div>

            {/* Water Circulation */}
            <div className="bg-gradient-to-br from-cyan-100 to-cyan-200 rounded-xl p-6 relative overflow-hidden">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-cyan-500 rounded-full p-3">
                  <Droplets className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg text-cyan-900">Sirkulasi Air</h3>
              </div>
              <div className="space-y-2 text-sm text-cyan-800">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                  <span>Filter Biologis</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                  <span>Pompa Otomatis</span>
                </div>
              </div>
              <div className="absolute bottom-2 right-2 opacity-20">
                <Droplets className="w-20 h-20" />
              </div>
            </div>

            {/* Sensors */}
            <div className="bg-gradient-to-br from-amber-100 to-amber-200 rounded-xl p-6 relative overflow-hidden">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-amber-500 rounded-full p-3">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg text-amber-900">Sensor Pintar</h3>
              </div>
              <div className="space-y-2 text-sm text-amber-800">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                  <span>Monitoring Real-time</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                  <span>Notifikasi Otomatis</span>
                </div>
              </div>
              <div className="absolute bottom-2 right-2 opacity-20">
                <Activity className="w-20 h-20" />
              </div>
            </div>
          </div>

          {/* Flow Arrows */}
          <div className="mt-6 flex justify-center">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
              <span>→</span>
              <div className="w-3 h-3 bg-cyan-500 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }}></div>
              <span>→</span>
              <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" style={{ animationDelay: '0.6s' }}></div>
              <span>→</span>
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.9s' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Overview */}
      <div className="px-4 py-12 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-center mb-8 text-emerald-900">Fitur Pembelajaran</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Activity className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="mb-2 text-emerald-900">Monitoring Sensor</h3>
              <p className="text-sm text-gray-600">
                Pantau kondisi pH, suhu, dan kualitas air secara real-time
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sprout className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="mb-2 text-blue-900">Tutorial Praktis</h3>
              <p className="text-sm text-gray-600">
                Panduan langkah demi langkah untuk pemula
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Fish className="w-8 h-8 text-cyan-600" />
              </div>
              <h3 className="mb-2 text-cyan-900">Kalkulator Padat Tebar</h3>
              <p className="text-sm text-gray-600">
                Hitung jumlah ikan ideal untuk kolam Anda
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
