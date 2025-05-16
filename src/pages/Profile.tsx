
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { User, Post, getAllPosts, users, currentUser } from "@/lib/feedsData";
import { Workout } from "@/lib/mockData";
import BottomNavigation from "@/components/BottomNavigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserCheck, UserPlus, Settings, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import PostItem from "@/components/PostItem";
import ProfileStats from "@/components/profile/ProfileStats";
import ProfileHeader from "@/components/profile/ProfileHeader";
import RecentWorkouts from "@/components/profile/RecentWorkouts";

const Profile = () => {
  const { userId } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);
  
  useEffect(() => {
    // Determine if we're viewing current user's profile or someone else's
    if (!userId || userId === "me" || userId === currentUser.id) {
      setUser(currentUser);
      setIsCurrentUser(true);
    } else {
      const foundUser = users.find(u => u.id === userId);
      if (foundUser) {
        setUser(foundUser);
        setIsFollowing(foundUser.isFollowing || false);
      }
      setIsCurrentUser(false);
    }
    
    // Get posts for this user
    const allPosts = getAllPosts();
    if (user) {
      const filteredPosts = allPosts.filter(post => post.user.id === (userId === "me" ? currentUser.id : userId));
      setPosts(filteredPosts);
    }
  }, [userId, user]);
  
  const handleFollowToggle = () => {
    setIsFollowing(!isFollowing);
    toast.success(isFollowing ? "Unfollowed user" : "Following user");
  };
  
  // If user not found
  if (!user) {
    return (
      <div className="min-h-screen pb-20">
        <div className="max-w-xl mx-auto p-4">
          <div className="flex items-center mb-4">
            <Link to="/" className="mr-2">
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-xl font-semibold">Profile</h1>
          </div>
          <div className="flex items-center justify-center h-48">
            <p className="text-muted-foreground">User not found</p>
          </div>
        </div>
        <BottomNavigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      <div className="max-w-xl mx-auto p-4 space-y-6">
        {/* Header with back button */}
        <div className="flex items-center mb-2">
          <Link to="/" className="mr-2">
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-xl font-semibold">Profile</h1>
          
          {isCurrentUser && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 rounded-full ml-auto"
              onClick={() => toast.info("Settings functionality coming soon")}
            >
              <Settings className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        {/* Profile Header */}
        <ProfileHeader user={user} />
        
        {/* Profile Stats */}
        <ProfileStats isCurrentUser={isCurrentUser} posts={posts.length} />
        
        {/* Follow/Edit Profile Button */}
        {!isCurrentUser && (
          <Button 
            className="w-full" 
            onClick={handleFollowToggle}
          >
            {isFollowing ? (
              <>
                <UserCheck className="mr-2 h-4 w-4" />
                Following
              </>
            ) : (
              <>
                <UserPlus className="mr-2 h-4 w-4" />
                Follow
              </>
            )}
          </Button>
        )}
        
        {/* Recent Workouts */}
        <RecentWorkouts userId={user.id} />
        
        {/* User's Posts */}
        <div>
          <h2 className="text-lg font-medium mb-4">Posts</h2>
          {posts.length > 0 ? (
            posts.map(post => <PostItem key={post.id} post={post} />)
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">No posts yet</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default Profile;
