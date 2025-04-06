
/**
 * AddWorkout Page Component
 * 
 * This page allows users to create a new workout by adding:
 * - Workout title
 * - Workout category
 * - Multiple exercises with their details
 * 
 * Features:
 * - Add/remove exercises to the workout
 * - Select from existing categories or create new ones
 * - Save the complete workout
 * - Auto-focus newly added exercises with initial set
 * 
 * This component uses ExerciseListItem for listing exercises and
 * AddExerciseForm for adding new exercises.
 */

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, PlusCircle, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CategorySelector from "@/components/CategorySelector";
import AddExerciseForm from "@/components/AddExerciseForm";
import ExerciseListItem from "@/components/ExerciseListItem";
import { getAllCategories } from "@/lib/mockData";
import { toast } from "sonner";

interface Exercise {
  id: string;
  name: string;
  type: string;
  sets?: { id: string; reps: number; weight: number }[];
  notes?: string;
  duration: number;
  media: string[];
}

const AddWorkout = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selectedCategory, setSelectedCategory] = useState(getAllCategories()[0] || "");
  const [isAddingExercise, setIsAddingExercise] = useState(false);
  const [lastAddedExerciseId, setLastAddedExerciseId] = useState<string | null>(null);
  
  const handleAddExercise = (exercise: Exercise) => {
    // Add the new exercise and mark it as the last added one
    setExercises(prevExercises => [...prevExercises, exercise]);
    setLastAddedExerciseId(exercise.id);
    setIsAddingExercise(false);
  };
  
  const handleRemoveExercise = (exerciseId: string) => {
    setExercises(exercises.filter(exercise => exercise.id !== exerciseId));
    if (lastAddedExerciseId === exerciseId) {
      setLastAddedExerciseId(null);
    }
  };
  
  const handleSaveWorkout = () => {
    // This would typically save to a database
    // For now, we'll just show a success toast and navigate back
    const workoutTitle = title.trim() || "Workout"; // Default to "Workout" if title is empty
    
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
                <PlusCircle className="h-5 w-5" />
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
                  <PlusCircle className="h-4 w-4 mr-2" />
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
                    isNewlyAdded={exercise.id === lastAddedExerciseId}
                  />
                ))}
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAddingExercise(true)}
                  className="w-full mt-2"
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
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
