
import React from "react";
import { getWorkoutsByDate, Workout } from "@/lib/mockData";
import WorkoutCard from "./WorkoutCard";
import { format, isSameDay } from "date-fns";
import { toast } from "sonner";

interface WorkoutListProps {
  selectedDate: Date;
}

const WorkoutList: React.FC<WorkoutListProps> = ({ selectedDate }) => {
  const [workouts, setWorkouts] = React.useState<Workout[]>([]);
  
  React.useEffect(() => {
    // Get workouts for the selected date
    const fetchedWorkouts = getWorkoutsByDate(selectedDate);
    setWorkouts(fetchedWorkouts);
  }, [selectedDate]);

  const handleDeleteWorkout = (id: string) => {
    // Filter out the deleted workout
    setWorkouts(current => current.filter(workout => workout.id !== id));
    // In a real app, you would also delete from the database here
  };
  
  const formattedDate = format(selectedDate, "EEEE, MMMM d");
  const isToday = isSameDay(selectedDate, new Date());

  return (
    <div className="mt-6 animate-fade-in">
      <h2 className="text-xl font-semibold mb-4">
        {isToday ? "Today's Workouts" : `Workouts for ${formattedDate}`}
      </h2>

      {workouts.length > 0 ? (
        <div className="space-y-4">
          {workouts.map(workout => (
            <WorkoutCard key={workout.id} workout={workout} onDeleteWorkout={handleDeleteWorkout} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 bg-muted/40 rounded-lg border border-border/40">
          <p className="text-muted-foreground">No workouts scheduled for this day</p>
          <button 
            className="mt-2 text-primary hover:underline text-sm" 
            onClick={() => {}}
          >
            Create a workout
          </button>
        </div>
      )}
    </div>
  );
};

export default WorkoutList;
