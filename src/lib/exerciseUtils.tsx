
import React from 'react';
import { Exercise, ExerciseMetric } from '@/lib/mockData';
import { Clock, Ruler, Weight, Repeat, Timer } from 'lucide-react';

// Function to generate a summary of the exercise performance
export const generateExerciseSummary = (exercise: Exercise) => {
  if (!exercise.sets || exercise.sets.length === 0) {
    return (
      <div className="text-xs text-muted-foreground mt-1">
        No performance data
      </div>
    );
  }
  
  // Collect metrics by type
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
  
  // If no metrics, show sets count only
  if (Object.keys(metricsByType).length === 0) {
    return (
      <div className="text-xs text-muted-foreground mt-1">
        {exercise.sets.length} sets
      </div>
    );
  }
  
  // Display a summary of each metric type
  return (
    <div className="flex flex-wrap gap-2 text-xs text-muted-foreground mt-1">
      {/* Always show sets count first */}
      <div>{exercise.sets.length} sets</div>
      
      {/* Show weight if available */}
      {metricsByType['weight'] && (
        <div className="flex items-center">
          <Weight className="h-3 w-3 mr-1" />
          {getMetricRange(metricsByType['weight'], unitsByType['weight'])}
        </div>
      )}
      
      {/* Show reps if available */}
      {metricsByType['repetitions'] && (
        <div className="flex items-center">
          <Repeat className="h-3 w-3 mr-1" />
          {getMetricRange(metricsByType['repetitions'], unitsByType['repetitions'] || 'reps')}
        </div>
      )}
      
      {/* Show distance if available */}
      {metricsByType['distance'] && (
        <div className="flex items-center">
          <Ruler className="h-3 w-3 mr-1" />
          {getMetricRange(metricsByType['distance'], unitsByType['distance'])}
        </div>
      )}
      
      {/* Show duration if available */}
      {metricsByType['duration'] && (
        <div className="flex items-center">
          <Clock className="h-3 w-3 mr-1" />
          {getMetricRange(metricsByType['duration'], unitsByType['duration'])}
        </div>
      )}
      
      {/* Show rest time if available */}
      {metricsByType['restTime'] && (
        <div className="flex items-center">
          <Timer className="h-3 w-3 mr-1" />
          {getMetricRange(metricsByType['restTime'], unitsByType['restTime'])}
        </div>
      )}
    </div>
  );
};

// Helper to get the range of a metric for display
const getMetricRange = (values: number[], unit: string) => {
  if (!values || values.length === 0) return '';
  
  const min = Math.min(...values);
  const max = Math.max(...values);
  
  if (min === max) {
    return `${min} ${unit}`;
  }
  
  return `${min}-${max} ${unit}`;
};
