
import React, { useState } from "react";
import { Exercise, PerformanceMetric } from "@/lib/mockData";
import { ChevronDown, ChevronUp, Clock, Dumbbell, Hash, StickyNote, Ruler, Timer, Repeat, Clock3, Edit, Image, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface ExerciseItemProps {
  exercise: Exercise;
}

const ExerciseItem: React.FC<ExerciseItemProps> = ({ exercise }) => {
  const [expanded, setExpanded] = useState(false);
  const [editingMetricId, setEditingMetricId] = useState<string | null>(null);
  const [editedMetricValue, setEditedMetricValue] = useState<number>(0);
  const [editedMetricUnit, setEditedMetricUnit] = useState<string>("");

  const toggleExpanded = () => setExpanded(!expanded);

  // Helper to get total reps/weight from sets if available
  const getTotalSets = () => exercise.sets?.length || 0;
  
  // Helper to get rep and weight ranges
  const getRepRange = () => {
    if (!exercise.sets || !exercise.sets.some(set => set.reps > 0)) return null;
    
    const reps = exercise.sets
      .filter(set => set.reps > 0)
      .map(set => set.reps);
    
    const minReps = Math.min(...reps);
    const maxReps = Math.max(...reps);
    
    return minReps === maxReps ? `${minReps} reps` : `${minReps}-${maxReps} reps`;
  };
  
  const getWeightRange = () => {
    if (!exercise.sets || !exercise.sets.some(set => set.weight > 0)) return null;
    
    const weights = exercise.sets
      .filter(set => set.weight > 0)
      .map(set => set.weight);
    
    const minWeight = Math.min(...weights);
    const maxWeight = Math.max(...weights);
    
    return minWeight === maxWeight ? `${minWeight}kg` : `${minWeight}-${maxWeight}kg`;
  };
  
  // Helper to get icon for metric type
  const getMetricIcon = (type: string) => {
    switch (type) {
      case "weight":
        return <Dumbbell className="h-3 w-3 mr-1" />;
      case "distance":
        return <Ruler className="h-3 w-3 mr-1" />;
      case "duration":
        return <Clock className="h-3 w-3 mr-1" />;
      case "repetitions":
        return <Repeat className="h-3 w-3 mr-1" />;
      case "restTime":
        return <Timer className="h-3 w-3 mr-1" />;
      default:
        return <Hash className="h-3 w-3 mr-1" />;
    }
  };

  // Helper to sort metrics by priority
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

  // Function to handle metric edit start
  const handleEditMetric = (metricId: string, currentValue: number, currentUnit: string) => {
    setEditingMetricId(metricId);
    setEditedMetricValue(currentValue);
    setEditedMetricUnit(currentUnit);
  };

  // Function to save edited metric
  const handleSaveMetricEdit = (metricId: string, metricIndex: number, setIndex: number) => {
    // In a real app, you would update the metric in the database
    // For mock data, we'd need to modify the exercise object
    console.log(`Updated metric ${metricId} with value: ${editedMetricValue} ${editedMetricUnit}`);
    setEditingMetricId(null);
  };

  // Check if exercise has notes or media
  const hasNotes = exercise.notes && exercise.notes.trim().length > 0;
  const hasMedia = exercise.media && exercise.media.length > 0;

  // Generate a compact summary of all sets and metrics
  const generateCompactSummary = () => {
    // If there are metrics, use them
    if (exercise.metrics && exercise.metrics.length > 0) {
      // Group metrics by set
      const metricsBySet: { [key: number]: PerformanceMetric[] } = {};
      exercise.metrics.forEach(metric => {
        const setIndex = metric.setIndex || 0;
        if (!metricsBySet[setIndex]) metricsBySet[setIndex] = [];
        metricsBySet[setIndex].push(metric);
      });
      
      return (
        <div className="flex flex-wrap gap-1 mt-1">
          {Object.entries(metricsBySet).map(([setIndex, metrics]) => {
            const sortedMetrics = sortMetrics(metrics);
            return (
              <Badge 
                key={setIndex} 
                variant="outline" 
                className="text-xs flex items-center"
              >
                <span className="mr-1">Set {parseInt(setIndex) + 1}:</span>
                {sortedMetrics.map((metric, idx) => (
                  <span key={metric.id} className="flex items-center">
                    {idx > 0 && " · "}
                    {getMetricIcon(metric.type)}
                    {metric.value} {metric.unit}
                  </span>
                ))}
              </Badge>
            );
          })}
        </div>
      );
    }
    
    // If there are no metrics but there are sets, show the rep/weight info directly
    if (exercise.sets && exercise.sets.length > 0) {
      return (
        <div className="flex flex-wrap gap-1 mt-1">
          {getRepRange() && (
            <Badge variant="outline" className="text-xs flex items-center">
              <Repeat className="h-3 w-3 mr-1" />
              {getRepRange()}
            </Badge>
          )}
          {getWeightRange() && (
            <Badge variant="outline" className="text-xs flex items-center">
              <Dumbbell className="h-3 w-3 mr-1" />
              {getWeightRange()}
            </Badge>
          )}
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className="mb-3 rounded-md bg-white/90 border border-border shadow-sm overflow-hidden animate-slide-up animation-delay-100">
      <div 
        className="p-3 cursor-pointer flex items-center justify-between"
        onClick={toggleExpanded}
      >
        <div className="flex-1">
          <h4 className="font-medium">{exercise.name}</h4>
          <div className="flex flex-wrap items-center text-sm text-muted-foreground mt-1 gap-2">
            {getTotalSets() > 0 && (
              <div className="flex items-center">
                <Hash className="h-3 w-3 mr-1" />
                <span>{getTotalSets()} sets</span>
              </div>
            )}
            {getRepRange() && (
              <div className="flex items-center">
                <Repeat className="h-3 w-3 mr-1" />
                <span>{getRepRange()}</span>
              </div>
            )}
            {getWeightRange() && (
              <div className="flex items-center">
                <Dumbbell className="h-3 w-3 mr-1" />
                <span>{getWeightRange()}</span>
              </div>
            )}
            {exercise.duration > 0 && (
              <div className="flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                <span>{exercise.duration} min</span>
              </div>
            )}
            {hasNotes && (
              <div className="flex items-center">
                <StickyNote className="h-3 w-3 mr-1" />
              </div>
            )}
            {hasMedia && (
              <div className="flex items-center">
                <Image className="h-3 w-3 mr-1" />
              </div>
            )}
          </div>
          
          {/* Compact summary of all sets */}
          {!expanded && generateCompactSummary()}
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

      {expanded && (
        <div className="p-3 pt-0 border-t border-border/50 animate-slide-down">
          {/* Performance metrics */}
          {exercise.metrics && exercise.metrics.length > 0 && (
            <div className="mb-3">
              <div className="flex items-center text-sm font-medium mb-2">
                <Dumbbell className="h-4 w-4 mr-1.5" />
                <span>Performance</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {sortMetrics(exercise.metrics).map((metric, index) => (
                  <div key={index} className="bg-muted/50 p-2 rounded-md">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">Set {(metric.setIndex || 0) + 1}</Badge>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditMetric(metric.id, metric.value, metric.unit);
                        }}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                    </div>
                    {editingMetricId === metric.id ? (
                      <div className="mt-1.5 space-y-2">
                        <div className="flex items-end gap-2">
                          <div className="flex-1">
                            <Label htmlFor={`metric-value-${metric.id}`} className="text-xs">Value</Label>
                            <Input
                              id={`metric-value-${metric.id}`}
                              type="number"
                              min={0}
                              step={metric.type === "weight" ? 2.5 : 1}
                              value={editedMetricValue}
                              onChange={(e) => setEditedMetricValue(Number(e.target.value))}
                              className="h-7 text-sm"
                            />
                          </div>
                          
                          {metric.type !== "repetitions" && (
                            <div className="flex-1">
                              <Label htmlFor={`metric-unit-${metric.id}`} className="text-xs">Unit</Label>
                              <Select 
                                value={editedMetricUnit} 
                                onValueChange={setEditedMetricUnit}
                              >
                                <SelectTrigger id={`metric-unit-${metric.id}`} className="h-7 text-sm">
                                  <SelectValue placeholder="Unit" />
                                </SelectTrigger>
                                <SelectContent>
                                  {metric.type === "weight" && (
                                    <>
                                      <SelectItem value="kg">kg</SelectItem>
                                      <SelectItem value="lb">lb</SelectItem>
                                    </>
                                  )}
                                  {metric.type === "distance" && (
                                    <>
                                      <SelectItem value="km">km</SelectItem>
                                      <SelectItem value="miles">miles</SelectItem>
                                    </>
                                  )}
                                  {metric.type === "duration" && (
                                    <>
                                      <SelectItem value="seconds">seconds</SelectItem>
                                      <SelectItem value="minutes">minutes</SelectItem>
                                      <SelectItem value="hours">hours</SelectItem>
                                    </>
                                  )}
                                  {metric.type === "restTime" && (
                                    <>
                                      <SelectItem value="seconds">seconds</SelectItem>
                                      <SelectItem value="minutes">minutes</SelectItem>
                                    </>
                                  )}
                                </SelectContent>
                              </Select>
                            </div>
                          )}
                          
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-7 px-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSaveMetricEdit(metric.id, index, metric.setIndex || 0);
                            }}
                          >
                            Save
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-1.5 flex items-center">
                        {getMetricIcon(metric.type)}
                        <span className="text-sm">
                          {metric.value} {metric.unit}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Display sets if there are no metrics */}
          {(!exercise.metrics || exercise.metrics.length === 0) && exercise.sets && exercise.sets.length > 0 && (
            <div className="mb-3">
              <div className="flex items-center text-sm font-medium mb-2">
                <Hash className="h-4 w-4 mr-1.5" />
                <span>Sets</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {exercise.sets.map((set, index) => (
                  <div key={index} className="bg-muted/50 p-2 rounded-md">
                    <Badge variant="outline" className="text-xs mb-1">Set {index + 1}</Badge>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center">
                        <Repeat className="h-3 w-3 mr-1" />
                        <span>{set.reps} reps</span>
                      </div>
                      {set.weight > 0 && (
                        <div className="flex items-center">
                          <Dumbbell className="h-3 w-3 mr-1" />
                          <span>{set.weight}kg</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {exercise.notes && (
            <div className="mb-3">
              <div className="flex items-center text-sm font-medium mb-1">
                <StickyNote className="h-4 w-4 mr-1.5" />
                <span>Notes</span>
              </div>
              <p className="text-sm text-muted-foreground">{exercise.notes}</p>
            </div>
          )}

          {exercise.media && exercise.media.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Media</p>
              <div className="grid grid-cols-2 gap-2">
                {exercise.media.map((url, index) => (
                  <div 
                    key={index} 
                    className="rounded-md overflow-hidden aspect-video border border-border relative"
                  >
                    <img
                      src={url}
                      alt={`${exercise.name} media ${index + 1}`}
                      className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Close button to collapse section */}
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
      )}
    </div>
  );
};

export default ExerciseItem;
