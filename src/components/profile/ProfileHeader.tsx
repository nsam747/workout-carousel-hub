
import React from "react";
import { User } from "@/lib/feedsData";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Lock, Unlock } from "lucide-react";

interface ProfileHeaderProps {
  user: User;
  isCurrentUser: boolean;
  isPrivate: boolean;
  onTogglePrivacy?: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ 
  user,
  isCurrentUser,
  isPrivate,
  onTogglePrivacy
}) => {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(part => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };
  
  return (
    <div className="flex flex-col items-center space-y-4 py-6">
      <Avatar className="h-24 w-24 border-2 border-background shadow">
        <AvatarImage src={user.avatar} alt={user.name} />
        <AvatarFallback className="text-xl">{getInitials(user.name)}</AvatarFallback>
      </Avatar>
      
      <div className="text-center">
        <div className="flex items-center justify-center gap-2">
          <h2 className="text-xl font-bold">{user.name}</h2>
          {isCurrentUser && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6 rounded-full" 
              onClick={onTogglePrivacy}
              title={isPrivate ? "Private Profile" : "Public Profile"}
            >
              {isPrivate ? (
                <Lock className="h-3.5 w-3.5" />
              ) : (
                <Unlock className="h-3.5 w-3.5" />
              )}
            </Button>
          )}
        </div>
        <p className="text-muted-foreground">Fitness Enthusiast</p>
      </div>
    </div>
  );
};

export default ProfileHeader;
