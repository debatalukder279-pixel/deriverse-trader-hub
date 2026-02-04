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
    <div className="dashboard-card">
      <div className="flex flex-col items-center">
        <h3 className="text-base font-semibold text-foreground mb-6">Overall Progress</h3>
        
        <CircularProgress
          value={winRate}
          max={100}
          size={180}
          strokeWidth={14}
          label="Win Rate"
          sublabel="Performance"
        />

        <div className="grid grid-cols-3 gap-4 mt-8 w-full">
          <div className="text-center">
            <p className="text-lg font-bold text-foreground">{profitFactor}x</p>
            <p className="text-xs text-muted-foreground">Profit Factor</p>
          </div>
          <div className="text-center border-x border-border">
            <p className="text-lg font-bold text-success">${avgWin}</p>
            <p className="text-xs text-muted-foreground">Avg Win</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-destructive">${avgLoss}</p>
            <p className="text-xs text-muted-foreground">Avg Loss</p>
          </div>
        </div>
      </div>
    </div>
  );
}
