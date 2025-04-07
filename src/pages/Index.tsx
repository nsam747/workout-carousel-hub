
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import WeekCalendarCarousel from "@/components/WeekCalendarCarousel";
import MonthCalendarCarousel from "@/components/MonthCalendarCarousel";
import WorkoutList from "@/components/WorkoutList";
import { Button } from "@/components/ui/button";
import { CalendarDays, Calendar as CalendarIcon } from "lucide-react";
import BottomNavigation from "@/components/BottomNavigation";
import { DateRange } from "@/components/MonthCalendarCarousel";

const Index = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<"week" | "month">("week");
  const [dateRangeMode, setDateRangeMode] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState<DateRange | undefined>(undefined);
  const navigate = useNavigate();

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    // Clear any existing range when selecting a single date
    setSelectedDateRange(undefined);
    setDateRangeMode(false);
  };

  const handleDateRangeSelect = (range: DateRange) => {
    setSelectedDateRange(range);
    // If we have a complete range, also set the selected date to the start date
    if (range.to) {
      setSelectedDate(range.from);
    }
  };

  const toggleDateRangeMode = () => {
    const newMode = !dateRangeMode;
    setDateRangeMode(newMode);
    
    // Clear selection when toggling modes
    if (newMode) {
      setSelectedDateRange(undefined);
    } else {
      setSelectedDateRange(undefined);
    }
  };

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
          
          {/* Date Range Toggle */}
          <div className="mt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleDateRangeMode}
              className={dateRangeMode ? "bg-primary/10" : ""}
            >
              {dateRangeMode ? "Disable Range Selection" : "Enable Range Selection"}
            </Button>
          </div>
        </header>

        {viewMode === "week" ? (
          <WeekCalendarCarousel 
            selectedDate={selectedDate} 
            onDateSelect={handleDateSelect}
            selectedDateRange={dateRangeMode ? selectedDateRange : undefined}
            onDateRangeSelect={dateRangeMode ? handleDateRangeSelect : undefined}
          />
        ) : (
          <MonthCalendarCarousel 
            selectedDate={selectedDate} 
            onDateSelect={handleDateSelect}
            selectedDateRange={dateRangeMode ? selectedDateRange : undefined}
            onDateRangeSelect={dateRangeMode ? handleDateRangeSelect : undefined}
          />
        )}

        <WorkoutList 
          selectedDate={selectedDate} 
          dateRange={selectedDateRange && selectedDateRange.to ? selectedDateRange : undefined} 
        />
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default Index;
