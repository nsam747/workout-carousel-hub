
import React, { useState } from 'react';
import { X, Plus, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { useSupportedMetrics } from '@/hooks/useExerciseData';
import { ExerciseMetric } from '@/lib/mockData';

interface AddSetFormProps {
  onAddSet: (metrics: ExerciseMetric[]) => void;
  onCancel: () => void;
  initialMetrics?: ExerciseMetric[];
}

const AddSetForm: React.FC<AddSetFormProps> = ({ onAddSet, onCancel, initialMetrics = [] }) => {
  const { supportedMetrics, loading } = useSupportedMetrics();
  const [metrics, setMetrics] = useState<ExerciseMetric[]>(
    initialMetrics.length > 0 
      ? initialMetrics 
      : [{ type: 'repetitions', value: 0, unit: 'reps' }]
  );

  const handleMetricChange = (index: number, field: keyof ExerciseMetric, value: string | number) => {
    const updatedMetrics = [...metrics];
    
    if (field === 'type') {
      const metricType = value as string;
      const defaultMetric = supportedMetrics.find(m => m.type === metricType);
      
      if (defaultMetric) {
        updatedMetrics[index] = {
          type: metricType,
          value: 0,
          unit: defaultMetric.defaultUnit
        };
      }
    } else if (field === 'value') {
      updatedMetrics[index] = {
        ...updatedMetrics[index],
        value: typeof value === 'number' ? value : parseFloat(value) || 0
      };
    } else if (field === 'unit') {
      updatedMetrics[index] = {
        ...updatedMetrics[index],
        unit: value as string
      };
    }
    
    setMetrics(updatedMetrics);
  };

  const addMetricField = () => {
    setMetrics([...metrics, { type: 'repetitions', value: 0, unit: 'reps' }]);
  };

  const removeMetricField = (index: number) => {
    const updatedMetrics = [...metrics];
    updatedMetrics.splice(index, 1);
    setMetrics(updatedMetrics);
  };

  const handleSubmit = () => {
    onAddSet(metrics);
  };

  const getAvailableUnits = (metricType: string) => {
    const metric = supportedMetrics.find(m => m.type === metricType);
    return metric ? metric.availableUnits : [''];
  };

  if (loading) {
    return <div>Loading metrics...</div>;
  }

  return (
    <div className="border-t border-border p-4 space-y-4 animate-slide-up">
      <h4 className="font-medium">Add Set</h4>
      
      {metrics.map((metric, index) => (
        <div key={index} className="flex items-center gap-2">
          <Select
            value={metric.type}
            onValueChange={(value) => handleMetricChange(index, 'type', value)}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              {supportedMetrics.map((metricOption) => (
                <SelectItem key={metricOption.type} value={metricOption.type}>
                  {metricOption.type.charAt(0).toUpperCase() + metricOption.type.slice(1).replace(/([A-Z])/g, ' $1')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Input
            type="number"
            value={metric.value || ''}
            onChange={(e) => handleMetricChange(index, 'value', e.target.value)}
            className="w-[80px]"
            min={0}
          />
          
          <Select
            value={metric.unit}
            onValueChange={(value) => handleMetricChange(index, 'unit', value)}
          >
            <SelectTrigger className="w-[80px]">
              <SelectValue placeholder="Unit" />
            </SelectTrigger>
            <SelectContent>
              {getAvailableUnits(metric.type).map((unit) => (
                <SelectItem key={unit} value={unit}>
                  {unit}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {metrics.length > 1 && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeMetricField(index)}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      ))}
      
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={addMetricField}
          className="h-8"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Metric
        </Button>
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button variant="outline" size="sm" onClick={onCancel}>
          <X className="h-4 w-4 mr-1" />
          Cancel
        </Button>
        <Button size="sm" onClick={handleSubmit}>
          <Check className="h-4 w-4 mr-1" />
          Add Set
        </Button>
      </div>
    </div>
  );
};

export default AddSetForm;
