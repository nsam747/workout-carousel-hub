
import { v4 as uuidv4 } from 'uuid';
import { addDays, format } from 'date-fns';

export interface Workout {
  id: string;
  title: string;
  date: Date;
  category: string;
  exercises: Exercise[];
  completed: boolean;
}

export interface Exercise {
  id: string;
  name: string;
  type: string;
  sets: ExerciseSet[];
  duration: number;
  notes: string;
  media: string[];
}

export interface ExerciseSet {
  id: string;
  setNumber: number;
  reps: number;
  weight: number;
  notes?: string;
}

export interface CategoryInfo {
  name: string;
  color: string;
  icon: string | null;
}

// Generate a date range for the carousel (today +/- 14 days)
export const dateRange = Array.from({ length: 29 }, (_, i) => {
  const date = addDays(new Date(), i - 14);
  const isToday = i === 14;
  return {
    date,
    dayName: format(date, 'EEE'),
    dayNumber: format(date, 'd'),
    isToday
  };
});

const generateId = (): string => {
  return uuidv4();
};

const today = new Date();
const yesterday = new Date(today);
yesterday.setDate(today.getDate() - 1);
const twoDaysAgo = new Date(today);
twoDaysAgo.setDate(today.getDate() - 2);

// Store category information
interface CategoryData {
  color: string;
  icon: string | null;
}

let categoryData: Record<string, CategoryData> = {
  "Strength": { color: "#ea384c", icon: "Dumbbell" },
  "Cardio": { color: "#0EA5E9", icon: "Activity" },
  "Flexibility": { color: "#10B981", icon: "Leaf" },
  "Other": { color: "#9b87f5", icon: null }
};

let workouts: Workout[] = [
  {
    id: generateId(),
    title: "Morning Yoga",
    date: yesterday,
    category: "Flexibility",
    exercises: [
      {
        id: generateId(),
        name: "Sun Salutations",
        type: "Yoga",
        sets: [],
        duration: 30,
        notes: "Focus on breathing",
        media: [],
      },
    ],
    completed: true,
  },
  {
    id: generateId(),
    title: "Evening Run",
    date: today,
    category: "Cardio",
    exercises: [
      {
        id: generateId(),
        name: "Treadmill Run",
        type: "Running",
        sets: [],
        duration: 45,
        notes: "Maintain pace",
        media: [],
      },
    ],
    completed: false,
  },
  {
    id: generateId(),
    title: "Strength Training",
    date: twoDaysAgo,
    category: "Strength",
    exercises: [
      {
        id: generateId(),
        name: "Bench Press",
        type: "Strength",
        sets: [
          { id: generateId(), setNumber: 1, reps: 8, weight: 100 },
          { id: generateId(), setNumber: 2, reps: 8, weight: 100 },
          { id: generateId(), setNumber: 3, reps: 6, weight: 100 },
        ],
        duration: 0,
        notes: "Controlled movements",
        media: [],
      },
      {
        id: generateId(),
        name: "Squats",
        type: "Strength",
        sets: [
          { id: generateId(), setNumber: 1, reps: 10, weight: 150 },
          { id: generateId(), setNumber: 2, reps: 8, weight: 150 },
          { id: generateId(), setNumber: 3, reps: 6, weight: 150 },
        ],
        duration: 0,
        notes: "Full range of motion",
        media: [],
      },
    ],
    completed: true,
  },
];

// Store all exercises for reuse
let savedExercises: Exercise[] = [];

// Initialize saved exercises from workouts
workouts.forEach(workout => {
  workout.exercises.forEach(exercise => {
    if (!savedExercises.some(e => e.name === exercise.name && e.type === exercise.type)) {
      // Create a copy without the sets and other workout-specific data
      const savedExercise: Exercise = {
        id: generateId(),
        name: exercise.name,
        type: exercise.type,
        sets: [],
        duration: 0,
        notes: "",
        media: []
      };
      savedExercises.push(savedExercise);
    }
  });
});

export const getWorkoutsByDate = (date: Date): Workout[] => {
  return workouts.filter(
    (workout) =>
      workout.date.getFullYear() === date.getFullYear() &&
      workout.date.getMonth() === date.getMonth() &&
      workout.date.getDate() === date.getDate()
  );
};

export const getCategoryColor = (category: string): string => {
  switch (category) {
    case "Strength":
      return "border-red-500";
    case "Cardio":
      return "border-blue-500";
    case "Flexibility":
      return "border-green-500";
    default:
      return "border-gray-500";
  }
};

// Function to get all unique categories from workouts
export const getAllCategories = (): string[] => {
  const categories = workouts.map((workout) => workout.category);
  const uniqueCategories = [...new Set(categories)];
  return uniqueCategories;
};

// Function to get category info (name, color, and icon)
export const getCategoryInfo = (category: string): CategoryInfo => {
  const data = categoryData[category] || { color: "#9b87f5", icon: null };
  return {
    name: category,
    color: data.color,
    icon: data.icon
  };
};

// Function to add a new category with color and optional icon
export const addCategory = (category: string, color: string = "#9b87f5", icon: string | null = null): void => {
  // In a real app, this would update a database
  // For now, we just make sure our mock data includes this category
  // and store the color and icon
  if (!getAllCategories().includes(category)) {
    categoryData[category] = { color, icon };
    
    const sampleWorkout: Workout = {
      id: generateId(),
      title: "Sample Workout",
      date: new Date(),
      category,
      exercises: [],
      completed: false,
    };
    workouts.push(sampleWorkout);
  }
};

// Function to update a category name, color, and/or icon
export const updateCategory = (oldName: string, newName: string, color: string, icon: string | null): void => {
  // Update category info
  if (oldName === newName) {
    // Just updating the color/icon
    categoryData[oldName] = { color, icon };
  } else {
    // Changing name and possibly color/icon
    delete categoryData[oldName];
    categoryData[newName] = { color, icon };
    
    // Update all workouts with this category
    workouts.forEach(workout => {
      if (workout.category === oldName) {
        workout.category = newName;
      }
    });
  }
};

// Function to create a new workout
export const createWorkout = (workout: Partial<Workout>): Workout => {
  const newWorkout: Workout = {
    id: generateId(),
    title: workout.title || "New Workout",
    date: workout.date || new Date(),
    category: workout.category || "Other",
    exercises: workout.exercises || [],
    completed: workout.completed || false,
  };
  
  workouts.push(newWorkout);
  return newWorkout;
};

// Function to get unique exercise types
export const getExerciseTypes = (): string[] => {
  const types = [
    "Strength",
    "Cardio",
    "Flexibility",
    "Balance",
    "HIIT",
    "Plyometric",
    "Bodyweight",
    "Other"
  ];
  return types;
};

// Function to get all saved exercises
export const getSavedExercises = (): Exercise[] => {
  return [...savedExercises];
};

// Function to add a new saved exercise
export const saveExercise = (exercise: Exercise): void => {
  // Don't save duplicates
  if (!savedExercises.some(e => e.name === exercise.name && e.type === exercise.type)) {
    // Create a copy without the specific workout details
    const savedExercise: Exercise = {
      id: generateId(),
      name: exercise.name,
      type: exercise.type,
      sets: [],
      duration: 0,
      notes: "",
      media: []
    };
    savedExercises.push(savedExercise);
  }
};
