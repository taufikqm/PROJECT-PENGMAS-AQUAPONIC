import { useState } from 'react';
import { SplashScreen } from './components/SplashScreen';
import { HomeScreen } from './components/mobile/HomeScreen';
import { TutorialScreen } from './components/mobile/TutorialScreen';
import { SensorScreen } from './components/mobile/SensorScreen';
import { TroubleshootScreen } from './components/mobile/TroubleshootScreen';
import { CalculatorScreen } from './components/mobile/CalculatorScreen';
import { FilterScreen } from './components/mobile/FilterScreen';
import { ChecklistScreen } from './components/mobile/ChecklistScreen';
import { NutrientScreen } from './components/mobile/NutrientScreen';
import { BottomNav } from './components/mobile/BottomNav';

type Page = 'home' | 'tutorial' | 'sensor' | 'troubleshoot' | 'calculator' | 'nutrient' | 'filter' | 'checklist' | 'profile';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [currentPage, setCurrentPage] = useState<Page>('home');

  const handleNavigate = (page: string) => {
    setCurrentPage(page as Page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomeScreen onNavigate={handleNavigate} />;
      case 'tutorial':
        return <TutorialScreen onBack={() => handleNavigate('home')} />;
      case 'sensor':
        return <SensorScreen onBack={() => handleNavigate('home')} />;
      case 'troubleshoot':
        return <TroubleshootScreen onBack={() => handleNavigate('home')} />;
      case 'calculator':
        return <CalculatorScreen onBack={() => handleNavigate('home')} />;
      case 'filter':
        return <FilterScreen onBack={() => handleNavigate('home')} />;
      case 'checklist':
        return <ChecklistScreen onBack={() => handleNavigate('home')} />;
      case 'nutrient':
        return <NutrientScreen onBack={() => handleNavigate('home')} />;
      case 'profile':
        return (
          <div className="pb-20 px-4 pt-8">
            <div className="max-w-md mx-auto">
              <h1 className="text-2xl text-gray-900 mb-6">Tentang Aplikasi</h1>
              <div className="bg-white rounded-2xl p-6 shadow-md text-center mb-4">
                <div className="w-28 h-28 rounded-full mx-auto mb-4 flex items-center justify-center bg-white overflow-hidden" style={{ boxShadow: '0 8px 32px 0 rgba(16, 120, 60, 0.18), 0 2px 12px 0 rgba(0,0,0,0.13)' }}>
                  <img
                    src="/aquatani-logo.png"
                    alt="Logo AquaTani"
                    className="w-full h-full object-contain p-1"
                  />
                </div>
                <h2 className="text-gray-900 mb-1">AquaTani</h2>
                <p className="text-sm text-gray-600 mb-2">Panduan Akuaponik Pintar</p>
                <p className="text-xs text-gray-500">Aplikasi Edukasi v1.0</p>
              </div>

              <div className="bg-white rounded-2xl p-5 shadow-md mb-4">
                <h3 className="text-gray-900 mb-3">Tentang Aplikasi</h3>
                <p className="text-sm text-gray-700 mb-3">
                  AquaTani adalah aplikasi panduan edukasi untuk petani dan program pengabdian masyarakat dalam belajar budidaya akuaponik.
                </p>
                <p className="text-sm text-gray-700">
                  Aplikasi ini memberikan panduan operasional, cara membaca nilai sensor, penanganan masalah, dan tips budidaya.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-5 shadow-md mb-4">
                <h3 className="text-gray-900 mb-4 font-semibold text-lg border-b pb-2">Latar Belakang Proyek</h3>

                <div className="mb-4">
                  <h4 className="text-emerald-700 font-semibold mb-1 flex items-center gap-2">
                    <span>🎯</span> Tujuan
                  </h4>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    Berawal dari tantangan di lapangan di mana sistem akuaponik berbasis IoT sulit dipahami operasionalnya oleh masyarakat, proyek pengabdian masyarakat ini hadir sebagai solusi <em>e-learning</em>. Kami berharap AquaTani dapat memandu Anda untuk memahami dan memanfaatkan teknologi akuaponik secara mandiri.
                  </p>
                </div>

                <div className="mb-4">
                  <h4 className="text-emerald-700 font-semibold mb-1 flex items-center gap-2">
                    <span>🌱</span> Manfaat
                  </h4>
                  <p className="text-sm text-gray-700 leading-relaxed mb-2">
                    Aplikasi AquaTani dirancang untuk membawa dampak positif, seperti:
                  </p>
                  <ul className="text-sm text-gray-700 list-disc pl-5 space-y-1">
                    <li>Mendukung ke  berlanjutan praktik <em>urban farming</em>.</li>
                    <li>Meningkatkan ketahanan pangan perkotaan melalui pemanfaatan teknologi.</li>
                    <li>Memberdayakan masyarakat agar semakin melek teknologi pertanian modern.</li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-emerald-700 font-semibold mb-1 flex items-center gap-2">
                    <span>👥</span> Tim Pengembang
                  </h4>
                  <p className="text-sm text-gray-700 leading-relaxed mb-2">
                    Dikembangkan oleh mahasiswa S1 Sistem Informasi, Fakultas Rekayasa Industri, Telkom University :
                  </p>
                  <ul className="text-sm text-gray-700 list-disc pl-5 space-y-1">
                    <li>Arjuna Dwi Putra Kunaefi</li>
                    <li>Bian Kamal Sutanto</li>
                    <li>Muhammad Azka Al Mulki Suwardana</li>
                    <li>Raihan Tri Darma</li>
                    <li>Rangga Putra Kusuma</li>
                    <li>Rara Lianisyah</li>
                    <li>Taufik Qurrohman</li>
                    <li>Valerina Sherin Saprita</li>
                  </ul>
                </div>
              </div>

              <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">💡</span>
                  <div>
                    <h4 className="text-blue-900 mb-1">Catatan</h4>
                    <p className="text-sm text-blue-800">
                      Aplikasi ini hanya untuk panduan edukasi dan pembelajaran, bukan sistem monitoring real-time
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return <HomeScreen onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="min-h-screen max-w-md mx-auto bg-white relative">
        <main>
          {renderPage()}
        </main>
        <BottomNav currentPage={currentPage} onNavigate={handleNavigate} />
      </div>
    </div>
  );
}