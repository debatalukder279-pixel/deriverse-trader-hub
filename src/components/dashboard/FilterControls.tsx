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
  orderType: string;
  customStartDate?: Date;
  customEndDate?: Date;
  onSymbolChange: (value: string) => void;
  onDateRangeChange: (value: string) => void;
  onTradeTypeChange: (value: string) => void;
  onOrderTypeChange: (value: string) => void;
  onCustomStartDateChange: (date: Date | undefined) => void;
  onCustomEndDateChange: (date: Date | undefined) => void;
  onApply: () => void;
  onReset: () => void;
}

export function FilterControls({
  symbol,
  dateRange,
  tradeType,
  orderType,
  customStartDate,
  customEndDate,
  onSymbolChange,
  onDateRangeChange,
  onTradeTypeChange,
  onOrderTypeChange,
  onCustomStartDateChange,
  onCustomEndDateChange,
  onApply,
  onReset,
}: FilterControlsProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 py-3">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Filter className="w-4 h-4" />
        <span className="text-sm font-medium">Filters</span>
      </div>

      {/* Symbol Selector */}
      <Select value={symbol} onValueChange={onSymbolChange}>
        <SelectTrigger className="w-[110px] h-9 rounded-xl bg-card border-border/50 text-sm">
          <SelectValue placeholder="Symbol" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">All Symbols</SelectItem>
          <SelectItem value="SOL">SOL</SelectItem>
          <SelectItem value="BTC">BTC</SelectItem>
          <SelectItem value="ETH">ETH</SelectItem>
          <SelectItem value="BONK">BONK</SelectItem>
        </SelectContent>
      </Select>

      {/* Date Range Selector */}
      <Select value={dateRange} onValueChange={onDateRangeChange}>
        <SelectTrigger className="w-[130px] h-9 rounded-xl bg-card border-border/50 text-sm">
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
                  "w-[120px] h-9 justify-start text-left font-normal rounded-xl bg-card border-border/50 text-sm",
                  !customStartDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-3.5 w-3.5" />
                {customStartDate ? format(customStartDate, "MMM d, yy") : "Start"}
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
          <span className="text-muted-foreground text-sm">to</span>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-[120px] h-9 justify-start text-left font-normal rounded-xl bg-card border-border/50 text-sm",
                  !customEndDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-3.5 w-3.5" />
                {customEndDate ? format(customEndDate, "MMM d, yy") : "End"}
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
        <SelectTrigger className="w-[110px] h-9 rounded-xl bg-card border-border/50 text-sm">
          <SelectValue placeholder="Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="All">All Types</SelectItem>
          <SelectItem value="Long">Long</SelectItem>
          <SelectItem value="Short">Short</SelectItem>
        </SelectContent>
      </Select>

      {/* Order Type Selector */}
      <Select value={orderType} onValueChange={onOrderTypeChange}>
        <SelectTrigger className="w-[110px] h-9 rounded-xl bg-card border-border/50 text-sm">
          <SelectValue placeholder="Order" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="All">All Orders</SelectItem>
          <SelectItem value="Market">Market</SelectItem>
          <SelectItem value="Limit">Limit</SelectItem>
          <SelectItem value="Stop">Stop</SelectItem>
        </SelectContent>
      </Select>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 ml-auto">
        <Button onClick={onApply} size="sm" className="h-9 px-5 rounded-xl bg-primary hover:bg-primary-hover text-primary-foreground font-medium">
          Apply
        </Button>
        <Button onClick={onReset} size="sm" variant="outline" className="h-9 px-4 rounded-xl border-border/50">
          <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
          Reset
        </Button>
      </div>
    </div>
  );
}
