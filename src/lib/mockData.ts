
import { v4 as uuidv4 } from 'uuid';
import { subDays, isSameDay, isWithinInterval } from 'date-fns';
import * as LucideIcons from "lucide-react";

export interface PerformanceMetric {
  id: string;
  type: string; // weight, repetitions, duration, distance, restTime, etc
  value: number;
  unit: string; // kg, lb, reps, seconds, minutes, km, etc
}

export interface Set {
  id: string;
  reps: number;
  weight: number;
  metrics: PerformanceMetric[];
}

export interface Exercise {
  id: string;
  name: string;
  type: string;
  sets: Set[];
  reps?: string; // Legacy field, keeping for backward compatibility
  notes?: string;
  duration: number;
  media: string[];
}

export interface Workout {
  id: string;
  title: string;
  category: string;
  date: string;
  exercises: Exercise[];
  completed: boolean;
}

export interface CategoryInfo {
  label: string;
  color: string;
  icon: string | null;
}

// Function to generate the date range for the week carousel
const getDatesForWeek = (startDate: Date): { date: Date; dayName: string; dayNumber: number; isToday: boolean }[] => {
  const dates = [];
  for (let i = 0; i < 7; i++) {
    const date = subDays(startDate, -i);
    dates.push({
      date: date,
      dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
      dayNumber: date.getDate(),
      isToday: isSameDay(date, new Date()),
    });
  }
  return dates;
};

// Today's date as the starting point
const today = new Date();

// Generate the date range for the week carousel
export const dateRange = getDatesForWeek(today);

// Mock category information with icons
const categories: { [key: string]: CategoryInfo } = {
  "Full Body": { label: "Full Body", color: "#2563EB", icon: "Gymnastics" },
  "Upper Body": { label: "Upper Body", color: "#D97706", icon: "Man" },
  "Lower Body": { label: "Lower Body", color: "#059669", icon: "ShoePrints" },
  "Core": { label: "Core", color: "#DC2626", icon: "Waves" },
  "Cardio": { label: "Cardio", color: "#9333EA", icon: "Activity" },
  "Yoga": { label: "Yoga", color: "#E11D48", icon: "Yoga" },
};

export const getCategoryInfo = (category: string): CategoryInfo => {
  return categories[category] || { label: "Unknown", color: "#6B7280", icon: null };
};

export const getAllCategories = (): string[] => {
  return Object.keys(categories);
};

export const createCategory = (categoryInfo: { name: string; color: string; icon: string | null }) => {
  categories[categoryInfo.name] = {
    label: categoryInfo.name,
    color: categoryInfo.color,
    icon: categoryInfo.icon
  };
};

export const updateCategory = (oldName: string, categoryInfo: { name: string; color: string; icon: string | null }) => {
  if (oldName !== categoryInfo.name) {
    delete categories[oldName];
  }
  categories[categoryInfo.name] = {
    label: categoryInfo.name,
    color: categoryInfo.color,
    icon: categoryInfo.icon
  };
};

// Mock exercise types
const exerciseTypes = [
  "Strength", "Cardio", "Flexibility", "Balance", "Power", "Endurance", "Other"
];

export const getExerciseTypes = (): string[] => {
  return exerciseTypes;
};

// Mock saved exercises
const savedExercises: Exercise[] = [
  {
    id: uuidv4(),
    name: "Push-ups",
    type: "Strength",
    sets: [],
    notes: "",
    duration: 0,
    media: []
  },
  {
    id: uuidv4(),
    name: "Pull-ups",
    type: "Strength",
    sets: [],
    notes: "",
    duration: 0,
    media: []
  },
  {
    id: uuidv4(),
    name: "Running",
    type: "Cardio",
    sets: [],
    notes: "",
    duration: 0,
    media: []
  }
];

export const getSavedExercises = (): Exercise[] => {
  return savedExercises;
};

export const saveExercise = (exercise: Exercise) => {
  const existingIndex = savedExercises.findIndex(ex => ex.id === exercise.id);
  if (existingIndex >= 0) {
    savedExercises[existingIndex] = exercise;
  } else {
    savedExercises.push(exercise);
  }
};

// Mock workout data
let workouts: Workout[] = [
  {
    id: uuidv4(),
    title: "Full Body Blast",
    category: "Full Body",
    date: subDays(today, 2).toISOString().split('T')[0],
    exercises: [
      { 
        id: uuidv4(), 
        name: "Squats", 
        type: "Strength",
        sets: [
          { id: uuidv4(), reps: 12, weight: 0, metrics: [
            { id: uuidv4(), type: "repetitions", value: 12, unit: "reps" }
          ] },
          { id: uuidv4(), reps: 12, weight: 0, metrics: [
            { id: uuidv4(), type: "repetitions", value: 12, unit: "reps" }
          ] },
          { id: uuidv4(), reps: 12, weight: 0, metrics: [
            { id: uuidv4(), type: "repetitions", value: 12, unit: "reps" }
          ] }
        ],
        notes: "",
        duration: 0,
        media: []
      },
      { 
        id: uuidv4(), 
        name: "Push-ups", 
        type: "Strength",
        sets: [
          { id: uuidv4(), reps: 10, weight: 0, metrics: [
            { id: uuidv4(), type: "repetitions", value: 10, unit: "reps" }
          ] },
          { id: uuidv4(), reps: 8, weight: 0, metrics: [
            { id: uuidv4(), type: "repetitions", value: 8, unit: "reps" }
          ] },
          { id: uuidv4(), reps: 6, weight: 0, metrics: [
            { id: uuidv4(), type: "repetitions", value: 6, unit: "reps" }
          ] }
        ],
        notes: "Focus on form",
        duration: 0,
        media: []
      },
      { 
        id: uuidv4(), 
        name: "Dumbbell Rows", 
        type: "Strength",
        sets: [
          { id: uuidv4(), reps: 10, weight: 15, metrics: [
            { id: uuidv4(), type: "repetitions", value: 10, unit: "reps" },
            { id: uuidv4(), type: "weight", value: 15, unit: "kg" }
          ] },
          { id: uuidv4(), reps: 10, weight: 15, metrics: [
            { id: uuidv4(), type: "repetitions", value: 10, unit: "reps" },
            { id: uuidv4(), type: "weight", value: 15, unit: "kg" }
          ] },
          { id: uuidv4(), reps: 10, weight: 15, metrics: [
            { id: uuidv4(), type: "repetitions", value: 10, unit: "reps" },
            { id: uuidv4(), type: "weight", value: 15, unit: "kg" }
          ] }
        ],
        notes: "",
        duration: 0,
        media: []
      },
    ],
    completed: true,
  },
  {
    id: uuidv4(),
    title: "Morning Yoga",
    category: "Yoga",
    date: today.toISOString().split('T')[0],
    exercises: [
      { 
        id: uuidv4(), 
        name: "Sun Salutations", 
        type: "Flexibility",
        sets: [
          { id: uuidv4(), reps: 5, weight: 0, metrics: [
            { id: uuidv4(), type: "repetitions", value: 5, unit: "reps" },
            { id: uuidv4(), type: "duration", value: 3, unit: "minutes" }
          ] }
        ],
        notes: "Gentle flow",
        duration: 0,
        media: []
      },
      { 
        id: uuidv4(), 
        name: "Downward Dog", 
        type: "Flexibility",
        sets: [
          { id: uuidv4(), reps: 1, weight: 0, metrics: [
            { id: uuidv4(), type: "duration", value: 30, unit: "seconds" }
          ] },
          { id: uuidv4(), reps: 1, weight: 0, metrics: [
            { id: uuidv4(), type: "duration", value: 30, unit: "seconds" }
          ] },
          { id: uuidv4(), reps: 1, weight: 0, metrics: [
            { id: uuidv4(), type: "duration", value: 30, unit: "seconds" }
          ] }
        ],
        notes: "Focus on breathing",
        duration: 0,
        media: []
      },
    ],
    completed: false,
  },
  {
    id: uuidv4(),
    title: "Intense Core Workout",
    category: "Core",
    date: today.toISOString().split('T')[0],
    exercises: [
      { 
        id: uuidv4(), 
        name: "Crunches", 
        type: "Strength",
        sets: [
          { id: uuidv4(), reps: 20, weight: 0, metrics: [
            { id: uuidv4(), type: "repetitions", value: 20, unit: "reps" }
          ] },
          { id: uuidv4(), reps: 20, weight: 0, metrics: [
            { id: uuidv4(), type: "repetitions", value: 20, unit: "reps" }
          ] },
          { id: uuidv4(), reps: 20, weight: 0, metrics: [
            { id: uuidv4(), type: "repetitions", value: 20, unit: "reps" }
          ] }
        ],
        notes: "",
        duration: 0,
        media: []
      },
      { 
        id: uuidv4(), 
        name: "Plank", 
        type: "Strength",
        sets: [
          { id: uuidv4(), reps: 1, weight: 0, metrics: [
            { id: uuidv4(), type: "duration", value: 45, unit: "seconds" }
          ] },
          { id: uuidv4(), reps: 1, weight: 0, metrics: [
            { id: uuidv4(), type: "duration", value: 45, unit: "seconds" }
          ] },
          { id: uuidv4(), reps: 1, weight: 0, metrics: [
            { id: uuidv4(), type: "duration", value: 45, unit: "seconds" }
          ] }
        ],
        notes: "Keep body straight",
        duration: 0,
        media: []
      },
    ],
    completed: true,
  },
  {
    id: uuidv4(),
    title: "Cardio Day",
    category: "Cardio",
    date: today.toISOString().split('T')[0],
    exercises: [
      { 
        id: uuidv4(), 
        name: "Running", 
        type: "Cardio",
        sets: [
          { id: uuidv4(), reps: 1, weight: 0, metrics: [
            { id: uuidv4(), type: "duration", value: 30, unit: "minutes" },
            { id: uuidv4(), type: "distance", value: 5, unit: "km" }
          ] }
        ],
        notes: "Light jog",
        duration: 30,
        media: []
      },
    ],
    completed: false,
  },
  {
    id: uuidv4(),
    title: "Leg Day",
    category: "Lower Body",
    date: subDays(today, 1).toISOString().split('T')[0],
    exercises: [
      { 
        id: uuidv4(), 
        name: "Squats", 
        type: "Strength",
        sets: [
          { id: uuidv4(), reps: 12, weight: 40, metrics: [
            { id: uuidv4(), type: "repetitions", value: 12, unit: "reps" },
            { id: uuidv4(), type: "weight", value: 40, unit: "kg" }
          ] },
          { id: uuidv4(), reps: 12, weight: 40, metrics: [
            { id: uuidv4(), type: "repetitions", value: 12, unit: "reps" },
            { id: uuidv4(), type: "weight", value: 40, unit: "kg" }
          ] },
          { id: uuidv4(), reps: 12, weight: 40, metrics: [
            { id: uuidv4(), type: "repetitions", value: 12, unit: "reps" },
            { id: uuidv4(), type: "weight", value: 40, unit: "kg" }
          ] },
          { id: uuidv4(), reps: 12, weight: 40, metrics: [
            { id: uuidv4(), type: "repetitions", value: 12, unit: "reps" },
            { id: uuidv4(), type: "weight", value: 40, unit: "kg" }
          ] }
        ],
        notes: "",
        duration: 0,
        media: []
      },
      { 
        id: uuidv4(), 
        name: "Hamstring Curls", 
        type: "Strength",
        sets: [
          { id: uuidv4(), reps: 15, weight: 30, metrics: [
            { id: uuidv4(), type: "repetitions", value: 15, unit: "reps" },
            { id: uuidv4(), type: "weight", value: 30, unit: "kg" }
          ] },
          { id: uuidv4(), reps: 15, weight: 30, metrics: [
            { id: uuidv4(), type: "repetitions", value: 15, unit: "reps" },
            { id: uuidv4(), type: "weight", value: 30, unit: "kg" }
          ] },
          { id: uuidv4(), reps: 15, weight: 30, metrics: [
            { id: uuidv4(), type: "repetitions", value: 15, unit: "reps" },
            { id: uuidv4(), type: "weight", value: 30, unit: "kg" }
          ] }
        ],
        notes: "",
        duration: 0,
        media: []
      },
    ],
    completed: true,
  },
  {
    id: uuidv4(),
    title: "Arm Day",
    category: "Upper Body",
    date: subDays(today, 3).toISOString().split('T')[0],
    exercises: [
      { 
        id: uuidv4(), 
        name: "Bicep Curls", 
        type: "Strength",
        sets: [
          { id: uuidv4(), reps: 10, weight: 15, metrics: [
            { id: uuidv4(), type: "repetitions", value: 10, unit: "reps" },
            { id: uuidv4(), type: "weight", value: 15, unit: "kg" }
          ] },
          { id: uuidv4(), reps: 10, weight: 15, metrics: [
            { id: uuidv4(), type: "repetitions", value: 10, unit: "reps" },
            { id: uuidv4(), type: "weight", value: 15, unit: "kg" }
          ] },
          { id: uuidv4(), reps: 10, weight: 15, metrics: [
            { id: uuidv4(), type: "repetitions", value: 10, unit: "reps" },
            { id: uuidv4(), type: "weight", value: 15, unit: "kg" }
          ] }
        ],
        notes: "",
        duration: 0,
        media: []
      },
      { 
        id: uuidv4(), 
        name: "Tricep Extensions", 
        type: "Strength",
        sets: [
          { id: uuidv4(), reps: 12, weight: 12.5, metrics: [
            { id: uuidv4(), type: "repetitions", value: 12, unit: "reps" },
            { id: uuidv4(), type: "weight", value: 12.5, unit: "kg" }
          ] },
          { id: uuidv4(), reps: 12, weight: 12.5, metrics: [
            { id: uuidv4(), type: "repetitions", value: 12, unit: "reps" },
            { id: uuidv4(), type: "weight", value: 12.5, unit: "kg" }
          ] },
          { id: uuidv4(), reps: 12, weight: 12.5, metrics: [
            { id: uuidv4(), type: "repetitions", value: 12, unit: "reps" },
            { id: uuidv4(), type: "weight", value: 12.5, unit: "kg" }
          ] }
        ],
        notes: "",
        duration: 0,
        media: []
      },
    ],
    completed: false,
  },
];

// Function to retrieve workouts for a specific date
export const getWorkoutsByDate = (date: Date): Workout[] => {
  const dateString = date.toISOString().split('T')[0];
  return workouts.filter((workout) => workout.date === dateString);
};

// Function to get workouts for yesterday
export const getWorkoutsForYesterday = (): Workout[] => {
  const yesterday = subDays(today, 1).toISOString().split('T')[0];
  return workouts.filter((workout) => workout.date === yesterday);
};

// Function to get workouts for the past week (excluding today and yesterday)
export const getWorkoutsForPastWeek = (): Workout[] => {
  const pastWeek: Workout[] = [];
  for (let i = 2; i <= 6; i++) {
    const pastDate = subDays(today, i).toISOString().split('T')[0];
    const workoutsForDate = workouts.filter((workout) => workout.date === pastDate);
    pastWeek.push(...workoutsForDate);
  }
  return pastWeek;
};

// Function to get workouts in a date range
export const getWorkoutsInDateRange = (from: Date, to: Date): Workout[] => {
  return workouts.filter(workout => {
    const workoutDate = new Date(workout.date);
    return isWithinInterval(workoutDate, { start: from, end: to });
  });
};

// Get all workouts (for filtering by date range)
export const getAllWorkouts = (): Workout[] => {
  return [...workouts];
};
