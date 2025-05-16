
import React from "react";
import { UserProfile } from "@/lib/profileData";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Settings, Share2 } from "lucide-react";
import { format } from "date-fns";

interface ProfileHeaderProps {
  profile: UserProfile;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ profile }) => {
  // Function to format the joined date
  const formatJoinedDate = (dateString: string): string => {
    try {
      return `Joined ${format(new Date(dateString), "MMMM yyyy")}`;
    } catch (error) {
      return "Recently joined";
    }
  };

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(part => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="relative">
      {/* Cover photo/background */}
      <div className="h-32 bg-gradient-to-r from-primary/20 to-primary/30 rounded-b-xl" />
      
      {/* Profile info section */}
      <div className="px-4 pb-4">
        <div className="flex justify-between items-start -mt-16">
          {/* Avatar */}
          <Avatar className="h-24 w-24 border-4 border-background">
            <AvatarImage src={profile.avatar} alt={profile.name} />
            <AvatarFallback className="text-xl">{getInitials(profile.name)}</AvatarFallback>
          </Avatar>
          
          {/* Action buttons */}
          <div className="flex gap-2 mt-20">
            <Button size="sm" variant="ghost" className="h-9 w-9 p-0 rounded-full">
              <Share2 className="h-4 w-4" />
              <span className="sr-only">Share profile</span>
            </Button>
            <Button size="sm" variant="ghost" className="h-9 w-9 p-0 rounded-full">
              <Settings className="h-4 w-4" />
              <span className="sr-only">Settings</span>
            </Button>
          </div>
        </div>
        
        {/* User info */}
        <div className="mt-3">
          <h1 className="text-xl font-semibold">{profile.name}</h1>
          <p className="text-sm text-muted-foreground">{profile.username}</p>
          
          {profile.bio && (
            <p className="text-sm mt-2">{profile.bio}</p>
          )}
          
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-muted-foreground">
            {profile.location && (
              <span>{profile.location}</span>
            )}
            <span>{formatJoinedDate(profile.joinedDate)}</span>
          </div>
          
          {/* Follow counts */}
          <div className="flex gap-4 mt-3">
            <div>
              <span className="font-semibold">{profile.followers.toLocaleString()}</span>
              <span className="text-sm text-muted-foreground ml-1">Followers</span>
            </div>
            <div>
              <span className="font-semibold">{profile.following.toLocaleString()}</span>
              <span className="text-sm text-muted-foreground ml-1">Following</span>
            </div>
            <div>
              <span className="font-semibold">{profile.totalWorkouts.toLocaleString()}</span>
              <span className="text-sm text-muted-foreground ml-1">Workouts</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
