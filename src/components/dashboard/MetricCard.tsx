import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    isPositive: boolean;
  };
  icon: LucideIcon;
  variant?: 'profit' | 'loss' | 'neutral';
  subtitle?: string;
  progress?: number;
}

export function MetricCard({
  title,
  value,
  change,
  icon: Icon,
  variant = 'neutral',
  subtitle,
  progress,
}: MetricCardProps) {
  return (
    <div
      className={cn(
        "metric-card",
        variant === 'profit' && "metric-card-profit",
        variant === 'loss' && "metric-card-loss",
        variant === 'neutral' && "metric-card-neutral"
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
          <p
            className={cn(
              "text-2xl font-bold tabular-nums",
              variant === 'profit' && "text-success",
              variant === 'loss' && "text-destructive",
              variant === 'neutral' && "text-foreground"
            )}
          >
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
          )}
          {change && (
            <div className="flex items-center gap-1 mt-2">
              <span
                className={cn(
                  "text-xs font-medium px-1.5 py-0.5 rounded",
                  change.isPositive
                    ? "bg-success/10 text-success"
                    : "bg-destructive/10 text-destructive"
                )}
              >
                {change.isPositive ? '+' : ''}{change.value}%
              </span>
              <span className="text-xs text-muted-foreground">vs last month</span>
            </div>
          )}
          {progress !== undefined && (
            <div className="mt-3">
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-500",
                    variant === 'profit' && "bg-success",
                    variant === 'loss' && "bg-destructive",
                    variant === 'neutral' && "bg-primary"
                  )}
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>
            </div>
          )}
        </div>
        <div
          className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0",
            variant === 'profit' && "bg-success/10",
            variant === 'loss' && "bg-destructive/10",
            variant === 'neutral' && "bg-primary/10"
          )}
        >
          <Icon
            className={cn(
              "w-6 h-6",
              variant === 'profit' && "text-success",
              variant === 'loss' && "text-destructive",
              variant === 'neutral' && "text-primary"
            )}
          />
        </div>
      </div>
    </div>
  );
}
