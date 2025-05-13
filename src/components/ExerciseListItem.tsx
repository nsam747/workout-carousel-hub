import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronUp, Trash2, Image, StickyNote, Repeat, Weight, Timer, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import AddSetForm from "./AddSetForm";
import { Exercise, ExerciseSet } from "@/lib/mockData";
import { generateExerciseSummary } from "@/lib/exerciseUtils";
import { cn } from "@/lib/utils";
import { v4 as uuidv4 } from 'uuid';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

// Props definition updated to include isExpanded and onToggleExpand
interface ExerciseListItemProps {
  exercise: Exercise;
  onRemove: (id: string) => void;
  onExerciseUpdate: (exercise: Exercise) => void;
  isNewlyAdded?: boolean;
  isExpanded?: boolean;
  onToggleExpand?: (isExpanded: boolean) => void;
}

const ExerciseListItem: React.FC<ExerciseListItemProps> = ({ 
  exercise, 
  onRemove, 
  onExerciseUpdate,
  isNewlyAdded = false,
  isExpanded,
  onToggleExpand
}) => {
  // Internal state for uncontrolled mode
  const [internalExpanded, setInternalExpanded] = useState(false);
  const [isAddingSet, setIsAddingSet] = useState(false);
  
  // Reference for the exercise item element to handle scrolling
  const exerciseRef = useRef<HTMLDivElement>(null);
  
  // Determine if we're in controlled mode
  const isControlled = isExpanded !== undefined && onToggleExpand !== undefined;
  // Use the appropriate expanded state
  const expanded = isControlled ? isExpanded : internalExpanded;
  
  // Effect for scroll behavior when expanded
  useEffect(() => {
    if (expanded && exerciseRef.current) {
      setTimeout(() => {
        if (exerciseRef.current) {
          // Get height of any sticky header 
          // Assuming a height of 70px for the sticky header
          const stickyHeaderHeight = 70;
          
          const exerciseTop = exerciseRef.current.getBoundingClientRect().top;
          const offsetPosition = exerciseTop + window.pageYOffset - stickyHeaderHeight - 20;
          
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }, 100);
    }
  }, [expanded]);
  
  // Handler for toggling expanded state
  const toggleExpanded = () => {
    if (isControlled) {
      onToggleExpand(!expanded);
    } else {
      setInternalExpanded(!internalExpanded);
    }
  };
  
  // Function to update sets
  const updateSets = (sets: ExerciseSet[]) => {
    onExerciseUpdate({
      ...exercise,
      sets
    });
  };
  
  // Function to add a new set
  const addSet = (newSet: ExerciseSet) => {
    console.log("Adding new set:", newSet);
    const updatedSets = exercise.sets ? [...exercise.sets, newSet] : [newSet];
    updateSets(updatedSets);
    setIsAddingSet(false);
  };
  
  // Function to remove a set
  const removeSet = (setId: string) => {
    if (!exercise.sets) return;
    const updatedSets = exercise.sets.filter(set => set.id !== setId);
    updateSets(updatedSets);
  };
  
  // Generate the exercise summary
  const summaryContent = generateExerciseSummary(exercise);
  
  return (
    <div 
      ref={exerciseRef}
      className={cn(
        "bg-white rounded-lg border border-border shadow-sm transition-all duration-300 overflow-hidden",
        isNewlyAdded && "animate-pulse border-primary/50",
        expanded ? "mb-4" : "mb-2"
      )}
    >
      {/* Exercise header */}
      <div 
        className="p-3 cursor-pointer flex items-start justify-between"
        onClick={toggleExpanded}
      >
        <div className="flex-1">
          <h3 className="font-medium">{exercise.name}</h3>
          {!expanded && summaryContent}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full"
          onClick={(e) => {
            e.stopPropagation();
            toggleExpanded();
          }}
        >
          {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </div>
      
      {/* Exercise details when expanded */}
      {expanded && (
        <div className="border-t border-border/50 p-3 bg-muted/30 animate-slide-down">
          {/* Exercise sets */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium">Sets</h4>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsAddingSet(true)}
                className="h-7 text-xs rounded-full"
              >
                Add Set
              </Button>
            </div>
            
            {!exercise.sets || exercise.sets.length === 0 ? (
              <div className="text-center py-3 text-muted-foreground text-sm">
                No sets added yet
              </div>
            ) : (
              <div className="space-y-2">
                {exercise.sets.map((set, index) => (
                  <div 
                    key={set.id} 
                    className="bg-background rounded-md p-2 flex items-center justify-between"
                  >
                    <Badge variant="outline" className="mr-2">
                      Set {index + 1}
                    </Badge>
                    
                    <div className="flex-1 flex flex-wrap gap-1">
                      {set.metrics.map((metric, i) => (
                        <Badge 
                          key={i}
                          variant="secondary" 
                          className="text-xs"
                        >
                          {metric.value} {metric.unit}
                          {metric.type === "repetitions" && " reps"}
                          {metric.type === "weight" && " weight"}
                          {metric.type === "distance" && " dist"}
                          {metric.type === "duration" && " time"}
                        </Badge>
                      ))}
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeSet(set.id)}
                      className="h-6 w-6 rounded-full"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Notes section */}
          {exercise.notes && (
            <div className="mb-4">
              <div className="flex items-center text-sm font-medium mb-1">
                <StickyNote className="h-4 w-4 mr-1.5" />
                <span>Notes</span>
              </div>
              <p className="text-sm text-muted-foreground">{exercise.notes}</p>
            </div>
          )}
          
          {/* Media section */}
          {exercise.media && exercise.media.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center text-sm font-medium">
                <Image className="h-4 w-4 mr-1.5" />
                <span>Media</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {exercise.media.map((url, index) => (
                  <div 
                    key={index} 
                    className="rounded-md overflow-hidden aspect-video border border-border relative"
                  >
                    <img
                      src={url}
                      alt={`Exercise media ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Action buttons */}
          <div className="flex items-center justify-between mt-4">
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onRemove(exercise.id)}
              className="h-8 rounded-full"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Remove Exercise
            </Button>
            
            {/* Close button */}
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full"
              onClick={toggleExpanded}
            >
              <X className="h-4 w-4 mr-2" />
              Close
            </Button>
          </div>
        </div>
      )}
      
      {/* Add Set Form */}
      {isAddingSet && (
        <AddSetForm
          onAddSet={(metrics) => {
            const newSet: ExerciseSet = {
              id: uuidv4(),
              metrics
            };
            addSet(newSet);
          }}
          onCancel={() => setIsAddingSet(false)}
        />
      )}
    </div>
  );
};

export default ExerciseListItem;
