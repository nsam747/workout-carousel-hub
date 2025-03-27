
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Plus, Tag, ArrowLeft, Check } from "lucide-react";
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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const AddWorkout = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [showAddExercise, setShowAddExercise] = useState(false);
  const [categories, setCategories] = useState(getAllCategories());
  const [showLongPressMenu, setShowLongPressMenu] = useState(false);
  const [longPressCategory, setLongPressCategory] = useState<string>("");
  
  // Initialize with the first category
  useEffect(() => {
    const allCategories = getAllCategories();
    setCategories(allCategories);
    if (allCategories.length > 0 && selectedCategory === "") {
      setSelectedCategory(allCategories[0]);
    }
  }, [selectedCategory]);
  
  const handleSaveWorkout = () => {
    // Use "Workout" as the default title if none provided
    const workoutTitle = title.trim() ? title.trim() : "Workout";
    
    if (!selectedCategory) {
      toast.error("Please select a category");
      return;
    }
    
    if (exercises.length === 0) {
      toast.error("Please add at least one exercise");
      return;
    }
    
    const newWorkout: Partial<Workout> = {
      title: workoutTitle,
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
  
  const handleExerciseUpdate = (updatedExercise: Exercise) => {
    setExercises(prev => 
      prev.map(ex => ex.id === updatedExercise.id ? updatedExercise : ex)
    );
  };
  
  const handleLongPress = (category: string) => {
    setLongPressCategory(category);
    setShowLongPressMenu(true);
  };
  
  return (
    <div className="bg-gradient-to-b from-background to-secondary/50 min-h-screen pb-20">
      {/* Sticky header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border/40 shadow-sm mb-6">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate("/")}
            className="rounded-full h-10 w-10"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Back</span>
          </Button>
          <h1 className="text-xl font-bold">New Workout</h1>
          <Button 
            onClick={handleSaveWorkout}
            size="sm"
            className="rounded-full bg-primary hover:bg-primary/90"
          >
            <Check className="h-4 w-4 mr-1" />
            Save
          </Button>
        </div>
      </header>
      
      <div className="max-w-2xl mx-auto px-4">
        <div className="space-y-6">
          {/* Title input */}
          <div>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Workout title (optional)"
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
              onLongPress={handleLongPress}
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
                    onExerciseUpdate={handleExerciseUpdate}
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
      
      {/* Category Edit Dialog */}
      <Dialog open={showLongPressMenu} onOpenChange={setShowLongPressMenu}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p>This is where category editing will be implemented in the future.</p>
            <div className="flex justify-end">
              <Button onClick={() => setShowLongPressMenu(false)}>Close</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddWorkout;
