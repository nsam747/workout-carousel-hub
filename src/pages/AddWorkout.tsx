
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CategorySelector from "@/components/CategorySelector";
import AddExerciseForm from "@/components/AddExerciseForm";
import ExerciseListItem from "@/components/ExerciseListItem";
import { getAllCategories } from "@/lib/mockData";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { Exercise, Workout } from "@/lib/mockData";

const AddWorkout = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selectedCategory, setSelectedCategory] = useState(getAllCategories()[0] || "");
  const [isAddingExercise, setIsAddingExercise] = useState(false);
  const [lastAddedExerciseId, setLastAddedExerciseId] = useState<string | null>(null);
  
  const handleAddExercise = (exercise: Exercise) => {
    // Add the new exercise and mark it as the last added one
    const exerciseWithSets = {
      ...exercise,
      sets: exercise.sets || []
    };
    
    console.log("Adding new exercise:", exerciseWithSets);
    
    setExercises(prevExercises => [...prevExercises, exerciseWithSets]);
    setLastAddedExerciseId(exercise.id);
    setIsAddingExercise(false);
  };
  
  const handleRemoveExercise = (exerciseId: string) => {
    setExercises(exercises.filter(exercise => exercise.id !== exerciseId));
    if (lastAddedExerciseId === exerciseId) {
      setLastAddedExerciseId(null);
    }
  };
  
  const handleExerciseUpdate = (updatedExercise: Exercise) => {
    console.log("Updating exercise in AddWorkout:", updatedExercise);
    setExercises(prevExercises => 
      prevExercises.map(exercise => 
        exercise.id === updatedExercise.id ? updatedExercise : exercise
      )
    );
  };
  
  const handleSaveWorkout = () => {
    // This would typically save to a database
    // For now, we'll just show a success toast and navigate back
    const workoutTitle = title.trim() || "Workout"; // Default to "Workout" if title is empty
    
    // Create new workout object
    const newWorkout: Workout = {
      id: uuidv4(),
      title: workoutTitle,
      category: selectedCategory,
      exercises,
      date: new Date(),
      completed: false
    };
    
    // In a real app, you would call a save API here
    console.log("New workout:", newWorkout);
    
    toast.success("Workout saved successfully!", {
      description: `'${workoutTitle}' has been added to your workouts.`,
    });
    
    navigate("/");
  };
  
  const handleCreateCategory = (categoryName: string) => {
    // In a real app, you would add this to your database
    console.log(`Created new category: ${categoryName}`);
    // Select the new category immediately
    setSelectedCategory(categoryName);
    
    toast.success("Category created", {
      description: `New category '${categoryName}' has been created.`,
    });
  };
  
  return (
    <div className="bg-gradient-to-b from-background to-secondary/50 min-h-screen pb-20">
      {/* Sticky header */}
      <div className="bg-background/95 backdrop-blur-sm sticky top-0 z-10 border-b border-border/40 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          <h1 className="text-lg font-semibold">New Workout</h1>
          
          <Button 
            onClick={handleSaveWorkout}
            size="sm"
            className="rounded-full"
          >
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
        </div>
      </div>
      
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="space-y-6">
          {/* Workout Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-2">
              Workout Title
            </label>
            <Input
              id="title"
              placeholder="e.g., Morning Cardio"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          
          {/* Category Selector */}
          <CategorySelector 
            categories={getAllCategories()} 
            selectedCategory={selectedCategory} 
            onSelectCategory={setSelectedCategory}
            onCreateCategory={handleCreateCategory}
          />
          
          {/* Exercises */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-medium">Exercises</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsAddingExercise(true)}
                className="rounded-full h-8 w-8 p-0"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5"
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor"
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 8v8M8 12h8" />
                </svg>
              </Button>
            </div>
            
            {exercises.length === 0 ? (
              <div className="bg-muted/50 rounded-lg p-8 text-center">
                <p className="text-muted-foreground">No exercises added yet</p>
                <Button 
                  variant="outline" 
                  onClick={() => setIsAddingExercise(true)}
                  className="mt-4"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-4 w-4 mr-2"
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor"
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 8v8M8 12h8" />
                  </svg>
                  Add Exercise
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                {exercises.map((exercise) => (
                  <ExerciseListItem
                    key={exercise.id}
                    exercise={exercise}
                    onRemove={handleRemoveExercise}
                    onExerciseUpdate={handleExerciseUpdate}
                    isNewlyAdded={exercise.id === lastAddedExerciseId}
                  />
                ))}
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAddingExercise(true)}
                  className="w-full mt-2"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-4 w-4 mr-2"
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor"
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 8v8M8 12h8" />
                  </svg>
                  Add Exercise
                </Button>
              </div>
            )}
          </div>
        </div>
        
        {/* Add Exercise Form */}
        {isAddingExercise && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
            <div className="bg-card rounded-t-xl sm:rounded-xl border border-border shadow-lg w-full max-w-lg max-h-[90vh] overflow-auto animate-in fade-in slide-in-from-bottom-5">
              <div className="p-6">
                <h2 className="text-lg font-semibold mb-4">Add Exercise</h2>
                <AddExerciseForm 
                  onAddExercise={handleAddExercise}
                  onCancel={() => setIsAddingExercise(false)}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddWorkout;
