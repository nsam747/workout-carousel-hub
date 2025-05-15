import React from "react";
import { Exercise } from "@/lib/mockData";
import { Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface ExerciseItemProps {
  exercise: Exercise;
  workoutId: string;
  isReadOnly?: boolean;
}

const ExerciseItem: React.FC<ExerciseItemProps> = ({ exercise, workoutId, isReadOnly = false }) => {
  const navigate = useNavigate();

  const handleEditExercise = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/edit-exercise/${exercise.id}?workoutId=${workoutId}`);
  };

  return (
    <div className="px-4 py-3 flex items-center justify-between border-b border-border/40">
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-sm">{exercise.name}</h4>
        <p className="text-xs text-muted-foreground">
          {exercise.sets.length} sets
        </p>
      </div>
      {!isReadOnly && (
        <div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full"
            onClick={handleEditExercise}
            title="Edit Exercise"
          >
            <Edit2 className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default ExerciseItem;
