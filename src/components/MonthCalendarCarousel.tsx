
import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format, addMonths, subMonths, isSameDay } from "date-fns";
import { cn } from "@/lib/utils";
import { getWorkoutsByDate, getAllWorkouts, getCategoryInfo, Workout } from "@/lib/mockData";

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

  // Custom day content render function
  const renderDayContent = (day: Date) => {
    const dateKey = day.toDateString();
    const workouts = workoutsByDate[dateKey] || [];
    
    if (workouts.length === 0) return null;

    const indicatorsToShow = workouts.slice(0, 3);
    const remainingCount = workouts.length - 3;

    return (
      <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center pb-1">
        <div className="flex gap-0.5 mb-0.5">
          {indicatorsToShow.map((workout, index) => {
            const categoryInfo = getCategoryInfo(workout.category);
            return (
              <div
                key={index}
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: categoryInfo.color }}
              />
            );
          })}
        </div>
        {remainingCount > 0 && (
          <span className="text-[10px] leading-none text-muted-foreground">
            +{remainingCount}
          </span>
        )}
      </div>
    );
  };
  
  return (
    <div className="relative bg-white/80 backdrop-blur-md border border-border rounded-xl p-2 mb-6 animate-fade-in">
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
      
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={(date) => date && onDateSelect(date)}
        month={currentMonth}
        onMonthChange={setCurrentMonth}
        components={{
          DayContent: ({ date }) => (
            <div className="relative w-full h-full flex items-center justify-center">
              {format(date, 'd')}
              {renderDayContent(date)}
            </div>
          )
        }}
        className={cn("p-0 border-none")}
        classNames={{
          day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
          day_today: "bg-accent text-accent-foreground",
          day: cn(
            "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-muted relative",
          ),
          caption: "hidden", // Hide the default caption since we have our own header
        }}
      />
    </div>
  );
};

export default MonthCalendarCarousel;

