import { useState } from 'react';
import * as Checkbox from '@radix-ui/react-checkbox';
import { Check, RefreshCw, Award } from 'lucide-react';

interface ChecklistItem {
  id: string;
  task: string;
  description: string;
  category: 'morning' | 'afternoon';
}

const checklistItems: ChecklistItem[] = [
  {
    id: 'ph',
    task: 'Cek pH Air',
    description: 'Pastikan pH dalam rentang 6.5-7.5',
    category: 'morning'
  },
  {
    id: 'temp',
    task: 'Cek Suhu Air',
    description: 'Suhu ideal 25-30°C',
    category: 'morning'
  },
  {
    id: 'water-level',
    task: 'Cek Ketinggian Air',
    description: 'Pastikan level air 80-90%',
    category: 'morning'
  },
  {
    id: 'pump',
    task: 'Cek Pompa',
    description: 'Pastikan pompa berfungsi normal',
    category: 'morning'
  },
  {
    id: 'feed-morning',
    task: 'Beri Pakan Ikan',
    description: 'Pakan pagi: 2-3% berat ikan',
    category: 'morning'
  },
  {
    id: 'fish-behavior',
    task: 'Amati Perilaku Ikan',
    description: 'Perhatikan ikan yang lemas atau sakit',
    category: 'morning'
  },
  {
    id: 'plants',
    task: 'Periksa Tanaman',
    description: 'Buang daun mati, cek hama',
    category: 'afternoon'
  },
  {
    id: 'feed-afternoon',
    task: 'Beri Pakan Ikan',
    description: 'Pakan sore: 2-3% berat ikan',
    category: 'afternoon'
  },
  {
    id: 'filter',
    task: 'Cek Filter',
    description: 'Pastikan filter tidak tersumbat',
    category: 'afternoon'
  },
  {
    id: 'notes',
    task: 'Catat di Buku Harian',
    description: 'Tulis kondisi hari ini',
    category: 'afternoon'
  }
];

export function DailyChecklist() {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [notes, setNotes] = useState('');

  const toggleItem = (id: string) => {
    setCheckedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const resetChecklist = () => {
    setCheckedItems({});
    setNotes('');
  };

  const morningItems = checklistItems.filter(item => item.category === 'morning');
  const afternoonItems = checklistItems.filter(item => item.category === 'afternoon');

  const completedCount = Object.values(checkedItems).filter(Boolean).length;
  const totalCount = checklistItems.length;
  const progressPercent = (completedCount / totalCount) * 100;

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="mb-2 text-emerald-900">Checklist Harian</h1>
          <p className="text-gray-600">Pastikan semua tugas perawatan selesai</p>
        </div>

        {/* Progress Card */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-emerald-900">Progres Hari Ini</h2>
            <button
              onClick={resetChecklist}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-emerald-600 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Reset
            </button>
          </div>

          <div className="mb-2">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span>Tugas Selesai</span>
              <span>{completedCount}/{totalCount}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <div
                className="bg-gradient-to-r from-emerald-500 to-green-500 h-4 transition-all duration-500 flex items-center justify-end pr-2"
                style={{ width: `${progressPercent}%` }}
              >
                {progressPercent >= 20 && (
                  <span className="text-xs text-white">
                    {Math.round(progressPercent)}%
                  </span>
                )}
              </div>
            </div>
          </div>

          {progressPercent === 100 && (
            <div className="mt-4 bg-emerald-50 border-2 border-emerald-300 rounded-lg p-4 flex items-center gap-3">
              <Award className="w-8 h-8 text-emerald-600" />
              <div>
                <p className="text-emerald-900">Selamat!</p>
                <p className="text-sm text-emerald-700">
                  Semua tugas hari ini sudah selesai. Sistem akuaponik Anda terawat dengan baik!
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Morning Checklist */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
            <h2 className="text-gray-900">Pagi Hari (07:00 - 09:00)</h2>
          </div>

          <div className="space-y-3">
            {morningItems.map(item => (
              <div
                key={item.id}
                className={`border-2 rounded-lg p-4 transition-all ${
                  checkedItems[item.id]
                    ? 'bg-emerald-50 border-emerald-300'
                    : 'bg-white border-gray-200 hover:border-emerald-200'
                }`}
              >
                <div className="flex items-start gap-4">
                  <Checkbox.Root
                    id={item.id}
                    checked={checkedItems[item.id] || false}
                    onCheckedChange={() => toggleItem(item.id)}
                    className="w-6 h-6 rounded border-2 border-gray-300 flex items-center justify-center bg-white data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600 flex-shrink-0 mt-0.5"
                  >
                    <Checkbox.Indicator>
                      <Check className="w-4 h-4 text-white" />
                    </Checkbox.Indicator>
                  </Checkbox.Root>

                  <label htmlFor={item.id} className="flex-1 cursor-pointer">
                    <p className={`mb-1 ${checkedItems[item.id] ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                      {item.task}
                    </p>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Afternoon Checklist */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            <h2 className="text-gray-900">Sore Hari (16:00 - 18:00)</h2>
          </div>

          <div className="space-y-3">
            {afternoonItems.map(item => (
              <div
                key={item.id}
                className={`border-2 rounded-lg p-4 transition-all ${
                  checkedItems[item.id]
                    ? 'bg-emerald-50 border-emerald-300'
                    : 'bg-white border-gray-200 hover:border-emerald-200'
                }`}
              >
                <div className="flex items-start gap-4">
                  <Checkbox.Root
                    id={item.id}
                    checked={checkedItems[item.id] || false}
                    onCheckedChange={() => toggleItem(item.id)}
                    className="w-6 h-6 rounded border-2 border-gray-300 flex items-center justify-center bg-white data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600 flex-shrink-0 mt-0.5"
                  >
                    <Checkbox.Indicator>
                      <Check className="w-4 h-4 text-white" />
                    </Checkbox.Indicator>
                  </Checkbox.Root>

                  <label htmlFor={item.id} className="flex-1 cursor-pointer">
                    <p className={`mb-1 ${checkedItems[item.id] ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                      {item.task}
                    </p>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notes Section */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-gray-900 mb-4">Catatan Hari Ini</h2>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Tulis catatan penting tentang kondisi sistem akuaponik hari ini..."
            className="w-full h-32 px-4 py-3 border-2 border-gray-300 rounded-lg resize-none focus:outline-none focus:border-emerald-500"
          />
          <p className="text-xs text-gray-500 mt-2">
            Contoh: "pH turun dari 7.0 ke 6.5 setelah hujan deras" atau "Tanaman kangkung siap panen"
          </p>
        </div>
      </div>
    </div>
  );
}
