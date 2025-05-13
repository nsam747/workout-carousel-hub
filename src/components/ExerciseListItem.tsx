
import React, { useState, useRef, useEffect } from "react";
import { Exercise, Set } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Trash2, Plus, Edit, Save } from "lucide-react";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { generateExerciseSummary } from "@/lib/exerciseUtils";

interface ExerciseListItemProps {
  exercise: Exercise;
  onRemove: (id: string) => void;
  onExerciseUpdate: (exercise: Exercise) => void;
  isNewlyAdded?: boolean;
  isExpanded?: boolean;
  onToggleExpand?: (expanded: boolean) => void;
}

const ExerciseListItem: React.FC<ExerciseListItemProps> = ({
  exercise,
  onRemove,
  onExerciseUpdate,
  isNewlyAdded = false,
  isExpanded = false,
  onToggleExpand
}) => {
  const [expanded, setExpanded] = useState(isExpanded);
  const [exerciseState, setExerciseState] = useState<Exercise>({ ...exercise });
  const exerciseRef = useRef<HTMLDivElement>(null);
  
  // Update local expanded state when isExpanded prop changes
  useEffect(() => {
    setExpanded(isExpanded);
    
    // If it was just expanded, scroll to this exercise
    if (isExpanded && !expanded && exerciseRef.current) {
      setTimeout(() => {
        if (exerciseRef.current) {
          // Calculate header height - assuming header is 64px (adjust if different)
          const headerHeight = 64; 
          
          // Get the element position
          const elementRect = exerciseRef.current.getBoundingClientRect();
          
          // Check if the element is behind the header
          if (elementRect.top < headerHeight) {
            // Calculate scroll position accounting for header height
            const yOffset = -20; // additional margin
            const offsetPosition = window.pageYOffset + elementRect.top - headerHeight + yOffset;
            
            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
          }
        }
      }, 100);
    }
  }, [isExpanded, expanded]);

  // Update exercise state when exercise prop changes
  useEffect(() => {
    setExerciseState({ ...exercise });
  }, [exercise]);

  // Toggle expanded state
  const toggleExpanded = () => {
    const newExpandedState = !expanded;
    setExpanded(newExpandedState);
    if (onToggleExpand) {
      onToggleExpand(newExpandedState);
    }
  };

  // Handle set changes
  const handleSetChange = (setIndex: number, field: keyof Set, value: any) => {
    const updatedSets = [...(exerciseState.sets || [])];
    updatedSets[setIndex] = {
      ...updatedSets[setIndex],
      [field]: value,
    };

    const updatedExercise = {
      ...exerciseState,
      sets: updatedSets,
    };

    setExerciseState(updatedExercise);
  };

  // Handle metric changes within a set
  const handleMetricChange = (setIndex: number, metricIndex: number, field: string, value: any) => {
    const updatedSets = [...(exerciseState.sets || [])];
    const updatedMetrics = [...updatedSets[setIndex].metrics];
    
    updatedMetrics[metricIndex] = {
      ...updatedMetrics[metricIndex],
      [field]: field === 'value' ? parseFloat(value) || 0 : value,
    };

    updatedSets[setIndex] = {
      ...updatedSets[setIndex],
      metrics: updatedMetrics,
    };

    const updatedExercise = {
      ...exerciseState,
      sets: updatedSets,
    };

    setExerciseState(updatedExercise);
  };

  // Add a new set
  const addSet = () => {
    const existingSets = exerciseState.sets || [];
    const lastSet = existingSets.length > 0 ? existingSets[existingSets.length - 1] : null;
    
    // Calculate the next set number
    const newSetNumber = lastSet ? lastSet.setNumber + 1 : 1;
    
    // Create a new set based on the last set or with default values
    const newSet: Set = {
      id: `set-${Date.now()}`,
      setNumber: newSetNumber,
      metrics: lastSet ? lastSet.metrics.map(metric => ({ ...metric })) : [],
    };

    const updatedExercise = {
      ...exerciseState,
      sets: [...existingSets, newSet],
    };

    setExerciseState(updatedExercise);
    onExerciseUpdate(updatedExercise);
  };

  // Remove a set
  const removeSet = (setIndex: number) => {
    const updatedSets = [...(exerciseState.sets || [])];
    updatedSets.splice(setIndex, 1);

    const updatedExercise = {
      ...exerciseState,
      sets: updatedSets,
    };

    setExerciseState(updatedExercise);
    onExerciseUpdate(updatedExercise);
  };

  // Update notes
  const updateNotes = (notes: string) => {
    const updatedExercise = {
      ...exerciseState,
      notes,
    };
    setExerciseState(updatedExercise);
  };

  // Save changes to the exercise
  const saveExercise = () => {
    onExerciseUpdate(exerciseState);
  };

  // Format metric value with unit
  const formatMetricValue = (value: number, unit: string) => {
    return `${value}${unit}`;
  };

  // Get a summary of the exercise for display
  const exerciseSummary = generateExerciseSummary(exercise);

  return (
    <div
      ref={exerciseRef}
      className={`bg-white rounded-lg border ${
        isNewlyAdded ? "border-primary" : "border-border"
      } overflow-hidden transition-all duration-300 mb-2`}
    >
      <Collapsible open={expanded} onOpenChange={toggleExpanded}>
        <div className="flex items-center justify-between p-4">
          <div className="flex-1">
            <h3 className="font-medium">{exerciseState.name}</h3>
            {!expanded && exerciseSummary}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                onRemove(exercise.id);
              }}
              className="h-8 w-8 rounded-full text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full"
              >
                {expanded ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>
          </div>
        </div>

        <CollapsibleContent>
          <div className="border-t border-border p-4 bg-muted/30">
            {/* Sets Section */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium">Sets</h4>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addSet}
                  className="h-7 px-2 text-xs"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add Set
                </Button>
              </div>

              {/* Sets List */}
              {exerciseState.sets && exerciseState.sets.length > 0 ? (
                <div className="space-y-3">
                  {exerciseState.sets.map((set, setIndex) => (
                    <div
                      key={set.id}
                      className="bg-background rounded-md p-3 border border-border"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline" className="text-xs">
                          Set {setIndex + 1}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeSet(setIndex)}
                          className="h-6 w-6 rounded-full text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>

                      {/* Metrics */}
                      <div className="grid grid-cols-2 gap-2">
                        {set.metrics.map((metric, metricIndex) => (
                          <div
                            key={metricIndex}
                            className="bg-muted rounded-md p-2"
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-medium capitalize">
                                {metric.type}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {metric.unit}
                              </span>
                            </div>
                            <input
                              type="number"
                              value={metric.value}
                              onChange={(e) =>
                                handleMetricChange(
                                  setIndex,
                                  metricIndex,
                                  "value",
                                  e.target.value
                                )
                              }
                              onBlur={saveExercise}
                              className="w-full bg-background border border-input rounded-md px-2 py-1 text-sm"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-background rounded-md p-4 text-center text-muted-foreground">
                  <p className="text-sm">No sets added yet</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={addSet}
                    className="mt-2"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Add First Set
                  </Button>
                </div>
              )}
            </div>

            {/* Notes Section */}
            <div className="mb-4">
              <h4 className="text-sm font-medium mb-2">Notes</h4>
              <textarea
                value={exerciseState.notes || ""}
                onChange={(e) => updateNotes(e.target.value)}
                onBlur={saveExercise}
                placeholder="Add notes about this exercise..."
                className="w-full min-h-[100px] bg-background border border-input rounded-md px-3 py-2 text-sm"
              />
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              <Button onClick={saveExercise} size="sm">
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default ExerciseListItem;
