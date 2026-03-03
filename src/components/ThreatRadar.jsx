import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts'

export default function ThreatRadar({ data = [] }) {
  if (!data.length) {
    return (
      <div className="flex h-[250px] items-center justify-center text-sm text-gray-600">
        No threat data available
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={250}>
      <RadarChart data={data} cx="50%" cy="50%" outerRadius="75%">
        <PolarGrid stroke="#1f2937" strokeDasharray="3 3" />
        <PolarAngleAxis
          dataKey="name"
          tick={{ fill: '#6b7280', fontSize: 10 }}
        />
        <PolarRadiusAxis
          tick={{ fill: '#374151', fontSize: 9 }}
          axisLine={false}
        />
        <Radar
          name="Vulnerabilities"
          dataKey="value"
          stroke="#ef4444"
          fill="#ef4444"
          fillOpacity={0.15}
          strokeWidth={2}
        />
        <Tooltip
          contentStyle={{
            background: '#111827',
            border: '1px solid #1f2937',
            borderRadius: '8px',
            fontSize: '12px',
          }}
          itemStyle={{ color: '#d1d5db' }}
        />
      </RadarChart>
    </ResponsiveContainer>
  )
}
