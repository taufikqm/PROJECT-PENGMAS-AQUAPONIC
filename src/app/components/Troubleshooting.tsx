import * as Accordion from '@radix-ui/react-accordion';
import { ChevronDown, AlertCircle, Lightbulb } from 'lucide-react';

const problems = [
  {
    title: 'pH turun setelah hujan',
    cause: 'Air hujan bersifat asam dan mengencerkan air kolam, menurunkan pH secara drastis.',
    solution: 'Tambahkan kapur pertanian (CaCO3) atau baking soda untuk menaikkan pH secara bertahap.',
    steps: [
      'Ukur pH air saat ini',
      'Tambahkan 1 sendok makan kapur per 100 liter air',
      'Aduk rata dan tunggu 30 menit',
      'Ukur kembali dan ulangi jika perlu',
      'Jangan naikkan pH lebih dari 0.5 dalam sekali waktu'
    ]
  },
  {
    title: 'Air keruh',
    cause: 'Terlalu banyak pakan yang tidak termakan, atau filter tersumbat.',
    solution: 'Bersihkan filter dan kurangi porsi pakan ikan.',
    steps: [
      'Matikan pompa sementara',
      'Bersihkan filter mekanik dari kotoran',
      'Cuci media biofilter dengan air kolam (jangan air keran)',
      'Kurangi pakan ikan 50% selama 2 hari',
      'Nyalakan kembali pompa'
    ]
  },
  {
    title: 'Ikan lemas',
    cause: 'Kadar oksigen rendah atau kualitas air buruk (pH tidak sesuai, amonia tinggi).',
    solution: 'Tambah aerator dan periksa kualitas air segera.',
    steps: [
      'Pasang aerator tambahan atau batu gelembung',
      'Cek pH air - harus 6.5-7.5',
      'Cek suhu air - harus 25-30°C',
      'Ganti 20% air dengan air bersih',
      'Hentikan pemberian pakan selama 1 hari',
      'Hubungi ahli jika kondisi tidak membaik dalam 24 jam'
    ]
  },
  {
    title: 'Tanaman menguning',
    cause: 'Kekurangan nutrisi (terutama nitrogen) atau pH air terlalu tinggi/rendah.',
    solution: 'Sesuaikan pH ke rentang 6.5-7.0 dan tambah jumlah ikan atau pakan.',
    steps: [
      'Cek pH air - ideal untuk tanaman: 6.5-7.0',
      'Pastikan padat tebar ikan sesuai (1 kg ikan per 50 liter)',
      'Tambah frekuensi pemberian pakan ikan',
      'Pangkas daun yang sudah kuning',
      'Pantau pertumbuhan daun baru dalam 1 minggu'
    ]
  },
  {
    title: 'Pompa tidak mengalir',
    cause: 'Pompa tersumbat kotoran, selang tertekuk, atau pompa rusak.',
    solution: 'Periksa dan bersihkan pompa, pastikan selang tidak tertekuk.',
    steps: [
      'Matikan listrik pompa',
      'Lepas pompa dari kolam',
      'Buka casing pompa dan bersihkan impeller dari kotoran',
      'Periksa selang - luruskan jika tertekuk',
      'Pasang kembali dan test',
      'Ganti pompa jika masih tidak berfungsi'
    ]
  }
];

export function Troubleshooting() {
  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="mb-2 text-emerald-900">Pemecahan Masalah</h1>
          <p className="text-gray-600">Solusi untuk masalah umum dalam sistem akuaponik</p>
        </div>

        {/* Quick Help Banner */}
        <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-6 mb-8">
          <div className="flex items-start gap-3">
            <div className="bg-amber-500 rounded-lg p-2 flex-shrink-0">
              <Lightbulb className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-amber-900 mb-2">Tips Pencegahan</h3>
              <p className="text-sm text-amber-800">
                Kebanyakan masalah bisa dicegah dengan pengecekan rutin setiap hari.
                Gunakan checklist harian untuk memastikan semua parameter dalam kondisi baik.
              </p>
            </div>
          </div>
        </div>

        {/* Accordion */}
        <Accordion.Root type="single" collapsible className="space-y-4">
          {problems.map((problem, index) => (
            <Accordion.Item
              key={index}
              value={`item-${index}`}
              className="bg-white rounded-xl shadow-md overflow-hidden"
            >
              <Accordion.Header>
                <Accordion.Trigger className="w-full flex items-center justify-between p-6 text-left hover:bg-background transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className="bg-red-100 rounded-lg p-2">
                      <AlertCircle className="w-5 h-5 text-red-600" />
                    </div>
                    <h3 className="text-gray-900">{problem.title}</h3>
                  </div>
                  <ChevronDown className="w-5 h-5 text-gray-500 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                </Accordion.Trigger>
              </Accordion.Header>

              <Accordion.Content className="data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp overflow-hidden">
                <div className="px-6 pb-6 space-y-4">
                  {/* Cause */}
                  <div className="bg-red-50 rounded-lg p-4">
                    <h4 className="text-sm text-red-900 mb-2">Penyebab:</h4>
                    <p className="text-sm text-red-800">{problem.cause}</p>
                  </div>

                  {/* Solution */}
                  <div className="bg-emerald-50 rounded-lg p-4">
                    <h4 className="text-sm text-emerald-900 mb-2">Solusi:</h4>
                    <p className="text-sm text-emerald-800">{problem.solution}</p>
                  </div>

                  {/* Steps */}
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="text-sm text-blue-900 mb-3">Langkah Cepat:</h4>
                    <ol className="space-y-2">
                      {problem.steps.map((step, stepIndex) => (
                        <li key={stepIndex} className="flex items-start gap-2 text-sm text-blue-800">
                          <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 text-xs">
                            {stepIndex + 1}
                          </span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              </Accordion.Content>
            </Accordion.Item>
          ))}
        </Accordion.Root>

        {/* Help Contact */}
        <div className="mt-8 bg-white rounded-xl shadow-md p-6 text-center">
          <h3 className="text-gray-900 mb-2">Butuh Bantuan Lebih Lanjut?</h3>
          <p className="text-sm text-gray-600 mb-4">
            Jika masalah masih berlanjut, hubungi tim pendamping komunitas Anda
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg transition-colors">
              WhatsApp Support
            </button>
            <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg transition-colors">
              Lihat Video Tutorial
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
