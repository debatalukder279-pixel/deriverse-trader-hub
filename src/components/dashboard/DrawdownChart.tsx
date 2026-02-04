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
        <div className="bg-card border border-border rounded-lg p-2.5 shadow-lg">
          <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
          <p className="text-base font-bold text-destructive">
            -{value.toFixed(2)}%
          </p>
        </div>
      );
    }
    return null;
  };

  const maxDrawdown = Math.max(...data.map(d => d.drawdown));

  return (
    <div className="dashboard-card">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-foreground">Drawdown</h3>
        <p className="text-xs text-muted-foreground">Maximum: -{maxDrawdown.toFixed(2)}%</p>
      </div>
      <div className="h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 15, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="0" stroke="hsl(var(--border))" vertical={false} opacity={0.5} />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
              dy={8}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
              tickFormatter={(value) => `-${value}%`}
              width={40}
              reversed
            />
            <Tooltip content={<CustomTooltip />} />
            <defs>
              <linearGradient id="drawdownGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="drawdown"
              stroke="hsl(var(--destructive))"
              strokeWidth={1.5}
              fill="url(#drawdownGradient)"
              dot={false}
              activeDot={{ r: 4, fill: 'hsl(var(--destructive))', strokeWidth: 2, stroke: 'hsl(var(--card))' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
