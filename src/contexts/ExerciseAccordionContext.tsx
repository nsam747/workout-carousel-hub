
import React, { createContext, useState, ReactNode, useContext, useEffect } from "react";

interface ExerciseAccordionContextType {
  expandedExerciseId: string | null;
  workoutId: string | null;
  setExpandedExercise: (exerciseId: string | null, workoutId: string | null) => void;
  resetAccordion: () => void;
  selectedDate: Date | null;
  setSelectedDate: (date: Date) => void;
}

export const ExerciseAccordionContext = createContext<ExerciseAccordionContextType>({
  expandedExerciseId: null,
  workoutId: null,
  setExpandedExercise: () => {},
  resetAccordion: () => {},
  selectedDate: null,
  setSelectedDate: () => {},
});

interface ExerciseAccordionProviderProps {
  children: ReactNode;
}

export const ExerciseAccordionProvider: React.FC<ExerciseAccordionProviderProps> = ({ children }) => {
  const [expandedExerciseId, setExpandedExerciseId] = useState<string | null>(null);
  const [workoutId, setWorkoutId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Reset accordion when date changes
  useEffect(() => {
    if (selectedDate) {
      resetAccordion();
    }
  }, [selectedDate]);

  const setExpandedExercise = (exerciseId: string | null, newWorkoutId: string | null) => {
    setExpandedExerciseId(exerciseId);
    setWorkoutId(newWorkoutId);
  };

  const resetAccordion = () => {
    setExpandedExerciseId(null);
    setWorkoutId(null);
  };

  return (
    <ExerciseAccordionContext.Provider 
      value={{ 
        expandedExerciseId, 
        workoutId, 
        setExpandedExercise, 
        resetAccordion,
        selectedDate,
        setSelectedDate
      }}
    >
      {children}
    </ExerciseAccordionContext.Provider>
  );
};

// Custom hook to access the context
export const useExerciseAccordion = () => useContext(ExerciseAccordionContext);
