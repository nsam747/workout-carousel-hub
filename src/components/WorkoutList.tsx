
import React from "react";
import { Workout } from "@/lib/mockData";
import WorkoutCard from "./WorkoutCard";
import { format, isSameDay } from "date-fns";
import { CalendarDays } from "lucide-react";
import { toast } from "sonner";
import { WorkoutAccordionProvider } from "@/contexts/WorkoutAccordionContext";
import { ExerciseAccordionProvider } from "@/contexts/ExerciseAccordionContext";
import { useWorkoutsByDate, useWorkoutsForYesterday, useWorkoutsForPastWeek } from "@/hooks/useExerciseData";

interface WorkoutListProps {
  selectedDate: Date;
}

const WorkoutList: React.FC<WorkoutListProps> = ({ selectedDate }) => {
  const { workouts, loading: workoutsLoading } = useWorkoutsByDate(selectedDate);
  const { workouts: yesterdayWorkouts, loading: yesterdayLoading } = useWorkoutsForYesterday();
  const { workouts: pastWeekWorkouts, loading: pastWeekLoading } = useWorkoutsForPastWeek();
  
  const formattedDate = format(selectedDate, "EEEE, MMMM d, yyyy");
  const isToday = isSameDay(selectedDate, new Date());
  
  // Debug logs
  React.useEffect(() => {
    console.log("Selected date:", selectedDate);
    console.log("Fetched workouts:", workouts);
    
    if (isToday) {
      console.log("Yesterday workouts:", yesterdayWorkouts);
      console.log("Past week workouts:", pastWeekWorkouts);
    }
  }, [selectedDate, isToday, workouts, yesterdayWorkouts, pastWeekWorkouts]);
  
  const handleDeleteWorkout = (id: string) => {
    // We'll need to implement delete functionality with hooks later
    // For now, let's update local state and show toast
    toast.success("Workout deleted successfully");
  };
  
  return (
    <WorkoutAccordionProvider>
      <ExerciseAccordionProvider>
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
              {!workoutsLoading && workouts.length > 0 ? (
                workouts.map((workout) => (
                  <WorkoutCard 
                    key={workout.id} 
                    workout={workout} 
                    onDelete={handleDeleteWorkout}
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
          {isToday && !yesterdayLoading && yesterdayWorkouts.length > 0 && (
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
                  />
                ))}
              </div>
            </div>
          )}
          
          {/* Past Week section - only show on today's view */}
          {isToday && !pastWeekLoading && pastWeekWorkouts.length > 0 && (
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
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </ExerciseAccordionProvider>
    </WorkoutAccordionProvider>
  );
};

export default WorkoutList;
