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
  
  // Teal color scheme matching the reference
  const COLORS = {
    wins: 'hsl(174 50% 35%)',     // Teal for wins
    losses: 'hsl(174 30% 55%)',   // Lighter teal for losses
    breakeven: 'hsl(210 15% 85%)' // Gray for break even
  };

  const wins = data.find(d => d.name === 'Long')?.value || Math.floor(total * 0.5);
  const losses = data.find(d => d.name === 'Short')?.value || Math.floor(total * 0.5);
  const breakeven = Math.floor(total * 0.14);

  const chartData = [
    { name: 'Wins', value: wins, color: COLORS.wins },
    { name: 'Losses', value: losses, color: COLORS.losses },
  ];

  const stats = [
    { label: 'Total', sublabel: 'Wins', value: wins, color: COLORS.wins },
    { label: 'Total', sublabel: 'Losses', value: losses, color: COLORS.losses },
    { label: 'Break', sublabel: 'Even', value: breakeven, color: COLORS.breakeven },
  ];

  const winsPercent = ((wins / (wins + losses)) * 100).toFixed(0);
  const lossesPercent = ((losses / (wins + losses)) * 100).toFixed(0);

  return (
    <div className="dashboard-card">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold text-foreground">Trade Statistics</h3>
          <p className="text-sm text-muted-foreground">Win/Loss distribution</p>
        </div>
        <button className="menu-dots">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>
      
      <div className="flex items-center gap-6">
        {/* Donut Chart */}
        <div className="relative w-40 h-40 flex-shrink-0">
          {/* Percentage labels */}
          <span className="absolute -top-1 left-4 text-xs font-medium text-muted-foreground">
            {winsPercent}%
          </span>
          
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={48}
                outerRadius={64}
                paddingAngle={2}
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
          
          <span className="absolute -bottom-1 right-2 text-xs font-medium text-muted-foreground">
            {lossesPercent}%
          </span>
        </div>

        {/* Stats Legend */}
        <div className="flex-1 space-y-3">
          {stats.map((stat, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: stat.color }}
                />
                <div className="text-sm text-muted-foreground leading-tight">
                  <span>{stat.label}</span>
                  <br />
                  <span>{stat.sublabel}</span>
                </div>
              </div>
              <span className="text-lg font-bold text-foreground tabular-nums">{stat.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
