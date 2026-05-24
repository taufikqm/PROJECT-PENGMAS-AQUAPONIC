import { BookOpen, Thermometer, Droplets, Sprout, Filter, CloudRain } from 'lucide-react';

const modules = [
  {
    icon: BookOpen,
    title: 'Dasar Akuaponik',
    description: 'Pelajari konsep dasar sistem akuaponik dan cara kerjanya',
    color: 'emerald',
    lessons: 5
  },
  {
    icon: Thermometer,
    title: 'Cara Membaca Sensor',
    description: 'Memahami pembacaan sensor pH, suhu, dan kelembaban',
    color: 'blue',
    lessons: 4
  },
  {
    icon: Droplets,
    title: 'Penanganan pH Air',
    description: 'Cara menstabilkan pH air untuk ikan dan tanaman',
    color: 'cyan',
    lessons: 6
  },
  {
    icon: Sprout,
    title: 'Pengaturan Nutrisi Tanaman',
    description: 'Kelola nutrisi untuk pertumbuhan tanaman optimal',
    color: 'green',
    lessons: 5
  },
  {
    icon: Filter,
    title: 'Sistem Filter Air',
    description: 'Perawatan dan pemeliharaan sistem filtrasi',
    color: 'indigo',
    lessons: 4
  },
  {
    icon: CloudRain,
    title: 'Penanganan Saat Hujan',
    description: 'Langkah antisipasi sistem saat musim hujan',
    color: 'slate',
    lessons: 3
  }
];

const colorClasses = {
  emerald: {
    bg: 'bg-emerald-100',
    icon: 'bg-emerald-500',
    text: 'text-emerald-900',
    button: 'bg-emerald-600 hover:bg-emerald-700'
  },
  blue: {
    bg: 'bg-blue-100',
    icon: 'bg-blue-500',
    text: 'text-blue-900',
    button: 'bg-blue-600 hover:bg-blue-700'
  },
  cyan: {
    bg: 'bg-cyan-100',
    icon: 'bg-cyan-500',
    text: 'text-cyan-900',
    button: 'bg-cyan-600 hover:bg-cyan-700'
  },
  green: {
    bg: 'bg-green-100',
    icon: 'bg-green-500',
    text: 'text-green-900',
    button: 'bg-green-600 hover:bg-green-700'
  },
  indigo: {
    bg: 'bg-indigo-100',
    icon: 'bg-indigo-500',
    text: 'text-indigo-900',
    button: 'bg-indigo-600 hover:bg-indigo-700'
  },
  slate: {
    bg: 'bg-slate-100',
    icon: 'bg-slate-500',
    text: 'text-slate-900',
    button: 'bg-slate-600 hover:bg-slate-700'
  }
};

export function TutorialModules() {
  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="mb-2 text-emerald-900">Modul Pembelajaran</h1>
          <p className="text-gray-600">Pilih modul untuk memulai belajar</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module, index) => {
            const Icon = module.icon;
            const colors = colorClasses[module.color as keyof typeof colorClasses];

            return (
              <div
                key={index}
                className={`${colors.bg} rounded-xl p-6 shadow-md hover:shadow-xl transition-all cursor-pointer`}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className={`${colors.icon} rounded-lg p-3 flex-shrink-0`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className={`${colors.text} mb-1`}>{module.title}</h3>
                    <p className="text-sm text-gray-700">{module.description}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-300">
                  <span className="text-sm text-gray-600">{module.lessons} pelajaran</span>
                  <button className={`${colors.button} text-white px-4 py-2 rounded-lg text-sm transition-colors`}>
                    Pelajari
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Progress Overview */}
        <div className="mt-12 bg-white rounded-xl shadow-md p-6">
          <h2 className="mb-4 text-emerald-900">Progres Belajar Anda</h2>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Total Modul Selesai</span>
                <span className="text-sm">0/6</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-emerald-500 h-3 rounded-full" style={{ width: '0%' }}></div>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              Mulai perjalanan belajar Anda dengan memilih modul pertama!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
