import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Filter, RotateCcw } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface FilterControlsProps {
  symbol: string;
  dateRange: string;
  tradeType: string;
  customStartDate?: Date;
  customEndDate?: Date;
  onSymbolChange: (value: string) => void;
  onDateRangeChange: (value: string) => void;
  onTradeTypeChange: (value: string) => void;
  onCustomStartDateChange: (date: Date | undefined) => void;
  onCustomEndDateChange: (date: Date | undefined) => void;
  onApply: () => void;
  onReset: () => void;
}

export function FilterControls({
  symbol,
  dateRange,
  tradeType,
  customStartDate,
  customEndDate,
  onSymbolChange,
  onDateRangeChange,
  onTradeTypeChange,
  onCustomStartDateChange,
  onCustomEndDateChange,
  onApply,
  onReset,
}: FilterControlsProps) {
  return (
    <div className="filter-section">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Filter className="w-4 h-4" />
        <span className="text-sm font-medium">Filters</span>
      </div>

      <div className="flex flex-wrap items-center gap-3 flex-1">
        {/* Symbol Selector */}
        <Select value={symbol} onValueChange={onSymbolChange}>
          <SelectTrigger className="w-[120px] bg-background">
            <SelectValue placeholder="Symbol" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Symbols</SelectItem>
            <SelectItem value="SOL">SOL</SelectItem>
            <SelectItem value="BTC">BTC</SelectItem>
            <SelectItem value="ETH">ETH</SelectItem>
          </SelectContent>
        </Select>

        {/* Date Range Selector */}
        <Select value={dateRange} onValueChange={onDateRangeChange}>
          <SelectTrigger className="w-[140px] bg-background">
            <SelectValue placeholder="Date Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
            <SelectItem value="custom">Custom Range</SelectItem>
          </SelectContent>
        </Select>

        {/* Custom Date Pickers */}
        {dateRange === "custom" && (
          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-[130px] justify-start text-left font-normal bg-background",
                    !customStartDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {customStartDate ? format(customStartDate, "MMM d, yyyy") : "Start"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={customStartDate}
                  onSelect={onCustomStartDateChange}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <span className="text-muted-foreground">to</span>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-[130px] justify-start text-left font-normal bg-background",
                    !customEndDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {customEndDate ? format(customEndDate, "MMM d, yyyy") : "End"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={customEndDate}
                  onSelect={onCustomEndDateChange}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        )}

        {/* Trade Type Selector */}
        <Select value={tradeType} onValueChange={onTradeTypeChange}>
          <SelectTrigger className="w-[120px] bg-background">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Types</SelectItem>
            <SelectItem value="Long">Long</SelectItem>
            <SelectItem value="Short">Short</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        <Button onClick={onApply} className="btn-filter">
          Apply
        </Button>
        <Button onClick={onReset} variant="outline" className="btn-filter-outline">
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset
        </Button>
      </div>
    </div>
  );
}
