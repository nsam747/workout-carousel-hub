
import React, { useState, useEffect } from "react";
import Picker from "react-mobile-picker";
import { format, setHours, setMinutes, setDate, setMonth, setYear } from "date-fns";

// Import the Picker component as any type to avoid TypeScript errors
const MobilePicker = Picker as any;

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
    return month;
  });
  
  const getCurrentMonthDays = () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => String(i + 1));
  };
  
  const [days, setDays] = useState(getCurrentMonthDays());
  
  useEffect(() => {
    setDays(getCurrentMonthDays());
  }, [selectedDate.getMonth(), selectedDate.getFullYear()]);
  
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => {
    const year = currentYear - 2 + i;
    return String(year);
  });
  
  const hours = Array.from({ length: 12 }, (_, i) => {
    const hour = i === 0 ? 12 : i;
    return String(hour);
  });
  
  const minutes = Array.from({ length: 60 }, (_, i) => {
    return String(i).padStart(2, "0");
  });
  
  const ampm = ["AM", "PM"];

  // Setup initial picker values based on the selected date
  const [datePickerValue, setDatePickerValue] = useState({
    month: months[selectedDate.getMonth()],
    day: String(selectedDate.getDate()),
    year: String(selectedDate.getFullYear()),
  });

  const [timePickerValue, setTimePickerValue] = useState({
    hour: String(selectedDate.getHours() % 12 === 0 ? 12 : selectedDate.getHours() % 12),
    minute: String(selectedDate.getMinutes()).padStart(2, "0"),
    ampm: selectedDate.getHours() >= 12 ? "PM" : "AM",
  });

  // Update the picker values when selected date changes
  useEffect(() => {
    setDatePickerValue({
      month: months[selectedDate.getMonth()],
      day: String(selectedDate.getDate()),
      year: String(selectedDate.getFullYear()),
    });
    
    setTimePickerValue({
      hour: String(selectedDate.getHours() % 12 === 0 ? 12 : selectedDate.getHours() % 12),
      minute: String(selectedDate.getMinutes()).padStart(2, "0"),
      ampm: selectedDate.getHours() >= 12 ? "PM" : "AM",
    });
  }, [selectedDate, months]);

  // Handle date picker value change
  const handleDateChange = (newValue: any) => {
    setDatePickerValue(newValue);
    
    const monthIndex = months.indexOf(newValue.month);
    const dayNumber = parseInt(newValue.day, 10);
    const yearNumber = parseInt(newValue.year, 10);
    
    const newDate = new Date(selectedDate);
    setMonth(newDate, monthIndex);
    setDate(newDate, dayNumber);
    setYear(newDate, yearNumber);
    
    setSelectedDate(newDate);
  };

  // Handle time picker value change
  const handleTimeChange = (newValue: any) => {
    setTimePickerValue(newValue);
    
    let hourValue = parseInt(newValue.hour, 10);
    if (hourValue === 12) hourValue = 0;
    if (newValue.ampm === "PM") hourValue += 12;
    
    const minuteValue = parseInt(newValue.minute, 10);
    
    const newDate = new Date(selectedDate);
    setHours(newDate, hourValue);
    setMinutes(newDate, minuteValue);
    
    setSelectedDate(newDate);
  };

  // Handle confirmation
  const handleConfirm = () => {
    onSelect(selectedDate);
    onClose();
  };

  if (!isOpen) return null;

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
                optionGroups={{
                  month: months,
                  day: days,
                  year: years
                }}
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
                optionGroups={{
                  hour: hours,
                  minute: minutes,
                  ampm: ampm
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DateTimePickerWheel;
