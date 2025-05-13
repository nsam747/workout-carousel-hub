
import React, { createContext, useState, ReactNode, useContext } from "react";

interface WorkoutAccordionContextType {
  expandedWorkoutId: string | null;
  setExpandedWorkoutId: (id: string | null) => void;
  resetAccordion: () => void;
}

export const WorkoutAccordionContext = createContext<WorkoutAccordionContextType>({
  expandedWorkoutId: null,
  setExpandedWorkoutId: () => {},
  resetAccordion: () => {},
});

interface WorkoutAccordionProviderProps {
  children: ReactNode;
}

export const WorkoutAccordionProvider: React.FC<WorkoutAccordionProviderProps> = ({ children }) => {
  const [expandedWorkoutId, setExpandedWorkoutId] = useState<string | null>(null);

  const resetAccordion = () => {
    setExpandedWorkoutId(null);
  };

  return (
    <WorkoutAccordionContext.Provider value={{ expandedWorkoutId, setExpandedWorkoutId, resetAccordion }}>
      {children}
    </WorkoutAccordionContext.Provider>
  );
};

// Custom hook to access the context
export const useWorkoutAccordion = () => useContext(WorkoutAccordionContext);
