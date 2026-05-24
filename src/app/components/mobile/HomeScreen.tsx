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
      <div className="bg-white px-6 pt-10 pb-8 shadow-sm mb-2 rounded-b-[2.5rem]">
        <div className="flex flex-col items-center text-center mb-6">
          <img 
            src="/aquatani-logo.png" 
            alt="AquaTani Logo" 
            className="w-48 h-auto object-contain drop-shadow-sm" 
          />
          <p className="text-emerald-600 font-medium mt-2">
            Panduan Praktis Bertani Akuaponik
          </p>
        </div>

        {/* Info Card */}
        <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100/50">
          <div className="flex items-start gap-3">
            <span className="text-3xl">🌾</span>
            <div className="flex-1">
              <p className="text-sm text-emerald-800 leading-relaxed font-medium">
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
