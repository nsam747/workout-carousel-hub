
import { v4 as uuidv4 } from 'uuid';
import { format, addDays, startOfDay } from 'date-fns';

export interface Exercise {
  id: string;
  name: string;
  type: string;
  sets: Set[];
  notes?: string;
  media?: string[];
  selectedMetrics?: SelectedMetric[];
  duration?: number; // Adding the missing duration property
}

export interface Set {
  id: string;
  setNumber: number;
  reps?: number;
  weight?: number;
  time?: number;
  distance?: number;
  speed?: number;
  resistance?: number;
  incline?: number;
  cadence?: number;
  heartRate?: number;
  calories?: number;
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

export interface Workout {
  id: string;
  title: string;
  category: string;
  exercises: Exercise[];
  date: string; // This needs to remain a string for DB compatibility
  completed?: boolean;
}

export interface CategoryInfo {
  name: string;
  color: string;
  icon: string | null;
}

// Define supported metrics
export const supportedMetrics = [
  {
    type: "repetitions",
    defaultUnit: "reps",
    availableUnits: ["reps"]
  },
  {
    type: "weight",
    defaultUnit: "kg",
    availableUnits: ["kg", "lbs"]
  },
  {
    type: "distance",
    defaultUnit: "km",
    availableUnits: ["km", "m", "mi"]
  },
  {
    type: "duration",
    defaultUnit: "minutes",
    availableUnits: ["seconds", "minutes", "hours"]
  },
  {
    type: "restTime",
    defaultUnit: "seconds",
    availableUnits: ["seconds", "minutes"]
  }
];

// Generate date range for calendar
const today = new Date();
export const dateRange = Array.from({ length: 31 }, (_, i) => {
  const date = addDays(startOfDay(today), i - 15);
  return {
    date,
    dayName: format(date, 'EEE'),
    dayNumber: format(date, 'd'),
    isToday: i === 15
  };
});

// Mock data for workouts
let workoutData: Workout[] = [
  {
    id: "1",
    title: "Full Body Strength",
    category: "Strength",
    date: "2024-07-15",
    exercises: [
      {
        id: "e1",
        name: "Squats",
        type: "Strength",
        sets: [
          { id: "s1", setNumber: 1, reps: 12, weight: 50, metrics: [{ id: "m1", type: "repetitions", value: 12, unit: "reps" }, { id: "m2", type: "weight", value: 50, unit: "kg" }] },
          { id: "s2", setNumber: 2, reps: 10, weight: 60, metrics: [{ id: "m3", type: "repetitions", value: 10, unit: "reps" }, { id: "m4", type: "weight", value: 60, unit: "kg" }] },
          { id: "s3", setNumber: 3, reps: 8, weight: 70, metrics: [{ id: "m5", type: "repetitions", value: 8, unit: "reps" }, { id: "m6", type: "weight", value: 70, unit: "kg" }] }
        ],
        notes: "Focus on form.",
        media: [],
        selectedMetrics: [{ type: "repetitions", unit: "reps" }, { type: "weight", unit: "kg" }]
      },
      {
        id: "e2",
        name: "Push-ups",
        type: "Strength",
        sets: [
          { id: "s4", setNumber: 1, reps: 15, metrics: [{ id: "m7", type: "repetitions", value: 15, unit: "reps" }] },
          { id: "s5", setNumber: 2, reps: 12, metrics: [{ id: "m8", type: "repetitions", value: 12, unit: "reps" }] },
          { id: "s6", setNumber: 3, reps: 10, metrics: [{ id: "m9", type: "repetitions", value: 10, unit: "reps" }] }
        ],
        notes: "Try different variations.",
        media: [],
        selectedMetrics: [{ type: "repetitions", unit: "reps" }]
      }
    ]
  },
  {
    id: "2",
    title: "Morning Cardio",
    category: "Cardio",
    date: "2024-07-15",
    exercises: [
      {
        id: "e3",
        name: "Running",
        type: "Cardio",
        sets: [
          { id: "s7", setNumber: 1, time: 30, distance: 5, metrics: [{ id: "m10", type: "time", value: 30, unit: "minutes" }, { id: "m11", type: "distance", value: 5, unit: "km" }] }
        ],
        notes: "Maintain a steady pace.",
        media: [],
        selectedMetrics: [{ type: "time", unit: "minutes" }, { type: "distance", unit: "km" }]
      },
      {
        id: "e4",
        name: "Cycling",
        type: "Cardio",
        sets: [
          { id: "s8", setNumber: 1, time: 45, distance: 15, metrics: [{ id: "m12", type: "time", value: 45, unit: "minutes" }, { id: "m13", type: "distance", value: 15, unit: "km" }] }
        ],
        notes: "Explore new routes.",
        media: [],
        selectedMetrics: [{ type: "time", unit: "minutes" }, { type: "distance", unit: "km" }]
      }
    ]
  },
  {
    id: "3",
    title: "Yoga Session",
    category: "Flexibility",
    date: "2024-07-16",
    exercises: [
      {
        id: "e5",
        name: "Sun Salutations",
        type: "Flexibility",
        sets: [
          { id: "s9", setNumber: 1, reps: 5, metrics: [{ id: "m14", type: "repetitions", value: 5, unit: "reps" }] }
        ],
        notes: "Focus on breathing.",
        media: [],
        selectedMetrics: [{ type: "repetitions", unit: "reps" }]
      },
      {
        id: "e6",
        name: "Stretching",
        type: "Flexibility",
        sets: [
          { id: "s10", setNumber: 1, time: 10, metrics: [{ id: "m15", type: "time", value: 10, unit: "minutes" }] }
        ],
        notes: "Hold each stretch.",
        media: [],
        selectedMetrics: [{ type: "time", unit: "minutes" }]
      }
    ]
  },
  {
    id: "4",
    title: "HIIT Workout",
    category: "HIIT",
    date: "2024-07-17",
    exercises: [
      {
        id: "e7",
        name: "Burpees",
        type: "HIIT",
        sets: [
          { id: "s11", setNumber: 1, time: 1, reps: 15, metrics: [{ id: "m16", type: "time", value: 1, unit: "minutes" }, { id: "m17", type: "repetitions", value: 15, unit: "reps" }] }
        ],
        notes: "Go all out.",
        media: [],
        selectedMetrics: [{ type: "time", unit: "minutes" }, { type: "repetitions", unit: "reps" }]
      },
      {
        id: "e8",
        name: "Mountain Climbers",
        type: "HIIT",
        sets: [
          { id: "s12", setNumber: 1, time: 1, reps: 20, metrics: [{ id: "m18", type: "time", value: 1, unit: "minutes" }, { id: "m19", type: "repetitions", value: 20, unit: "reps" }] }
        ],
        notes: "Keep your core tight.",
        media: [],
        selectedMetrics: [{ type: "time", unit: "minutes" }, { type: "repetitions", unit: "reps" }]
      }
    ]
  },
  {
    id: "5",
    title: "Core Strengthening",
    category: "Core",
    date: "2024-07-18",
    exercises: [
      {
        id: "e9",
        name: "Plank",
        type: "Core",
        sets: [
          { id: "s13", setNumber: 1, time: 1, metrics: [{ id: "m20", type: "time", value: 1, unit: "minutes" }] }
        ],
        notes: "Hold steady.",
        media: [],
        selectedMetrics: [{ type: "time", unit: "minutes" }]
      },
      {
        id: "e10",
        name: "Crunches",
        type: "Core",
        sets: [
          { id: "s14", setNumber: 1, reps: 20, metrics: [{ id: "m21", type: "repetitions", value: 20, unit: "reps" }] }
        ],
        notes: "Engage your abs.",
        media: [],
        selectedMetrics: [{ type: "repetitions", unit: "reps" }]
      }
    ]
  },
  {
    id: "6",
    title: "Balance Training",
    category: "Balance",
    date: "2024-07-19",
    exercises: [
      {
        id: "e11",
        name: "Single Leg Stand",
        type: "Balance",
        sets: [
          { id: "s15", setNumber: 1, time: 1, metrics: [{ id: "m22", type: "time", value: 1, unit: "minutes" }] }
        ],
        notes: "Find your center.",
        media: [],
        selectedMetrics: [{ type: "time", unit: "minutes" }]
      },
      {
        id: "e12",
        name: "Heel-to-Toe Walk",
        type: "Balance",
        sets: [
          { id: "s16", setNumber: 1, reps: 10, metrics: [{ id: "m23", type: "repetitions", value: 10, unit: "reps" }] }
        ],
        notes: "Maintain focus.",
        media: [],
        selectedMetrics: [{ type: "repetitions", unit: "reps" }]
      }
    ]
  },
  {
    id: "7",
    title: "Recovery Session",
    category: "Recovery",
    date: "2024-07-20",
    exercises: [
      {
        id: "e13",
        name: "Foam Rolling",
        type: "Recovery",
        sets: [
          { id: "s17", setNumber: 1, time: 15, metrics: [{ id: "m24", type: "time", value: 15, unit: "minutes" }] }
        ],
        notes: "Release tension.",
        media: [],
        selectedMetrics: [{ type: "time", unit: "minutes" }]
      },
      {
        id: "e14",
        name: "Meditation",
        type: "Recovery",
        sets: [
          { id: "s18", setNumber: 1, time: 20, metrics: [{ id: "m25", type: "time", value: 20, unit: "minutes" }] }
        ],
        notes: "Relax your mind.",
        media: [],
        selectedMetrics: [{ type: "time", unit: "minutes" }]
      }
    ]
  },
  {
    id: "8",
    title: "Additional Workout",
    category: "Other",
    date: "2024-07-21",
    exercises: [
      {
        id: "e15",
        name: "Freestyle Exercise",
        type: "Other",
        sets: [
          { id: "s19", setNumber: 1, reps: 25, metrics: [{ id: "m26", type: "repetitions", value: 25, unit: "reps" }] }
        ],
        notes: "Mix it up.",
        media: [],
        selectedMetrics: [{ type: "repetitions", unit: "reps" }]
      },
      {
        id: "e16",
        name: "Cool-down",
        type: "Other",
        sets: [
          { id: "s20", setNumber: 1, time: 5, metrics: [{ id: "m27", type: "time", value: 5, unit: "minutes" }] }
        ],
        notes: "End strong.",
        media: [],
        selectedMetrics: [{ type: "time", unit: "minutes" }]
      }
    ]
  },
  {
    id: "9",
    title: "Evening Run",
    category: "Cardio",
    date: "2024-07-22",
    exercises: [
      {
        id: "e17",
        name: "Treadmill Run",
        type: "Cardio",
        sets: [
          { id: "s21", setNumber: 1, time: 35, distance: 6, metrics: [{ id: "m28", type: "time", value: 35, unit: "minutes" }, { id: "m29", type: "distance", value: 6, unit: "km" }] }
        ],
        notes: "Increase incline gradually.",
        media: [],
        selectedMetrics: [{ type: "time", unit: "minutes" }, { type: "distance", unit: "km" }]
      }
    ]
  },
  {
    id: "10",
    title: "Leg Day",
    category: "Strength",
    date: "2024-07-23",
    exercises: [
      {
        id: "e18",
        name: "Leg Press",
        type: "Strength",
        sets: [
          { id: "s22", setNumber: 1, reps: 10, weight: 100, metrics: [{ id: "m30", type: "repetitions", value: 10, unit: "reps" }, { id: "m31", type: "weight", value: 100, unit: "kg" }] },
          { id: "s23", setNumber: 2, reps: 8, weight: 120, metrics: [{ id: "m32", type: "repetitions", value: 8, unit: "reps" }, { id: "m33", type: "weight", value: 120, unit: "kg" }] }
        ],
        notes: "Control the movement.",
        media: [],
        selectedMetrics: [{ type: "repetitions", unit: "reps" }, { type: "weight", unit: "kg" }]
      },
      {
        id: "e19",
        name: "Hamstring Curls",
        type: "Strength",
        sets: [
          { id: "s24", setNumber: 1, reps: 12, weight: 30, metrics: [{ id: "m34", type: "repetitions", value: 12, unit: "reps" }, { id: "m35", type: "weight", value: 30, unit: "kg" }] },
          { id: "s25", setNumber: 2, reps: 10, weight: 35, metrics: [{ id: "m36", type: "repetitions", value: 10, unit: "reps" }, { id: "m37", type: "weight", value: 35, unit: "kg" }] }
        ],
        notes: "Squeeze at the top.",
        media: [],
        selectedMetrics: [{ type: "repetitions", unit: "reps" }, { type: "weight", unit: "kg" }]
      }
    ]
  },
  {
    id: "11",
    title: "Arm Workout",
    category: "Strength",
    date: "2024-07-24",
    exercises: [
      {
        id: "e20",
        name: "Bicep Curls",
        type: "Strength",
        sets: [
          { id: "s26", setNumber: 1, reps: 10, weight: 20, metrics: [{ id: "m38", type: "repetitions", value: 10, unit: "reps" }, { id: "m39", type: "weight", value: 20, unit: "kg" }] },
          { id: "s27", setNumber: 2, reps: 8, weight: 22, metrics: [{ id: "m40", type: "repetitions", value: 8, unit: "reps" }, { id: "m41", type: "weight", value: 22, unit: "kg" }] }
        ],
        notes: "Keep elbows still.",
        media: [],
        selectedMetrics: [{ type: "repetitions", unit: "reps" }, { type: "weight", unit: "kg" }]
      },
      {
        id: "e21",
        name: "Tricep Extensions",
        type: "Strength",
        sets: [
          { id: "s28", setNumber: 1, reps: 12, weight: 15, metrics: [{ id: "m42", type: "repetitions", value: 12, unit: "reps" }, { id: "m43", type: "weight", value: 15, unit: "kg" }] },
          { id: "s29", setNumber: 2, reps: 10, weight: 17, metrics: [{ id: "m44", type: "repetitions", value: 10, unit: "reps" }, { id: "m45", type: "weight", value: 17, unit: "kg" }] }
        ],
        notes: "Full range of motion.",
        media: [],
        selectedMetrics: [{ type: "repetitions", unit: "reps" }, { type: "weight", unit: "kg" }]
      }
    ]
  },
  {
    id: "12",
    title: "Back and Shoulders",
    category: "Strength",
    date: "2024-07-25",
    exercises: [
      {
        id: "e22",
        name: "Pull-ups",
        type: "Strength",
        sets: [
          { id: "s30", setNumber: 1, reps: 6, metrics: [{ id: "m46", type: "repetitions", value: 6, unit: "reps" }] },
          { id: "s31", setNumber: 2, reps: 4, metrics: [{ id: "m47", type: "repetitions", value: 4, unit: "reps" }] }
        ],
        notes: "Use assistance if needed.",
        media: [],
        selectedMetrics: [{ type: "repetitions", unit: "reps" }]
      },
      {
        id: "e23",
        name: "Shoulder Press",
        type: "Strength",
        sets: [
          { id: "s32", setNumber: 1, reps: 8, weight: 25, metrics: [{ id: "m48", type: "repetitions", value: 8, unit: "reps" }, { id: "m49", type: "weight", value: 25, unit: "kg" }] },
          { id: "s33", setNumber: 2, reps: 6, weight: 27, metrics: [{ id: "m50", type: "repetitions", value: 6, unit: "reps" }, { id: "m51", type: "weight", value: 27, unit: "kg" }] }
        ],
        notes: "Control the descent.",
        media: [],
        selectedMetrics: [{ type: "repetitions", unit: "reps" }, { type: "weight", unit: "kg" }]
      }
    ]
  },
  {
    id: "13",
    title: "Active Recovery",
    category: "Recovery",
    date: "2024-07-26",
    exercises: [
      {
        id: "e24",
        name: "Light Stretching",
        type: "Recovery",
        sets: [
          { id: "s34", setNumber: 1, time: 12, metrics: [{ id: "m52", type: "time", value: 12, unit: "minutes" }] }
        ],
        notes: "Gentle movements.",
        media: [],
        selectedMetrics: [{ type: "time", unit: "minutes" }]
      },
      {
        id: "e25",
        name: "Walking",
        type: "Recovery",
        sets: [
          { id: "s35", setNumber: 1, time: 20, distance: 2, metrics: [{ id: "m53", type: "time", value: 20, unit: "minutes" }, { id: "m54", type: "distance", value: 2, unit: "km" }] }
        ],
        notes: "Enjoy the scenery.",
        media: [],
        selectedMetrics: [{ type: "time", unit: "minutes" }, { type: "distance", unit: "km" }]
      }
    ]
  },
  {
    id: "14",
    title: "Weekend Fun",
    category: "Other",
    date: "2024-07-27",
    exercises: [
      {
        id: "e26",
        name: "Outdoor Activity",
        type: "Other",
        sets: [
          { id: "s36", setNumber: 1, time: 40, metrics: [{ id: "m55", type: "time", value: 40, unit: "minutes" }] }
        ],
        notes: "Have fun!",
        media: [],
        selectedMetrics: [{ type: "time", unit: "minutes" }]
      }
    ]
  },
  {
    id: "15",
    title: "Sunday Rest",
    category: "Recovery",
    date: "2024-07-28",
    exercises: [
      {
        id: "e27",
        name: "Total Rest",
        type: "Recovery",
        sets: [
          { id: "s37", setNumber: 1, time: 1440, metrics: [{ id: "m56", type: "time", value: 1440, unit: "minutes" }] }
        ],
        notes: "Recharge fully.",
        media: [],
        selectedMetrics: [{ type: "time", unit: "minutes" }]
      }
    ]
  },
  {
    id: "16",
    title: "Quick Morning Workout",
    category: "HIIT",
    date: "2024-07-14",
    exercises: [
      {
        id: "e28",
        name: "Jumping Jacks",
        type: "HIIT",
        sets: [
          { id: "s38", setNumber: 1, time: 1, reps: 30, metrics: [{ id: "m57", type: "time", value: 1, unit: "minutes" }, { id: "m58", type: "repetitions", value: 30, unit: "reps" }] }
        ],
        notes: "Start the day energized.",
        media: [],
        selectedMetrics: [{ type: "time", unit: "minutes" }, { type: "repetitions", unit: "reps" }]
      }
    ]
  },
  {
    id: "17",
    title: "Evening Stretch",
    category: "Flexibility",
    date: "2024-07-13",
    exercises: [
      {
        id: "e29",
        name: "Calf Stretch",
        type: "Flexibility",
        sets: [
          { id: "s39", setNumber: 1, time: 8, metrics: [{ id: "m59", type: "time", value: 8, unit: "minutes" }] }
        ],
        notes: "Release tension in legs.",
        media: [],
        selectedMetrics: [{ type: "time", unit: "minutes" }]
      }
    ]
  },
  {
    id: "18",
    title: "Core Blast",
    category: "Core",
    date: "2024-07-12",
    exercises: [
      {
        id: "e30",
        name: "Russian Twists",
        type: "Core",
        sets: [
          { id: "s40", setNumber: 1, reps: 40, metrics: [{ id: "m60", type: "repetitions", value: 40, unit: "reps" }] }
        ],
        notes: "Engage obliques.",
        media: [],
        selectedMetrics: [{ type: "repetitions", unit: "reps" }]
      }
    ]
  },
  {
    id: "19",
    title: "Cardio and Abs",
    category: "Cardio",
    date: "2024-07-11",
    exercises: [
      {
        id: "e31",
        name: "Bicycle Crunches",
        type: "Cardio",
        sets: [
          { id: "s41", setNumber: 1, reps: 30, metrics: [{ id: "m61", type: "repetitions", value: 30, unit: "reps" }] }
        ],
        notes: "Combine cardio with core.",
        media: [],
        selectedMetrics: [{ type: "repetitions", unit: "reps" }]
      }
    ]
  },
  {
    id: "20",
    title: "Total Body Circuit",
    category: "HIIT",
    date: "2024-07-10",
    exercises: [
      {
        id: "e32",
        name: "High Knees",
        type: "HIIT",
        sets: [
          { id: "s42", setNumber: 1, time: 1, reps: 50, metrics: [{ id: "m62", type: "time", value: 1, unit: "minutes" }, { id: "m63", type: "repetitions", value: 50, unit: "reps" }] }
        ],
        notes: "Keep knees high.",
        media: [],
        selectedMetrics: [{ type: "time", unit: "minutes" }, { type: "repetitions", unit: "reps" }]
      }
    ]
  },
  {
    id: "21",
    title: "Strength and Balance",
    category: "Balance",
    date: "2024-07-09",
    exercises: [
      {
        id: "e33",
        name: "Tree Pose",
        type: "Balance",
        sets: [
          { id: "s43", setNumber: 1, time: 1, metrics: [{ id: "m64", type: "time", value: 1, unit: "minutes" }] }
        ],
        notes: "Improve stability.",
        media: [],
        selectedMetrics: [{ type: "time", unit: "minutes" }]
      }
    ]
  },
  {
    id: "22",
    title: "Flexibility Focus",
    category: "Flexibility",
    date: "2024-07-08",
    exercises: [
      {
        id: "e34",
        name: "Butterfly Stretch",
        type: "Flexibility",
        sets: [
          { id: "s44", setNumber: 1, time: 7, metrics: [{ id: "m65", type: "time", value: 7, unit: "minutes" }] }
        ],
        notes: "Open hip flexors.",
        media: [],
        selectedMetrics: [{ type: "time", unit: "minutes" }]
      }
    ]
  },
  {
    id: "23",
    title: "Cardio Power",
    category: "Cardio",
    date: "2024-07-07",
    exercises: [
      {
        id: "e35",
        name: "Stair Climbing",
        type: "Cardio",
        sets: [
          { id: "s45", setNumber: 1, time: 25, metrics: [{ id: "m66", type: "time", value: 25, unit: "minutes" }] }
        ],
        notes: "Build endurance.",
        media: [],
        selectedMetrics: [{ type: "time", unit: "minutes" }]
      }
    ]
  },
  {
    id: "24",
    title: "Full Body Burn",
    category: "HIIT",
    date: "2024-07-06",
    exercises: [
      {
        id: "e36",
        name: "Squat Jumps",
        type: "HIIT",
        sets: [
          { id: "s46", setNumber: 1, time: 1, reps: 20, metrics: [{ id: "m67", type: "time", value: 1, unit: "minutes" }, { id: "m68", type: "repetitions", value: 20, unit: "reps" }] }
        ],
        notes: "Engage quads and glutes.",
        media: [],
        selectedMetrics: [{ type: "time", unit: "minutes" }, { type: "repetitions", unit: "reps" }]
      }
    ]
  },
  {
    id: "25",
    title: "Core Challenge",
    category: "Core",
    date: "2024-07-05",
    exercises: [
      {
        id: "e37",
        name: "Leg Raises",
        type: "Core",
        sets: [
          { id: "s47", setNumber: 1, reps: 25, metrics: [{ id: "m69", type: "repetitions", value: 25, unit: "reps" }] }
        ],
        notes: "Keep back flat.",
        media: [],
        selectedMetrics: [{ type: "repetitions", unit: "reps" }]
      }
    ]
  },
  {
    id: "26",
    title: "Balance and Coordination",
    category: "Balance",
    date: "2024-07-04",
    exercises: [
      {
        id: "e38",
        name: "Tightrope Walk",
        type: "Balance",
        sets: [
          { id: "s48", setNumber: 1, time: 6, metrics: [{ id: "m70", type: "time", value: 6, unit: "minutes" }] }
        ],
        notes: "Focus on a point ahead.",
        media: [],
        selectedMetrics: [{ type: "time", unit: "minutes" }]
      }
    ]
  },
  {
    id: "27",
    title: "Flexibility and Mobility",
    category: "Flexibility",
    date: "2024-07-03",
    exercises: [
      {
        id: "e39",
        name: "Arm Circles",
        type: "Flexibility",
        sets: [
          { id: "s49", setNumber: 1, reps: 30, metrics: [{ id: "m71", type: "repetitions", value: 30, unit: "reps" }] }
        ],
        notes: "Improve shoulder mobility.",
        media: [],
        selectedMetrics: [{ type: "repetitions", unit: "reps" }]
      }
    ]
  },
  {
    id: "28",
    title: "Cardio Intervals",
    category: "Cardio",
    date: "2024-07-02",
    exercises: [
      {
        id: "e40",
        name: "Sprints",
        type: "Cardio",
        sets: [
          { id: "s50", setNumber: 1, time: 15, metrics: [{ id: "m72", type: "time", value: 15, unit: "minutes" }] }
        ],
        notes: "Push your limits.",
        media: [],
        selectedMetrics: [{ type: "time", unit: "minutes" }]
      }
    ]
  },
  {
    id: "29",
    title: "HIIT Cardio Mix",
    category: "HIIT",
    date: "2024-07-01",
    exercises: [
      {
        id: "e41",
        name: "Box Jumps",
        type: "HIIT",
        sets: [
          { id: "s51", setNumber: 1, time: 1, reps: 15, metrics: [{ id: "m73", type: "time", value: 1, unit: "minutes" }, { id: "m74", type: "repetitions", value: 15, unit: "reps" }] }
        ],
        notes: "Explosive power.",
        media: [],
        selectedMetrics: [{ type: "time", unit: "minutes" }, { type: "repetitions", unit: "reps" }]
      }
    ]
  },
  {
    id: "30",
    title: "Core Strength Session",
    category: "Core",
    date: "2024-06-30",
    exercises: [
      {
        id: "e42",
        name: "Ab Roller",
        type: "Core",
        sets: [
          { id: "s52", setNumber: 1, reps: 12, metrics: [{ id: "m75", type: "repetitions", value: 12, unit: "reps" }] }
        ],
        notes: "Keep core engaged.",
        media: [],
        selectedMetrics: [{ type: "repetitions", unit: "reps" }]
      }
    ]
  }
];

// Mock saved exercises (for reuse)
let savedExercisesData: Exercise[] = [
  {
    id: "saved-e1",
    name: "Squats",
    type: "Strength",
    sets: [],
    selectedMetrics: [{ type: "repetitions", unit: "reps" }, { type: "weight", unit: "kg" }]
  },
  {
    id: "saved-e2",
    name: "Push-ups",
    type: "Strength",
    sets: [],
    selectedMetrics: [{ type: "repetitions", unit: "reps" }]
  },
  {
    id: "saved-e3",
    name: "Running",
    type: "Cardio",
    sets: [],
    selectedMetrics: [{ type: "distance", unit: "km" }, { type: "duration", unit: "minutes" }]
  }
];

// Mock categories data
const categoriesData: Record<string, CategoryInfo> = {
  "Strength": { name: "Strength", color: "#FF5733", icon: "Dumbbell" },
  "Cardio": { name: "Cardio", color: "#3498DB", icon: "Heart" },
  "Flexibility": { name: "Flexibility", color: "#2ECC71", icon: "Yoga" },
  "Balance": { name: "Balance", color: "#F1C40F", icon: "Mountain" },
  "Core": { name: "Core", color: "#9B59B6", icon: "Target" },
  "HIIT": { name: "HIIT", color: "#E74C3C", icon: "Zap" },
  "Recovery": { name: "Recovery", color: "#1ABC9C", icon: "ThumbsUp" },
  "Other": { name: "Other", color: "#34495E", icon: "Activity" }
};

// Exercise Type helper functions
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

// Get saved exercises
export const getSavedExercises = (): Exercise[] => {
  return savedExercisesData;
};

// Save exercise function
export const saveExercise = (exercise: Exercise): void => {
  // Check if exercise already exists
  const existingIndex = savedExercisesData.findIndex(e => e.id === exercise.id);
  if (existingIndex !== -1) {
    // Update existing
    savedExercisesData[existingIndex] = exercise;
  } else {
    // Add new
    savedExercisesData.push(exercise);
  }
};

// Get category info
export const getCategoryInfo = (categoryName: string): CategoryInfo => {
  return categoriesData[categoryName] || { 
    name: categoryName, 
    color: "#34495E", // Default color
    icon: null 
  };
};

// Get all categories
export const getAllCategories = (): string[] => {
  return Object.keys(categoriesData);
};

// Create category
export const createCategory = (category: CategoryInfo): void => {
  categoriesData[category.name] = category;
};

// Update category
export const updateCategory = (oldName: string, category: CategoryInfo): void => {
  if (oldName !== category.name) {
    // If name changed, remove old entry
    delete categoriesData[oldName];
  }
  // Create or update with new name
  categoriesData[category.name] = category;
};

// Get all workouts
export const getAllWorkouts = (): Workout[] => {
  return workoutData;
};

// Add function to delete a workout
export const deleteWorkout = (id: string): boolean => {
  const initialLength = workoutData.length;
  workoutData = workoutData.filter(workout => workout.id !== id);
  return workoutData.length < initialLength;
};

// Get workouts for a specific date
export const getWorkoutsByDate = (date: Date): Workout[] => {
  const dateString = date.toISOString().split('T')[0];
  return workoutData.filter(workout => workout.date === dateString);
};

// Get workouts for yesterday
export const getWorkoutsForYesterday = (): Workout[] => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return getWorkoutsByDate(yesterday);
};

// Get workouts for the past week
export const getWorkoutsForPastWeek = (): Workout[] => {
  const today = new Date();
  const oneWeekAgo = new Date(today);
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  
  return workoutData.filter(workout => {
    const workoutDate = new Date(workout.date);
    return workoutDate >= oneWeekAgo && workoutDate < today;
  });
};

// Get workout by ID
export const getWorkoutById = (id: string): Workout | undefined => {
  return workoutData.find(workout => workout.id === id);
};
