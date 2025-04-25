
import React, { useState } from "react";
import { Workout, getCategoryInfo } from "@/lib/mockData";
import { ChevronDown, ChevronUp, Edit2 } from "lucide-react";
import ExerciseItem from "./ExerciseItem";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import * as LucideIcons from "lucide-react";
import { useNavigate } from "react-router-dom";

interface WorkoutCardProps {
  workout: Workout;
}

const WorkoutCard: React.FC<WorkoutCardProps> = ({ workout }) => {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();

  const toggleExpanded = () => setExpanded(!expanded);
  const categoryInfo = getCategoryInfo(workout.category);

  const handleEditWorkout = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/edit-workout/${workout.id}`);
  };

  const renderCategoryIcon = (iconName: string | null, color: string) => {
    if (!iconName) return null;
    const IconComponent = (LucideIcons as any)[iconName];
    if (!IconComponent) return null;
    return <IconComponent size={14} color={color} className="mr-1" />;
  };

  return (
    <div className="mb-4 rounded-xl overflow-hidden glass-card animate-scale-in">
      <div
        className="p-4 cursor-pointer transition-colors hover:bg-accent/5"
        onClick={toggleExpanded}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg break-words leading-snug">
              {workout.title}
            </h3>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <span
                className="flex items-center text-xs py-1 px-2.5 rounded-full font-medium"
                style={{
                  backgroundColor: `${categoryInfo.color}15`,
                  color: categoryInfo.color,
                }}
              >
                {categoryInfo.icon && renderCategoryIcon(categoryInfo.icon, categoryInfo.color)}
                {workout.category}
              </span>
              <span className="text-sm text-muted-foreground">
                {workout.exercises.length} exercise{workout.exercises.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 ml-4">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={handleEditWorkout}
            >
              <Edit2 className="h-4 w-4" />
            </Button>
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
      </div>

      {expanded && (
        <div className="border-t border-border/40 divide-y divide-border/40">
          {workout.exercises.map((exercise) => (
            <ExerciseItem key={exercise.id} exercise={exercise} />
          ))}
        </div>
      )}
    </div>
  );
};

export default WorkoutCard;
