import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format, addMonths, subMonths, isSameDay } from "date-fns";
import { cn } from "@/lib/utils";
import { getWorkoutsByDate, getAllWorkouts, getCategoryInfo, Workout } from "@/lib/mockData";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";

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

  const renderWorkoutTooltip = (workouts: Workout[]) => {
    return (
      <div className="space-y-1.5 max-w-[200px]">
        <p className="font-medium text-xs pb-1 border-b">
          {workouts.length} workout{workouts.length !== 1 ? 's' : ''}
        </p>
        <div className="space-y-2 max-h-[150px] overflow-y-auto pr-1">
          {workouts.map((workout, i) => {
            const categoryInfo = getCategoryInfo(workout.category);
            return (
              <div key={i} className="flex items-center gap-2">
                <div 
                  className="w-2 h-2 rounded-full shrink-0" 
                  style={{ backgroundColor: categoryInfo.color }} 
                />
                <span className="text-xs truncate">{workout.title}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderDayContent = (day: Date) => {
    const dateKey = day.toDateString();
    const workouts = workoutsByDate[dateKey] || [];
    const isSelected = isSameDay(day, selectedDate);
    
    if (workouts.length === 0) return null;

    const indicatorsToShow = workouts.slice(0, 3);
    const remainingCount = workouts.length - 3;

    const dayContent = (
      <div className="absolute bottom-1 left-0 right-0 flex flex-col items-center">
        <div className="flex gap-0.5 mb-0.5">
          {indicatorsToShow.map((workout, index) => {
            const categoryInfo = getCategoryInfo(workout.category);
            return (
              <div
                key={index}
                className="h-1 w-1 rounded-full shadow-sm"
                style={{ backgroundColor: categoryInfo.color }}
              />
            );
          })}
        </div>
        {remainingCount > 0 && (
          <span className={cn(
            "text-[8px] leading-none font-medium",
            isSelected ? "text-primary-foreground" : "text-muted-foreground"
          )}>
            +{remainingCount}
          </span>
        )}
      </div>
    );

    if (workouts.length > 0) {
      return (
        <TooltipProvider>
          <Tooltip delayDuration={200}>
            <TooltipTrigger asChild>
              <div className="w-full h-full">
                {dayContent}
              </div>
            </TooltipTrigger>
            <TooltipContent 
              side="bottom" 
              className="bg-popover/95 backdrop-blur-sm border shadow-md"
              align="center"
            >
              {renderWorkoutTooltip(workouts)}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    return dayContent;
  };
  
  return (
    <div className="relative bg-white/80 backdrop-blur-md border border-border rounded-xl p-4 mb-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6 px-2">
        <h3 className="font-semibold text-lg">{format(currentMonth, 'MMMM yyyy')}</h3>
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
            <div className="relative w-full h-full flex items-center justify-center pt-1">
              <span className="relative z-10">{format(date, 'd')}</span>
              {renderDayContent(date)}
            </div>
          )
        }}
        className={cn("p-0 border-none")}
        classNames={{
          day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground rounded-lg",
          day_today: "bg-accent text-accent-foreground rounded-lg font-semibold",
          day: cn(
            "h-10 w-10 p-0 font-normal aria-selected:opacity-100 hover:bg-muted relative rounded-lg transition-colors",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          ),
          cell: cn(
            "p-0 relative [&:has([aria-selected])]:bg-accent/5 first:[&:has([aria-selected])]:rounded-l-lg last:[&:has([aria-selected])]:rounded-r-lg",
            "[&:has([aria-selected].day-outside)]:bg-accent/5 [&:has([aria-selected])]:bg-accent"
          ),
          head_cell: "text-muted-foreground font-medium text-xs tracking-wider p-1",
          day_outside: "text-muted-foreground/50 opacity-50",
          table: "w-full border-collapse",
          caption: "hidden",
        }}
      />
    </div>
  );
};

export default MonthCalendarCarousel;
