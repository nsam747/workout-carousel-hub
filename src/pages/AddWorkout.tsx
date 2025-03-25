
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Plus, Tag, ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Workout, Exercise, getAllCategories, createWorkout } from "@/lib/mockData";
import ExerciseListItem from "@/components/ExerciseListItem";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import AddExerciseForm from "@/components/AddExerciseForm";
import CategorySelector from "@/components/CategorySelector";

const AddWorkout = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [showAddExercise, setShowAddExercise] = useState(false);
  const [categories] = useState(getAllCategories());
  
  const handleSaveWorkout = () => {
    if (!title.trim()) {
      toast.error("Please enter a workout title");
      return;
    }
    
    if (!selectedCategory) {
      toast.error("Please select a category");
      return;
    }
    
    if (exercises.length === 0) {
      toast.error("Please add at least one exercise");
      return;
    }
    
    const newWorkout: Partial<Workout> = {
      title,
      date: selectedDate,
      category: selectedCategory,
      exercises,
      completed: false,
    };
    
    createWorkout(newWorkout);
    toast.success("Workout saved successfully!");
    navigate("/");
  };
  
  const handleAddExercise = (exercise: Exercise) => {
    setExercises([...exercises, exercise]);
    setShowAddExercise(false);
  };
  
  const handleRemoveExercise = (id: string) => {
    setExercises(exercises.filter(exercise => exercise.id !== id));
  };
  
  return (
    <div className="bg-gradient-to-b from-background to-secondary/50 min-h-screen">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <header className="mb-6 flex items-center justify-between">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate("/")}
            className="rounded-full h-10 w-10"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Back</span>
          </Button>
          <h1 className="text-2xl font-bold">New Workout</h1>
          <Button 
            onClick={handleSaveWorkout}
            size="icon"
            className="rounded-full h-10 w-10 bg-primary"
          >
            <Save className="h-5 w-5" />
            <span className="sr-only">Save workout</span>
          </Button>
        </header>
        
        <div className="space-y-6">
          {/* Title input */}
          <div>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Workout title"
              className="text-lg font-medium"
            />
          </div>
          
          {/* Date selection */}
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">Date:</span>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "justify-start text-left font-normal",
                    !selectedDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
          
          {/* Category selection */}
          <div>
            <CategorySelector 
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
          </div>
          
          {/* Exercises list */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium">Exercises</h2>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowAddExercise(true)}
                className="gap-1"
              >
                <Plus className="h-4 w-4" />
                Add Exercise
              </Button>
            </div>
            
            {showAddExercise ? (
              <Card className="p-4 mb-4 animate-fade-in">
                <AddExerciseForm 
                  onAddExercise={handleAddExercise}
                  onCancel={() => setShowAddExercise(false)}
                />
              </Card>
            ) : null}
            
            <div className="space-y-3">
              {exercises.length > 0 ? (
                exercises.map((exercise) => (
                  <ExerciseListItem 
                    key={exercise.id} 
                    exercise={exercise}
                    onRemove={handleRemoveExercise}
                  />
                ))
              ) : (
                <div className="p-8 text-center rounded-xl bg-secondary/50 border border-border animate-fade-in">
                  <h3 className="font-medium text-muted-foreground">No exercises added yet</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Add exercises to your workout
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddWorkout;
