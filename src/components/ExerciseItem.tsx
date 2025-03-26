
import React, { useState } from "react";
import { Exercise } from "@/lib/mockData";
import { ChevronDown, ChevronUp, Clock, Dumbbell, Hash, StickyNote, Ruler, Timer, Repeat, Clock3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";

interface ExerciseItemProps {
  exercise: Exercise;
}

const ExerciseItem: React.FC<ExerciseItemProps> = ({ exercise }) => {
  const [expanded, setExpanded] = useState(false);
  const isMobile = useIsMobile();

  const toggleExpanded = () => setExpanded(!expanded);

  // Helper to get total reps/weight from sets if available
  const getTotalSets = () => exercise.sets?.length || 0;
  const hasReps = exercise.sets?.some(set => set.reps > 0);
  const hasWeight = exercise.sets?.some(set => set.weight > 0);
  
  // Helper to get icon for metric type
  const getMetricIcon = (type: string) => {
    switch (type) {
      case "weight":
        return <Dumbbell className="h-3 w-3 mr-1" />;
      case "distance":
        return <Ruler className="h-3 w-3 mr-1" />;
      case "duration":
        return <Clock className="h-3 w-3 mr-1" />;
      case "repetitions":
        return <Repeat className="h-3 w-3 mr-1" />;
      case "restTime":
        return <Timer className="h-3 w-3 mr-1" />;
      default:
        return <Hash className="h-3 w-3 mr-1" />;
    }
  };

  return (
    <div className="mb-3 rounded-md bg-white/90 border border-border shadow-sm overflow-hidden animate-slide-up animation-delay-100">
      <div 
        className="p-3 cursor-pointer flex items-center justify-between"
        onClick={toggleExpanded}
      >
        <div className="flex-1">
          <h4 className="font-medium">{exercise.name}</h4>
          <div className="flex items-center text-sm text-muted-foreground mt-1 space-x-3">
            {getTotalSets() > 0 && (
              <div className="flex items-center">
                <Hash className="h-3 w-3 mr-1" />
                <span>{getTotalSets()} sets</span>
              </div>
            )}
            {hasReps && (
              <div className="flex items-center">
                <Repeat className="h-3 w-3 mr-1" />
                <span>With reps</span>
              </div>
            )}
            {hasWeight && (
              <div className="flex items-center">
                <Dumbbell className="h-3 w-3 mr-1" />
                <span>With weights</span>
              </div>
            )}
            {exercise.duration > 0 && (
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
          {/* Performance metrics */}
          {exercise.metrics && exercise.metrics.length > 0 && (
            <div className="mb-3">
              <div className="flex items-center text-sm font-medium mb-2">
                <Dumbbell className="h-4 w-4 mr-1.5" />
                <span>Performance</span>
              </div>
              <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-2'} gap-2`}>
                {exercise.metrics.map((metric, index) => (
                  <div key={index} className="bg-muted/50 p-2 rounded-md">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">Set {index + 1}</Badge>
                    </div>
                    <div className="mt-1.5 flex items-center">
                      {getMetricIcon(metric.type)}
                      <span className="text-sm">
                        {metric.value} {metric.unit}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {exercise.notes && (
            <div className="mb-3">
              <div className="flex items-center text-sm font-medium mb-1">
                <StickyNote className="h-4 w-4 mr-1.5" />
                <span>Notes</span>
              </div>
              <p className="text-sm text-muted-foreground">{exercise.notes}</p>
            </div>
          )}

          {exercise.media && exercise.media.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Media</p>
              <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-2'} gap-2`}>
                {exercise.media.map((url, index) => (
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
