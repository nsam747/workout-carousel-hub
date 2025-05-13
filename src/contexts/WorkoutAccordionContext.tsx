
import React, { createContext, useState, ReactNode, useContext, useEffect } from "react";

interface WorkoutAccordionContextType {
  expandedWorkoutId: string | null;
  setExpandedWorkoutId: (id: string | null) => void;
  resetAccordion: () => void;
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
}

export const WorkoutAccordionContext = createContext<WorkoutAccordionContextType>({
  expandedWorkoutId: null,
  setExpandedWorkoutId: () => {},
  resetAccordion: () => {},
  selectedDate: new Date(),
  setSelectedDate: () => {},
});

interface WorkoutAccordionProviderProps {
  children: ReactNode;
}

export const WorkoutAccordionProvider: React.FC<WorkoutAccordionProviderProps> = ({ children }) => {
  const [expandedWorkoutId, setExpandedWorkoutId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Reset accordion when date changes
  useEffect(() => {
    console.log("selected date has changed to: " + selectedDate);
    resetAccordion();
  }, [selectedDate]);

  const resetAccordion = () => {
    console.log("Resetting workout accordion");
    setExpandedWorkoutId(null);
  };

  return (
    <WorkoutAccordionContext.Provider 
      value={{ 
        expandedWorkoutId, 
        setExpandedWorkoutId, 
        resetAccordion,
        selectedDate,
        setSelectedDate
      }}
    >
      {children}
    </WorkoutAccordionContext.Provider>
  );
};

// Custom hook to access the context
export const useWorkoutAccordion = () => useContext(WorkoutAccordionContext);
