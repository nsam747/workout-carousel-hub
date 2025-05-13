// Mock Data Types
export interface ExerciseType {
  id: string;
  name: string;
  category: string;
  targetMuscles: string[];
  description?: string;
}

export interface Metric {
  type: string;
  value: number;
  unit: string;
}

export interface ExerciseMetric {
  type: string;
  value: number;
  unit: string;
}

export interface ExerciseSet {
  id: string;
  metrics: ExerciseMetric[];
}

export interface SelectedMetric {
  type: string;
  unit: string;
}

export interface Exercise {
  id: string;
  name: string;
  type?: string;
  sets?: ExerciseSet[];
  notes?: string;
  media?: string[];
  selectedMetrics?: SelectedMetric[];
}

export interface Workout {
  id: string;
  title: string;
  date: string;
  category: string;
  exercises: Exercise[];
  notes?: string;
  completed: boolean;
}

export type WorkoutCategory = string;

export interface PerformanceLevel {
  id: string;
  name: string;
  description: string;
}

export interface CategoryInfo {
  color: string;
  icon: string;
}

// Define the supported metrics for exercises
export const supportedMetrics = [
  {
    type: 'weight',
    defaultUnit: 'kg',
    availableUnits: ['kg', 'lbs']
  },
  {
    type: 'distance',
    defaultUnit: 'km',
    availableUnits: ['km', 'miles', 'm']
  },
  {
    type: 'duration',
    defaultUnit: 'min',
    availableUnits: ['sec', 'min', 'hour']
  },
  {
    type: 'repetitions',
    defaultUnit: 'reps',
    availableUnits: ['reps']
  },
  {
    type: 'restTime',
    defaultUnit: 'sec',
    availableUnits: ['sec', 'min']
  }
];

// Mock data for saved exercises
const savedExercises: Exercise[] = [
  {
    id: "saved-ex-1",
    name: "Bench Press",
    type: "Strength",
    selectedMetrics: [
      { type: "weight", unit: "kg" },
      { type: "repetitions", unit: "reps" }
    ]
  },
  {
    id: "saved-ex-2",
    name: "Squat",
    type: "Strength",
    selectedMetrics: [
      { type: "weight", unit: "kg" },
      { type: "repetitions", unit: "reps" }
    ]
  },
  {
    id: "saved-ex-3",
    name: "Deadlift",
    type: "Strength",
    selectedMetrics: [
      { type: "weight", unit: "kg" },
      { type: "repetitions", unit: "reps" }
    ]
  },
  {
    id: "saved-ex-4",
    name: "Running",
    type: "Cardio",
    selectedMetrics: [
      { type: "distance", unit: "km" },
      { type: "duration", unit: "min" }
    ]
  },
  {
    id: "saved-ex-5",
    name: "Plank",
    type: "Core",
    selectedMetrics: [
      { type: "duration", unit: "sec" }
    ]
  }
];

// Mock data
export const mockExerciseTypes: ExerciseType[] = [
  {
    id: "1",
    name: "Bench Press",
    category: "Strength",
    targetMuscles: ["Chest", "Triceps", "Shoulders"],
    description: "A compound exercise that primarily targets the chest muscles."
  },
  {
    id: "2",
    name: "Squat",
    category: "Strength",
    targetMuscles: ["Quadriceps", "Hamstrings", "Glutes"],
    description: "A compound lower body exercise that targets multiple muscle groups."
  },
  {
    id: "3",
    name: "Deadlift",
    category: "Strength",
    targetMuscles: ["Back", "Hamstrings", "Glutes"],
    description: "A compound exercise that targets the posterior chain muscles."
  },
  {
    id: "4",
    name: "Pull-up",
    category: "Strength",
    targetMuscles: ["Back", "Biceps", "Shoulders"],
    description: "An upper body compound exercise that targets the back and arms."
  },
  {
    id: "5",
    name: "Running",
    category: "Cardio",
    targetMuscles: ["Legs", "Heart"],
    description: "A cardiovascular exercise that improves endurance and heart health."
  },
  {
    id: "6",
    name: "Cycling",
    category: "Cardio",
    targetMuscles: ["Legs", "Heart"],
    description: "A low-impact cardiovascular exercise."
  },
  {
    id: "7",
    name: "Plank",
    category: "Strength",
    targetMuscles: ["Core", "Shoulders"],
    description: "An isometric core strength exercise."
  },
  {
    id: "8",
    name: "Yoga",
    category: "Flexibility",
    targetMuscles: ["Full Body"],
    description: "A practice that combines physical postures, breathing techniques, and meditation."
  },
  {
    id: "9",
    name: "Swimming",
    category: "Cardio",
    targetMuscles: ["Full Body"],
    description: "A full-body cardiovascular exercise with low impact on joints."
  },
  {
    id: "10",
    name: "Shoulder Press",
    category: "Strength",
    targetMuscles: ["Shoulders", "Triceps"],
    description: "An upper body strength exercise targeting the shoulder muscles."
  },
  {
    id: "11",
    name: "Lat Pulldown",
    category: "Strength",
    targetMuscles: ["Back", "Biceps"],
    description: "A machine exercise that targets the latissimus dorsi muscles."
  },
  {
    id: "12",
    name: "Leg Press",
    category: "Strength",
    targetMuscles: ["Quadriceps", "Hamstrings", "Glutes"],
    description: "A machine-based lower body exercise."
  }
];

export const mockCategories: WorkoutCategory[] = [
  "Strength",
  "Cardio",
  "Flexibility",
  "Balance",
  "Sports",
  "Recovery",
  "HIIT"
];

export const mockPerformanceLevels: PerformanceLevel[] = [
  { id: "1", name: "Beginner", description: "Just starting out" },
  { id: "2", name: "Intermediate", description: "Some experience" },
  { id: "3", name: "Advanced", description: "Significant experience" },
  { id: "4", name: "Expert", description: "Years of dedicated training" }
];

export const mockWorkouts: Workout[] = [
  {
    id: "w1",
    title: "Morning Strength Session",
    date: new Date(new Date().setHours(8, 30, 0, 0)).toISOString(),
    category: "Strength",
    completed: true,
    exercises: [
      {
        id: "e1",
        name: "Bench Press",
        sets: [
          {
            id: "s1",
            metrics: [
              { type: "weight", value: 135, unit: "lbs" },
              { type: "repetitions", value: 10, unit: "" }
            ]
          },
          {
            id: "s2",
            metrics: [
              { type: "weight", value: 155, unit: "lbs" },
              { type: "repetitions", value: 8, unit: "" }
            ]
          },
          {
            id: "s3",
            metrics: [
              { type: "weight", value: 175, unit: "lbs" },
              { type: "repetitions", value: 6, unit: "" }
            ]
          }
        ],
        notes: "Felt strong today, might increase weight next session."
      },
      {
        id: "e2",
        name: "Incline Dumbbell Press",
        sets: [
          {
            id: "s4",
            metrics: [
              { type: "weight", value: 50, unit: "lbs" },
              { type: "repetitions", value: 12, unit: "" }
            ]
          },
          {
            id: "s5",
            metrics: [
              { type: "weight", value: 55, unit: "lbs" },
              { type: "repetitions", value: 10, unit: "" }
            ]
          }
        ],
        notes: "Focused on mind-muscle connection"
      }
    ]
  },
  {
    id: "w2",
    title: "Evening Cardio",
    date: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(),
    category: "Cardio",
    completed: true,
    exercises: [
      {
        id: "e3",
        name: "Running",
        sets: [
          {
            id: "s6",
            metrics: [
              { type: "distance", value: 5, unit: "km" },
              { type: "duration", value: 28, unit: "min" }
            ]
          }
        ],
        notes: "Felt great, maintained steady pace throughout."
      }
    ]
  },
  {
    id: "w3",
    title: "Full Body Workout",
    date: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(),
    category: "Strength",
    completed: true,
    exercises: [
      {
        id: "e4",
        name: "Squat",
        sets: [
          {
            id: "s7",
            metrics: [
              { type: "weight", value: 185, unit: "lbs" },
              { type: "repetitions", value: 10, unit: "" }
            ]
          },
          {
            id: "s8",
            metrics: [
              { type: "weight", value: 205, unit: "lbs" },
              { type: "repetitions", value: 8, unit: "" }
            ]
          },
          {
            id: "s9",
            metrics: [
              { type: "weight", value: 225, unit: "lbs" },
              { type: "repetitions", value: 6, unit: "" }
            ]
          }
        ]
      },
      {
        id: "e5",
        name: "Deadlift",
        sets: [
          {
            id: "s10",
            metrics: [
              { type: "weight", value: 225, unit: "lbs" },
              { type: "repetitions", value: 8, unit: "" }
            ]
          },
          {
            id: "s11",
            metrics: [
              { type: "weight", value: 245, unit: "lbs" },
              { type: "repetitions", value: 6, unit: "" }
            ]
          }
        ],
        notes: "Focused on form, kept back straight."
      },
      {
        id: "e6",
        name: "Pull-up",
        sets: [
          {
            id: "s12",
            metrics: [
              { type: "repetitions", value: 10, unit: "" }
            ]
          },
          {
            id: "s13",
            metrics: [
              { type: "repetitions", value: 8, unit: "" }
            ]
          },
          {
            id: "s14",
            metrics: [
              { type: "repetitions", value: 6, unit: "" }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "w4",
    title: "Active Recovery",
    date: new Date(new Date().setDate(new Date().getDate() - 3)).toISOString(),
    category: "Recovery",
    completed: true,
    exercises: [
      {
        id: "e7",
        name: "Yoga",
        sets: [
          {
            id: "s15",
            metrics: [
              { type: "duration", value: 45, unit: "min" }
            ]
          }
        ],
        notes: "Focused on stretching tight hamstrings and lower back."
      }
    ]
  },
  {
    id: "w5",
    title: "HIIT Session",
    date: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(),
    category: "HIIT",
    completed: false,
    exercises: [
      {
        id: "e8",
        name: "Burpees",
        sets: [
          {
            id: "s16",
            metrics: [
              { type: "repetitions", value: 15, unit: "" },
              { type: "restTime", value: 30, unit: "sec" }
            ]
          },
          {
            id: "s17",
            metrics: [
              { type: "repetitions", value: 15, unit: "" },
              { type: "restTime", value: 30, unit: "sec" }
            ]
          },
          {
            id: "s18",
            metrics: [
              { type: "repetitions", value: 15, unit: "" },
              { type: "restTime", value: 30, unit: "sec" }
            ]
          },
          {
            id: "s19",
            metrics: [
              { type: "repetitions", value: 15, unit: "" },
              { type: "restTime", value: 30, unit: "sec" }
            ]
          }
        ]
      },
      {
        id: "e9",
        name: "Mountain Climbers",
        sets: [
          {
            id: "s20",
            metrics: [
              { type: "duration", value: 30, unit: "sec" },
              { type: "restTime", value: 15, unit: "sec" }
            ]
          },
          {
            id: "s21",
            metrics: [
              { type: "duration", value: 30, unit: "sec" },
              { type: "restTime", value: 15, unit: "sec" }
            ]
          },
          {
            id: "s22",
            metrics: [
              { type: "duration", value: 30, unit: "sec" },
              { type: "restTime", value: 15, unit: "sec" }
            ]
          },
          {
            id: "s23",
            metrics: [
              { type: "duration", value: 30, unit: "sec" },
              { type: "restTime", value: 15, unit: "sec" }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "w6",
    title: "Afternoon Flexibility",
    date: new Date(new Date().setDate(new Date().getDate() - 4)).toISOString(),
    category: "Flexibility",
    completed: true,
    exercises: [
      {
        id: "e10",
        name: "Static Stretching",
        sets: [
          {
            id: "s24",
            metrics: [
              { type: "duration", value: 30, unit: "min" }
            ]
          }
        ],
        notes: "Focused on full-body flexibility."
      }
    ]
  },
  {
    id: "w7",
    title: "Morning Core Workout",
    date: new Date().toISOString(), // Today
    category: "Strength",
    completed: true,
    exercises: [
      {
        id: "e11",
        name: "Plank",
        sets: [
          {
            id: "s25",
            metrics: [
              { type: "duration", value: 60, unit: "sec" },
              { type: "restTime", value: 30, unit: "sec" }
            ]
          },
          {
            id: "s26",
            metrics: [
              { type: "duration", value: 45, unit: "sec" },
              { type: "restTime", value: 30, unit: "sec" }
            ]
          },
          {
            id: "s27",
            metrics: [
              { type: "duration", value: 30, unit: "sec" }
            ]
          }
        ]
      },
      {
        id: "e12",
        name: "Russian Twists",
        sets: [
          {
            id: "s28",
            metrics: [
              { type: "repetitions", value: 20, unit: "" }
            ]
          },
          {
            id: "s29",
            metrics: [
              { type: "repetitions", value: 20, unit: "" }
            ]
          },
          {
            id: "s30",
            metrics: [
              { type: "repetitions", value: 20, unit: "" }
            ]
          }
        ]
      },
      {
        id: "e13",
        name: "Leg Raises",
        sets: [
          {
            id: "s31",
            metrics: [
              { type: "repetitions", value: 15, unit: "" }
            ]
          },
          {
            id: "s32",
            metrics: [
              { type: "repetitions", value: 15, unit: "" }
            ]
          },
          {
            id: "s33",
            metrics: [
              { type: "repetitions", value: 15, unit: "" }
            ]
          }
        ],
        notes: "Feeling stronger in the core!"
      }
    ]
  },
  {
    id: "w8",
    title: "Midday Cardio Session",
    date: new Date().toISOString(), // Today
    category: "Cardio",
    completed: false,
    exercises: [
      {
        id: "e14",
        name: "Cycling",
        sets: [
          {
            id: "s34",
            metrics: [
              { type: "distance", value: 15, unit: "km" },
              { type: "duration", value: 45, unit: "min" }
            ]
          }
        ],
        notes: "Great ride with moderate resistance."
      }
    ]
  },
  {
    id: "w9",
    title: "Evening Yoga Flow",
    date: new Date().toISOString(), // Today
    category: "Flexibility",
    completed: false,
    exercises: [
      {
        id: "e15",
        name: "Vinyasa Flow",
        sets: [
          {
            id: "s35",
            metrics: [
              { type: "duration", value: 60, unit: "min" }
            ]
          }
        ],
        notes: "Focus on mindful movement and breath control."
      }
    ]
  },
  // Additional workouts for different days
  {
    id: "w10",
    title: "Back & Biceps",
    date: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString(),
    category: "Strength",
    completed: false,
    exercises: [
      {
        id: "e16",
        name: "Lat Pulldown",
        sets: [
          {
            id: "s36",
            metrics: [
              { type: "weight", value: 120, unit: "lbs" },
              { type: "repetitions", value: 12, unit: "" }
            ]
          },
          {
            id: "s37",
            metrics: [
              { type: "weight", value: 130, unit: "lbs" },
              { type: "repetitions", value: 10, unit: "" }
            ]
          },
          {
            id: "s38",
            metrics: [
              { type: "weight", value: 140, unit: "lbs" },
              { type: "repetitions", value: 8, unit: "" }
            ]
          }
        ]
      },
      {
        id: "e17",
        name: "Barbell Curl",
        sets: [
          {
            id: "s39",
            metrics: [
              { type: "weight", value: 60, unit: "lbs" },
              { type: "repetitions", value: 12, unit: "" }
            ]
          },
          {
            id: "s40",
            metrics: [
              { type: "weight", value: 70, unit: "lbs" },
              { type: "repetitions", value: 10, unit: "" }
            ]
          },
          {
            id: "s41",
            metrics: [
              { type: "weight", value: 70, unit: "lbs" },
              { type: "repetitions", value: 8, unit: "" }
            ]
          }
        ]
      }
    ]
  }
];

// Export date range for week calendar
export const dateRange = (() => {
  const today = new Date();
  const result = [];
  
  // Add dates before today (past 14 days)
  for (let i = 14; i >= 1; i--) {
    const date = new Date();
    date.setDate(today.getDate() - i);
    
    result.push({
      date: new Date(date),
      dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
      dayNumber: date.getDate(),
      isToday: false
    });
  }
  
  // Add today
  result.push({
    date: new Date(today),
    dayName: today.toLocaleDateString('en-US', { weekday: 'short' }),
    dayNumber: today.getDate(),
    isToday: true
  });
  
  // Add dates after today (next 14 days)
  for (let i = 1; i <= 14; i++) {
    const date = new Date();
    date.setDate(today.getDate() + i);
    
    result.push({
      date: new Date(date),
      dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
      dayNumber: date.getDate(),
      isToday: false
    });
  }
  
  return result;
})();

// Helper functions - These will be converted to hooks
export const getExerciseTypes = () => mockExerciseTypes.map(type => type.name);

export const getAllCategories = () => mockCategories;

export const getPerformanceLevels = () => mockPerformanceLevels;

export const getWorkoutById = (id: string) => {
  return mockWorkouts.find(workout => workout.id === id);
};

export const getWorkoutsByDate = (date: Date) => {
  const targetDate = new Date(date);
  return mockWorkouts.filter(workout => {
    const workoutDate = new Date(workout.date);
    return (
      workoutDate.getFullYear() === targetDate.getFullYear() &&
      workoutDate.getMonth() === targetDate.getMonth() &&
      workoutDate.getDate() === targetDate.getDate()
    );
  });
};

export const getWorkoutsForYesterday = () => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return getWorkoutsByDate(yesterday);
};

export const getWorkoutsForPastWeek = () => {
  const today = new Date();
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(today.getDate() - 7);
  
  return mockWorkouts.filter(workout => {
    const workoutDate = new Date(workout.date);
    return workoutDate >= oneWeekAgo && workoutDate < today;
  });
};

export const getAllWorkouts = () => mockWorkouts;

export const deleteWorkout = (id: string) => {
  const index = mockWorkouts.findIndex(workout => workout.id === id);
  if (index !== -1) {
    mockWorkouts.splice(index, 1);
  }
  return mockWorkouts;
};

export const getCategoryInfo = (category: string): CategoryInfo => {
  const colors: Record<string, string> = {
    'Strength': '#EF4444', // Red
    'Cardio': '#3B82F6', // Blue
    'Flexibility': '#10B981', // Green
    'Balance': '#8B5CF6', // Purple
    'Sports': '#F59E0B', // Amber
    'Recovery': '#6366F1', // Indigo
    'HIIT': '#EC4899', // Pink
  };
  
  const icons: Record<string, string> = {
    'Strength': 'dumbbell',
    'Cardio': 'heart',
    'Flexibility': 'stretch',
    'Balance': 'activity',
    'Sports': 'trophy',
    'Recovery': 'bed',
    'HIIT': 'zap',
  };
  
  const color = colors[category] || '#808080'; // Default gray if not found
  const icon = icons[category] || 'activity'; // Default icon if not found
  
  return { color, icon };
};

// Functions for handling saved exercises
export const getSavedExercises = () => {
  return savedExercises;
};

export const saveExercise = (exercise: Exercise) => {
  // Check if this is an update or new exercise
  const existingIndex = savedExercises.findIndex(ex => ex.id === exercise.id);
  
  if (existingIndex !== -1) {
    // Update existing
    savedExercises[existingIndex] = exercise;
  } else {
    // Add new
    savedExercises.push(exercise);
  }
  
  return savedExercises;
};

// Category creation and update
export const createCategory = (categoryInfo: { name: string, color: string, icon: string | null }) => {
  if (!mockCategories.includes(categoryInfo.name)) {
    mockCategories.push(categoryInfo.name);
  }
  return mockCategories;
};

export const updateCategory = (oldName: string, newInfo: { name: string, color: string, icon: string | null }) => {
  const index = mockCategories.indexOf(oldName);
  if (index !== -1) {
    mockCategories[index] = newInfo.name;
  }
  return mockCategories;
};
