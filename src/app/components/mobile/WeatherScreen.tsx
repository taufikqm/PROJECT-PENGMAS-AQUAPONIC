import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search, CloudRain, Wind, Droplets, MapPin, AlertTriangle } from 'lucide-react';

interface WeatherScreenProps {
  onBack: () => void;
}

interface GeocodingResult {
  name: string;
  latitude: number;
  longitude: number;
  admin1?: string; // Province
  country?: string;
}

interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  weatherCode: number;
  rain: number;
  isDay: boolean;
  time: string;
  daily: Array<{
    date: string;
    code: number;
    tempMax: number;
    tempMin: number;
    rainProb: number;
  }>;
}

// Translate WMO Weather Code to Indonesian explanation & Farmer Advice
const getWeatherDetails = (code: number) => {
  switch (code) {
    case 0:
      return {
        label: 'Cerah',
        emoji: '☀️',
        bgGradient: 'from-amber-400 to-orange-500',
        textColor: 'text-amber-600',
        advice: 'Cuaca cerah sangat bagus untuk fotosintesis tanaman sayur! Pastikan aliran air dari kolam ke tanaman tetap lancar agar tanaman tidak layu kepanasan.',
      };
    case 1:
    case 2:
    case 3:
      return {
        label: 'Cerah Berawan',
        emoji: '⛅',
        bgGradient: 'from-sky-400 to-blue-500',
        textColor: 'text-sky-600',
        advice: 'Suhu ideal untuk pertumbuhan ikan dan tanaman. Waktu yang tepat untuk memberi makan ikan secara teratur dan memeriksa kebersihan saringan air.',
      };
    case 45:
    case 48:
      return {
        label: 'Berkabut',
        emoji: '🌫️',
        bgGradient: 'from-slate-400 to-zinc-550',
        textColor: 'text-slate-600',
        advice: 'Udara dingin berkabut. Jaga suhu air kolam agar tidak turun drastis, karena perubahan suhu ekstrem bisa membuat ikan stres.',
      };
    case 51:
    case 53:
    case 55:
      return {
        label: 'Gerimis',
        emoji: '🌦️',
        bgGradient: 'from-teal-400 to-emerald-600',
        textColor: 'text-teal-600',
        advice: 'Gerimis tipis. Biasanya tidak memengaruhi kualitas air secara signifikan, namun tetap pantau keaktifan ikan saat diberi makan.',
      };
    case 61:
    case 63:
    case 65:
      return {
        label: 'Hujan',
        emoji: '🌧️',
        bgGradient: 'from-blue-500 to-indigo-600',
        textColor: 'text-blue-600',
        advice: 'Hujan dapat menurunkan pH air kolam secara drastis (air menjadi asam). Tutup sebagian permukaan kolam jika memungkinkan, dan periksa pH air setelah hujan reda.',
      };
    case 80:
    case 81:
    case 82:
      return {
        label: 'Hujan Deras Lokal',
        emoji: '🌧️',
        bgGradient: 'from-indigo-600 to-violet-700',
        textColor: 'text-indigo-600',
        advice: 'Hujan deras mendadak! Pastikan saluran pipa pembuangan kolam bebas dari sumbatan agar air kolam tidak meluap keluar.',
      };
    case 95:
    case 96:
    case 99:
      return {
        label: 'Hujan disertai Petir',
        emoji: '⛈️',
        bgGradient: 'from-purple-600 to-slate-800',
        textColor: 'text-purple-600',
        advice: 'Hujan lebat disertai petir! Segera matikan sementara sambungan listrik pompa kolam atau alat sensor IoT jika rawan tersambar petir demi keamanan.',
      };
    default:
      return {
        label: 'Berawan',
        emoji: '☁️',
        bgGradient: 'from-slate-400 to-slate-600',
        textColor: 'text-slate-600',
        advice: 'Cuaca berawan biasa. Pantau suhu air kolam agar tetap stabil di angka ideal (25°C - 30°C).',
      };
  }
};

const getIndonesianDayName = (dateStr: string) => {
  const date = new Date(dateStr);
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  return days[date.getDay()];
};

export function WeatherScreen({ onBack }: WeatherScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [locationOptions, setLocationOptions] = useState<GeocodingResult[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<GeocodingResult | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  // 1. Search Location & Validate Address
  const handleSearchLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    setErrorMsg('');
    setLocationOptions([]);
    setSelectedLocation(null);
    setWeatherData(null);

    try {
      // Fetch locations using Photon API (extremely accurate, indexes all sub-districts and villages in Indonesia)
      const res = await fetch(
        `https://photon.komoot.io/api/?q=${encodeURIComponent(searchQuery)}&limit=5`
      );
      const data = await res.json();

      if (!data.features || data.features.length === 0) {
        setErrorMsg('Nama wilayah tidak ditemukan. Coba ketik dengan ejaan yang benar (contoh: Lembang, Ciparay, Bandung).');
      } else {
        const mappedResults: GeocodingResult[] = data.features.map((f: any) => {
          const prop = f.properties;
          const coords = f.geometry.coordinates; // [longitude, latitude]
          
          const displayName = [];
          if (prop.name) displayName.push(prop.name);
          if (prop.city && prop.city !== prop.name) displayName.push(prop.city);
          
          return {
            name: displayName.join(', '),
            latitude: coords[1], // Latitude is at index 1
            longitude: coords[0], // Longitude is at index 0
            admin1: prop.state || prop.county,
            country: prop.country,
          };
        });
        setLocationOptions(mappedResults);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Gagal menyambung ke peta pencari alamat. Periksa koneksi internet Anda.');
    } finally {
      setLoading(false);
    }
  };

  // 2. Fetch Weather based on selected coordinates
  const handleSelectLocation = async (loc: GeocodingResult) => {
    setSelectedLocation(loc);
    setLocationOptions([]);
    setLoading(true);
    setErrorMsg('');

    try {
      // Save last selected location to LocalStorage
      localStorage.setItem('aquatani_last_location', JSON.stringify(loc));
    } catch (e) {
      console.error(e);
    }

    try {
      // Fetch weather from Open-Meteo Forecast API
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${loc.latitude}&longitude=${loc.longitude}&current=temperature_2m,relative_humidity_2m,is_day,precipitation,rain,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto`
      );
      const data = await res.json();

      if (data && data.current) {
        // Map raw response to custom clean state
        const mappedDaily = data.daily.time.slice(1, 4).map((timeStr: string, idx: number) => ({
          date: timeStr,
          code: data.daily.weather_code[idx + 1],
          tempMax: Math.round(data.daily.temperature_2m_max[idx + 1]),
          tempMin: Math.round(data.daily.temperature_2m_min[idx + 1]),
          rainProb: data.daily.precipitation_probability_max[idx + 1] || 0,
        }));

        setWeatherData({
          temperature: Math.round(data.current.temperature_2m),
          humidity: Math.round(data.current.relative_humidity_2m),
          windSpeed: Math.round(data.current.wind_speed_10m),
          weatherCode: data.current.weather_code,
          rain: data.current.rain,
          isDay: data.current.is_day === 1,
          time: data.current.time,
          daily: mappedDaily,
        });
      } else {
        setErrorMsg('Data cuaca tidak berhasil ditarik. Coba ulangi beberapa saat lagi.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Gagal menyambung ke satelit cuaca. Periksa koneksi internet Anda.');
    } finally {
      setLoading(false);
    }
  };

  // Load last saved location on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('aquatani_last_location');
      if (saved) {
        const parsed = JSON.parse(saved);
        handleSelectLocation(parsed);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  return (
    <div className="min-h-screen pb-24 bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-emerald-600 via-teal-500 to-cyan-500 px-6 pt-10 pb-6 shadow-md flex items-center gap-4">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white active:scale-95 transition-transform"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div>
          <h1 className="text-xl text-white font-bold">Prakiraan Cuaca</h1>
          <p className="text-emerald-100 text-xs font-medium">Prediksi Tepat untuk Kebun Anda</p>
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Search Bar Address */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-emerald-50">
          <h3 className="text-gray-900 font-bold mb-3 text-base">Masukkan Alamat / Wilayah Lahan</h3>
          <form onSubmit={handleSearchLocation} className="relative flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ketik Desa, Kecamatan atau Kota..."
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:border-emerald-500 text-gray-800 placeholder-gray-400"
              />
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
            </div>
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-3 rounded-2xl text-sm active:scale-95 transition-all shadow-md flex items-center justify-center"
            >
              Cari
            </button>
          </form>

          {/* Loading State */}
          {loading && (
            <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-500">
              <div className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
              <span>Sedang mencari titik koordinat...</span>
            </div>
          )}

          {/* Error Message */}
          {errorMsg && (
            <div className="mt-4 bg-red-50 border border-red-100 text-red-700 p-3 rounded-2xl text-xs flex gap-2 items-start">
              <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Validation Address Dropdown / Options */}
          {locationOptions.length > 0 && (
            <div className="mt-4 border-t border-slate-100 pt-3 space-y-2">
              <p className="text-xs text-gray-500 font-medium mb-1">Pilih alamat yang paling tepat:</p>
              {locationOptions.map((loc, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectLocation(loc)}
                  className="w-full text-left bg-slate-50 hover:bg-emerald-50 border border-slate-100 hover:border-emerald-100 rounded-xl p-3 flex items-center gap-2.5 transition-all active:scale-[0.99]"
                >
                  <MapPin className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <div className="flex-1 overflow-hidden">
                    <p className="text-xs font-bold text-gray-800 truncate">
                      {loc.name}
                    </p>
                    <p className="text-[10px] text-gray-400 truncate">
                      {loc.admin1 ? `${loc.admin1}, ` : ''}{loc.country || 'Indonesia'}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Weather Results Screen */}
        {selectedLocation && weatherData && (
          <div className="space-y-4 animate-fadeIn">
            
            {/* CURRENT WEATHER CARD */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-emerald-50 relative overflow-hidden">
              {/* Location Badge */}
              <div className="flex items-center gap-1.5 text-gray-600 mb-4 bg-slate-100 w-fit px-3 py-1 rounded-full border border-slate-200">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-xs font-bold truncate max-w-[200px]">
                  {selectedLocation.name}{selectedLocation.admin1 ? `, ${selectedLocation.admin1}` : ''}
                </span>
              </div>

              {/* Main Weather Visual Info */}
              <div className="flex items-center justify-between gap-4 mb-6">
                <div>
                  <div className="flex items-baseline">
                    <span className="text-5xl font-black text-gray-900 tracking-tight">{weatherData.temperature}</span>
                    <span className="text-2xl font-bold text-emerald-600 ml-0.5">°C</span>
                  </div>
                  <p className="text-gray-900 font-bold text-lg mt-1 flex items-center gap-1.5">
                    <span>{getWeatherDetails(weatherData.weatherCode).emoji}</span>
                    <span>{getWeatherDetails(weatherData.weatherCode).label}</span>
                  </p>
                </div>
                {/* Large animated/styled weather badge */}
                <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${getWeatherDetails(weatherData.weatherCode).bgGradient} flex items-center justify-center shadow-lg text-4xl text-white`}>
                  {getWeatherDetails(weatherData.weatherCode).emoji}
                </div>
              </div>

              {/* Sub parameters (Humidity, Wind) */}
              <div className="grid grid-cols-2 gap-3 border-t border-slate-100 pt-4">
                <div className="bg-slate-50 rounded-2xl p-3 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                    <Droplets className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-medium">Kelembapan</p>
                    <p className="text-xs font-bold text-gray-800">{weatherData.humidity}%</p>
                  </div>
                </div>
                <div className="bg-slate-50 rounded-2xl p-3 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-teal-100 flex items-center justify-center text-teal-600">
                    <Wind className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-medium">Angin</p>
                    <p className="text-xs font-bold text-gray-800">{weatherData.windSpeed} km/j</p>
                  </div>
                </div>
              </div>
            </div>

            {/* FARMER ACTION ADVICE CARD */}
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 rounded-3xl p-5 shadow-sm">
              <div className="flex gap-3.5 items-start">
                <div className="text-3xl drop-shadow-sm flex-shrink-0">🌾</div>
                <div>
                  <h4 className="text-emerald-900 font-extrabold text-sm mb-1.5">Saran untuk Kebun Akuaponik Anda</h4>
                  <p className="text-xs text-emerald-800 leading-relaxed text-justify">
                    {getWeatherDetails(weatherData.weatherCode).advice}
                  </p>
                </div>
              </div>
            </div>

            {/* 3-DAY FUTURE FORECAST */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-emerald-50">
              <h3 className="text-gray-900 font-bold text-base mb-4 border-b border-slate-100 pb-2">Ramalan Cuaca Besok & Lusa</h3>
              <div className="divide-y divide-slate-100">
                {weatherData.daily.map((day, idx) => (
                  <div key={idx} className="py-3.5 flex items-center justify-between first:pt-0 last:pb-0">
                    <div className="w-24">
                      <p className="text-xs font-bold text-gray-800">{getIndonesianDayName(day.date)}</p>
                      <p className="text-[10px] text-gray-400">{day.date}</p>
                    </div>
                    
                    <div className="flex items-center gap-1.5 w-28 justify-center">
                      <span className="text-lg">{getWeatherDetails(day.code).emoji}</span>
                      <span className="text-xs text-gray-600 font-semibold">{getWeatherDetails(day.code).label}</span>
                    </div>

                    <div className="text-right">
                      <p className="text-xs font-bold text-gray-800">{day.tempMin}° - {day.tempMax}°C</p>
                      {day.rainProb > 0 ? (
                        <p className="text-[9px] text-blue-500 font-semibold flex items-center justify-end gap-0.5">
                          <CloudRain className="w-2.5 h-2.5" />
                          <span>Peluang Hujan {day.rainProb}%</span>
                        </p>
                      ) : (
                        <p className="text-[9px] text-gray-400 font-medium">Kering</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* DEFAULT PLACEHOLDER/EDUCATION BANNER WHEN NO LOCATION SEARCHED */}
        {!selectedLocation && !loading && (
          <div className="bg-blue-50 border border-blue-100 rounded-3xl p-6 text-center space-y-4">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl mx-auto flex items-center justify-center text-blue-600">
              <CloudRain className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-blue-900 font-bold text-base mb-1.5">Mengapa Cuaca Penting Bagi Akuaponik?</h3>
              <p className="text-xs text-blue-800 leading-relaxed text-center px-2">
                Suhu udara, intensitas sinar matahari, dan air hujan secara langsung memengaruhi suhu kolam, tingkat keasaman (pH) air, serta kesehatan ikan dan tanaman. 
              </p>
            </div>
            <div className="bg-white/80 rounded-2xl p-4 border border-blue-100/50 text-left">
              <p className="text-xs text-slate-600 leading-relaxed">
                💡 <strong>Tips Petani:</strong> Ketikkan wilayah kebun Anda di kolom pencarian di atas untuk mendapatkan saran perawatan kolam yang pas sesuai perkiraan cuaca!
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
