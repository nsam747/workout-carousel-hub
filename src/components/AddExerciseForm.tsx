
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogClose 
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Exercise, 
  getSavedExercises, 
  getExerciseTypes,
  supportedMetrics, 
  SelectedMetric
} from "@/lib/mockData";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { Search, Plus, Dumbbell, X } from "lucide-react";

interface AddExerciseFormProps {
  onAddExercise: (exercise: Exercise) => void;
  onCancel: () => void;
  title?: string;
}

const AddExerciseForm: React.FC<AddExerciseFormProps> = ({
  onAddExercise,
  onCancel,
  title = "Add Exercise"
}) => {
  // State for new exercise inputs
  const [newExerciseName, setNewExerciseName] = useState("");
  const [newExerciseType, setNewExerciseType] = useState("");
  
  // State for searching/selecting existing exercises
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedExerciseIds, setSelectedExerciseIds] = useState<string[]>([]);
  
  // State for metrics selection modal
  const [showMetricsModal, setShowMetricsModal] = useState(false);
  const [selectedMetrics, setSelectedMetrics] = useState<SelectedMetric[]>([]);
  const [tempExerciseName, setTempExerciseName] = useState("");
  const [tempExerciseType, setTempExerciseType] = useState("");
  
  // Get all saved exercises
  const savedExercises = getSavedExercises();
  
  // Filter exercises based on search term
  const filteredExercises = savedExercises.filter(exercise =>
    exercise.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Handle creating a new exercise
  const handleCreateExercise = () => {
    if (!newExerciseName.trim()) {
      toast.error("Please enter an exercise name");
      return;
    }
    
    if (!newExerciseType) {
      toast.error("Please select an exercise type");
      return;
    }
    
    // Show metrics selection modal
    setTempExerciseName(newExerciseName);
    setTempExerciseType(newExerciseType);
    setShowMetricsModal(true);
  };
  
  // Handle adding selected metrics to new exercise
  const handleAddMetricsToExercise = () => {
    // Create new exercise with selected metrics
    const newExercise: Exercise = {
      id: uuidv4(),
      name: tempExerciseName,
      type: tempExerciseType,
      sets: [],
      notes: "",
      duration: 0,
      media: [],
      selectedMetrics: selectedMetrics
    };
    
    // Add exercise and reset form
    onAddExercise(newExercise);
    
    // Reset states
    setNewExerciseName("");
    setNewExerciseType("");
    setSelectedMetrics([]);
    setShowMetricsModal(false);
  };
  
  // Handle selecting an existing exercise
  const handleSelectExercise = (exerciseId: string) => {
    setSelectedExerciseIds(prev => {
      // Toggle selection
      if (prev.includes(exerciseId)) {
        return prev.filter(id => id !== exerciseId);
      } else {
        return [...prev, exerciseId];
      }
    });
  };
  
  // Handle adding selected existing exercises
  const handleAddSelectedExercises = () => {
    if (selectedExerciseIds.length === 0) {
      toast.error("Please select at least one exercise");
      return;
    }
    
    // For each selected exercise ID, find the exercise and add it
    selectedExerciseIds.forEach(id => {
      const exercise = savedExercises.find(e => e.id === id);
      if (exercise) {
        // Create a new copy of the exercise with a new ID
        const exerciseCopy: Exercise = {
          ...exercise,
          id: uuidv4(), // Give it a new ID
        };
        
        onAddExercise(exerciseCopy);
      }
    });
    
    // Reset selection
    setSelectedExerciseIds([]);
    setSearchTerm("");
    
    // Close the form if adding multiple exercises
    if (selectedExerciseIds.length > 1) {
      onCancel();
    }
  };
  
  // Handle toggling a metric in the selection modal
  const handleToggleMetric = (type: string, defaultUnit: string) => {
    setSelectedMetrics(prev => {
      const existingIndex = prev.findIndex(m => m.type === type);
      if (existingIndex >= 0) {
        // Remove if already selected
        return prev.filter(m => m.type !== type);
      } else {
        // Add if not selected
        return [...prev, { type, unit: defaultUnit }];
      }
    });
  };
  
  return (
    <Dialog open={true} onOpenChange={() => onCancel()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="existing" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="existing">Use Existing</TabsTrigger>
            <TabsTrigger value="new">Create New</TabsTrigger>
          </TabsList>
          
          <TabsContent value="existing">
            {/* Search Box */}
            <div className="flex items-center space-x-2 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search exercises..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            {/* Exercise List */}
            <div className="max-h-[300px] overflow-y-auto space-y-2 mb-4">
              {filteredExercises.length > 0 ? (
                filteredExercises.map(exercise => (
                  <Card 
                    key={exercise.id}
                    className={`cursor-pointer transition-colors ${
                      selectedExerciseIds.includes(exercise.id) 
                        ? 'border-primary bg-primary/5' 
                        : ''
                    }`}
                    onClick={() => handleSelectExercise(exercise.id)}
                  >
                    <CardContent className="py-3 px-4 flex items-center justify-between">
                      <div>
                        <div className="flex items-center">
                          <Checkbox
                            checked={selectedExerciseIds.includes(exercise.id)}
                            onCheckedChange={() => handleSelectExercise(exercise.id)}
                            className="mr-2"
                          />
                          <h4 className="font-medium">{exercise.name}</h4>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{exercise.type}</p>
                      </div>
                      <Dumbbell className="h-4 w-4 text-muted-foreground" />
                    </CardContent>
                  </Card>
                ))
              ) : (
                <p className="text-center py-8 text-muted-foreground">
                  {searchTerm ? "No exercises found" : "No saved exercises yet"}
                </p>
              )}
            </div>
            
            {/* Add Selected Button */}
            <div className="flex justify-end space-x-2 mt-4">
              <DialogClose asChild>
                <Button variant="outline" onClick={onCancel}>Cancel</Button>
              </DialogClose>
              <Button 
                onClick={handleAddSelectedExercises} 
                disabled={selectedExerciseIds.length === 0}
              >
                Add Selected {selectedExerciseIds.length > 0 && `(${selectedExerciseIds.length})`}
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="new">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Exercise Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Push-up"
                  value={newExerciseName}
                  onChange={(e) => setNewExerciseName(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="type">Exercise Type</Label>
                <Select value={newExerciseType} onValueChange={setNewExerciseType}>
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {getExerciseTypes().map(type => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex justify-end space-x-2 mt-4">
                <DialogClose asChild>
                  <Button variant="outline" onClick={onCancel}>Cancel</Button>
                </DialogClose>
                <Button onClick={handleCreateExercise}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Exercise
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
      
      {/* Metrics Selection Modal */}
      <Dialog open={showMetricsModal} onOpenChange={(open) => !open && setShowMetricsModal(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select Performance Metrics</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <p className="text-sm text-muted-foreground mb-4">
              Choose which metrics to track for this exercise:
            </p>
            
            <div className="space-y-2">
              {supportedMetrics.map(metric => (
                <div 
                  key={metric.type} 
                  className={`p-3 border rounded-md cursor-pointer flex items-center justify-between transition-colors ${
                    selectedMetrics.some(m => m.type === metric.type)
                      ? 'border-primary bg-primary/5'
                      : 'border-border'
                  }`}
                  onClick={() => handleToggleMetric(metric.type, metric.defaultUnit)}
                >
                  <div className="flex items-center">
                    <Checkbox
                      checked={selectedMetrics.some(m => m.type === metric.type)}
                      onCheckedChange={() => handleToggleMetric(metric.type, metric.defaultUnit)}
                      className="mr-2"
                    />
                    <span className="capitalize">{metric.type}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    ({metric.defaultUnit})
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button 
              variant="outline" 
              onClick={() => setShowMetricsModal(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleAddMetricsToExercise}>
              Add to Exercise
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
};

export default AddExerciseForm;
