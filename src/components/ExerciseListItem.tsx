import React, { useState, useEffect, useRef } from "react";
import { Trash, ChevronDown, ChevronUp, Image, Plus, X, Check, Save, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Exercise, saveExercise, Set, SelectedMetric, Metric } from "@/lib/mockData";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { generateId } from "@/lib/utils";
import { 
  getMetricIcon, 
  formatMetricWithUnit, 
  generateExerciseSummary,
  sortMetrics
} from "@/lib/exerciseUtils";
import { cn } from "@/lib/utils";

// Helper function to get available exercise types
// This should be imported from mockData, but adding it here for completeness
const getExerciseTypes = () => {
  return [
    "Strength", 
    "Cardio", 
    "Flexibility", 
    "Balance", 
    "Core", 
    "HIIT", 
    "Recovery",
    "Other"
  ];
};

interface ExerciseListItemProps {
  exercise: Exercise;
  onRemove: (id: string) => void;
  onExerciseUpdate?: (updatedExercise: Exercise) => void;
  isNewlyAdded?: boolean;
  // Add new props for accordion functionality
  isExpanded?: boolean;
  onToggleExpand?: (isExpanded: boolean) => void;
}

interface SetData {
  id: string;
  metrics: Metric[];
  setNumber: number;
}

const ExerciseListItem: React.FC<ExerciseListItemProps> = ({ 
  exercise,
  onRemove,
  onExerciseUpdate,
  isNewlyAdded = false,
  // Use new props with defaults
  isExpanded: controlledExpanded,
  onToggleExpand
}) => {
  // Use internal state if not controlled externally
  const [internalExpanded, setInternalExpanded] = useState(isNewlyAdded);
  
  // Add a ref for scrolling
  const exerciseRef = useRef<HTMLDivElement>(null);
  
  // Determine if component is controlled or uncontrolled
  const isControlled = controlledExpanded !== undefined && onToggleExpand !== undefined;
  
  // Use either controlled or internal state
  const expanded = isControlled ? controlledExpanded : internalExpanded;
  
  // Track previous expanded state
  const prevExpandedRef = useRef(expanded);
  
  // Handle expansion state changes
  const handleExpandToggle = () => {
    if (isControlled && onToggleExpand) {
      // In controlled mode, notify parent
      onToggleExpand(!expanded);
    } else {
      // In uncontrolled mode, update internal state
      setInternalExpanded(!internalExpanded);
    }
  };
  
  // Add scroll effect when expanded changes
  useEffect(() => {
    // Only scroll if item is being expanded (not collapsed)
    if (expanded && !prevExpandedRef.current && exerciseRef.current) {
      setTimeout(() => {
        if (exerciseRef.current) {
          // Scroll the exercise to be near the top of the viewport
          const yOffset = -20; // 20px margin from the top
          const elementTop = exerciseRef.current.getBoundingClientRect().top;
          const offsetPosition = elementTop + window.pageYOffset + yOffset;
          
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }, 100);
    }
    
    // Update the previous expanded state
    prevExpandedRef.current = expanded;
  }, [expanded]);
  
  const [notes, setNotes] = useState(exercise.notes || "");
  const [sets, setSets] = useState<SetData[]>([]);
  const [activeSetId, setActiveSetId] = useState<string | null>(null);
  const [isEditingExercise, setIsEditingExercise] = useState(false);
  const [editedExerciseName, setEditedExerciseName] = useState(exercise.name);
  const [editedExerciseType, setEditedExerciseType] = useState(exercise.type);
  
  // For editing metrics
  const [editingMetricId, setEditingMetricId] = useState<string | null>(null);
  const [editedMetricValue, setEditedMetricValue] = useState<number>(0);
  const [editedMetricType, setEditedMetricType] = useState<string>("");
  const [editedMetricUnit, setEditedMetricUnit] = useState<string>("");
  
  // Debug state
  const [currentSummary, setCurrentSummary] = useState<React.ReactNode>(null);
  
  useEffect(() => {
    // Set notes from the exercise
    setNotes(exercise.notes || "");
    
    // Convert exercise sets to SetData format if available
    if (exercise.sets && exercise.sets.length > 0) {
      console.log("Processing sets for exercise:", exercise.name, exercise.sets);
      
      const convertedSets: SetData[] = exercise.sets.map(set => {
        // Check if the set already has metrics
        if (set.metrics && set.metrics.length > 0) {
          console.log("Set has metrics:", set.metrics);
          // Use the existing metrics
          return {
            id: set.id || generateId(),
            metrics: set.metrics.map(metric => ({
              ...metric,
              id: metric.id || generateId()
            })),
            setNumber: set.setNumber
          };
        }
        
        // Create metrics from set data for backward compatibility
        const metrics: Metric[] = [];
        
        // If set has reps, add as a metric
        if (set.reps !== undefined && set.reps > 0) {
          metrics.push({
            id: generateId(),
            type: "repetitions",
            value: set.reps,
            unit: "reps"
          });
        }
        
        // If set has weight, add as a metric
        if (set.weight !== undefined && set.weight > 0) {
          metrics.push({
            id: generateId(),
            type: "weight",
            value: set.weight,
            unit: "kg"
          });
        }
        
        return {
          id: set.id || generateId(),
          metrics,
          setNumber: set.setNumber
        };
      });
      
      console.log("Converted sets:", convertedSets);
      setSets(convertedSets);
    } else if (isNewlyAdded) {
      // Create an initial empty set for newly added exercises
      const newSetId = generateId();
      handleAddEmptySet(newSetId);
    }
    
    // Generate and store the initial summary
    setCurrentSummary(generateExerciseSummary(exercise));
  }, [exercise, isNewlyAdded]);
  
  // Add a new empty set directly with pre-selected metrics from exercise
  const handleAddEmptySet = (newSetId = generateId()) => {
    // Find the next set number (maximum setNumber + 1)
    const nextSetNumber = sets.length > 0 
      ? Math.max(...sets.map(set => set.setNumber)) + 1 
      : 1;
    
    // Create empty metrics based on the exercise's selected metrics
    const emptyMetrics: Metric[] = (exercise.selectedMetrics || []).map(selectedMetric => ({
      id: generateId(),
      type: selectedMetric.type,
      value: 0,
      unit: selectedMetric.unit.toLowerCase() // Ensure unit is lowercase
    }));
    
    const newSet: SetData = {
      id: newSetId,
      metrics: emptyMetrics,
      setNumber: nextSetNumber
    };
    
    setSets(prevSets => [...prevSets, newSet]);
    // Automatically activate the new set for editing
    setActiveSetId(newSetId);
    
    // Update exercise with new sets data
    updateExerciseWithSets([...sets, newSet]);
    
    return newSetId;
  };
  
  // Copy last set to create a new set
  const handleCopyLastSet = () => {
    if (sets.length === 0) return;
    
    const lastSet = sets[sets.length - 1];
    const nextSetNumber = lastSet.setNumber + 1;
    
    // Copy metrics from the last set
    const copiedMetrics = lastSet.metrics.map(metric => ({
      ...metric,
      id: generateId()
    }));
    
    const newSet: SetData = {
      id: generateId(),
      metrics: copiedMetrics,
      setNumber: nextSetNumber
    };
    
    setSets(prevSets => [...prevSets, newSet]);
    
    // Update exercise with new sets data
    updateExerciseWithSets([...sets, newSet]);
  };
  
  // Remove a set
  const handleRemoveSet = (setId: string) => {
    // Remove the set and renumber remaining sets
    const filteredSets = sets.filter(set => set.id !== setId);
    
    // Renumber the sets to be consecutive
    const renumberedSets = filteredSets.map((set, index) => ({
      ...set,
      setNumber: index + 1
    }));
    
    setSets(renumberedSets);
    
    // Clear active set if it was the one removed
    if (activeSetId === setId) {
      setActiveSetId(null);
    }
    
    // Update exercise with new sets data
    updateExerciseWithSets(renumberedSets);
  };
  
  // Set a set as active for editing
  const handleSetClick = (setId: string) => {
    setActiveSetId(activeSetId === setId ? null : setId);
  };
  
  // Function to handle metric edit start
  const handleEditMetric = (setId: string, metricId: string, currentType: string, currentValue: number, currentUnit: string) => {
    // When a metric is clicked, set it as the active editing metric
    // Also make the parent set active if it's not already
    setActiveSetId(setId);
    setEditingMetricId(metricId);
    setEditedMetricType(currentType);
    setEditedMetricValue(currentValue);
    setEditedMetricUnit(currentUnit);
  };
  
  // Function to save edited metric
  const handleSaveMetricEdit = (setId: string, metricId: string) => {
    const updatedSets = sets.map(set => 
      set.id === setId 
        ? {
            ...set,
            metrics: set.metrics.map(metric => 
              metric.id === metricId
                ? { ...metric, value: editedMetricValue }
                : metric
            )
          }
        : set
    );
    
    setSets(updatedSets);
    setEditingMetricId(null);
    
    // Update exercise with new sets data
    updateExerciseWithSets(updatedSets);
  };
  
  // Cancel metric editing
  const handleCancelMetricEdit = () => {
    setEditingMetricId(null);
  };

  // Function to update the parent exercise object with current sets data
  const updateExerciseWithSets = (updatedSets = sets) => {
    if (!onExerciseUpdate) return;
    
    // Convert SetData to proper Set format for the Exercise interface
    const convertedSets: Set[] = updatedSets.map(set => ({
      id: set.id,
      setNumber: set.setNumber,
      metrics: set.metrics
    }));
    
    const updatedExercise: Exercise = {
      ...exercise,
      sets: convertedSets,
      notes
    };
    
    console.log("Updating exercise with sets:", updatedExercise);
    
    // Update the summary immediately
    setCurrentSummary(generateExerciseSummary(updatedExercise));
    
    // Pass the updated exercise back to the parent component
    onExerciseUpdate(updatedExercise);
  };

  // Function to save exercise edits
  const handleSaveExerciseEdit = () => {
    const updatedExercise = {
      ...exercise,
      name: editedExerciseName,
      type: editedExerciseType
    };
    
    // Save to mock data
    saveExercise(updatedExercise);
    
    // Call parent update if provided
    if (onExerciseUpdate) {
      onExerciseUpdate(updatedExercise);
    }
    
    // Reset state
    setIsEditingExercise(false);
    toast.success("Exercise updated successfully");
  };

  // Function to save notes
  const handleSaveNotes = () => {
    if (!onExerciseUpdate) return;
    
    const updatedExercise = {
      ...exercise,
      notes
    };
    
    // Update the parent component
    onExerciseUpdate(updatedExercise);
  };

  return (
    <Card className="overflow-hidden animate-scale-in" ref={exerciseRef}>
      <div 
        className="p-3 flex items-start justify-between cursor-pointer" 
        onClick={handleExpandToggle}
        onDoubleClick={() => setIsEditingExercise(true)}
      >
        <div className="flex flex-col items-start gap-1 flex-1">
          <div className="flex items-center gap-2">
            <span className="font-medium text-left">{exercise.name}</span>
            <Badge variant="outline" className="text-xs">
              {exercise.type}
            </Badge>
          </div>
          
          {/* Render summary when collapsed - use the stored summary */}
          {!expanded && currentSummary}
        </div>
        
        <div className="flex items-center gap-1 mt-0">
          <div 
            className={cn(
              "transition-all duration-300", 
              expanded ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8 pointer-events-none"
            )}
          >
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={(e) => {
                e.stopPropagation();
                onRemove(exercise.id);
              }}
            >
              <Trash className="h-4 w-4 text-destructive" />
              <span className="sr-only">Remove</span>
            </Button>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full"
            onClick={(e) => {
              e.stopPropagation();
              handleExpandToggle();
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
      
      {expanded && (
        <CardContent className="p-3 pt-0 animate-fade-in">
          <div className="space-y-3">
            {/* Performance metrics section */}
            <div>              
              {sets.length > 0 ? (
                <div className="space-y-2 mb-3">
                  {sets.map((set, index) => (
                    <div 
                      key={set.id}
                      className={`p-2 ${activeSetId === set.id ? 'bg-secondary/80' : 'bg-muted/50'} rounded-md transition-colors relative`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div 
                          className="flex items-center cursor-pointer" 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSetClick(set.id);
                          }}
                        >
                          <span className="text-xs font-medium">Set {index + 1}</span>
                        </div>
                        
                        {/* Delete set button */}
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6 text-destructive/60 hover:text-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveSet(set.id);
                          }}
                        >
                          <Trash className="h-3 w-3" />
                          <span className="sr-only">Remove Set</span>
                        </Button>
                      </div>
                      
                      {/* Display metrics with improved layout */}
                      <div className="grid grid-cols-2 gap-2">
                        {sortMetrics(set.metrics).map(metric => (
                          <div 
                            key={metric.id} 
                            className={`bg-secondary/20 p-2 rounded-md cursor-pointer ${
                              editingMetricId === metric.id 
                              ? 'ring-1 ring-primary' 
                              : ''
                            }`}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (editingMetricId !== metric.id) {
                                handleEditMetric(set.id, metric.id, metric.type, metric.value, metric.unit);
                              }
                            }}
                          >
                            {editingMetricId === metric.id ? (
                              <div className="flex flex-col">
                                {/* First row: Metric name and icon */}
                                <div className="flex items-center mb-2">
                                  {getMetricIcon(metric.type)}
                                  <span className="text-xs font-medium">
                                    {formatMetricWithUnit(metric.type, metric.unit.toLowerCase())}
                                  </span>
                                </div>
                                
                                {/* Second row: Input field and action buttons */}
                                <div className="flex items-center gap-1">
                                  <Input
                                    type="number"
                                    min={0}
                                    step={metric.type === "weight" ? 2.5 : 1}
                                    value={editedMetricValue}
                                    onChange={(e) => setEditedMetricValue(Number(e.target.value))}
                                    className="h-7 text-xs px-2 py-0 flex-grow"
                                    autoFocus
                                    onClick={(e) => e.stopPropagation()}
                                  />
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-6 w-6 flex-shrink-0"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleSaveMetricEdit(set.id, metric.id);
                                    }}
                                  >
                                    <Check className="h-3 w-3" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-6 w-6 flex-shrink-0"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleCancelMetricEdit();
                                    }}
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center">
                                    {getMetricIcon(metric.type)}
                                    <span className="text-xs font-medium">
                                      {formatMetricWithUnit(metric.type, metric.unit.toLowerCase())}
                                    </span>
                                  </div>
                                </div>
                                <div className="mt-1 flex items-center">
                                  <span className="text-sm font-medium">
                                    {metric.value === 0 ? "-" : `${metric.value}`}
                                  </span>
                                </div>
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                      
                    </div>
                  ))}
                </div>
              ) : null}

              {/* Add and copy set buttons */}
              <div className="flex space-x-2 mb-3">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-7 text-xs" 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddEmptySet();
                  }}
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add Set
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-7 text-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopyLastSet();
                  }}
                  disabled={sets.length === 0}
                >
                  <Copy className="h-3 w-3 mr-1" />
                  Copy Previous
                </Button>
              </div>
            </div>
            
            {/* Notes section */}
            <div>
              <h4 className="text-sm font-medium mb-2 text-left">Notes</h4>
              <Textarea
                placeholder="Add notes about this exercise..."
                value={notes}
                onChange={(e) => {
                  setNotes(e.target.value);
                }}
                onBlur={handleSaveNotes}
                className="min-h-[80px] text-sm text-left"
              />
            </div>
            
            {/* Media section */}
            <div>
              <h4 className="text-sm font-medium mb-2 text-left">Media</h4>
              <Button variant="outline" size="sm" className="h-7 text-xs">
                <Image className="h-3 w-3 mr-1" />
                Add photo
              </Button>
            </div>
            
            {/* Save button */}
            <div className="flex justify-center mt-4">
              <Button
                variant="ghost"
                size="sm"
                className="text-xs h-7 flex items-center"
                onClick={(e) => {
                  e.stopPropagation();
                  // Make sure any pending changes are saved
                  handleSaveNotes();
                  handleExpandToggle();
                }}
              >
                <Save className="h-3.5 w-3.5 mr-1" />
                Save & Close
              </Button>
            </div>
          </div>
        </CardContent>
      )}
      
      {/* Exercise Edit Dialog */}
      <Dialog open={isEditingExercise} onOpenChange={setIsEditingExercise}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Exercise</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="exercise-name">Name</Label>
              <Input 
                id="exercise-name" 
                value={editedExerciseName} 
                onChange={(e) => setEditedExerciseName(e.target.value)} 
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="exercise-type">Type</Label>
              <Select 
                value={editedExerciseType} 
                onValueChange={setEditedExerciseType}
              >
                <SelectTrigger id="exercise-type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {getExerciseTypes().map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex justify-end gap-2 pt-4">
              <Button 
                variant="outline" 
                onClick={() => setIsEditingExercise(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleSaveExerciseEdit}>
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default ExerciseListItem;
