
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Trash2, Copy } from "lucide-react";
import { PerformanceMetric, getUnitsForMetricType, getPerformanceMetricTypes } from "@/lib/mockData";
import { generateId } from "@/lib/utils";
import { toast } from "sonner";

interface PerformanceMetricInputProps {
  metrics: PerformanceMetric[];
  onUpdate: (metrics: PerformanceMetric[]) => void;
  isFirstSet?: boolean; // Flag to indicate if this is the first set (for duplication)
  onDuplicate?: () => void; // Function to duplicate the set
}

const PerformanceMetricInput: React.FC<PerformanceMetricInputProps> = ({
  metrics,
  onUpdate,
  isFirstSet = false,
  onDuplicate
}) => {
  const [newMetricType, setNewMetricType] = useState<string>("");
  
  const metricTypes = getPerformanceMetricTypes();
  
  const addMetric = (type: string) => {
    // Check if this type already exists
    if (metrics.some(m => m.type === type)) {
      toast.error(`A ${type} metric already exists`);
      return;
    }
    
    const newMetric: PerformanceMetric = {
      id: generateId(),
      type: type as any,
      value: 0,
      unit: type !== 'Repetitions' ? getUnitsForMetricType(type)[0] : undefined
    };
    
    onUpdate([...metrics, newMetric]);
    setNewMetricType("");
  };
  
  const updateMetricValue = (id: string, value: number) => {
    const updatedMetrics = metrics.map(metric => 
      metric.id === id ? { ...metric, value } : metric
    );
    onUpdate(updatedMetrics);
  };
  
  const updateMetricUnit = (id: string, unit: string) => {
    const updatedMetrics = metrics.map(metric => 
      metric.id === id ? { ...metric, unit } : metric
    );
    onUpdate(updatedMetrics);
  };
  
  const removeMetric = (id: string) => {
    const updatedMetrics = metrics.filter(metric => metric.id !== id);
    onUpdate(updatedMetrics);
  };
  
  return (
    <div className="space-y-3 p-3 bg-secondary/20 rounded-md">
      {metrics.map(metric => (
        <div key={metric.id} className="flex items-center gap-2">
          <div className="w-28 text-sm font-medium">{metric.type}:</div>
          <Input
            type="number"
            value={metric.value}
            onChange={(e) => updateMetricValue(metric.id, parseFloat(e.target.value) || 0)}
            className="h-8 w-20"
            min={0}
          />
          
          {metric.type !== 'Repetitions' && (
            <Select 
              value={metric.unit} 
              onValueChange={(value) => updateMetricUnit(metric.id, value)}
            >
              <SelectTrigger className="h-8 w-20">
                <SelectValue placeholder="Unit" />
              </SelectTrigger>
              <SelectContent>
                {getUnitsForMetricType(metric.type).map((unit) => (
                  <SelectItem key={unit} value={unit}>
                    {unit}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8" 
            onClick={() => removeMetric(metric.id)}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ))}
      
      <div className="flex items-center gap-2">
        <Select value={newMetricType} onValueChange={setNewMetricType}>
          <SelectTrigger className="h-8 w-full">
            <SelectValue placeholder="Add metric..." />
          </SelectTrigger>
          <SelectContent>
            {metricTypes
              .filter(type => !metrics.some(m => m.type === type))
              .map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
        
        <Button 
          variant="outline" 
          size="sm" 
          className="h-8" 
          onClick={() => newMetricType && addMetric(newMetricType)}
          disabled={!newMetricType}
        >
          Add
        </Button>
        
        {isFirstSet && onDuplicate && (
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8" 
            onClick={onDuplicate}
          >
            <Copy className="h-3.5 w-3.5 mr-1" />
            Duplicate
          </Button>
        )}
      </div>
    </div>
  );
};

export default PerformanceMetricInput;
