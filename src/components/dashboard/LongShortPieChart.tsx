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
  
  const COLORS = {
    wins: 'hsl(174 45% 40%)',
    losses: 'hsl(174 25% 65%)',
    breakeven: 'hsl(210 15% 80%)'
  };

  const wins = data.find(d => d.name === 'Long')?.value || Math.floor(total * 0.5);
  const losses = data.find(d => d.name === 'Short')?.value || Math.floor(total * 0.5);
  const breakeven = Math.floor(total * 0.14);

  const chartData = [
    { name: 'Wins', value: wins, color: COLORS.wins },
    { name: 'Losses', value: losses, color: COLORS.losses },
  ];

  const winsPercent = Math.round((wins / (wins + losses)) * 100);
  const lossesPercent = 100 - winsPercent;

  return (
    <div className="dashboard-card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-base font-semibold text-foreground">Trade Statistics</h3>
          <p className="text-sm text-muted-foreground">Win/Loss distribution</p>
        </div>
        <button className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>
      
      <div className="flex flex-col items-center">
        {/* Donut Chart */}
        <div className="relative w-40 h-40">
          <span className="absolute -top-1 left-4 text-xs text-muted-foreground">
            {winsPercent}%
          </span>
          
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={48}
                outerRadius={65}
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
          
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-foreground">{total}</span>
            <span className="text-xs text-muted-foreground">Trades</span>
          </div>
          
          <span className="absolute -bottom-1 right-4 text-xs text-muted-foreground">
            {lossesPercent}%
          </span>
        </div>

        {/* Stats Row */}
        <div className="flex items-center justify-center gap-8 mt-6 w-full">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS.wins }} />
            <span className="text-xs text-muted-foreground">Wins</span>
            <span className="text-sm font-bold text-foreground ml-1">{wins}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS.losses }} />
            <span className="text-xs text-muted-foreground">Losses</span>
            <span className="text-sm font-bold text-foreground ml-1">{losses}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS.breakeven }} />
            <span className="text-xs text-muted-foreground">Even</span>
            <span className="text-sm font-bold text-foreground ml-1">{breakeven}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
