
import React, { createContext, useState, ReactNode, useContext, useEffect } from "react";

interface WorkoutAccordionContextType {
  expandedWorkoutId: string | null;
  setExpandedWorkoutId: (id: string | null) => void;
  resetAccordion: () => void;
  dateIdentifier: string | null; // Track the current date
  setDateIdentifier: (date: string | null) => void; // Update date identifier
}

export const WorkoutAccordionContext = createContext<WorkoutAccordionContextType>({
  expandedWorkoutId: null,
  setExpandedWorkoutId: () => {},
  resetAccordion: () => {},
  dateIdentifier: null,
  setDateIdentifier: () => {},
});

interface WorkoutAccordionProviderProps {
  children: ReactNode;
}

export const WorkoutAccordionProvider: React.FC<WorkoutAccordionProviderProps> = ({ children }) => {
  const [expandedWorkoutId, setExpandedWorkoutId] = useState<string | null>(null);
  const [dateIdentifier, setDateIdentifier] = useState<string | null>(null);

  // Reset accordion when date changes
  useEffect(() => {
    if (dateIdentifier) {
      console.log("WorkoutAccordion: Date changed, resetting accordion");
      setExpandedWorkoutId(null);
    }
  }, [dateIdentifier]);

  const resetAccordion = () => {
    console.log("WorkoutAccordion: Manually resetting accordion");
    setExpandedWorkoutId(null);
  };

  return (
    <WorkoutAccordionContext.Provider value={{ 
      expandedWorkoutId, 
      setExpandedWorkoutId, 
      resetAccordion,
      dateIdentifier,
      setDateIdentifier 
    }}>
      {children}
    </WorkoutAccordionContext.Provider>
  );
};

// Custom hook to access the context
export const useWorkoutAccordion = () => useContext(WorkoutAccordionContext);
