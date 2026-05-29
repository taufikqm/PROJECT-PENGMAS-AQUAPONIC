import { ArrowLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface TroubleshootScreenProps {
  onBack: () => void;
}

const problems = [
  {
    id: 1,
    title: 'Air keruh',
    icon: '💧',
    cause: 'Terlalu banyak pakan yang tidak termakan atau filter tersumbat',
    steps: [
      'Matikan pompa sementara',
      'Bersihkan filter mekanik',
      'Kurangi porsi pakan 50%',
      'Nyalakan kembali pompa'
    ]
  },
  {
    id: 2,
    title: 'pH turun setelah hujan',
    icon: '🌧️',
    cause: 'Air hujan bersifat asam dan mengencerkan air kolam',
    steps: [
      'Ukur pH air saat ini',
      'Tambahkan 1 sdm kapur per 100L',
      'Aduk rata, tunggu 30 menit',
      'Ukur kembali dan ulangi jika perlu'
    ]
  },
  {
    id: 3,
    title: 'Ikan lemas',
    icon: '🐟',
    cause: 'Kadar oksigen rendah atau kualitas air buruk',
    steps: [
      'Pasang aerator tambahan',
      'Cek pH air (ideal 6.5-7.5)',
      'Ganti 20% air dengan air bersih',
      'Hentikan pakan 1 hari',
      'Pantau kondisi ikan selama 24-48 jam'
    ]
  },
  {
    id: 4,
    title: 'Tanaman menguning',
    icon: '🌱',
    cause: 'Kekurangan nutrisi atau pH tidak sesuai',
    steps: [
      'Cek pH air (ideal 6.5-7.0)',
      'Tambah frekuensi pakan ikan',
      'Pangkas daun yang kuning',
      'Pantau pertumbuhan 1 minggu'
    ]
  },
  {
    id: 5,
    title: 'Pompa tidak berjalan',
    icon: '⚙️',
    cause: 'Pompa tersumbat atau rusak',
    steps: [
      'Matikan listrik pompa',
      'Lepas dan bersihkan pompa',
      'Periksa selang tidak tertekuk',
      'Pasang kembali dan test',
      'Ganti pompa jika perlu'
    ]
  }
];

export function TroubleshootScreen({ onBack }: TroubleshootScreenProps) {
  const [selectedProblem, setSelectedProblem] = useState<number | null>(null);

  if (selectedProblem !== null) {
    const problem = problems.find(p => p.id === selectedProblem);
    if (!problem) return null;

    return (
      <div className="min-h-screen pb-20">
        {/* Header */}
        <div className="bg-gradient-to-br from-emerald-600 via-teal-500 to-cyan-500 px-4 pt-4 pb-5">
          <button
            onClick={() => setSelectedProblem(null)}
            className="flex items-center gap-2 text-white mb-3 active:opacity-70"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Kembali</span>
          </button>
          <div className="flex items-center gap-3">
            <span className="text-4xl">{problem.icon}</span>
            <div>
              <h1 className="text-2xl text-white">{problem.title}</h1>
              <p className="text-orange-100 text-sm">Cara mengatasinya</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-4 pt-4 space-y-4">
          {/* Cause */}
          <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-100">
            <h3 className="text-gray-900 mb-3">Penyebab</h3>
            <p className="text-gray-700">{problem.cause}</p>
          </div>

          {/* Steps */}
          <div className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
            <h3 className="text-gray-900 mb-4">Cara Mengatasinya</h3>
            <div className="space-y-3">
              {problem.steps.map((step, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center flex-shrink-0">
                    {index + 1}
                  </div>
                  <p className="text-gray-700 pt-1">{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Tips Card */}
          <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">💡</span>
              <h3 className="text-emerald-900">Tips</h3>
            </div>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-sm text-emerald-800">
                <span className="text-emerald-600 flex-shrink-0">•</span>
                <span>Cek air tiap pagi dan sore hari</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-emerald-800">
                <span className="text-emerald-600 flex-shrink-0">•</span>
                <span>Jangan kasih pakan terlalu banyak, secukupnya saja</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-emerald-800">
                <span className="text-emerald-600 flex-shrink-0">•</span>
                <span>Bersihkan saringan tiap 3-7 hari sekali</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-emerald-800">
                <span className="text-emerald-600 flex-shrink-0">•</span>
                <span>Catat semua yang terjadi di buku harian</span>
              </li>
            </ul>
          </div>

          {/* Important Notes */}
          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">⚠️</span>
              <h3 className="text-amber-900">Ingat Ya</h3>
            </div>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-sm text-amber-800">
                <span className="text-amber-600 flex-shrink-0">•</span>
                <span>Kalau air berubah warna tiba-tiba, langsung cek saringan dan airnya</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-amber-800">
                <span className="text-amber-600 flex-shrink-0">•</span>
                <span>Jangan rubah pH terlalu cepat, harus pelan-pelan</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-amber-800">
                <span className="text-amber-600 flex-shrink-0">•</span>
                <span>Perhatikan tingkah ikan, kalau aneh berarti ada masalah</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

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
        <h1 className="text-2xl text-white mb-1">Kalau Ada Masalah</h1>
        <p className="text-orange-100 text-sm">Cara mengatasi masalah</p>
      </div>

      {/* Info */}
      <div className="px-4 pt-4 mb-4">
        <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-100">
          <div className="flex items-start gap-3">
            <span className="text-2xl">📖</span>
            <div>
              <h4 className="text-orange-900 mb-1">Penjelasan</h4>
              <p className="text-sm text-orange-800">
                Cara mengatasi masalah yang sering muncul waktu ternak ikan dan tanam sayur
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Problem List */}
      <div className="px-4 space-y-3">
        {problems.map((problem) => (
          <button
            key={problem.id}
            onClick={() => setSelectedProblem(problem.id)}
            className="w-full bg-white rounded-2xl p-5 shadow-sm hover:shadow-md active:scale-[0.98] transition-all flex items-center gap-4 border border-gray-100"
          >
            <span className="text-4xl">{problem.icon}</span>
            <div className="flex-1 text-left">
              <h3 className="text-gray-900 mb-1">{problem.title}</h3>
              <p className="text-sm text-gray-600">{problem.cause}</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
          </button>
        ))}
      </div>

      {/* Tip */}
      <div className="px-4 mt-4">
        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 shadow-sm">
          <h4 className="text-amber-900 mb-2">Tips</h4>
          <p className="text-sm text-amber-800">
            Kalau dicek tiap hari biasanya masalahnya gak sampai parah kok.
          </p>
        </div>
      </div>
    </div>
  );
}
