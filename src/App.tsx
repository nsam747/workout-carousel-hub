import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/ui/theme-provider";
import Index from "./pages/Index";
import AddWorkout from "./pages/AddWorkout";
import EditWorkout from "./pages/EditWorkout";
import NotFound from "./pages/NotFound";
import "./App.css";

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Toaster position="top-center" closeButton />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/add-workout" element={<AddWorkout />} />
          <Route path="/edit-workout/:id" element={<EditWorkout />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
