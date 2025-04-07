import { v4 as uuidv4 } from 'uuid';
import { subDays, isSameDay } from 'date-fns';
import * as LucideIcons from "lucide-react";

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: string;
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

// Mock category information
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

// Mock workout data
let workouts: Workout[] = [
  {
    id: uuidv4(),
    title: "Full Body Blast",
    category: "Full Body",
    date: subDays(today, 2).toISOString().split('T')[0],
    exercises: [
      { id: uuidv4(), name: "Squats", sets: 3, reps: "12" },
      { id: uuidv4(), name: "Push-ups", sets: 3, reps: "Max" },
      { id: uuidv4(), name: "Dumbbell Rows", sets: 3, reps: "10" },
    ],
    completed: true,
  },
  {
    id: uuidv4(),
    title: "Morning Yoga",
    category: "Yoga",
    date: today.toISOString().split('T')[0],
    exercises: [
      { id: uuidv4(), name: "Sun Salutations", sets: 1, reps: "5" },
      { id: uuidv4(), name: "Downward Dog", sets: 3, reps: "Hold 30s" },
    ],
    completed: false,
  },
  {
    id: uuidv4(),
    title: "Intense Core Workout",
    category: "Core",
    date: today.toISOString().split('T')[0],
    exercises: [
      { id: uuidv4(), name: "Crunches", sets: 3, reps: "20" },
      { id: uuidv4(), name: "Plank", sets: 3, reps: "Hold 45s" },
    ],
    completed: true,
  },
  {
    id: uuidv4(),
    title: "Cardio Day",
    category: "Cardio",
    date: today.toISOString().split('T')[0],
    exercises: [
      { id: uuidv4(), name: "Running", sets: 1, reps: "30 minutes" },
    ],
    completed: false,
  },
  {
    id: uuidv4(),
    title: "Leg Day",
    category: "Lower Body",
    date: subDays(today, 1).toISOString().split('T')[0],
    exercises: [
      { id: uuidv4(), name: "Squats", sets: 4, reps: "12" },
      { id: uuidv4(), name: "Hamstring Curls", sets: 3, reps: "15" },
    ],
    completed: true,
  },
  {
    id: uuidv4(),
    title: "Arm Day",
    category: "Upper Body",
    date: subDays(today, 3).toISOString().split('T')[0],
    exercises: [
      { id: uuidv4(), name: "Bicep Curls", sets: 3, reps: "10" },
      { id: uuidv4(), name: "Tricep Extensions", sets: 3, reps: "12" },
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

// Get all workouts (for filtering by date range)
export const getAllWorkouts = (): Workout[] => {
  return [...workouts];
};
