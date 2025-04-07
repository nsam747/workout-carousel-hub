import { v4 as uuidv4 } from 'uuid';

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
  sets?: Set[];
  notes?: string;
  duration: number;
  media: string[];
}

export interface Set {
  id: string;
  metrics: PerformanceMetric[];
}

export interface PerformanceMetric {
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

// Mock data
let mockWorkouts: Workout[] = [
  {
    id: uuidv4(),
    title: "Morning Yoga",
    date: new Date(),
    category: "Yoga",
    exercises: [
      {
        id: uuidv4(),
        name: "Sun Salutations",
        type: "Warm-up",
        sets: [
          { 
            id: uuidv4(), 
            metrics: [
              { id: uuidv4(), type: "repetitions", value: 10, unit: "reps" }
            ] 
          }
        ],
        notes: "Focus on breathing",
        duration: 15,
        media: [],
      },
      {
        id: uuidv4(),
        name: "Downward Dog",
        type: "Stretch",
        sets: [
          { 
            id: uuidv4(), 
            metrics: [
              { id: uuidv4(), type: "duration", value: 30, unit: "sec" }
            ] 
          }
        ],
        notes: "Hold for 5 breaths",
        duration: 5,
        media: [],
      },
    ],
    completed: true,
  },
  {
    id: uuidv4(),
    title: "Afternoon Run",
    date: new Date(),
    category: "Cardio",
    exercises: [
      {
        id: uuidv4(),
        name: "Treadmill Run",
        type: "Cardio",
        sets: [
          { 
            id: uuidv4(), 
            metrics: [
              { id: uuidv4(), type: "distance", value: 5, unit: "km" },
              { id: uuidv4(), type: "duration", value: 30, unit: "min" }
            ] 
          }
        ],
        notes: "Moderate pace",
        duration: 30,
        media: [],
      },
    ],
    completed: false,
  },
  {
    id: uuidv4(),
    title: "Evening Lift",
    date: new Date(),
    category: "Strength Training",
    exercises: [
      {
        id: uuidv4(),
        name: "Bench Press",
        type: "Chest",
        sets: [
          { 
            id: uuidv4(), 
            metrics: [
              { id: uuidv4(), type: "weight", value: 70, unit: "kg" },
              { id: uuidv4(), type: "repetitions", value: 8, unit: "reps" }
            ] 
          },
          { 
            id: uuidv4(), 
            metrics: [
              { id: uuidv4(), type: "weight", value: 75, unit: "kg" },
              { id: uuidv4(), type: "repetitions", value: 6, unit: "reps" }
            ] 
          },
          { 
            id: uuidv4(), 
            metrics: [
              { id: uuidv4(), type: "weight", value: 80, unit: "kg" },
              { id: uuidv4(), type: "repetitions", value: 4, unit: "reps" }
            ] 
          },
        ],
        notes: "Controlled movements",
        duration: 20,
        media: [],
      },
      {
        id: uuidv4(),
        name: "Bicep Curls",
        type: "Arms",
        sets: [
          { 
            id: uuidv4(), 
            metrics: [
              { id: uuidv4(), type: "weight", value: 30, unit: "kg" },
              { id: uuidv4(), type: "repetitions", value: 10, unit: "reps" }
            ] 
          },
          { 
            id: uuidv4(), 
            metrics: [
              { id: uuidv4(), type: "weight", value: 32.5, unit: "kg" },
              { id: uuidv4(), type: "repetitions", value: 8, unit: "reps" }
            ] 
          },
          { 
            id: uuidv4(), 
            metrics: [
              { id: uuidv4(), type: "weight", value: 35, unit: "kg" },
              { id: uuidv4(), type: "repetitions", value: 6, unit: "reps" }
            ] 
          },
        ],
        notes: "Use proper form",
        duration: 15,
        media: [],
      },
    ],
    completed: false,
  },
  {
    id: uuidv4(),
    title: "Core workout",
    date: new Date('2024-07-07'),
    category: "Core",
    exercises: [
      {
        id: uuidv4(),
        name: "Crunches",
        type: "Abs",
        sets: [
          { 
            id: uuidv4(), 
            metrics: [
              { id: uuidv4(), type: "repetitions", value: 20, unit: "reps" }
            ] 
          },
          { 
            id: uuidv4(), 
            metrics: [
              { id: uuidv4(), type: "repetitions", value: 20, unit: "reps" }
            ] 
          },
          { 
            id: uuidv4(), 
            metrics: [
              { id: uuidv4(), type: "repetitions", value: 20, unit: "reps" }
            ] 
          },
        ],
        notes: "Engage core",
        duration: 10,
        media: [],
      },
    ],
    completed: true,
  },
  {
    id: uuidv4(),
    title: "Leg day",
    date: new Date('2024-07-06'),
    category: "Strength Training",
    exercises: [
      {
        id: uuidv4(),
        name: "Squats",
        type: "Legs",
        sets: [
          { 
            id: uuidv4(), 
            metrics: [
              { id: uuidv4(), type: "weight", value: 50, unit: "kg" },
              { id: uuidv4(), type: "repetitions", value: 12, unit: "reps" }
            ] 
          },
          { 
            id: uuidv4(), 
            metrics: [
              { id: uuidv4(), type: "weight", value: 60, unit: "kg" },
              { id: uuidv4(), type: "repetitions", value: 10, unit: "reps" }
            ] 
          },
          { 
            id: uuidv4(), 
            metrics: [
              { id: uuidv4(), type: "weight", value: 70, unit: "kg" },
              { id: uuidv4(), type: "repetitions", value: 8, unit: "reps" }
            ] 
          },
        ],
        notes: "Keep back straight",
        duration: 25,
        media: [],
      },
    ],
    completed: true,
  },
  {
    id: uuidv4(),
    title: "Swimming",
    date: new Date('2024-07-06'),
    category: "Cardio",
    exercises: [
      {
        id: uuidv4(),
        name: "Freestyle",
        type: "Swimming",
        sets: [
          { 
            id: uuidv4(), 
            metrics: [
              { id: uuidv4(), type: "distance", value: 40, unit: "laps" }
            ] 
          }
        ],
        notes: "Maintain rhythm",
        duration: 40,
        media: [],
      },
    ],
    completed: true,
  },
  {
    id: uuidv4(),
    title: "Restorative Yoga",
    date: new Date('2024-07-05'),
    category: "Yoga",
    exercises: [
      {
        id: uuidv4(),
        name: "Child's Pose",
        type: "Stretch",
        sets: [
          { 
            id: uuidv4(), 
            metrics: [
              { id: uuidv4(), type: "duration", value: 600, unit: "sec" }
            ] 
          }
        ],
        notes: "Relax and breathe",
        duration: 10,
        media: [],
      },
    ],
    completed: true,
  },
  {
    id: uuidv4(),
    title: "Rock Climbing",
    date: new Date('2024-07-04'),
    category: "Other",
    exercises: [
      {
        id: uuidv4(),
        name: "Top Rope Climb",
        type: "Climbing",
        sets: [
          { 
            id: uuidv4(), 
            metrics: [
              { id: uuidv4(), type: "duration", value: 60, unit: "min" }
            ] 
          }
        ],
        notes: "Focus on technique",
        duration: 60,
        media: [],
      },
    ],
    completed: true,
  },
  {
    id: uuidv4(),
    title: "Cycling",
    date: new Date('2024-07-03'),
    category: "Cardio",
    exercises: [
      {
        id: uuidv4(),
        name: "Outdoor Ride",
        type: "Cycling",
        sets: [
          { 
            id: uuidv4(), 
            metrics: [
              { id: uuidv4(), type: "distance", value: 15, unit: "km" },
              { id: uuidv4(), type: "duration", value: 60, unit: "min" }
            ] 
          }
        ],
        notes: "Enjoy the scenery",
        duration: 60,
        media: [],
      },
    ],
    completed: true,
  },
  {
    id: uuidv4(),
    title: "Pilates",
    date: new Date('2024-07-02'),
    category: "Core",
    exercises: [
      {
        id: uuidv4(),
        name: "The Hundred",
        type: "Abs",
        sets: [
          { 
            id: uuidv4(), 
            metrics: [
              { id: uuidv4(), type: "repetitions", value: 100, unit: "reps" }
            ] 
          }
        ],
        notes: "Engage core",
        duration: 15,
        media: [],
      },
    ],
    completed: true,
  },
  {
    id: uuidv4(),
    title: "Strength and Conditioning",
    date: new Date('2024-07-01'),
    category: "Strength Training",
    exercises: [
      {
        id: uuidv4(),
        name: "Deadlifts",
        type: "Back",
        sets: [
          { 
            id: uuidv4(), 
            metrics: [
              { id: uuidv4(), type: "weight", value: 100, unit: "kg" },
              { id: uuidv4(), type: "repetitions", value: 5, unit: "reps" }
            ] 
          },
          { 
            id: uuidv4(), 
            metrics: [
              { id: uuidv4(), type: "weight", value: 110, unit: "kg" },
              { id: uuidv4(), type: "repetitions", value: 5, unit: "reps" }
            ] 
          },
          { 
            id: uuidv4(), 
            metrics: [
              { id: uuidv4(), type: "weight", value: 120, unit: "kg" },
              { id: uuidv4(), type: "repetitions", value: 5, unit: "reps" }
            ] 
          },
        ],
        notes: "Maintain form",
        duration: 30,
        media: [],
      },
    ],
    completed: true,
  },
];

let savedExercises: Exercise[] = [
  {
    id: uuidv4(),
    name: "Push-ups",
    type: "Chest",
    duration: 0,
    media: [],
  },
  {
    id: uuidv4(),
    name: "Squats",
    type: "Legs",
    duration: 0,
    media: [],
  },
  {
    id: uuidv4(),
    name: "Plank",
    type: "Core",
    duration: 0,
    media: [],
  },
  {
    id: uuidv4(),
    name: "Bicep Curls",
    type: "Arms",
    duration: 0,
    media: [],
  },
  {
    id: uuidv4(),
    name: "Bench Press",
    type: "Chest",
    duration: 0,
    media: [],
  },
  {
    id: uuidv4(),
    name: "Deadlifts",
    type: "Back",
    duration: 0,
    media: [],
  },
  {
    id: uuidv4(),
    name: "Lunges",
    type: "Legs",
    duration: 0,
    media: [],
  },
  {
    id: uuidv4(),
    name: "Crunches",
    type: "Core",
    duration: 0,
    media: [],
  },
  {
    id: uuidv4(),
    name: "Pull-ups",
    type: "Back",
    duration: 0,
    media: [],
  },
  {
    id: uuidv4(),
    name: "Overhead Press",
    type: "Shoulders",
    duration: 0,
    media: [],
  },
];

const mockCategories: CategoryInfo[] = [
  { name: "Strength Training", color: "#FF5733", icon: "Dumbbell" },
  { name: "Cardio", color: "#3498DB", icon: "Activity" },
  { name: "Yoga", color: "#2ECC71", icon: "Yoga" },
  { name: "Core", color: "#F1C40F", icon: "Tornado" },
  { name: "Other", color: "#9B59B6", icon: "HelpCircle" },
];

// Function to get workouts by date
export const getWorkoutsByDate = (date: Date): Workout[] => {
  return mockWorkouts.filter((workout) => {
    return (
      workout.date.getFullYear() === date.getFullYear() &&
      workout.date.getMonth() === date.getMonth() &&
      workout.date.getDate() === date.getDate()
    );
  });
};

// Function to get all categories
export const getAllCategories = (): string[] => {
  return mockCategories.map((category) => category.name);
};

// Function to get category info
export const getCategoryInfo = (categoryName: string): CategoryInfo => {
  const category = mockCategories.find((cat) => cat.name === categoryName);
  return category || { name: "Other", color: "#9B59B6", icon: "HelpCircle" };
};

// Function to create a new category
export const createCategory = (categoryInfo: Omit<CategoryInfo, 'name'> & { name: string }): void => {
  // Check if category with this name already exists
  const existingIndex = mockCategories.findIndex(cat => cat.name === categoryInfo.name);
  
  if (existingIndex === -1) {
    // Add new category if it doesn't exist
    mockCategories.push({
      name: categoryInfo.name,
      color: categoryInfo.color,
      icon: categoryInfo.icon
    });
  }
};

// Function to update an existing category
export const updateCategory = (oldName: string, categoryInfo: Omit<CategoryInfo, 'name'> & { name: string }): void => {
  // Find the category index
  const categoryIndex = mockCategories.findIndex(cat => cat.name === oldName);
  
  if (categoryIndex !== -1) {
    // Update the category
    mockCategories[categoryIndex] = {
      name: categoryInfo.name,
      color: categoryInfo.color,
      icon: categoryInfo.icon
    };
    
    // Update all workouts that use this category
    if (oldName !== categoryInfo.name) {
      mockWorkouts.forEach(workout => {
        if (workout.category === oldName) {
          workout.category = categoryInfo.name;
        }
      });
    }
  }
};

// Function to create a new workout
export const createWorkout = (workout: Partial<Workout>): Workout => {
  const newWorkout: Workout = {
    id: uuidv4(),
    title: workout.title || "Workout",
    date: workout.date || new Date(),
    category: workout.category || "Other",
    exercises: workout.exercises || [],
    completed: workout.completed || false,
  };
  mockWorkouts.push(newWorkout);
  return newWorkout;
};

// Function to get exercise types
export const getExerciseTypes = (): string[] => {
  const types = savedExercises.map(exercise => exercise.type);
  return [...new Set(types)]; // Remove duplicates
};

// Function to get saved exercises
export const getSavedExercises = (): Exercise[] => {
  return savedExercises;
};

// Function to save an exercise
export const saveExercise = (exercise: Exercise): void => {
  const existingIndex = savedExercises.findIndex(ex => ex.id === exercise.id);
  
  if (existingIndex > -1) {
    // Replace existing exercise
    savedExercises[existingIndex] = exercise;
  } else {
    // Add new exercise
    savedExercises.push(exercise);
  }
};

// Generate date range for the calendar
const getDaysInMonth = (month: number, year: number) => {
  return new Date(year, month, 0).getDate();
};

const today = new Date();
const currentYear = today.getFullYear();
const currentMonth = today.getMonth();
const currentDay = today.getDate();

export const dateRange: {
  date: Date;
  dayNumber: number;
  dayName: string;
  isToday: boolean;
}[] = [];

for (let i = -30; i <= 30; i++) {
  const date = new Date(currentYear, currentMonth, currentDay + i);
  const dayNumber = date.getDate();
  const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
  const isToday = i === 0;

  dateRange.push({
    date,
    dayNumber,
    dayName,
    isToday,
  });
}

// Add these new functions to retrieve yesterday's and past week's workouts
export const getWorkoutsForYesterday = (): Workout[] => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  
  // Set to beginning of the day
  yesterday.setHours(0, 0, 0, 0);
  
  return mockWorkouts.filter(workout => {
    const workoutDate = new Date(workout.date);
    return (
      workoutDate.getFullYear() === yesterday.getFullYear() &&
      workoutDate.getMonth() === yesterday.getMonth() &&
      workoutDate.getDate() === yesterday.getDate()
    );
  });
};

export const getWorkoutsForPastWeek = (): Workout[] => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const twoDaysAgo = new Date(today);
  twoDaysAgo.setDate(today.getDate() - 2);
  
  const sixDaysAgo = new Date(today);
  sixDaysAgo.setDate(today.getDate() - 6);
  
  return mockWorkouts.filter(workout => {
    const workoutDate = new Date(workout.date);
    workoutDate.setHours(0, 0, 0, 0);
    
    // Between 2 and 6 days ago
    return workoutDate >= sixDaysAgo && workoutDate <= twoDaysAgo;
  });
};
