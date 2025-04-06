
/**
 * ExerciseItem Component
 * 
 * This component displays exercise details within a workout card.
 * It shows basic information about the exercise and allows users to
 * expand to see additional details and performance metrics.
 * 
 * Features:
 * - Collapsible exercise display
 * - Shows summary of sets, reps, weight, duration
 * - Displays notes and media attachments
 * - Allows inline editing of performance metrics with highlighting
 * 
 * This component is used to display exercises within the WorkoutCard component
 * on the home page view.
 */

import React, { useState } from "react";
import { Exercise, PerformanceMetric } from "@/lib/mockData";
import { ChevronDown, ChevronUp, Clock, Dumbbell, Hash, StickyNote, Ruler, Timer, Repeat, Edit, Image, Save } from "lucide-react";
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
      "distance": 2,
      "duration": 3,
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

  // Generate an enhanced summary of metrics across all sets
  const generateEnhancedSummary = () => {
    if (!exercise.metrics || exercise.metrics.length === 0) return null;
    
    // Group metrics by type
    const metricsByType: { [key: string]: number[] } = {};
    
    exercise.metrics.forEach(metric => {
      if (!metricsByType[metric.type]) metricsByType[metric.type] = [];
      metricsByType[metric.type].push(metric.value);
    });
    
    // Ordered display of metrics
    const orderedTypes = ["weight", "distance", "duration", "repetitions", "restTime"];
    
    return (
      <div className="flex flex-wrap items-center text-sm text-muted-foreground mt-1 gap-2">
        {/* Always show sets first */}
        {getTotalSets() > 0 && (
          <div className="flex items-center">
            <Hash className="h-3 w-3 mr-1" />
            <span>{getTotalSets()} sets</span>
          </div>
        )}
        
        {/* Then show other metrics in the specified order */}
        {orderedTypes.map(type => {
          const values = metricsByType[type];
          if (!values || values.length === 0) return null;
          
          const min = Math.min(...values);
          const max = Math.max(...values);
          
          switch(type) {
            case "weight":
              return (
                <div key={type} className="flex items-center">
                  <Dumbbell className="h-3 w-3 mr-1" />
                  <span>
                    {min === max ? `${min}kg` : `${min}-${max}kg`}
                  </span>
                </div>
              );
              
            case "distance":
              return (
                <div key={type} className="flex items-center">
                  <Ruler className="h-3 w-3 mr-1" />
                  <span>
                    {min === max ? 
                      `${min}${values.length > 0 ? exercise.metrics.find(m => m.type === type)?.unit || 'km' : 'km'}` : 
                      `${min}-${max}${values.length > 0 ? exercise.metrics.find(m => m.type === type)?.unit || 'km' : 'km'}`
                    }
                  </span>
                </div>
              );
              
            case "duration":
              return (
                <div key={type} className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>
                    {min === max ? 
                      `${min} ${values.length > 0 ? exercise.metrics.find(m => m.type === type)?.unit || 'sec' : 'sec'}` : 
                      `${min}-${max} ${values.length > 0 ? exercise.metrics.find(m => m.type === type)?.unit || 'sec' : 'sec'}`
                    }
                  </span>
                </div>
              );
              
            case "repetitions":
              return (
                <div key={type} className="flex items-center">
                  <Repeat className="h-3 w-3 mr-1" />
                  <span>
                    {min === max ? `${min} reps` : `${min}-${max} reps`}
                  </span>
                </div>
              );
              
            case "restTime":
              return (
                <div key={type} className="flex items-center">
                  <Timer className="h-3 w-3 mr-1" />
                  <span>
                    {min === max ? 
                      `${min} ${values.length > 0 ? exercise.metrics.find(m => m.type === type)?.unit || 'sec' : 'sec'} rest` : 
                      `${min}-${max} ${values.length > 0 ? exercise.metrics.find(m => m.type === type)?.unit || 'sec' : 'sec'} rest`
                    }
                  </span>
                </div>
              );
              
            default:
              return null;
          }
        })}
        
        {/* Show notes and media indicators */}
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
    );
  };

  // Generate a compact summary of all sets and metrics (existing functionality)
  const generateCompactSummary = () => {
    if (!exercise.metrics || exercise.metrics.length === 0) return null;
    
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
  };

  return (
    <div className="mb-3 rounded-md bg-white/90 border border-border shadow-sm overflow-hidden animate-slide-up animation-delay-100">
      <div 
        className="p-3 cursor-pointer flex items-center justify-between"
        onClick={toggleExpanded}
      >
        <div className="flex-1">
          <h4 className="font-medium">{exercise.name}</h4>
          
          {/* Use the enhanced summary when collapsed */}
          {!expanded && generateEnhancedSummary()}
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
                  <div 
                    key={index} 
                    className={`bg-muted/50 p-2 rounded-md transition-colors duration-200 ${
                      editingMetricId === metric.id ? 'ring-2 ring-primary bg-secondary/20' : ''
                    }`}
                  >
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

                    {/* Metric display/edit section */}
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
                              autoFocus
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
          
          {/* Notes section */}
          {exercise.notes && (
            <div className="mb-3">
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
          
          {/* Save button to collapse section */}
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
              <Save className="h-3.5 w-3.5 mr-1" />
              Save & Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExerciseItem;
