
import React, { useState, useEffect } from "react";
import { Exercise } from "@/lib/mockData";
import { 
  ChevronDown, 
  ChevronUp, 
  Clock, 
  Dumbbell, 
  Hash, 
  StickyNote, 
  Ruler, 
  Timer, 
  Repeat, 
  Image
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { generateExerciseSummary } from "@/lib/exerciseUtils";
import { cn } from "@/lib/utils";

interface ExerciseItemProps {
  exercise: Exercise;
}

const ExerciseItem: React.FC<ExerciseItemProps> = ({ exercise }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => setExpanded(!expanded);

  // Helper to get total sets
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

  // Format the metric type for display
  const formatMetricName = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1).replace(/([A-Z])/g, ' $1');
  };

  // Format metric with unit for display
  const formatMetricWithUnit = (type: string, unit: string) => {
    const name = formatMetricName(type);
    return `${name} (${unit})`;
  };

  // Check if exercise has notes or media
  const hasNotes = exercise.notes && exercise.notes.trim().length > 0;
  const hasMedia = exercise.media && exercise.media.length > 0;

  // Collect all metrics from all sets
  const collectAllMetrics = () => {
    if (!exercise.sets || exercise.sets.length === 0) {
      return { metricsByType: {}, unitsByType: {} };
    }

    const metricsByType: Record<string, number[]> = {};
    const unitsByType: Record<string, string> = {};

    exercise.sets.forEach(set => {
      if (set.metrics && set.metrics.length > 0) {
        set.metrics.forEach(metric => {
          if (!metricsByType[metric.type]) {
            metricsByType[metric.type] = [];
          }
          metricsByType[metric.type].push(metric.value);
          unitsByType[metric.type] = metric.unit;
        });
      }
    });

    return { metricsByType, unitsByType };
  };

  // Generate an enhanced summary showing ranges for each metric type
  const generateEnhancedSummary = () => {
    const { metricsByType, unitsByType } = collectAllMetrics();
    
    // Check if we have any metrics to show
    const hasMetrics = metricsByType && Object.keys(metricsByType).length > 0;
    
    // If no metrics but we have other data, show that instead
    if (!hasMetrics) {
      if (hasNotes || hasMedia || getTotalSets() > 0) {
        return (
          <div className="flex flex-wrap items-center text-sm text-muted-foreground mt-1 gap-2">
            {getTotalSets() > 0 && (
              <div className="flex items-center">
                <Hash className="h-3 w-3 mr-1" />
                <span>{getTotalSets()} sets</span>
              </div>
            )}
            
            {hasNotes && (
              <div className="flex items-center">
                <StickyNote className="h-3 w-3 mr-1" />
                <span>Notes</span>
              </div>
            )}
            
            {hasMedia && (
              <div className="flex items-center">
                <Image className="h-3 w-3 mr-1" />
                <span>Media</span>
              </div>
            )}
          </div>
        );
      }
      
      // If no data at all, show a minimal indicator
      return (
        <div className="text-xs text-muted-foreground mt-1">
          No performance data recorded
        </div>
      );
    }
    
    // Define the display order for metric types
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
          const unit = unitsByType[type] || '';
          
          // Format based on metric type
          switch(type) {
            case "weight":
              return (
                <div key={type} className="flex items-center">
                  <Dumbbell className="h-3 w-3 mr-1" />
                  <span>
                    {min === max ? `${min}${unit}` : `${min}-${max}${unit}`}
                  </span>
                </div>
              );
              
            case "distance":
              return (
                <div key={type} className="flex items-center">
                  <Ruler className="h-3 w-3 mr-1" />
                  <span>
                    {min === max ? `${min}${unit}` : `${min}-${max}${unit}`}
                  </span>
                </div>
              );
              
            case "duration":
              return (
                <div key={type} className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>
                    {min === max ? `${min} ${unit}` : `${min}-${max} ${unit}`}
                  </span>
                </div>
              );
              
            case "repetitions":
              return (
                <div key={type} className="flex items-center">
                  <Repeat className="h-3 w-3 mr-1" />
                  <span>
                    {min === max ? `${min} ${unit}` : `${min}-${max} ${unit}`}
                  </span>
                </div>
              );
              
            case "restTime":
              return (
                <div key={type} className="flex items-center">
                  <Timer className="h-3 w-3 mr-1" />
                  <span>
                    {min === max ? `${min} ${unit}` : `${min}-${max} ${unit}`}
                  </span>
                </div>
              );
              
            default:
              return null;
          }
        })}
      </div>
    );
  };

  // Debug function to check exercise data
  const debugExercise = () => {
    console.log('Exercise:', exercise.name);
    console.log('Sets:', exercise.sets);
    
    if (exercise.sets && exercise.sets.length > 0) {
      const { metricsByType, unitsByType } = collectAllMetrics();
      console.log('Metrics by type:', metricsByType);
      console.log('Units by type:', unitsByType);
    }
  };

  // Call debug when component renders
  useEffect(() => {
    debugExercise();
  }, [exercise]);

  // Always generate the summary content for rendering
  const summaryContent = generateExerciseSummary(exercise);

  // Truncate notes with ellipsis if they're too long
  const truncateNotes = (notes: string, maxLines = 4) => {
    if (!notes) return "";
    
    // Rough approximation: average 50 chars per line, so 200 chars for 4 lines
    const maxChars = maxLines * 50;
    
    if (notes.length > maxChars) {
      return notes.substring(0, maxChars) + "...";
    }
    return notes;
  };

  return (
    <div className="mb-0 bg-white/90 border-b border-border last:border-b-0 overflow-hidden animate-slide-up animation-delay-100">
      <div 
        className="px-4 py-3 cursor-pointer flex items-start justify-between"
        onClick={toggleExpanded}
      >
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-left">{exercise.name}</h4>
          </div>
          
          {/* Render the enhanced summary when collapsed */}
          {!expanded && (
            <>
              {summaryContent}
              
              {/* Notes preview in collapsed state */}
              {hasNotes && (
                <div className="flex items-start mt-1.5">
                  <StickyNote className="h-3 w-3 mr-1 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground line-clamp-4 text-left">
                    {truncateNotes(exercise.notes || "")}
                  </p>
                </div>
              )}
            </>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full flex-shrink-0 mt-0"
          onClick={(e) => {
            e.stopPropagation();
            toggleExpanded();
          }}
        >
          {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </div>

      {expanded && (
        <div className="border-t border-border/50 animate-slide-down bg-muted/30">
          {/* Performance metrics */}
          {exercise.sets && exercise.sets.length > 0 && (
            <div className="mb-3 px-4">
              <div className="space-y-2">
                {exercise.sets.map((set, setIndex) => (
                  <div key={set.id} className="bg-background p-2 rounded-md">
                    <div className="flex items-center justify-between mb-1">
                      <Badge variant="outline" className="text-xs">Set {setIndex + 1}</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {set.metrics.map((metric, index) => (
                        <div 
                          key={index} 
                          className="bg-secondary/20 p-2 rounded-md flex flex-col"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              {getMetricIcon(metric.type)}
                              <span className="text-xs font-medium capitalize">
                                {formatMetricWithUnit(metric.type, metric.unit)}
                              </span>
                            </div>
                          </div>
                          <span className="text-sm font-medium mt-1">
                            {metric.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notes section */}
          {exercise.notes && (
            <div className="px-4 mb-3">
              <div className="flex items-center text-sm font-medium mb-1">
                <StickyNote className="h-4 w-4 mr-1.5" />
                <span className="text-left">Notes</span>
              </div>
              <p className="text-sm text-muted-foreground text-left">{exercise.notes}</p>
            </div>
          )}

          {/* Media section */}
          {exercise.media && exercise.media.length > 0 && (
            <div className="px-4 space-y-2">
              <p className="text-sm font-medium text-left">Media</p>
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
          
          {/* Button to collapse section */}
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
              <ChevronUp className="h-3.5 w-3.5 mr-1" />
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExerciseItem;
