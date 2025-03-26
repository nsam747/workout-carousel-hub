
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
import { Label } from "@/components/ui/label";
import { Copy, Save, X } from "lucide-react";

export interface PerformanceMetric {
  id: string;
  type: string;
  value: number;
  unit: string;
}

interface PerformanceMetricFormProps {
  onSave: (metric: PerformanceMetric) => void;
  onCancel: () => void;
  previousMetrics?: PerformanceMetric[];
}

const generateId = () => Math.random().toString(36).substring(2, 11);

const PerformanceMetricForm: React.FC<PerformanceMetricFormProps> = ({
  onSave,
  onCancel,
  previousMetrics = []
}) => {
  const [metricType, setMetricType] = useState("weight");
  const [value, setValue] = useState<number>(0);
  const [unit, setUnit] = useState<string>("");

  // Set default unit when metric type changes
  React.useEffect(() => {
    switch (metricType) {
      case "weight":
        setUnit("kg");
        break;
      case "distance":
        setUnit("km");
        break;
      case "duration":
        setUnit("minutes");
        break;
      case "repetitions":
        setUnit("reps");
        break;
      case "restTime":
        setUnit("seconds");
        break;
    }
  }, [metricType]);

  const handleSave = () => {
    if (value === 0 && metricType !== "restTime") {
      return; // Don't save if no value (except for rest time which can be 0)
    }
    
    onSave({
      id: generateId(),
      type: metricType,
      value,
      unit
    });
  };

  const handleDuplicate = (metric: PerformanceMetric) => {
    setMetricType(metric.type);
    setValue(metric.value);
    setUnit(metric.unit);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="text-sm font-medium">Add Performance Metric</h4>
        <Button variant="ghost" size="icon" onClick={onCancel}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-3">
        {/* Metric Type */}
        <div className="space-y-1.5">
          <Label htmlFor="metric-type">Metric Type</Label>
          <Select 
            value={metricType} 
            onValueChange={setMetricType}
          >
            <SelectTrigger id="metric-type">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weight">Weight</SelectItem>
              <SelectItem value="distance">Distance</SelectItem>
              <SelectItem value="duration">Duration</SelectItem>
              <SelectItem value="repetitions">Repetitions</SelectItem>
              <SelectItem value="restTime">Rest Time</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Value */}
        <div className="space-y-1.5">
          <Label htmlFor="metric-value">Value</Label>
          <Input
            id="metric-value"
            type="number"
            min={0}
            step={metricType === "weight" ? 2.5 : 1}
            value={value}
            onChange={(e) => setValue(Number(e.target.value))}
          />
        </div>

        {/* Unit selection for applicable metrics */}
        {(metricType === "weight" || metricType === "distance" || 
          metricType === "duration" || metricType === "restTime") && (
          <div className="space-y-1.5">
            <Label htmlFor="metric-unit">Unit</Label>
            <Select 
              value={unit} 
              onValueChange={setUnit}
            >
              <SelectTrigger id="metric-unit">
                <SelectValue placeholder="Select unit" />
              </SelectTrigger>
              <SelectContent>
                {metricType === "weight" && (
                  <>
                    <SelectItem value="kg">kg</SelectItem>
                    <SelectItem value="lb">lb</SelectItem>
                  </>
                )}
                {metricType === "distance" && (
                  <>
                    <SelectItem value="km">km</SelectItem>
                    <SelectItem value="miles">miles</SelectItem>
                  </>
                )}
                {metricType === "duration" && (
                  <>
                    <SelectItem value="seconds">seconds</SelectItem>
                    <SelectItem value="minutes">minutes</SelectItem>
                    <SelectItem value="hours">hours</SelectItem>
                  </>
                )}
                {metricType === "restTime" && (
                  <>
                    <SelectItem value="seconds">seconds</SelectItem>
                    <SelectItem value="minutes">minutes</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-2">
          <Button onClick={handleSave} className="gap-1.5">
            <Save className="h-4 w-4" />
            Save
          </Button>
        </div>
      </div>

      {/* Previous metrics for duplication */}
      {previousMetrics.length > 0 && (
        <div className="pt-2 border-t">
          <h5 className="text-sm font-medium mb-2">Duplicate from previous</h5>
          <div className="flex flex-wrap gap-2">
            {previousMetrics.map((metric, index) => (
              <Button 
                key={metric.id}
                variant="outline" 
                size="sm" 
                onClick={() => handleDuplicate(metric)}
                className="text-xs flex items-center gap-1 h-7"
              >
                <Copy className="h-3 w-3" />
                Set {index + 1}: {metric.value} {metric.unit}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PerformanceMetricForm;
