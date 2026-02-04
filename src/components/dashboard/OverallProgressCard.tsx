import { CircularProgress } from "./CircularProgress";

interface OverallProgressCardProps {
  winRate: number;
  profitFactor?: number;
  avgWin?: number;
  avgLoss?: number;
}

export function OverallProgressCard({
  winRate,
  profitFactor = 2.4,
  avgWin = 245,
  avgLoss = 98,
}: OverallProgressCardProps) {
  return (
    <div className="dashboard-card flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-foreground">Current Result</h3>
        <span className="text-xs text-muted-foreground">→</span>
      </div>
      
      <div className="flex-1 flex items-center justify-center py-4">
        <CircularProgress
          value={winRate}
          max={100}
          size={160}
          strokeWidth={12}
          label="Win Rate"
        />
      </div>

      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border/30">
        <div className="text-center">
          <p className="text-lg font-bold text-foreground tabular-nums">{profitFactor}x</p>
          <p className="text-xs text-muted-foreground">Profit Factor</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-success tabular-nums">${avgWin}</p>
          <p className="text-xs text-muted-foreground">Avg Win</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-destructive tabular-nums">${avgLoss}</p>
          <p className="text-xs text-muted-foreground">Avg Loss</p>
        </div>
      </div>
    </div>
  );
}
