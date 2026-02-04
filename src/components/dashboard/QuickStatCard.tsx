import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuickStatCardProps {
  icon: LucideIcon;
  value: string;
  label: string;
  variant?: "default" | "success" | "warning" | "destructive";
}

export function QuickStatCard({ icon: Icon, value, label, variant = "default" }: QuickStatCardProps) {
  const iconBgClass = {
    default: "bg-muted",
    success: "bg-success/10",
    warning: "bg-warning/10",
    destructive: "bg-destructive/10",
  }[variant];

  const iconColorClass = {
    default: "text-muted-foreground",
    success: "text-success",
    warning: "text-warning",
    destructive: "text-destructive",
  }[variant];

  return (
    <div className="dashboard-card flex flex-col items-center text-center p-5">
      <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-3", iconBgClass)}>
        <Icon className={cn("w-5 h-5", iconColorClass)} />
      </div>
      <p className="text-xl font-bold text-foreground tabular-nums">{value}</p>
      <p className="text-xs text-muted-foreground mt-1">{label}</p>
    </div>
  );
}
