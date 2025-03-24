
import React, { useState } from "react";
import { Workout, getCategoryColor } from "@/lib/mockData";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import ExerciseItem from "./ExerciseItem";
import { Button } from "@/components/ui/button";

interface WorkoutCardProps {
  workout: Workout;
}

const WorkoutCard: React.FC<WorkoutCardProps> = ({ workout }) => {
  const [expanded, setExpanded] = useState(false);
  
  const toggleExpanded = () => setExpanded(!expanded);
  
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
              className={`workout-tag border ${getCategoryColor(workout.category)}`}
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
