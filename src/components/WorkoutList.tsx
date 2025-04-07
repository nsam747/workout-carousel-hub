
import React from "react";
import { Workout, getWorkoutsByDate, getWorkoutsForYesterday, getWorkoutsForPastWeek } from "@/lib/mockData";
import WorkoutCard from "./WorkoutCard";
import { format, isSameDay, subDays } from "date-fns";
import { CalendarDays } from "lucide-react";

interface WorkoutListProps {
  selectedDate: Date;
}

const WorkoutList: React.FC<WorkoutListProps> = ({ selectedDate }) => {
  const workouts = getWorkoutsByDate(selectedDate);
  const formattedDate = format(selectedDate, "EEEE, MMMM d, yyyy");
  const isToday = isSameDay(selectedDate, new Date());
  
  // Get yesterday's workouts
  const yesterdayWorkouts = isToday ? getWorkoutsForYesterday() : [];
  
  // Get past week workouts (2-6 days ago)
  const pastWeekWorkouts = isToday ? getWorkoutsForPastWeek() : [];
  
  const today = new Date();
  const yesterday = subDays(today, 1);
  
  return (
    <div className="flex-1 overflow-hidden animate-fade-in">
      {/* Today or Selected date section */}
      <div className="mb-6">
        <div className="flex items-center mb-4">
          <CalendarDays className="h-5 w-5 mr-2 text-muted-foreground" />
          <h2 className="text-lg font-medium">
            {isToday ? "Today" : formattedDate}
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
                This looks like a rest day.
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* Yesterday section - only show on today's view */}
      {isToday && yesterdayWorkouts.length > 0 && (
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
      
      {/* Past Week section - only show on today's view */}
      {isToday && pastWeekWorkouts.length > 0 && (
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
