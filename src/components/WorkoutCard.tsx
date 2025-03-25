
import React, { useState } from "react";
import { Workout, getCategoryInfo } from "@/lib/mockData";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import ExerciseItem from "./ExerciseItem";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface WorkoutCardProps {
  workout: Workout;
}

const WorkoutCard: React.FC<WorkoutCardProps> = ({ workout }) => {
  const [expanded, setExpanded] = useState(false);
  
  const toggleExpanded = () => setExpanded(!expanded);
  const categoryInfo = getCategoryInfo(workout.category);
  
  // Function to determine contrasting text color (black or white) based on background
  const getContrastColor = (hexColor: string) => {
    // Convert hex to RGB
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    
    // Calculate relative luminance (perceived brightness)
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    
    // Return black for bright colors, white for dark colors
    return luminance > 0.5 ? "#000000" : "#FFFFFF";
  };
  
  return (
    <div className="mb-4 rounded-xl overflow-hidden glass-card animate-scale-in">
      {/* Workout header */}
      <div 
        className="p-4 flex items-center justify-between cursor-pointer"
        onClick={toggleExpanded}
      >
        <div className="flex-1">
          <div className="flex items-center mb-1">
            <h3 className="font-semibold text-lg mr-3">{workout.title}</h3>
            <span 
              className="workout-tag"
              style={{ 
                backgroundColor: categoryInfo.color,
                color: getContrastColor(categoryInfo.color),
                borderColor: "transparent"
              }}
            >
              {workout.category}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            {workout.exercises.length} exercise{workout.exercises.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {workout.completed && (
            <div className="rounded-full bg-green-100 p-1" title="Completed">
              <Check className="h-4 w-4 text-green-600" />
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full"
            onClick={(e) => {
              e.stopPropagation();
              toggleExpanded();
            }}
          >
            {expanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
      
      {/* Exercises list - shown when expanded */}
      {expanded && (
        <div className="p-4 pt-0 border-t border-border/40 animate-fade-in">
          {workout.exercises.map((exercise) => (
            <ExerciseItem key={exercise.id} exercise={exercise} />
          ))}
        </div>
      )}
    </div>
  );
};

export default WorkoutCard;
