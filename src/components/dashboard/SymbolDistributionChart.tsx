import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { MoreHorizontal } from "lucide-react";

interface SymbolDistributionChartProps {
  data: Array<{
    symbol: string;
    trades: number;
    pnl: number;
    winRate: number;
  }>;
}

const COLORS = {
  SOL: 'hsl(var(--chart-2))',
  BTC: 'hsl(var(--chart-5))',
  ETH: 'hsl(var(--chart-1))',
};

export function SymbolDistributionChart({ data }: SymbolDistributionChartProps) {
  const total = data.reduce((sum, d) => sum + d.trades, 0);

  const chartData = data.map(d => ({
    ...d,
    color: COLORS[d.symbol as keyof typeof COLORS] || 'hsl(var(--muted))',
    percentage: ((d.trades / total) * 100).toFixed(1),
  }));

  return (
    <div className="chart-container">
      <div className="section-header">
        <div>
          <h3 className="section-title">Symbol Distribution</h3>
          <p className="section-subtitle">Trading volume by asset</p>
        </div>
        <div className="menu-dots">
          <MoreHorizontal className="w-5 h-5" />
        </div>
      </div>

      <div className="flex items-center gap-6 mt-2">
        {/* Donut Chart */}
        <div className="relative w-36 h-36 flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={42}
                outerRadius={58}
                paddingAngle={4}
                dataKey="trades"
                stroke="none"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-bold text-foreground">{total}</span>
            <span className="text-[10px] text-muted-foreground">Total</span>
          </div>
        </div>

        {/* Stats List */}
        <div className="flex-1 space-y-3">
          {chartData.map((item) => (
            <div key={item.symbol} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm font-medium text-foreground">{item.symbol}</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className="text-sm font-semibold text-foreground">{item.trades}</span>
                  <span className="text-xs text-muted-foreground ml-1">({item.percentage}%)</span>
                </div>
                <div className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  item.pnl >= 0 ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'
                }`}>
                  {item.pnl >= 0 ? '+' : ''}{item.winRate.toFixed(0)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
