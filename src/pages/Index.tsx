
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CalendarCarousel from "@/components/CalendarCarousel";
import WorkoutList from "@/components/WorkoutList";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

const Index = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-b from-background to-secondary/50 min-h-screen">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <header className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold tracking-tight text-balance">Workout Journal</h1>
          <p className="text-muted-foreground mt-1">
            Track your fitness journey with precision
          </p>
        </header>

        <CalendarCarousel 
          selectedDate={selectedDate} 
          onDateSelect={setSelectedDate} 
        />

        <WorkoutList selectedDate={selectedDate} />

        <div className="fixed bottom-8 right-8 z-10 animate-fade-in animation-delay-300">
          <Button 
            size="lg" 
            className="rounded-full h-14 w-14 shadow-lg bg-primary"
            onClick={() => navigate("/add-workout")}
          >
            <PlusCircle className="h-6 w-6" />
            <span className="sr-only">Add new workout</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
