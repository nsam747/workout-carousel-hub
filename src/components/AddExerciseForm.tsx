
import React, { useState, useEffect } from "react";
import { Check, X, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Exercise, SelectedMetric, getExerciseTypes, getSavedExercises, saveExercise, supportedMetrics } from "@/lib/mockData";
import { generateId } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface AddExerciseFormProps {
  onAddExercise: (exercise: Exercise) => void;
  onCancel: () => void;
}

const AddExerciseForm: React.FC<AddExerciseFormProps> = ({ 
  onAddExercise, 
  onCancel 
}) => {
  const [activeTab, setActiveTab] = useState("create");
  
  // Create new exercise state
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [selectedMetrics, setSelectedMetrics] = useState<SelectedMetric[]>([]);
  
  // Search existing exercises state
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedExerciseId, setSelectedExerciseId] = useState<string | null>(null);
  
  const exerciseTypes = getExerciseTypes();
  const savedExercises = getSavedExercises();
  
  // Handle metric selection
  const handleMetricSelect = (metricType: string, isChecked: boolean) => {
    if (isChecked) {
      // Find the default unit for this metric type
      const metric = supportedMetrics.find(m => m.type === metricType);
      if (metric) {
        setSelectedMetrics(prev => [...prev, { type: metricType, unit: metric.defaultUnit }]);
      }
    } else {
      setSelectedMetrics(prev => prev.filter(m => m.type !== metricType));
    }
  };
  
  // Handle unit change for a selected metric
  const handleUnitChange = (metricType: string, unit: string) => {
    setSelectedMetrics(prev => 
      prev.map(m => m.type === metricType ? { ...m, unit } : m)
    );
  };
  
  const isMetricSelected = (metricType: string) => {
    return selectedMetrics.some(m => m.type === metricType);
  };
  
  const getSelectedUnit = (metricType: string) => {
    const metric = selectedMetrics.find(m => m.type === metricType);
    return metric?.unit || supportedMetrics.find(m => m.type === metricType)?.defaultUnit || '';
  };
  
  const handleAddNewExercise = () => {
    if (!name.trim()) {
      return;
    }
    
    const newExercise: Exercise = {
      id: generateId(),
      name,
      type: type || "Other",
      notes: "",
      sets: [],
      duration: 0,
      media: [],
      selectedMetrics: selectedMetrics.length > 0 ? selectedMetrics : [{ type: "repetitions", unit: "reps" }] // Default to reps if none selected
    };
    
    // Save this exercise for future reuse
    saveExercise(newExercise);
    
    onAddExercise(newExercise);
    setName("");
    setType("");
    setSelectedMetrics([]);
  };
  
  const handleAddExistingExercise = () => {
    if (!selectedExerciseId) return;
    
    const selectedExercise = savedExercises.find(ex => ex.id === selectedExerciseId);
    if (!selectedExercise) return;
    
    // Create a new instance of this exercise with a new ID
    const exerciseToAdd: Exercise = {
      ...selectedExercise,
      id: generateId(), // New instance needs new ID
      sets: [], // Reset workout-specific data
      notes: "",
      duration: 0,
      media: [],
      selectedMetrics: selectedExercise.selectedMetrics || [{ type: "repetitions", unit: "reps" }] // Keep the selected metrics
    };
    
    onAddExercise(exerciseToAdd);
    setSelectedExerciseId(null);
    setSearchTerm("");
  };
  
  // Update selected metrics when selecting an existing exercise
  useEffect(() => {
    if (selectedExerciseId) {
      const exercise = savedExercises.find(ex => ex.id === selectedExerciseId);
      if (exercise && exercise.selectedMetrics) {
        setSelectedMetrics([...exercise.selectedMetrics]);
      } else {
        setSelectedMetrics([]);
      }
    }
  }, [selectedExerciseId]);
  
  // Filter exercises based on search term
  const filteredExercises = savedExercises.filter(ex => 
    ex.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    ex.type.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Format the metric type for display
  const formatMetricName = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1).replace(/([A-Z])/g, ' $1');
  };
  
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium">Add Exercise</h3>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="create">Create New</TabsTrigger>
          <TabsTrigger value="existing">Use Existing</TabsTrigger>
        </TabsList>
        
        <TabsContent value="create" className="space-y-3">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Exercise name"
          />
          
          <Select value={type} onValueChange={setType}>
            <SelectTrigger>
              <SelectValue placeholder="Exercise type" />
            </SelectTrigger>
            <SelectContent>
              {exerciseTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {/* Performance metrics selection - Redesigned to be more compact */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Performance Metrics</h4>
            <p className="text-xs text-muted-foreground mb-2">
              Select the metrics you want to track for this exercise:
            </p>
            
            <div className="space-y-2">
              {supportedMetrics.map((metric) => (
                <div key={metric.type} className="flex items-center space-x-2">
                  <div className="flex items-center">
                    <Checkbox 
                      id={`metric-${metric.type}`} 
                      checked={isMetricSelected(metric.type)} 
                      onCheckedChange={(checked) => 
                        handleMetricSelect(metric.type, checked === true)
                      } 
                      className="mr-2"
                    />
                    <Label htmlFor={`metric-${metric.type}`} className="text-sm min-w-[80px]">
                      {formatMetricName(metric.type)}
                    </Label>
                  </div>
                  
                  {isMetricSelected(metric.type) && metric.availableUnits.length > 1 && (
                    <Select 
                      value={getSelectedUnit(metric.type)} 
                      onValueChange={(unit) => handleUnitChange(metric.type, unit)}
                    >
                      <SelectTrigger className="h-7 text-xs w-20">
                        <SelectValue placeholder="Unit" />
                      </SelectTrigger>
                      <SelectContent>
                        {metric.availableUnits.map(unit => (
                          <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  
                  {isMetricSelected(metric.type) && metric.availableUnits.length === 1 && (
                    <span className="text-xs text-muted-foreground">{metric.availableUnits[0]}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={onCancel}>
              <X className="h-4 w-4 mr-1" />
              Cancel
            </Button>
            <Button size="sm" onClick={handleAddNewExercise} disabled={!name.trim()}>
              <Plus className="h-4 w-4 mr-1" />
              Create
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="existing" className="space-y-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search exercises..."
              className="pl-9"
            />
          </div>
          
          <div className="max-h-60 overflow-y-auto border rounded-md">
            {filteredExercises.length > 0 ? (
              <div className="divide-y">
                {filteredExercises.map(exercise => (
                  <div 
                    key={exercise.id}
                    className={cn(
                      "p-3 cursor-pointer transition-colors",
                      selectedExerciseId === exercise.id 
                        ? "bg-secondary" 
                        : "hover:bg-secondary/50"
                    )}
                    onClick={() => setSelectedExerciseId(exercise.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{exercise.name}</h4>
                        <span className="text-xs text-muted-foreground">{exercise.type}</span>
                      </div>
                      {selectedExerciseId === exercise.id && (
                        <Check className="h-4 w-4 text-primary" />
                      )}
                    </div>
                    
                    {/* Show selected metrics for this exercise */}
                    {selectedExerciseId === exercise.id && exercise.selectedMetrics && exercise.selectedMetrics.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {exercise.selectedMetrics.map((metric, index) => (
                          <span key={index} className="inline-flex items-center text-xs bg-secondary/60 px-2 py-0.5 rounded">
                            {formatMetricName(metric.type)} ({metric.unit})
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-muted-foreground">
                {searchTerm 
                  ? "No exercises match your search" 
                  : "No saved exercises yet"}
              </div>
            )}
          </div>
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={onCancel}>
              <X className="h-4 w-4 mr-1" />
              Cancel
            </Button>
            <Button 
              size="sm" 
              onClick={handleAddExistingExercise} 
              disabled={!selectedExerciseId}
            >
              <Check className="h-4 w-4 mr-1" />
              Add Selected
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AddExerciseForm;
