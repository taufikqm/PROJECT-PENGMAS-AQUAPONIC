import { BookOpen, HelpCircle, AlertCircle, Calculator, Sprout, Filter, CheckSquare } from 'lucide-react';

interface HomeScreenProps {
  onNavigate: (page: string) => void;
}

const menuItems = [
  {
    id: 'tutorial',
    icon: '/icons/tutorial.png',
    title: 'Belajar Dasar Akuaponik',
    subtitle: 'Langkah awal untuk pemula',
    cardColor: 'bg-emerald-50 border-emerald-100',
    titleColor: 'text-emerald-900',
    subtitleColor: 'text-emerald-700'
  },
  {
    id: 'sensor',
    icon: '/icons/sensor.png',
    title: 'Cek Kondisi Air',
    subtitle: 'Cara baca alat ukur dan artinya',
    cardColor: 'bg-blue-50 border-blue-100',
    titleColor: 'text-blue-900',
    subtitleColor: 'text-blue-700'
  },
  {
    id: 'troubleshoot',
    icon: '/icons/clinic.png',
    title: 'Klinik Masalah',
    subtitle: 'Solusi ikan sakit & tanaman layu',
    cardColor: 'bg-orange-50 border-orange-100',
    titleColor: 'text-orange-900',
    subtitleColor: 'text-orange-700'
  },
  {
    id: 'calculator',
    icon: '/icons/calculator.png',
    title: 'Hitung Isi Kolam',
    subtitle: 'Berapa banyak ikan yang pas?',
    cardColor: 'bg-cyan-50 border-cyan-100',
    titleColor: 'text-cyan-900',
    subtitleColor: 'text-cyan-700'
  },
  {
    id: 'nutrient',
    icon: '/icons/nutrient.png',
    title: 'Pakan & Nutrisi',
    subtitle: 'Aturan kasih makan dan pupuk',
    cardColor: 'bg-green-50 border-green-100',
    titleColor: 'text-green-900',
    subtitleColor: 'text-green-700'
  },
  {
    id: 'filter',
    icon: '/icons/filter.png',
    title: 'Kebersihan Saringan',
    subtitle: 'Cara merawat penyaring air',
    cardColor: 'bg-indigo-50 border-indigo-100',
    titleColor: 'text-indigo-900',
    subtitleColor: 'text-indigo-700'
  },
  {
    id: 'checklist',
    icon: '/icons/checklist.png',
    title: 'Tugas Harian',
    subtitle: 'Daftar yang harus dicek tiap hari',
    cardColor: 'bg-teal-50 border-teal-100',
    titleColor: 'text-teal-900',
    subtitleColor: 'text-teal-700'
  }
];

export function HomeScreen({ onNavigate }: HomeScreenProps) {
  return (
    <div className="min-h-screen pb-20 bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-emerald-600 via-teal-500 to-cyan-500 px-6 pt-10 pb-6 shadow-md mb-2">
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
                className={`w-full ${item.cardColor} border rounded-2xl p-4 shadow-sm hover:shadow-md active:scale-[0.98] transition-all flex items-center gap-4`}
              >
                <div className="bg-white w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 p-1.5 shadow-sm border border-white/50">
                  <img src={item.icon} alt={item.title} className="w-full h-full object-contain contrast-125" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className={`${item.titleColor} font-semibold mb-0.5`}>{item.title}</h3>
                  <p className={`text-sm ${item.subtitleColor}`}>{item.subtitle}</p>
                </div>
                <svg className={`w-5 h-5 ${item.subtitleColor} opacity-70`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
