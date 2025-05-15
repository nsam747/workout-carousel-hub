
import React, { createContext, useState, ReactNode, useContext, useEffect } from "react";

interface ExerciseAccordionContextType {
  expandedExerciseId: string | null;
  expandedWorkoutId: string | null;
  setExpandedExercise: (exerciseId: string | null, workoutId: string | null) => void;
  setExpandedWorkoutId: (workoutId: string) => void;
  resetAccordion: () => void;
  selectedDate: Date | null;
  setSelectedDate: (date: Date) => void;
}

export const ExerciseAccordionContext = createContext<ExerciseAccordionContextType>({
  expandedExerciseId: null,
  expandedWorkoutId: null,
  setExpandedExercise: () => {},
  setExpandedWorkoutId: () => {},
  resetAccordion: () => {},
  selectedDate: new Date(),
  setSelectedDate: () => {},
});

interface ExerciseAccordionProviderProps {
  children: ReactNode;
}

export const ExerciseAccordionProvider: React.FC<ExerciseAccordionProviderProps> = ({ children }) => {
  const [expandedExerciseId, setExpandedExerciseId] = useState<string | null>(null);
  const [expandedWorkoutId, setExpandedWorkoutId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Reset accordion when date changes
  useEffect(() => {
    resetAccordion();
  }, [selectedDate]);

  const setExpandedExercise = (exerciseId: string | null, newWorkoutId: string | null) => {
    setExpandedExerciseId(exerciseId);
    setExpandedWorkoutId(newWorkoutId);
  };

  const handleExpandWorkout = (workoutId: string | null) => {
    // Close the previous accordion and then trigger the opening of the next one separately ?
    setExpandedWorkoutId(null);

    if(workoutId !== null) {
      setExpandedWorkoutId(workoutId);
    } 
  }

  const resetAccordion = () => {
    setExpandedExerciseId(null);
    setExpandedWorkoutId(null);
  };

  return (
    <ExerciseAccordionContext.Provider 
      value={{ 
        expandedExerciseId, 
        expandedWorkoutId, 
        setExpandedWorkoutId: handleExpandWorkout,
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
