import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  createWorkout,
  getAllCategories,
  Workout,
  getCategoryInfo,
  createCategory,
  updateCategory,
  CategoryInfo,
  getSavedExercises,
  Exercise,
  saveExercise,
} from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarDays, Plus, Check, Edit, X, Save, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import CategorySelector from "@/components/CategorySelector";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  date: z.date(),
  notes: z.string().optional(),
});

const AddWorkout = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [allCategories, setAllCategories] = useState<string[]>(getAllCategories());
  const [newWorkout, setNewWorkout] = useState<Partial<Workout>>({
    category: allCategories[0] || "Other",
    exercises: [],
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [isCategoryEditOpen, setIsCategoryEditOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState<CategoryInfo | null>(null);
  const [savedExercises, setSavedExercises] = useState<Exercise[]>(getSavedExercises());
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "Untitled Workout",
      date: new Date(),
    },
  });

  useEffect(() => {
    setAllCategories(getAllCategories());
    setNewWorkout(prev => ({ ...prev, category: getAllCategories()[0] || "Other" }));
  }, []);

  const handleCategorySelect = (category: string) => {
    setNewWorkout({ ...newWorkout, category: category });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewWorkout({ ...newWorkout, [e.target.name]: e.target.value });
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      form.setValue("date", date);
      setNewWorkout({ ...newWorkout, date: date });
    }
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setIsSaving(true);
    const newWorkoutData = {
      ...newWorkout,
      ...values,
    };
    createWorkout(newWorkoutData);
    toast({
      title: "Success!",
      description: "Workout saved successfully.",
    });
    setTimeout(() => {
      setIsSaving(false);
      navigate("/");
    }, 1000);
  };

  const handleCategoryLongPress = (categoryName: string) => {
    const categoryInfo = getCategoryInfo(categoryName);
    setCategoryToEdit(categoryInfo);
    setIsCategoryEditOpen(true);
  };

  const handleCreateCategory = (category: CategoryInfo) => {
    createCategory(category);
    setAllCategories(getAllCategories());
    setIsCategoryDialogOpen(false);
  };

  const handleUpdateCategory = (updateInfo: {
    oldName: string;
    newName: string;
    color: string;
    icon: string | null;
  }) => {
    updateCategory(updateInfo);
    setAllCategories(getAllCategories());
    setIsCategoryEditOpen(false);
  };

  const handleExerciseSelect = (exercise: Exercise) => {
    setSelectedExercise(exercise);
  };

  const handleSaveExercise = (exercise: Exercise) => {
    saveExercise(exercise);
    setSavedExercises(getSavedExercises());
  };

  return (
    <div className="bg-gradient-to-b from-background to-secondary/50 min-h-screen pb-20">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <header className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold tracking-tight text-balance">Add Workout</h1>
          <p className="text-muted-foreground mt-1">
            Create and customize your workout routine
          </p>
        </header>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Workout title" {...field} onChange={handleInputChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[240px] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarDays className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={handleDateSelect}
                        disabled={(date) =>
                          date > new Date()
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Categories section - fix for duplicate heading issue */}
            <div className="space-y-4 mb-6">
              <CategorySelector
                categories={allCategories}
                selectedCategory={newWorkout.category}
                onSelectCategory={handleCategorySelect}
                onLongPress={handleCategoryLongPress}
              />
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add any relevant notes about this workout"
                      className="resize-none"
                      {...field}
                      onChange={handleInputChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isSaving}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Workout
            </Button>
          </form>
        </Form>

        {/* Dialog for creating a new category */}
        <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="mt-4">
              <Plus className="h-4 w-4 mr-2" />
              Create Category
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create Category</DialogTitle>
              <DialogDescription>
                Add a new category to better organize your workouts.
              </DialogDescription>
            </DialogHeader>
            <CategoryForm onCreate={handleCreateCategory} />
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Cancel
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog for editing a category */}
        <Dialog open={isCategoryEditOpen} onOpenChange={setIsCategoryEditOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Category</DialogTitle>
              <DialogDescription>
                Edit the category to better organize your workouts.
              </DialogDescription>
            </DialogHeader>
            <CategoryForm
              categoryToEdit={categoryToEdit}
              onUpdate={handleUpdateCategory}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Cancel
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog for selecting an exercise */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="mt-4">
              <Plus className="h-4 w-4 mr-2" />
              Add Exercise
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Add Exercise</DialogTitle>
              <DialogDescription>
                Select an exercise from the list or create a new one.
              </DialogDescription>
            </DialogHeader>
            <ExerciseList
              exercises={savedExercises}
              onSelect={handleExerciseSelect}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Cancel
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

interface CategoryFormProps {
  onCreate?: (category: CategoryInfo) => void;
  onUpdate?: (updateInfo: {
    oldName: string;
    newName: string;
    color: string;
    icon: string | null;
  }) => void;
  categoryToEdit?: CategoryInfo | null;
}

const CategoryForm: React.FC<CategoryFormProps> = ({ onCreate, onUpdate, categoryToEdit }) => {
  const [name, setName] = useState(categoryToEdit?.name || "");
  const [color, setColor] = useState(categoryToEdit?.color || "#FFFFFF");
  const [icon, setIcon] = useState(categoryToEdit?.icon || null);
  const [availableIcons, setAvailableIcons] = useState<string[]>([]);

  useEffect(() => {
    // Dynamically collect all icon names from Lucide React
    const icons = Object.keys(require("lucide-react")).filter(key => {
      const component = (require("lucide-react") as any)[key];
      return typeof component === 'function';
    });
    setAvailableIcons(icons);
  }, []);

  const handleSubmit = () => {
    if (categoryToEdit && onUpdate) {
      onUpdate({
        oldName: categoryToEdit.name,
        newName: name,
        color: color,
        icon: icon,
      });
    } else if (onCreate) {
      onCreate({ name, color, icon });
    }
  };

  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="name" className="text-right">
          Name
        </Label>
        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="color" className="text-right">
          Color
        </Label>
        <Input
          type="color"
          id="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="col-span-3 h-10"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="icon" className="text-right">
          Icon
        </Label>
        <Select value={icon || ""} onValueChange={setIcon}>
          <SelectTrigger className="col-span-3">
            <SelectValue placeholder="Select an icon" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">None</SelectItem>
            {availableIcons.map(iconName => (
              <SelectItem key={iconName} value={iconName}>{iconName}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button onClick={handleSubmit} className="mt-4">
        {categoryToEdit ? "Update Category" : "Create Category"}
      </Button>
    </div>
  );
};

interface ExerciseListProps {
  exercises: Exercise[];
  onSelect: (exercise: Exercise) => void;
}

const ExerciseList: React.FC<ExerciseListProps> = ({ exercises, onSelect }) => {
  return (
    <div className="space-y-3">
      {exercises.map((exercise) => (
        <div
          key={exercise.id}
          className="p-3 rounded-md bg-muted/50 hover:bg-muted cursor-pointer"
          onClick={() => onSelect(exercise)}
        >
          <h4 className="font-medium">{exercise.name}</h4>
          <p className="text-sm text-muted-foreground">{exercise.type}</p>
        </div>
      ))}
    </div>
  );
};

export default AddWorkout;
