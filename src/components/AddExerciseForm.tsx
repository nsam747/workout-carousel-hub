
import React, { useState } from "react";
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
import { Exercise, getExerciseTypes, getSavedExercises, saveExercise } from "@/lib/mockData";
import { generateId } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

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
  
  // Search existing exercises state
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedExerciseId, setSelectedExerciseId] = useState<string | null>(null);
  
  const exerciseTypes = getExerciseTypes();
  const savedExercises = getSavedExercises();
  
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
    };
    
    // Save this exercise for future reuse
    saveExercise(newExercise);
    
    onAddExercise(newExercise);
    setName("");
    setType("");
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
      media: []
    };
    
    onAddExercise(exerciseToAdd);
    setSelectedExerciseId(null);
    setSearchTerm("");
  };
  
  // Filter exercises based on search term
  const filteredExercises = savedExercises.filter(ex => 
    ex.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    ex.type.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
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
