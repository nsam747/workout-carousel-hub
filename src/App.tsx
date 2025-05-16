
import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Index from "./pages/Index";
import AddWorkout from "./pages/AddWorkout";
import EditWorkout from "./pages/EditWorkout";
import Data from "./pages/Data";
import ExerciseDetail from "./pages/ExerciseDetail";
import Feeds from "./pages/Feeds";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import { Toaster } from "./components/ui/sonner";
import { ExerciseAccordionProvider } from "./contexts/ExerciseAccordionContext";

function App() {
  return (
    <BrowserRouter>
        <ExerciseAccordionProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/add-workout" element={<AddWorkout />} />
            <Route path="/edit-workout/:id" element={<EditWorkout />} />
            <Route path="/data" element={<Data />} />
            <Route path="/exercise/:id" element={<ExerciseDetail />} />
            <Route path="/feeds" element={<Feeds />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster position="top-center" />
        </ExerciseAccordionProvider>
    </BrowserRouter>
  );
}

export default App;
