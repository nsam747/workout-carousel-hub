
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import {
  Exercise,
  ExerciseSet,
  getExerciseTypes,
  getSavedExercises,
  saveExercise,
  PerformanceMetric
} from "@/lib/mockData";
import { generateId } from "@/lib/utils";
import { toast } from "sonner";
import { Plus, Minus, Save, Copy } from "lucide-react";
import PerformanceMetricInput from "./PerformanceMetricInput";

interface AddExerciseFormProps {
  onAddExercise: (exercise: Exercise) => void;
  onCancel: () => void;
}

const AddExerciseForm: React.FC<AddExerciseFormProps> = ({
  onAddExercise,
  onCancel,
}) => {
  const [tab, setTab] = useState("new"); // "new" or "existing"
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [notes, setNotes] = useState("");
  const [sets, setSets] = useState<ExerciseSet[]>([
    { id: generateId(), setNumber: 1, reps: 0, weight: 0 }
  ]);
  const [duration, setDuration] = useState(0);
  const [selectedExistingExercise, setSelectedExistingExercise] = useState("");
  
  const exerciseTypes = getExerciseTypes();
  const savedExercises = getSavedExercises();
  
  const handleAddSet = () => {
    const newSet: ExerciseSet = {
      id: generateId(),
      setNumber: sets.length + 1,
      reps: sets.length > 0 ? sets[sets.length - 1].reps : 0,
      weight: sets.length > 0 ? sets[sets.length - 1].weight : 0,
      performanceMetrics: sets.length > 0 && sets[sets.length - 1].performanceMetrics 
        ? [...sets[sets.length - 1].performanceMetrics.map(m => ({...m, id: generateId()}))] 
        : []
    };
    setSets([...sets, newSet]);
  };
  
  const handleRemoveSet = (index: number) => {
    if (sets.length === 1) {
      setSets([{ id: generateId(), setNumber: 1, reps: 0, weight: 0 }]);
      return;
    }
    
    const newSets = [...sets];
    newSets.splice(index, 1);
    // Renumber the sets
    newSets.forEach((set, i) => {
      set.setNumber = i + 1;
    });
    setSets(newSets);
  };
  
  const handleRepsChange = (index: number, value: number) => {
    const newSets = [...sets];
    newSets[index].reps = value;
    setSets(newSets);
  };
  
  const handleWeightChange = (index: number, value: number) => {
    const newSets = [...sets];
    newSets[index].weight = value;
    setSets(newSets);
  };
  
  const handleNoteChange = (index: number, value: string) => {
    const newSets = [...sets];
    newSets[index].notes = value;
    setSets(newSets);
  };
  
  const handleMetricsChange = (index: number, metrics: PerformanceMetric[]) => {
    const newSets = [...sets];
    newSets[index].performanceMetrics = metrics;
    setSets(newSets);
  };
  
  const handleDuplicateSet = (index: number) => {
    const setToDuplicate = sets[index];
    const newSet: ExerciseSet = {
      id: generateId(),
      setNumber: sets.length + 1,
      reps: setToDuplicate.reps,
      weight: setToDuplicate.weight,
      notes: setToDuplicate.notes,
      performanceMetrics: setToDuplicate.performanceMetrics 
        ? [...setToDuplicate.performanceMetrics.map(m => ({...m, id: generateId()}))] 
        : []
    };
    setSets([...sets, newSet]);
  };
  
  const handleSubmit = () => {
    if (tab === "new") {
      if (!name.trim()) {
        toast.error("Please enter an exercise name");
        return;
      }
      
      if (!type) {
        toast.error("Please select an exercise type");
        return;
      }
      
      const newExercise: Exercise = {
        id: generateId(),
        name: name.trim(),
        type,
        sets,
        duration,
        notes,
        media: [],
      };
      
      // Save for future reuse
      saveExercise(newExercise);
      
      onAddExercise(newExercise);
    } else {
      const existingExercise = savedExercises.find(
        (ex) => ex.id === selectedExistingExercise
      );
      
      if (!existingExercise) {
        toast.error("Please select an exercise");
        return;
      }
      
      const exerciseToAdd: Exercise = {
        ...existingExercise,
        id: generateId(), // New ID for this instance
        sets, // User defined sets
        duration, // User defined duration
        notes, // User notes
        media: [], // No media initially
      };
      
      onAddExercise(exerciseToAdd);
    }
  };
  
  return (
    <div className="space-y-4">
      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="new" className="flex-1">Create New Exercise</TabsTrigger>
          <TabsTrigger value="existing" className="flex-1">Select Existing Exercise</TabsTrigger>
        </TabsList>
        
        <TabsContent value="new" className="space-y-3 pt-2">
          <Input
            placeholder="Exercise name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          
          <Select value={type} onValueChange={setType}>
            <SelectTrigger>
              <SelectValue placeholder="Select exercise type" />
            </SelectTrigger>
            <SelectContent>
              {exerciseTypes.map((exerciseType) => (
                <SelectItem key={exerciseType} value={exerciseType}>
                  {exerciseType}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </TabsContent>
        
        <TabsContent value="existing" className="space-y-3 pt-2">
          <Select
            value={selectedExistingExercise}
            onValueChange={(value) => {
              setSelectedExistingExercise(value);
              // Optionally pre-fill other fields
              const exercise = savedExercises.find((ex) => ex.id === value);
              if (exercise) {
                setName(exercise.name);
                setType(exercise.type);
              }
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select an existing exercise" />
            </SelectTrigger>
            <SelectContent>
              {savedExercises.map((exercise) => (
                <SelectItem key={exercise.id} value={exercise.id}>
                  <div className="flex items-center justify-between w-full">
                    <span>{exercise.name}</span>
                    <span className="text-sm text-muted-foreground ml-2">
                      {exercise.type}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </TabsContent>
      </Tabs>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Duration (minutes, optional)</label>
        <Input
          type="number"
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
          min={0}
        />
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Sets</label>
          <Button
            variant="outline"
            size="sm"
            onClick={handleAddSet}
            className="flex items-center gap-1 h-7 px-2 text-xs"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Set
          </Button>
        </div>
        
        <div className="space-y-3 mt-2">
          {sets.map((set, index) => (
            <div key={set.id} className="p-3 border rounded-md space-y-3 bg-secondary/10">
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm">Set {index + 1}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveSet(index)}
                  className="h-7 w-7 p-0"
                >
                  <Minus className="h-3.5 w-3.5 text-destructive" />
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground">Reps</label>
                  <Input
                    type="number"
                    value={set.reps}
                    onChange={(e) =>
                      handleRepsChange(index, Number(e.target.value))
                    }
                    min={0}
                    className="h-8"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Weight (kg)</label>
                  <Input
                    type="number"
                    value={set.weight}
                    onChange={(e) =>
                      handleWeightChange(index, Number(e.target.value))
                    }
                    min={0}
                    className="h-8"
                  />
                </div>
              </div>
              
              <div>
                <label className="text-xs text-muted-foreground">Performance Metrics</label>
                <PerformanceMetricInput 
                  metrics={set.performanceMetrics || []}
                  onUpdate={(metrics) => handleMetricsChange(index, metrics)}
                  isFirstSet={index === 0}
                  onDuplicate={index === 0 ? () => handleDuplicateSet(index) : undefined}
                />
              </div>
              
              <div>
                <label className="text-xs text-muted-foreground">Set Notes (optional)</label>
                <Textarea
                  value={set.notes || ""}
                  onChange={(e) => handleNoteChange(index, e.target.value)}
                  placeholder="e.g., Struggled with last rep"
                  className="h-14 resize-none text-sm"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Notes (optional)</label>
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Any general notes about this exercise"
          className="resize-none"
        />
      </div>
      
      <div className="flex justify-end gap-2 pt-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} className="gap-1">
          <Save className="h-4 w-4" />
          Add Exercise
        </Button>
      </div>
    </div>
  );
};

export default AddExerciseForm;
