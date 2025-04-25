
import React, { useState } from "react";
import { Exercise } from "@/lib/mockData";
import { 
  ChevronDown, 
  ChevronUp, 
  Clock, 
  Dumbbell, 
  Hash, 
  StickyNote, 
  Ruler, 
  Timer, 
  Repeat 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ExerciseItemProps {
  exercise: Exercise;
}

const ExerciseItem: React.FC<ExerciseItemProps> = ({ exercise }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => setExpanded(!expanded);
  
  const getMetricIcon = (type: string) => {
    switch (type) {
      case "weight":
        return <Dumbbell className="h-3.5 w-3.5" />;
      case "distance":
        return <Ruler className="h-3.5 w-3.5" />;
      case "duration":
        return <Clock className="h-3.5 w-3.5" />;
      case "repetitions":
        return <Repeat className="h-3.5 w-3.5" />;
      case "restTime":
        return <Timer className="h-3.5 w-3.5" />;
      default:
        return <Hash className="h-3.5 w-3.5" />;
    }
  };

  // Generate a summary of the exercise
  const generateSummary = () => {
    if (!exercise.sets || exercise.sets.length === 0) return null;

    const summaries = exercise.sets[0].metrics.map(metric => {
      const range = exercise.sets?.map(set => 
        set.metrics.find(m => m.type === metric.type)?.value
      ).filter(Boolean);
      
      if (!range || range.length === 0) return null;
      
      const min = Math.min(...range);
      const max = Math.max(...range);
      
      return {
        type: metric.type,
        text: min === max ? `${min}${metric.unit}` : `${min}-${max}${metric.unit}`,
        icon: getMetricIcon(metric.type)
      };
    }).filter(Boolean);

    return summaries;
  };

  const summary = generateSummary();

  return (
    <div className="p-4 animate-fade-in">
      <div 
        className="flex items-center justify-between cursor-pointer"
        onClick={toggleExpanded}
      >
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium">{exercise.name}</h4>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 rounded-full ml-2"
              onClick={(e) => {
                e.stopPropagation();
                toggleExpanded();
              }}
            >
              {expanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </div>
          
          {!expanded && summary && (
            <div className="flex flex-wrap gap-3">
              {summary.map((item, index) => (
                <div key={index} className="flex items-center text-sm text-muted-foreground">
                  <div className="mr-1.5">{item.icon}</div>
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {expanded && exercise.sets && (
        <div className="mt-4 space-y-4">
          {exercise.sets.map((set, index) => (
            <div 
              key={set.id}
              className="bg-accent/5 rounded-lg p-3"
            >
              <Badge variant="outline" className="mb-2">
                Set {index + 1}
              </Badge>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {set.metrics.map((metric, mIndex) => (
                  <div 
                    key={mIndex}
                    className="flex items-center bg-background/50 rounded-lg p-2"
                  >
                    <div className="mr-2">
                      {getMetricIcon(metric.type)}
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground capitalize">
                        {metric.type}
                      </div>
                      <div className="font-medium">
                        {metric.value} {metric.unit}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {exercise.notes && (
            <div className="mt-4">
              <div className="flex items-center gap-2 text-sm font-medium mb-2">
                <StickyNote className="h-4 w-4" />
                Notes
              </div>
              <p className="text-sm text-muted-foreground">{exercise.notes}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ExerciseItem;
