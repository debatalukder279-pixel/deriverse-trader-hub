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
    <div className="dashboard-card flex flex-col">
      <h3 className="text-sm font-medium text-muted-foreground mb-6">Overall Progress</h3>
      
      <div className="flex-1 flex items-center justify-center">
        <CircularProgress
          value={winRate}
          max={100}
          size={160}
          strokeWidth={12}
          label="Win Rate"
        />
      </div>

      <div className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t border-border/50">
        <div className="text-center">
          <p className="text-lg font-semibold text-foreground">{profitFactor}x</p>
          <p className="text-xs text-muted-foreground">Profit Factor</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-semibold text-success">${avgWin}</p>
          <p className="text-xs text-muted-foreground">Avg Win</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-semibold text-destructive">${avgLoss}</p>
          <p className="text-xs text-muted-foreground">Avg Loss</p>
        </div>
      </div>
    </div>
  );
}
