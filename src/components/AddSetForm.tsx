
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { X, Plus } from "lucide-react";
import { ExerciseMetric } from "@/lib/mockData";

interface AddSetFormProps {
  onAddSet: (metrics: ExerciseMetric[]) => void;
  onCancel: () => void;
}

const AddSetForm: React.FC<AddSetFormProps> = ({ onAddSet, onCancel }) => {
  const [metrics, setMetrics] = useState<ExerciseMetric[]>([
    { type: "repetitions", value: 10, unit: "reps" }
  ]);

  const addMetric = () => {
    setMetrics([...metrics, { type: "weight", value: 0, unit: "kg" }]);
  };

  const removeMetric = (index: number) => {
    setMetrics(metrics.filter((_, i) => i !== index));
  };

  const updateMetric = (index: number, field: keyof ExerciseMetric, value: any) => {
    const updatedMetrics = [...metrics];
    updatedMetrics[index] = { ...updatedMetrics[index], [field]: value };
    setMetrics(updatedMetrics);
  };

  const handleSubmit = () => {
    // Validate metrics
    if (metrics.length === 0 || metrics.some(m => m.type === "")) {
      return;
    }
    
    onAddSet(metrics);
  };

  return (
    <div className="p-4 border-t border-border bg-muted/30 animate-in fade-in slide-in-from-top">
      <h3 className="text-sm font-medium mb-3">Add New Set</h3>
      
      <div className="space-y-3">
        {metrics.map((metric, index) => (
          <div key={index} className="flex items-center gap-2">
            <Select
              value={metric.type}
              onValueChange={(value) => updateMetric(index, "type", value)}
            >
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Metric type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weight">Weight</SelectItem>
                <SelectItem value="repetitions">Repetitions</SelectItem>
                <SelectItem value="duration">Duration</SelectItem>
                <SelectItem value="distance">Distance</SelectItem>
                <SelectItem value="restTime">Rest Time</SelectItem>
              </SelectContent>
            </Select>
            
            <Input
              type="number"
              value={metric.value}
              onChange={(e) => updateMetric(index, "value", parseFloat(e.target.value) || 0)}
              className="w-20"
            />
            
            <Select
              value={metric.unit}
              onValueChange={(value) => updateMetric(index, "unit", value)}
            >
              <SelectTrigger className="w-24">
                <SelectValue placeholder="Unit" />
              </SelectTrigger>
              <SelectContent>
                {metric.type === "weight" && (
                  <>
                    <SelectItem value="kg">kg</SelectItem>
                    <SelectItem value="lbs">lbs</SelectItem>
                  </>
                )}
                {metric.type === "repetitions" && (
                  <SelectItem value="reps">reps</SelectItem>
                )}
                {metric.type === "duration" && (
                  <>
                    <SelectItem value="sec">sec</SelectItem>
                    <SelectItem value="min">min</SelectItem>
                  </>
                )}
                {metric.type === "distance" && (
                  <>
                    <SelectItem value="m">m</SelectItem>
                    <SelectItem value="km">km</SelectItem>
                    <SelectItem value="miles">miles</SelectItem>
                  </>
                )}
                {metric.type === "restTime" && (
                  <>
                    <SelectItem value="sec">sec</SelectItem>
                    <SelectItem value="min">min</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeMetric(index)}
              className="h-8 w-8 p-0"
              disabled={metrics.length === 1}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
      
      <Button 
        variant="outline" 
        size="sm" 
        onClick={addMetric}
        className="mt-3 w-full"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Another Metric
      </Button>
      
      <div className="flex justify-end gap-2 mt-4">
        <Button variant="ghost" size="sm" onClick={onCancel}>
          Cancel
        </Button>
        <Button size="sm" onClick={handleSubmit}>
          Add Set
        </Button>
      </div>
    </div>
  );
};

export default AddSetForm;
