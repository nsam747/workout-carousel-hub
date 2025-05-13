
import { useEffect } from 'react';
import { WorkoutAccordionContext } from '@/contexts/WorkoutAccordionContext';
import { ExerciseAccordionContext } from '@/contexts/ExerciseAccordionContext';
import { useContext } from 'react';

/**
 * Custom hook that resets all accordion states when a dependency changes
 * Useful for resetting accordions when date selection changes
 */
export function useAccordionReset(dependencies: React.DependencyList) {
  const workoutAccordion = useContext(WorkoutAccordionContext);
  const exerciseAccordion = useContext(ExerciseAccordionContext);
  
  useEffect(() => {
    // Reset all accordions when dependencies change
    if (workoutAccordion) {
      workoutAccordion.setExpandedWorkoutId(null);
    }
    
    if (exerciseAccordion) {
      exerciseAccordion.setExpandedExercise(null, null);
    }
  }, dependencies);
}
