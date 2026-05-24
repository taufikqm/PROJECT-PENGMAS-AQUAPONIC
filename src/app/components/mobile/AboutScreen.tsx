import React from 'react';

interface AboutScreenProps {
  onBack: () => void;
}

export function AboutScreen({ onBack }: AboutScreenProps) {
  return (
    <div className="min-h-screen pb-24 bg-slate-50">
      {/* Header with Gradient */}
      <div className="bg-gradient-to-br from-emerald-600 via-teal-500 to-cyan-500 px-6 pt-10 pb-8 shadow-md relative overflow-hidden">
        {/* Background decorative circles */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-xl"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-8 -mb-8 blur-lg"></div>
        
        <div className="relative z-10 flex flex-col items-center justify-center text-center mt-4">
          <div className="w-24 h-24 bg-white rounded-3xl p-2 shadow-xl border-4 border-white/40 mb-4 flex items-center justify-center overflow-hidden">
            <img 
              src="/aquatani-logo.png" 
              alt="AquaTani Logo" 
              className="w-full h-full object-contain" 
            />
          </div>
          <h1 className="text-2xl text-white font-bold mb-1 tracking-wide">AquaTani</h1>
          <p className="text-emerald-50 text-sm font-medium">Panduan Akuaponik Pintar</p>
          <div className="mt-3 inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
            <p className="text-xs text-white font-medium">Versi 1.0 (Edukasi)</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 -mt-4 relative z-20 space-y-4">
        
        {/* Apa itu AquaTani? */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-emerald-50">
          <div className="mb-4 border-b border-gray-100 pb-2">
            <h3 className="text-gray-900 font-bold text-lg">Tentang Aplikasi</h3>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed text-justify">
            <strong>AquaTani</strong> adalah aplikasi panduan edukasi sederhana yang dibuat khusus untuk membantu Bapak/Ibu petani dalam mempelajari dan merawat budidaya akuaponik. Kami menyediakan panduan lengkap mulai dari cara cek kondisi air, menangani ikan sakit, hingga jadwal tugas harian.
          </p>
        </div>

        {/* Latar Belakang & Tujuan */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-emerald-50">
          <div className="mb-4 border-b border-gray-100 pb-2">
            <h3 className="text-gray-900 font-bold text-lg">Tujuan Proyek</h3>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed text-justify mb-4">
            Sistem akuaponik modern terkadang sulit dipahami. Proyek pengabdian masyarakat ini hadir sebagai jembatan agar teknologi lebih mudah dimengerti. Tujuan utama kami adalah:
          </p>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <div className="mt-0.5 w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                <span className="text-emerald-600 text-xs font-bold">✓</span>
              </div>
              <p className="text-sm text-gray-600">Mendukung keberlanjutan pertanian perkotaan (urban farming).</p>
            </li>
            <li className="flex items-start gap-3">
              <div className="mt-0.5 w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                <span className="text-emerald-600 text-xs font-bold">✓</span>
              </div>
              <p className="text-sm text-gray-600">Meningkatkan ketahanan pangan mandiri.</p>
            </li>
            <li className="flex items-start gap-3">
              <div className="mt-0.5 w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                <span className="text-emerald-600 text-xs font-bold">✓</span>
              </div>
              <p className="text-sm text-gray-600">Membantu masyarakat agar lebih melek teknologi pertanian.</p>
            </li>
          </ul>
        </div>

        {/* Tim Pengembang */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-emerald-50">
          <div className="mb-4 border-b border-gray-100 pb-2">
            <h3 className="text-gray-900 font-bold text-lg">Tim Pengembang</h3>
          </div>
          <p className="text-sm text-gray-500 mb-4">
            Dikembangkan dengan dedikasi oleh mahasiswa S1 Sistem Informasi, Fakultas Rekayasa Industri, <strong>Telkom University</strong>:
          </p>
          <div className="grid grid-cols-2 gap-2">
            {[
              "Arjuna Dwi Putra K.",
              "Bian Kamal Sutanto",
              "M. Azka Al Mulki S.",
              "Raihan Tri Darma",
              "Rangga Putra K.",
              "Rara Lianisyah",
              "Taufik Qurrohman",
              "Valerina Sherin S."
            ].map((name, i) => (
              <div key={i} className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <p className="text-xs text-gray-700 font-medium text-center">{name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Catatan Penting */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-3xl p-5 shadow-sm mt-2">
          <div>
            <h4 className="text-blue-900 font-bold mb-1">Catatan Penting</h4>
            <p className="text-xs text-blue-800 leading-relaxed">
              Aplikasi ini murni ditujukan sebagai alat bantu belajar dan panduan edukasi, bukan untuk sistem kontrol otomatis (*real-time monitoring*).
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
