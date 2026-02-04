import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface DrawdownChartProps {
  data: Array<{
    date: string;
    drawdown: number;
  }>;
}

export function DrawdownChart({ data }: DrawdownChartProps) {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const value = payload[0].value;
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-elevated">
          <p className="text-sm text-muted-foreground mb-1">{label}</p>
          <p className="text-lg font-bold text-destructive">
            -{value.toFixed(2)}%
          </p>
        </div>
      );
    }
    return null;
  };

  const maxDrawdown = Math.max(...data.map(d => d.drawdown));

  return (
    <div className="chart-container">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Drawdown</h3>
          <p className="text-sm text-muted-foreground">Maximum: -{maxDrawdown.toFixed(2)}%</p>
        </div>
      </div>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              tickFormatter={(value) => `-${value}%`}
              dx={-10}
              reversed
            />
            <Tooltip content={<CustomTooltip />} />
            <defs>
              <linearGradient id="drawdownGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.4} />
                <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="drawdown"
              stroke="hsl(var(--destructive))"
              strokeWidth={2}
              fill="url(#drawdownGradient)"
              dot={false}
              activeDot={{ r: 5, fill: 'hsl(var(--destructive))', strokeWidth: 2, stroke: 'hsl(var(--card))' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
