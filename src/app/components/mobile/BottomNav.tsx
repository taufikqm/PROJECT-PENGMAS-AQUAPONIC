import { Home, BookOpen, ClipboardList, CloudSun, User } from 'lucide-react';

interface BottomNavProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function BottomNav({ currentPage, onNavigate }: BottomNavProps) {
  const navItems = [
    { id: 'home', icon: Home, label: 'Beranda' },
    { id: 'tutorial', icon: BookOpen, label: 'Panduan' },
    { id: 'checklist', icon: ClipboardList, label: 'Tugas' },
    { id: 'weather', icon: CloudSun, label: 'Cuaca' },
    { id: 'profile', icon: User, label: 'Tentang' }
  ];

  return (
    <nav className="fixed bottom-0 w-full max-w-md z-50 left-1/2 -translate-x-1/2">
      <div className="relative bg-white border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.08)] overflow-visible">
        <div className="flex justify-around overflow-visible" style={{ height: '60px' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            const isChecklist = item.id === 'checklist';

            if (isChecklist) {
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className="relative flex flex-1 flex-col items-center"
                >
                  {/* Circle always floats above */}
                  <div className={`absolute left-1/2 -translate-x-1/2 w-12 h-12 rounded-full flex items-center justify-center shadow-md ring-[3px] ring-white transition-colors ${
                    isActive ? 'bg-emerald-600 shadow-emerald-200/60' : 'bg-emerald-500 shadow-emerald-100/50'
                  }`} style={{ top: '-20px' }}>
                    <Icon className="w-6 h-6 text-white stroke-2" />
                  </div>
                  {/* Label pinned to bottom */}
                  <span className={`absolute bottom-[13px] text-[10px] leading-none ${
                    isActive ? 'font-semibold text-emerald-600' : 'text-gray-400'
                  }`}>
                    {item.label}
                  </span>
                </button>
              );
            }

            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex flex-1 flex-col items-center justify-center gap-1 transition-colors relative ${
                  isActive ? 'text-emerald-600' : 'text-gray-400 active:bg-gray-50'
                }`}
              >
                {isActive && (
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-[3px] bg-emerald-600 rounded-t-full" />
                )}
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
                <span className={`text-[10px] leading-none ${isActive ? 'font-semibold' : ''}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
        <div className="h-[env(safe-area-inset-bottom)] bg-white" />
      </div>
    </nav>
  );
}
