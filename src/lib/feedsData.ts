
import { v4 as uuidv4 } from 'uuid';
import { Exercise, Workout } from '@/lib/mockData';

export interface User {
  id: string;
  name: string;
  avatar: string;
}

export type PostTag = 'Calisthenics' | 'Aerials' | 'Yoga' | 'Gym' | 'Dance' | 'Other';

export type PostContentType = 'workout' | 'exercise';

export interface Post {
  id: string;
  user: User;
  contentType: PostContentType;
  workoutData?: Workout;
  exerciseData?: Exercise;
  message: string;
  tag: PostTag;
  timestamp: string;
  likes: number;
  likedBy: string[]; // Array of user IDs
  media?: string[];
}

// List of users for mock data
export const users: User[] = [
  { id: uuidv4(), name: "Alex Trainer", avatar: "https://i.pravatar.cc/150?u=alex" },
  { id: uuidv4(), name: "Sam Fitness", avatar: "https://i.pravatar.cc/150?u=sam" },
  { id: uuidv4(), name: "Jordan Flex", avatar: "https://i.pravatar.cc/150?u=jordan" },
  { id: uuidv4(), name: "Taylor Stretch", avatar: "https://i.pravatar.cc/150?u=taylor" },
  { id: uuidv4(), name: "Casey Climber", avatar: "https://i.pravatar.cc/150?u=casey" },
  { id: uuidv4(), name: "Morgan Dancer", avatar: "https://i.pravatar.cc/150?u=morgan" },
  { id: uuidv4(), name: "Riley Yogi", avatar: "https://i.pravatar.cc/150?u=riley" },
  { id: uuidv4(), name: "Jamie Strong", avatar: "https://i.pravatar.cc/150?u=jamie" },
  { id: uuidv4(), name: "Quinn Gymnast", avatar: "https://i.pravatar.cc/150?u=quinn" },
  { id: uuidv4(), name: "Avery Aerial", avatar: "https://i.pravatar.cc/150?u=avery" }
];

// Create an array of available media paths
const availableMedia = [
  '/exercise-media/20250515_1547_Graceful Dance Leap_simple_compose_01jva6jag5eymr2mv357k3rbj9.png',
  '/exercise-media/20250515_1547_One-Arm Handstand Mastery_simple_compose_01jva6jy4ve64acw2egtkp8xb2.png',
  '/exercise-media/20250515_1549_Squat Weightlifting Illustration_simple_compose_01jva6pkv1eqa9hxx3g9eyyr28.png',
  '/exercise-media/20250515_1551_Yoga Crow Pose_remix_01jva6txadewj86w5v1p2k8k74.png',
  '/exercise-media/20250515_1552_Gymnast Cartwheel Vector_remix_01jva6wkfbefs9akm3qq552a9n.png',
  '/exercise-media/20250515_1555_Aerial Hammock Grace_simple_compose_01jva70qeceh7ageem1cc2q9jf.png',
  '/exercise-media/20250515_1555_Planche Pose Athlete_simple_compose_01jva715m7fxrax0fxz6jhspjy.png',
  '/exercise-media/20250515_1558_Breakdance Freeze Pose_simple_compose_01jva77r6kf1tvkmkdt4hkhq2h.png',
  '/exercise-media/20250515_1558_Kettlebell Power Pose_simple_compose_01jva777dtemp8y9xbs9n6kvjj.png',
  '/exercise-media/20250515_1602_Elegant Aerial silks splits_remix_01jva7damjeqetqrmbrev0z26s.png',
  '/exercise-media/20250515_1607_Pole Dance Artistry_simple_compose_01jva7q18mfawrfgy8c1bmg2y2.png'
];

// Helper function to generate mock exercises with appropriate metrics
const generateMockExercise = (name: string, type: string, mediaPath?: string): Exercise => {
  const exercise: Exercise = {
    id: uuidv4(),
    name,
    type,
    sets: Array(Math.floor(Math.random() * 3) + 1).fill(null).map((_, i) => ({
      id: uuidv4(),
      setNumber: i + 1,
      metrics: []
    })),
    notes: Math.random() > 0.5 ? `Practice notes for ${name}. Focus on form and controlled movement.` : undefined,
    media: mediaPath ? [mediaPath] : []
  };

  // Add appropriate metrics based on exercise type
  exercise.sets.forEach(set => {
    if (['Strength', 'Gym', 'Calisthenics'].includes(type)) {
      set.metrics.push(
        { id: uuidv4(), type: 'repetitions', value: Math.floor(Math.random() * 10) + 5, unit: 'reps' },
        { id: uuidv4(), type: 'weight', value: Math.floor(Math.random() * 50) + 10, unit: 'lbs' }
      );
    } else if (['Yoga', 'Dance', 'Aerials'].includes(type)) {
      set.metrics.push(
        { id: uuidv4(), type: 'duration', value: Math.floor(Math.random() * 5) + 1, unit: 'min' }
      );
    } else {
      set.metrics.push(
        { id: uuidv4(), type: 'duration', value: Math.floor(Math.random() * 20) + 10, unit: 'min' },
        { id: uuidv4(), type: 'distance', value: Math.floor(Math.random() * 5) + 1, unit: 'km' }
      );
    }
  });

  return exercise;
};

// Generate mock posts with a mix of workouts and individual exercises
const generateMockPosts = (): Post[] => {
  const posts: Post[] = [];
  const usedMedia = new Set<string>();
  
  // Define a mapping of exercise categories to appropriate image keywords
  const categoryImageKeywords: Record<PostTag, string[]> = {
    'Calisthenics': ['Handstand', 'Planche'],
    'Aerials': ['Aerial', 'Hammock', 'Pole', 'silks'],
    'Yoga': ['Yoga', 'Crow'],
    'Gym': ['Weightlifting', 'Kettlebell', 'Squat'],
    'Dance': ['Dance', 'Leap'],
    'Other': ['Cartwheel', 'Breakdance', 'Freeze']
  };

  // Helper to find an appropriate image for a post tag
  const findMediaForTag = (tag: PostTag): string | undefined => {
    const keywords = categoryImageKeywords[tag];
    const availableForTag = availableMedia.filter(path => 
      !usedMedia.has(path) && 
      keywords.some(keyword => path.includes(keyword))
    );
    
    if (availableForTag.length > 0) {
      const selected = availableForTag[Math.floor(Math.random() * availableForTag.length)];
      usedMedia.add(selected);
      return selected;
    }
    
    // Fallback: use any unused image
    const anyUnused = availableMedia.find(path => !usedMedia.has(path));
    if (anyUnused) {
      usedMedia.add(anyUnused);
      return anyUnused;
    }
    
    return undefined;
  };
  
  // Generate posts for each tag
  const tags: PostTag[] = ['Calisthenics', 'Aerials', 'Yoga', 'Gym', 'Dance', 'Other'];
  
  tags.forEach(tag => {
    // Create 3-4 posts for each tag
    const postCount = Math.floor(Math.random() * 2) + 3;
    
    for (let i = 0; i < postCount; i++) {
      const user = users[Math.floor(Math.random() * users.length)];
      const isWorkout = Math.random() > 0.4; // 60% workouts, 40% individual exercises
      const mediaPath = findMediaForTag(tag);
      
      if (isWorkout) {
        // Create a workout post
        const exerciseCount = Math.floor(Math.random() * 3) + 1;
        const exercises: Exercise[] = [];
        
        for (let j = 0; j < exerciseCount; j++) {
          const exerciseName = generateExerciseNameForTag(tag, j);
          exercises.push(generateMockExercise(exerciseName, tag, j === 0 ? mediaPath : undefined));
        }
        
        const workout: Workout = {
          id: uuidv4(),
          title: generateWorkoutTitleForTag(tag),
          category: tag,
          date: getRandomPastDate(),
          completed: true,
          exercises
        };
        
        posts.push({
          id: uuidv4(),
          user,
          contentType: 'workout',
          workoutData: workout,
          message: generateMessageForTag(tag, true),
          tag,
          timestamp: getRandomPastDate(),
          likes: Math.floor(Math.random() * 50),
          likedBy: []
        });
      } else {
        // Create an individual exercise post
        const exerciseName = generateExerciseNameForTag(tag, 0);
        const exercise = generateMockExercise(exerciseName, tag, mediaPath);
        
        posts.push({
          id: uuidv4(),
          user,
          contentType: 'exercise',
          exerciseData: exercise,
          message: generateMessageForTag(tag, false),
          tag,
          timestamp: getRandomPastDate(),
          likes: Math.floor(Math.random() * 50),
          likedBy: []
        });
      }
    }
  });
  
  // Shuffle and return posts
  return posts.sort(() => Math.random() - 0.5);
};

// Helper function to generate a random date in the past 14 days
const getRandomPastDate = (): string => {
  const now = new Date();
  const daysAgo = Math.floor(Math.random() * 14);
  const hoursAgo = Math.floor(Math.random() * 24);
  const minutesAgo = Math.floor(Math.random() * 60);
  
  const pastDate = new Date(now);
  pastDate.setDate(pastDate.getDate() - daysAgo);
  pastDate.setHours(pastDate.getHours() - hoursAgo);
  pastDate.setMinutes(pastDate.getMinutes() - minutesAgo);
  
  return pastDate.toISOString();
};

// Helper function to generate exercise name based on tag
const generateExerciseNameForTag = (tag: PostTag, index: number): string => {
  const exercises: Record<PostTag, string[]> = {
    'Calisthenics': ['Pull-ups', 'Push-ups', 'Muscle Ups', 'Pistol Squats', 'L-Sit', 'Handstand', 'Human Flag'],
    'Aerials': ['Silk Climb', 'Aerial Inversion', 'Star on Pole', 'Hammock Sequence', 'Hoop Routine', 'Aerial Splits'],
    'Yoga': ['Crow Pose', 'Downward Dog', 'Warrior Sequence', 'Tree Pose', 'Headstand Practice', 'Sun Salutation'],
    'Gym': ['Bench Press', 'Deadlift', 'Squat', 'Shoulder Press', 'Cable Rows', 'Leg Press', 'Tricep Extensions'],
    'Dance': ['Ballet Sequence', 'Hip-Hop Routine', 'Contemporary Flow', 'Jazz Combination', 'Salsa Steps', 'Breakdance Moves'],
    'Other': ['Plyometric Circuit', 'Obstacle Course', 'Rock Climbing Session', 'Trail Running', 'Parkour Training', 'HIIT Session']
  };
  
  const options = exercises[tag];
  return options[index % options.length];
};

// Helper function to generate workout title based on tag
const generateWorkoutTitleForTag = (tag: PostTag): string => {
  const titles: Record<PostTag, string[]> = {
    'Calisthenics': ['Bodyweight Mastery', 'Street Workout', 'Bar Flow Session', 'Gravity Defying', 'Functional Strength'],
    'Aerials': ['Sky Flow', 'Aerial Artistry', 'Suspension Training', 'Climbing & Spinning', 'Flow Above Ground'],
    'Yoga': ['Mind-Body Balance', 'Flexibility Journey', 'Yoga Flow', 'Spiritual Practice', 'Centered Strength'],
    'Gym': ['Iron Temple Day', 'Strength Focus', 'Hypertrophy Session', 'Power Hour', 'Muscle Building'],
    'Dance': ['Rhythm & Motion', 'Choreography Practice', 'Dance Cardio', 'Expression Session', 'Movement Flow'],
    'Other': ['Mixed Training', 'Outdoor Adventure', 'Cross Training', 'Skill Development', 'Functional Movement']
  };
  
  const options = titles[tag];
  return options[Math.floor(Math.random() * options.length)];
};

// Helper function to generate message for post
const generateMessageForTag = (tag: PostTag, isWorkout: boolean): string => {
  const messages: Record<PostTag, string[]> = {
    'Calisthenics': [
      'Working on my body control. Small improvements every day!',
      'No gym needed, just you and gravity. Love this journey!',
      'Finally nailed this move after weeks of practice!',
      'Street workout keeps me sane and strong.'
    ],
    'Aerials': [
      'Defying gravity one move at a time.',
      'The feeling of flight is addictive.',
      'New sequence I've been working on for weeks.',
      'Building strength and grace simultaneously.'
    ],
    'Yoga': [
      'Finding my center in today's practice.',
      'Breathe in, breathe out. Finding peace in movement.',
      'Mind-body connection growing stronger every day.',
      'Today's practice was exactly what I needed.'
    ],
    'Gym': [
      'New PR today! Feeling stronger than ever.',
      'Consistency is key. Another day, another workout.',
      'Push day complete. The grind never stops.',
      'Form over ego. Working on perfect technique.'
    ],
    'Dance': [
      'Moving to the rhythm of my own heart.',
      'Dance is the hidden language of the soul.',
      'Expression through movement heals everything.',
      'New choreography I've been working on.'
    ],
    'Other': [
      'Trying something different today!',
      'Cross-training keeps things interesting.',
      'Breaking out of my comfort zone with this one.',
      'Sometimes the best workouts don't fit in a category.'
    ]
  };
  
  const options = messages[tag];
  const baseMessage = options[Math.floor(Math.random() * options.length)];
  
  if (isWorkout) {
    return `${baseMessage} Full workout breakdown below. #${tag.toLowerCase()} #fitness`;
  } else {
    return `${baseMessage} #${tag.toLowerCase()} #progress`;
  }
};

// Generate and export the mock posts
export const mockPosts: Post[] = generateMockPosts();

// Function to toggle like on a post
export const toggleLike = (postId: string, userId: string): void => {
  const post = mockPosts.find(p => p.id === postId);
  if (post) {
    const hasLiked = post.likedBy.includes(userId);
    if (hasLiked) {
      // Unlike
      post.likes = Math.max(0, post.likes - 1);
      post.likedBy = post.likedBy.filter(id => id !== userId);
    } else {
      // Like
      post.likes++;
      post.likedBy.push(userId);
    }
  }
};

// Function to get all posts
export const getAllPosts = (): Post[] => {
  return [...mockPosts];
};

// Function to get posts by tag
export const getPostsByTag = (tag: PostTag): Post[] => {
  return mockPosts.filter(post => post.tag === tag);
};

// Function to check if a post is liked by a user
export const isLikedByUser = (postId: string, userId: string): boolean => {
  const post = mockPosts.find(p => p.id === postId);
  return post ? post.likedBy.includes(userId) : false;
};

// For development purposes - the current user
export const currentUser: User = {
  id: uuidv4(),
  name: "Current User",
  avatar: "https://i.pravatar.cc/150?u=current"
};
