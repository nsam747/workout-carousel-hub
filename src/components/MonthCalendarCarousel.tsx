
import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format, addMonths, subMonths, isSameDay } from "date-fns";
import { cn } from "@/lib/utils";
import { getWorkoutsByDate, getAllWorkouts, getCategoryInfo, Workout } from "@/lib/mockData";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface MonthCalendarCarouselProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

const MonthCalendarCarousel: React.FC<MonthCalendarCarouselProps> = ({ 
  selectedDate, 
  onDateSelect 
}) => {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  
  const handlePreviousMonth = () => {
    setCurrentMonth(prev => subMonths(prev, 1));
  };
  
  const handleNextMonth = () => {
    setCurrentMonth(prev => addMonths(prev, 1));
  };

  // Get all workouts and organize them by date
  const allWorkouts = getAllWorkouts();
  const workoutsByDate = allWorkouts.reduce((acc, workout) => {
    const dateKey = workout.date.toDateString();
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(workout);
    return acc;
  }, {} as Record<string, Workout[]>);

  const renderDayContent = (day: Date) => {
    const dateKey = day.toDateString();
    const workouts = workoutsByDate[dateKey] || [];
    
    if (workouts.length === 0) return null;

    const indicatorsToShow = workouts.slice(0, 3);
    const remainingCount = workouts.length - 3;

    // Render tooltips for day with workouts
    return (
      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="w-full flex flex-col items-center absolute bottom-0 left-0 right-0 pb-1">
              <div className="flex gap-1 mb-0.5">
                {indicatorsToShow.map((workout, index) => {
                  const categoryInfo = getCategoryInfo(workout.category);
                  return (
                    <div
                      key={index}
                      className="h-1.5 w-1.5 rounded-full shadow-sm"
                      style={{ backgroundColor: categoryInfo.color }}
                    />
                  );
                })}
              </div>
              {remainingCount > 0 && (
                <span className="text-[9px] leading-none text-muted-foreground font-medium">
                  +{remainingCount}
                </span>
              )}
            </div>
          </TooltipTrigger>
          <TooltipContent className="p-2 max-w-[200px]">
            <div className="text-xs font-medium mb-1">
              {format(day, 'MMMM d, yyyy')}
            </div>
            <div className="space-y-1">
              {workouts.map((workout, idx) => {
                const categoryInfo = getCategoryInfo(workout.category);
                return (
                  <div key={idx} className="flex items-center gap-1.5">
                    <div 
                      className="h-2 w-2 rounded-full" 
                      style={{ backgroundColor: categoryInfo.color }}
                    />
                    <span className="text-xs truncate">{workout.title}</span>
                  </div>
                );
              })}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };
  
  return (
    <div className="relative bg-white/80 backdrop-blur-md border border-border rounded-xl p-4 mb-6 animate-fade-in">
      <div className="flex items-center justify-between mb-4 px-2">
        <h3 className="font-semibold">{format(currentMonth, 'MMMM yyyy')}</h3>
        <div className="flex gap-2">
          <button
            onClick={handlePreviousMonth}
            className="p-2 rounded-lg bg-white/90 border border-border shadow-sm hover:bg-accent transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={handleNextMonth}
            className="p-2 rounded-lg bg-white/90 border border-border shadow-sm hover:bg-accent transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={(date) => date && onDateSelect(date)}
        month={currentMonth}
        onMonthChange={setCurrentMonth}
        components={{
          DayContent: ({ date }) => (
            <div className="relative w-full h-full flex flex-col items-center">
              {/* Fixed height container for date number to prevent overlap */}
              <div className="h-7 flex items-center justify-center pt-1.5">
                <span className="text-sm">{format(date, 'd')}</span>
              </div>
              {renderDayContent(date)}
            </div>
          )
        }}
        className={cn("p-0 border-none")}
        classNames={{
          day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground rounded-xl",
          day_today: "bg-accent text-accent-foreground rounded-xl font-semibold",
          day: cn(
            "h-14 w-12 p-0 font-normal aria-selected:opacity-100 hover:bg-muted relative rounded-xl transition-colors",
            "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          ),
          cell: "p-0 relative focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent/5 first:[&:has([aria-selected])]:rounded-l-xl last:[&:has([aria-selected])]:rounded-r-xl",
          head_cell: "text-muted-foreground font-medium text-xs tracking-wider",
          table: "w-full border-collapse space-y-2",
          caption: "hidden",
        }}
      />
    </div>
  );
};

export default MonthCalendarCarousel;
