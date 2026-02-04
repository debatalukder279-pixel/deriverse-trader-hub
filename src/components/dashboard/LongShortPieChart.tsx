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
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Trade Statistics</h3>
          <p className="text-xs text-muted-foreground">Win/Loss distribution</p>
        </div>
        <button className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>
      
      <div className="flex flex-col items-center">
        {/* Donut Chart */}
        <div className="relative w-36 h-36">
          <span className="absolute -top-1 left-3 text-[10px] text-muted-foreground">
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
            <span className="text-[10px] text-muted-foreground">Trades</span>
          </div>
          
          <span className="absolute -bottom-1 right-3 text-[10px] text-muted-foreground">
            {lossesPercent}%
          </span>
        </div>

        {/* Stats Row */}
        <div className="flex items-center justify-center gap-6 mt-4 w-full">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS.wins }} />
            <span className="text-[10px] text-muted-foreground">Wins</span>
            <span className="text-xs font-bold text-foreground ml-0.5">{wins}</span>
          </div>
          
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS.losses }} />
            <span className="text-[10px] text-muted-foreground">Losses</span>
            <span className="text-xs font-bold text-foreground ml-0.5">{losses}</span>
          </div>
          
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS.breakeven }} />
            <span className="text-[10px] text-muted-foreground">Even</span>
            <span className="text-xs font-bold text-foreground ml-0.5">{breakeven}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
