import { ChevronUp, ChevronDown } from 'lucide-react';

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend: string;
  isUpward: boolean;
  colorClass?: string;
}

export default function DashboardCard({
  title,
  value,
  icon,
  trend,
  isUpward,
  colorClass = 'blue',
}: DashboardCardProps) {
  // Menentukan warna berdasarkan colorClass
  const getColorClasses = () => {
    const colors: Record<string, { bg: string; text: string; iconBg: string }> = {
      blue: { bg: 'bg-blue-50', text: 'text-blue-600', iconBg: 'bg-blue-100' },
      green: { bg: 'bg-green-50', text: 'text-green-600', iconBg: 'bg-green-100' },
      red: { bg: 'bg-red-50', text: 'text-red-600', iconBg: 'bg-red-100' },
      purple: { bg: 'bg-purple-50', text: 'text-purple-600', iconBg: 'bg-purple-100' },
      amber: { bg: 'bg-amber-50', text: 'text-amber-600', iconBg: 'bg-amber-100' },
      indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600', iconBg: 'bg-indigo-100' },
    };

    return colors[colorClass] || colors.blue;
  };

  const { bg, text, iconBg } = getColorClasses();

  return (
    <div
      className={`rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all hover:${bg} hover:shadow-md`}
    >
      <div className="flex items-center justify-between">
        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${iconBg}`}>
          {icon}
        </div>
        <div
          className={`flex items-center ${isUpward ? 'text-green-600' : 'text-red-600'} text-xs font-medium`}
        >
          {trend}
          {isUpward ? (
            <ChevronUp className="ml-0.5 h-3 w-3" />
          ) : (
            <ChevronDown className="ml-0.5 h-3 w-3" />
          )}
        </div>
      </div>
      <div className="mt-3">
        <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
        <p className="mt-1 text-sm text-gray-500">{title}</p>
      </div>
    </div>
  );
}
