
import { v4 as uuidv4 } from "uuid";

export interface UserProfile {
  id: string;
  name: string;
  username: string;
  avatar: string;
  bio: string;
  location: string;
  joinedDate: string;
  following: number;
  followers: number;
  totalWorkouts: number;
  achievements: Achievement[];
  stats: UserStats;
  recentWorkouts: RecentWorkout[];
  weeklyStats: WeeklyStat[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earnedDate: string;
}

export interface UserStats {
  totalDistance: number; // in kilometers
  totalTime: number; // in minutes
  totalCalories: number;
  weeklyAverage: number; // workouts per week
  monthlyAverage: number; // workouts per month
  favoriteCategory: string;
  personalBests: PersonalBest[];
}

export interface PersonalBest {
  id: string;
  category: string;
  value: number;
  unit: string;
  date: string;
}

export interface RecentWorkout {
  id: string;
  title: string;
  date: string;
  duration: number; // in minutes
  category: string;
  stats: {
    distance?: number;
    calories?: number;
    intensity?: "Low" | "Medium" | "High";
  };
}

export interface WeeklyStat {
  weekStarting: string; // ISO date string
  workouts: number;
  totalTime: number; // in minutes
  totalDistance?: number; // in kilometers
  categories: {
    [key: string]: number; // category name: count
  };
}

// Mock data for the current user's profile
export const currentUserProfile: UserProfile = {
  id: "user-1",
  name: "Alex Johnson",
  username: "@alexfitness",
  avatar: "https://i.pravatar.cc/300?img=12",
  bio: "Fitness enthusiast | Runner | Weightlifter | Yoga practitioner",
  location: "San Francisco, CA",
  joinedDate: "2023-01-15",
  following: 128,
  followers: 256,
  totalWorkouts: 342,
  achievements: [
    {
      id: uuidv4(),
      title: "Century Club",
      description: "Completed 100 workouts",
      icon: "Trophy",
      earnedDate: "2023-05-20"
    },
    {
      id: uuidv4(),
      title: "Early Bird",
      description: "Completed 10 workouts before 7am",
      icon: "Sunrise",
      earnedDate: "2023-04-12"
    },
    {
      id: uuidv4(),
      title: "Consistency King",
      description: "Worked out 5 days in a row",
      icon: "Calendar",
      earnedDate: "2023-06-15"
    },
    {
      id: uuidv4(),
      title: "Power Lifter",
      description: "Lifted over 10,000 lbs in a single session",
      icon: "Dumbbell",
      earnedDate: "2023-07-22"
    }
  ],
  stats: {
    totalDistance: 1250.5,
    totalTime: 15340,
    totalCalories: 124500,
    weeklyAverage: 3.5,
    monthlyAverage: 15.2,
    favoriteCategory: "Strength",
    personalBests: [
      {
        id: uuidv4(),
        category: "Bench Press",
        value: 225,
        unit: "lbs",
        date: "2023-07-10"
      },
      {
        id: uuidv4(),
        category: "5K Run",
        value: 22.5,
        unit: "min",
        date: "2023-08-15"
      },
      {
        id: uuidv4(),
        category: "Deadlift",
        value: 315,
        unit: "lbs",
        date: "2023-06-22"
      }
    ]
  },
  recentWorkouts: [
    {
      id: uuidv4(),
      title: "Morning Run",
      date: "2023-09-12",
      duration: 45,
      category: "Cardio",
      stats: {
        distance: 5.2,
        calories: 450,
        intensity: "Medium"
      }
    },
    {
      id: uuidv4(),
      title: "Upper Body Strength",
      date: "2023-09-10",
      duration: 60,
      category: "Strength",
      stats: {
        calories: 380,
        intensity: "High"
      }
    },
    {
      id: uuidv4(),
      title: "Yoga Flow",
      date: "2023-09-08",
      duration: 30,
      category: "Flexibility",
      stats: {
        calories: 200,
        intensity: "Low"
      }
    },
    {
      id: uuidv4(),
      title: "Hill Sprints",
      date: "2023-09-06",
      duration: 25,
      category: "HIIT",
      stats: {
        distance: 2.5,
        calories: 320,
        intensity: "High"
      }
    }
  ],
  weeklyStats: [
    {
      weekStarting: "2023-09-03",
      workouts: 4,
      totalTime: 160,
      totalDistance: 12.5,
      categories: {
        "Strength": 2,
        "Cardio": 1,
        "Flexibility": 1
      }
    },
    {
      weekStarting: "2023-08-27",
      workouts: 3,
      totalTime: 120,
      totalDistance: 8.7,
      categories: {
        "Strength": 1,
        "Cardio": 2
      }
    },
    {
      weekStarting: "2023-08-20",
      workouts: 5,
      totalTime: 210,
      totalDistance: 15.3,
      categories: {
        "Strength": 2,
        "Cardio": 2,
        "HIIT": 1
      }
    },
    {
      weekStarting: "2023-08-13",
      workouts: 3,
      totalTime: 130,
      totalDistance: 10.1,
      categories: {
        "Strength": 1,
        "Cardio": 1,
        "Flexibility": 1
      }
    }
  ]
};

// Function to get a user profile by ID
export function getUserProfile(userId: string): UserProfile | null {
  if (userId === "user-1") {
    return currentUserProfile;
  }
  return null;
}

// Format minutes into hours and minutes
export function formatTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours === 0) {
    return `${mins}m`;
  }
  
  return `${hours}h ${mins}m`;
}
