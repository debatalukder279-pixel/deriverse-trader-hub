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

interface PnLDistributionChartProps {
  data: Array<{
    range: string;
    count: number;
    isProfit: boolean;
  }>;
}

export function PnLDistributionChart({ data }: PnLDistributionChartProps) {
  return (
    <div className="dashboard-card">
      <div className="section-header mb-4">
        <div>
          <h3 className="section-title">P&L Distribution</h3>
          <p className="section-subtitle">Frequency of gains/losses</p>
        </div>
      </div>
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis
              dataKey="range"
              fontSize={9}
              tickLine={false}
              axisLine={false}
              stroke="hsl(var(--muted-foreground))"
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis
              fontSize={11}
              tickLine={false}
              axisLine={false}
              stroke="hsl(var(--muted-foreground))"
              label={{ value: 'Trades', angle: -90, position: 'insideLeft', fontSize: 11 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                borderColor: 'hsl(var(--border))',
                borderRadius: '12px',
              }}
              formatter={(value: number) => [`${value} trades`, 'Count']}
            />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.isProfit ? 'hsl(var(--success))' : 'hsl(var(--destructive))'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
