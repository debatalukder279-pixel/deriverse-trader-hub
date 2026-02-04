import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface WinRateBySymbolChartProps {
  data: Array<{
    symbol: string;
    winRate: number;
    trades: number;
  }>;
}

export function WinRateBySymbolChart({ data }: WinRateBySymbolChartProps) {
  const symbolColors: Record<string, string> = {
    SOL: 'hsl(var(--chart-1))',
    BTC: 'hsl(var(--chart-5))',
    ETH: 'hsl(var(--chart-6))',
    BONK: 'hsl(var(--chart-2))',
  };

  return (
    <div className="dashboard-card">
      <div className="section-header mb-4">
        <div>
          <h3 className="section-title">Win Rate by Symbol</h3>
          <p className="section-subtitle">Performance comparison</p>
        </div>
      </div>
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis
              dataKey="symbol"
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
              tickFormatter={(value) => `${value}%`}
              domain={[0, 100]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                borderColor: 'hsl(var(--border))',
                borderRadius: '12px',
              }}
              formatter={(value: number, name: string, props: any) => [
                `${value.toFixed(1)}%`,
                `Win Rate (${props.payload.trades} trades)`
              ]}
            />
            <Bar 
              dataKey="winRate" 
              radius={[4, 4, 0, 0]}
              fill="hsl(var(--primary))"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
