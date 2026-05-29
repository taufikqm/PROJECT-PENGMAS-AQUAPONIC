import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Search, MapPin, AlertTriangle, CloudRain } from 'lucide-react';

interface WeatherScreenProps {
  onBack: () => void;
}

interface GeocodingResult {
  name: string;
  latitude: number;
  longitude: number;
  admin1?: string;
  country?: string;
}

type PhaseKey = 'pagi' | 'siang' | 'sore' | 'malam';

interface PhaseData {
  temp: number;
  weatherCode: number;
  rainProb: number;
}

interface DayData {
  date: string;
  pagi: PhaseData;
  siang: PhaseData;
  sore: PhaseData;
  malam: PhaseData;
}

const PHASES: Array<{ key: PhaseKey; label: string; emoji: string; timeLabel: string; hour: number }> = [
  { key: 'pagi',  label: 'Pagi',  emoji: '🌅', timeLabel: '05.00–10.00 WIB', hour: 7  },
  { key: 'siang', label: 'Siang', emoji: '☀️', timeLabel: '10.00–14.00 WIB', hour: 12 },
  { key: 'sore',  label: 'Sore',  emoji: '🌤️', timeLabel: '14.00–18.00 WIB', hour: 15 },
  { key: 'malam', label: 'Malam', emoji: '🌙', timeLabel: '18.00–23.00 WIB', hour: 20 },
];

// Warna lembut per fase — jelas dibedakan, tidak mencolok
const PHASE_STYLES: Record<PhaseKey, {
  bgGrad: string; titleText: string; tempAccent: string;
  condText: string; badgeBg: string; badgeText: string; border: string;
}> = {
  pagi:  { bgGrad: 'from-sky-100 to-cyan-50',      titleText: 'text-sky-800',    tempAccent: 'text-sky-600',    condText: 'text-sky-700',    badgeBg: 'bg-sky-200',    badgeText: 'text-sky-900',    border: 'border-sky-200'    },
  siang: { bgGrad: 'from-orange-100 to-rose-50',   titleText: 'text-orange-800', tempAccent: 'text-orange-600', condText: 'text-orange-700', badgeBg: 'bg-orange-200', badgeText: 'text-orange-900', border: 'border-orange-200' },
  sore:  { bgGrad: 'from-amber-100 to-orange-50',  titleText: 'text-amber-800',  tempAccent: 'text-amber-600',  condText: 'text-amber-700',  badgeBg: 'bg-amber-200',  badgeText: 'text-amber-900',  border: 'border-amber-200'  },
  malam: { bgGrad: 'from-indigo-100 to-violet-50', titleText: 'text-indigo-800', tempAccent: 'text-indigo-600', condText: 'text-indigo-700', badgeBg: 'bg-indigo-200', badgeText: 'text-indigo-900', border: 'border-indigo-200' },
};

const getWeatherInfo = (code: number) => {
  if (code === 0)               return { label: 'Cerah',         emoji: '☀️',  color: 'text-amber-600'  };
  if ([1,2,3].includes(code))   return { label: 'Cerah Berawan', emoji: '⛅',  color: 'text-sky-600'    };
  if ([45,48].includes(code))   return { label: 'Berkabut',      emoji: '🌫️', color: 'text-slate-500'  };
  if ([51,53,55].includes(code))return { label: 'Gerimis',       emoji: '🌦️', color: 'text-teal-600'   };
  if ([61,63,65].includes(code))return { label: 'Hujan',         emoji: '🌧️', color: 'text-blue-600'   };
  if ([80,81,82].includes(code))return { label: 'Hujan Deras',   emoji: '🌧️', color: 'text-indigo-700' };
  if ([95,96,99].includes(code))return { label: 'Hujan + Petir', emoji: '⛈️', color: 'text-purple-700' };
  return                               { label: 'Berawan',        emoji: '☁️',  color: 'text-slate-500'  };
};

const getFarmerTip = (code: number, phase: PhaseKey): string => {
  const rainy = [51,53,55,61,63,65,80,81,82,95,96,99].includes(code);
  const clear = [0,1].includes(code);
  const tips: Record<PhaseKey, [string, string, string]> = {
    pagi:  ['Cek pH air — hujan bisa bikin air kolam asam', 'Waktu terbaik beri pakan & cek pompa', 'Cek kondisi ikan & pastikan pompa lancar'],
    siang: ['Cek aerasi tetap jalan & kolam jangan meluap', 'Suhu paling tinggi! Pastikan aerasi maksimal', 'Pantau suhu air, siang paling rawan panas'],
    sore:  ['Cek saluran tidak meluap, tunda panen dulu', 'Beri pakan sore & periksa daun tanaman', 'Beri pakan sore & cek kebersihan filter'],
    malam: ['Pastikan kolam tidak meluap malam ini', 'Catat kondisi hari ini di buku harian', 'Pastikan pompa aktif sepanjang malam'],
  };
  return rainy ? tips[phase][0] : clear ? tips[phase][1] : tips[phase][2];
};

const getLocalDateStr = (): string => {
  const n = new Date();
  return `${n.getFullYear()}-${String(n.getMonth()+1).padStart(2,'0')}-${String(n.getDate()).padStart(2,'0')}`;
};

const getDayChip = (dateStr: string, todayStr: string): { main: string; sub: string } => {
  const DAYS   = ['Min','Sen','Sel','Rab','Kam','Jum','Sab'];
  const MONTHS = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];
  const [y, m, d] = dateStr.split('-').map(Number);
  const obj  = new Date(y, m - 1, d);
  const diff = Math.round((new Date(`${dateStr}T12:00:00`).getTime() - new Date(`${todayStr}T12:00:00`).getTime()) / 86400000);
  const sub  = `${d} ${MONTHS[m - 1]}`;
  const main = diff === -1 ? 'Kemarin' : diff === 0 ? 'Hari Ini' : diff === 1 ? 'Besok' : DAYS[obj.getDay()];
  return { main, sub };
};

const parseHourlyToPhases = (apiData: any): DayData[] => {
  const times = apiData.hourly.time as string[];
  const temps  = apiData.hourly.temperature_2m as number[];
  const codes  = apiData.hourly.weather_code as number[];
  const probs  = apiData.hourly.precipitation_probability as (number | null)[] | undefined;

  const dayMap: Record<string, Record<number, PhaseData>> = {};
  times.forEach((t, i) => {
    const date = t.slice(0, 10);
    const hour = parseInt(t.slice(11, 13));
    if (!dayMap[date]) dayMap[date] = {};
    dayMap[date][hour] = {
      temp: Math.round(temps[i]),
      weatherCode: codes[i],
      rainProb: probs?.[i] ?? 0,
    };
  });

  return Object.keys(dayMap).sort().map(date => {
    const h = dayMap[date];
    const pick = (target: number): PhaseData => {
      if (h[target]) return h[target];
      const keys = Object.keys(h).map(Number);
      if (!keys.length) return { temp: 28, weatherCode: 0, rainProb: 0 };
      const closest = keys.reduce((p, c) => Math.abs(c - target) < Math.abs(p - target) ? c : p, keys[0]);
      return h[closest];
    };
    return { date, pagi: pick(7), siang: pick(12), sore: pick(15), malam: pick(20) };
  });
};

export function WeatherScreen({ onBack }: WeatherScreenProps) {
  const todayStr = getLocalDateStr();

  const [searchQuery, setSearchQuery]       = useState('');
  const [loading, setLoading]               = useState(false);
  const [locationOptions, setLocationOptions] = useState<GeocodingResult[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<GeocodingResult | null>(null);
  const [days, setDays]                     = useState<DayData[]>([]);
  const [selectedDayIdx, setSelectedDayIdx] = useState(0);
  const [todayIdx, setTodayIdx]             = useState(0);
  const [errorMsg, setErrorMsg]             = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setLoading(true); setErrorMsg(''); setLocationOptions([]); setSelectedLocation(null); setDays([]);
    try {
      const res  = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(searchQuery)}&limit=5`);
      const data = await res.json();
      if (!data.features?.length) {
        setErrorMsg('Wilayah tidak ditemukan. Coba ketik nama desa, kecamatan, atau kota.');
      } else {
        setLocationOptions(data.features.map((f: any) => {
          const p = f.properties, c = f.geometry.coordinates;
          const parts: string[] = [];
          if (p.name) parts.push(p.name);
          if (p.city && p.city !== p.name) parts.push(p.city);
          return { name: parts.join(', '), latitude: c[1], longitude: c[0], admin1: p.state || p.county, country: p.country };
        }));
      }
    } catch { setErrorMsg('Gagal terhubung. Periksa koneksi internet Anda.'); }
    finally { setLoading(false); }
  };

  const handleSelectLocation = async (loc: GeocodingResult) => {
    setSelectedLocation(loc); setLocationOptions([]); setLoading(true); setErrorMsg('');
    try { localStorage.setItem('aquatani_last_location', JSON.stringify(loc)); } catch {}
    try {
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${loc.latitude}&longitude=${loc.longitude}` +
        `&hourly=temperature_2m,weather_code,precipitation_probability&past_days=1&forecast_days=8&timezone=auto`
      );
      const data = await res.json();

      if (data?.hourly) {
        const parsed = parseHourlyToPhases(data);
        setDays(parsed);

        const tIdx = parsed.findIndex(d => d.date === todayStr);
        const ti   = tIdx >= 0 ? tIdx : 0;
        setTodayIdx(ti);
        setSelectedDayIdx(ti);

        // Simpan ke localStorage agar bisa dibaca ChecklistScreen
        if (tIdx >= 0) {
          const td = parsed[tIdx];
          const cache = {
            locationName: `${loc.name}${loc.admin1 ? `, ${loc.admin1}` : ''}`,
            todayPhases: Object.fromEntries(
              PHASES.map(p => [p.key, { ...td[p.key], ...getWeatherInfo(td[p.key].weatherCode) }])
            ),
            savedAt: todayStr,
          };
          try { localStorage.setItem('aquatani_weather_cache', JSON.stringify(cache)); } catch {}
        }
      } else {
        setErrorMsg('Data cuaca tidak tersedia. Coba beberapa saat lagi.');
      }
    } catch { setErrorMsg('Gagal mengambil data cuaca. Periksa koneksi internet.'); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    try {
      const saved = localStorage.getItem('aquatani_last_location');
      if (saved) handleSelectLocation(JSON.parse(saved));
    } catch {}
  }, []);

  // Auto-scroll chip aktif ke tengah
  useEffect(() => {
    if (!scrollRef.current || !days.length) return;
    const chip = scrollRef.current.children[selectedDayIdx] as HTMLElement | undefined;
    chip?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }, [selectedDayIdx, days.length]);

  const selDay    = days[selectedDayIdx];
  const isYesterday = selectedDayIdx < todayIdx;
  const isFuture    = selectedDayIdx > todayIdx;

  return (
    <div className="min-h-screen pb-24 bg-slate-50">

      {/* Header */}
      <div className="bg-gradient-to-br from-emerald-600 via-teal-500 to-cyan-500 px-6 pt-10 pb-6 shadow-md">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white active:scale-95 transition-transform flex-shrink-0"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-xl text-white font-bold">Prakiraan Cuaca</h1>
            <p className="text-emerald-100 text-xs">Prediksi harian 4 fase untuk lahan Anda</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">

        {/* Search */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-emerald-50">
          <h3 className="text-gray-900 font-bold mb-3 text-sm">📍 Wilayah Lahan Anda</h3>
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Ketik desa, kecamatan atau kota..."
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:border-emerald-500 text-gray-800 placeholder-gray-400"
              />
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
            </div>
            <button
              type="submit"
              className="bg-emerald-600 text-white font-bold px-5 py-3 rounded-2xl text-sm active:scale-95 transition-all shadow-md"
            >
              Cari
            </button>
          </form>

          {loading && (
            <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-500">
              <div className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
              <span>Mencari data cuaca...</span>
            </div>
          )}

          {errorMsg && (
            <div className="mt-4 bg-red-50 border border-red-100 text-red-700 p-3 rounded-2xl text-xs flex gap-2 items-start">
              <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {locationOptions.length > 0 && (
            <div className="mt-4 border-t border-slate-100 pt-3 space-y-2">
              <p className="text-xs text-gray-500 font-medium">Pilih alamat yang paling tepat:</p>
              {locationOptions.map((loc, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectLocation(loc)}
                  className="w-full text-left bg-slate-50 hover:bg-emerald-50 border border-slate-100 hover:border-emerald-100 rounded-xl p-3 flex items-center gap-2.5 transition-all active:scale-[0.99]"
                >
                  <MapPin className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <div className="flex-1 overflow-hidden">
                    <p className="text-xs font-bold text-gray-800 truncate">{loc.name}</p>
                    <p className="text-[10px] text-gray-400 truncate">
                      {loc.admin1 ? `${loc.admin1}, ` : ''}{loc.country || 'Indonesia'}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Hasil Cuaca */}
        {selectedLocation && days.length > 0 && (
          <div className="space-y-4">

            {/* Lokasi aktif */}
            <div className="flex items-center gap-1.5 bg-white px-4 py-2.5 rounded-2xl border border-slate-100 shadow-sm w-fit max-w-full">
              <MapPin className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span className="text-xs font-bold text-gray-700 truncate">
                {selectedLocation.name}{selectedLocation.admin1 ? `, ${selectedLocation.admin1}` : ''}
              </span>
            </div>

            {/* Pemilih hari — scroll horizontal */}
            <div
              ref={scrollRef}
              className="flex gap-2 overflow-x-auto pb-1"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {days.map((day, idx) => {
                const { main, sub } = getDayChip(day.date, todayStr);
                const isActive = idx === selectedDayIdx;
                const isToday  = idx === todayIdx;
                return (
                  <button
                    key={day.date}
                    onClick={() => setSelectedDayIdx(idx)}
                    className={`flex-shrink-0 flex flex-col items-center py-2.5 px-3 rounded-2xl transition-all active:scale-95 border min-w-[68px] ${
                      isActive
                        ? 'bg-emerald-600 border-emerald-700 shadow-md'
                        : 'bg-white border-slate-100 shadow-sm'
                    }`}
                  >
                    <span className={`text-[11px] font-bold leading-tight ${isActive ? 'text-white' : isToday ? 'text-emerald-600' : 'text-gray-700'}`}>
                      {main}
                    </span>
                    <span className={`text-[9px] mt-0.5 ${isActive ? 'text-emerald-100' : 'text-gray-400'}`}>
                      {sub}
                    </span>
                    <span className="text-base mt-1">{getWeatherInfo(day.siang.weatherCode).emoji}</span>
                  </button>
                );
              })}
            </div>

            {/* Kartu 4 Fase */}
            {selDay && (
              <>
                {isYesterday && (
                  <div className="bg-amber-50 border border-amber-100 rounded-2xl px-4 py-2.5">
                    <p className="text-amber-700 text-xs font-semibold">📋 Menampilkan data cuaca kemarin</p>
                  </div>
                )}
                {isFuture && (
                  <div className="bg-blue-50 border border-blue-100 rounded-2xl px-4 py-2.5">
                    <p className="text-blue-700 text-xs font-semibold">🔮 Prakiraan — siapkan lahan Anda dari sekarang</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  {PHASES.map(phase => {
                    const pd   = selDay[phase.key];
                    const info = getWeatherInfo(pd.weatherCode);
                    const tip  = getFarmerTip(pd.weatherCode, phase.key);
                    const st   = PHASE_STYLES[phase.key];
                    return (
                      <div key={phase.key} className={`rounded-3xl overflow-hidden shadow-sm border ${st.border}`}>

                        {/* Bagian atas — latar pastel, teks gelap */}
                        <div className={`bg-gradient-to-br ${st.bgGrad} px-4 pt-4 pb-5`}>
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <p className={`${st.titleText} font-extrabold text-sm leading-tight`}>
                                {phase.label}
                              </p>
                              <p className="text-gray-500 text-[10px]">{phase.timeLabel}</p>
                            </div>
                            {pd.rainProb > 0 && (
                              <span className={`${st.badgeBg} ${st.badgeText} px-2 py-0.5 rounded-full text-[10px] font-bold`}>
                                🌧 {pd.rainProb}%
                              </span>
                            )}
                          </div>

                          <div className="flex items-end justify-between">
                            <div>
                              <div className="flex items-baseline leading-none">
                                <span className="text-4xl font-black text-gray-800 tracking-tight">{pd.temp}</span>
                                <span className={`text-base font-bold ml-0.5 ${st.tempAccent}`}>°C</span>
                              </div>
                              <p className={`text-[11px] font-semibold ${st.condText} mt-1`}>{info.label}</p>
                            </div>
                            <span className="text-5xl leading-none">{info.emoji}</span>
                          </div>
                        </div>

                        {/* Bagian bawah putih — saran petani */}
                        <div className="bg-white px-3 py-3 border-t border-gray-100">
                          <p className="text-[11px] text-gray-600 leading-relaxed">{tip}</p>
                        </div>

                      </div>
                    );
                  })}
                </div>

                {/* Ringkasan saran harian */}
                {!isYesterday && (
                  <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 rounded-3xl p-5 shadow-sm">
                    <div className="flex gap-3 items-start">
                      <span className="text-3xl flex-shrink-0">🌾</span>
                      <div>
                        <h4 className="text-emerald-900 font-extrabold text-sm mb-2">
                          {isFuture ? 'Persiapan Hari Itu' : 'Ringkasan Saran Hari Ini'}
                        </h4>
                        {(() => {
                          const maxRain = Math.max(selDay.pagi.rainProb, selDay.siang.rainProb, selDay.sore.rainProb, selDay.malam.rainProb);
                          const maxTemp = Math.max(selDay.pagi.temp, selDay.siang.temp, selDay.sore.temp);
                          const tips: string[] = [];
                          if (maxRain >= 60)      tips.push('⛈️ Peluang hujan besar. Siapkan penutup kolam & cek saluran pembuangan agar tidak meluap.');
                          else if (maxRain >= 30) tips.push('🌦️ Ada kemungkinan hujan. Pantau pH air setelah hujan & pastikan filter tidak tersumbat.');
                          if (maxTemp >= 32)      tips.push('🌡️ Suhu siang diprediksi panas. Pastikan aerasi & sirkulasi air berjalan maksimal.');
                          if (!tips.length)       tips.push('✅ Cuaca kondusif hari ini. Lakukan rutinitas pagi dan sore seperti biasa — ikan & tanaman aman.');
                          return tips.map((t, i) => (
                            <p key={i} className="text-xs text-emerald-800 leading-relaxed mb-1 last:mb-0">{t}</p>
                          ));
                        })()}
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Placeholder awal */}
        {!selectedLocation && !loading && (
          <div className="bg-blue-50 border border-blue-100 rounded-3xl p-6 text-center space-y-4">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl mx-auto flex items-center justify-center text-blue-600">
              <CloudRain className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-blue-900 font-bold text-base mb-1.5">Mengapa Cuaca Penting?</h3>
              <p className="text-xs text-blue-800 leading-relaxed px-2">
                Suhu, sinar matahari, dan hujan langsung memengaruhi pH air, suhu kolam, serta kesehatan ikan dan tanaman.
              </p>
            </div>
            <div className="bg-white/80 rounded-2xl p-4 border border-blue-100/50 text-left">
              <p className="text-xs text-slate-600 leading-relaxed">
                💡 <strong>Tips:</strong> Ketik nama wilayah lahan Anda di atas untuk mendapat prakiraan 4 fase per hari selama 7 hari ke depan!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
