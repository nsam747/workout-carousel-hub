
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Exercise, getCategoryInfo } from '@/lib/mockData';
import { generateExerciseSummary } from '@/lib/exerciseUtils';

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
  
  return (
    <div className="space-y-6 mt-4">
      {Object.keys(exercisesByCategory).map(category => (
        <div key={category}>
          <h3 className="text-lg font-semibold mb-2">{category}</h3>
          <div className="space-y-2">
            {exercisesByCategory[category].map(exercise => {
              const categoryInfo = getCategoryInfo(exercise.type);
              return (
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
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: categoryInfo.color }}
                    />
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      ))}
      
      {Object.keys(exercisesByCategory).length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No exercises found. Try a different search or category.
        </div>
      )}
    </div>
  );
};

export default ExercisesList;
