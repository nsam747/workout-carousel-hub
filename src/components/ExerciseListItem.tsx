
import React, { useState } from "react";
import { Trash, ChevronDown, ChevronUp, Image, Edit, Plus, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Exercise } from "@/lib/mockData";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import PerformanceMetricForm, { PerformanceMetric } from "./PerformanceMetricForm";

interface ExerciseListItemProps {
  exercise: Exercise;
  onRemove: (id: string) => void;
}

interface SetData {
  id: string;
  metrics: PerformanceMetric[];
}

const ExerciseListItem: React.FC<ExerciseListItemProps> = ({ 
  exercise,
  onRemove
}) => {
  const [expanded, setExpanded] = useState(false);
  const [notes, setNotes] = useState(exercise.notes || "");
  const [sets, setSets] = useState<SetData[]>([]);
  const [showAddMetric, setShowAddMetric] = useState(false);
  const [editingSetId, setEditingSetId] = useState<string | null>(null);
  
  const handleAddMetric = (metric: PerformanceMetric) => {
    if (editingSetId) {
      // Adding a metric to an existing set
      setSets(prevSets => 
        prevSets.map(set => 
          set.id === editingSetId 
            ? { ...set, metrics: [...set.metrics, metric] }
            : set
        )
      );
    } else {
      // Creating a new set with the metric
      const newSet: SetData = {
        id: generateId(),
        metrics: [metric]
      };
      setSets([...sets, newSet]);
    }
    setShowAddMetric(false);
    setEditingSetId(null);
  };

  const handleRemoveSet = (setId: string) => {
    setSets(sets.filter(set => set.id !== setId));
  };

  const handleDuplicateSet = (setToDuplicate: SetData) => {
    const duplicatedSet: SetData = {
      id: generateId(),
      metrics: setToDuplicate.metrics.map(metric => ({
        ...metric,
        id: generateId()
      }))
    };
    setSets([...sets, duplicatedSet]);
  };

  // Format metric for display
  const formatMetric = (metric: PerformanceMetric) => {
    return `${metric.value} ${metric.unit}`;
  };

  const generateId = () => Math.random().toString(36).substring(2, 11);

  return (
    <Card className="overflow-hidden animate-scale-in">
      <div className="p-3 flex items-center justify-between cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div className="flex items-center gap-2">
          <span className="font-medium">{exercise.name}</span>
          <Badge variant="outline" className="text-xs">
            {exercise.type}
          </Badge>
        </div>
        
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full"
            onClick={(e) => {
              e.stopPropagation();
              onRemove(exercise.id);
            }}
          >
            <Trash className="h-4 w-4 text-destructive" />
            <span className="sr-only">Remove</span>
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full"
            onClick={(e) => {
              e.stopPropagation();
              setExpanded(!expanded);
            }}
          >
            {expanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
      
      {expanded && (
        <CardContent className="pt-0 pb-3 animate-fade-in">
          <div className="space-y-3">
            {/* Performance metrics section */}
            <div>
              <h4 className="text-sm font-medium mb-2">Performance</h4>
              
              {sets.length > 0 ? (
                <div className="space-y-2 mb-3">
                  {sets.map((set, index) => (
                    <div 
                      key={set.id}
                      className="p-2 bg-muted/50 rounded-md"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium">Set {index + 1}</span>
                        <div className="flex items-center gap-1">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6"
                            onClick={() => handleDuplicateSet(set)}
                          >
                            <Copy className="h-3 w-3" />
                            <span className="sr-only">Duplicate</span>
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6"
                            onClick={() => handleRemoveSet(set.id)}
                          >
                            <Trash className="h-3 w-3 text-destructive" />
                            <span className="sr-only">Remove</span>
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {set.metrics.map(metric => (
                          <Badge 
                            key={metric.id} 
                            variant="secondary" 
                            className="flex items-center gap-1 capitalize"
                          >
                            {metric.type}: {formatMetric(metric)}
                          </Badge>
                        ))}
                      </div>
                      
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-6 text-xs mt-1.5" 
                        onClick={() => {
                          setEditingSetId(set.id);
                          setShowAddMetric(true);
                        }}
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Add metric
                      </Button>
                    </div>
                  ))}
                </div>
              ) : null}

              {showAddMetric ? (
                <div className="border rounded-md p-3 mb-3 bg-card">
                  <PerformanceMetricForm
                    onSave={handleAddMetric}
                    onCancel={() => {
                      setShowAddMetric(false);
                      setEditingSetId(null);
                    }}
                    previousMetrics={sets.flatMap(set => set.metrics)}
                  />
                </div>
              ) : (
                <Button variant="outline" size="sm" className="h-7 text-xs mb-3" onClick={() => setShowAddMetric(true)}>
                  <Plus className="h-3 w-3 mr-1" />
                  Add set
                </Button>
              )}
            </div>
            
            {/* Notes section */}
            <div>
              <h4 className="text-sm font-medium mb-2">Notes</h4>
              <Textarea
                placeholder="Add notes about this exercise..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="min-h-[80px] text-sm"
              />
            </div>
            
            {/* Media section */}
            <div>
              <h4 className="text-sm font-medium mb-2">Media</h4>
              <Button variant="outline" size="sm" className="h-7 text-xs">
                <Image className="h-3 w-3 mr-1" />
                Add photo
              </Button>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default ExerciseListItem;
