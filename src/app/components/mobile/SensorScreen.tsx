import { ArrowLeft } from 'lucide-react';

interface SensorScreenProps {
  onBack: () => void;
}

const sensorGuides = [
  {
    title: 'pH Air',
    emoji: '💧',
    conditions: [
      {
        range: 'pH di bawah 6',
        status: 'danger',
        meaning: 'Air terlalu asam',
        effects: 'Ikan dapat stres, tanaman sulit menyerap nutrisi',
        actions: [
          'Tambahkan penstabil pH (kapur pertanian)',
          'Ganti 20% air kolam',
          'Periksa setelah hujan'
        ]
      },
      {
        range: 'pH 6.5 - 7.5',
        status: 'safe',
        meaning: 'pH ideal',
        effects: 'Kondisi optimal untuk ikan dan tanaman',
        actions: [
          'Pertahankan kondisi ini',
          'Cek pH rutin setiap hari',
          'Catat di buku harian'
        ]
      },
      {
        range: 'pH di atas 8',
        status: 'danger',
        meaning: 'Air terlalu basa',
        effects: 'Amonia menjadi beracun, ikan dapat mati',
        actions: [
          'Kurangi pemberian pakan',
          'Tambahkan asam organik',
          'Konsultasi dengan ahli'
        ]
      }
    ]
  },
  {
    title: 'Suhu Air',
    emoji: '🌡️',
    conditions: [
      {
        range: 'Suhu di bawah 20°C',
        status: 'warning',
        meaning: 'Air terlalu dingin',
        effects: 'Ikan kurang aktif, pertumbuhan lambat',
        actions: [
          'Pasang greenhouse sederhana',
          'Kurangi sirkulasi air malam hari',
          'Gunakan mulsa hitam'
        ]
      },
      {
        range: 'Suhu 25 - 30°C',
        status: 'safe',
        meaning: 'Suhu ideal',
        effects: 'Metabolisme ikan optimal',
        actions: [
          'Kondisi baik',
          'Lanjutkan perawatan rutin',
          'Pantau 2x sehari'
        ]
      },
      {
        range: 'Suhu di atas 32°C',
        status: 'danger',
        meaning: 'Air terlalu panas',
        effects: 'Oksigen rendah, ikan bisa stres',
        actions: [
          'Pasang peneduh (paranet)',
          'Tambah aerator',
          'Kurangi pemberian pakan'
        ]
      }
    ]
  },
  {
    title: 'Ketinggian Air',
    emoji: '📊',
    conditions: [
      {
        range: 'Level air di bawah 70%',
        status: 'warning',
        meaning: 'Air terlalu sedikit',
        effects: 'Ikan sesak, konsentrasi racun tinggi',
        actions: [
          'Tambahkan air bersih',
          'Periksa kebocoran',
          'Cek sistem pompa'
        ]
      },
      {
        range: 'Level air 80 - 90%',
        status: 'safe',
        meaning: 'Level ideal',
        effects: 'Volume cukup untuk sirkulasi',
        actions: [
          'Pertahankan level ini',
          'Cek setiap hari',
          'Antisipasi penguapan'
        ]
      },
      {
        range: 'Level air di atas 95%',
        status: 'warning',
        meaning: 'Air terlalu penuh',
        effects: 'Risiko luber saat hujan',
        actions: [
          'Kurangi sedikit air',
          'Buat sistem overflow',
          'Siapkan drainase darurat'
        ]
      }
    ]
  },
  {
    title: 'Kelembaban Udara',
    emoji: '💨',
    conditions: [
      {
        range: 'Kelembaban di bawah 50%',
        status: 'warning',
        meaning: 'Udara terlalu kering',
        effects: 'Tanaman cepat layu, penguapan tinggi',
        actions: [
          'Semprotkan air pada tanaman',
          'Tambah frekuensi penyiraman',
          'Pasang shade net'
        ]
      },
      {
        range: 'Kelembaban 60 - 70%',
        status: 'safe',
        meaning: 'Kelembaban ideal',
        effects: 'Tanaman tumbuh optimal',
        actions: [
          'Kondisi baik',
          'Jaga sirkulasi udara',
          'Pantau pagi dan sore'
        ]
      },
      {
        range: 'Kelembaban di atas 80%',
        status: 'warning',
        meaning: 'Udara terlalu lembab',
        effects: 'Risiko jamur dan penyakit tanaman',
        actions: [
          'Buka ventilasi',
          'Kurangi penyiraman',
          'Pangkas daun yang rapat'
        ]
      }
    ]
  }
];

export function SensorScreen({ onBack }: SensorScreenProps) {
  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="bg-blue-600 px-4 pt-4 pb-5">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-white mb-3 active:opacity-70"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Kembali</span>
        </button>
        <h1 className="text-2xl text-white mb-1">Kalau Angka Berubah</h1>
        <p className="text-blue-100 text-sm">Artinya apa dan harus gimana</p>
      </div>

      {/* Info Card */}
      <div className="px-4 pt-4 mb-4">
        <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-100">
          <div className="flex items-start gap-3">
            <span className="text-2xl">📖</span>
            <div>
              <h4 className="text-blue-900 mb-1">Penjelasan</h4>
              <p className="text-sm text-blue-800">
                Di sini dijelaskan artinya angka sensor dan apa yang harus dilakukan
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sensor Guide Cards */}
      <div className="px-4 space-y-4">
        {sensorGuides.map((guide, index) => (
          <div key={index} className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
            <div className="flex items-center gap-3 mb-4 pb-3 border-b-2 border-gray-100">
              <span className="text-3xl">{guide.emoji}</span>
              <h2 className="text-gray-900">{guide.title}</h2>
            </div>

            <div className="space-y-4">
              {guide.conditions.map((condition, condIndex) => {
                const statusColors = {
                  safe: 'bg-emerald-50 border-emerald-300',
                  warning: 'bg-amber-50 border-amber-300',
                  danger: 'bg-red-50 border-red-300'
                };

                return (
                  <div
                    key={condIndex}
                    className={`${statusColors[condition.status as keyof typeof statusColors]} border-2 rounded-xl p-4`}
                  >
                    <h4 className="text-gray-900 mb-2">{condition.range}</h4>
                    <p className="text-sm text-gray-700 mb-1">
                      <strong>Artinya:</strong> {condition.meaning}
                    </p>
                    <p className="text-sm text-gray-700 mb-3">
                      <strong>Dampak:</strong> {condition.effects}
                    </p>
                    <div className="bg-white rounded-lg p-3">
                      <p className="text-sm text-gray-900 mb-2">Apa yang harus dilakukan:</p>
                      <ul className="space-y-1">
                        {condition.actions.map((action, actionIndex) => (
                          <li key={actionIndex} className="flex items-start gap-2 text-sm text-gray-700">
                            <span className="text-emerald-600">•</span>
                            <span>{action}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Tip Card */}
      <div className="px-4 mt-4 mb-4">
        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 shadow-sm">
          <div className="flex items-start gap-3">
            <span className="text-2xl">💡</span>
            <div>
              <h4 className="text-emerald-900 mb-1">Catatan Penting</h4>
              <p className="text-sm text-emerald-800">
                Catat angka-angkanya setiap hari di buku biar tahu perubahannya
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
