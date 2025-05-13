
import React, { createContext, useState, ReactNode, useContext, useEffect } from "react";

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

  // Reset accordion when date changes
  useEffect(() => {
    if (dateIdentifier) {
      console.log("ExerciseAccordion: Date changed, resetting accordion");
      setExpandedExerciseId(null);
      setWorkoutId(null);
    }
  }, [dateIdentifier]);

  const setExpandedExercise = (exerciseId: string | null, newWorkoutId: string | null) => {
    setExpandedExerciseId(exerciseId);
    setWorkoutId(newWorkoutId);
  };

  const resetAccordion = () => {
    console.log("ExerciseAccordion: Manually resetting accordion");
    setExpandedExerciseId(null);
    setWorkoutId(null);
  };

  return (
    <ExerciseAccordionContext.Provider value={{ 
      expandedExerciseId, 
      workoutId, 
      setExpandedExercise, 
      resetAccordion,
      dateIdentifier,
      setDateIdentifier
    }}>
      {children}
    </ExerciseAccordionContext.Provider>
  );
};

// Custom hook to access the context
export const useExerciseAccordion = () => useContext(ExerciseAccordionContext);
