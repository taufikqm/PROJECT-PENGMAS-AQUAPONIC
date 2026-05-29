import { ArrowLeft } from 'lucide-react';

interface NutrientScreenProps {
  onBack: () => void;
}

const nutrientTopics = [
  {
    title: 'Sumber Nutrisi Tanaman',
    emoji: '🌱',
    content: [
      {
        subtitle: 'Dari mana nutrisi berasal?',
        points: [
          'Kotoran ikan mengandung nitrogen',
          'Bakteri mengubah amonia menjadi nitrat',
          'Nitrat diserap akar tanaman',
          'Siklus ini alami dan berkelanjutan'
        ]
      },
      {
        subtitle: 'Nutrisi utama yang dibutuhkan:',
        points: [
          'Nitrogen (N) - pertumbuhan daun',
          'Fosfor (P) - akar dan bunga',
          'Kalium (K) - buah dan ketahanan',
          'Kalsium, magnesium, dan mikronutrien'
        ]
      }
    ]
  },
  {
    title: 'Tanda Kekurangan Nutrisi',
    emoji: '⚠️',
    content: [
      {
        subtitle: 'Kekurangan Nitrogen:',
        points: [
          'Daun menguning dari bawah',
          'Pertumbuhan lambat',
          'Solusi: Tambah jumlah ikan atau pakan'
        ]
      },
      {
        subtitle: 'Kekurangan Besi:',
        points: [
          'Daun muda kuning, tulang daun hijau',
          'Pertumbuhan terhambat',
          'Solusi: Tambahkan chelated iron'
        ]
      },
      {
        subtitle: 'Kekurangan Kalium:',
        points: [
          'Tepi daun menguning/kering',
          'Buah kecil dan sedikit',
          'Solusi: Tambahkan kalium sulfat'
        ]
      }
    ]
  },
  {
    title: 'Cara Menjaga Nutrisi',
    emoji: '✅',
    content: [
      {
        subtitle: 'Padat tebar ikan yang tepat:',
        points: [
          '1 kg ikan per 50-100 liter air',
          'Jangan terlalu sedikit atau banyak',
          'Seimbangkan dengan jumlah tanaman'
        ]
      },
      {
        subtitle: 'Pemberian pakan:',
        points: [
          'Beri pakan 2-3% berat ikan per hari',
          'Bagi jadi 2-3 kali pemberian',
          'Jangan sampai ada pakan tersisa',
          'Pakan berkualitas = nutrisi baik'
        ]
      },
      {
        subtitle: 'Perbandingan ikan-tanaman:',
        points: [
          '1 ekor ikan bisa untuk 1-2 tanaman',
          'Tanaman berdaun: lebih banyak nitrogen',
          'Tanaman berbuah: butuh lebih banyak ikan'
        ]
      }
    ]
  },
  {
    title: 'Jenis Tanaman Cocok',
    emoji: '🥬',
    content: [
      {
        subtitle: 'Mudah untuk pemula:',
        points: [
          'Kangkung - tumbuh cepat (25-30 hari)',
          'Selada - nutrisi rendah',
          'Pakcoy - tahan panas',
          'Bayam - tidak pilih-pilih'
        ]
      },
      {
        subtitle: 'Tingkat menengah:',
        points: [
          'Tomat - butuh nutrisi lebih',
          'Cabai - tahan lama',
          'Terong - produktif',
          'Strawberry - bernilai tinggi'
        ]
      },
      {
        subtitle: 'Hindari:',
        points: [
          'Umbi-umbian (kentang, wortel)',
          'Tanaman air terlalu banyak (padi)',
          'Tanaman yang butuh tanah asam'
        ]
      }
    ]
  }
];

export function NutrientScreen({ onBack }: NutrientScreenProps) {
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
        <h1 className="text-2xl text-white mb-1">Makanan Tanaman</h1>
        <p className="text-green-100 text-sm">Cara kasih nutrisi</p>
      </div>

      {/* Info */}
      <div className="px-4 pt-4 mb-4">
        <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-100">
          <div className="flex items-start gap-3">
            <span className="text-2xl">📖</span>
            <div>
              <h4 className="text-green-900 mb-1">Penjelasan</h4>
              <p className="text-sm text-green-800">
                Cara supaya tanaman dapat makanan yang cukup dari ikan
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content Cards */}
      <div className="px-4 space-y-4">
        {nutrientTopics.map((topic, index) => (
          <div key={index} className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
            <div className="flex items-center gap-3 mb-4 pb-3 border-b-2 border-gray-100">
              <span className="text-3xl">{topic.emoji}</span>
              <h2 className="text-gray-900">{topic.title}</h2>
            </div>

            <div className="space-y-4">
              {topic.content.map((section, secIndex) => (
                <div key={secIndex} className="bg-background rounded-xl p-4">
                  <h4 className="text-gray-900 mb-2">{section.subtitle}</h4>
                  <ul className="space-y-2">
                    {section.points.map((point, pointIndex) => (
                      <li key={pointIndex} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="text-green-600 flex-shrink-0">•</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
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
              <h4 className="text-emerald-900 mb-1">Tips</h4>
              <p className="text-sm text-emerald-800">
                Perhatikan warna daun setiap hari. Kalau warnanya bagus berarti nutrisinya cukup
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
