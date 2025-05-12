
import React, { useState, useEffect } from "react";
import { Workout, getWorkoutsByDate, getWorkoutsForYesterday, getWorkoutsForPastWeek } from "@/lib/mockData";
import WorkoutCard from "./WorkoutCard";
import { format, isSameDay, subDays } from "date-fns";
import { CalendarDays } from "lucide-react";

interface WorkoutListProps {
  selectedDate: Date;
}

const WorkoutList: React.FC<WorkoutListProps> = ({ selectedDate }) => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [yesterdayWorkouts, setYesterdayWorkouts] = useState<Workout[]>([]);
  const [pastWeekWorkouts, setPastWeekWorkouts] = useState<Workout[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
  
  const formattedDate = format(selectedDate, "EEEE, MMMM d, yyyy");
  const isToday = isSameDay(selectedDate, new Date());
  
  useEffect(() => {
    // Fetch all workouts whenever the date or refresh trigger changes
    setWorkouts(getWorkoutsByDate(selectedDate));
    
    if (isToday) {
      setYesterdayWorkouts(getWorkoutsForYesterday());
      setPastWeekWorkouts(getWorkoutsForPastWeek());
    }
  }, [selectedDate, isToday, refreshTrigger]);
  
  const handleWorkoutDeleted = () => {
    // Trigger a refresh when a workout is deleted
    setRefreshTrigger(prev => prev + 1);
  };
  
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
              <WorkoutCard 
                key={workout.id} 
                workout={workout} 
                onWorkoutDeleted={handleWorkoutDeleted}
              />
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
              <WorkoutCard 
                key={workout.id} 
                workout={workout} 
                onWorkoutDeleted={handleWorkoutDeleted}
              />
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
              <WorkoutCard 
                key={workout.id} 
                workout={workout} 
                onWorkoutDeleted={handleWorkoutDeleted}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkoutList;
