
import React, { useRef, useEffect } from "react";
import { dateRange } from "@/lib/mockData";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CalendarCarouselProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

const CalendarCarousel: React.FC<CalendarCarouselProps> = ({
  selectedDate,
  onDateSelect,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const selectedDateRef = useRef<HTMLDivElement>(null);

  // Scroll to selected date when component mounts or selectedDate changes
  useEffect(() => {
    if (selectedDateRef.current && scrollRef.current) {
      const container = scrollRef.current;
      const element = selectedDateRef.current;
      
      // Calculate the position to center the element
      const centerPosition = element.offsetLeft - (container.offsetWidth / 2) + (element.offsetWidth / 2);
      
      // Use smooth scrolling
      container.scrollTo({
        left: centerPosition,
        behavior: "smooth",
      });
    }
  }, [selectedDate]);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: -200,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: 200,
        behavior: "smooth",
      });
    }
  };

  // Helper to check if two dates are the same day
  const isSameDay = (date1: Date, date2: Date) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  return (
    <div className="relative bg-white/80 backdrop-blur-md border border-border rounded-xl p-2 mb-6 animate-fade-in">
      {/* Left Button */}
      <button
        onClick={scrollLeft}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-1 rounded-full bg-white/90 border border-border shadow-sm hover:bg-white transition-colors"
        aria-label="Previous dates"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      {/* Calendar Days */}
      <div
        ref={scrollRef}
        className="flex space-x-2 overflow-x-auto py-2 px-8 scrollbar-hide"
      >
        {dateRange.map((day, i) => {
          const isSelected = isSameDay(day.date, selectedDate);
          
          return (
            <div
              key={i}
              ref={isSelected ? selectedDateRef : null}
              className={`calendar-day ${
                isSelected
                  ? "active"
                  : "hover:bg-secondary/80"
              } ${day.isToday ? "ring-2 ring-primary/20" : ""}`}
              onClick={() => onDateSelect(day.date)}
            >
              <span className="weekday">{day.dayName}</span>
              <span className="date">{day.dayNumber}</span>
              {day.isToday && (
                <span className="absolute bottom-1 w-1 h-1 rounded-full bg-primary/70"></span>
              )}
            </div>
          );
        })}
      </div>

      {/* Right Button */}
      <button
        onClick={scrollRight}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-1 rounded-full bg-white/90 border border-border shadow-sm hover:bg-white transition-colors"
        aria-label="Next dates"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
};

export default CalendarCarousel;
