
import React from "react";
import { User } from "@/lib/feedsData";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ProfileHeaderProps {
  user: User;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user }) => {
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
        <h2 className="text-xl font-bold">{user.name}</h2>
        <p className="text-muted-foreground">Fitness Enthusiast</p>
      </div>
    </div>
  );
};

export default ProfileHeader;
