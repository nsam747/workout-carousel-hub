
import React from "react";
import { RecentWorkout } from "@/lib/profileData";
import { cn } from "@/lib/utils";
import { Calendar, ChevronRight, Clock, Flame, MapPin } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";

interface RecentActivityListProps {
  workouts: RecentWorkout[];
}

const RecentActivityList: React.FC<RecentActivityListProps> = ({ workouts }) => {
  // Function to format the workout date
  const formatWorkoutDate = (dateString: string): string => {
    try {
      return format(new Date(dateString), "MMM d, yyyy");
    } catch (error) {
      return "Recent";
    }
  };

  // Function to format duration
  const formatDuration = (minutes: number): string => {
    if (minutes < 60) {
      return `${minutes}m`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins > 0 ? `${mins}m` : ''}`;
  };

  // Function to get category color
  const getCategoryColor = (category: string): string => {
    const colors: Record<string, string> = {
      "Strength": "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
      "Cardio": "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
      "HIIT": "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
      "Flexibility": "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
    };

    return colors[category] || "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
  };

  // Function to get intensity color
  const getIntensityColor = (intensity?: "Low" | "Medium" | "High"): string => {
    if (!intensity) return "";
    
    const colors: Record<string, string> = {
      "Low": "text-green-600 dark:text-green-400",
      "Medium": "text-yellow-600 dark:text-yellow-400",
      "High": "text-red-600 dark:text-red-400",
    };

    return colors[intensity] || "";
  };

  return (
    <div className="px-4 py-3">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-semibold">Recent Activity</h2>
        <Button size="sm" variant="ghost" className="text-xs">
          View All <ChevronRight className="h-3 w-3 ml-1" />
        </Button>
      </div>
      
      <div className="space-y-3">
        {workouts.map(workout => (
          <div 
            key={workout.id}
            className="bg-background border border-border/50 rounded-xl p-3 hover:shadow-sm transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{workout.title}</h3>
                <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-muted-foreground">
                  <span className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    {formatWorkoutDate(workout.date)}
                  </span>
                  <span className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {formatDuration(workout.duration)}
                  </span>
                </div>
              </div>
              
              <div className={cn(
                "px-2 py-1 rounded-full text-xs font-medium",
                getCategoryColor(workout.category)
              )}>
                {workout.category}
              </div>
            </div>
            
            {/* Stats */}
            <div className="flex flex-wrap mt-3 gap-x-4 gap-y-1">
              {workout.stats.distance && (
                <div className="flex items-center text-sm">
                  <MapPin className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                  <span>{workout.stats.distance} km</span>
                </div>
              )}
              
              {workout.stats.calories && (
                <div className="flex items-center text-sm">
                  <Flame className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                  <span>{workout.stats.calories} cal</span>
                </div>
              )}
              
              {workout.stats.intensity && (
                <div className="flex items-center text-sm">
                  <span className={cn("font-medium", getIntensityColor(workout.stats.intensity))}>
                    {workout.stats.intensity} Intensity
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivityList;
