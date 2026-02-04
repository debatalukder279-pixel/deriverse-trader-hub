import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface FeeCompositionChartProps {
  data: Array<{
    symbol: string;
    makerFees: number;
    takerFees: number;
    withdrawalFees: number;
    totalFees: number;
  }>;
}

export function FeeCompositionChart({ data }: FeeCompositionChartProps) {
  const totalFees = data.reduce((sum, d) => sum + d.totalFees, 0);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const item = data.find(d => d.symbol === label);
      return (
        <div className="bg-card border border-border rounded-xl p-3 shadow-lg text-xs">
          <p className="font-semibold text-foreground mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-1.5">
                <div 
                  className="w-2 h-2 rounded-sm" 
                  style={{ backgroundColor: entry.color }} 
                />
                <span className="text-muted-foreground">{entry.name}</span>
              </div>
              <span className="font-medium text-foreground">${entry.value.toLocaleString()}</span>
            </div>
          ))}
          <div className="border-t border-border mt-2 pt-2 flex justify-between">
            <span className="text-muted-foreground">Total</span>
            <span className="font-semibold text-foreground">${item?.totalFees.toLocaleString()}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="dashboard-card">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-foreground">Fee Breakdown by Type</h3>
        <p className="text-xs text-muted-foreground">Total: ${totalFees.toLocaleString()}</p>
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
              tickFormatter={(value) => `$${value >= 1000 ? `${(value/1000).toFixed(0)}k` : value}`}
              width={40}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="bottom"
              height={28}
              iconSize={8}
              iconType="square"
              formatter={(value: string) => (
                <span style={{ color: 'hsl(var(--muted-foreground))', fontSize: '10px' }}>
                  {value}
                </span>
              )}
            />
            <Bar 
              dataKey="makerFees" 
              name="Maker" 
              stackId="fees" 
              fill="hsl(var(--chart-1))" 
              radius={[0, 0, 0, 0]}
            />
            <Bar 
              dataKey="takerFees" 
              name="Taker" 
              stackId="fees" 
              fill="hsl(var(--chart-5))" 
              radius={[0, 0, 0, 0]}
            />
            <Bar 
              dataKey="withdrawalFees" 
              name="Withdrawal" 
              stackId="fees" 
              fill="hsl(var(--chart-6))" 
              radius={[3, 3, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
