
import React from "react";
import { Workout, getWorkoutsByDate, getWorkoutsForYesterday, getWorkoutsForPastWeek, getAllWorkouts } from "@/lib/mockData";
import WorkoutCard from "./WorkoutCard";
import { format, isSameDay, subDays, isWithinInterval, parseISO } from "date-fns";
import { CalendarDays } from "lucide-react";
import { DateRange } from "./MonthCalendarCarousel";

interface WorkoutListProps {
  selectedDate: Date;
  dateRange?: DateRange;
}

const WorkoutList: React.FC<WorkoutListProps> = ({ selectedDate, dateRange }) => {
  // If we have a complete date range, filter workouts accordingly
  const getWorkoutsInDateRange = () => {
    if (dateRange && dateRange.to) {
      // Get all workouts and filter them
      const allWorkouts = getAllWorkouts();
      return allWorkouts.filter(workout => {
        const workoutDate = new Date(workout.date);
        return isWithinInterval(workoutDate, { 
          start: dateRange.from, 
          end: dateRange.to 
        });
      });
    }
    return [];
  };

  const workouts = dateRange && dateRange.to 
    ? getWorkoutsInDateRange()
    : getWorkoutsByDate(selectedDate);
    
  const formattedDate = format(selectedDate, "EEEE, MMMM d, yyyy");
  const isToday = isSameDay(selectedDate, new Date());
  
  // Get yesterday's workouts - only show if not in date range mode
  const yesterdayWorkouts = isToday && !dateRange ? getWorkoutsForYesterday() : [];
  
  // Get past week workouts - only show if not in date range mode
  const pastWeekWorkouts = isToday && !dateRange ? getWorkoutsForPastWeek() : [];
  
  const today = new Date();
  const yesterday = subDays(today, 1);

  // Format the date range for display
  const getDateRangeDisplay = () => {
    if (!dateRange || !dateRange.to) return null;
    
    const fromFormatted = format(dateRange.from, "MMM d, yyyy");
    const toFormatted = format(dateRange.to, "MMM d, yyyy");
    return `${fromFormatted} to ${toFormatted}`;
  };
  
  return (
    <div className="flex-1 overflow-hidden animate-fade-in">
      {/* Today or Selected date section */}
      <div className="mb-6">
        <div className="flex items-center mb-4">
          <CalendarDays className="h-5 w-5 mr-2 text-muted-foreground" />
          <h2 className="text-lg font-medium">
            {dateRange && dateRange.to ? (
              `Date Range: ${getDateRangeDisplay()}`
            ) : (
              isToday ? "Today" : formattedDate
            )}
          </h2>
        </div>

        <div>
          {workouts.length > 0 ? (
            workouts.map((workout) => (
              <WorkoutCard key={workout.id} workout={workout} />
            ))
          ) : (
            <div className="p-8 text-center rounded-xl bg-secondary/50 border border-border animate-fade-in">
              <h3 className="font-medium text-muted-foreground">No workouts scheduled</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {dateRange && dateRange.to ? 
                  "No workouts found in the selected date range." : 
                  "This looks like a rest day."
                }
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* Yesterday section - only show on today's view and not in date range mode */}
      {isToday && !dateRange && yesterdayWorkouts.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <CalendarDays className="h-5 w-5 mr-2 text-muted-foreground" />
            <h2 className="text-lg font-medium">Yesterday</h2>
          </div>
          
          <div>
            {yesterdayWorkouts.map((workout) => (
              <WorkoutCard key={workout.id} workout={workout} />
            ))}
          </div>
        </div>
      )}
      
      {/* Past Week section - only show on today's view and not in date range mode */}
      {isToday && !dateRange && pastWeekWorkouts.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <CalendarDays className="h-5 w-5 mr-2 text-muted-foreground" />
            <h2 className="text-lg font-medium">Past Week</h2>
          </div>
          
          <div>
            {pastWeekWorkouts.map((workout) => (
              <WorkoutCard key={workout.id} workout={workout} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkoutList;
