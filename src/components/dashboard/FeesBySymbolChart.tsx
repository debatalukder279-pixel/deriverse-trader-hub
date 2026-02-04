import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface FeesBySymbolChartProps {
  data: Array<{
    symbol: string;
    fees: number;
  }>;
}

const COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-5))',
  'hsl(var(--chart-6))',
  'hsl(var(--chart-2))',
];

export function FeesBySymbolChart({ data }: FeesBySymbolChartProps) {
  const totalFees = data.reduce((sum, d) => sum + d.fees, 0);

  return (
    <div className="dashboard-card">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-foreground">Fees by Symbol</h3>
        <p className="text-xs text-muted-foreground">Total: ${totalFees.toLocaleString()}</p>
      </div>
      <div className="h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="45%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={2}
              dataKey="fees"
              nameKey="symbol"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                borderColor: 'hsl(var(--border))',
                borderRadius: '10px',
                fontSize: '12px',
              }}
              formatter={(value: number, name: string) => [
                `$${value.toLocaleString()}`,
                name
              ]}
            />
            <Legend
              verticalAlign="bottom"
              height={28}
              iconSize={8}
              formatter={(value: string, entry: any) => (
                <span style={{ color: 'hsl(var(--foreground))', fontSize: '10px' }}>
                  {value} ({((entry.payload.fees / totalFees) * 100).toFixed(1)}%)
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
