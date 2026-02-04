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
  return (
    <div className="dashboard-card">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-foreground">Win Rate by Symbol</h3>
        <p className="text-xs text-muted-foreground">Performance comparison</p>
      </div>
      <div className="h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="0" stroke="hsl(var(--border))" vertical={false} opacity={0.5} />
            <XAxis
              dataKey="symbol"
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
              tickFormatter={(value) => `${value}%`}
              domain={[0, 100]}
              width={35}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                borderColor: 'hsl(var(--border))',
                borderRadius: '10px',
                fontSize: '12px',
              }}
              formatter={(value: number, name: string, props: any) => [
                `${value.toFixed(1)}%`,
                `Win Rate (${props.payload.trades} trades)`
              ]}
            />
            <Bar 
              dataKey="winRate" 
              radius={[3, 3, 0, 0]}
              fill="hsl(var(--primary))"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
