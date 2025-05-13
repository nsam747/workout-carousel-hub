
import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Index from "./pages/Index";
import AddWorkout from "./pages/AddWorkout";
import EditWorkout from "./pages/EditWorkout";
import NotFound from "./pages/NotFound";
import { Toaster } from "./components/ui/sonner";
import { WorkoutAccordionProvider } from "./contexts/WorkoutAccordionContext";
import { ExerciseAccordionProvider } from "./contexts/ExerciseAccordionContext";

function App() {
  return (
    <BrowserRouter>
      <WorkoutAccordionProvider>
        <ExerciseAccordionProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/add-workout" element={<AddWorkout />} />
            <Route path="/edit-workout/:id" element={<EditWorkout />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster position="top-center" />
        </ExerciseAccordionProvider>
      </WorkoutAccordionProvider>
    </BrowserRouter>
  );
}

export default App;
