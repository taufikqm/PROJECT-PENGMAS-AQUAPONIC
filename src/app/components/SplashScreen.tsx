import { useEffect } from 'react';

export function SplashScreen({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-emerald-500 to-emerald-700 flex items-center justify-center">
      <div className="text-center animate-fadeIn">
        {/* Logo */}
        <div className="relative w-32 h-32 mx-auto mb-8">
          <div className="absolute inset-0 bg-white rounded-3xl shadow-2xl flex items-center justify-center">
            <div className="text-6xl">🌱💧</div>
          </div>
        </div>

        {/* App Name */}
        <h1 className="text-3xl text-white mb-2">AquaTani</h1>
        <p className="text-emerald-100 text-lg">Panduan Akuaponik Pintar</p>
        <p className="text-emerald-200 text-sm mt-2">Belajar Budidaya Akuaponik</p>

        {/* Loading indicator */}
        <div className="mt-12 flex justify-center">
          <div className="flex gap-2">
            <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
            <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>

        {/* Version */}
        <p className="text-emerald-200 text-xs mt-16">Aplikasi Edukasi - Versi 1.0</p>
      </div>
    </div>
  );
}
