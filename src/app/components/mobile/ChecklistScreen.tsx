import { useState, useEffect, useCallback, useRef } from 'react';
import { ArrowLeft, Check, Lock, User, LogOut, Cloud, HardDrive, RefreshCw, ChevronLeft, ChevronRight, Sunrise, Sun, Sunset, PenLine } from 'lucide-react';
import * as Checkbox from '@radix-ui/react-checkbox';
import { supabase } from '../../../lib/supabase';

interface ChecklistScreenProps {
  onBack: () => void;
}

const tasks = [
  // === PAGI ===
  { id: 1,  task: 'Ukur pH Air dengan kertas lakmus',   time: 'Pagi',  description: 'Target: 6.5–7.5 — ideal untuk ikan & tanaman' },
  { id: 2,  task: 'Ukur Suhu Air dengan termometer',    time: 'Pagi',  description: 'Target: 25–30°C sebelum matahari panas' },
  { id: 3,  task: 'Cek Ketinggian Air secara visual',   time: 'Pagi',  description: 'Target: 80–90% kapasitas kolam' },
  { id: 4,  task: 'Dengar bunyi pompa — harus normal',  time: 'Pagi',  description: 'Bunyi aneh = tanda pompa bermasalah' },
  { id: 5,  task: 'Beri Pakan Ikan 2–3% bobot tubuh',   time: 'Pagi',  description: 'Jangan berlebihan — sisa pakan cemar air' },
  { id: 6,  task: 'Amati perilaku & nafsu makan ikan',  time: 'Pagi',  description: 'Ikan lemas / malas makan = tanda awal masalah' },
  // === SIANG ===
  { id: 11, task: 'Cek suhu air kolam siang hari',      time: 'Siang', description: 'Target 25–30°C. Suhu >30°C berbahaya bagi ikan' },
  { id: 12, task: 'Pastikan aerator & pompa tetap jalan', time: 'Siang', description: 'Oksigen terlarut turun drastis saat suhu tinggi' },
  { id: 13, task: 'Amati tanaman dari layu & hama',     time: 'Siang', description: 'Siang paling rawan stres panas pada tanaman sayur' },
  // === SORE ===
  { id: 7,  task: 'Periksa & buang daun tanaman mati',  time: 'Sore',  description: 'Daun mati hambat pertumbuhan & cemarkan air' },
  { id: 8,  task: 'Beri Pakan Ikan 2–3% bobot tubuh',   time: 'Sore',  description: 'Porsi sama seperti pagi' },
  { id: 9,  task: 'Cek Filter — pastikan tidak tersumbat', time: 'Sore', description: 'Air harus mengalir lancar ke tanaman' },
  { id: 10, task: 'Catat di Buku Harian',               time: 'Sore',  description: 'Tulis kondisi hari ini untuk evaluasi' },
];

// Fase cuaca berdasarkan jam saat ini
const getCurrentPhase = (): string => {
  const h = new Date().getHours();
  if (h >= 5  && h < 10) return 'pagi';
  if (h >= 10 && h < 14) return 'siang';
  if (h >= 14 && h < 18) return 'sore';
  return 'malam';
};

const PHASE_LABELS: Record<string, string> = { pagi: 'Pagi', siang: 'Siang', sore: 'Sore', malam: 'Malam' };
const PHASE_EMOJIS: Record<string, string> = { pagi: '🌅',   siang: '☀️',   sore: '🌤️',  malam: '🌙'   };

interface WeatherCacheData {
  locationName: string;
  todayPhases: Record<string, { temp: number; rainProb: number; label: string; emoji: string; color: string }>;
  savedAt: string;
}

export function ChecklistScreen({ onBack }: ChecklistScreenProps) {
  // --- STATE USER ---
  const [user, setUser] = useState<{ name: string; pin: string } | null>(() => {
    const saved = localStorage.getItem('aquatani_user_session');
    return saved ? JSON.parse(saved) : null;
  });
  const [inputName, setInputName] = useState('');
  const [inputPin,  setInputPin]  = useState('');
  const [authError, setAuthError] = useState('');
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  // --- TANGGAL ---
  const getLocalDateString = (date: Date): string => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };
  const realToday = getLocalDateString(new Date());
  const [today, setToday] = useState(realToday);
  const isPastDate = today < realToday;

  // --- CHECKLIST & CATATAN ---
  const [checked,    setChecked]    = useState<Record<number, boolean>>({});
  const [notes,      setNotes]      = useState('');
  const [syncStatus, setSyncStatus] = useState<'synced' | 'local' | 'syncing'>('local');
  const notesTimeoutRef = useRef<any>(null);

  // --- CUACA CACHE ---
  const [weatherCache, setWeatherCache] = useState<WeatherCacheData | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('aquatani_weather_cache');
      if (raw) {
        const parsed: WeatherCacheData = JSON.parse(raw);
        if (parsed.savedAt === realToday) setWeatherCache(parsed);
      }
    } catch {}
  }, [realToday]);

  // --- LOGIN / DAFTAR ---
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    const nameClean = inputName.trim();
    if (!nameClean) { setAuthError('Nama lengkap harus diisi, Pak.'); return; }
    if (inputPin.length !== 4 || isNaN(Number(inputPin))) { setAuthError('PIN harus berupa 4 angka pas, Pak.'); return; }

    setIsAuthLoading(true);
    try {
      const { data: existingUser, error: fetchError } = await supabase
        .from('aquatani_users').select('*').eq('name', nameClean).maybeSingle();

      if (fetchError && fetchError.code !== 'PGRST116') throw fetchError;

      if (existingUser) {
        if (existingUser.pin === inputPin) {
          const session = { name: existingUser.name, pin: existingUser.pin };
          localStorage.setItem('aquatani_user_session', JSON.stringify(session));
          setUser(session);
        } else {
          setAuthError(`Maaf Pak, nama ini sudah terdaftar dengan PIN berbeda. Coba PIN yang benar atau gunakan nama panggilan lain (contoh: ${nameClean} 2).`);
        }
      } else {
        const { error: insertError } = await supabase.from('aquatani_users').insert([{ name: nameClean, pin: inputPin }]);
        if (insertError) throw insertError;
        const session = { name: nameClean, pin: inputPin };
        localStorage.setItem('aquatani_user_session', JSON.stringify(session));
        setUser(session);
      }
    } catch (err) {
      console.warn('Supabase error, mode offline:', err);
      const session = { name: nameClean, pin: inputPin };
      localStorage.setItem('aquatani_user_session', JSON.stringify(session));
      setUser(session);
    } finally {
      setIsAuthLoading(false);
    }
  };

  // --- LOGOUT ---
  const handleLogout = () => {
    if (window.confirm('Apakah Anda ingin keluar dari akun ini?')) {
      localStorage.removeItem('aquatani_user_session');
      setUser(null); setChecked({}); setNotes('');
      setInputName(''); setInputPin(''); setAuthError('');
    }
  };

  // --- SINKRONISASI DATA ---
  useEffect(() => {
    if (!user) return;
    setChecked({}); setNotes(''); setSyncStatus('local');

    const localChecked = localStorage.getItem(`aquatani_checklist_states_${user.name}_${today}`);
    const localNotes   = localStorage.getItem(`aquatani_checklist_notes_${user.name}_${today}`);
    if (localChecked) setChecked(JSON.parse(localChecked));
    if (localNotes)   setNotes(localNotes);

    const fetchCloud = async () => {
      try {
        const { data, error } = await supabase.from('aquatani_daily_tasks')
          .select('*').eq('user_name', user.name).eq('date', today).maybeSingle();
        if (error) throw error;
        if (data) {
          const cloudChecked: Record<number, boolean> = {};
          (data.checked_tasks || []).forEach((id: number) => { cloudChecked[id] = true; });
          setChecked(prev => {
            const merged = { ...cloudChecked, ...prev };
            localStorage.setItem(`aquatani_checklist_states_${user.name}_${today}`, JSON.stringify(merged));
            return merged;
          });
          setNotes(prev => {
            const merged = prev || data.notes || '';
            localStorage.setItem(`aquatani_checklist_notes_${user.name}_${today}`, merged);
            return merged;
          });
          setSyncStatus('synced');
        } else if (!localChecked && !localNotes) {
          setSyncStatus('synced');
        }
      } catch (err) {
        console.warn('Gagal sinkron cloud, pakai data lokal.', err);
        setSyncStatus('local');
      }
    };
    fetchCloud();
  }, [user, today]);

  const syncToCloud = useCallback(async (currentChecked: Record<number, boolean>, currentNotes: string) => {
    if (!user) return;
    setSyncStatus('syncing');
    try {
      const checkedArray = Object.keys(currentChecked).filter(k => currentChecked[Number(k)]).map(Number);
      let { error } = await supabase.from('aquatani_daily_tasks').upsert({
        user_name: user.name, date: today, checked_tasks: checkedArray,
        notes: currentNotes, updated_at: new Date().toISOString()
      }, { onConflict: 'user_name,date' });

      if (error?.code === '23503') {
        const { error: upsertUserErr } = await supabase.from('aquatani_users')
          .upsert({ name: user.name, pin: user.pin }, { onConflict: 'name' });
        if (!upsertUserErr) {
          const retry = await supabase.from('aquatani_daily_tasks').upsert({
            user_name: user.name, date: today, checked_tasks: checkedArray,
            notes: currentNotes, updated_at: new Date().toISOString()
          }, { onConflict: 'user_name,date' });
          error = retry.error;
        } else { error = upsertUserErr; }
      }
      if (error) throw error;
      setSyncStatus('synced');
    } catch (err) {
      console.warn('Gagal upload ke cloud, data aman di HP.', err);
      setSyncStatus('local');
    }
  }, [user, today]);

  const toggleTask = (id: number) => {
    if (isPastDate) return;
    setChecked(prev => {
      const updated = { ...prev, [id]: !prev[id] };
      localStorage.setItem(`aquatani_checklist_states_${user!.name}_${today}`, JSON.stringify(updated));
      syncToCloud(updated, notes);
      return updated;
    });
  };

  const handleNotesChange = (val: string) => {
    if (isPastDate) return;
    setNotes(val);
    localStorage.setItem(`aquatani_checklist_notes_${user!.name}_${today}`, val);
    if (notesTimeoutRef.current) clearTimeout(notesTimeoutRef.current);
    notesTimeoutRef.current = setTimeout(() => syncToCloud(checked, val), 1000);
  };

  // --- PROGRES ---
  const completedCount = Object.values(checked).filter(Boolean).length;
  const progress = tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0;

  const morningTasks = tasks.filter(t => t.time === 'Pagi');
  const noonTasks    = tasks.filter(t => t.time === 'Siang');
  const eveningTasks = tasks.filter(t => t.time === 'Sore');

  const isMorningComplete = morningTasks.every(t => checked[t.id]);
  const isNoonComplete    = noonTasks.every(t => checked[t.id]);
  const isEveningComplete = eveningTasks.every(t => checked[t.id]);

  const formatDateIndo = (dateStr: string): string => {
    const [y, m, d] = dateStr.split('-').map(Number);
    const dateObj = new Date(y, m - 1, d);
    return dateObj.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  };

  // Helper render task item (dipakai 3 sesi)
  const renderTaskItem = (task: typeof tasks[0]) => (
    <div
      key={task.id}
      className={`bg-white rounded-2xl p-4 shadow-sm border border-gray-100 transition-all active:scale-[0.99] flex items-center gap-3 ${
        checked[task.id] ? 'bg-emerald-50/50 border-emerald-100' : ''
      } ${isPastDate ? 'opacity-85' : ''}`}
    >
      <Checkbox.Root
        id={`task-${task.id}`}
        checked={checked[task.id] || false}
        onCheckedChange={() => toggleTask(task.id)}
        disabled={isPastDate}
        className="w-6 h-6 rounded-lg border-2 border-gray-300 flex items-center justify-center bg-white data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600 flex-shrink-0 disabled:opacity-60 disabled:bg-gray-100 disabled:cursor-not-allowed"
      >
        <Checkbox.Indicator>
          <Check className="w-4 h-4 text-white" />
        </Checkbox.Indicator>
      </Checkbox.Root>
      <label
        htmlFor={`task-${task.id}`}
        className={`flex-1 select-none ${isPastDate ? 'cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <p className={`text-sm font-semibold ${checked[task.id] ? 'line-through text-gray-400' : 'text-gray-800'}`}>
          {task.task}
        </p>
        <p className="text-xs text-gray-500 mt-0.5">{task.description}</p>
      </label>
    </div>
  );

  // ==========================================
  // RENDER A: BELUM LOGIN
  // ==========================================
  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-between pb-10">
        <div className="bg-gradient-to-br from-emerald-600 via-teal-500 to-cyan-500 px-6 pt-10 pb-8 shadow-md rounded-b-[2rem]">
          <button onClick={onBack} className="flex items-center gap-2 text-white mb-6 active:opacity-70 text-sm font-medium">
            <ArrowLeft className="w-5 h-5" /><span>Kembali ke Menu</span>
          </button>
          <div className="flex flex-col items-center text-center">
            <span className="text-5xl mb-4 drop-shadow-md">📝</span>
            <h1 className="text-2xl text-white font-bold tracking-wide">Buku Harian AquaTani</h1>
            <p className="text-teal-100 text-xs mt-2 max-w-xs leading-relaxed">
              Catat perkembangan kolam ikan & tanaman setiap hari agar panen melimpah!
            </p>
          </div>
        </div>

        <div className="px-6 flex-1 -mt-6">
          <form onSubmit={handleAuth} className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 space-y-5">
            <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100">
              <User className="w-5 h-5 text-teal-600" />
              <h3 className="text-gray-900 font-semibold">Tulis Identitas Bapak/Ibu</h3>
            </div>

            {authError && (
              <div className="bg-red-50 text-red-700 text-xs p-3 rounded-xl border border-red-100 leading-relaxed">{authError}</div>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5 pl-1">Nama Lengkap / Nama Panggilan</label>
              <input
                type="text" value={inputName} onChange={e => setInputName(e.target.value)}
                placeholder="Contoh: Joko"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900 font-medium"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5 pl-1">PIN 4 Angka</label>
              <div className="relative">
                <input
                  type="password" pattern="[0-9]*" inputMode="numeric" maxLength={4}
                  value={inputPin} onChange={e => setInputPin(e.target.value.replace(/\D/g, ''))}
                  placeholder="Contoh: 1234"
                  className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900 font-semibold tracking-widest text-lg"
                  required
                />
                <Lock className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
              </div>
              <p className="text-[10px] text-gray-400 mt-1 pl-1">PIN ini menjaga buku catatan Bapak agar tidak dibuka orang lain.</p>
            </div>

            <button
              type="submit" disabled={isAuthLoading}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 disabled:from-teal-300 text-white font-semibold py-4 rounded-2xl shadow-lg active:scale-98 transition-all flex items-center justify-center gap-2 mt-4"
            >
              {isAuthLoading
                ? <><RefreshCw className="w-5 h-5 animate-spin" /><span>Memeriksa Akun...</span></>
                : <span>Mulai Mencatat Hari Ini</span>
              }
            </button>
          </form>
        </div>

        <div className="px-8 text-center text-xs text-gray-400 mt-6">🔒 AquaTani menjamin kerahasiaan data kolam Anda.</div>
      </div>
    );
  }

  // ==========================================
  // RENDER B: SUDAH LOGIN
  // ==========================================
  return (
    <div className="min-h-screen pb-20 bg-slate-50">

      {/* Header */}
      <div className="bg-gradient-to-br from-emerald-600 via-teal-500 to-cyan-500 px-4 pt-10 pb-6 shadow-md rounded-b-[2rem]">
        <div className="flex items-center justify-between mb-4">
          <button onClick={onBack} className="flex items-center gap-2 text-white active:opacity-70 text-sm font-medium">
            <ArrowLeft className="w-5 h-5" /><span>Kembali</span>
          </button>
          <div className="bg-white/15 backdrop-blur-sm px-3 py-1 rounded-full border border-white/20 flex items-center gap-2 text-white text-xs">
            <span className="font-semibold">{user.name}</span>
            <button onClick={handleLogout} className="text-emerald-100 hover:text-white active:scale-95 transition-all" title="Keluar">
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <h1 className="text-xl text-white font-bold tracking-tight">Cek Harian Tanaman & Kolam</h1>

        {/* Navigasi tanggal */}
        <div className="flex items-center justify-between mt-3 bg-black/15 backdrop-blur-md p-1.5 rounded-2xl border border-white/10">
          <button
            onClick={() => {
              const [y,m,d] = today.split('-').map(Number);
              const prev = new Date(y, m-1, d); prev.setDate(prev.getDate()-1);
              setToday(getLocalDateString(prev));
            }}
            className="text-white hover:bg-white/10 active:scale-90 p-1.5 rounded-xl transition-all flex items-center justify-center select-none"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="text-center">
            <span className="block text-[9px] text-teal-100 uppercase tracking-widest font-bold">Tanggal Catatan</span>
            <span className="block text-xs text-white font-extrabold tracking-wide">{formatDateIndo(today)}</span>
          </div>
          <button
            onClick={() => {
              const [y,m,d] = today.split('-').map(Number);
              const next = new Date(y, m-1, d); next.setDate(next.getDate()+1);
              const nextStr = getLocalDateString(next);
              if (nextStr <= realToday) setToday(nextStr);
            }}
            disabled={today >= realToday}
            className="text-white hover:bg-white/10 active:scale-90 disabled:opacity-30 disabled:pointer-events-none p-1.5 rounded-xl transition-all flex items-center justify-center select-none"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Mini Weather Card */}
      {today === realToday && (
        <div className="px-4 pt-4 -mt-1">
          {weatherCache ? (() => {
            const phase = getCurrentPhase();
            const pd = weatherCache.todayPhases?.[phase];
            if (!pd) return null;
            return (
              <div className="bg-gradient-to-r from-sky-50 to-cyan-50 border border-sky-100 rounded-2xl p-4 shadow-sm flex items-center gap-3 mb-2">
                <span className="text-3xl flex-shrink-0">{pd.emoji || PHASE_EMOJIS[phase]}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-sky-600 font-bold uppercase tracking-wide">
                    Cuaca {PHASE_LABELS[phase]} · Lahan Anda
                  </p>
                  <p className="text-sm font-bold text-gray-800">{pd.temp}°C — {pd.label}</p>
                  <p className="text-[10px] text-gray-400 truncate">📍 {weatherCache.locationName}</p>
                </div>
                {(pd.rainProb ?? 0) >= 50 && (
                  <div className="bg-blue-100 rounded-xl px-2.5 py-1.5 text-center flex-shrink-0">
                    <p className="text-[11px] font-bold text-blue-700">🌧️ {pd.rainProb}%</p>
                  </div>
                )}
              </div>
            );
          })() : (
            <div className="bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 flex items-center gap-3 mb-2">
              <Cloud className="w-6 h-6 text-slate-400 flex-shrink-0" />
              <div>
                <p className="text-xs font-semibold text-slate-500">Cuaca lahan belum diset</p>
                <p className="text-[10px] text-slate-400">Buka tab <strong>Cuaca</strong> untuk mengatur lokasi lahan</p>
              </div>
              <span className="ml-auto text-slate-400 font-bold text-sm">–</span>
            </div>
          )}
        </div>
      )}

      {/* Progress & Sync */}
      <div className="px-4 mt-3 mb-4">
        <div className="bg-white rounded-3xl p-5 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-600">Total Progres Cek</span>
            <span className="text-sm font-bold text-emerald-600">{completedCount}/{tasks.length}</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-3.5 shadow-inner">
            <div className="bg-gradient-to-r from-emerald-500 to-green-500 h-3.5 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
          <div className="mt-4 flex items-center justify-between pt-3 border-t border-gray-100">
            <span className="text-xs font-semibold text-gray-500">Status Laporan:</span>
            <div>
              {isPastDate ? (
                <span className="text-[10px] font-bold flex items-center gap-1 bg-gray-50 px-2.5 py-1 rounded-xl border border-gray-200 shadow-sm text-gray-500">
                  <Lock className="w-3.5 h-3.5 text-gray-400" /><span>Arsip Terkunci</span>
                </span>
              ) : syncStatus === 'synced' ? (
                <span className="text-[10px] text-emerald-700 font-extrabold flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200 shadow-sm">
                  <Cloud className="w-3.5 h-3.5 text-emerald-600" /><span>✓ Laporan Terkirim</span>
                </span>
              ) : syncStatus === 'syncing' ? (
                <span className="text-[10px] text-teal-700 font-extrabold flex items-center gap-1 bg-teal-50 px-2.5 py-1 rounded-xl border border-teal-200 shadow-sm">
                  <RefreshCw className="w-3.5 h-3.5 text-teal-600 animate-spin" /><span>Mengirim...</span>
                </span>
              ) : (
                <span className="text-[10px] text-amber-700 font-extrabold flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-200 shadow-sm">
                  <HardDrive className="w-3.5 h-3.5 text-amber-600" /><span>💾 Tersimpan di HP</span>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* === TUGAS PAGI === */}
      <div className="px-4 mb-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Sunrise className="w-4 h-4 text-amber-600" />
            </div>
            <h3 className="text-gray-900 font-bold text-sm">Tugas Pagi</h3>
          </div>
          {isMorningComplete && (
            <span className="bg-amber-100 text-amber-700 text-[10px] font-semibold px-2.5 py-1 rounded-full">Pagi Tuntas</span>
          )}
        </div>
        <div className="space-y-2">{morningTasks.map(renderTaskItem)}</div>
      </div>

      {/* === TUGAS SIANG === */}
      <div className="px-4 mb-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Sun className="w-4 h-4 text-orange-500" />
            </div>
            <h3 className="text-gray-900 font-bold text-sm">Tugas Siang</h3>
          </div>
          {isNoonComplete && (
            <span className="bg-orange-100 text-orange-700 text-[10px] font-semibold px-2.5 py-1 rounded-full">Siang Tuntas</span>
          )}
        </div>
        <div className="space-y-2">{noonTasks.map(renderTaskItem)}</div>
      </div>

      {/* === TUGAS SORE === */}
      <div className="px-4 mb-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Sunset className="w-4 h-4 text-indigo-500" />
            </div>
            <h3 className="text-gray-900 font-bold text-sm">Tugas Sore</h3>
          </div>
          {isEveningComplete && (
            <span className="bg-indigo-100 text-indigo-700 text-[10px] font-semibold px-2.5 py-1 rounded-full">Sore Tuntas</span>
          )}
        </div>
        <div className="space-y-2">{eveningTasks.map(renderTaskItem)}</div>
      </div>

      {/* Catatan Harian */}
      <div className="px-4">
        <div className="bg-white rounded-3xl p-5 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${isPastDate ? 'bg-gray-100' : 'bg-teal-100'}`}>
                <PenLine className={`w-4 h-4 ${isPastDate ? 'text-gray-400' : 'text-teal-600'}`} />
              </div>
              <div>
                <h3 className="text-gray-900 font-bold text-sm">
                  {isPastDate ? 'Catatan Tersimpan' : 'Catatan Hari Ini'}
                </h3>
                <p className="text-[10px] text-gray-400">
                  {isPastDate ? 'Hanya bisa dibaca, tidak bisa diubah' : 'Tersimpan otomatis'}
                </p>
              </div>
            </div>
            {isPastDate && (
              <Lock className="w-4 h-4 text-gray-300 flex-shrink-0" />
            )}
          </div>
          <textarea
            value={notes}
            onChange={e => handleNotesChange(e.target.value)}
            disabled={isPastDate}
            placeholder={
              isPastDate
                ? 'Tidak ada catatan pada tanggal ini.'
                : 'Tulis yang penting hari ini... (Contoh: Air kolam agak keruh, tanaman kangkung tumbuh subur)'
            }
            className="w-full h-28 px-4 py-3 border border-gray-200 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-teal-400 text-sm leading-relaxed text-gray-800 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed bg-slate-50"
          />
        </div>
      </div>
    </div>
  );
}
