import { Droplets, Thermometer, Wind, Waves, AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react';

type SensorStatus = 'safe' | 'warning' | 'danger';

interface SensorData {
  name: string;
  value: string;
  unit: string;
  status: SensorStatus;
  action: string;
  icon: typeof Droplets;
  range: string;
}

const sensorData: SensorData[] = [
  {
    name: 'pH Air',
    value: '5.5',
    unit: '',
    status: 'danger',
    action: 'Tambahkan penstabil pH dan cek air setelah hujan',
    icon: Droplets,
    range: 'Ideal: 6.5-7.5'
  },
  {
    name: 'Suhu Air',
    value: '28',
    unit: '°C',
    status: 'safe',
    action: 'Suhu normal, pertahankan kondisi',
    icon: Thermometer,
    range: 'Ideal: 25-30°C'
  },
  {
    name: 'Kelembaban',
    value: '75',
    unit: '%',
    status: 'warning',
    action: 'Perhatikan sirkulasi udara di area tanaman',
    icon: Wind,
    range: 'Ideal: 60-70%'
  },
  {
    name: 'Ketinggian Air',
    value: '85',
    unit: '%',
    status: 'safe',
    action: 'Level air baik, tidak perlu tindakan',
    icon: Waves,
    range: 'Ideal: 80-90%'
  }
];

const statusConfig = {
  safe: {
    bg: 'bg-emerald-50 border-emerald-300',
    icon: CheckCircle,
    iconColor: 'text-emerald-600',
    badge: 'bg-emerald-100 text-emerald-800',
    text: 'Aman'
  },
  warning: {
    bg: 'bg-amber-50 border-amber-300',
    icon: AlertCircle,
    iconColor: 'text-amber-600',
    badge: 'bg-amber-100 text-amber-800',
    text: 'Waspada'
  },
  danger: {
    bg: 'bg-red-50 border-red-300',
    icon: AlertTriangle,
    iconColor: 'text-red-600',
    badge: 'bg-red-100 text-red-800',
    text: 'Bahaya'
  }
};

export function SensorDashboard() {
  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="mb-2 text-emerald-900">Dashboard Sensor</h1>
          <p className="text-gray-600">Monitoring kondisi sistem akuaponik Anda</p>
          <div className="mt-4 inline-flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600">Terakhir diperbarui: 2 menit yang lalu</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {sensorData.map((sensor, index) => {
            const SensorIcon = sensor.icon;
            const config = statusConfig[sensor.status];
            const StatusIcon = config.icon;

            return (
              <div
                key={index}
                className={`${config.bg} border-2 rounded-xl p-6 shadow-md`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`bg-white rounded-lg p-3 ${config.iconColor}`}>
                      <SensorIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-gray-900">{sensor.name}</h3>
                      <p className="text-xs text-gray-600">{sensor.range}</p>
                    </div>
                  </div>
                  <span className={`${config.badge} px-3 py-1 rounded-full text-xs flex items-center gap-1`}>
                    <StatusIcon className="w-3 h-3" />
                    {config.text}
                  </span>
                </div>

                <div className="mb-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl text-gray-900">{sensor.value}</span>
                    <span className="text-lg text-gray-600">{sensor.unit}</span>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm text-gray-700">
                    <strong className="text-gray-900">Tindakan:</strong> {sensor.action}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Status Legend */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="mb-4 text-emerald-900">Panduan Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-emerald-100 rounded-lg p-2">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-gray-900">Aman</p>
                <p className="text-xs text-gray-600">Kondisi optimal</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-amber-100 rounded-lg p-2">
                <AlertCircle className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-gray-900">Waspada</p>
                <p className="text-xs text-gray-600">Perlu perhatian</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-red-100 rounded-lg p-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-900">Bahaya</p>
                <p className="text-xs text-gray-600">Butuh tindakan segera</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Tips */}
        <div className="mt-6 bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <div className="bg-blue-500 rounded-lg p-2 flex-shrink-0">
              <AlertCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-blue-900 mb-2">Tips Cepat</h3>
              <ul className="space-y-1 text-sm text-blue-800">
                <li>• Cek sensor setiap pagi dan sore hari</li>
                <li>• pH sering turun setelah hujan - selalu periksa</li>
                <li>• Catat perubahan nilai sensor di buku harian</li>
                <li>• Hubungi tim support jika ada nilai yang tidak normal</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
