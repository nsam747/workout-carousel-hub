
import React, { createContext, useState, ReactNode } from "react";

interface ExerciseAccordionContextType {
  expandedExerciseId: string | null;
  workoutId: string | null;
  setExpandedExercise: (exerciseId: string | null, workoutId: string | null) => void;
}

export const ExerciseAccordionContext = createContext<ExerciseAccordionContextType>({
  expandedExerciseId: null,
  workoutId: null,
  setExpandedExercise: () => {},
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

  return (
    <ExerciseAccordionContext.Provider value={{ expandedExerciseId, workoutId, setExpandedExercise }}>
      {children}
    </ExerciseAccordionContext.Provider>
  );
};
