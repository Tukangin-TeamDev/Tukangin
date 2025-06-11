'use client';

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface PieChartProps {
  data: {
    labels: string[];
    datasets: {
      data: number[];
      backgroundColor: string[];
      borderColor: string;
      borderWidth: number;
    }[];
  };
  height?: number;
}

export default function PieChartComponent({ data, height = 300 }: PieChartProps) {
  // Ubah format data untuk Recharts
  const chartData = data.labels.map((label, index) => ({
    name: label,
    value: data.datasets[0].data[index],
  }));

  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          innerRadius={30}
          paddingAngle={2}
          dataKey="value"
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
        >
          {chartData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={
                data.datasets[0].backgroundColor[index % data.datasets[0].backgroundColor.length]
              }
              stroke={data.datasets[0].borderColor}
              strokeWidth={data.datasets[0].borderWidth}
            />
          ))}
        </Pie>
        <Tooltip
          formatter={value => [`${value} pesanan`, 'Jumlah']}
          labelStyle={{ color: '#111827', fontWeight: 500 }}
        />
        <Legend
          layout="vertical"
          verticalAlign="middle"
          align="right"
          wrapperStyle={{ fontSize: '12px' }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
