
import React, { useState } from "react";
import Picker from "react-mobile-picker";
import { format, addMonths, setHours, setMinutes } from "date-fns";

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
  
  // Date picker options
  const months = Array.from({ length: 12 }, (_, i) => {
    const date = addMonths(new Date(2000, 0, 1), i);
    return format(date, "MMMM");
  });
  
  const days = Array.from({ length: 31 }, (_, i) => String(i + 1));
  
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => String(currentYear - 2 + i));
  
  // Time picker options
  const hours = Array.from({ length: 12 }, (_, i) => String(i === 0 ? 12 : i));
  const minutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, "0"));
  const ampm = ["AM", "PM"];

  // Initial values
  const initialMonth = format(initialDate, "MMMM");
  const initialDay = format(initialDate, "d");
  const initialYear = format(initialDate, "yyyy");
  const initialHour = format(initialDate, "h");
  const initialMinute = format(initialDate, "mm");
  const initialAmPm = format(initialDate, "a");

  // Set up option groups and values based on mode
  const [datePickerValue, setDatePickerValue] = useState({
    month: initialMonth,
    day: initialDay,
    year: initialYear
  });

  const [timePickerValue, setTimePickerValue] = useState({
    hour: initialHour,
    minute: initialMinute,
    ampm: initialAmPm
  });

  const dateOptionGroups = {
    month: months,
    day: days,
    year: years
  };

  const timeOptionGroups = {
    hour: hours,
    minute: minutes,
    ampm: ampm
  };

  const handleDateChange = (newValue: any) => {
    setDatePickerValue(newValue);
    
    // Update selectedDate based on picker values
    const newMonth = months.indexOf(newValue.month);
    const newDay = parseInt(newValue.day);
    const newYear = parseInt(newValue.year);
    
    const newDate = new Date(selectedDate);
    newDate.setFullYear(newYear);
    newDate.setMonth(newMonth);
    newDate.setDate(newDay);
    setSelectedDate(newDate);
  };

  const handleTimeChange = (newValue: any) => {
    setTimePickerValue(newValue);
    
    // Update selectedDate based on picker values
    let hourValue = parseInt(newValue.hour);
    if (hourValue === 12) hourValue = 0;
    if (newValue.ampm === "PM") hourValue += 12;
    
    const minuteValue = parseInt(newValue.minute);
    
    const newDate = new Date(selectedDate);
    newDate.setHours(hourValue);
    newDate.setMinutes(minuteValue);
    setSelectedDate(newDate);
  };

  // Handle selection confirmation
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
        <div className="bg-white p-4">
          {mode === "date" ? (
            <Picker
              optionGroups={dateOptionGroups}
              valueGroups={datePickerValue}
              onChange={handleDateChange}
              height={200}
              itemHeight={40}
            />
          ) : (
            <Picker
              optionGroups={timeOptionGroups}
              valueGroups={timePickerValue}
              onChange={handleTimeChange}
              height={200}
              itemHeight={40}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default DateTimePickerWheel;
