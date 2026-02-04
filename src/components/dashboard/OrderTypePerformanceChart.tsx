import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface OrderTypePerformanceChartProps {
  data: Array<{
    orderType: string;
    trades: number;
    pnl: number;
    avgPnl: number;
    winRate: number;
  }>;
}

export function OrderTypePerformanceChart({ data }: OrderTypePerformanceChartProps) {
  return (
    <div className="dashboard-card">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-foreground">Performance by Order Type</h3>
        <p className="text-xs text-muted-foreground">Market vs Limit vs Stop</p>
      </div>
      <div className="h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="0" stroke="hsl(var(--border))" vertical={false} opacity={0.5} />
            <XAxis
              dataKey="orderType"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              stroke="hsl(var(--muted-foreground))"
            />
            <YAxis
              fontSize={10}
              tickLine={false}
              axisLine={false}
              stroke="hsl(var(--muted-foreground))"
              tickFormatter={(value) => `$${value >= 1000 ? `${(value/1000).toFixed(0)}k` : value}`}
              width={40}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                borderColor: 'hsl(var(--border))',
                borderRadius: '10px',
                fontSize: '12px',
              }}
              formatter={(value: number, name: string, props: any) => [
                `$${value.toLocaleString()}`,
                `P&L (${props.payload.trades} trades, ${props.payload.winRate}% WR)`
              ]}
            />
            <Bar dataKey="pnl" radius={[3, 3, 0, 0]}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.pnl >= 0 ? 'hsl(var(--success))' : 'hsl(var(--destructive))'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
