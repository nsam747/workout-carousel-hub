
import React, { useState, useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { format, addMonths, addDays, addYears, addHours, addMinutes, setHours, setMinutes } from "date-fns";

interface DateTimePickerWheelProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (date: Date) => void;
  initialDate: Date;
  mode: "date" | "time";
}

const DateTimePickerWheel: React.FC<DateTimePickerWheelProps> = ({
  isOpen,
  onClose,
  onSelect,
  initialDate,
  mode
}) => {
  const [selectedDate, setSelectedDate] = useState<Date>(initialDate);
  const monthsRef = useRef<HTMLDivElement>(null);
  const daysRef = useRef<HTMLDivElement>(null);
  const yearsRef = useRef<HTMLDivElement>(null);
  const hoursRef = useRef<HTMLDivElement>(null);
  const minutesRef = useRef<HTMLDivElement>(null);
  const ampmRef = useRef<HTMLDivElement>(null);
  
  // Generate arrays for months, days, years, hours, minutes, ampm
  const months = Array.from({ length: 12 }, (_, i) => {
    const date = addMonths(new Date(2000, 0, 1), i);
    return format(date, "MMMM");
  });
  
  const days = Array.from({ length: 31 }, (_, i) => String(i + 1));
  
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => String(currentYear - 2 + i));
  
  const hours = Array.from({ length: 12 }, (_, i) => String(i === 0 ? 12 : i));
  
  const minutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, "0"));
  
  const ampm = ["AM", "PM"];

  // Handle selection
  const handleConfirm = () => {
    onSelect(selectedDate);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="fixed bottom-0 left-0 right-0 z-50 flex flex-col rounded-t-xl bg-card shadow-lg animate-in slide-in-from-bottom">
        {/* Header with Cancel and Done buttons */}
        <div className="flex items-center justify-between bg-primary px-4 py-3 rounded-t-xl">
          <button 
            className="text-primary-foreground font-medium text-lg"
            onClick={onClose}
          >
            Cancel
          </button>
          <button 
            className="text-primary-foreground font-medium text-lg"
            onClick={handleConfirm}
          >
            Done
          </button>
        </div>
        
        {/* Date/Time Picker */}
        <div className="p-4 bg-black">
          {mode === "date" ? (
            <div className="flex justify-center gap-4 h-[200px]">
              {/* Month wheel */}
              <div className="flex-1 relative">
                <div className="absolute inset-0 pointer-events-none flex flex-col">
                  <div className="flex-1 bg-gradient-to-b from-black to-transparent opacity-70" />
                  <div className="h-10" />
                  <div className="flex-1 bg-gradient-to-t from-black to-transparent opacity-70" />
                </div>
                <ScrollArea className="h-full">
                  <div ref={monthsRef} className="px-2 py-[80px]">
                    {months.map((month, index) => (
                      <div 
                        key={month}
                        className={cn(
                          "py-2 text-center cursor-pointer transition-colors",
                          format(selectedDate, "MMMM") === month 
                            ? "text-white bg-primary/20 rounded-md" 
                            : "text-gray-500"
                        )}
                        onClick={() => {
                          const newDate = new Date(selectedDate);
                          newDate.setMonth(index);
                          setSelectedDate(newDate);
                        }}
                      >
                        {month}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
              
              {/* Day wheel */}
              <div className="w-16 relative">
                <div className="absolute inset-0 pointer-events-none flex flex-col">
                  <div className="flex-1 bg-gradient-to-b from-black to-transparent opacity-70" />
                  <div className="h-10" />
                  <div className="flex-1 bg-gradient-to-t from-black to-transparent opacity-70" />
                </div>
                <ScrollArea className="h-full">
                  <div ref={daysRef} className="px-2 py-[80px]">
                    {days.map((day) => (
                      <div 
                        key={day}
                        className={cn(
                          "py-2 text-center cursor-pointer transition-colors",
                          format(selectedDate, "d") === day 
                            ? "text-white bg-primary/20 rounded-md" 
                            : "text-gray-500"
                        )}
                        onClick={() => {
                          const newDate = new Date(selectedDate);
                          newDate.setDate(parseInt(day));
                          setSelectedDate(newDate);
                        }}
                      >
                        {day}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
              
              {/* Year wheel */}
              <div className="w-24 relative">
                <div className="absolute inset-0 pointer-events-none flex flex-col">
                  <div className="flex-1 bg-gradient-to-b from-black to-transparent opacity-70" />
                  <div className="h-10" />
                  <div className="flex-1 bg-gradient-to-t from-black to-transparent opacity-70" />
                </div>
                <ScrollArea className="h-full">
                  <div ref={yearsRef} className="px-2 py-[80px]">
                    {years.map((year) => (
                      <div 
                        key={year}
                        className={cn(
                          "py-2 text-center cursor-pointer transition-colors",
                          format(selectedDate, "yyyy") === year 
                            ? "text-white bg-primary/20 rounded-md" 
                            : "text-gray-500"
                        )}
                        onClick={() => {
                          const newDate = new Date(selectedDate);
                          newDate.setFullYear(parseInt(year));
                          setSelectedDate(newDate);
                        }}
                      >
                        {year}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </div>
          ) : (
            <div className="flex justify-center gap-4 h-[200px]">
              {/* Hours wheel */}
              <div className="w-16 relative">
                <div className="absolute inset-0 pointer-events-none flex flex-col">
                  <div className="flex-1 bg-gradient-to-b from-black to-transparent opacity-70" />
                  <div className="h-10" />
                  <div className="flex-1 bg-gradient-to-t from-black to-transparent opacity-70" />
                </div>
                <ScrollArea className="h-full">
                  <div ref={hoursRef} className="px-2 py-[80px]">
                    {hours.map((hour) => (
                      <div 
                        key={hour}
                        className={cn(
                          "py-2 text-center cursor-pointer transition-colors",
                          format(selectedDate, "h") === hour 
                            ? "text-white bg-primary/20 rounded-md" 
                            : "text-gray-500"
                        )}
                        onClick={() => {
                          let hourValue = parseInt(hour);
                          if (hourValue === 12) hourValue = 0;
                          if (format(selectedDate, "a") === "PM") hourValue += 12;
                          const newDate = setHours(selectedDate, hourValue);
                          setSelectedDate(newDate);
                        }}
                      >
                        {hour}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
              
              {/* Minutes wheel */}
              <div className="w-16 relative">
                <div className="absolute inset-0 pointer-events-none flex flex-col">
                  <div className="flex-1 bg-gradient-to-b from-black to-transparent opacity-70" />
                  <div className="h-10" />
                  <div className="flex-1 bg-gradient-to-t from-black to-transparent opacity-70" />
                </div>
                <ScrollArea className="h-full">
                  <div ref={minutesRef} className="px-2 py-[80px]">
                    {minutes.map((minute) => (
                      <div 
                        key={minute}
                        className={cn(
                          "py-2 text-center cursor-pointer transition-colors",
                          format(selectedDate, "mm") === minute 
                            ? "text-white bg-primary/20 rounded-md" 
                            : "text-gray-500"
                        )}
                        onClick={() => {
                          const newDate = setMinutes(selectedDate, parseInt(minute));
                          setSelectedDate(newDate);
                        }}
                      >
                        {minute}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
              
              {/* AM/PM wheel */}
              <div className="w-16 relative">
                <div className="absolute inset-0 pointer-events-none flex flex-col">
                  <div className="flex-1 bg-gradient-to-b from-black to-transparent opacity-70" />
                  <div className="h-10" />
                  <div className="flex-1 bg-gradient-to-t from-black to-transparent opacity-70" />
                </div>
                <ScrollArea className="h-full">
                  <div ref={ampmRef} className="px-2 py-[80px]">
                    {ampm.map((period) => (
                      <div 
                        key={period}
                        className={cn(
                          "py-2 text-center cursor-pointer transition-colors",
                          format(selectedDate, "a") === period 
                            ? "text-white bg-primary/20 rounded-md" 
                            : "text-gray-500"
                        )}
                        onClick={() => {
                          let hours = selectedDate.getHours();
                          const isPM = period === "PM";
                          if (isPM && hours < 12) {
                            hours += 12;
                          } else if (!isPM && hours >= 12) {
                            hours -= 12;
                          }
                          const newDate = setHours(selectedDate, hours);
                          setSelectedDate(newDate);
                        }}
                      >
                        {period}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DateTimePickerWheel;
