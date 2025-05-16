
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { User, Post, getAllPosts, users, currentUser } from "@/lib/feedsData";
import { Workout } from "@/lib/mockData";
import BottomNavigation from "@/components/BottomNavigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserCheck, UserPlus, Settings, ArrowLeft, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import PostItem from "@/components/PostItem";
import ProfileStats from "@/components/profile/ProfileStats";
import ProfileHeader from "@/components/profile/ProfileHeader";
import RecentWorkouts from "@/components/profile/RecentWorkouts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Profile = () => {
  const { userId } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);
  const [sharingWorkouts, setSharingWorkouts] = useState(true);
  const [activeTab, setActiveTab] = useState("posts");
  
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

  const handlePrivacyToggle = () => {
    setIsPrivate(!isPrivate);
    toast.success(isPrivate ? "Profile is now public" : "Profile is now private");
  };

  const handleWorkoutSharingToggle = () => {
    setSharingWorkouts(!sharingWorkouts);
    toast.success(sharingWorkouts 
      ? "Workout sharing disabled" 
      : "Workout sharing enabled"
    );
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

  // If profile is private and not the current user, show a restricted view
  const showRestrictedView = isPrivate && !isCurrentUser && !isFollowing;

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
        <ProfileHeader 
          user={user} 
          isCurrentUser={isCurrentUser} 
          isPrivate={isPrivate}
          onTogglePrivacy={handlePrivacyToggle}
        />
        
        {/* Profile Stats */}
        <ProfileStats 
          isCurrentUser={isCurrentUser} 
          posts={posts.length} 
        />
        
        {/* Follow/Edit Profile Button */}
        {!isCurrentUser && (
          <Button 
            className="w-full" 
            onClick={handleFollowToggle}
            disabled={showRestrictedView}
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

        {/* Privacy Settings for Current User */}
        {isCurrentUser && (
          <Card className="overflow-hidden">
            <CardContent className="p-4">
              <h3 className="font-medium text-sm mb-3">Privacy Settings</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm">Share Recent Workouts</p>
                    <p className="text-xs text-muted-foreground">Allow followers to see your recent workouts</p>
                  </div>
                  <Button 
                    variant={sharingWorkouts ? "default" : "outline"}
                    onClick={handleWorkoutSharingToggle}
                    size="sm"
                  >
                    {sharingWorkouts ? "Enabled" : "Disabled"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Private Profile Message */}
        {showRestrictedView && (
          <Card className="overflow-hidden">
            <CardContent className="p-6 text-center space-y-2">
              <Lock className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
              <h3 className="font-medium">Private Profile</h3>
              <p className="text-sm text-muted-foreground">
                This profile is private. Follow this user to see their content.
              </p>
            </CardContent>
          </Card>
        )}
        
        {/* Profile Content Tabs */}
        {!showRestrictedView && (
          <Tabs defaultValue="posts" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="posts">Posts</TabsTrigger>
              {(isCurrentUser || (sharingWorkouts && !isPrivate) || (isPrivate && isFollowing)) && (
                <TabsTrigger value="workouts">Recent Workouts</TabsTrigger>
              )}
            </TabsList>
            
            {/* Posts Tab */}
            <TabsContent value="posts" className="mt-4">
              {posts.length > 0 ? (
                posts.map(post => <PostItem key={post.id} post={post} />)
              ) : (
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-muted-foreground">No posts yet</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            {/* Workouts Tab - only shown if the user allows it */}
            {(isCurrentUser || (sharingWorkouts && !isPrivate) || (isPrivate && isFollowing)) && (
              <TabsContent value="workouts" className="mt-4">
                <RecentWorkouts userId={user.id} />
              </TabsContent>
            )}
          </Tabs>
        )}
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default Profile;
