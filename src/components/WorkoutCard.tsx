
import React, { useRef } from "react";
import { Workout, getCategoryInfo } from "@/lib/mockData";
import { ChevronDown, ChevronUp, Edit2, Trash2 } from "lucide-react";
import ExerciseItem from "./ExerciseItem";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import * as LucideIcons from "lucide-react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface WorkoutCardProps {
  workout: Workout;
  onDelete?: (id: string) => void;
  isExpanded: boolean;
  onToggleExpanded: (id: string) => void;
}

const WorkoutCard: React.FC<WorkoutCardProps> = ({ 
  workout, 
  onDelete, 
  isExpanded, 
  onToggleExpanded 
}) => {
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const navigate = useNavigate();
  
  // Create a ref to the workout card element
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Scroll the card into view when it's expanded
  React.useEffect(() => {
    if (isExpanded && cardRef.current) {
      // Small timeout to ensure the DOM has updated and the element is expanded
      setTimeout(() => {
        if (cardRef.current) {
          // Scroll the card to be near the top of the viewport
          // Calculate the position: element's distance from the top - some margin
          const yOffset = -20; // 20px margin from the top
          const cardTop = cardRef.current.getBoundingClientRect().top;
          const offsetPosition = cardTop + window.pageYOffset + yOffset;
          
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }, 100);
    }
  }, [isExpanded]);

  const toggleExpanded = () => {
    onToggleExpanded(workout.id);
  };
  
  const categoryInfo = getCategoryInfo(workout.category);

  const handleEditWorkout = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/edit-workout/${workout.id}`);
  };

  const handleDeleteWorkout = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (onDelete) {
      onDelete(workout.id);
    }
    setShowDeleteDialog(false);
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

  // Format the workout date
  const formatWorkoutDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "MMM d, yyyy");
  };

  return (
    <div ref={cardRef} className="mb-4 rounded-xl overflow-hidden glass-card animate-scale-in">
      {/* Workout header */}
      <div
        className="px-4 py-4 flex items-start justify-between cursor-pointer"
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
          
          {/* Bottom row with category tag and exercise count */}
          <div className="flex flex-row flex-wrap items-center justify-between gap-x-3 gap-y-1 mt-2">
            <div className="flex flex-row flex-wrap items-center gap-x-3 gap-y-1">
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
        </div>
        
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-2">
            {/* Action buttons and expand toggle in the same row */}
            <div className={cn(
              "flex items-center gap-2 transition-all duration-300", 
              isExpanded 
                ? "opacity-100 translate-x-0" 
                : "opacity-0 translate-x-8 pointer-events-none"
            )}>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={handleDeleteWorkout}
                title="Delete Workout"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={handleEditWorkout}
                title="Edit Workout"
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Toggle expand button - always visible */}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={(e) => {
                e.stopPropagation();
                toggleExpanded();
              }}
            >
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </div>
          
          {/* Date right below the chevron */}
          <span className="text-sm text-muted-foreground whitespace-nowrap select-none mt-2">
            {formatWorkoutDate(workout.date)}
          </span>
        </div>
      </div>

      {/* Exercises list - shown when expanded */}
      {isExpanded && (
        <div className="border-t border-border/40 animate-fade-in">
          {workout.exercises.map((exercise) => (
            <ExerciseItem key={exercise.id} exercise={exercise} workoutId={workout.id} />
          ))}
        </div>
      )}

      {/* Delete confirmation dialog with rounded corners */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="max-w-[90%] w-full sm:max-w-lg p-4 sm:p-6 rounded-xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Workout</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{workout.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
            <AlertDialogCancel className="mt-0 w-full sm:w-auto">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground w-full sm:w-auto">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default WorkoutCard;
