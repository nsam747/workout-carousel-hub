
import { useState, useEffect } from 'react';
import {
  mockExerciseTypes,
  mockWorkouts,
  mockPerformanceLevels,
  mockCategories,
  ExerciseType,
  Workout,
  WorkoutCategory,
  PerformanceLevel,
  CategoryInfo,
  Exercise,
} from '@/lib/mockData';

// Hook for exercise types
export function useExerciseTypes() {
  const [exerciseTypes, setExerciseTypes] = useState<ExerciseType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API fetch with a small delay
    const timer = setTimeout(() => {
      setExerciseTypes(mockExerciseTypes);
      setLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return { exerciseTypes, loading };
}

// Hook for workouts
export function useWorkouts() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API fetch with a small delay
    const timer = setTimeout(() => {
      setWorkouts(mockWorkouts);
      setLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return { workouts, loading };
}

// Hook for getting a specific workout
export function useWorkout(id: string | undefined) {
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API fetch with a small delay
    const timer = setTimeout(() => {
      if (id) {
        const foundWorkout = mockWorkouts.find(w => w.id === id) || null;
        setWorkout(foundWorkout);
      } else {
        setWorkout(null);
      }
      setLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, [id]);

  return { workout, loading };
}

// Hook for workouts by date
export function useWorkoutsByDate(date: Date) {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API fetch with a small delay
    const timer = setTimeout(() => {
      const targetDate = new Date(date);
      const filtered = mockWorkouts.filter(workout => {
        const workoutDate = new Date(workout.date);
        return (
          workoutDate.getFullYear() === targetDate.getFullYear() &&
          workoutDate.getMonth() === targetDate.getMonth() &&
          workoutDate.getDate() === targetDate.getDate()
        );
      });
      setWorkouts(filtered);
      setLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, [date]);

  return { workouts, loading };
}

// Hook for all categories
export function useCategories() {
  const [categories, setCategories] = useState<WorkoutCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API fetch with a small delay
    const timer = setTimeout(() => {
      setCategories(mockCategories);
      setLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return { categories, loading };
}

// Hook for category info
export function useCategoryInfo(category: string) {
  const [categoryInfo, setCategoryInfo] = useState<CategoryInfo>({ 
    color: '#808080',
    icon: 'dumbbell'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API fetch with a small delay
    const timer = setTimeout(() => {
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
      
      setCategoryInfo({ color, icon });
      setLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, [category]);

  return { categoryInfo, loading };
}

// Hook for performance levels
export function usePerformanceLevels() {
  const [performanceLevels, setPerformanceLevels] = useState<PerformanceLevel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API fetch with a small delay
    const timer = setTimeout(() => {
      setPerformanceLevels(mockPerformanceLevels);
      setLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return { performanceLevels, loading };
}

// Hook for getting exercises for a specific workout
export function useWorkoutExercises(workoutId: string | undefined) {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API fetch with a small delay
    const timer = setTimeout(() => {
      if (workoutId) {
        const workout = mockWorkouts.find(w => w.id === workoutId);
        if (workout) {
          setExercises(workout.exercises);
        } else {
          setExercises([]);
        }
      } else {
        setExercises([]);
      }
      setLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, [workoutId]);

  return { exercises, loading };
}

// Hook for all workouts
export function useAllWorkouts() {
  const [allWorkouts, setAllWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API fetch with a small delay
    const timer = setTimeout(() => {
      setAllWorkouts(mockWorkouts);
      setLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return { allWorkouts, loading };
}

// Hook for date range
export function useDateRange() {
  const [dateRange, setDateRange] = useState<{
    date: Date;
    dayName: string;
    dayNumber: number;
    isToday: boolean;
  }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Generate date range similar to the one in mockData
    const generateDateRange = () => {
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
    };

    // Simulate API fetch with a small delay
    const timer = setTimeout(() => {
      setDateRange(generateDateRange());
      setLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return { dateRange, loading };
}
