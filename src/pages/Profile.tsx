
import React, { useEffect, useState } from "react";
import { getUserProfile, UserProfile } from "@/lib/profileData";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileStats from "@/components/profile/ProfileStats";
import RecentActivityList from "@/components/profile/RecentActivityList";
import AchievementList from "@/components/profile/AchievementList";
import ActivityChart from "@/components/profile/ActivityChart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import BottomNavigation from "@/components/BottomNavigation";

const Profile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API fetch with a small delay
    const fetchProfile = async () => {
      setLoading(true);
      try {
        // Get current user profile (hardcoded to user-1 for now)
        const data = getUserProfile("user-1");
        setProfile(data);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>User profile not found</p>
      </div>
    );
  }

  return (
    <div className="pb-20 animate-fade-in">
      <ProfileHeader profile={profile} />
      <Separator />
      
      <Tabs defaultValue="overview" className="w-full">
        <div className="px-4 pt-2">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="overview" className="space-y-4 mt-2">
          <ProfileStats profile={profile} />
          <Separator />
          <ActivityChart weeklyStats={profile.weeklyStats} />
          <Separator />
          <AchievementList achievements={profile.achievements} />
          <Separator />
          <RecentActivityList workouts={profile.recentWorkouts} />
        </TabsContent>
        
        <TabsContent value="activity">
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-3">Activity History</h2>
            <RecentActivityList workouts={profile.recentWorkouts} />
          </div>
        </TabsContent>
        
        <TabsContent value="progress">
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-3">Progress Tracking</h2>
            <p className="text-muted-foreground">Track your fitness progress over time.</p>
          </div>
        </TabsContent>
      </Tabs>
      
      <BottomNavigation />
    </div>
  );
};

export default Profile;
