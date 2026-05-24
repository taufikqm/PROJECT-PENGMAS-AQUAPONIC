import { BookOpen, HelpCircle, AlertCircle, Calculator, Sprout, Filter, CheckSquare } from 'lucide-react';

interface HomeScreenProps {
  onNavigate: (page: string) => void;
}

const menuItems = [
  {
    id: 'tutorial',
    emoji: '📚',
    title: 'Cara Pakai Akuaponik',
    subtitle: 'Panduan dasar untuk pemula',
    color: 'bg-emerald-500'
  },
  {
    id: 'sensor',
    emoji: '🎓',
    title: 'Kalau Angka Berubah',
    subtitle: 'Artinya apa dan harus apa',
    color: 'bg-blue-500'
  },
  {
    id: 'troubleshoot',
    emoji: '🔧',
    title: 'Kalau Ada Masalah',
    subtitle: 'Cara mengatasi masalah',
    color: 'bg-orange-500'
  },
  {
    id: 'calculator',
    emoji: '🐟',
    title: 'Jumlah Ikan yang Cocok',
    subtitle: 'Berapa ikan yang pas',
    color: 'bg-cyan-500'
  },
  {
    id: 'nutrient',
    emoji: '🌱',
    title: 'Makanan Tanaman',
    subtitle: 'Cara kasih nutrisi',
    color: 'bg-green-500'
  },
  {
    id: 'filter',
    emoji: '💧',
    title: 'Susunan Saringan',
    subtitle: 'Cara kerja filter air',
    color: 'bg-indigo-500'
  },
  {
    id: 'checklist',
    emoji: '✅',
    title: 'Cek Harian',
    subtitle: 'Yang dicek setiap hari',
    color: 'bg-teal-500'
  }
];

export function HomeScreen({ onNavigate }: HomeScreenProps) {
  return (
    <div className="min-h-screen pb-20 bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-emerald-600 via-teal-500 to-cyan-500 px-6 pb-6 shadow-md mb-2 pt-[calc(env(safe-area-inset-top)+2.5rem)]">
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-shrink-0">
            <img 
              src="/aquatani-logo.png" 
              alt="AquaTani Logo" 
              className="w-16 h-16 object-contain drop-shadow-md" 
            />
          </div>
          <div>
            <h1 className="text-xl text-white font-semibold mb-1 leading-tight">
              Selamat Datang di AquaTani
            </h1>
            <p className="text-emerald-100 text-sm">
              Panduan Praktis Bertani Akuaponik
            </p>
          </div>
        </div>

        {/* Info Card */}
        <div className="bg-white rounded-2xl p-4 shadow-lg border border-white/50">
          <div className="flex items-start gap-3">
            <span className="text-3xl drop-shadow-sm">🌾</span>
            <div className="flex-1">
              <p className="text-sm text-emerald-900 leading-relaxed font-semibold">
                Panduan mudah cara ternak ikan dan tanam sayur dalam satu sistem
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 pt-4">
        {/* Menu Grid */}
        <div className="space-y-3 mb-6">
          {menuItems.map((item) => {
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className="w-full bg-white rounded-2xl p-4 shadow-sm hover:shadow-md active:scale-[0.98] transition-all flex items-center gap-4 border border-gray-100"
              >
                <div className={`${item.color} w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm`}>
                  <span className="text-3xl">{item.emoji}</span>
                </div>
                <div className="flex-1 text-left">
                  <h3 className="text-gray-900 mb-0.5">{item.title}</h3>
                  <p className="text-sm text-gray-500">{item.subtitle}</p>
                </div>
                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            );
          })}
        </div>

        {/* Tips Card */}
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 shadow-sm">
          <div className="flex items-start gap-3">
            <span className="text-2xl">💡</span>
            <div>
              <h4 className="text-blue-900 mb-1">Tips</h4>
              <p className="text-sm text-blue-800">
                Mulai dari "Cara Pakai Akuaponik" dulu ya biar paham cara kerjanya
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
