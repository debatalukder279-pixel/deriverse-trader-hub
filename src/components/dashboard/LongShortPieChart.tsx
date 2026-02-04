import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface LongShortPieChartProps {
  data: Array<{
    name: string;
    value: number;
    fill: string;
  }>;
}

export function LongShortPieChart({ data }: LongShortPieChartProps) {
  const total = data.reduce((sum, entry) => sum + entry.value, 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const entry = payload[0].payload;
      const percentage = ((entry.value / total) * 100).toFixed(1);
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-elevated">
          <p className="text-sm font-medium text-foreground">{entry.name}</p>
          <p className="text-lg font-bold" style={{ color: entry.fill }}>
            {entry.value} trades ({percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  const renderCustomLegend = (props: any) => {
    const { payload } = props;
    return (
      <div className="flex justify-center gap-6 mt-4">
        {payload.map((entry: any, index: number) => {
          const dataEntry = data.find(d => d.name === entry.value);
          const percentage = dataEntry ? ((dataEntry.value / total) * 100).toFixed(1) : 0;
          return (
            <div key={`legend-${index}`} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-sm text-muted-foreground">
                {entry.value}
              </span>
              <span className="text-sm font-semibold text-foreground">
                {percentage}%
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="chart-container">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Long vs Short</h3>
          <p className="text-sm text-muted-foreground">Trade direction ratio</p>
        </div>
      </div>
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="45%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={4}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend content={renderCustomLegend} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="text-center -mt-2">
        <p className="text-3xl font-bold text-foreground">{total}</p>
        <p className="text-sm text-muted-foreground">Total Trades</p>
      </div>
    </div>
  );
}
