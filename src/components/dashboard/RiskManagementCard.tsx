import { RiskMetrics } from "@/types/trading";
import { cn } from "@/lib/utils";
import { TrendingDown, TrendingUp, Activity, Target, Award, AlertTriangle } from "lucide-react";

interface RiskManagementCardProps {
  metrics: RiskMetrics;
}

export function RiskManagementCard({ metrics }: RiskManagementCardProps) {
  return (
    <div className="dashboard-card">
      <div className="mb-5">
        <h3 className="text-base font-semibold text-foreground">Risk Management</h3>
        <p className="text-xs text-muted-foreground mt-0.5">Portfolio risk indicators</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Max Drawdown */}
        <div className="bg-background/60 rounded-xl p-3.5">
          <div className="flex items-center gap-1.5 text-muted-foreground mb-1.5">
            <TrendingDown className="w-3.5 h-3.5 text-destructive" />
            <span className="text-[10px] font-medium">Max Drawdown</span>
          </div>
          <p className="text-lg font-bold text-destructive tabular-nums">
            ${metrics.maxDrawdown.toLocaleString()}
          </p>
          <p className="text-[10px] text-muted-foreground mt-0.5">
            {metrics.maxDrawdownPercent.toFixed(1)}% peak decline
          </p>
        </div>

        {/* Sharpe Ratio */}
        <div className="bg-background/60 rounded-xl p-3.5">
          <div className="flex items-center gap-1.5 text-muted-foreground mb-1.5">
            <Activity className="w-3.5 h-3.5 text-primary" />
            <span className="text-[10px] font-medium">Sharpe Ratio</span>
          </div>
          <p className={cn(
            "text-lg font-bold tabular-nums",
            metrics.sharpeRatio >= 1 ? "text-success" : metrics.sharpeRatio >= 0 ? "text-warning" : "text-destructive"
          )}>
            {metrics.sharpeRatio.toFixed(2)}
          </p>
          <p className="text-[10px] text-muted-foreground mt-0.5">
            {metrics.sharpeRatio >= 2 ? "Excellent" : metrics.sharpeRatio >= 1 ? "Good" : metrics.sharpeRatio >= 0 ? "Average" : "Poor"}
          </p>
        </div>

        {/* Profit Factor */}
        <div className="bg-background/60 rounded-xl p-3.5">
          <div className="flex items-center gap-1.5 text-muted-foreground mb-1.5">
            <Target className="w-3.5 h-3.5 text-success" />
            <span className="text-[10px] font-medium">Profit Factor</span>
          </div>
          <p className={cn(
            "text-lg font-bold tabular-nums",
            metrics.profitFactor >= 1.5 ? "text-success" : metrics.profitFactor >= 1 ? "text-warning" : "text-destructive"
          )}>
            {metrics.profitFactor >= 999 ? "∞" : metrics.profitFactor.toFixed(2)}
          </p>
          <p className="text-[10px] text-muted-foreground mt-0.5">
            Gross profit / loss
          </p>
        </div>

        {/* Consecutive Wins */}
        <div className="bg-background/60 rounded-xl p-3.5">
          <div className="flex items-center gap-1.5 text-muted-foreground mb-1.5">
            <Award className="w-3.5 h-3.5 text-success" />
            <span className="text-[10px] font-medium">Max Win Streak</span>
          </div>
          <p className="text-lg font-bold text-success tabular-nums">
            {metrics.consecutiveWins}
          </p>
          <p className="text-[10px] text-muted-foreground mt-0.5">
            Consecutive wins
          </p>
        </div>

        {/* Consecutive Losses */}
        <div className="bg-background/60 rounded-xl p-3.5">
          <div className="flex items-center gap-1.5 text-muted-foreground mb-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-destructive" />
            <span className="text-[10px] font-medium">Max Loss Streak</span>
          </div>
          <p className="text-lg font-bold text-destructive tabular-nums">
            {metrics.consecutiveLosses}
          </p>
          <p className="text-[10px] text-muted-foreground mt-0.5">
            Consecutive losses
          </p>
        </div>

        {/* Current Streak */}
        <div className="bg-background/60 rounded-xl p-3.5">
          <div className="flex items-center gap-1.5 text-muted-foreground mb-1.5">
            <TrendingUp className={cn(
              "w-3.5 h-3.5",
              metrics.currentStreakType === 'win' ? "text-success" : 
              metrics.currentStreakType === 'loss' ? "text-destructive" : "text-muted-foreground"
            )} />
            <span className="text-[10px] font-medium">Current Streak</span>
          </div>
          <p className={cn(
            "text-lg font-bold tabular-nums",
            metrics.currentStreakType === 'win' ? "text-success" : 
            metrics.currentStreakType === 'loss' ? "text-destructive" : "text-muted-foreground"
          )}>
            {metrics.currentStreak}
          </p>
          <p className="text-[10px] text-muted-foreground mt-0.5">
            {metrics.currentStreakType === 'win' ? "Winning" : 
             metrics.currentStreakType === 'loss' ? "Losing" : "No streak"}
          </p>
        </div>
      </div>
    </div>
  );
}
