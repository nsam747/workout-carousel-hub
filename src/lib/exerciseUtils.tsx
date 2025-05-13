
import { Exercise, ExerciseMetric as Metric } from "@/lib/mockData";
import { Clock, Dumbbell, Hash, StickyNote, Ruler, Timer, Repeat, Image } from "lucide-react";
import { ReactNode } from "react";

// Interface for metrics grouped by type
interface CollectedMetrics {
  metricsByType: Record<string, number[]>;
  unitsByType: Record<string, string>;
}

// Collect all metrics from all sets in an exercise
export const collectAllMetrics = (exercise: Exercise): CollectedMetrics => {
  console.log("Exercise:", exercise.name);
  console.log("Sets:", exercise.sets);
  
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
        unitsByType[metric.type] = metric.unit.toLowerCase(); // Ensure units are lowercase here
      });
    }
  });
  
  console.log("Metrics by type:", metricsByType);
  console.log("Units by type:", unitsByType);

  return { metricsByType, unitsByType };
};

// Get icon component for metric type
export const getMetricIcon = (type: string) => {
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

// Format metric type for display
export const formatMetricName = (type: string) => {
  return type.charAt(0).toUpperCase() + type.slice(1).replace(/([A-Z])/g, ' $1');
};

// Format metric with unit for display next to metric name
export const formatMetricWithUnit = (type: string, unit: string) => {
  const name = formatMetricName(type);
  return `${name} (${unit.toLowerCase()})`; // Ensure units are lowercase here
};

// Generate an enhanced summary showing ranges for each metric type
export const generateExerciseSummary = (exercise: Exercise): ReactNode => {
  const { metricsByType, unitsByType } = collectAllMetrics(exercise);
  
  // Check if we have any metrics to show
  const hasMetrics = metricsByType && Object.keys(metricsByType).length > 0;
  
  // Check if exercise has notes or media
  const hasNotes = exercise.notes && exercise.notes.trim().length > 0;
  const hasMedia = exercise.media && exercise.media.length > 0;
  
  // Get total sets
  const totalSets = exercise.sets?.length || 0;
  
  // If no metrics but we have other data, show that instead
  if (!hasMetrics) {
    if (hasNotes || hasMedia || totalSets > 0) {
      return (
        <div className="flex flex-wrap items-center text-sm text-muted-foreground mt-1 gap-2">
          {totalSets > 0 && (
            <div className="flex items-center">
              <Hash className="h-3 w-3 mr-1" />
              <span>{totalSets} sets</span>
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
      {totalSets > 0 && (
        <div className="flex items-center">
          <Hash className="h-3 w-3 mr-1" />
          <span>{totalSets} sets</span>
        </div>
      )}
      
      {/* Then show other metrics in the specified order */}
      {orderedTypes.map(type => {
        const values = metricsByType[type];
        if (!values || values.length === 0) return null;
        
        const min = Math.min(...values.filter(v => v > 0));
        const max = Math.max(...values);
        const unit = unitsByType[type]?.toLowerCase() || '';
        
        // Skip if all values are 0
        if (max === 0) return null;
        
        // Format based on metric type
        return (
          <div key={type} className="flex items-center">
            {getMetricIcon(type)}
            <span>
              {min === max ? `${min}${unit}` : `${min}-${max}${unit}`}
            </span>
          </div>
        );
      })}
      
      {/* Show notes and media indicators if no performance metrics were displayed */}
      {hasNotes && Object.keys(metricsByType).filter(type => {
        const values = metricsByType[type];
        return values && values.some(v => v > 0);
      }).length === 0 && (
        <div className="flex items-center">
          <StickyNote className="h-3 w-3 mr-1" />
          <span>Notes</span>
        </div>
      )}
      
      {hasMedia && Object.keys(metricsByType).filter(type => {
        const values = metricsByType[type];
        return values && values.some(v => v > 0);
      }).length === 0 && (
        <div className="flex items-center">
          <Image className="h-3 w-3 mr-1" />
          <span>Media</span>
        </div>
      )}
    </div>
  );
};

// Sort metrics by priority for display
export const sortMetrics = (metrics: Metric[]) => {
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
