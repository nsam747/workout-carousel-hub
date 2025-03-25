
import React, { useState } from "react";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Exercise, getExerciseTypes } from "@/lib/mockData";
import { generateId } from "@/lib/utils";

interface AddExerciseFormProps {
  onAddExercise: (exercise: Exercise) => void;
  onCancel: () => void;
}

const AddExerciseForm: React.FC<AddExerciseFormProps> = ({ 
  onAddExercise, 
  onCancel 
}) => {
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const exerciseTypes = getExerciseTypes();
  
  const handleAddExercise = () => {
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
    
    onAddExercise(newExercise);
    setName("");
    setType("");
  };
  
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium">Add Exercise</h3>
      
      <div className="space-y-3">
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
      </div>
      
      <div className="flex justify-end gap-2">
        <Button variant="outline" size="sm" onClick={onCancel}>
          <X className="h-4 w-4 mr-1" />
          Cancel
        </Button>
        <Button size="sm" onClick={handleAddExercise} disabled={!name.trim()}>
          <Check className="h-4 w-4 mr-1" />
          Add
        </Button>
      </div>
    </div>
  );
};

export default AddExerciseForm;
