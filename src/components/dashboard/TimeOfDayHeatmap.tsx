import { useMemo } from "react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface HourDayData {
  hour: number;
  day: number;
  pnl: number;
  trades: number;
}

interface TimeOfDayHeatmapProps {
  data: HourDayData[];
}

export function TimeOfDayHeatmap({ data }: TimeOfDayHeatmapProps) {
  const { matrix, maxPnl, minPnl } = useMemo(() => {
    // Create 7x24 matrix (days x hours)
    const matrix: (HourDayData | null)[][] = Array(7).fill(null).map(() => Array(24).fill(null));
    let maxPnl = 0;
    let minPnl = 0;

    data.forEach(item => {
      matrix[item.day][item.hour] = item;
      if (item.trades > 0) {
        maxPnl = Math.max(maxPnl, item.pnl);
        minPnl = Math.min(minPnl, item.pnl);
      }
    });

    return { matrix, maxPnl, minPnl };
  }, [data]);

  const getColor = (pnl: number, trades: number) => {
    if (trades === 0) return 'bg-muted/30';
    
    if (pnl > 0) {
      const intensity = Math.min(pnl / (maxPnl || 1), 1);
      if (intensity > 0.7) return 'bg-success';
      if (intensity > 0.4) return 'bg-success/70';
      if (intensity > 0.15) return 'bg-success/50';
      return 'bg-success/30';
    } else if (pnl < 0) {
      const intensity = Math.min(Math.abs(pnl) / (Math.abs(minPnl) || 1), 1);
      if (intensity > 0.7) return 'bg-destructive';
      if (intensity > 0.4) return 'bg-destructive/70';
      if (intensity > 0.15) return 'bg-destructive/50';
      return 'bg-destructive/30';
    }
    return 'bg-muted/50';
  };

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const formatCurrency = (value: number) => {
    return value >= 0 ? `+$${value.toFixed(0)}` : `-$${Math.abs(value).toFixed(0)}`;
  };

  return (
    <div className="dashboard-card">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-foreground">Profitability by Hour of Day</h3>
        <p className="text-xs text-muted-foreground">Performance heatmap across time</p>
      </div>

      <div className="overflow-x-auto">
        {/* Hour labels */}
        <div className="flex ml-10 mb-1">
          {hours.filter((_, i) => i % 3 === 0).map(hour => (
            <div
              key={hour}
              className="text-[9px] text-muted-foreground w-[36px] text-center"
            >
              {hour.toString().padStart(2, '0')}
            </div>
          ))}
        </div>

        {/* Heatmap grid */}
        <div className="flex flex-col gap-0.5">
          {days.map((day, dayIndex) => (
            <div key={day} className="flex items-center gap-0.5">
              <div className="w-9 text-[10px] text-muted-foreground text-right pr-1.5">
                {day}
              </div>
              <div className="flex gap-0.5">
                {hours.map(hour => {
                  const cell = matrix[dayIndex]?.[hour];
                  return (
                    <Tooltip key={hour}>
                      <TooltipTrigger asChild>
                        <div
                          className={cn(
                            "w-[11px] h-[14px] rounded-sm cursor-pointer transition-all hover:ring-1 hover:ring-primary/50",
                            cell ? getColor(cell.pnl, cell.trades) : 'bg-muted/30'
                          )}
                        />
                      </TooltipTrigger>
                      <TooltipContent side="top" className="text-xs">
                        <div>
                          <p className="font-medium">{day} {hour.toString().padStart(2, '0')}:00</p>
                          {cell && cell.trades > 0 ? (
                            <>
                              <p className={cn(
                                "font-bold",
                                cell.pnl > 0 ? 'text-success' : cell.pnl < 0 ? 'text-destructive' : ''
                              )}>
                                {formatCurrency(cell.pnl)}
                              </p>
                              <p className="text-muted-foreground">{cell.trades} trade{cell.trades > 1 ? 's' : ''}</p>
                            </>
                          ) : (
                            <p className="text-muted-foreground">No trades</p>
                          )}
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-end gap-1.5 mt-3 text-[10px] text-muted-foreground">
          <span>Loss</span>
          <div className="flex gap-0.5">
            <div className="w-2.5 h-2.5 rounded-sm bg-destructive" />
            <div className="w-2.5 h-2.5 rounded-sm bg-destructive/50" />
            <div className="w-2.5 h-2.5 rounded-sm bg-muted/50" />
            <div className="w-2.5 h-2.5 rounded-sm bg-success/50" />
            <div className="w-2.5 h-2.5 rounded-sm bg-success" />
          </div>
          <span>Profit</span>
        </div>
      </div>
    </div>
  );
}
