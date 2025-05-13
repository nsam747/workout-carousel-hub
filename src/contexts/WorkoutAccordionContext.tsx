
import React, { createContext, useState, ReactNode, useContext, useEffect, useCallback } from "react";

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
  const [isResetting, setIsResetting] = useState<boolean>(false);

  // Reset accordion when date changes
  useEffect(() => {
    if (dateIdentifier) {
      console.log("WorkoutAccordion: Date changed, resetting accordion", dateIdentifier);
      setExpandedWorkoutId(null);
      // Set a flag to prevent any immediate re-expansion
      setIsResetting(true);
      
      // Clear the resetting flag after a short delay
      const timer = setTimeout(() => {
        setIsResetting(false);
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [dateIdentifier]);

  // Ensure expand ID is always null during reset operations
  const safeSetExpandedWorkoutId = useCallback((id: string | null) => {
    if (!isResetting) {
      setExpandedWorkoutId(id);
    } else {
      console.log("WorkoutAccordion: Ignoring expand request during reset");
    }
  }, [isResetting]);

  const resetAccordion = useCallback(() => {
    console.log("WorkoutAccordion: Manually resetting accordion");
    setExpandedWorkoutId(null);
    setIsResetting(true);
    
    // Clear the resetting flag after a short delay
    setTimeout(() => {
      setIsResetting(false);
    }, 100);
  }, []);

  // Create a value object that won't change identity unless content changes
  const contextValue = React.useMemo(() => ({
    expandedWorkoutId, 
    setExpandedWorkoutId: safeSetExpandedWorkoutId, 
    resetAccordion,
    dateIdentifier,
    setDateIdentifier
  }), [expandedWorkoutId, dateIdentifier, safeSetExpandedWorkoutId, resetAccordion]);

  return (
    <WorkoutAccordionContext.Provider value={contextValue}>
      {children}
    </WorkoutAccordionContext.Provider>
  );
};

// Custom hook to access the context
export const useWorkoutAccordion = () => useContext(WorkoutAccordionContext);
