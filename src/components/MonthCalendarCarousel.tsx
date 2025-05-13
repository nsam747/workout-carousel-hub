import React, { useState, useContext } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format, addMonths, subMonths } from "date-fns";
import { cn } from "@/lib/utils";
import { getWorkoutsByDate, getAllWorkouts, getCategoryInfo, Workout } from "@/lib/mockData";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useIsMobile } from "@/hooks/use-mobile";

interface MonthCalendarCarouselProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

const MonthCalendarCarousel: React.FC<MonthCalendarCarouselProps> = ({ 
  selectedDate, 
  onDateSelect 
}) => {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const isMobile = useIsMobile();
  
  const handlePreviousMonth = () => {
    setCurrentMonth(prev => subMonths(prev, 1));
  };
  
  const handleNextMonth = () => {
    setCurrentMonth(prev => addMonths(prev, 1));
  };


  // Get all workouts and organize them by date
  const allWorkouts = getAllWorkouts();
  const workoutsByDate = allWorkouts.reduce((acc, workout) => {
    // Convert string date to Date object before calling toDateString
    const workoutDate = new Date(workout.date);
    const dateKey = workoutDate.toDateString();
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(workout);
    return acc;
  }, {} as Record<string, Workout[]>);

  // Function to get unique categories from workouts
  const getUniqueCategories = (workouts: Workout[]): string[] => {
    // Get unique categories
    const uniqueCategories = Array.from(new Set(workouts.map(w => w.category)));
    return uniqueCategories;
  };

  const renderDayContent = (day: Date) => {
    const dateKey = day.toDateString();
    const workouts = workoutsByDate[dateKey] || [];
    
    if (workouts.length === 0) return null;

    // Get all unique categories for this day
    const uniqueCategories = getUniqueCategories(workouts);
    
    // If we have 3 or fewer workouts, show one dot per workout (up to 3)
    // If we have more than 3 workouts, prioritize showing different categories
    const categoriesToShow: string[] = [];
    
    if (uniqueCategories.length <= 3) {
      // If we have 3 or fewer unique categories, show them all
      categoriesToShow.push(...uniqueCategories);
    } else {
      // If we have more than 3 unique categories, show only the first 3
      categoriesToShow.push(...uniqueCategories.slice(0, 3));
    }

    // If we don't have 3 categories yet, add more workouts based on chronological order
    if (categoriesToShow.length < 3 && workouts.length > categoriesToShow.length) {
      // Sort workouts by date
      const sortedWorkouts = [...workouts].sort((a, b) => 
        new Date(a.date).getTime() - new Date(b.date).getTime()
      );
      
      // Add categories from workouts that aren't already included
      for (const workout of sortedWorkouts) {
        if (!categoriesToShow.includes(workout.category) && categoriesToShow.length < 3) {
          categoriesToShow.push(workout.category);
        }
        if (categoriesToShow.length >= 3) break;
      }
    }

    return (
      <TooltipProvider>
        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>
            <div className="absolute bottom-2 left-0 right-0 flex justify-center">
              <div className="flex gap-1">
                {categoriesToShow.map((category, index) => {
                  const categoryInfo = getCategoryInfo(category);
                  return (
                    <div
                      key={index}
                      className="h-1.5 w-1.5 rounded-full shadow-sm"
                      style={{ backgroundColor: categoryInfo.color }}
                    />
                  );
                })}
              </div>
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom" align="center" className="text-xs p-2">
            <p className="font-medium">{workouts.length} workout{workouts.length !== 1 ? 's' : ''}</p>
            <ul className="mt-1 space-y-1">
              {workouts.slice(0, 3).map((workout, i) => (
                <li key={i} className="text-xs text-muted-foreground">
                  {workout.title}
                </li>
              ))}
              {workouts.length > 3 && <li className="text-xs text-muted-foreground">+{workouts.length - 3} more</li>}
            </ul>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };
  
  return (
    <div className="flex flex-col items-center bg-white/80 backdrop-blur-md border border-border rounded-xl p-4 mb-6 animate-fade-in">
      <div className="flex items-center justify-between w-full mb-4 px-2">
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
        onSelect={onDateSelect}
        month={currentMonth}
        onMonthChange={setCurrentMonth}
        components={{
          DayContent: ({ date }) => (
            <div className="relative w-full h-full flex items-center justify-center">
              <div className="absolute top-1 left-1/2 transform -translate-x-1/2 -translate-y-1/2 min-h-[16px]">
                {format(date, 'd')}
              </div>
              {renderDayContent(date)}
            </div>
          )
        }}
        className={cn("p-0 border-none w-full", isMobile ? "max-w-[300px]" : "max-w-[380px]")}
        classNames={{
          day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground rounded-xl",
          day_today: "bg-accent text-accent-foreground rounded-xl font-semibold",
          day: cn(
            isMobile ? "h-10 w-10" : "h-12 w-12", 
            "p-0 font-normal aria-selected:opacity-100 hover:bg-muted relative rounded-xl transition-colors",
            "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          ),
          cell: "p-0 relative focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent/5 first:[&:has([aria-selected])]:rounded-l-xl last:[&:has([aria-selected])]:rounded-r-xl",
          head_cell: "text-muted-foreground font-medium text-xs tracking-wider",
          table: "w-full border-collapse space-y-1",
          caption: "hidden",
          nav: "hidden",
          row: "flex justify-center",
        }}
      />
    </div>
  );
};

export default MonthCalendarCarousel;
