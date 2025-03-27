
import React, { useState, useRef } from "react";
import { Tag, Edit } from "lucide-react";
import { cn } from "@/lib/utils";
import { getCategoryInfo } from "@/lib/mockData";
import * as LucideIcons from "lucide-react";

interface CategorySelectorProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  onLongPress?: (category: string) => void;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  onLongPress
}) => {
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null);
  const [touchedCategory, setTouchedCategory] = useState<string | null>(null);
  
  // Function to handle mouse/touch down event
  const handleTouchStart = (category: string) => {
    setTouchedCategory(category);
    if (onLongPress) {
      const timer = setTimeout(() => {
        onLongPress(category);
      }, 500); // 500ms for long press
      setLongPressTimer(timer);
    }
  };
  
  // Function to handle mouse/touch up event
  const handleTouchEnd = (category: string) => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
    
    // Only trigger selection if it's the same category that started the touch
    if (touchedCategory === category) {
      onSelectCategory(category);
    }
    
    setTouchedCategory(null);
  };
  
  // Handle touch move out
  const handleTouchMove = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
    setTouchedCategory(null);
  };
  
  // Function to determine contrasting text color based on background
  const getContrastColor = (hexColor: string) => {
    // Convert hex to RGB
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    
    // Calculate relative luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    
    // Return black for bright colors, white for dark
    return luminance > 0.5 ? "#000000" : "#FFFFFF";
  };
  
  // Render icon by name if it exists
  const renderCategoryIcon = (iconName: string | null, color: string) => {
    if (!iconName) return null;
    
    // Get icon component by name
    const IconComponent = (LucideIcons as any)[iconName];
    if (!IconComponent) return null;
    
    return <IconComponent size={14} color={color} className="mr-1" />;
  };
  
  return (
    <div>
      <div className="flex items-center text-sm font-medium mb-2">
        <Tag className="h-4 w-4 mr-2" />
        <span>Category</span>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => {
          const isSelected = category === selectedCategory;
          const categoryInfo = getCategoryInfo(category);
          const textColor = getContrastColor(categoryInfo.color);
          
          return (
            <div
              key={category}
              className={cn(
                "px-3 py-1.5 rounded-full cursor-pointer flex items-center transition-all",
                isSelected ? "ring-2 ring-primary" : "hover:ring-1 hover:ring-border"
              )}
              style={{ 
                backgroundColor: categoryInfo.color,
                color: textColor,
              }}
              onMouseDown={() => handleTouchStart(category)}
              onMouseUp={() => handleTouchEnd(category)}
              onMouseLeave={handleTouchMove}
              onTouchStart={() => handleTouchStart(category)}
              onTouchEnd={() => handleTouchEnd(category)}
              onTouchMove={handleTouchMove}
              onContextMenu={(e) => {
                e.preventDefault();
                if (onLongPress) onLongPress(category);
              }}
            >
              {categoryInfo.icon && renderCategoryIcon(categoryInfo.icon, textColor)}
              <span>{category}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CategorySelector;
