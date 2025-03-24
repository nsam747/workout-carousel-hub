
import React from "react";
import { Workout, getWorkoutsByDate } from "@/lib/mockData";
import WorkoutCard from "./WorkoutCard";
import { format } from "date-fns";
import { CalendarDays } from "lucide-react";

interface WorkoutListProps {
  selectedDate: Date;
}

const WorkoutList: React.FC<WorkoutListProps> = ({ selectedDate }) => {
  const workouts = getWorkoutsByDate(selectedDate);
  const formattedDate = format(selectedDate, "EEEE, MMMM d, yyyy");
  const isToday = format(selectedDate, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");

  return (
    <div className="flex-1 overflow-hidden animate-fade-in">
      <div className="flex items-center mb-4">
        <CalendarDays className="h-5 w-5 mr-2 text-muted-foreground" />
        <h2 className="text-lg font-medium">
          {isToday ? "Today" : formattedDate}
        </h2>
      </div>

      <div className="overflow-y-auto h-[calc(100vh-240px)] pr-1 -mr-1 pb-6">
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
  );
};

export default WorkoutList;
