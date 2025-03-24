
import { format, subDays, addDays } from "date-fns";

export type Exercise = {
  id: string;
  name: string;
  sets?: number;
  reps?: number;
  weight?: number;
  duration?: number;
  notes?: string;
  mediaUrls?: string[];
};

export type Workout = {
  id: string;
  date: Date;
  title: string;
  category: "strength" | "cardio" | "flexibility" | "hiit" | "recovery";
  exercises: Exercise[];
  completed: boolean;
};

// Generate dates for the last 5 days and the next 5 days
const today = new Date();
today.setHours(0, 0, 0, 0);

export const dateRange = Array.from({ length: 11 }, (_, i) => {
  const date = i < 5 ? subDays(today, 5 - i) : addDays(today, i - 5);
  return {
    date,
    dayName: format(date, "EEE"),
    dayNumber: format(date, "d"),
    isToday: i === 5,
  };
});

// Generate mock workout data
export const mockWorkouts: Workout[] = [
  {
    id: "1",
    date: subDays(today, 4),
    title: "Full Body Strength",
    category: "strength",
    completed: true,
    exercises: [
      {
        id: "1-1",
        name: "Barbell Squat",
        sets: 4,
        reps: 8,
        weight: 185,
        notes: "Focus on form, keep chest up",
        mediaUrls: ["https://images.unsplash.com/photo-1566241440091-ec10de8db2e1?w=500&auto=format"],
      },
      {
        id: "1-2",
        name: "Bench Press",
        sets: 4,
        reps: 10,
        weight: 135,
        notes: "Increase weight next session",
      },
      {
        id: "1-3",
        name: "Bent Over Row",
        sets: 3,
        reps: 12,
        weight: 115,
      },
    ],
  },
  {
    id: "2",
    date: subDays(today, 3),
    title: "HIIT Circuit",
    category: "hiit",
    completed: true,
    exercises: [
      {
        id: "2-1",
        name: "Burpees",
        sets: 3,
        reps: 15,
        notes: "30 sec rest between sets",
      },
      {
        id: "2-2",
        name: "Mountain Climbers",
        duration: 45,
        notes: "45 seconds on, 15 seconds rest",
        mediaUrls: ["https://images.unsplash.com/photo-1434682881908-b43d0467b798?w=500&auto=format"],
      },
      {
        id: "2-3",
        name: "Box Jumps",
        sets: 4,
        reps: 12,
      },
    ],
  },
  {
    id: "3",
    date: subDays(today, 1),
    title: "Yoga Flow",
    category: "flexibility",
    completed: true,
    exercises: [
      {
        id: "3-1",
        name: "Sun Salutation",
        sets: 3,
        notes: "Focus on breathing",
      },
      {
        id: "3-2",
        name: "Warrior Sequence",
        duration: 10,
        notes: "Hold each pose for 30 seconds",
        mediaUrls: ["https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?w=500&auto=format"],
      },
    ],
  },
  {
    id: "4",
    date: today,
    title: "Upper Body Focus",
    category: "strength",
    completed: false,
    exercises: [
      {
        id: "4-1",
        name: "Pull-ups",
        sets: 4,
        reps: 8,
        notes: "Use assistance band if needed",
      },
      {
        id: "4-2",
        name: "Shoulder Press",
        sets: 4,
        reps: 10,
        weight: 65,
        mediaUrls: ["https://images.unsplash.com/photo-1532029837206-abbe2b7620e3?w=500&auto=format"],
      },
      {
        id: "4-3",
        name: "Bicep Curls",
        sets: 3,
        reps: 12,
        weight: 35,
      },
    ],
  },
  {
    id: "5",
    date: today,
    title: "5K Run",
    category: "cardio",
    completed: false,
    exercises: [
      {
        id: "5-1",
        name: "Outdoor Run",
        duration: 30,
        notes: "Maintain steady pace, aim for negative splits",
      },
    ],
  },
  {
    id: "6",
    date: addDays(today, 1),
    title: "Lower Body Focus",
    category: "strength",
    completed: false,
    exercises: [
      {
        id: "6-1",
        name: "Deadlift",
        sets: 5,
        reps: 5,
        weight: 225,
        notes: "Focus on hip hinge movement",
      },
      {
        id: "6-2",
        name: "Leg Press",
        sets: 3,
        reps: 12,
        weight: 300,
      },
      {
        id: "6-3",
        name: "Calf Raises",
        sets: 3,
        reps: 15,
        weight: 100,
        mediaUrls: ["https://images.unsplash.com/photo-1434608519344-49d77a699e1d?w=500&auto=format"],
      },
    ],
  },
  {
    id: "7",
    date: addDays(today, 3),
    title: "Recovery Session",
    category: "recovery",
    completed: false,
    exercises: [
      {
        id: "7-1",
        name: "Foam Rolling",
        duration: 15,
        notes: "Focus on tight areas",
      },
      {
        id: "7-2",
        name: "Static Stretching",
        duration: 15,
        notes: "Hold each stretch for 30 seconds",
      },
    ],
  },
];

// Function to get workouts for a specific date
export const getWorkoutsByDate = (date: Date): Workout[] => {
  // Reset hours, minutes, seconds, and milliseconds for comparison
  const targetDate = new Date(date);
  targetDate.setHours(0, 0, 0, 0);
  
  return mockWorkouts.filter(workout => {
    const workoutDate = new Date(workout.date);
    workoutDate.setHours(0, 0, 0, 0);
    return workoutDate.getTime() === targetDate.getTime();
  });
};

// Get category color
export const getCategoryColor = (category: Workout["category"]): string => {
  switch (category) {
    case "strength":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "cardio":
      return "bg-red-100 text-red-800 border-red-200";
    case "flexibility":
      return "bg-purple-100 text-purple-800 border-purple-200";
    case "hiit":
      return "bg-orange-100 text-orange-800 border-orange-200";
    case "recovery":
      return "bg-green-100 text-green-800 border-green-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};
