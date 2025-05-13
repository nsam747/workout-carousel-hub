
import React, { createContext, useState, ReactNode } from "react";

interface WorkoutAccordionContextType {
  expandedWorkoutId: string | null;
  setExpandedWorkoutId: (id: string | null) => void;
}

export const WorkoutAccordionContext = createContext<WorkoutAccordionContextType>({
  expandedWorkoutId: null,
  setExpandedWorkoutId: () => {},
});

interface WorkoutAccordionProviderProps {
  children: ReactNode;
}

export const WorkoutAccordionProvider: React.FC<WorkoutAccordionProviderProps> = ({ children }) => {
  const [expandedWorkoutId, setExpandedWorkoutId] = useState<string | null>(null);

  return (
    <WorkoutAccordionContext.Provider value={{ expandedWorkoutId, setExpandedWorkoutId }}>
      {children}
    </WorkoutAccordionContext.Provider>
  );
};
