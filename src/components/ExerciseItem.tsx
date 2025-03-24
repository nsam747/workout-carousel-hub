
import React, { useState } from "react";
import { Exercise } from "@/lib/mockData";
import { ChevronDown, ChevronUp, Clock, Dumbbell, Hash, StickyNote } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ExerciseItemProps {
  exercise: Exercise;
}

const ExerciseItem: React.FC<ExerciseItemProps> = ({ exercise }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => setExpanded(!expanded);

  return (
    <div className="mb-3 rounded-md bg-white/90 border border-border shadow-sm overflow-hidden animate-slide-up animation-delay-100">
      <div 
        className="p-3 cursor-pointer flex items-center justify-between"
        onClick={toggleExpanded}
      >
        <div className="flex-1">
          <h4 className="font-medium">{exercise.name}</h4>
          <div className="flex items-center text-sm text-muted-foreground mt-1 space-x-3">
            {exercise.sets && (
              <div className="flex items-center">
                <Hash className="h-3 w-3 mr-1" />
                <span>{exercise.sets} sets</span>
              </div>
            )}
            {exercise.reps && (
              <div className="flex items-center">
                <Hash className="h-3 w-3 mr-1" />
                <span>{exercise.reps} reps</span>
              </div>
            )}
            {exercise.weight && (
              <div className="flex items-center">
                <Dumbbell className="h-3 w-3 mr-1" />
                <span>{exercise.weight} lbs</span>
              </div>
            )}
            {exercise.duration && (
              <div className="flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                <span>{exercise.duration} min</span>
              </div>
            )}
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full"
          onClick={(e) => {
            e.stopPropagation();
            toggleExpanded();
          }}
        >
          {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </div>

      {expanded && (
        <div className="p-3 pt-0 border-t border-border/50 animate-slide-down">
          {exercise.notes && (
            <div className="mb-3">
              <div className="flex items-center text-sm font-medium mb-1">
                <StickyNote className="h-4 w-4 mr-1.5" />
                <span>Notes</span>
              </div>
              <p className="text-sm text-muted-foreground">{exercise.notes}</p>
            </div>
          )}

          {exercise.mediaUrls && exercise.mediaUrls.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Media</p>
              <div className="grid grid-cols-2 gap-2">
                {exercise.mediaUrls.map((url, index) => (
                  <div 
                    key={index} 
                    className="rounded-md overflow-hidden aspect-video border border-border relative"
                  >
                    <img
                      src={url}
                      alt={`${exercise.name} media ${index + 1}`}
                      className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ExerciseItem;
