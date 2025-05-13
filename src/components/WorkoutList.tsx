
import React, { useState, useEffect, useContext } from "react";
import { 
  Workout, 
  getWorkoutsByDate, 
  getWorkoutsForYesterday, 
  getWorkoutsForPastWeek,
  deleteWorkout
} from "@/lib/mockData";
import WorkoutCard from "./WorkoutCard";
import { format, isSameDay } from "date-fns";
import { CalendarDays } from "lucide-react";
import { toast } from "sonner";

interface WorkoutListProps {
  selectedDate: Date;
}

const WorkoutList: React.FC<WorkoutListProps> = ({ selectedDate }) => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [yesterdayWorkouts, setYesterdayWorkouts] = useState<Workout[]>([]);
  const [pastWeekWorkouts, setPastWeekWorkouts] = useState<Workout[]>([]);
  const [expandedWorkoutId, setExpandedWorkoutId] = useState<string | null>(null);
  
  const formattedDate = format(selectedDate, "EEEE, MMMM d, yyyy");
  const isToday = isSameDay(selectedDate, new Date());
  
  // Reset expanded workout when date changes
  useEffect(() => {
    console.log("Date changed, resetting expanded workout");
    setExpandedWorkoutId(null);
  }, [selectedDate]);
  
  useEffect(() => {
    // Add console logs to debug data retrieval
    console.log("Selected date:", selectedDate);
    const fetchedWorkouts = getWorkoutsByDate(selectedDate);
    console.log("Fetched workouts:", fetchedWorkouts);
    setWorkouts(fetchedWorkouts);
    
    // Only fetch yesterday and past week workouts when viewing today
    if (isToday) {
      const yesterdayData = getWorkoutsForYesterday();
      console.log("Yesterday workouts:", yesterdayData);
      setYesterdayWorkouts(yesterdayData);
      
      const pastWeekData = getWorkoutsForPastWeek();
      console.log("Past week workouts:", pastWeekData);
      setPastWeekWorkouts(pastWeekData);
    } else {
      setYesterdayWorkouts([]);
      setPastWeekWorkouts([]);
    }
  }, [selectedDate, isToday]);
  
  const handleDeleteWorkout = (id: string) => {
    // Delete the workout from the data source
    deleteWorkout(id);
    
    // Update local state
    setWorkouts(workouts.filter(workout => workout.id !== id));
    setYesterdayWorkouts(yesterdayWorkouts.filter(workout => workout.id !== id));
    setPastWeekWorkouts(pastWeekWorkouts.filter(workout => workout.id !== id));
    
    // Show confirmation toast
    toast.success("Workout deleted successfully");
    
    // If the deleted workout was expanded, reset expanded state
    if (expandedWorkoutId === id) {
      setExpandedWorkoutId(null);
    }
  };
  
  const toggleWorkoutExpanded = (id: string) => {
    setExpandedWorkoutId(prevId => prevId === id ? null : id);
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
                    onDelete={handleDeleteWorkout}
                    isExpanded={expandedWorkoutId === workout.id}
                    onToggleExpanded={toggleWorkoutExpanded}
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
                    onDelete={handleDeleteWorkout} 
                    isExpanded={expandedWorkoutId === workout.id}
                    onToggleExpanded={toggleWorkoutExpanded}
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
                    onDelete={handleDeleteWorkout}
                    isExpanded={expandedWorkoutId === workout.id}
                    onToggleExpanded={toggleWorkoutExpanded}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
  );
};

export default WorkoutList;
