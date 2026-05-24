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
import { AboutScreen } from './components/mobile/AboutScreen';
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
        return <AboutScreen onBack={() => handleNavigate('home')} />;
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