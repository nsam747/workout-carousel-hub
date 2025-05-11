
import React, { useState } from "react";
import { format } from "date-fns";
import { Calendar, Clock } from "lucide-react";
import DateTimePickerWheel from "./DateTimePickerWheel";

interface DateTimeSelectorProps {
  date: Date;
  onDateChange: (date: Date) => void;
  className?: string;
}

const DateTimeSelector: React.FC<DateTimeSelectorProps> = ({ 
  date,
  onDateChange,
  className
}) => {
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [timePickerOpen, setTimePickerOpen] = useState(false);
  
  return (
    <div className={`flex justify-between items-center ${className}`}>
      {/* Date selector */}
      <button 
        className="flex items-center space-x-2 py-2 px-1"
        onClick={() => setDatePickerOpen(true)}
      >
        <Calendar className="h-4 w-4 text-muted-foreground" />
        <span className="text-base">{format(date, "EEE, MMM d, yyyy")}</span>
      </button>
      
      {/* Time selector */}
      <button 
        className="flex items-center space-x-2 py-2 px-1"
        onClick={() => setTimePickerOpen(true)}
      >
        <Clock className="h-4 w-4 text-muted-foreground" />
        <span className="text-base">{format(date, "h:mm a")}</span>
      </button>
      
      {/* Date picker wheel */}
      <DateTimePickerWheel 
        isOpen={datePickerOpen}
        onClose={() => setDatePickerOpen(false)}
        onSelect={(selectedDate) => {
          const newDate = new Date(date);
          newDate.setFullYear(selectedDate.getFullYear());
          newDate.setMonth(selectedDate.getMonth());
          newDate.setDate(selectedDate.getDate());
          onDateChange(newDate);
        }}
        initialDate={date}
        mode="date"
      />
      
      {/* Time picker wheel */}
      <DateTimePickerWheel
        isOpen={timePickerOpen}
        onClose={() => setTimePickerOpen(false)}
        onSelect={(selectedDate) => {
          const newDate = new Date(date);
          newDate.setHours(selectedDate.getHours());
          newDate.setMinutes(selectedDate.getMinutes());
          onDateChange(newDate);
        }}
        initialDate={date}
        mode="time"
      />
    </div>
  );
};

export default DateTimeSelector;
