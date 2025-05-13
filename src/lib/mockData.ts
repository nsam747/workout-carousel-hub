
import { v4 as uuidv4 } from 'uuid';
import { addDays, subDays, format, isSameDay } from 'date-fns';

export interface Workout {
  id: string;
  title: string;
  category: string;
  date: string;
  completed: boolean;
  exercises: Exercise[];
}

export interface Exercise {
  id: string;
  name: string;
  type: string;
  sets: Set[];
  notes?: string;
  media?: string[];
  selectedMetrics?: SelectedMetric[];
}

export interface Set {
  id: string;
  setNumber: number;
  reps?: number;
  weight?: number;
  distance?: number;
  duration?: number;
  restTime?: number;
  metrics: Metric[];
}

export interface Metric {
  id: string;
  type: string;
  value: number;
  unit: string;
}

export interface SelectedMetric {
  type: string;
  unit: string;
}

export interface CategoryInfo {
  name: string;
  color: string;
  icon: string | null;
}

export const categoryInfo: CategoryInfo[] = [
  { name: "Strength", color: "#f43f5e", icon: "Dumbbell" },
  { name: "Cardio", color: "#14b8a6", icon: "Activity" },
  { name: "Flexibility", color: "#3b82f6", icon: "StretchHorizontal" },
  { name: "Balance", color: "#8b5cf6", icon: " accessibility" },
  { name: "Core", color: "#f59e0b", icon: "Pilcrow" },
  { name: "HIIT", color: "#7dd3fc", icon: "lightning" },
  { name: "Recovery", color: "#a8a29e", icon: "heart" },
  { name: "Other", color: "#a8a29e", icon: null },
];

export const getCategoryInfo = (categoryName: string): CategoryInfo => {
  const category = categoryInfo.find((cat) => cat.name === categoryName);
  return category || { name: "Other", color: "#a8a29e", icon: null };
};

export const mockWorkouts: Workout[] = [
  {
    id: "workout-1",
    title: "Morning Strength",
    category: "Strength",
    date: "2023-05-13T08:00:00Z",
    completed: true,
    exercises: [
      {
        id: "ex-1-1",
        name: "Bench Press",
        type: "Strength",
        sets: [
          {
            id: "set-1-1-1",
            setNumber: 1,
            metrics: [
              { id: "m-1-1-1-1", type: "weight", value: 135, unit: "lbs" },
              { id: "m-1-1-1-2", type: "repetitions", value: 10, unit: "reps" }
            ]
          },
          {
            id: "set-1-1-2",
            setNumber: 2,
            metrics: [
              { id: "m-1-1-2-1", type: "weight", value: 155, unit: "lbs" },
              { id: "m-1-1-2-2", type: "repetitions", value: 8, unit: "reps" }
            ]
          },
          {
            id: "set-1-1-3",
            setNumber: 3,
            metrics: [
              { id: "m-1-1-3-1", type: "weight", value: 175, unit: "lbs" },
              { id: "m-1-1-3-2", type: "repetitions", value: 6, unit: "reps" }
            ]
          }
        ],
        notes: "This exercise was particularly challenging today. I managed to increase the weight on every set while maintaining good form. Next time I will aim for even higher weights since I've been making consistent progress over the past few weeks. Remember to focus on slow, controlled movements and proper breathing throughout each repetition.",
        media: []
      },
      {
        id: "ex-1-2",
        name: "Pull-ups",
        type: "Strength",
        sets: [
          {
            id: "set-1-2-1",
            setNumber: 1,
            metrics: [
              { id: "m-1-2-1-1", type: "repetitions", value: 12, unit: "reps" }
            ]
          },
          {
            id: "set-1-2-2",
            setNumber: 2,
            metrics: [
              { id: "m-1-2-2-1", type: "repetitions", value: 10, unit: "reps" }
            ]
          },
          {
            id: "set-1-2-3",
            setNumber: 3,
            metrics: [
              { id: "m-1-2-3-1", type: "repetitions", value: 8, unit: "reps" }
            ]
          }
        ],
        notes: "",
        media: []
      },
      {
        id: "ex-1-3",
        name: "Squats",
        type: "Strength",
        sets: [
          {
            id: "set-1-3-1",
            setNumber: 1,
            metrics: [
              { id: "m-1-3-1-1", type: "weight", value: 185, unit: "lbs" },
              { id: "m-1-3-1-2", type: "repetitions", value: 8, unit: "reps" }
            ]
          },
          {
            id: "set-1-3-2",
            setNumber: 2,
            metrics: [
              { id: "m-1-3-2-1", type: "weight", value: 205, unit: "lbs" },
              { id: "m-1-3-2-2", type: "repetitions", value: 6, unit: "reps" }
            ]
          },
          {
            id: "set-1-3-3",
            setNumber: 3,
            metrics: [
              { id: "m-1-3-3-1", type: "weight", value: 225, unit: "lbs" },
              { id: "m-1-3-3-2", type: "repetitions", value: 4, unit: "reps" }
            ]
          }
        ],
        notes: "Keep knees tracking over toes, not inward. Remember to breathe!",
        media: []
      }
    ]
  },
  {
    id: "workout-2",
    title: "Cardio & Core",
    category: "Cardio",
    date: "2023-05-12T17:30:00Z",
    completed: true,
    exercises: [
      {
        id: "ex-2-1",
        name: "Treadmill",
        type: "Cardio",
        sets: [
          {
            id: "set-2-1-1",
            setNumber: 1,
            metrics: [
              { id: "m-2-1-1-1", type: "duration", value: 30, unit: "min" },
              { id: "m-2-1-1-2", type: "distance", value: 3.5, unit: "miles" }
            ]
          }
        ],
        notes: "",
        media: []
      },
      {
        id: "ex-2-2",
        name: "Ab Circuit",
        type: "Core",
        sets: [
          {
            id: "set-2-2-1",
            setNumber: 1,
            metrics: [
              { id: "m-2-2-1-1", type: "duration", value: 15, unit: "min" }
            ]
          }
        ],
        notes: "Circuit included: Russian twists, bicycle crunches, planks, and leg raises. Focus on form especially during Russian twists - keep back straight and twist from core not shoulders. The planks were particularly difficult today so I'll need to work on core endurance more consistently. Next time try to increase plank duration by 10 seconds per set.",
        media: []
      }
    ]
  },
  {
    id: "workout-3",
    title: "Evening Yoga",
    category: "Flexibility",
    date: "2023-05-11T19:00:00Z",
    completed: true,
    exercises: [
      {
        id: "ex-3-1",
        name: "Downward Dog",
        type: "Flexibility",
        sets: [
          {
            id: "set-3-1-1",
            setNumber: 1,
            metrics: [
              { id: "m-3-1-1-1", type: "duration", value: 60, unit: "sec" }
            ]
          }
        ],
        notes: "Focus on lengthening the spine and pushing through the heels.",
        media: []
      },
      {
        id: "ex-3-2",
        name: "Cobra Pose",
        type: "Flexibility",
        sets: [
          {
            id: "set-3-2-1",
            setNumber: 1,
            metrics: [
              { id: "m-3-2-1-1", type: "duration", value: 30, unit: "sec" }
            ]
          }
        ],
        notes: "Engage the back muscles and keep the shoulders down.",
        media: []
      }
    ]
  },
  {
    id: "workout-4",
    title: "HIIT Blast",
    category: "HIIT",
    date: "2023-05-10T12:00:00Z",
    completed: false,
    exercises: [
      {
        id: "ex-4-1",
        name: "Burpees",
        type: "HIIT",
        sets: [
          {
            id: "set-4-1-1",
            setNumber: 1,
            metrics: [
              { id: "m-4-1-1-1", type: "repetitions", value: 15, unit: "reps" }
            ]
          },
          {
            id: "set-4-1-2",
            setNumber: 2,
            metrics: [
              { id: "m-4-1-2-1", type: "repetitions", value: 15, unit: "reps" }
            ]
          },
          {
            id: "set-4-1-3",
            setNumber: 3,
            metrics: [
              { id: "m-4-1-3-1", type: "repetitions", value: 15, unit: "reps" }
            ]
          }
        ],
        notes: "Maintain a fast pace and focus on full body movement.",
        media: []
      },
      {
        id: "ex-4-2",
        name: "Mountain Climbers",
        type: "HIIT",
        sets: [
          {
            id: "set-4-2-1",
            setNumber: 1,
            metrics: [
              { id: "m-4-2-1-1", type: "duration", value: 30, unit: "sec" }
            ]
          },
          {
            id: "set-4-2-2",
            setNumber: 2,
            metrics: [
              { id: "m-4-2-2-1", type: "duration", value: 30, unit: "sec" }
            ]
          },
          {
            id: "set-4-2-3",
            setNumber: 3,
            metrics: [
              { id: "m-4-2-3-1", type: "duration", value: 30, unit: "sec" }
            ]
          }
        ],
        notes: "Keep your core engaged and bring your knees high.",
        media: []
      }
    ]
  },
  {
    id: "workout-5",
    title: "Restorative Balance",
    category: "Balance",
    date: "2023-05-09T16:00:00Z",
    completed: false,
    exercises: [
      {
        id: "ex-5-1",
        name: "Single Leg Stand",
        type: "Balance",
        sets: [
          {
            id: "set-5-1-1",
            setNumber: 1,
            metrics: [
              { id: "m-5-1-1-1", type: "duration", value: 45, unit: "sec" }
            ]
          },
          {
            id: "set-5-1-2",
            setNumber: 2,
            metrics: [
              { id: "m-5-1-2-1", type: "duration", value: 45, unit: "sec" }
            ]
          },
          {
            id: "set-5-1-3",
            setNumber: 3,
            metrics: [
              { id: "m-5-1-3-1", type: "duration", value: 45, unit: "sec" }
            ]
          }
        ],
        notes: "Focus on a fixed point to improve stability.",
        media: []
      },
      {
        id: "ex-5-2",
        name: "Tree Pose",
        type: "Balance",
        sets: [
          {
            id: "set-5-2-1",
            setNumber: 1,
            metrics: [
              { id: "m-5-2-1-1", type: "duration", value: 60, unit: "sec" }
            ]
          },
          {
            id: "set-5-2-2",
            setNumber: 2,
            metrics: [
              { id: "m-5-2-2-1", type: "duration", value: 60, unit: "sec" }
            ]
          },
          {
            id: "set-5-2-3",
            setNumber: 3,
            metrics: [
              { id: "m-5-2-3-1", type: "duration", value: 60, unit: "sec" }
            ]
          }
        ],
        notes: "Keep your core tight and your gaze steady.",
        media: []
      }
    ]
  },
];

export const saveWorkout = (workout: Workout): void => {
  const index = mockWorkouts.findIndex((w) => w.id === workout.id);
  if (index !== -1) {
    mockWorkouts[index] = workout;
  } else {
    mockWorkouts.push(workout);
  }
};

export const deleteWorkout = (id: string): boolean => {
  const initialLength = mockWorkouts.length;
  const index = mockWorkouts.findIndex(workout => workout.id === id);
  
  if (index !== -1) {
    mockWorkouts.splice(index, 1);
    return mockWorkouts.length !== initialLength;
  }
  
  return false;
};

export const getWorkoutById = (id: string): Workout | undefined => {
  return mockWorkouts.find(workout => workout.id === id);
};

export const saveExercise = (exercise: Exercise): void => {
  mockWorkouts.forEach(workout => {
    const index = workout.exercises.findIndex(e => e.id === exercise.id);
    if (index !== -1) {
      workout.exercises[index] = exercise;
    }
  });
};

// For AddExerciseForm.tsx
const savedExercises: Exercise[] = [
  {
    id: "saved-ex-1",
    name: "Bench Press",
    type: "Strength",
    sets: [],
    notes: "",
    media: [],
    selectedMetrics: [
      { type: "weight", unit: "lbs" },
      { type: "repetitions", unit: "reps" }
    ]
  },
  {
    id: "saved-ex-2",
    name: "Squats",
    type: "Strength",
    sets: [],
    notes: "",
    media: [],
    selectedMetrics: [
      { type: "weight", unit: "lbs" },
      { type: "repetitions", unit: "reps" }
    ]
  },
  {
    id: "saved-ex-3",
    name: "Deadlift",
    type: "Strength",
    sets: [],
    notes: "",
    media: [],
    selectedMetrics: [
      { type: "weight", unit: "lbs" },
      { type: "repetitions", unit: "reps" }
    ]
  },
  {
    id: "saved-ex-4",
    name: "Treadmill",
    type: "Cardio",
    sets: [],
    notes: "",
    media: [],
    selectedMetrics: [
      { type: "duration", unit: "min" },
      { type: "distance", unit: "miles" }
    ]
  }
];

export const getSavedExercises = (): Exercise[] => {
  return [...savedExercises];
};

export const addWorkout = (workout: Workout): void => {
  mockWorkouts.push(workout);
};

export const addExercise = (workoutId: string, exercise: Exercise): void => {
  const workout = mockWorkouts.find(w => w.id === workoutId);
  if (workout) {
    workout.exercises.push(exercise);
  }
};

export const deleteExercise = (exerciseId: string): void => {
  mockWorkouts.forEach(workout => {
    workout.exercises = workout.exercises.filter(e => e.id !== exerciseId);
  });
};

// Exercise types for dropdown
export const getExerciseTypes = (): string[] => {
  return [
    "Strength",
    "Cardio",
    "Flexibility",
    "Balance",
    "Core",
    "HIIT",
    "Recovery",
    "Other"
  ];
};

// Date range for calendars
export const dateRange = (() => {
  const today = new Date();
  const range = [];
  
  // Generate dates for the past week and next 2 weeks
  for (let i = -7; i <= 14; i++) {
    const date = addDays(today, i);
    range.push({
      date,
      dayName: format(date, 'E'), // Short day name (e.g., Mon, Tue)
      dayNumber: format(date, 'd'), // Day number (e.g., 1, 2, 31)
      isToday: i === 0
    });
  }
  
  return range;
})();

// Get workouts by date
export const getWorkoutsByDate = (date: Date): Workout[] => {
  return mockWorkouts.filter(workout => {
    const workoutDate = new Date(workout.date);
    return isSameDay(workoutDate, date);
  });
};

// Get all workouts
export const getAllWorkouts = (): Workout[] => {
  return [...mockWorkouts];
};

// Get yesterday's workouts
export const getWorkoutsForYesterday = (): Workout[] => {
  const yesterday = subDays(new Date(), 1);
  return getWorkoutsByDate(yesterday);
};

// Get workouts from past week
export const getWorkoutsForPastWeek = (): Workout[] => {
  const today = new Date();
  const oneWeekAgo = subDays(today, 7);
  
  return mockWorkouts.filter(workout => {
    const workoutDate = new Date(workout.date);
    return workoutDate >= oneWeekAgo && workoutDate < today && !isSameDay(workoutDate, today) && !isSameDay(workoutDate, subDays(today, 1));
  });
};

// Get all categories
export const getAllCategories = (): string[] => {
  return categoryInfo.map(cat => cat.name);
};

// Create new category
export const createCategory = (category: CategoryInfo): void => {
  const existingIndex = categoryInfo.findIndex(cat => cat.name === category.name);
  if (existingIndex === -1) {
    categoryInfo.push(category);
  }
};

// Update existing category
export const updateCategory = (oldName: string, newCategory: CategoryInfo): void => {
  const index = categoryInfo.findIndex(cat => cat.name === oldName);
  if (index !== -1) {
    categoryInfo[index] = newCategory;
    
    // Update all workouts using this category
    mockWorkouts.forEach(workout => {
      if (workout.category === oldName) {
        workout.category = newCategory.name;
      }
    });
  }
};

// Supported metrics for exercise tracking
export const supportedMetrics = [
  {
    type: "repetitions",
    defaultUnit: "reps",
    availableUnits: ["reps"]
  },
  {
    type: "weight",
    defaultUnit: "lbs",
    availableUnits: ["lbs", "kg"]
  },
  {
    type: "duration",
    defaultUnit: "min",
    availableUnits: ["sec", "min", "hr"]
  },
  {
    type: "distance",
    defaultUnit: "miles",
    availableUnits: ["miles", "km", "meters"]
  },
  {
    type: "restTime",
    defaultUnit: "min",
    availableUnits: ["sec", "min"]
  }
];
