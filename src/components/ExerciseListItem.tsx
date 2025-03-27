import React, { useState, useEffect } from "react";
import { Trash, ChevronDown, ChevronUp, Image, Edit, Plus, Copy, X, Check, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Exercise, getExerciseTypes, saveExercise } from "@/lib/mockData";
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
import PerformanceMetricForm, { PerformanceMetric } from "./PerformanceMetricForm";
import { toast } from "sonner";

interface ExerciseListItemProps {
  exercise: Exercise;
  onRemove: (id: string) => void;
  onExerciseUpdate?: (updatedExercise: Exercise) => void;
}

interface SetData {
  id: string;
  metrics: PerformanceMetric[];
}

const ExerciseListItem: React.FC<ExerciseListItemProps> = ({ 
  exercise,
  onRemove,
  onExerciseUpdate
}) => {
  const [expanded, setExpanded] = useState(false);
  const [notes, setNotes] = useState(exercise.notes || "");
  const [sets, setSets] = useState<SetData[]>([]);
  const [showAddMetric, setShowAddMetric] = useState(false);
  const [activeSetId, setActiveSetId] = useState<string | null>(null);
  const [newMetricType, setNewMetricType] = useState("weight");
  const [newMetricValue, setNewMetricValue] = useState<number>(0);
  const [newMetricUnit, setNewMetricUnit] = useState("kg");
  const [isEditingExercise, setIsEditingExercise] = useState(false);
  const [editedExerciseName, setEditedExerciseName] = useState(exercise.name);
  const [editedExerciseType, setEditedExerciseType] = useState(exercise.type);
  
  // For editing metrics
  const [editingMetricId, setEditingMetricId] = useState<string | null>(null);
  const [editedMetricValue, setEditedMetricValue] = useState<number>(0);
  const [editedMetricType, setEditedMetricType] = useState<string>("");
  const [editedMetricUnit, setEditedMetricUnit] = useState<string>("");
  
  useEffect(() => {
    // Set notes from the exercise
    setNotes(exercise.notes || "");
    
    // Convert exercise sets to SetData format if available
    if (exercise.sets && exercise.sets.length > 0) {
      const convertedSets: SetData[] = exercise.sets.map(set => {
        // Create metrics from set data
        const metrics: PerformanceMetric[] = [];
        
        // If set has reps, add as a metric
        if (set.reps > 0) {
          metrics.push({
            id: generateId(),
            type: "repetitions",
            value: set.reps,
            unit: "reps"
          });
        }
        
        // If set has weight, add as a metric
        if (set.weight > 0) {
          metrics.push({
            id: generateId(),
            type: "weight",
            value: set.weight,
            unit: "kg"
          });
        }
        
        return {
          id: generateId(),
          metrics
        };
      });
      
      setSets(convertedSets);
    }
  }, [exercise]);
  
  // Add a new empty set directly
  const handleAddEmptySet = () => {
    const newSetId = generateId();
    const newSet: SetData = {
      id: newSetId,
      metrics: []
    };
    setSets([...sets, newSet]);
    // Automatically activate the new set for editing
    setActiveSetId(newSetId);
  };
  
  // Set a set as active for editing
  const handleSetClick = (setId: string) => {
    setActiveSetId(activeSetId === setId ? null : setId);
  };
  
  // Add metric to an existing set
  const handleAddMetricToSet = (setId: string) => {
    if (!newMetricType || newMetricValue === undefined) return;
    
    const newMetric: PerformanceMetric = {
      id: generateId(),
      type: newMetricType,
      value: newMetricValue,
      unit: newMetricUnit
    };
    
    setSets(prevSets => 
      prevSets.map(set => 
        set.id === setId 
          ? { ...set, metrics: [...set.metrics, newMetric] }
          : set
      )
    );
    
    // Reset inputs
    setNewMetricValue(0);
  };
  
  // Update unit based on selected metric type
  const handleMetricTypeChange = (type: string) => {
    setNewMetricType(type);
    
    // Set default unit based on type
    switch (type) {
      case "weight":
        setNewMetricUnit("kg");
        break;
      case "distance":
        setNewMetricUnit("km");
        break;
      case "duration":
        setNewMetricUnit("minutes");
        break;
      case "repetitions":
        setNewMetricUnit("reps");
        break;
      case "restTime":
        setNewMetricUnit("seconds");
        break;
    }
  };
  
  // Original method for adding metrics via the form
  const handleAddMetric = (metric: PerformanceMetric) => {
    if (activeSetId) {
      // Adding a metric to an existing set
      setSets(prevSets => 
        prevSets.map(set => 
          set.id === activeSetId 
            ? { ...set, metrics: [...set.metrics, metric] }
            : set
        )
      );
    } else {
      // Creating a new set with the metric
      const newSet: SetData = {
        id: generateId(),
        metrics: [metric]
      };
      setSets([...sets, newSet]);
    }
    setShowAddMetric(false);
    setActiveSetId(null);
  };

  const handleRemoveSet = (setId: string) => {
    setSets(sets.filter(set => set.id !== setId));
    if (activeSetId === setId) {
      setActiveSetId(null);
    }
  };
  
  const handleRemoveMetric = (setId: string, metricId: string) => {
    setSets(prevSets => 
      prevSets.map(set => 
        set.id === setId 
          ? { 
              ...set, 
              metrics: set.metrics.filter(metric => metric.id !== metricId) 
            }
          : set
      )
    );
  };

  const handleDuplicateSet = (setToDuplicate: SetData) => {
    const duplicatedSet: SetData = {
      id: generateId(),
      metrics: setToDuplicate.metrics.map(metric => ({
        ...metric,
        id: generateId()
      }))
    };
    setSets([...sets, duplicatedSet]);
  };

  // Format metric for display
  const formatMetric = (metric: PerformanceMetric) => {
    return `${metric.value} ${metric.unit}`;
  };

  const generateId = () => Math.random().toString(36).substring(2, 11);

  // Function to handle metric edit start
  const handleEditMetric = (setId: string, metricId: string, currentType: string, currentValue: number, currentUnit: string) => {
    setEditingMetricId(metricId);
    setEditedMetricType(currentType);
    setEditedMetricValue(currentValue);
    setEditedMetricUnit(currentUnit);
  };
  
  // Function to save edited metric
  const handleSaveMetricEdit = (setId: string, metricId: string) => {
    setSets(prevSets => 
      prevSets.map(set => 
        set.id === setId 
          ? {
              ...set,
              metrics: set.metrics.map(metric => 
                metric.id === metricId
                  ? { ...metric, type: editedMetricType, value: editedMetricValue, unit: editedMetricUnit }
                  : metric
              )
            }
          : set
      )
    );
    
    setEditingMetricId(null);
  };

  // Function to sort metrics by priority
  const sortMetrics = (metrics: PerformanceMetric[]) => {
    const priorityOrder: Record<string, number> = {
      "weight": 1,
      "duration": 2,
      "distance": 3,
      "repetitions": 4,
      "restTime": 5
    };
    
    return [...metrics].sort((a, b) => 
      (priorityOrder[a.type] || 99) - (priorityOrder[b.type] || 99)
    );
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

  return (
    <Card className="overflow-hidden animate-scale-in">
      <div 
        className="p-3 flex items-center justify-between cursor-pointer" 
        onClick={() => setExpanded(!expanded)}
        onDoubleClick={() => setIsEditingExercise(true)}
      >
        <div className="flex items-center gap-2">
          <span className="font-medium">{exercise.name}</span>
          <Badge variant="outline" className="text-xs">
            {exercise.type}
          </Badge>
        </div>
        
        <div className="flex items-center gap-1">
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
          
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full"
            onClick={(e) => {
              e.stopPropagation();
              setExpanded(!expanded);
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
        <CardContent className="pt-0 pb-3 animate-fade-in">
          <div className="space-y-3">
            {/* Performance metrics section */}
            <div>
              <h4 className="text-sm font-medium mb-2">Performance</h4>
              
              {sets.length > 0 ? (
                <div className="space-y-2 mb-3">
                  {sets.map((set, index) => (
                    <div 
                      key={set.id}
                      className={`p-2 ${activeSetId === set.id ? 'bg-secondary/80' : 'bg-muted/50'} rounded-md transition-colors`}
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
                          {activeSetId !== set.id && (
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-6 w-6 ml-1"
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDuplicateSet(set);
                            }}
                          >
                            <Copy className="h-3 w-3" />
                            <span className="sr-only">Duplicate</span>
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveSet(set.id);
                            }}
                          >
                            <Trash className="h-3 w-3 text-destructive" />
                            <span className="sr-only">Remove</span>
                          </Button>
                        </div>
                      </div>
                      
                      {activeSetId !== set.id ? (
                        // Display-only view of metrics
                        <div className="flex flex-wrap gap-2">
                          {sortMetrics(set.metrics).map(metric => (
                            <Badge 
                              key={metric.id} 
                              variant="secondary" 
                              className="flex items-center gap-1 capitalize pr-1"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditMetric(set.id, metric.id, metric.type, metric.value, metric.unit);
                              }}
                            >
                              <span>{metric.type}: {formatMetric(metric)}</span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-4 w-4 ml-1"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemoveMetric(set.id, metric.id);
                                }}
                              >
                                <X className="h-2.5 w-2.5" />
                              </Button>
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        // Edit mode - show metrics and inline editor
                        <div>
                          {/* Show existing metrics */}
                          {set.metrics.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-3">
                              {sortMetrics(set.metrics).map(metric => (
                                editingMetricId === metric.id ? (
                                  <div key={metric.id} className="flex flex-wrap items-end gap-2 w-full mt-2 bg-secondary/30 p-2 rounded-sm">
                                    <div className="w-full sm:w-auto flex-1">
                                      <Label htmlFor={`edit-metric-type-${metric.id}`} className="text-xs">Type</Label>
                                      <Select 
                                        value={editedMetricType} 
                                        onValueChange={setEditedMetricType}
                                      >
                                        <SelectTrigger id={`edit-metric-type-${metric.id}`} className="h-7 text-xs">
                                          <SelectValue placeholder="Type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="weight">Weight</SelectItem>
                                          <SelectItem value="distance">Distance</SelectItem>
                                          <SelectItem value="duration">Duration</SelectItem>
                                          <SelectItem value="repetitions">Repetitions</SelectItem>
                                          <SelectItem value="restTime">Rest Time</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    
                                    <div className="w-full sm:w-auto flex-1">
                                      <Label htmlFor={`edit-metric-value-${metric.id}`} className="text-xs">Value</Label>
                                      <Input
                                        id={`edit-metric-value-${metric.id}`}
                                        type="number"
                                        min={0}
                                        step={editedMetricType === "weight" ? 2.5 : 1}
                                        value={editedMetricValue}
                                        onChange={(e) => setEditedMetricValue(Number(e.target.value))}
                                        className="h-7 text-xs"
                                      />
                                    </div>
                                    
                                    {editedMetricType !== "repetitions" && (
                                      <div className="w-full sm:w-auto flex-1">
                                        <Label htmlFor={`edit-metric-unit-${metric.id}`} className="text-xs">Unit</Label>
                                        <Select 
                                          value={editedMetricUnit} 
                                          onValueChange={setEditedMetricUnit}
                                        >
                                          <SelectTrigger id={`edit-metric-unit-${metric.id}`} className="h-7 text-xs">
                                            <SelectValue placeholder="Unit" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            {editedMetricType === "weight" && (
                                              <>
                                                <SelectItem value="kg">kg</SelectItem>
                                                <SelectItem value="lb">lb</SelectItem>
                                              </>
                                            )}
                                            {editedMetricType === "distance" && (
                                              <>
                                                <SelectItem value="km">km</SelectItem>
                                                <SelectItem value="miles">miles</SelectItem>
                                              </>
                                            )}
                                            {editedMetricType === "duration" && (
                                              <>
                                                <SelectItem value="seconds">seconds</SelectItem>
                                                <SelectItem value="minutes">minutes</SelectItem>
                                                <SelectItem value="hours">hours</SelectItem>
                                              </>
                                            )}
                                            {editedMetricType === "restTime" && (
                                              <>
                                                <SelectItem value="seconds">seconds</SelectItem>
                                                <SelectItem value="minutes">minutes</SelectItem>
                                              </>
                                            )}
                                          </SelectContent>
                                        </Select>
                                      </div>
                                    )}
                                    
                                    <div className="flex items-center gap-1 mt-auto">
                                      <Button 
                                        variant="outline" 
                                        size="sm" 
                                        className="h-7 px-2"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleSaveMetricEdit(set.id, metric.id);
                                        }}
                                      >
                                        <Check className="h-2.5 w-2.5 mr-1" />
                                        Update
                                      </Button>
                                      
                                      <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        className="h-7 px-2"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setEditingMetricId(null);
                                        }}
                                      >
                                        <X className="h-2.5 w-2.5" />
                                      </Button>
                                    </div>
                                  </div>
                                ) : (
                                  <Badge 
                                    key={metric.id} 
                                    variant="secondary" 
                                    className="flex items-center gap-1 capitalize pr-1"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleEditMetric(set.id, metric.id, metric.type, metric.value, metric.unit);
                                    }}
                                  >
                                    <span>{metric.type}: {formatMetric(metric)}</span>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-4 w-4 ml-1"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleRemoveMetric(set.id, metric.id);
                                      }}
                                    >
                                      <X className="h-2.5 w-2.5" />
                                    </Button>
                                  </Badge>
                                )
                              ))}
                            </div>
                          )}
                          
                          {/* Only show inline metric editor if no metric is being edited */}
                          {!editingMetricId && (
                            <div className="grid grid-cols-3 sm:flex sm:flex-wrap sm:items-end gap-2 mt-2">
                              <div className="col-span-1">
                                <Label htmlFor={`metric-type-${set.id}`} className="text-xs">Type</Label>
                                <Select 
                                  value={newMetricType} 
                                  onValueChange={handleMetricTypeChange}
                                >
                                  <SelectTrigger id={`metric-type-${set.id}`} className="h-7 text-xs">
                                    <SelectValue placeholder="Type" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="weight">Weight</SelectItem>
                                    <SelectItem value="distance">Distance</SelectItem>
                                    <SelectItem value="duration">Duration</SelectItem>
                                    <SelectItem value="repetitions">Repetitions</SelectItem>
                                    <SelectItem value="restTime">Rest Time</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              
                              <div className="col-span-1">
                                <Label htmlFor={`metric-value-${set.id}`} className="text-xs">Value</Label>
                                <Input
                                  id={`metric-value-${set.id}`}
                                  type="number"
                                  min={0}
                                  step={newMetricType === "weight" ? 2.5 : 1}
                                  value={newMetricValue}
                                  onChange={(e) => setNewMetricValue(Number(e.target.value))}
                                  className="h-7 text-xs"
                                />
                              </div>
                              
                              {newMetricType !== "repetitions" && (
                                <div className="col-span-1">
                                  <Label htmlFor={`metric-unit-${set.id}`} className="text-xs">Unit</Label>
                                  <Select 
                                    value={newMetricUnit} 
                                    onValueChange={setNewMetricUnit}
                                  >
                                    <SelectTrigger id={`metric-unit-${set.id}`} className="h-7 text-xs">
                                      <SelectValue placeholder="Unit" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {newMetricType === "weight" && (
                                        <>
                                          <SelectItem value="kg">kg</SelectItem>
                                          <SelectItem value="lb">lb</SelectItem>
                                        </>
                                      )}
                                      {newMetricType === "distance" && (
                                        <>
                                          <SelectItem value="km">km</SelectItem>
                                          <SelectItem value="miles">miles</SelectItem>
                                        </>
                                      )}
                                      {newMetricType === "duration" && (
                                        <>
                                          <SelectItem value="seconds">seconds</SelectItem>
                                          <SelectItem value="minutes">minutes</SelectItem>
                                          <SelectItem value="hours">hours</SelectItem>
                                        </>
                                      )}
                                      {newMetricType === "restTime" && (
                                        <>
                                          <SelectItem value="seconds">seconds</SelectItem>
                                          <SelectItem value="minutes">minutes</SelectItem>
                                        </>
                                      )}
                                    </SelectContent>
                                  </Select>
                                </div>
                              )}
                              
                              <div className="col-span-3 flex justify-between mt-2 sm:mt-0 sm:ml-auto">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="h-7 px-2"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleAddMetricToSet(set.id);
                                  }}
                                >
                                  <Plus className="h-2.5 w-2.5 mr-1" />
                                  Add
                                </Button>
                                
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-7 px-2 ml-2"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveSetId(null);
                                  }}
                                >
                                  <X className="h-2.5 w-2.5" />
                                  Done
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : null}

              {!activeSetId && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-7 text-xs mb-3" 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddEmptySet();
                  }}
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add set
                </Button>
              )}
            </div>
            
            {/* Notes section */}
            <div>
              <h4 className="text-sm font-medium mb-2">Notes</h4>
              <Textarea
                placeholder="Add notes about this exercise..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="min-h-[80px] text-sm"
              />
            </div>
            
            {/* Media section */}
            <div>
              <h4 className="text-sm font-medium mb-2">Media</h4>
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
                  setExpanded(false);
                }}
              >
                <X className="h-3.5 w-3.5 mr-1" />
                Close
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
