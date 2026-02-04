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
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-muted-foreground truncate">{title}</p>
          <p className="text-xl font-bold text-foreground tracking-tight tabular-nums mt-1">
            {value}
          </p>
          {change && (
            <div className="flex items-center gap-1 mt-1.5">
              <span
                className={cn(
                  "inline-flex items-center gap-0.5 text-[10px] font-medium",
                  change.isPositive ? "text-success" : "text-destructive"
                )}
              >
                {change.isPositive ? (
                  <ArrowUp className="w-2.5 h-2.5" />
                ) : (
                  <ArrowDown className="w-2.5 h-2.5" />
                )}
                {Math.abs(change.value).toFixed(2)}%
              </span>
              <span className="text-[10px] text-muted-foreground/60 truncate">
                {change.label || 'vs last week'}
              </span>
            </div>
          )}
        </div>
        <div className={cn("metric-icon-box flex-shrink-0", iconColorClass)}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
}
