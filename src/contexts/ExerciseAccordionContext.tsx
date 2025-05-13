
import React, { createContext, useState, ReactNode, useContext } from "react";

interface ExerciseAccordionContextType {
  expandedExerciseId: string | null;
  workoutId: string | null;
  setExpandedExercise: (exerciseId: string | null, workoutId: string | null) => void;
  resetAccordion: () => void;
}

export const ExerciseAccordionContext = createContext<ExerciseAccordionContextType>({
  expandedExerciseId: null,
  workoutId: null,
  setExpandedExercise: () => {},
  resetAccordion: () => {},
});

interface ExerciseAccordionProviderProps {
  children: ReactNode;
}

export const ExerciseAccordionProvider: React.FC<ExerciseAccordionProviderProps> = ({ children }) => {
  const [expandedExerciseId, setExpandedExerciseId] = useState<string | null>(null);
  const [workoutId, setWorkoutId] = useState<string | null>(null);

  const setExpandedExercise = (exerciseId: string | null, newWorkoutId: string | null) => {
    setExpandedExerciseId(exerciseId);
    setWorkoutId(newWorkoutId);
  };

  const resetAccordion = () => {
    setExpandedExerciseId(null);
    setWorkoutId(null);
  };

  return (
    <ExerciseAccordionContext.Provider value={{ expandedExerciseId, workoutId, setExpandedExercise, resetAccordion }}>
      {children}
    </ExerciseAccordionContext.Provider>
  );
};

// Custom hook to access the context
export const useExerciseAccordion = () => useContext(ExerciseAccordionContext);
