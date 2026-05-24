import { useState, useEffect } from 'react';
import { ArrowLeft, Check } from 'lucide-react';
import * as Checkbox from '@radix-ui/react-checkbox';

interface ChecklistScreenProps {
  onBack: () => void;
}

const tasks = [
  { id: 1, task: 'Ukur pH Air dengan kertas lakmus', time: 'Pagi', description: 'Target: 6.5-7.5' },
  { id: 2, task: 'Ukur Suhu Air dengan termometer', time: 'Pagi', description: 'Target: 25-30°C' },
  { id: 3, task: 'Cek Ketinggian Air visual', time: 'Pagi', description: 'Target: 80-90%' },
  { id: 4, task: 'Dengar bunyi pompa normal', time: 'Pagi', description: 'Harus lancar' },
  { id: 5, task: 'Beri Pakan Ikan 2-3%', time: 'Pagi', description: 'Jangan berlebihan' },
  { id: 6, task: 'Amati perilaku ikan', time: 'Pagi', description: 'Cek ikan lemas/sakit' },
  { id: 7, task: 'Periksa daun tanaman', time: 'Sore', description: 'Buang daun mati' },
  { id: 8, task: 'Beri Pakan Ikan 2-3%', time: 'Sore', description: 'Porsi sama pagi' },
  { id: 9, task: 'Cek Filter tidak tersumbat', time: 'Sore', description: 'Air harus lancar' },
  { id: 10, task: 'Catat di Buku Harian', time: 'Sore', description: 'Tulis kondisi hari ini' }
];

export function ChecklistScreen({ onBack }: ChecklistScreenProps) {
  // Load tasks status from LocalStorage, auto-reset if the day has changed
  const [checked, setChecked] = useState<Record<number, boolean>>(() => {
    try {
      const todayStr = new Date().toDateString();
      const savedDate = localStorage.getItem('aquatani_checklist_date');
      if (savedDate !== todayStr) {
        localStorage.setItem('aquatani_checklist_date', todayStr);
        localStorage.removeItem('aquatani_checklist');
        return {};
      }
      const saved = localStorage.getItem('aquatani_checklist');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  // Load and bind notes
  const [note, setNote] = useState(() => {
    try {
      return localStorage.getItem('aquatani_notes') || '';
    } catch (e) {
      return '';
    }
  });

  // Persist to LocalStorage when changed
  useEffect(() => {
    localStorage.setItem('aquatani_checklist', JSON.stringify(checked));
  }, [checked]);

  useEffect(() => {
    localStorage.setItem('aquatani_notes', note);
  }, [note]);

  const toggleTask = (id: number) => {
    setChecked(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const completedCount = Object.values(checked).filter(Boolean).length;
  const progress = (completedCount / tasks.length) * 100;

  const morningTasks = tasks.filter(t => t.time === 'Pagi');
  const eveningTasks = tasks.filter(t => t.time === 'Sore');

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="bg-teal-600 px-4 pt-4 pb-5">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-white mb-3 active:opacity-70"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Kembali</span>
        </button>
        <h1 className="text-2xl text-white mb-1">Cek Harian</h1>
        <p className="text-teal-100 text-sm">Yang dicek setiap hari</p>
      </div>

      {/* Info */}
      <div className="px-4 pt-4 mb-4">
        <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-100">
          <div className="flex items-start gap-3">
            <span className="text-2xl">📝</span>
            <div>
              <h4 className="text-teal-900 mb-1">Penjelasan</h4>
              <p className="text-sm text-teal-800">
                Ini daftar hal-hal yang harus dicek tiap hari biar akuaponiknya sehat
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="px-4 mb-4">
        <div className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-700">Sudah Dicek</span>
            <span className="text-sm text-emerald-600">{completedCount}/{tasks.length}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-emerald-500 to-green-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          {progress === 100 && (
            <div className="mt-4 text-center">
              <span className="text-2xl">🎉</span>
              <p className="text-sm text-emerald-600 mt-1">Semua sudah dicek!</p>
            </div>
          )}
        </div>
      </div>

      {/* Morning Tasks */}
      <div className="px-4 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
          <h2 className="text-gray-900">Pagi Hari</h2>
        </div>
        <div className="space-y-2">
          {morningTasks.map((task) => (
            <div
              key={task.id}
              className={`bg-white rounded-xl p-4 shadow-sm transition-all ${
                checked[task.id] ? 'bg-emerald-50' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <Checkbox.Root
                  id={`task-${task.id}`}
                  checked={checked[task.id] || false}
                  onCheckedChange={() => toggleTask(task.id)}
                  className="w-6 h-6 rounded-lg border-2 border-gray-300 flex items-center justify-center bg-white data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600 flex-shrink-0"
                >
                  <Checkbox.Indicator>
                    <Check className="w-4 h-4 text-white" />
                  </Checkbox.Indicator>
                </Checkbox.Root>
                <label
                  htmlFor={`task-${task.id}`}
                  className="flex-1 cursor-pointer"
                >
                  <p className={`${checked[task.id] ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                    {task.task}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">{task.description}</p>
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Evening Tasks */}
      <div className="px-4 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
          <h2 className="text-gray-900">Sore Hari</h2>
        </div>
        <div className="space-y-2">
          {eveningTasks.map((task) => (
            <div
              key={task.id}
              className={`bg-white rounded-xl p-4 shadow-sm transition-all ${
                checked[task.id] ? 'bg-emerald-50' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <Checkbox.Root
                  id={`task-${task.id}`}
                  checked={checked[task.id] || false}
                  onCheckedChange={() => toggleTask(task.id)}
                  className="w-6 h-6 rounded-lg border-2 border-gray-300 flex items-center justify-center bg-white data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600 flex-shrink-0"
                >
                  <Checkbox.Indicator>
                    <Check className="w-4 h-4 text-white" />
                  </Checkbox.Indicator>
                </Checkbox.Root>
                <label
                  htmlFor={`task-${task.id}`}
                  className="flex-1 cursor-pointer"
                >
                  <p className={`${checked[task.id] ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                    {task.task}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">{task.description}</p>
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div className="px-4">
        <div className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
          <h3 className="text-gray-900 mb-3">Catatan</h3>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Tulis yang penting hari ini..."
            className="w-full h-24 px-4 py-3 border-2 border-gray-300 rounded-xl resize-none focus:outline-none focus:border-teal-500 text-gray-800"
          />
        </div>
      </div>
    </div>
  );
}
