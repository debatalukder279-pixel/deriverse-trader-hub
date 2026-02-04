import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { MoreHorizontal } from "lucide-react";

interface LongShortPieChartProps {
  data: Array<{
    name: string;
    value: number;
    fill: string;
  }>;
}

export function LongShortPieChart({ data }: LongShortPieChartProps) {
  const total = data.reduce((sum, entry) => sum + entry.value, 0);
  
  const COLORS = ['hsl(var(--chart-2))', 'hsl(var(--primary))', 'hsl(var(--muted))'];

  // Extended data for visual appeal
  const chartData = [
    { name: 'Long', value: data.find(d => d.name === 'Long')?.value || 0, color: COLORS[0] },
    { name: 'Short', value: data.find(d => d.name === 'Short')?.value || 0, color: COLORS[1] },
  ];

  const stats = [
    { label: 'Total Wins', value: chartData[0].value, color: COLORS[0] },
    { label: 'Total Losses', value: chartData[1].value, color: COLORS[1] },
    { label: 'Break Even', value: Math.floor(total * 0.15), color: COLORS[2] },
  ];

  return (
    <div className="chart-container">
      <div className="section-header">
        <div>
          <h3 className="section-title">Trade Statistics</h3>
          <p className="section-subtitle">Win/Loss distribution</p>
        </div>
        <div className="menu-dots">
          <MoreHorizontal className="w-5 h-5" />
        </div>
      </div>
      
      <div className="flex items-center gap-8">
        {/* Donut Chart */}
        <div className="relative w-44 h-44 flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={72}
                paddingAngle={3}
                dataKey="value"
                stroke="none"
                startAngle={90}
                endAngle={-270}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          {/* Center Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-foreground">{total}</span>
            <span className="text-xs text-muted-foreground">Trades</span>
          </div>
          {/* Percentage Labels */}
          <div className="absolute top-2 left-0 text-xs font-medium text-muted-foreground">
            {((chartData[0].value / total) * 100).toFixed(0)}%
          </div>
          <div className="absolute bottom-4 right-0 text-xs font-medium text-muted-foreground">
            {((chartData[1].value / total) * 100).toFixed(0)}%
          </div>
        </div>

        {/* Legend */}
        <div className="flex-1 space-y-4">
          {stats.map((stat, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: stat.color }}
                />
                <span className="text-sm text-muted-foreground">{stat.label}</span>
              </div>
              <span className="text-lg font-bold text-foreground">{stat.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
