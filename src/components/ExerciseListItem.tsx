
import React, { useState } from "react";
import { Trash, ChevronDown, ChevronUp, Image, Edit, Plus, Copy, X, Pen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Exercise } from "@/lib/mockData";
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
import { useIsMobile } from "@/hooks/use-mobile";
import PerformanceMetricForm, { PerformanceMetric } from "./PerformanceMetricForm";

interface ExerciseListItemProps {
  exercise: Exercise;
  onRemove: (id: string) => void;
}

interface SetData {
  id: string;
  metrics: PerformanceMetric[];
}

const ExerciseListItem: React.FC<ExerciseListItemProps> = ({ 
  exercise,
  onRemove
}) => {
  const [expanded, setExpanded] = useState(false);
  const [notes, setNotes] = useState(exercise.notes || "");
  const [sets, setSets] = useState<SetData[]>([]);
  const [showAddMetric, setShowAddMetric] = useState(false);
  const [activeSetId, setActiveSetId] = useState<string | null>(null);
  const [newMetricType, setNewMetricType] = useState("weight");
  const [newMetricValue, setNewMetricValue] = useState<number>(0);
  const [newMetricUnit, setNewMetricUnit] = useState("kg");
  const [editingMetricId, setEditingMetricId] = useState<string | null>(null);
  const isMobile = useIsMobile();
  
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
    // Clear any metric editing when changing sets
    setEditingMetricId(null);
  };
  
  // Start editing a specific metric
  const handleEditMetric = (setId: string, metricId: string) => {
    // Set the active set first
    setActiveSetId(setId);
    
    // Find the metric to edit
    const set = sets.find(s => s.id === setId);
    const metric = set?.metrics.find(m => m.id === metricId);
    
    if (metric) {
      // Set the current values in the form
      setNewMetricType(metric.type);
      setNewMetricValue(metric.value);
      setNewMetricUnit(metric.unit);
      // Set this metric as being edited
      setEditingMetricId(metricId);
    }
  };
  
  // Add metric to an existing set
  const handleAddMetricToSet = (setId: string) => {
    if (!newMetricType || newMetricValue === undefined) return;
    
    if (editingMetricId) {
      // Update existing metric
      setSets(prevSets => 
        prevSets.map(set => 
          set.id === setId 
            ? { 
                ...set, 
                metrics: set.metrics.map(metric => 
                  metric.id === editingMetricId 
                    ? {
                        ...metric,
                        type: newMetricType,
                        value: newMetricValue,
                        unit: newMetricUnit
                      }
                    : metric
                )
              }
            : set
        )
      );
      
      // Reset editing state
      setEditingMetricId(null);
    } else {
      // Add new metric
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
    }
    
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
    
    // Clear editing state if this metric was being edited
    if (editingMetricId === metricId) {
      setEditingMetricId(null);
    }
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
  
  const handleCancelEdit = () => {
    setEditingMetricId(null);
    setNewMetricValue(0);
  };

  // Format metric for display
  const formatMetric = (metric: PerformanceMetric) => {
    return `${metric.value} ${metric.unit}`;
  };

  const generateId = () => Math.random().toString(36).substring(2, 11);

  return (
    <Card className="overflow-hidden animate-scale-in">
      <div className="p-3 flex items-center justify-between cursor-pointer" onClick={() => setExpanded(!expanded)}>
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
                          {set.metrics.map(metric => (
                            <Badge 
                              key={metric.id} 
                              variant="secondary" 
                              className="flex items-center gap-1 capitalize pr-1"
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
                              {set.metrics.map(metric => (
                                <Badge 
                                  key={metric.id} 
                                  variant={editingMetricId === metric.id ? "default" : "secondary"}
                                  className="flex items-center gap-1 capitalize pr-1"
                                >
                                  <span>{metric.type}: {formatMetric(metric)}</span>
                                  <div className="flex items-center">
                                    {editingMetricId !== metric.id && (
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-4 w-4"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleEditMetric(set.id, metric.id);
                                        }}
                                      >
                                        <Pen className="h-2.5 w-2.5" />
                                      </Button>
                                    )}
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-4 w-4"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleRemoveMetric(set.id, metric.id);
                                      }}
                                    >
                                      <X className="h-2.5 w-2.5" />
                                    </Button>
                                  </div>
                                </Badge>
                              ))}
                            </div>
                          )}
                          
                          {/* Inline metric editor */}
                          <div className={`${isMobile ? 'space-y-3' : 'flex items-end gap-2'} mt-2`}>
                            <div className="space-y-1 flex-1">
                              <Label htmlFor={`metric-type-${set.id}`} className="text-xs">Type</Label>
                              <Select 
                                value={newMetricType} 
                                onValueChange={handleMetricTypeChange}
                              >
                                <SelectTrigger id={`metric-type-${set.id}`} className="h-8">
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
                            
                            <div className="space-y-1 flex-1">
                              <Label htmlFor={`metric-value-${set.id}`} className="text-xs">Value</Label>
                              <Input
                                id={`metric-value-${set.id}`}
                                type="number"
                                min={0}
                                step={newMetricType === "weight" ? 2.5 : 1}
                                value={newMetricValue}
                                onChange={(e) => setNewMetricValue(Number(e.target.value))}
                                className="h-8"
                              />
                            </div>
                            
                            {newMetricType !== "repetitions" && (
                              <div className="space-y-1 flex-1">
                                <Label htmlFor={`metric-unit-${set.id}`} className="text-xs">Unit</Label>
                                <Select 
                                  value={newMetricUnit} 
                                  onValueChange={setNewMetricUnit}
                                >
                                  <SelectTrigger id={`metric-unit-${set.id}`} className="h-8">
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
                            
                            <div className={`flex ${isMobile ? 'justify-end' : 'items-center'} gap-1 ${isMobile ? 'mt-2' : ''}`}>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-8"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAddMetricToSet(set.id);
                                }}
                              >
                                {editingMetricId ? 'Update' : <Plus className="h-3 w-3" />}
                              </Button>
                              
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-8"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (editingMetricId) {
                                    handleCancelEdit();
                                  } else {
                                    setActiveSetId(null);
                                  }
                                }}
                              >
                                <X className="h-3 w-3" />
                                <span className="sr-only">Cancel</span>
                              </Button>
                            </div>
                          </div>
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
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default ExerciseListItem;
