
import React, { createContext, useState, ReactNode, useContext, useEffect, useCallback } from "react";

interface ExerciseAccordionContextType {
  expandedExerciseId: string | null;
  workoutId: string | null;
  setExpandedExercise: (exerciseId: string | null, workoutId: string | null) => void;
  resetAccordion: () => void;
  dateIdentifier: string | null; // Track the current date
  setDateIdentifier: (date: string | null) => void; // Update date identifier
}

export const ExerciseAccordionContext = createContext<ExerciseAccordionContextType>({
  expandedExerciseId: null,
  workoutId: null,
  setExpandedExercise: () => {},
  resetAccordion: () => {},
  dateIdentifier: null,
  setDateIdentifier: () => {},
});

interface ExerciseAccordionProviderProps {
  children: ReactNode;
}

export const ExerciseAccordionProvider: React.FC<ExerciseAccordionProviderProps> = ({ children }) => {
  const [expandedExerciseId, setExpandedExerciseId] = useState<string | null>(null);
  const [workoutId, setWorkoutId] = useState<string | null>(null);
  const [dateIdentifier, setDateIdentifier] = useState<string | null>(null);
  const [isResetting, setIsResetting] = useState<boolean>(false);

  // Reset accordion when date changes
  useEffect(() => {
    if (dateIdentifier) {
      console.log("ExerciseAccordion: Date changed, resetting accordion", dateIdentifier);
      setExpandedExerciseId(null);
      setWorkoutId(null);
      
      // Set a flag to prevent any immediate re-expansion
      setIsResetting(true);
      
      // Clear the resetting flag after a short delay
      const timer = setTimeout(() => {
        setIsResetting(false);
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [dateIdentifier]);

  // Ensure expand IDs are always null during reset operations
  const safeSetExpandedExercise = useCallback((exerciseId: string | null, newWorkoutId: string | null) => {
    if (!isResetting) {
      setExpandedExerciseId(exerciseId);
      setWorkoutId(newWorkoutId);
    } else {
      console.log("ExerciseAccordion: Ignoring expand request during reset");
    }
  }, [isResetting]);

  const resetAccordion = useCallback(() => {
    console.log("ExerciseAccordion: Manually resetting accordion");
    setExpandedExerciseId(null);
    setWorkoutId(null);
    setIsResetting(true);
    
    // Clear the resetting flag after a short delay
    setTimeout(() => {
      setIsResetting(false);
    }, 100);
  }, []);

  // Create a value object that won't change identity unless content changes
  const contextValue = React.useMemo(() => ({
    expandedExerciseId, 
    workoutId, 
    setExpandedExercise: safeSetExpandedExercise, 
    resetAccordion,
    dateIdentifier,
    setDateIdentifier
  }), [expandedExerciseId, workoutId, safeSetExpandedExercise, resetAccordion, dateIdentifier]);

  return (
    <ExerciseAccordionContext.Provider value={contextValue}>
      {children}
    </ExerciseAccordionContext.Provider>
  );
};

// Custom hook to access the context
export const useExerciseAccordion = () => useContext(ExerciseAccordionContext);
