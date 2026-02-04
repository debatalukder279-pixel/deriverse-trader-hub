import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface CumulativeFeesChartProps {
  data: Array<{
    date: string;
    fees: number;
    fullDate: Date;
  }>;
}

export function CumulativeFeesChart({ data }: CumulativeFeesChartProps) {
  return (
    <div className="dashboard-card">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-foreground">Cumulative Fees</h3>
        <p className="text-xs text-muted-foreground">Total fees over time</p>
      </div>
      <div className="h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="0" stroke="hsl(var(--border))" vertical={false} opacity={0.5} />
            <XAxis
              dataKey="date"
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
              formatter={(value: number) => [`$${value.toLocaleString()}`, 'Total Fees']}
            />
            <Line
              type="monotone"
              dataKey="fees"
              stroke="hsl(var(--destructive))"
              strokeWidth={1.5}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
