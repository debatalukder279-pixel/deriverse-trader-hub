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
      
      <div className="flex items-center gap-8">
        {/* Donut Chart */}
        <div className="relative w-36 h-36 flex-shrink-0">
          <span className="absolute -top-2 left-2 text-xs text-muted-foreground">
            {winsPercent}%
          </span>
          
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={42}
                outerRadius={58}
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
            <span className="text-xl font-bold text-foreground">{total}</span>
            <span className="text-xs text-muted-foreground">Trades</span>
          </div>
          
          <span className="absolute -bottom-2 right-2 text-xs text-muted-foreground">
            {lossesPercent}%
          </span>
        </div>

        {/* Stats */}
        <div className="flex-1 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS.wins }} />
              <span className="text-sm text-muted-foreground leading-tight">
                Total<br />Wins
              </span>
            </div>
            <span className="text-lg font-bold text-foreground">{wins}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS.losses }} />
              <span className="text-sm text-muted-foreground leading-tight">
                Total<br />Losses
              </span>
            </div>
            <span className="text-lg font-bold text-foreground">{losses}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS.breakeven }} />
              <span className="text-sm text-muted-foreground leading-tight">
                Break<br />Even
              </span>
            </div>
            <span className="text-lg font-bold text-foreground">{breakeven}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
