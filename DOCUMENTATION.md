
# Workout Tracker Documentation

This document provides an overview of the components, their functionality, and how they interact within the Workout Tracker application.

## Core Concepts

### Workouts

A workout is the main entity in the application, representing a fitness activity that contains one or more exercises. 

**Key properties:**
- **id**: Unique identifier for the workout
- **title**: Name of the workout
- **date**: When the workout was performed
- **category**: Classification of the workout (e.g., "Strength Training", "Cardio")
- **exercises**: Collection of exercises performed in this workout
- **completed**: Boolean indicating whether the workout has been completed

**Key components:**
- `WorkoutCard`: Displays a summary of a workout
- `WorkoutList`: Shows a list of workouts for a selected date
- `AddWorkout`: Page for creating a new workout

### Exercises

Exercises are individual activities within a workout. They can be of different types and have various attributes.

**Key properties:**
- **id**: Unique identifier for the exercise
- **name**: Name of the exercise
- **type**: Type of exercise (e.g., "Chest", "Legs", "Cardio")
- **sets**: Collection of sets performed for this exercise (applicable for strength training)
- **duration**: How long the exercise lasted (in minutes)
- **notes**: Additional information about the exercise
- **media**: Array of media attachments (images/videos)
- **metrics**: Performance measurements related to the exercise

**Key components:**
- `ExerciseItem`: Displays a single exercise within a workout
- `ExerciseListItem`: Shows an exercise in the exercise list during workout creation
- `AddExerciseForm`: Form for adding a new exercise to a workout

### Performance Metrics

Performance metrics track specific measurements related to an exercise, providing insights into progress over time.

**Key properties:**
- **id**: Unique identifier for the metric
- **type**: Type of measurement (e.g., "Heart Rate", "Distance")
- **value**: Numerical value of the measurement
- **unit**: Unit of measurement (e.g., "bpm", "km")
- **setIndex**: Optional reference to a specific set (if applicable)

**Key components:**
- `PerformanceMetricForm`: Form for adding performance metrics to an exercise

### Categories

Categories help organize workouts by type, each with its own name, color, and icon.

**Key properties:**
- **name**: Name of the category
- **color**: Color associated with the category
- **icon**: Icon representing the category

**Key components:**
- `CategorySelector`: Allows selection, creation, and editing of categories

## Calendar Components

The application offers two different calendar views for browsing workouts.

### Week Calendar

A horizontal scrolling calendar that displays days of the week, allowing users to quickly navigate between dates.

**Key components:**
- `WeekCalendarCarousel`: Displays a scrollable week view of the calendar

### Month Calendar

A traditional month calendar view that shows an entire month at once, allowing users to select any date.

**Key components:**
- `MonthCalendarCarousel`: Displays a navigable month view of the calendar

## Component Interactions

### Workout Creation Flow

1. User navigates to the AddWorkout page
2. User provides workout title and selects a category using CategorySelector
3. User adds exercises using AddExerciseForm
4. Each added exercise appears in the list as an ExerciseListItem
5. On save, the workout is stored and user is redirected to the home page

### Workout Viewing Flow

1. User selects a date using either WeekCalendarCarousel or MonthCalendarCarousel
2. WorkoutList fetches and displays workouts for the selected date
3. Each workout is rendered as a WorkoutCard
4. User can expand a WorkoutCard to view the exercises within it
5. Each exercise is displayed using ExerciseItem

## Data Management

The application currently uses mock data stored in memory. In a production environment, this would be replaced with API calls to a backend service.

**Key data functions:**
- `getWorkoutsByDate`: Retrieves workouts for a specific date
- `getAllCategories`: Gets a list of all available categories
- `getCategoryInfo`: Retrieves details about a specific category
- `createWorkout`: Creates a new workout
- `getExerciseTypes`: Gets a list of all exercise types
- `getSavedExercises`: Retrieves all saved exercises
- `saveExercise`: Saves a new exercise or updates an existing one
- `createCategory`: Creates a new category
- `updateCategory`: Updates an existing category

## UI Design

The UI follows a mobile-first approach with:
- A responsive layout that adapts to different screen sizes
- Bottom navigation for easy access to key features on mobile
- Card-based design for displaying workouts and exercises
- Expandable/collapsible components to show/hide details
- Modal dialogs for forms and detailed interactions
- Color-coded categories for visual differentiation

## Development Guidelines

When adding new features or making changes:
1. Maintain the existing component structure
2. Ensure responsive design for all components
3. Use Tailwind CSS for styling
4. Follow TypeScript typing conventions
5. Keep components focused and manageable in size
6. Consider breaking large components into smaller ones
7. Use the provided shadcn/ui components for consistent UI
