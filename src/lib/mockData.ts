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

const generateId = (): string => {
  return uuidv4();
};

const today = new Date();
const yesterday = new Date(today);
yesterday.setDate(today.getDate() - 1);
const twoDaysAgo = new Date(today);
twoDaysAgo.setDate(today.getDate() - 2);

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

// Function to add a new category
export const addCategory = (category: string): void => {
  // In a real app, this would update a database
  // For now, we just make sure our mock data includes this category
  // when we get categories by calling getAllCategories()
  if (!getAllCategories().includes(category)) {
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
