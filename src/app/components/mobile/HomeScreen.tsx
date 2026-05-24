import { useState, useEffect } from 'react';

interface HomeScreenProps {
  onNavigate: (page: string) => void;
}

const menuItems = [
  {
    id: 'tutorial',
    icon: '/icons/tutorial.png',
    title: 'Belajar Dasar Akuaponik',
    subtitle: 'Langkah awal untuk pemula',
    color: 'bg-emerald-200'
  },
  {
    id: 'sensor',
    icon: '/icons/sensor.png',
    title: 'Cek Kondisi Air',
    subtitle: 'Cara baca alat ukur dan artinya',
    color: 'bg-blue-200'
  },
  {
    id: 'weather',
    icon: '/icons/weather.png',
    title: 'Prakiraan Cuaca Lahan',
    subtitle: 'Saran harian untuk kolam & tanaman',
    color: 'bg-amber-200'
  },
  {
    id: 'troubleshoot',
    icon: '/icons/clinic.png',
    title: 'Klinik Masalah',
    subtitle: 'Solusi ikan sakit & tanaman layu',
    color: 'bg-orange-200'
  },
  {
    id: 'calculator',
    icon: '/icons/calculator.png',
    title: 'Hitung Isi Kolam',
    subtitle: 'Berapa banyak ikan yang pas?',
    color: 'bg-cyan-200'
  },
  {
    id: 'nutrient',
    icon: '/icons/nutrient.png',
    title: 'Pakan & Nutrisi',
    subtitle: 'Aturan kasih makan dan pupuk',
    color: 'bg-green-200'
  },
  {
    id: 'filter',
    icon: '/icons/filter.png',
    title: 'Kebersihan Saringan',
    subtitle: 'Cara merawat penyaring air',
    color: 'bg-indigo-200'
  },
  {
    id: 'checklist',
    icon: '/icons/checklist.png',
    title: 'Tugas Harian',
    subtitle: 'Daftar yang harus dicek tiap hari',
    color: 'bg-teal-200'
  }
];

export function HomeScreen({ onNavigate }: HomeScreenProps) {
  const [isOnline, setIsOnline] = useState(() => typeof navigator !== 'undefined' ? navigator.onLine : true);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div className="min-h-screen pb-20 bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-emerald-600 via-teal-500 to-cyan-500 px-6 pt-10 pb-6 shadow-md mb-2">
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-shrink-0">
            <img 
              src="/aquatani-logo.png" 
              alt="AquaTani Logo" 
              className="w-20 h-20 object-contain drop-shadow-md" 
            />
          </div>
          <div className="flex-1">
            <h1 className="text-xl text-white font-semibold mb-1 leading-tight">
              Selamat Datang di AquaTani
            </h1>
            <p className="text-emerald-100 text-xs mb-2">
              Panduan Praktis Bertani Akuaponik
            </p>
            
            {/* Connection Status Micro Pill */}
            <div>
              {isOnline ? (
                <div className="bg-white/15 backdrop-blur-sm text-white text-[9px] font-bold border border-white/20 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1.5 shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-300 animate-pulse shadow-[0_0_6px_rgba(34,211,238,0.8)]"></span>
                  <span>Online</span>
                </div>
              ) : (
                <div className="bg-amber-500/20 backdrop-blur-sm text-amber-200 text-[9px] font-bold border border-amber-500/30 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1.5 shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_4px_rgba(245,158,11,0.7)]"></span>
                  <span>Offline</span>
                </div>
              )}
            </div>
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
        {/* Tips Card */}
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 shadow-sm mb-6">
          <div className="flex items-start gap-3">
            <span className="text-2xl drop-shadow-sm">💡</span>
            <div>
              <h4 className="text-blue-900 font-semibold mb-1">Tips Memulai</h4>
              <p className="text-sm text-blue-800 leading-relaxed">
                Mulai dari menu <strong>"Belajar Dasar Akuaponik"</strong> agar lebih paham cara kerjanya.
              </p>
            </div>
          </div>
        </div>

        {/* Menu Grid */}
        <div className="space-y-3 mb-6">
          {menuItems.map((item) => {
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className="w-full bg-white/90 backdrop-blur-sm border border-white rounded-2xl p-4 shadow-sm hover:shadow-md active:scale-[0.98] transition-all flex items-center gap-4"
              >
                <div className={`${item.color} w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 p-1.5 shadow-inner`}>
                  <img src={item.icon} alt={item.title} className="w-full h-full object-contain mix-blend-multiply contrast-[1.25] brightness-[1.05]" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="text-gray-900 font-semibold mb-0.5">{item.title}</h3>
                  <p className="text-sm text-gray-500">{item.subtitle}</p>
                </div>
                <svg className="w-5 h-5 text-gray-400 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
