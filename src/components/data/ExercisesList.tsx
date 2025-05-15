
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Exercise, getCategoryInfo } from '@/lib/mockData';
import { generateExerciseSummary } from '@/lib/exerciseUtils';
import { cn } from '@/lib/utils';
import * as LucideIcons from 'lucide-react';

interface ExercisesListProps {
  exercises: Exercise[];
}

const ExercisesList: React.FC<ExercisesListProps> = ({ exercises }) => {
  const navigate = useNavigate();
  
  // Group exercises by type (category)
  const exercisesByCategory: Record<string, Exercise[]> = {};
  exercises.forEach(exercise => {
    if (!exercisesByCategory[exercise.type]) {
      exercisesByCategory[exercise.type] = [];
    }
    exercisesByCategory[exercise.type].push(exercise);
  });
  
  // Function to determine contrasting text color (black or white) based on background
  const getContrastColor = (hexColor: string) => {
    // Convert hex to RGB
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    // Calculate luminance - perceived brightness
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    // Return black for bright colors, white for dark colors
    return luminance > 0.5 ? "#000000" : "#FFFFFF";
  };
  
  // Function to get a complementary border color with opacity
  const getBorderColor = (hexColor: string) => {
    // Convert hex to RGB
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);

    // Adjust brightness slightly for border
    const darkerR = Math.max(0, r - 30);
    const darkerG = Math.max(0, g - 30);
    const darkerB = Math.max(0, b - 30);

    // Return with 40% opacity
    return `rgba(${darkerR}, ${darkerG}, ${darkerB}, 0.4)`;
  };
  
  // Render icon by name if it exists
  const renderCategoryIcon = (iconName: string | null, color: string) => {
    if (!iconName) return null;
    
    // Get the icon component by name
    const IconComponent = (LucideIcons as any)[iconName];
    if (!IconComponent) return null;
    
    return <IconComponent size={16} color={color} className="mr-1" />;
  };
  
  return (
    <div className="space-y-6 mt-4">
      {Object.keys(exercisesByCategory).map(category => {
        const categoryInfo = getCategoryInfo(category);
        return (
          <div key={category}>
            <div className="mb-4">
              <span
                className={cn(
                  "flex items-center text-sm py-2 px-4 rounded-full",
                  "max-w-full"
                )}
                style={{
                  backgroundColor: categoryInfo.color,
                  color: getContrastColor(categoryInfo.color),
                  borderColor: getBorderColor(categoryInfo.color),
                  borderWidth: "1.5px",
                  display: "inline-flex"
                }}
              >
                {categoryInfo.icon && renderCategoryIcon(categoryInfo.icon, getContrastColor(categoryInfo.color))}
                {category}
              </span>
            </div>
            <div className="space-y-2">
              {exercisesByCategory[category].map(exercise => (
                <Card 
                  key={exercise.id}
                  className="p-4 cursor-pointer hover:bg-accent/50 transition-colors"
                  onClick={() => navigate(`/exercise/${exercise.id}`)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{exercise.name}</h4>
                      <div className="text-xs text-muted-foreground">
                        {generateExerciseSummary(exercise)}
                      </div>
                    </div>
                    <span 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: categoryInfo.color }}
                    />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        );
      })}
      
      {Object.keys(exercisesByCategory).length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No exercises found. Try a different search or category.
        </div>
      )}
    </div>
  );
};

export default ExercisesList;
