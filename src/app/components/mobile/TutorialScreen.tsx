import { useState } from 'react';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

interface TutorialScreenProps {
  onBack: () => void;
}

const modules = [
  {
    emoji: '📖',
    title: 'Apa Itu Akuaponik',
    description: 'Cara kerja sistem akuaponik yang mudah dipahami',
    duration: '15 menit',
    color: 'bg-emerald-500',
    content: (
      <div className="space-y-5 text-gray-700 leading-relaxed">
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Kerja Sama Sempurna Ikan dan Tanaman</h3>
          <p>Pernah bayangin bisa panen ikan segar dan sayur organik sekaligus di halaman rumah? Itulah serunya akuaponik! Singkatnya, akuaponik adalah gabungan dari memelihara ikan (akuakultur) dan menanam sayur tanpa tanah (hidroponik). Di sistem ini, ikan dan tanaman saling bantu untuk hidup subur.</p>
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Bagaimana Cara Kerjanya?</h3>
          <p>Rahasia utamanya ada di kotoran ikan. Saat kamu kasih makan ikan, kotoran yang mereka keluarkan mengandung amonia (racun buat ikan). Nah, air yang kotor ini dialirkan ke tempat tanaman. Di sinilah "bakteri baik" bekerja mengubah racun tersebut menjadi nutrisi super atau pupuk alami!</p>
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Kenapa Kamu Harus Coba?</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Sangat Hemat Air:</strong> Sistem ini memutar air yang sama terus-menerus. Kamu hanya perlu nambahin sedikit air kalau ada yang menguap.</li>
            <li><strong>Tanpa Pupuk Kimia:</strong> Nutrisi tanaman murni 100% dari kotoran ikan. Jadi sayurmu dijamin organik dan sehat!</li>
            <li><strong>Otomatis Membersihkan Air:</strong> Akar tanaman menyerap nutrisi dari air kotor tadi. Hasilnya, air jadi bersih kembali saat dialirkan turun ke kolam ikan. Ikan pun seneng!</li>
          </ul>
        </div>
      </div>
    )
  },
  {
    emoji: '🔄',
    title: 'Yang Dicek Setiap Hari',
    description: 'Hal-hal yang harus dilihat tiap pagi dan sore',
    duration: '10 menit',
    color: 'bg-blue-500',
    content: (
      <div className="space-y-5 text-gray-700 leading-relaxed">
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Rutinitas Pagi dan Sore yang Nggak Boleh Bolong</h3>
          <p>Sistem akuaponik memang berjalan otomatis, tapi bukan berarti bisa ditinggal tidur terus. Sebagai "bos" dari ekosistem ini, kamu perlu meluangkan waktu sekitar 5-10 menit setiap pagi dan sore untuk memastikan semuanya aman terkendali.</p>
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">3 Hal Utama yang Wajib Kamu Cek:</h3>
          <ul className="list-disc pl-5 space-y-3">
            <li><strong>Nafsu Makan Ikan:</strong> Saat kasih makan, perhatikan apakah ikan langsung lahap? Kalau mereka tiba-tiba malas makan atau banyak diam di pojokan, itu tanda awal airnya bermasalah atau ikannya sedang sakit.</li>
            <li><strong>Kelancaran Pompa dan Aliran Air:</strong> Pastikan air mengalir deras dari kolam ke filter dan ke tempat tanaman. Kalau aliran air mampet, ikan bisa kehabisan oksigen dan bakteri baik bisa mati. Segera bersihkan selang kalau terlihat ada sumbatan.</li>
            <li><strong>Kondisi Daun Tanaman:</strong> Cek apakah ada daun yang layu, menguning, atau bolong dimakan ulat. Membuang daun yang rusak sejak dini akan mencegah hama menyebar ke tanaman lain.</li>
          </ul>
        </div>
      </div>
    )
  },
  {
    emoji: '🧪',
    title: 'Cara Jaga pH Air',
    description: 'Supaya pH air tetap bagus untuk ikan dan tanaman',
    duration: '12 menit',
    color: 'bg-cyan-500',
    content: (
      <div className="space-y-5 text-gray-700 leading-relaxed">
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Titik Tengah Biar Ikan dan Tanaman Sama-sama Nyaman</h3>
          <p>pH air adalah ukuran seberapa asam atau basanya air di sistemmu. Ini krusial banget! Kalau pH terlalu tinggi, tanaman nggak bisa menyerap nutrisi (jadinya kerdil). Kalau pH terlalu rendah, ikan yang bisa mabuk. Target pH ideal di akuaponik adalah <strong>6.8 sampai 7.0</strong>.</p>
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Kapan dan Bagaimana Cara Mengeceknya?</h3>
          <p>Kamu wajib mengecek pH minimal seminggu sekali menggunakan pH meter digital atau kertas indikator pH cair. Jangan tunggu sampai tanaman kuning atau ikan lemas. Tes pH sebaiknya dilakukan di waktu yang sama, misalnya setiap hari Minggu pagi.</p>
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Gimana Kalau pH-nya Naik atau Turun?</h3>
          <ul className="list-disc pl-5 space-y-3">
            <li><strong>Kalau pH Terlalu Tinggi (Basa, di atas 7.5):</strong> Jangan pakai bahan kimia keras! Kamu bisa turunin pelan-pelan pakai cara alami, seperti merendam <strong>daun ketapang</strong> kering di dalam filter, atau menambahkan sedikit ekstrak perasan jeruk nipis/asam sitrat secara bertahap.</li>
            <li><strong>Kalau pH Terlalu Rendah (Asam, di bawah 6.5):</strong> Tambahkan <strong>cangkang telur rebus</strong> yang sudah ditumbuk kasar, atau masukkan <strong>karang jahe / cangkang tiram</strong> ke dalam filter. Bahan-bahan ini akan melepaskan kalsium perlahan-lahan untuk menaikkan pH dengan aman.</li>
          </ul>
        </div>
      </div>
    )
  },
  {
    emoji: '🌧️',
    title: 'Kalau Musim Hujan',
    description: 'Yang harus dilakukan saat hujan deras',
    duration: '8 menit',
    color: 'bg-slate-500',
    content: (
      <div className="space-y-5 text-gray-700 leading-relaxed">
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Amankan Sistem dari Hujan Deras</h3>
          <p>Buat kamu yang sistem akuaponiknya ada di luar ruangan (outdoor), musim hujan adalah ujian yang lumayan bikin deg-degan. Air hujan punya sifat asam (pH rendah) dan bisa mengubah suhu air kolam secara drastis, yang bikin ikan stres dan gampang sakit.</p>
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Langkah Pencegahan Utama:</h3>
          <ul className="list-disc pl-5 space-y-3">
            <li><strong>Pasang Atap Pelindung:</strong> Ini cara paling ampuh! Pasang plastik UV atau atap transparan di atas kolam dan tanaman. Selain mencegah air hujan masuk, atap ini juga melindungi tanaman dari hantaman rintik hujan yang berat.</li>
            <li><strong>Siapkan Pipa Pembuangan (Overflow):</strong> Kalau sistemmu dibiarkan kena hujan, air kolam pasti akan bertambah. Pastikan kolammu punya lubang pembuangan otomatis (overflow) di batas maksimal air, supaya air berlebih langsung terbuang dan ikan nggak ikut melompat/hanyut keluar.</li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Yang Harus Dilakukan Setelah Hujan Deras:</h3>
          <p>Segera <strong>cek pH air</strong> pakai alat ukurmu. Karena air hujan itu asam, pH kolammu biasanya akan ikutan drop. Kalau angkanya turun drastis di bawah 6.5, segera tambahkan karang jahe atau sedikit kapur pertanian (dolomit) ke dalam filter untuk menstabilkannya kembali. Jangan lupa juga hentikan kasih makan ikan sehari jika suhu air terasa sangat dingin.</p>
        </div>
      </div>
    )
  },
  {
    emoji: '🔧',
    title: 'Cara Kerja Saringan',
    description: 'Bagaimana saringan membersihkan air',
    duration: '15 menit',
    color: 'bg-indigo-500',
    content: (
      <div className="space-y-5 text-gray-700 leading-relaxed">
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Jantung Bersihnya Sistem Akuaponik</h3>
          <p>Tanpa saringan (filter) yang baik, kolam ikanmu bakal berubah jadi septik tank berlumpur! Di akuaponik, kita membagi tugas saringan ini jadi dua bagian yang sangat penting: mekanis dan biologis. Keduanya nggak boleh dipisahkan.</p>
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">1. Saringan Mekanis (Penyaring Sampah):</h3>
          <p>Tugasnya seperti saringan kopi, yaitu <strong>menangkap kotoran padat</strong> (tai ikan, sisa pelet, daun rontok) biar nggak masuk ke akar tanaman. Biasanya pakai kapas filter (dakron) atau jaring nelayan.</p>
          <ul className="list-disc pl-5 mt-2">
            <li><strong>Perawatan:</strong> Ini adalah bagian yang <strong>paling rajin kotor</strong>. Kamu harus cuci/semprot saringan ini 1-2 minggu sekali biar air tetap lancar.</li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">2. Saringan Biologis (Rumah Bakteri):</h3>
          <p>Ini adalah bagian "ajaib" tempat bakteri baik mengubah kotoran jadi pupuk. Isinya biasanya berupa batu apung, bioball, atau pecahan genteng.</p>
          <ul className="list-disc pl-5 mt-2">
            <li><strong>Perawatan:</strong> <strong>JANGAN PERNAH</strong> mencuci filter ini pakai sabun atau air keran! Air keran mengandung kaporit yang bisa membunuh bakteri baikmu. Kalau saringan ini terlihat berlendir, cukup bilas pelan-pelan pakai <em>air dari kolam itu sendiri</em> (jangan sampai bersih kesat).</li>
          </ul>
        </div>
      </div>
    )
  },
  {
    emoji: '🌱',
    title: 'Makanan Tanaman',
    description: 'Cara kasih nutrisi yang cukup untuk tanaman',
    duration: '10 menit',
    color: 'bg-green-500',
    content: (
      <div className="space-y-5 text-gray-700 leading-relaxed">
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Dari Mana Sayuranmu Dapat Nutrisi?</h3>
          <p>Berbeda dengan bertani di tanah yang harus rajin dikasih pupuk NPK, di akuaponik, makanan utama tanamanmu 100% berasal dari apa yang kamu berikan ke ikanmu. Kualitas makanan ikan = Kualitas sayuranmu!</p>
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Pilih Pelet Ikan yang Tepat:</h3>
          <p>Jangan asal beli pelet murah. Beli pelet ikan (pakan pabrikan) yang punya kandungan protein tinggi (sekitar 30% ke atas). Protein inilah yang nantinya diurai oleh sistem menjadi nitrogen yang bikin daun tanamanmu lebat dan hijau segar. Berikan makan secukupnya sampai ikan berhenti makan (biasanya habis dalam 3-5 menit). Sisa pakan yang mengambang malah bikin air beracun.</p>
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Suplemen Tambahan (Bila Perlu):</h3>
          <p>Kadang, kotoran ikan saja nggak cukup, terutama untuk zat besi dan kalium. Kalau daun muda tanamanmu terlihat menguning tapi urat daunnya hijau (klorosis), itu tanda kurang zat besi.</p>
          <ul className="list-disc pl-5 mt-2">
            <li><strong>Solusinya:</strong> Kamu bisa menambahkan suplemen khusus yang aman buat ikan, seperti <strong>Chelated Iron (Zat Besi Kelat)</strong> dan tepung rumput laut (Kelp) seminggu atau dua minggu sekali. Ingat, <strong>jangan pernah</strong> memakai pupuk kimia tanaman biasa karena bisa langsung meracuni ikanmu!</li>
          </ul>
        </div>
      </div>
    )
  }
];

export function TutorialScreen({ onBack }: TutorialScreenProps) {
  const [activeModule, setActiveModule] = useState<number | null>(null);
  const [completedModules, setCompletedModules] = useState<number[]>([]);

  const handleMarkComplete = (index: number) => {
    if (!completedModules.includes(index)) {
      setCompletedModules([...completedModules, index]);
    }
    setActiveModule(null);
  };

  if (activeModule !== null) {
    const module = modules[activeModule];
    return (
      <div className="min-h-screen bg-white pb-20 animate-in fade-in slide-in-from-bottom-4 duration-300">
        <div className={`${module.color} px-4 pt-4 pb-8 text-white rounded-b-3xl shadow-sm`}>
          <button
            onClick={() => setActiveModule(null)}
            className="flex items-center gap-2 mb-6 active:opacity-70"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Kembali</span>
          </button>
          <div className="text-4xl mb-3 bg-white/20 w-16 h-16 flex items-center justify-center rounded-2xl backdrop-blur-sm">
            {module.emoji}
          </div>
          <h1 className="text-2xl font-bold mb-2">{module.title}</h1>
          <p className="text-white/90 text-sm leading-relaxed">{module.description}</p>
        </div>
        
        <div className="px-5 py-6">
          {module.content}
          
          <button 
            onClick={() => handleMarkComplete(activeModule)}
            className="w-full mt-10 bg-emerald-600 text-white py-4 rounded-2xl font-medium active:scale-95 transition-all flex items-center justify-center gap-2 shadow-md hover:bg-emerald-700"
          >
            <CheckCircle2 className="w-5 h-5" />
            Tandai Selesai & Kembali
          </button>
        </div>
      </div>
    );
  }

  const progressPercentage = Math.round((completedModules.length / modules.length) * 100);

  return (
    <div className="min-h-screen pb-20 bg-gray-50/50">
      {/* Header */}
      <div className="bg-emerald-600 px-4 pt-4 pb-5 rounded-b-3xl shadow-sm">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-white mb-4 active:opacity-70"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Kembali</span>
        </button>
        <h1 className="text-2xl font-bold text-white mb-1">Cara Pakai</h1>
        <p className="text-emerald-50 text-sm">Panduan praktis akuaponik</p>
      </div>

      {/* Progress Overview */}
      <div className="px-4 pt-5 mb-5">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-700">Progress Belajar</span>
            <span className="text-sm font-bold text-emerald-600">{completedModules.length}/{modules.length} Selesai</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
            <div 
              className="bg-emerald-500 h-2.5 rounded-full transition-all duration-500 ease-out" 
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Module Cards */}
      <div className="px-4 space-y-3">
        {modules.map((module, index) => {
          const isCompleted = completedModules.includes(index);
          return (
            <div
              key={index}
              onClick={() => setActiveModule(index)}
              className={`bg-white rounded-2xl p-4 shadow-sm hover:shadow-md active:scale-[0.98] transition-all border cursor-pointer ${
                isCompleted ? 'border-emerald-200 bg-emerald-50/30' : 'border-gray-100'
              }`}
            >
              <div className="flex items-start gap-4 mb-3">
                <div className={`${module.color} w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm text-2xl`}>
                  {module.emoji}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className={`font-semibold mb-1 ${isCompleted ? 'text-gray-700' : 'text-gray-900'}`}>
                      {module.title}
                    </h3>
                    {isCompleted && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-sm text-gray-500 line-clamp-2">{module.description}</p>
                </div>
              </div>

              <div className="flex items-center justify-between mt-2 pt-3 border-t border-gray-50">
                <div className="flex items-center gap-1.5 text-sm font-medium text-gray-400">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{module.duration}</span>
                </div>
                <button 
                  className={`px-5 py-2 rounded-xl text-sm font-medium active:scale-95 transition-all ${
                    isCompleted 
                      ? 'bg-emerald-100 text-emerald-700' 
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  }`}
                >
                  {isCompleted ? 'Baca Lagi' : 'Baca'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Info Card */}
      <div className="px-4 mt-6">
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 shadow-sm">
          <div className="flex items-start gap-3">
            <span className="text-2xl">💡</span>
            <div>
              <h4 className="font-semibold text-blue-900 mb-0.5">Tips</h4>
              <p className="text-sm text-blue-800 leading-relaxed">
                Baca dari atas ke bawah ya biar lebih mudah paham.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
