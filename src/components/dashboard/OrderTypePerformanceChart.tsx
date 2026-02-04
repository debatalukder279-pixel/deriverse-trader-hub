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
      <div className="section-header mb-4">
        <div>
          <h3 className="section-title">Performance by Order Type</h3>
          <p className="section-subtitle">Market vs Limit vs Stop</p>
        </div>
      </div>
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis
              dataKey="orderType"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              stroke="hsl(var(--muted-foreground))"
            />
            <YAxis
              fontSize={11}
              tickLine={false}
              axisLine={false}
              stroke="hsl(var(--muted-foreground))"
              tickFormatter={(value) => `$${value >= 1000 ? `${(value/1000).toFixed(0)}k` : value}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                borderColor: 'hsl(var(--border))',
                borderRadius: '12px',
              }}
              formatter={(value: number, name: string, props: any) => [
                `$${value.toLocaleString()}`,
                `P&L (${props.payload.trades} trades, ${props.payload.winRate}% WR)`
              ]}
            />
            <Bar dataKey="pnl" radius={[4, 4, 0, 0]}>
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
