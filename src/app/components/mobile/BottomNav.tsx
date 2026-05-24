import { Home, BookOpen, HelpCircle, User } from 'lucide-react';

interface BottomNavProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function BottomNav({ currentPage, onNavigate }: BottomNavProps) {
  const navItems = [
    { id: 'home', icon: Home, label: 'Beranda' },
    { id: 'tutorial', icon: BookOpen, label: 'Panduan' },
    { id: 'sensor', icon: HelpCircle, label: 'Bantuan' },
    { id: 'profile', icon: User, label: 'Tentang' }
  ];

  return (
    <nav className="absolute bottom-0 left-0 right-0 z-50">
      <div className="bg-white border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.08)]">
        <div className="flex items-stretch justify-around h-16">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex flex-1 flex-col items-center justify-center gap-1 transition-colors relative ${
                  isActive
                    ? 'text-emerald-600'
                    : 'text-gray-500 active:bg-gray-100'
                }`}
              >
                {isActive && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-emerald-600 rounded-b-full"></div>
                )}
                <Icon className={`w-6 h-6 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                <span className={`text-xs ${isActive ? 'font-medium' : ''}`}>{item.label}</span>
              </button>
            );
          })}
        </div>
        <div className="h-[env(safe-area-inset-bottom)] bg-white"></div>
      </div>
    </nav>
  );
}
