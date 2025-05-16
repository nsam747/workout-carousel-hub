
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface ProfileStatsProps {
  isCurrentUser: boolean;
  posts: number;
  followers?: number;
  following?: number;
}

const ProfileStats: React.FC<ProfileStatsProps> = ({ 
  isCurrentUser,
  posts,
  followers = Math.floor(Math.random() * 100) + 5, // Mock followers count
  following = Math.floor(Math.random() * 50) + 10, // Mock following count
}) => {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="grid grid-cols-3 divide-x divide-border">
          <div className="flex flex-col items-center justify-center p-4">
            <span className="text-xl font-bold">{posts}</span>
            <span className="text-xs text-muted-foreground">Posts</span>
          </div>
          <div className="flex flex-col items-center justify-center p-4">
            <span className="text-xl font-bold">{followers}</span>
            <span className="text-xs text-muted-foreground">Followers</span>
          </div>
          <div className="flex flex-col items-center justify-center p-4">
            <span className="text-xl font-bold">{following}</span>
            <span className="text-xs text-muted-foreground">Following</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileStats;
