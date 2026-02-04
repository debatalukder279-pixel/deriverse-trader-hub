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
    <div className="metric-card animate-fade-in">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground mb-2">{title}</p>
          <p className="text-2xl font-bold text-foreground tabular-nums">
            {value}
          </p>
          {change && (
            <div className="flex items-center gap-1.5 mt-3">
              <span
                className={cn(
                  "change-indicator",
                  change.isPositive ? "change-indicator-up" : "change-indicator-down"
                )}
              >
                {change.isPositive ? (
                  <ArrowUp className="w-3 h-3" />
                ) : (
                  <ArrowDown className="w-3 h-3" />
                )}
                {change.isPositive ? '+' : ''}{change.value}%
              </span>
              <span className="text-xs text-muted-foreground">
                {change.label || 'Since last week'}
              </span>
            </div>
          )}
          {subtitle && (
            <p className="text-xs text-muted-foreground mt-2">{subtitle}</p>
          )}
        </div>
        <div className={cn("metric-icon-box", iconColorClass)}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}
