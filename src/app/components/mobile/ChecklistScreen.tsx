import { useState, useEffect, useCallback, useRef } from 'react';
import { ArrowLeft, Check, Lock, User, LogOut, Cloud, HardDrive, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import * as Checkbox from '@radix-ui/react-checkbox';
import { supabase } from '../../../lib/supabase';

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
  // --- 1. STATE SELEKSI USER ---
  const [user, setUser] = useState<{ name: string; pin: string } | null>(() => {
    const saved = localStorage.getItem('aquatani_user_session');
    return saved ? JSON.parse(saved) : null;
  });

  const [inputName, setInputName] = useState('');
  const [inputPin, setInputPin] = useState('');
  const [authError, setAuthError] = useState('');
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  // Helper untuk format YYYY-MM-DD lokal tanpa bias timezone
  const getLocalDateString = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const realToday = getLocalDateString(new Date());

  // --- 2. STATE CHECKLIST & CATATAN ---
  const [checked, setChecked] = useState<Record<number, boolean>>({});
  const [notes, setNotes] = useState('');
  const [syncStatus, setSyncStatus] = useState<'synced' | 'local' | 'syncing'>('local');

  const [today, setToday] = useState(realToday);
  const isPastDate = today < realToday;

  // Ref untuk debouncing catatan (mencegah kebocoran kueri Supabase)
  const notesTimeoutRef = useRef<any>(null);

  // --- 3. LOGIKA MASUK / DAFTAR (FRICTIONLESS LOGIN/REGISTER) ---
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    
    const nameClean = inputName.trim();
    if (!nameClean) {
      setAuthError('Nama lengkap harus diisi, Pak.');
      return;
    }
    if (inputPin.length !== 4 || isNaN(Number(inputPin))) {
      setAuthError('PIN harus berupa 4 angka pas, Pak.');
      return;
    }

    setIsAuthLoading(true);
    try {
      // 1. Cek apakah pengguna sudah ada di Supabase
      const { data: existingUser, error: fetchError } = await supabase
        .from('aquatani_users')
        .select('*')
        .eq('name', nameClean)
        .maybeSingle();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      if (existingUser) {
        // Jika user sudah terdaftar, verifikasi PIN-nya
        if (existingUser.pin === inputPin) {
          // Sukses masuk
          const sessionData = { name: existingUser.name, pin: existingUser.pin };
          localStorage.setItem('aquatani_user_session', JSON.stringify(sessionData));
          setUser(sessionData);
        } else {
          // PIN salah
          setAuthError('Maaf Pak, nama ini sudah terdaftar dengan PIN lain. Mohon ketik PIN yang benar atau buat nama panggilan yang berbeda (contoh: ' + nameClean + ' Sleman).');
        }
      } else {
        // Jika belum ada, otomatis daftarkan sebagai user baru!
        const { error: insertError } = await supabase
          .from('aquatani_users')
          .insert([{ name: nameClean, pin: inputPin }]);

        if (insertError) throw insertError;

        const sessionData = { name: nameClean, pin: inputPin };
        localStorage.setItem('aquatani_user_session', JSON.stringify(sessionData));
        setUser(sessionData);
      }
    } catch (err: any) {
      console.warn("Koneksi Supabase error saat login/register, menggunakan mode offline lokal...", err);
      // Fallback Offline: Daftarkan langsung secara lokal jika internet mati
      const sessionData = { name: nameClean, pin: inputPin };
      localStorage.setItem('aquatani_user_session', JSON.stringify(sessionData));
      setUser(sessionData);
    } finally {
      setIsAuthLoading(false);
    }
  };

  // --- 4. KELUAR AKUN (LOGOUT) ---
  const handleLogout = () => {
    if (window.confirm('Apakah Anda ingin keluar dari akun ini?')) {
      localStorage.removeItem('aquatani_user_session');
      setUser(null);
      setChecked({});
      setNotes('');
      setInputName('');
      setInputPin('');
      setAuthError('');
    }
  };

  // --- 5. LOGIKA SINKRONISASI DATA (HYBRID LOCAL + CLOUD) ---
  
  // Ambil data awal dari HP & Supabase saat masuk atau tanggal berubah
  useEffect(() => {
    if (!user) return;

    // SANGAT PENTING: Bersihkan state terlebih dahulu agar data hari aktif tidak terbawa/bocor ke tanggal lain!
    setChecked({});
    setNotes('');
    setSyncStatus('local'); // Default ke lokal saat sedang memuat ulang

    // A. Muat data dari memori lokal (Instant Load)
    const localChecked = localStorage.getItem(`aquatani_checklist_states_${user.name}_${today}`);
    const localNotes = localStorage.getItem(`aquatani_checklist_notes_${user.name}_${today}`);
    
    if (localChecked) setChecked(JSON.parse(localChecked));
    if (localNotes) setNotes(localNotes);

    // B. Ambil cadangan terbaru dari Supabase secara senyap di latar belakang
    const fetchCloudData = async () => {
      try {
        const { data, error } = await supabase
          .from('aquatani_daily_tasks')
          .select('*')
          .eq('user_name', user.name)
          .eq('date', today)
          .maybeSingle();

        if (error) throw error;

        if (data) {
          // Gabungkan data cloud dengan lokal
          const cloudCheckedArray = data.checked_tasks || [];
          const cloudChecked: Record<number, boolean> = {};
          cloudCheckedArray.forEach((id: number) => {
            cloudChecked[id] = true;
          });
          const cloudNotes = data.notes || '';

          setChecked(prev => {
            const merged = { ...cloudChecked, ...prev }; // Pertahankan centang lokal baru jika ada
            localStorage.setItem(`aquatani_checklist_states_${user.name}_${today}`, JSON.stringify(merged));
            return merged;
          });

          setNotes(prev => {
            const merged = prev || cloudNotes;
            localStorage.setItem(`aquatani_checklist_notes_${user.name}_${today}`, merged);
            return merged;
          });

          setSyncStatus('synced');
        } else {
          // Jika tidak ada data di awan sama sekali, dan data lokal juga kosong:
          // tandai tersinkron karena memang tidak ada catatan untuk tanggal ini
          if (!localChecked && !localNotes) {
            setSyncStatus('synced');
          }
        }
      } catch (err) {
        console.warn("Gagal menyinkronkan data dari awan pada startup, menggunakan data lokal HP.", err);
        setSyncStatus('local');
      }
    };

    fetchCloudData();
  }, [user, today]);

  // Fungsi pengiriman cadangan ke Supabase (Debounced/Background Sync)
  const syncToCloud = useCallback(async (currentChecked: Record<number, boolean>, currentNotes: string) => {
    if (!user) return;
    setSyncStatus('syncing');

    try {
      const checkedArray = Object.keys(currentChecked)
        .filter(key => currentChecked[Number(key)])
        .map(Number);

      let { error } = await supabase
        .from('aquatani_daily_tasks')
        .upsert({
          user_name: user.name,
          date: today,
          checked_tasks: checkedArray,
          notes: currentNotes,
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_name,date' });

      // AUTO-REPAIR: Jika melanggar foreign key (code 23503), daftarkan user otomatis lalu coba lagi!
      if (error && error.code === '23503') {
        console.log("Mendeteksi akun lokal belum terdaftar di database awan. Mendaftarkan ulang secara otomatis...");
        const { error: userInsertError } = await supabase
          .from('aquatani_users')
          .upsert({ name: user.name, pin: user.pin }, { onConflict: 'name' });

        if (!userInsertError) {
          const retry = await supabase
            .from('aquatani_daily_tasks')
            .upsert({
              user_name: user.name,
              date: today,
              checked_tasks: checkedArray,
              notes: currentNotes,
              updated_at: new Date().toISOString()
            }, { onConflict: 'user_name,date' });
          
          error = retry.error;
        } else {
          error = userInsertError;
        }
      }

      if (error) throw error;
      setSyncStatus('synced');
    } catch (err) {
      console.warn("Gagal mengunggah cadangan ke awan, data tetap aman di HP.", err);
      setSyncStatus('local');
    }
  }, [user, today]);

  // Kontrol Perubahan Checklist & Catatan (Sinkronisasi Hibrida Lokal + Awan)
  const toggleTask = (id: number) => {
    if (isPastDate) return; // Kunci: tidak bisa diisi/modifikasi jika sudah lewat harinya
    
    setChecked(prev => {
      const updated = { ...prev, [id]: !prev[id] };
      localStorage.setItem(`aquatani_checklist_states_${user!.name}_${today}`, JSON.stringify(updated));
      syncToCloud(updated, notes); // Kirim otomatis ke Awan (Hibrida)
      return updated;
    });
  };

  const handleNotesChange = (val: string) => {
    if (isPastDate) return; // Kunci: tidak bisa diisi/modifikasi jika sudah lewat harinya
    
    setNotes(val);
    localStorage.setItem(`aquatani_checklist_notes_${user!.name}_${today}`, val);
    
    // Hapus timer lama jika pengguna mengetik huruf baru
    if (notesTimeoutRef.current) {
      clearTimeout(notesTimeoutRef.current);
    }
    
    // Set timer baru (Debounce 1 Detik untuk hemat kueri Supabase)
    notesTimeoutRef.current = setTimeout(() => {
      syncToCloud(checked, val);
    }, 1000);
  };

  // --- 6. PERHITUNGAN PROGRES & BADGE ---
  const completedCount = Object.values(checked).filter(Boolean).length;
  const progress = tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0;

  const morningTasks = tasks.filter(t => t.time === 'Pagi');
  const eveningTasks = tasks.filter(t => t.time === 'Sore');

  const isMorningComplete = morningTasks.every(t => checked[t.id]);
  const isEveningComplete = eveningTasks.every(t => checked[t.id]);

  // Format Tanggal Cantik Bahasa Indonesia (Aman dari Bug Pergeseran Zona Waktu Safari/iOS)
  const formatDateIndo = (dateStr: string) => {
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // 0-based index
    const day = parseInt(parts[2], 10);
    
    const d = new Date(year, month, day);
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    return d.toLocaleDateString('id-ID', options);
  };

  // ==========================================
  // RENDER A: JIKA PETANI BELUM MASUK/DAFTAR
  // ==========================================
  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-between pb-10">
        {/* Header */}
        <div className="bg-gradient-to-br from-emerald-600 via-teal-500 to-cyan-500 px-6 pt-10 pb-8 shadow-md rounded-b-[2rem]">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-white mb-6 active:opacity-70 text-sm font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Kembali ke Menu</span>
          </button>
          
          <div className="flex flex-col items-center text-center">
            <span className="text-5xl mb-4 drop-shadow-md">📝</span>
            <h1 className="text-2xl text-white font-bold tracking-wide">Buku Harian AquaTani</h1>
            <p className="text-teal-100 text-xs mt-2 max-w-xs leading-relaxed">
              Catat perkembangan kolam ikan & tanaman Anda setiap hari agar panen melimpah!
            </p>
          </div>
        </div>

        {/* Card Form */}
        <div className="px-6 flex-1 -mt-6">
          <form onSubmit={handleAuth} className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 space-y-5">
            <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100">
              <User className="w-5 h-5 text-teal-600" />
              <h3 className="text-gray-900 font-semibold">Tulis Identitas Bapak/Ibu</h3>
            </div>

            {authError && (
              <div className="bg-red-50 text-red-700 text-xs p-3 rounded-xl border border-red-100 leading-relaxed">
                {authError}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5 pl-1">
                Nama Lengkap / Nama Panggilan Anda
              </label>
              <input
                type="text"
                value={inputName}
                onChange={(e) => setInputName(e.target.value)}
                placeholder="Contoh: Joko"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900 font-medium"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5 pl-1">
                PIN 4 Angka (PIN Perangkat Kolam Anda)
              </label>
              <div className="relative">
                <input
                  type="password"
                  pattern="[0-9]*"
                  inputMode="numeric"
                  maxLength={4}
                  value={inputPin}
                  onChange={(e) => setInputPin(e.target.value.replace(/\D/g, ''))}
                  placeholder="Contoh: 1234"
                  className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900 font-semibold tracking-widest text-lg"
                  required
                />
                <Lock className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
              </div>
              <p className="text-[10px] text-gray-400 mt-1 pl-1">
                PIN ini dipakai agar buku catatan Bapak tidak bisa dibuka oleh orang lain.
              </p>
            </div>

            <button
              type="submit"
              disabled={isAuthLoading}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 disabled:from-teal-300 text-white font-semibold py-4 rounded-2xl shadow-lg active:scale-98 transition-all flex items-center justify-center gap-2 mt-4"
            >
              {isAuthLoading ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Memeriksa Akun...</span>
                </>
              ) : (
                <span>Mulai Mencatat Hari Ini</span>
              )}
            </button>
          </form>
        </div>

        {/* Footer info */}
        <div className="px-8 text-center text-xs text-gray-400 mt-6">
          🔒 AquaTani menjamin kerahasiaan data kolam Anda.
        </div>
      </div>
    );
  }

  // ==========================================
  // RENDER B: JIKA PETANI SUDAH LOGIN
  // ==========================================
  return (
    <div className="min-h-screen pb-20 bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-emerald-600 via-teal-500 to-cyan-500 px-4 pt-10 pb-6 shadow-md rounded-b-[2rem]">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-white active:opacity-70 text-sm font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Kembali</span>
          </button>
          
          {/* User Badge */}
          <div className="bg-white/15 backdrop-blur-sm px-3 py-1 rounded-full border border-white/20 flex items-center gap-2 text-white text-xs">
            <span className="font-semibold">{user.name}</span>
            <button 
              onClick={handleLogout}
              className="text-emerald-100 hover:text-white active:scale-95 transition-all"
              title="Keluar Akun"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <h1 className="text-xl text-white font-bold tracking-tight">Cek Harian Tanaman dan Kolam</h1>
        
        {/* Navigasi Kalender Riwayat Hari Sebelum/Sesudah */}
        <div className="flex items-center justify-between mt-3 bg-black/15 backdrop-blur-md p-1.5 rounded-2xl border border-white/10">
          <button
            onClick={() => {
              const parts = today.split('-');
              const year = parseInt(parts[0], 10);
              const month = parseInt(parts[1], 10) - 1;
              const day = parseInt(parts[2], 10);
              const d = new Date(year, month, day);
              d.setDate(d.getDate() - 1);
              setToday(getLocalDateString(d));
            }}
            className="text-white hover:bg-white/10 active:scale-90 p-1.5 rounded-xl transition-all flex items-center justify-center select-none"
            title="Hari Sebelumnya"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <div className="text-center">
            <span className="block text-[9px] text-teal-100 uppercase tracking-widest font-bold">Tanggal Catatan</span>
            <span className="block text-xs text-white font-extrabold tracking-wide">
              {formatDateIndo(today)}
            </span>
          </div>
          
          <button
            onClick={() => {
              const parts = today.split('-');
              const year = parseInt(parts[0], 10);
              const month = parseInt(parts[1], 10) - 1;
              const day = parseInt(parts[2], 10);
              const d = new Date(year, month, day);
              d.setDate(d.getDate() + 1);
              const nextDate = getLocalDateString(d);
              if (nextDate <= realToday) {
                setToday(nextDate);
              }
            }}
            disabled={today >= realToday}
            className="text-white hover:bg-white/10 active:scale-90 disabled:opacity-30 disabled:pointer-events-none p-1.5 rounded-xl transition-all flex items-center justify-center select-none"
            title="Hari Berikutnya"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Progress & Sync Status Card */}
      <div className="px-4 -mt-4 mb-4">
        <div className="bg-white rounded-3xl p-5 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-600">Total Progres Cek</span>
            <span className="text-sm font-bold text-emerald-600">{completedCount}/{tasks.length}</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-3.5 shadow-inner">
            <div
              className="bg-gradient-to-r from-emerald-500 to-green-500 h-3.5 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          
          {/* Status Laporan */}
          <div className="mt-4 flex items-center justify-between pt-3 border-t border-gray-100">
            <span className="text-xs font-semibold text-gray-500">Status Laporan:</span>
            <div>
              {isPastDate ? (
                <span className="text-[10px] text-gray-550 font-bold flex items-center gap-1 bg-gray-50 px-2.5 py-1 rounded-xl border border-gray-200 shadow-sm">
                  <Lock className="w-3.5 h-3.5 text-gray-400" />
                  <span>Arsip Terkunci</span>
                </span>
              ) : syncStatus === 'synced' ? (
                <span className="text-[10px] text-emerald-700 font-extrabold flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200 shadow-sm">
                  <Cloud className="w-3.5 h-3.5 text-emerald-600" />
                  <span>✓ Laporan Terkirim</span>
                </span>
              ) : syncStatus === 'syncing' ? (
                <span className="text-[10px] text-teal-700 font-extrabold flex items-center gap-1 bg-teal-50 px-2.5 py-1 rounded-xl border border-teal-200 shadow-sm">
                  <RefreshCw className="w-3.5 h-3.5 text-teal-600 animate-spin" />
                  <span>Mengirim...</span>
                </span>
              ) : (
                <span className="text-[10px] text-amber-700 font-extrabold flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-200 shadow-sm">
                  <HardDrive className="w-3.5 h-3.5 text-amber-600" />
                  <span>💾 Tersimpan di HP (Offline)</span>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Morning Tasks */}
      <div className="px-4 mb-5">
        <div className="flex items-center justify-between mb-3 pl-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-amber-500 rounded-full animate-ping"></div>
            <h3 className="text-gray-900 font-bold text-sm">☀️ Tugas Pagi Hari</h3>
          </div>
          {isMorningComplete && (
            <span className="bg-amber-100 text-amber-850 text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-sm">
              ☀️ Sesi Pagi Tuntas!
            </span>
          )}
        </div>
        
        <div className="space-y-2">
          {morningTasks.map((task) => (
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
          ))}
        </div>
      </div>

      {/* Evening Tasks */}
      <div className="px-4 mb-5">
        <div className="flex items-center justify-between mb-3 pl-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-orange-500 rounded-full animate-ping"></div>
            <h3 className="text-gray-900 font-bold text-sm">🌙 Tugas Sore Hari</h3>
          </div>
          {isEveningComplete && (
            <span className="bg-orange-100 text-orange-850 text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-sm">
              🌙 Sesi Sore Tuntas!
            </span>
          )}
        </div>
        
        <div className="space-y-2">
          {eveningTasks.map((task) => (
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
          ))}
        </div>
      </div>

      {/* Diary / Notes */}
      <div className="px-4">
        <div className="bg-white rounded-3xl p-5 shadow-lg border border-gray-100">
          <div className="flex items-center gap-2 mb-3 pl-1">
            <span className="text-lg">📓</span>
            <h3 className="text-gray-900 font-bold text-sm">
              {isPastDate ? "Buku Catatan Terkunci" : "Buku Catatan Hari Ini"}
            </h3>
          </div>
          <textarea
            value={notes}
            onChange={(e) => handleNotesChange(e.target.value)}
            disabled={isPastDate}
            placeholder={
              isPastDate 
                ? "Tidak ada catatan tertulis pada tanggal ini." 
                : "Tulis yang penting hari ini... (Contoh: Air kolam agak keruh, atau tanaman kangkung tumbuh subur sekali)"
            }
            className="w-full h-28 px-4 py-3 border border-gray-300 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm leading-relaxed text-gray-800 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
          />
        </div>
      </div>
    </div>
  );
}

