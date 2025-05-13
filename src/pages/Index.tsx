
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import WeekCalendarCarousel from "@/components/WeekCalendarCarousel";
import MonthCalendarCarousel from "@/components/MonthCalendarCarousel";
import WorkoutList from "@/components/WorkoutList";
import { Button } from "@/components/ui/button";
import { CalendarDays, Calendar as CalendarIcon } from "lucide-react";
import BottomNavigation from "@/components/BottomNavigation";

const Index = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<"week" | "month">("week");
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-b from-background to-secondary/50 min-h-screen pb-20">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <header className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold tracking-tight text-balance">Workout Journal</h1>
          <p className="text-muted-foreground mt-1">
            Track your fitness journey with precision
          </p>
          
          {/* View Mode Toggle */}
          <div className="mt-4 flex items-center justify-start space-x-2 bg-muted/60 rounded-lg p-1 w-fit">
            <Button 
              variant={viewMode === "week" ? "default" : "ghost"}
              size="sm"
              className="rounded-md"
              onClick={() => setViewMode("week")}
            >
              <CalendarDays className="h-4 w-4 mr-2" />
              Week
            </Button>
            <Button 
              variant={viewMode === "month" ? "default" : "ghost"}
              size="sm"
              className="rounded-md"
              onClick={() => setViewMode("month")}
            >
              <CalendarIcon className="h-4 w-4 mr-2" />
              Month
            </Button>
          </div>
        </header>

        {viewMode === "week" ? (
          <WeekCalendarCarousel 
            selectedDate={selectedDate} 
            onDateSelect={setSelectedDate} 
          />
        ) : (
          <MonthCalendarCarousel 
            selectedDate={selectedDate} 
            onDateSelect={setSelectedDate} 
          />
        )}

        <WorkoutList selectedDate={selectedDate} />
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default Index;
