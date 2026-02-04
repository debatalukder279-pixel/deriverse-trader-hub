import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { MoreHorizontal } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface HeatmapData {
  date: Date;
  pnl: number;
  trades: number;
}

interface PerformanceHeatmapProps {
  data: HeatmapData[];
}

export function PerformanceHeatmap({ data }: PerformanceHeatmapProps) {
  const { weeks, maxPnl, minPnl } = useMemo(() => {
    // Generate last 12 weeks of data
    const now = new Date();
    const startDate = new Date(now);
    startDate.setDate(startDate.getDate() - 84); // 12 weeks ago
    
    // Find the start of that week (Sunday)
    startDate.setDate(startDate.getDate() - startDate.getDay());
    
    const weeks: Array<Array<HeatmapData | null>> = [];
    let currentWeek: Array<HeatmapData | null> = [];
    
    let maxPnl = 0;
    let minPnl = 0;
    
    for (let i = 0; i < 84; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
      const dayData = data.find(d => 
        d.date.toDateString() === date.toDateString()
      );
      
      if (dayData) {
        maxPnl = Math.max(maxPnl, dayData.pnl);
        minPnl = Math.min(minPnl, dayData.pnl);
      }
      
      currentWeek.push(dayData || { date, pnl: 0, trades: 0 });
      
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    }
    
    if (currentWeek.length > 0) {
      weeks.push(currentWeek);
    }
    
    return { weeks, maxPnl, minPnl };
  }, [data]);

  const getColor = (pnl: number, trades: number) => {
    if (trades === 0) return 'bg-muted/50';
    
    if (pnl > 0) {
      const intensity = Math.min(pnl / (maxPnl || 1), 1);
      if (intensity > 0.7) return 'bg-success';
      if (intensity > 0.4) return 'bg-success/70';
      return 'bg-success/40';
    } else if (pnl < 0) {
      const intensity = Math.min(Math.abs(pnl) / (Math.abs(minPnl) || 1), 1);
      if (intensity > 0.7) return 'bg-destructive';
      if (intensity > 0.4) return 'bg-destructive/70';
      return 'bg-destructive/40';
    }
    return 'bg-muted';
  };

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // Get month labels for the weeks
  const monthLabels = useMemo(() => {
    const labels: Array<{ month: string; startWeek: number }> = [];
    let lastMonth = -1;
    
    weeks.forEach((week, weekIndex) => {
      const firstDay = week[0];
      if (firstDay && firstDay.date) {
        const month = firstDay.date.getMonth();
        if (month !== lastMonth) {
          labels.push({ month: months[month], startWeek: weekIndex });
          lastMonth = month;
        }
      }
    });
    
    return labels;
  }, [weeks]);

  const formatCurrency = (value: number) => {
    return value >= 0 ? `+$${value.toFixed(0)}` : `-$${Math.abs(value).toFixed(0)}`;
  };

  return (
    <div className="chart-container">
      <div className="section-header">
        <div>
          <h3 className="section-title">Performance Heatmap</h3>
          <p className="section-subtitle">Daily trading activity (12 weeks)</p>
        </div>
        <div className="menu-dots">
          <MoreHorizontal className="w-5 h-5" />
        </div>
      </div>
      
      <div className="mt-4">
        {/* Month labels */}
        <div className="flex ml-8 mb-2">
          {monthLabels.map((label, i) => (
            <div
              key={i}
              className="text-xs text-muted-foreground"
              style={{ 
                marginLeft: i === 0 ? 0 : `${(label.startWeek - (monthLabels[i - 1]?.startWeek || 0)) * 18 - 20}px`,
              }}
            >
              {label.month}
            </div>
          ))}
        </div>
        
        <div className="flex gap-1">
          {/* Day labels */}
          <div className="flex flex-col gap-1 pr-2">
            {days.map((day, i) => (
              <div key={day} className="h-[14px] text-[10px] text-muted-foreground leading-[14px]">
                {i % 2 === 1 ? day : ''}
              </div>
            ))}
          </div>
          
          {/* Heatmap grid */}
          <div className="flex gap-1">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-1">
                {week.map((day, dayIndex) => (
                  <Tooltip key={dayIndex}>
                    <TooltipTrigger asChild>
                      <div
                        className={cn(
                          "w-[14px] h-[14px] rounded-sm cursor-pointer transition-all hover:ring-2 hover:ring-primary/50",
                          day ? getColor(day.pnl, day.trades) : 'bg-muted/30'
                        )}
                      />
                    </TooltipTrigger>
                    <TooltipContent side="top" className="text-xs">
                      {day && (
                        <div>
                          <p className="font-medium">{day.date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</p>
                          <p className={cn(
                            "font-bold",
                            day.pnl > 0 ? 'text-success' : day.pnl < 0 ? 'text-destructive' : ''
                          )}>
                            {day.trades > 0 ? formatCurrency(day.pnl) : 'No trades'}
                          </p>
                          {day.trades > 0 && (
                            <p className="text-muted-foreground">{day.trades} trade{day.trades > 1 ? 's' : ''}</p>
                          )}
                        </div>
                      )}
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            ))}
          </div>
        </div>
        
        {/* Legend */}
        <div className="flex items-center justify-end gap-2 mt-4 text-xs text-muted-foreground">
          <span>Less</span>
          <div className="flex gap-1">
            <div className="w-3 h-3 rounded-sm bg-destructive" />
            <div className="w-3 h-3 rounded-sm bg-destructive/60" />
            <div className="w-3 h-3 rounded-sm bg-muted" />
            <div className="w-3 h-3 rounded-sm bg-success/60" />
            <div className="w-3 h-3 rounded-sm bg-success" />
          </div>
          <span>More</span>
        </div>
      </div>
    </div>
  );
}
