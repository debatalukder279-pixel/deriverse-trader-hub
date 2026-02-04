import { cn } from "@/lib/utils";
import { LucideIcon, ArrowUp, ArrowDown } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    isPositive: boolean;
    label?: string;
  };
  icon: LucideIcon;
  iconColor?: 'blue' | 'green' | 'purple' | 'orange' | 'red';
  subtitle?: string;
}

export function MetricCard({
  title,
  value,
  change,
  icon: Icon,
  iconColor = 'blue',
  subtitle,
}: MetricCardProps) {
  const iconColorClass = {
    blue: 'metric-icon-box-blue',
    green: 'metric-icon-box-green',
    purple: 'metric-icon-box-purple',
    orange: 'metric-icon-box-orange',
    red: 'metric-icon-box-red',
  }[iconColor];

  return (
    <div className="metric-card">
      <div className="flex items-start justify-between">
        <div className="flex-1 space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-semibold text-foreground tracking-tight tabular-nums">
            {value}
          </p>
          {change && (
            <div className="flex items-center gap-1.5 pt-2">
              <span
                className={cn(
                  "inline-flex items-center gap-0.5 text-xs font-medium",
                  change.isPositive ? "text-success" : "text-destructive"
                )}
              >
                {change.isPositive ? (
                  <ArrowUp className="w-3 h-3" />
                ) : (
                  <ArrowDown className="w-3 h-3" />
                )}
                {Math.abs(change.value)}%
              </span>
              <span className="text-xs text-muted-foreground/70">
                {change.label || 'vs last week'}
              </span>
            </div>
          )}
        </div>
        <div className={cn("metric-icon-box", iconColorClass)}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}
