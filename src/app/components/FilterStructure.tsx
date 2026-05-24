import { Filter, Droplets, ArrowDown, Waves, Sparkles } from 'lucide-react';

export function FilterStructure() {
  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="mb-2 text-emerald-900">Struktur Filter Akuaponik</h1>
          <p className="text-gray-600">Pahami bagaimana sistem filtrasi bekerja</p>
        </div>

        {/* Filter Flow Diagram */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-8">
          <h2 className="text-center text-emerald-900 mb-8">Alur Sirkulasi Air</h2>

          <div className="space-y-6">
            {/* Stage 1: Fish Tank */}
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl p-6 border-2 border-blue-300">
                <div className="flex items-center gap-4">
                  <div className="bg-blue-500 rounded-full p-4">
                    <Waves className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-blue-900 mb-2">1. Kolam Ikan</h3>
                    <p className="text-sm text-blue-800">
                      Air kotor dari kotoran ikan dan sisa pakan mengandung amonia
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-center my-4">
                <div className="flex flex-col items-center">
                  <ArrowDown className="w-6 h-6 text-gray-400 animate-bounce" />
                  <span className="text-xs text-gray-500 mt-1">Air mengalir</span>
                </div>
              </div>
            </div>

            {/* Stage 2: Mechanical Filter */}
            <div className="relative">
              <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl p-6 border-2 border-gray-300">
                <div className="flex items-center gap-4">
                  <div className="bg-background0 rounded-full p-4">
                    <Filter className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-gray-900 mb-2">2. Filter Mekanik</h3>
                    <p className="text-sm text-gray-800">
                      Menyaring kotoran padat seperti feses ikan dan sisa pakan
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="bg-white px-3 py-1 rounded-full text-xs text-gray-700">
                        Busa filter
                      </span>
                      <span className="bg-white px-3 py-1 rounded-full text-xs text-gray-700">
                        Jaring halus
                      </span>
                      <span className="bg-white px-3 py-1 rounded-full text-xs text-gray-700">
                        Serat kain
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-center my-4">
                <div className="flex flex-col items-center">
                  <ArrowDown className="w-6 h-6 text-gray-400 animate-bounce" style={{ animationDelay: '0.2s' }} />
                  <span className="text-xs text-gray-500 mt-1">Air lebih bersih</span>
                </div>
              </div>
            </div>

            {/* Stage 3: Biofilter */}
            <div className="relative">
              <div className="bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl p-6 border-2 border-emerald-300">
                <div className="flex items-center gap-4">
                  <div className="bg-emerald-500 rounded-full p-4">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-emerald-900 mb-2">3. Biofilter</h3>
                    <p className="text-sm text-emerald-800">
                      Bakteri baik mengubah amonia beracun menjadi nitrat (nutrisi tanaman)
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="bg-white px-3 py-1 rounded-full text-xs text-emerald-700">
                        Bio ball
                      </span>
                      <span className="bg-white px-3 py-1 rounded-full text-xs text-emerald-700">
                        Kerikil
                      </span>
                      <span className="bg-white px-3 py-1 rounded-full text-xs text-emerald-700">
                        Media keramik
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-center my-4">
                <div className="flex flex-col items-center">
                  <ArrowDown className="w-6 h-6 text-gray-400 animate-bounce" style={{ animationDelay: '0.4s' }} />
                  <span className="text-xs text-gray-500 mt-1">Air kaya nutrisi</span>
                </div>
              </div>
            </div>

            {/* Stage 4: Plant Bed */}
            <div className="relative">
              <div className="bg-gradient-to-br from-green-100 to-green-200 rounded-xl p-6 border-2 border-green-300">
                <div className="flex items-center gap-4">
                  <div className="bg-green-500 rounded-full p-4">
                    <Droplets className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-green-900 mb-2">4. Media Tanam</h3>
                    <p className="text-sm text-green-800">
                      Tanaman menyerap nitrat dari air, membersihkan air untuk ikan
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="bg-white px-3 py-1 rounded-full text-xs text-green-700">
                        Hidroton
                      </span>
                      <span className="bg-white px-3 py-1 rounded-full text-xs text-green-700">
                        Batu apung
                      </span>
                      <span className="bg-white px-3 py-1 rounded-full text-xs text-green-700">
                        NFT
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-center my-4">
                <div className="flex flex-col items-center">
                  <ArrowDown className="w-6 h-6 text-gray-400 animate-bounce" style={{ animationDelay: '0.6s' }} />
                  <span className="text-xs text-gray-500 mt-1">Kembali ke kolam</span>
                </div>
              </div>
            </div>

            {/* Back to Fish Tank */}
            <div className="bg-gradient-to-br from-cyan-100 to-cyan-200 rounded-xl p-6 border-2 border-cyan-300">
              <div className="flex items-center gap-4">
                <div className="bg-cyan-500 rounded-full p-4">
                  <Waves className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-cyan-900 mb-2">5. Kembali ke Kolam Ikan</h3>
                  <p className="text-sm text-cyan-800">
                    Air bersih dan sehat kembali ke kolam ikan untuk siklus baru
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Maintenance Tips */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-emerald-900 mb-4">Perawatan Rutin</h3>
            <ul className="space-y-3 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="bg-emerald-500 text-white rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 text-xs mt-0.5">
                  1
                </span>
                <span>
                  <strong>Filter Mekanik:</strong> Bersihkan setiap 3-7 hari atau saat air keruh
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-emerald-500 text-white rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 text-xs mt-0.5">
                  2
                </span>
                <span>
                  <strong>Biofilter:</strong> Cuci dengan air kolam (jangan air keran) sebulan sekali
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-emerald-500 text-white rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 text-xs mt-0.5">
                  3
                </span>
                <span>
                  <strong>Media Tanam:</strong> Buang daun mati dan kotoran yang menumpuk
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-emerald-500 text-white rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 text-xs mt-0.5">
                  4
                </span>
                <span>
                  <strong>Pompa:</strong> Cek dan bersihkan setiap 2 minggu
                </span>
              </li>
            </ul>
          </div>

          <div className="bg-red-50 border-2 border-red-300 rounded-xl p-6">
            <h3 className="text-red-900 mb-4">Jangan Lakukan Ini!</h3>
            <ul className="space-y-3 text-sm text-red-800">
              <li className="flex items-start gap-2">
                <span className="text-red-600 flex-shrink-0">✗</span>
                <span>Mencuci biofilter dengan air keran (klorin akan membunuh bakteri baik)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 flex-shrink-0">✗</span>
                <span>Mengganti semua air sekaligus (sistem bakteri akan rusak)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 flex-shrink-0">✗</span>
                <span>Membersihkan semua filter bersamaan (biarkan bakteri tetap ada)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 flex-shrink-0">✗</span>
                <span>Menambahkan bahan kimia tanpa konsultasi ahli</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
