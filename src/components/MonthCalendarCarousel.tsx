
import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format, addMonths, subMonths, isBefore, isAfter } from "date-fns";
import { cn } from "@/lib/utils";

interface MonthCalendarCarouselProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  selectedDateRange?: DateRange;
  onDateRangeSelect?: (range: DateRange) => void;
}

export type DateRange = {
  from: Date;
  to?: Date;
};

const MonthCalendarCarousel: React.FC<MonthCalendarCarouselProps> = ({ 
  selectedDate, 
  onDateSelect,
  selectedDateRange,
  onDateRangeSelect
}) => {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  
  const handlePreviousMonth = () => {
    setCurrentMonth(prev => subMonths(prev, 1));
  };
  
  const handleNextMonth = () => {
    setCurrentMonth(prev => addMonths(prev, 1));
  };

  const handleSelect = (date: Date | undefined) => {
    if (!date) return;
    
    if (onDateRangeSelect) {
      // If we're in range selection mode
      if (!selectedDateRange || selectedDateRange.to) {
        // Start a new range
        onDateRangeSelect({ from: date });
      } else {
        // Complete the range
        const from = selectedDateRange.from;
        
        // Ensure the range is always from earlier date to later date
        if (isBefore(date, from)) {
          onDateRangeSelect({ from: date, to: from });
        } else {
          onDateRangeSelect({ from, to: date });
        }
      }
    } else {
      // Single date selection
      onDateSelect(date);
    }
  };
  
  return (
    <div className="relative bg-white/80 backdrop-blur-md border border-border rounded-xl p-2 mb-6 animate-fade-in flex justify-center">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-between mb-2 px-4 pt-2">
          <h3 className="font-medium">{format(currentMonth, 'MMMM yyyy')}</h3>
          <div className="flex gap-1">
            <button
              onClick={handlePreviousMonth}
              className="p-1 rounded-full bg-white/90 border border-border shadow-sm hover:bg-white transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={handleNextMonth}
              className="p-1 rounded-full bg-white/90 border border-border shadow-sm hover:bg-white transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        {onDateRangeSelect ? (
          // Range selection mode
          <Calendar
            mode="range"
            selected={selectedDateRange}
            onSelect={(value) => {
              if (value) onDateRangeSelect(value as DateRange);
            }}
            month={currentMonth}
            onMonthChange={setCurrentMonth}
            className={cn("p-0 border-none")}
            classNames={{
              day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
              day_today: "bg-accent text-accent-foreground",
              caption: "hidden", // Hide the default caption since we have our own header
            }}
            numberOfMonths={1}
          />
        ) : (
          // Single date selection mode
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(value) => {
              if (value) onDateSelect(value);
            }}
            month={currentMonth}
            onMonthChange={setCurrentMonth}
            className={cn("p-0 border-none")}
            classNames={{
              day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
              day_today: "bg-accent text-accent-foreground",
              caption: "hidden", // Hide the default caption since we have our own header
            }}
            numberOfMonths={1}
          />
        )}
      </div>
    </div>
  );
};

export default MonthCalendarCarousel;
