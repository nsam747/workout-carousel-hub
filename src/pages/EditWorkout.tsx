
/**
 * EditWorkout Page Component
 * 
 * This page allows users to edit an existing workout.
 * It reuses the same structure as AddWorkout but loads the existing workout data.
 */

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CategorySelector from "@/components/CategorySelector";
import AddExerciseForm from "@/components/AddExerciseForm";
import ExerciseListItem from "@/components/ExerciseListItem";
import { getAllCategories, getWorkoutById } from "@/lib/mockData";
import { toast } from "sonner";
import { Exercise, Workout } from "@/lib/mockData";

const EditWorkout = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isAddingExercise, setIsAddingExercise] = useState(false);
  const [lastAddedExerciseId, setLastAddedExerciseId] = useState<string | null>(null);
  
  useEffect(() => {
    if (id) {
      // Load the workout data
      const workout = getWorkoutById(id);
      if (workout) {
        setTitle(workout.title);
        
        // Deep copy of exercises with all nested properties preserved
        const exercisesCopy = workout.exercises.map(exercise => {
          // Create a deep copy of each exercise
          const exerciseCopy = {
            ...exercise,
            sets: exercise.sets ? 
              exercise.sets.map(set => ({
                ...set,
                // Ensure metrics array is properly deep copied
                metrics: set.metrics ? 
                  set.metrics.map(metric => ({ ...metric })) : 
                  []
              })) : 
              []
          };
          return exerciseCopy;
        });
        
        console.log("Loaded workout exercises:", exercisesCopy);
        setExercises(exercisesCopy);
        setSelectedCategory(workout.category);
      } else {
        toast.error("Workout not found");
        navigate("/");
      }
    }
    setLoading(false);
  }, [id, navigate]);
  
  const handleAddExercise = (exercise: Exercise) => {
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
  
  const handleExerciseUpdate = (updatedExercise: Exercise) => {
    console.log("Updating exercise:", updatedExercise);
    setExercises(prevExercises => 
      prevExercises.map(exercise => 
        exercise.id === updatedExercise.id ? updatedExercise : exercise
      )
    );
  };
  
  const handleSaveWorkout = () => {
    if (!id) return;
    
    // This would typically save to a database
    // For now, we'll just show a success toast and navigate back
    const workoutTitle = title.trim() || "Workout"; // Default to "Workout" if title is empty
    
    // Create updated workout object
    const updatedWorkout: Workout = {
      id,
      title: workoutTitle,
      category: selectedCategory,
      exercises,
      date: new Date(), // Keep the original date or update it
      completed: false // Keep the original completion status or update it
    };
    
    // In a real app, you would call an update API here
    console.log("Updated workout:", updatedWorkout);
    
    toast.success("Workout updated successfully!", {
      description: `'${workoutTitle}' has been updated.`,
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
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading workout data...</p>
      </div>
    );
  }
  
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
          
          <h1 className="text-lg font-semibold">Edit Workout</h1>
          
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

export default EditWorkout;
