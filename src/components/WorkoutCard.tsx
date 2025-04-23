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

  // Function to get a complementary border color with opacity
  const getBorderColor = (hexColor: string) => {
    // Convert hex to RGB
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);

    // Adjust brightness slightly for border
    const darkerR = Math.max(0, r - 30);
    const darkerG = Math.max(0, g - 30);
    const darkerB = Math.max(0, b - 30);

    // Return with 40% opacity
    return `rgba(${darkerR}, ${darkerG}, ${darkerB}, 0.4)`;
  };

  // Render icon by name if it exists
  const renderCategoryIcon = (iconName: string | null, color: string) => {
    if (!iconName) return null;

    // Get the icon component by name
    const IconComponent = (LucideIcons as any)[iconName];
    if (!IconComponent) return null;

    return <IconComponent size={14} color={color} className="mr-1" />;
  };

  return (
    <div className="mb-4 rounded-xl overflow-hidden glass-card animate-scale-in">
      {/* Workout header */}
      <div
        className="p-4 flex items-start justify-between cursor-pointer"
        onClick={toggleExpanded}
      >
        <div className="flex-1 min-w-0">
          {/* Title (always left-aligned and on its own line - full width, wraps if needed) */}
          <h3
            className="font-semibold text-lg break-words leading-snug max-w-full text-left"
            style={{ wordBreak: "break-word" }}
          >
            {workout.title}
          </h3>
          {/* Category + count on same row, overflow moves both below title */}
          <div className="flex flex-row flex-wrap items-center gap-x-3 gap-y-1 mt-2">
            <span
              className={cn(
                "workout-tag flex items-center text-xs py-1 px-2 rounded-full",
                "max-w-full"
              )}
              style={{
                backgroundColor: categoryInfo.color,
                color: getContrastColor(categoryInfo.color),
                borderColor: getBorderColor(categoryInfo.color),
                borderWidth: "1.5px",
              }}
            >
              {categoryInfo.icon &&
                renderCategoryIcon(
                  categoryInfo.icon,
                  getContrastColor(categoryInfo.color)
                )}
              {workout.category}
            </span>
            <span className="text-sm text-muted-foreground whitespace-nowrap select-none">
              {workout.exercises.length} exercise
              {workout.exercises.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-2 ml-2">
          {/* Removed completed checkmark */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full"
            onClick={handleEditWorkout}
            title="Edit Workout"
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
