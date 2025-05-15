
import { v4 as uuidv4 } from 'uuid';
import { Exercise, Workout } from './mockData';
import { toast } from 'sonner';

export type PostTag = 'Strength' | 'Cardio' | 'Flexibility' | 'Core' | 'Recovery' | 'HIIT' | 'Balance';

export interface User {
  id: string;
  name: string;
  avatar: string;
  isFollowing?: boolean;
}

export interface Post {
  id: string;
  user: User;
  timestamp: string;
  likes: number;
  message?: string;
  tag: PostTag;
  contentType: 'workout' | 'exercise';
  workoutData?: Workout;
  exerciseData?: Exercise;
  media?: string[];
}

// Current user
export const currentUser: User = {
  id: 'current-user',
  name: 'Current User',
  avatar: '/placeholder.svg'
};

// Sample users
export const users: User[] = [
  {
    id: 'user-1',
    name: 'Emma Johnson',
    avatar: 'https://i.pravatar.cc/150?img=1',
    isFollowing: true
  },
  {
    id: 'user-2',
    name: 'James Wilson',
    avatar: 'https://i.pravatar.cc/150?img=2',
  },
  {
    id: 'user-3',
    name: 'Sophia Lee',
    avatar: 'https://i.pravatar.cc/150?img=3',
    isFollowing: true
  },
  {
    id: 'user-4',
    name: 'Mike Thompson',
    avatar: 'https://i.pravatar.cc/150?img=4',
  },
  {
    id: 'user-5',
    name: 'Olivia Parker',
    avatar: 'https://i.pravatar.cc/150?img=5',
  }
];

// Sample posts with data from mockData exports
export const posts: Post[] = [
  {
    id: 'post-1',
    user: users[0],
    timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    likes: 24,
    message: 'Just completed this strength workout! Feeling stronger every day. 💪',
    tag: 'Strength',
    contentType: 'workout',
    workoutData: {
      id: 'workout-demo-1',
      title: 'Full Body Strength',
      category: 'Strength',
      date: new Date().toISOString(),
      completed: true,
      exercises: [
        {
          id: 'ex-demo-1-1',
          name: 'Barbell Squat',
          type: 'Strength',
          sets: [
            {
              id: 'set-demo-1-1-1',
              setNumber: 1,
              metrics: [
                { id: 'metric-1', type: 'weight', value: 135, unit: 'lbs' },
                { id: 'metric-2', type: 'repetitions', value: 10, unit: 'reps' }
              ]
            },
            {
              id: 'set-demo-1-1-2',
              setNumber: 2,
              metrics: [
                { id: 'metric-3', type: 'weight', value: 155, unit: 'lbs' },
                { id: 'metric-4', type: 'repetitions', value: 8, unit: 'reps' }
              ]
            }
          ],
          notes: 'Focus on form and depth',
          media: ['/public/exercise-media/20250515_1549_Squat Weightlifting Illustration_simple_compose_01jva6pkv1eqa9hxx3g9eyyr28.png']
        },
        {
          id: 'ex-demo-1-2',
          name: 'Bench Press',
          type: 'Strength',
          sets: [
            {
              id: 'set-demo-1-2-1',
              setNumber: 1,
              metrics: [
                { id: 'metric-5', type: 'weight', value: 155, unit: 'lbs' },
                { id: 'metric-6', type: 'repetitions', value: 8, unit: 'reps' }
              ]
            },
            {
              id: 'set-demo-1-2-2',
              setNumber: 2,
              metrics: [
                { id: 'metric-7', type: 'weight', value: 165, unit: 'lbs' },
                { id: 'metric-8', type: 'repetitions', value: 6, unit: 'reps' }
              ]
            }
          ],
          notes: '',
          media: []
        }
      ]
    },
    media: [
      '/public/exercise-media/20250515_1549_Squat Weightlifting Illustration_simple_compose_01jva6pkv1eqa9hxx3g9eyyr28.png',
      '/public/exercise-media/20250515_1555_Planche Pose Athlete_simple_compose_01jva715m7fxrax0fxz6jhspjy.png'
    ]
  },
  {
    id: 'post-2',
    user: users[1],
    timestamp: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
    likes: 18,
    message: 'My favorite core exercise - try it out!',
    tag: 'Core',
    contentType: 'exercise',
    exerciseData: {
      id: 'ex-demo-2',
      name: 'Russian Twists',
      type: 'Core',
      sets: [
        {
          id: 'set-demo-2-1',
          setNumber: 1,
          metrics: [
            { id: 'metric-9', type: 'repetitions', value: 20, unit: 'reps' }
          ]
        },
        {
          id: 'set-demo-2-2',
          setNumber: 2,
          metrics: [
            { id: 'metric-10', type: 'repetitions', value: 20, unit: 'reps' }
          ]
        }
      ],
      notes: 'Keep feet elevated for extra challenge',
      media: []
    }
  },
  {
    id: 'post-3',
    user: users[2],
    timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    likes: 42,
    message: 'My yoga flow for improved flexibility and balance.',
    tag: 'Flexibility',
    contentType: 'workout',
    workoutData: {
      id: 'workout-demo-3',
      title: 'Yoga Flow',
      category: 'Flexibility',
      date: new Date().toISOString(),
      completed: true,
      exercises: [
        {
          id: 'ex-demo-3-1',
          name: 'Downward Dog',
          type: 'Flexibility',
          sets: [
            {
              id: 'set-demo-3-1-1',
              setNumber: 1,
              metrics: [
                { id: 'metric-11', type: 'duration', value: 60, unit: 'sec' }
              ]
            }
          ],
          notes: 'Focus on pressing heels toward floor',
          media: []
        },
        {
          id: 'ex-demo-3-2',
          name: 'Crow Pose',
          type: 'Balance',
          sets: [
            {
              id: 'set-demo-3-2-1',
              setNumber: 1,
              metrics: [
                { id: 'metric-12', type: 'duration', value: 30, unit: 'sec' }
              ]
            }
          ],
          notes: 'Engage core and focus on a single point',
          media: ['/public/exercise-media/20250515_1551_Yoga Crow Pose_remix_01jva6txadewj86w5v1p2k8k74.png']
        }
      ]
    },
    media: ['/public/exercise-media/20250515_1551_Yoga Crow Pose_remix_01jva6txadewj86w5v1p2k8k74.png']
  },
  {
    id: 'post-4',
    user: users[3],
    timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    likes: 31,
    message: 'This HIIT circuit got me sweating! Try 3 rounds with 1 min rest between exercises.',
    tag: 'HIIT',
    contentType: 'workout',
    workoutData: {
      id: 'workout-demo-4',
      title: 'HIIT Circuit',
      category: 'HIIT',
      date: new Date().toISOString(),
      completed: true,
      exercises: [
        {
          id: 'ex-demo-4-1',
          name: 'Burpees',
          type: 'HIIT',
          sets: [
            {
              id: 'set-demo-4-1-1',
              setNumber: 1,
              metrics: [
                { id: 'metric-13', type: 'repetitions', value: 15, unit: 'reps' }
              ]
            }
          ],
          notes: '',
          media: []
        },
        {
          id: 'ex-demo-4-2',
          name: 'Mountain Climbers',
          type: 'HIIT',
          sets: [
            {
              id: 'set-demo-4-2-1',
              setNumber: 1,
              metrics: [
                { id: 'metric-14', type: 'duration', value: 45, unit: 'sec' }
              ]
            }
          ],
          notes: '',
          media: []
        }
      ]
    }
  },
  {
    id: 'post-5',
    user: users[4],
    timestamp: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
    likes: 27,
    message: 'Check out my flexibility progress! This hamstring stretch has been a game-changer.',
    tag: 'Flexibility',
    contentType: 'exercise',
    exerciseData: {
      id: 'ex-demo-5',
      name: 'Standing Hamstring Stretch',
      type: 'Flexibility',
      sets: [
        {
          id: 'set-demo-5-1',
          setNumber: 1,
          metrics: [
            { id: 'metric-15', type: 'duration', value: 60, unit: 'sec' }
          ]
        }
      ],
      notes: 'Keep back straight and focus on breathing into the stretch',
      media: ['/public/exercise-media/20250515_1547_Graceful Dance Leap_simple_compose_01jva6jag5eymr2mv357k3rbj9.png']
    },
    media: [
      '/public/exercise-media/20250515_1547_Graceful Dance Leap_simple_compose_01jva6jag5eymr2mv357k3rbj9.png',
      '/public/exercise-media/20250515_1602_Elegant Aerial silks splits_remix_01jva7damjeqetqrmbrev0z26s.png'
    ]
  },
  {
    id: 'post-6',
    user: users[0],
    timestamp: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
    likes: 19,
    message: 'Working on my handstand progression. Any tips?',
    tag: 'Balance',
    contentType: 'exercise',
    exerciseData: {
      id: 'ex-demo-6',
      name: 'Wall-Assisted Handstand',
      type: 'Balance',
      sets: [
        {
          id: 'set-demo-6-1',
          setNumber: 1,
          metrics: [
            { id: 'metric-16', type: 'duration', value: 45, unit: 'sec' }
          ]
        },
        {
          id: 'set-demo-6-2',
          setNumber: 2,
          metrics: [
            { id: 'metric-17', type: 'duration', value: 30, unit: 'sec' }
          ]
        }
      ],
      notes: 'Focus on shoulder engagement and core stability',
      media: ['/public/exercise-media/20250515_1547_One-Arm Handstand Mastery_simple_compose_01jva6jy4ve64acw2egtkp8xb2.png']
    },
    media: ['/public/exercise-media/20250515_1547_One-Arm Handstand Mastery_simple_compose_01jva6jy4ve64acw2egtkp8xb2.png']
  },
  {
    id: 'post-7',
    user: users[1],
    timestamp: new Date(Date.now() - 432000000).toISOString(), // 5 days ago
    likes: 13,
    message: 'My recovery day routine - gentle movements and stretches.',
    tag: 'Recovery',
    contentType: 'workout',
    workoutData: {
      id: 'workout-demo-7',
      title: 'Active Recovery',
      category: 'Recovery',
      date: new Date().toISOString(),
      completed: true,
      exercises: [
        {
          id: 'ex-demo-7-1',
          name: 'Foam Rolling',
          type: 'Recovery',
          sets: [
            {
              id: 'set-demo-7-1-1',
              setNumber: 1,
              metrics: [
                { id: 'metric-18', type: 'duration', value: 10, unit: 'min' }
              ]
            }
          ],
          notes: 'Focus on problem areas and tight muscles',
          media: []
        },
        {
          id: 'ex-demo-7-2',
          name: 'Light Walking',
          type: 'Recovery',
          sets: [
            {
              id: 'set-demo-7-2-1',
              setNumber: 1,
              metrics: [
                { id: 'metric-19', type: 'duration', value: 20, unit: 'min' },
                { id: 'metric-20', type: 'distance', value: 1.5, unit: 'miles' }
              ]
            }
          ],
          notes: '',
          media: []
        }
      ]
    }
  },
  {
    id: 'post-8',
    user: users[3],
    timestamp: new Date(Date.now() - 518400000).toISOString(), // 6 days ago
    likes: 36,
    message: 'Check out these aerial silks moves I've been working on!',
    tag: 'Flexibility',
    contentType: 'exercise',
    exerciseData: {
      id: 'ex-demo-8',
      name: 'Aerial Silk Sequence',
      type: 'Flexibility',
      sets: [
        {
          id: 'set-demo-8-1',
          setNumber: 1,
          metrics: [
            { id: 'metric-21', type: 'duration', value: 15, unit: 'min' }
          ]
        }
      ],
      notes: 'Focusing on controlled transitions between poses',
      media: [
        '/public/exercise-media/20250515_1555_Aerial Hammock Grace_simple_compose_01jva70qeceh7ageem1cc2q9jf.png',
        '/public/exercise-media/20250515_1602_Elegant Aerial silks splits_remix_01jva7damjeqetqrmbrev0z26s.png'
      ]
    },
    media: [
      '/public/exercise-media/20250515_1555_Aerial Hammock Grace_simple_compose_01jva70qeceh7ageem1cc2q9jf.png',
      '/public/exercise-media/20250515_1602_Elegant Aerial silks splits_remix_01jva7damjeqetqrmbrev0z26s.png',
      '/public/exercise-media/20250515_1607_Pole Dance Artistry_simple_compose_01jva7q18mfawrfgy8c1bmg2y2.png'
    ]
  },
  {
    id: 'post-9',
    user: users[2],
    timestamp: new Date(Date.now() - 604800000).toISOString(), // 7 days ago
    likes: 29,
    message: 'My cardio routine for building endurance. Gradually increase your pace!',
    tag: 'Cardio',
    contentType: 'workout',
    workoutData: {
      id: 'workout-demo-9',
      title: 'Endurance Builder',
      category: 'Cardio',
      date: new Date().toISOString(),
      completed: true,
      exercises: [
        {
          id: 'ex-demo-9-1',
          name: 'Interval Running',
          type: 'Cardio',
          sets: [
            {
              id: 'set-demo-9-1-1',
              setNumber: 1,
              metrics: [
                { id: 'metric-22', type: 'duration', value: 30, unit: 'min' },
                { id: 'metric-23', type: 'distance', value: 3.5, unit: 'miles' }
              ]
            }
          ],
          notes: 'Alternating between 2 min fast pace and 1 min recovery',
          media: []
        },
        {
          id: 'ex-demo-9-2',
          name: 'Jump Rope',
          type: 'Cardio',
          sets: [
            {
              id: 'set-demo-9-2-1',
              setNumber: 1,
              metrics: [
                { id: 'metric-24', type: 'duration', value: 10, unit: 'min' }
              ]
            }
          ],
          notes: '',
          media: []
        }
      ]
    }
  }
];

// Store liked posts by users
const likedPosts: Record<string, Set<string>> = {};

// Function to get all posts
export const getAllPosts = (): Post[] => {
  return [...posts];
};

// Function to get posts by tag
export const getPostsByTag = (tag: PostTag): Post[] => {
  return posts.filter(post => post.tag === tag);
};

// Function to toggle like on a post
export const toggleLike = (postId: string, userId: string): void => {
  // Initialize set for user if it doesn't exist
  if (!likedPosts[userId]) {
    likedPosts[userId] = new Set();
  }

  // Find post
  const post = posts.find(p => p.id === postId);
  
  if (post) {
    // Check if already liked
    if (likedPosts[userId].has(postId)) {
      // Unlike
      likedPosts[userId].delete(postId);
      post.likes = Math.max(0, post.likes - 1);
    } else {
      // Like
      likedPosts[userId].add(postId);
      post.likes += 1;
    }
  }
};

// Function to check if a post is liked by a user
export const isLikedByUser = (postId: string, userId: string): boolean => {
  return likedPosts[userId]?.has(postId) || false;
};

// Function to add a shared workout to the user's routines
export const tryWorkout = (workout: Workout): void => {
  // Clone the workout and generate new IDs to avoid conflicts
  const newWorkout: Workout = {
    ...workout,
    id: uuidv4(),
    exercises: workout.exercises.map(exercise => ({
      ...exercise,
      id: uuidv4(),
      sets: exercise.sets.map(set => ({
        ...set,
        id: uuidv4(),
        metrics: set.metrics.map(metric => ({
          ...metric,
          id: uuidv4()
        }))
      }))
    }))
  };

  // In a real app, we would add this to the user's workouts
  console.log('Added workout to user routines:', newWorkout);
};
