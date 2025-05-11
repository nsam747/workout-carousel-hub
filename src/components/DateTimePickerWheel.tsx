
import React, { useState, useEffect } from "react";
import Picker from "react-mobile-picker";
import { format, setHours, setMinutes, setDate, setMonth, setYear } from "date-fns";

// Import the Picker component without type checking
// This avoids conflicts with any existing type definitions
const MobilePicker = Picker as any;

interface DateTimePickerWheelProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (date: Date) => void;
  initialDate: Date;
  mode: "date" | "time";
}

// Define types for the picker values
type DatePickerValue = {
  month: number;
  day: number;
  year: number;
};

type TimePickerValue = {
  hour: number;
  minute: number;
  ampm: string;
};

const DateTimePickerWheel: React.FC<DateTimePickerWheelProps> = ({
  isOpen,
  onClose,
  onSelect,
  initialDate,
  mode
}) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(initialDate));
  
  // Reset selectedDate when initialDate changes or the picker opens
  useEffect(() => {
    if (isOpen) {
      setSelectedDate(new Date(initialDate));
    }
  }, [initialDate, isOpen]);

  // Generate arrays for months, days, years, hours, minutes, ampm
  const months = Array.from({ length: 12 }, (_, i) => {
    const month = format(new Date(2000, i, 1), "MMMM");
    return { label: month, value: i };
  });
  
  const getCurrentMonthDays = () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => {
      return { label: String(i + 1), value: i + 1 };
    });
  };
  
  const [days, setDays] = useState(getCurrentMonthDays());
  
  useEffect(() => {
    setDays(getCurrentMonthDays());
  }, [selectedDate.getMonth(), selectedDate.getFullYear()]);
  
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => {
    const year = currentYear - 2 + i;
    return { label: String(year), value: year };
  });
  
  const hours = Array.from({ length: 12 }, (_, i) => {
    const hour = i === 0 ? 12 : i;
    return { label: String(hour), value: hour };
  });
  
  const minutes = Array.from({ length: 60 }, (_, i) => {
    return { label: String(i).padStart(2, "0"), value: i };
  });
  
  const ampm = [
    { label: "AM", value: "AM" }, 
    { label: "PM", value: "PM" }
  ];

  // Setup initial picker values based on the selected date
  const [datePickerValue, setDatePickerValue] = useState<DatePickerValue>({
    month: selectedDate.getMonth(),
    day: selectedDate.getDate(),
    year: selectedDate.getFullYear(),
  });

  const [timePickerValue, setTimePickerValue] = useState<TimePickerValue>({
    hour: selectedDate.getHours() % 12 === 0 ? 12 : selectedDate.getHours() % 12,
    minute: selectedDate.getMinutes(),
    ampm: selectedDate.getHours() >= 12 ? "PM" : "AM",
  });

  // Update the date picker value when selected date changes
  useEffect(() => {
    setDatePickerValue({
      month: selectedDate.getMonth(),
      day: selectedDate.getDate(),
      year: selectedDate.getFullYear(),
    });
    
    setTimePickerValue({
      hour: selectedDate.getHours() % 12 === 0 ? 12 : selectedDate.getHours() % 12,
      minute: selectedDate.getMinutes(),
      ampm: selectedDate.getHours() >= 12 ? "PM" : "AM",
    });
  }, [selectedDate]);

  // Handle date picker value change
  const handleDateChange = (newValue: DatePickerValue) => {
    setDatePickerValue(newValue);
    
    const newDate = new Date(selectedDate);
    setMonth(newDate, newValue.month);
    setDate(newDate, newValue.day);
    setYear(newDate, newValue.year);
    
    setSelectedDate(newDate);
  };

  // Handle time picker value change
  const handleTimeChange = (newValue: TimePickerValue) => {
    setTimePickerValue(newValue);
    
    const newDate = new Date(selectedDate);
    let hourValue = newValue.hour;
    if (hourValue === 12) hourValue = 0;
    if (newValue.ampm === "PM") hourValue += 12;
    setHours(newDate, hourValue);
    setMinutes(newDate, newValue.minute);
    
    setSelectedDate(newDate);
  };

  // Handle confirmation
  const handleConfirm = () => {
    onSelect(selectedDate);
    onClose();
  };

  if (!isOpen) return null;

  // Create the column content for the date picker
  const dateColumns = {
    month: months,
    day: days,
    year: years
  };

  // Create the column content for the time picker
  const timeColumns = {
    hour: hours,
    minute: minutes,
    ampm: ampm
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="fixed bottom-0 left-0 right-0 z-50 flex flex-col rounded-t-xl overflow-hidden shadow-lg animate-in slide-in-from-bottom">
        {/* Header with Cancel and Done buttons */}
        <div className="flex items-center justify-between bg-primary px-4 py-3">
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
        <div className="bg-white">
          {mode === "date" ? (
            <div className="relative">
              <div className="picker-highlight absolute z-10 pointer-events-none"></div>
              <MobilePicker
                value={datePickerValue}
                onChange={handleDateChange}
                height={200}
                itemHeight={40}
                valueGroups={datePickerValue}
                optionGroups={dateColumns}
              />
            </div>
          ) : (
            <div className="relative">
              <div className="picker-highlight absolute z-10 pointer-events-none"></div>
              <MobilePicker
                value={timePickerValue}
                onChange={handleTimeChange}
                height={200}
                itemHeight={40}
                valueGroups={timePickerValue}
                optionGroups={timeColumns}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DateTimePickerWheel;
