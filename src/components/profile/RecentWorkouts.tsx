
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { getWorkoutsForPastWeek } from "@/lib/mockData";
import WorkoutCard from "@/components/WorkoutCard";
import { Workout } from "@/lib/mockData";

interface RecentWorkoutsProps {
  userId: string;
}

const RecentWorkouts: React.FC<RecentWorkoutsProps> = ({ userId }) => {
  const [expandedWorkoutId, setExpandedWorkoutId] = useState<string | null>(null);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  
  useEffect(() => {
    // In a real app, we would fetch workouts for the specific user
    // For now, we'll use the mock data
    const recentWorkouts = getWorkoutsForPastWeek().slice(0, 3);
    setWorkouts(recentWorkouts);
  }, [userId]);
  
  const toggleWorkoutExpanded = (id: string) => {
    setExpandedWorkoutId(prevId => prevId === id ? null : id);
  };
  
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium">Recent Workouts</h2>
      
      {workouts.length > 0 ? (
        workouts.map(workout => (
          <WorkoutCard
            key={workout.id}
            workout={workout}
            isExpanded={expandedWorkoutId === workout.id}
            onToggleExpanded={toggleWorkoutExpanded}
            isReadOnly={true}
          />
        ))
      ) : (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">No recent workouts</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RecentWorkouts;
