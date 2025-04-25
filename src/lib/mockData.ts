import { v4 as uuidv4 } from 'uuid';
import { addDays, format, startOfWeek, isSameDay } from 'date-fns';

export interface Workout {
  id: string;
  title: string;
  category: string;
  exercises: Exercise[];
  date: Date;
  completed: boolean;
}

export interface Exercise {
  id: string;
  name: string;
  type: string;
  sets?: Set[];
  notes?: string;
  duration: number;
  media: string[];
}

export interface Set {
  id: string;
  setNumber: number;
  metrics: Metric[];
  // These are no longer needed as we've moved to metrics
  reps?: number;
  weight?: number;
}

export interface Metric {
  id: string;
  type: string;
  value: number;
  unit: string;
}

export interface CategoryInfo {
  name: string;
  color: string;
  icon: string | null;
}

// Mock data for categories
const categories: CategoryInfo[] = [
  { name: "Strength", color: "#f43f5e", icon: "Dumbbell" },
  { name: "Cardio", color: "#14b8a6", icon: "Heart" },
  { name: "Yoga", color: "#8b5cf6", icon: "Yoga" },
  { name: "Stretching", color: "#f97316", icon: "Stretch" },
  { name: "HIIT", color: "#0ea5e9", icon: "Bolt" },
  { name: "Pilates", color: "#64748b", icon: "Pilates" },
];

// Function to get all categories
export const getAllCategories = (): string[] => {
  return categories.map(category => category.name);
};

// Function to get category info by name
export const getCategoryInfo = (categoryName: string): CategoryInfo => {
  const category = categories.find(cat => cat.name === categoryName);
  return category || { name: "Unknown", color: "#64748b", icon: null };
};

// Function to create a new category
export const createCategory = (categoryInfo: CategoryInfo): void => {
  categories.push(categoryInfo);
};

// Function to update an existing category
export const updateCategory = (oldName: string, newCategoryInfo: CategoryInfo): void => {
  const index = categories.findIndex(cat => cat.name === oldName);
  if (index !== -1) {
    categories[index] = newCategoryInfo;
  }
};

// Exercise types
const exerciseTypes = [
  "Strength", "Cardio", "Yoga", "Stretching", "HIIT", "Pilates", "Other"
];

// Function to get all exercise types
export const getExerciseTypes = (): string[] => {
  return exerciseTypes;
};

// Saved exercises for reuse
let savedExercises: Exercise[] = [];

// Function to get saved exercises
export const getSavedExercises = (): Exercise[] => {
  return savedExercises;
};

// Function to save an exercise
export const saveExercise = (exercise: Exercise): void => {
  const existingIndex = savedExercises.findIndex(e => e.id === exercise.id);
  if (existingIndex !== -1) {
    savedExercises[existingIndex] = exercise;
  } else {
    savedExercises.push(exercise);
  }
};

// Generate date range for the calendar
export const dateRange = (() => {
  const today = new Date();
  const startDate = startOfWeek(today);
  const result = [];
  
  for (let i = -14; i < 28; i++) {
    const date = addDays(startDate, i);
    result.push({
      date,
      dayName: format(date, 'EEE'),
      dayNumber: format(date, 'd'),
      isToday: isSameDay(date, today)
    });
  }
  
  return result;
})();

// Mock data for exercises
const mockExercises: Exercise[] = [
  {
    id: uuidv4(),
    name: "Push-ups",
    type: "Strength",
    sets: [
      {
        id: uuidv4(),
        setNumber: 1,
        metrics: [
          { id: uuidv4(), type: "repetitions", value: 12, unit: "reps" },
        ],
      },
      {
        id: uuidv4(),
        setNumber: 2,
        metrics: [
          { id: uuidv4(), type: "repetitions", value: 10, unit: "reps" },
        ],
      },
      {
        id: uuidv4(),
        setNumber: 3,
        metrics: [
          { id: uuidv4(), type: "repetitions", value: 8, unit: "reps" },
        ],
      },
    ],
    notes: "Focus on form and controlled movements.",
    duration: 0,
    media: [],
  },
  {
    id: uuidv4(),
    name: "Running",
    type: "Cardio",
    sets: [
      {
        id: uuidv4(),
        setNumber: 1,
        metrics: [
          { id: uuidv4(), type: "distance", value: 3, unit: "km" },
          { id: uuidv4(), type: "duration", value: 25, unit: "min" },
        ],
      },
    ],
    notes: "Easy pace, maintain consistent breathing.",
    duration: 25,
    media: [],
  },
  {
    id: uuidv4(),
    name: "Yoga Flow",
    type: "Yoga",
    sets: [],
    notes: "Gentle flow to improve flexibility and reduce stress.",
    duration: 30,
    media: [],
  },
  {
    id: uuidv4(),
    name: "Bicep Curls",
    type: "Strength",
    sets: [
      {
        id: uuidv4(),
        setNumber: 1,
        metrics: [
          { id: uuidv4(), type: "weight", value: 20, unit: "lb" },
          { id: uuidv4(), type: "repetitions", value: 10, unit: "reps" },
        ],
      },
      {
        id: uuidv4(),
        setNumber: 2,
        metrics: [
          { id: uuidv4(), type: "weight", value: 20, unit: "lb" },
          { id: uuidv4(), type: "repetitions", value: 8, unit: "reps" },
        ],
      },
      {
        id: uuidv4(),
        setNumber: 3,
        metrics: [
          { id: uuidv4(), type: "weight", value: 20, unit: "lb" },
          { id: uuidv4(), type: "repetitions", value: 6, unit: "reps" },
        ],
      },
    ],
    notes: "Controlled movement, squeeze at the top.",
    duration: 0,
    media: [],
  },
  {
    id: uuidv4(),
    name: "Plank",
    type: "Strength",
    sets: [
      {
        id: uuidv4(),
        setNumber: 1,
        metrics: [
          { id: uuidv4(), type: "duration", value: 60, unit: "sec" },
        ],
      },
      {
        id: uuidv4(),
        setNumber: 2,
        metrics: [
          { id: uuidv4(), type: "duration", value: 60, unit: "sec" },
        ],
      },
      {
        id: uuidv4(),
        setNumber: 3,
        metrics: [
          { id: uuidv4(), type: "duration", value: 60, unit: "sec" },
        ],
      },
    ],
    notes: "Engage core, maintain straight line from head to heels.",
    duration: 0,
    media: [],
  },
  {
    id: uuidv4(),
    name: "Cycling",
    type: "Cardio",
    sets: [
      {
        id: uuidv4(),
        setNumber: 1,
        metrics: [
          { id: uuidv4(), type: "distance", value: 10, unit: "km" },
          { id: uuidv4(), type: "duration", value: 40, unit: "min" },
        ],
      },
    ],
    notes: "Moderate intensity, focus on cadence.",
    duration: 40,
    media: [],
  },
  {
    id: uuidv4(),
    name: "Squats",
    type: "Strength",
    sets: [
      {
        id: uuidv4(),
        setNumber: 1,
        metrics: [
          { id: uuidv4(), type: "repetitions", value: 15, unit: "reps" },
        ],
      },
      {
        id: uuidv4(),
        setNumber: 2,
        metrics: [
          { id: uuidv4(), type: "repetitions", value: 12, unit: "reps" },
        ],
      },
      {
        id: uuidv4(),
        setNumber: 3,
        metrics: [
          { id: uuidv4(), type: "repetitions", value: 10, unit: "reps" },
        ],
      },
    ],
    notes: "Maintain good form, chest up, back straight.",
    duration: 0,
    media: [],
  },
  {
    id: uuidv4(),
    name: "Swimming",
    type: "Cardio",
    sets: [
      {
        id: uuidv4(),
        setNumber: 1,
        metrics: [
          { id: uuidv4(), type: "distance", value: 1, unit: "km" },
          { id: uuidv4(), type: "duration", value: 30, unit: "min" },
        ],
      },
    ],
    notes: "Freestyle, focus on long strokes.",
    duration: 30,
    media: [],
  },
  {
    id: uuidv4(),
    name: "Deadlifts",
    type: "Strength",
    sets: [
      {
        id: uuidv4(),
        setNumber: 1,
        metrics: [
          { id: uuidv4(), type: "weight", value: 50, unit: "kg" },
          { id: uuidv4(), type: "repetitions", value: 5, unit: "reps" },
        ],
      },
      {
        id: uuidv4(),
        setNumber: 2,
        metrics: [
          { id: uuidv4(), type: "weight", value: 50, unit: "kg" },
          { id: uuidv4(), type: "repetitions", value: 5, unit: "reps" },
        ],
      },
      {
        id: uuidv4(),
        setNumber: 3,
        metrics: [
          { id: uuidv4(), type: "weight", value: 50, unit: "kg" },
          { id: uuidv4(), type: "repetitions", value: 5, unit: "reps" },
        ],
      },
    ],
    notes: "Maintain proper form, engage core.",
    duration: 0,
    media: [],
  },
  {
    id: uuidv4(),
    name: "HIIT Sprints",
    type: "HIIT",
    sets: [
      {
        id: uuidv4(),
        setNumber: 1,
        metrics: [
          { id: uuidv4(), type: "duration", value: 30, unit: "sec" },
          { id: uuidv4(), type: "restTime", value: 30, unit: "sec" },
        ],
      },
      {
        id: uuidv4(),
        setNumber: 2,
        metrics: [
          { id: uuidv4(), type: "duration", value: 30, unit: "sec" },
          { id: uuidv4(), type: "restTime", value: 30, unit: "sec" },
        ],
      },
      {
        id: uuidv4(),
        setNumber: 3,
        metrics: [
          { id: uuidv4(), type: "duration", value: 30, unit: "sec" },
          { id: uuidv4(), type: "restTime", value: 30, unit: "sec" },
        ],
      },
    ],
    notes: "Full intensity sprints, short rest periods.",
    duration: 15,
    media: [],
  },
];

// Mock data for workouts
const today = new Date();
const yesterday = new Date(today);
yesterday.setDate(today.getDate() - 1);
const pastWeek = new Date(today);
pastWeek.setDate(today.getDate() - 3);
const otherDay = new Date(today);
otherDay.setDate(today.getDate() - 10);

const todayWorkouts: Workout[] = [
  {
    id: uuidv4(),
    title: "Morning Strength",
    category: "Strength",
    exercises: [mockExercises[0], mockExercises[3], mockExercises[4]],
    date: today,
    completed: true,
  },
  {
    id: uuidv4(),
    title: "Evening Cardio",
    category: "Cardio",
    exercises: [mockExercises[1], mockExercises[5]],
    date: today,
    completed: false,
  },
  {
    id: uuidv4(),
    title: "Afternoon Yoga",
    category: "Yoga",
    exercises: [mockExercises[2]],
    date: today,
    completed: false,
  },
  {
    id: uuidv4(),
    title: "Night HIIT",
    category: "HIIT",
    exercises: [mockExercises[9]],
    date: today,
    completed: false,
  },
];

const yesterdayWorkouts: Workout[] = [
  {
    id: uuidv4(),
    title: "Yoga Session",
    category: "Yoga",
    exercises: [mockExercises[2]],
    date: yesterday,
    completed: true,
  },
];

const pastWeekWorkouts: Workout[] = [
  {
    id: uuidv4(),
    title: "Full Body Workout",
    category: "HIIT",
    exercises: [mockExercises[6], mockExercises[7], mockExercises[8]],
    date: pastWeek,
    completed: true,
  },
];

const otherWorkouts: Workout[] = [
  {
    id: uuidv4(),
    title: "Long Run",
    category: "Cardio",
    exercises: [mockExercises[9]],
    date: otherDay,
    completed: false,
  },
];

// Function to get all workouts
export const getAllWorkouts = (): Workout[] => {
  return [
    ...todayWorkouts,
    ...yesterdayWorkouts,
    ...pastWeekWorkouts,
    ...otherWorkouts
  ];
};

// Function to get workouts by date
export const getWorkoutsByDate = (date: Date): Workout[] => {
  const formattedDate = date.toDateString();
  return [
    ...todayWorkouts.filter(workout => workout.date.toDateString() === formattedDate),
    ...yesterdayWorkouts.filter(workout => workout.date.toDateString() === formattedDate),
    ...pastWeekWorkouts.filter(workout => workout.date.toDateString() === formattedDate),
    ...otherWorkouts.filter(workout => workout.date.toDateString() === formattedDate),
  ];
};

// Function to get workouts for yesterday
export const getWorkoutsForYesterday = (): Workout[] => {
  return yesterdayWorkouts;
};

// Function to get workouts for the past week (excluding today and yesterday)
export const getWorkoutsForPastWeek = (): Workout[] => {
  return pastWeekWorkouts;
};

// Add the getWorkoutById function:
export const getWorkoutById = (id: string): Workout | undefined => {
  const allWorkouts = [
    ...todayWorkouts,
    ...yesterdayWorkouts,
    ...pastWeekWorkouts,
    ...otherWorkouts
  ];
  
  return allWorkouts.find(workout => workout.id === id);
};

// Initialize saved exercises with mock data for reuse
savedExercises = [...mockExercises];
