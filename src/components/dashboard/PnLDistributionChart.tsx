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
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-foreground">P&L Distribution</h3>
        <p className="text-xs text-muted-foreground">Frequency of gains/losses</p>
      </div>
      <div className="h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="0" stroke="hsl(var(--border))" vertical={false} opacity={0.5} />
            <XAxis
              dataKey="range"
              fontSize={8}
              tickLine={false}
              axisLine={false}
              stroke="hsl(var(--muted-foreground))"
              angle={-45}
              textAnchor="end"
              height={50}
            />
            <YAxis
              fontSize={10}
              tickLine={false}
              axisLine={false}
              stroke="hsl(var(--muted-foreground))"
              width={30}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                borderColor: 'hsl(var(--border))',
                borderRadius: '10px',
                fontSize: '12px',
              }}
              formatter={(value: number) => [`${value} trades`, 'Count']}
            />
            <Bar dataKey="count" radius={[3, 3, 0, 0]}>
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
