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
      <h3 className="text-sm font-medium text-muted-foreground mb-4">Overall Progress</h3>
      
      <div className="flex-1 flex items-center justify-center">
        <CircularProgress
          value={winRate}
          max={100}
          size={140}
          strokeWidth={10}
          label="Win Rate"
        />
      </div>

      <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-border/40">
        <div className="text-center">
          <p className="text-base font-semibold text-foreground tabular-nums">{profitFactor}x</p>
          <p className="text-[10px] text-muted-foreground">Profit Factor</p>
        </div>
        <div className="text-center">
          <p className="text-base font-semibold text-success tabular-nums">${avgWin}</p>
          <p className="text-[10px] text-muted-foreground">Avg Win</p>
        </div>
        <div className="text-center">
          <p className="text-base font-semibold text-destructive tabular-nums">${avgLoss}</p>
          <p className="text-[10px] text-muted-foreground">Avg Loss</p>
        </div>
      </div>
    </div>
  );
}
