import { RiskMetrics } from "@/types/trading";
import { cn } from "@/lib/utils";
import { TrendingDown, TrendingUp, Activity, Target, Award, AlertTriangle } from "lucide-react";

interface RiskManagementCardProps {
  metrics: RiskMetrics;
}

export function RiskManagementCard({ metrics }: RiskManagementCardProps) {
  return (
    <div className="dashboard-card">
      <div className="section-header mb-6">
        <div>
          <h3 className="section-title">Risk Management</h3>
          <p className="section-subtitle">Portfolio risk indicators</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Max Drawdown */}
        <div className="bg-background/50 rounded-xl p-4 border border-border/30">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <TrendingDown className="w-4 h-4 text-destructive" />
            <span className="text-xs font-medium">Max Drawdown</span>
          </div>
          <p className="text-xl font-bold text-destructive tabular-nums">
            ${metrics.maxDrawdown.toLocaleString()}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {metrics.maxDrawdownPercent.toFixed(1)}% peak decline
          </p>
        </div>

        {/* Sharpe Ratio */}
        <div className="bg-background/50 rounded-xl p-4 border border-border/30">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Activity className="w-4 h-4 text-primary" />
            <span className="text-xs font-medium">Sharpe Ratio</span>
          </div>
          <p className={cn(
            "text-xl font-bold tabular-nums",
            metrics.sharpeRatio >= 1 ? "text-success" : metrics.sharpeRatio >= 0 ? "text-warning" : "text-destructive"
          )}>
            {metrics.sharpeRatio.toFixed(2)}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {metrics.sharpeRatio >= 2 ? "Excellent" : metrics.sharpeRatio >= 1 ? "Good" : metrics.sharpeRatio >= 0 ? "Average" : "Poor"}
          </p>
        </div>

        {/* Profit Factor */}
        <div className="bg-background/50 rounded-xl p-4 border border-border/30">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Target className="w-4 h-4 text-success" />
            <span className="text-xs font-medium">Profit Factor</span>
          </div>
          <p className={cn(
            "text-xl font-bold tabular-nums",
            metrics.profitFactor >= 1.5 ? "text-success" : metrics.profitFactor >= 1 ? "text-warning" : "text-destructive"
          )}>
            {metrics.profitFactor >= 999 ? "∞" : metrics.profitFactor.toFixed(2)}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Gross profit / loss
          </p>
        </div>

        {/* Consecutive Wins */}
        <div className="bg-background/50 rounded-xl p-4 border border-border/30">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Award className="w-4 h-4 text-success" />
            <span className="text-xs font-medium">Max Win Streak</span>
          </div>
          <p className="text-xl font-bold text-success tabular-nums">
            {metrics.consecutiveWins}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Consecutive wins
          </p>
        </div>

        {/* Consecutive Losses */}
        <div className="bg-background/50 rounded-xl p-4 border border-border/30">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <AlertTriangle className="w-4 h-4 text-destructive" />
            <span className="text-xs font-medium">Max Loss Streak</span>
          </div>
          <p className="text-xl font-bold text-destructive tabular-nums">
            {metrics.consecutiveLosses}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Consecutive losses
          </p>
        </div>

        {/* Current Streak */}
        <div className="bg-background/50 rounded-xl p-4 border border-border/30">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <TrendingUp className={cn(
              "w-4 h-4",
              metrics.currentStreakType === 'win' ? "text-success" : 
              metrics.currentStreakType === 'loss' ? "text-destructive" : "text-muted-foreground"
            )} />
            <span className="text-xs font-medium">Current Streak</span>
          </div>
          <p className={cn(
            "text-xl font-bold tabular-nums",
            metrics.currentStreakType === 'win' ? "text-success" : 
            metrics.currentStreakType === 'loss' ? "text-destructive" : "text-muted-foreground"
          )}>
            {metrics.currentStreak}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {metrics.currentStreakType === 'win' ? "Winning" : 
             metrics.currentStreakType === 'loss' ? "Losing" : "No streak"}
          </p>
        </div>
      </div>
    </div>
  );
}
