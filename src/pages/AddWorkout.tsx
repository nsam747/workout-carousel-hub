import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Plus, Tag, ArrowLeft, Check, Edit, X } from "lucide-react";
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
import { Workout, Exercise, getAllCategories, createWorkout, createCategory, getCategoryInfo } from "@/lib/mockData";
import ExerciseListItem from "@/components/ExerciseListItem";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import AddExerciseForm from "@/components/AddExerciseForm";
import CategorySelector from "@/components/CategorySelector";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import * as LucideIcons from "lucide-react";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

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
  
  // New state for category management
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryColor, setNewCategoryColor] = useState("#9b87f5");
  const [newCategoryIcon, setNewCategoryIcon] = useState<string | null>("Activity");
  const [availableIcons, setAvailableIcons] = useState<string[]>([]);
  const [editedCategoryName, setEditedCategoryName] = useState("");
  const [editedCategoryColor, setEditedCategoryColor] = useState("");
  const [editedCategoryIcon, setEditedCategoryIcon] = useState<string | null>(null);
  
  // Initialize with the first category and collect available icons
  useEffect(() => {
    const allCategories = getAllCategories();
    setCategories(allCategories);
    if (allCategories.length > 0 && selectedCategory === "") {
      setSelectedCategory(allCategories[0]);
    }
    
    // Collect available Lucide icons for selection
    const iconNames = Object.keys(LucideIcons)
      .filter(key => typeof LucideIcons[key as keyof typeof LucideIcons] === "function")
      .filter(name => !name.includes("Svelte") && !name.includes("Vue") && name !== "Icon")
      .sort();
    
    setAvailableIcons(iconNames);
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
    // Set edited values when opening the edit dialog
    const categoryInfo = getCategoryInfo(category);
    setEditedCategoryName(category);
    setEditedCategoryColor(categoryInfo.color);
    setEditedCategoryIcon(categoryInfo.icon);
    setShowLongPressMenu(true);
  };
  
  const handleAddCategory = () => {
    if (!newCategoryName.trim()) {
      toast.error("Please enter a category name");
      return;
    }
    
    const newCategory = {
      name: newCategoryName.trim(),
      color: newCategoryColor,
      icon: newCategoryIcon
    };
    
    createCategory(newCategory);
    setCategories(getAllCategories());
    setSelectedCategory(newCategoryName.trim());
    setNewCategoryName("");
    setNewCategoryColor("#9b87f5");
    setNewCategoryIcon("Activity");
    setIsAddingCategory(false);
    toast.success("Category added successfully!");
  };
  
  const handleUpdateCategory = () => {
    if (!editedCategoryName.trim()) {
      toast.error("Please enter a category name");
      return;
    }
    
    const updatedCategory = {
      oldName: longPressCategory,
      newName: editedCategoryName.trim(),
      color: editedCategoryColor,
      icon: editedCategoryIcon
    };
    
    // This would be implemented in mockData.ts
    // updateCategory(updatedCategory);
    
    // For now, simulating by removing old and adding new
    const categoryInfo = {
      name: editedCategoryName.trim(),
      color: editedCategoryColor,
      icon: editedCategoryIcon
    };
    
    createCategory(categoryInfo);
    
    setCategories(getAllCategories());
    if (longPressCategory === selectedCategory) {
      setSelectedCategory(editedCategoryName.trim());
    }
    
    setShowLongPressMenu(false);
    toast.success("Category updated successfully!");
  };
  
  // Sample color palette for category selection
  const colorPalette = [
    "#9b87f5", // Primary Purple
    "#F97316", // Bright Orange
    "#0EA5E9", // Ocean Blue
    "#F59E0B", // Amber
    "#10B981", // Emerald
    "#8B5CF6", // Vivid Purple
    "#EC4899", // Pink
    "#EF4444", // Red
    "#6366F1", // Indigo
    "#06B6D4", // Cyan
  ];
  
  const renderIconSelection = (
    selectedIcon: string | null,
    onSelectIcon: (iconName: string | null) => void,
    showClearButton = true
  ) => {
    // Limited icon selection to keep the UI manageable
    const popularIcons = [
      "Activity", "Barbell", "Bike", "Dumbbell", "Flame", "Heart", 
      "Mountain", "Music", "Ruler", "Smile", "Timer", "Trophy", 
      "Zap", "Home", "Star", "Target", "Sun", "Moon", 
      "Coffee", "Award", "Flag", "Heart", "Gift"
    ];
    
    return (
      <div>
        <div className="flex items-center justify-between mb-2">
          <Label className="text-sm font-medium">Icon</Label>
          {showClearButton && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-7 px-2 text-xs"
              onClick={() => onSelectIcon(null)}
            >
              Clear
            </Button>
          )}
        </div>
        <div className="grid grid-cols-6 gap-2">
          {popularIcons.map(iconName => {
            const IconComponent = (LucideIcons as any)[iconName];
            return (
              <Button
                key={iconName}
                variant={selectedIcon === iconName ? "default" : "outline"}
                size="sm"
                className="p-2 h-10 w-10"
                onClick={() => onSelectIcon(iconName)}
                title={iconName}
              >
                {IconComponent && <IconComponent className="h-5 w-5" />}
              </Button>
            );
          })}
        </div>
        {availableIcons.length > popularIcons.length && (
          <p className="text-xs text-muted-foreground mt-2">
            Showing common icons. {availableIcons.length - popularIcons.length} more available.
          </p>
        )}
      </div>
    );
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
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <Tag className="h-4 w-4 mr-2" />
                <span className="text-sm font-medium">Category</span>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs h-7 px-2"
                onClick={() => setIsAddingCategory(true)}
              >
                <Plus className="h-3 w-3 mr-1" />
                New Category
              </Button>
            </div>
            
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
      
      {/* Add Category Dialog */}
      <Dialog open={isAddingCategory} onOpenChange={setIsAddingCategory}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="category-name">Name</Label>
              <Input 
                id="category-name" 
                value={newCategoryName} 
                onChange={(e) => setNewCategoryName(e.target.value)} 
                placeholder="Category name" 
              />
            </div>
            
            <div className="space-y-2">
              <Label>Color</Label>
              <div className="flex flex-wrap gap-2">
                {colorPalette.map(color => (
                  <button
                    key={color}
                    type="button"
                    className={cn(
                      "w-8 h-8 rounded-full",
                      newCategoryColor === color && "ring-2 ring-primary ring-offset-2"
                    )}
                    style={{ backgroundColor: color }}
                    onClick={() => setNewCategoryColor(color)}
                    aria-label={color}
                  />
                ))}
                
                <Input
                  type="color"
                  value={newCategoryColor}
                  onChange={(e) => setNewCategoryColor(e.target.value)}
                  className="w-8 h-8 p-0 overflow-hidden"
                  title="Custom color"
                />
              </div>
            </div>
            
            {/* Icon selection */}
            {renderIconSelection(newCategoryIcon, setNewCategoryIcon)}
            
            <div className="flex justify-end gap-2 pt-4">
              <Button 
                variant="outline" 
                onClick={() => setIsAddingCategory(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleAddCategory}>
                Add Category
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Edit Category Dialog */}
      <Dialog open={showLongPressMenu} onOpenChange={setShowLongPressMenu}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-category-name">Name</Label>
              <Input 
                id="edit-category-name" 
                value={editedCategoryName} 
                onChange={(e) => setEditedCategoryName(e.target.value)} 
                placeholder="Category name" 
              />
            </div>
            
            <div className="space-y-2">
              <Label>Color</Label>
              <div className="flex flex-wrap gap-2">
                {colorPalette.map(color => (
                  <button
                    key={color}
                    type="button"
                    className={cn(
                      "w-8 h-8 rounded-full",
                      editedCategoryColor === color && "ring-2 ring-primary ring-offset-2"
                    )}
                    style={{ backgroundColor: color }}
                    onClick={() => setEditedCategoryColor(color)}
                    aria-label={color}
                  />
                ))}
                
                <Input
                  type="color"
                  value={editedCategoryColor}
                  onChange={(e) => setEditedCategoryColor(e.target.value)}
                  className="w-8 h-8 p-0 overflow-hidden"
                  title="Custom color"
                />
              </div>
            </div>
            
            {/* Icon selection */}
            {renderIconSelection(editedCategoryIcon, setEditedCategoryIcon)}
            
            <div className="flex justify-end gap-2 pt-4">
              <Button 
                variant="outline" 
                onClick={() => setShowLongPressMenu(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleUpdateCategory}>
                Update Category
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddWorkout;
