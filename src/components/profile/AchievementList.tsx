
import React, { useState } from "react";
import { Achievement } from "@/lib/profileData";
import * as LucideIcons from "lucide-react";
import { format } from "date-fns";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AchievementListProps {
  achievements: Achievement[];
}

const AchievementList: React.FC<AchievementListProps> = ({ achievements }) => {
  const [expanded, setExpanded] = useState(false);
  
  // Format achievement date
  const formatAchievementDate = (dateString: string): string => {
    try {
      return format(new Date(dateString), "MMM d, yyyy");
    } catch (error) {
      return "Recently earned";
    }
  };
  
  // Render icon by name if it exists
  const renderIcon = (iconName: string) => {
    // Get the icon component by name
    const IconComponent = (LucideIcons as any)[iconName];
    if (!IconComponent) return null;
    
    return <IconComponent size={16} className="text-primary" />;
  };
  
  // Display only first 2 achievements if not expanded
  const displayedAchievements = expanded ? achievements : achievements.slice(0, 2);
  
  return (
    <div className="px-4 py-3">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-semibold">Achievements</h2>
        <Button size="sm" variant="ghost" className="text-xs">
          View All <ChevronRight className="h-3 w-3 ml-1" />
        </Button>
      </div>
      
      <div className="space-y-3">
        {displayedAchievements.map(achievement => (
          <div 
            key={achievement.id}
            className="flex items-center gap-3 p-3 bg-background border border-border/50 rounded-xl"
          >
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              {renderIcon(achievement.icon)}
            </div>
            
            <div className="flex-1">
              <h3 className="font-medium text-sm">{achievement.title}</h3>
              <p className="text-xs text-muted-foreground">{achievement.description}</p>
            </div>
            
            <div className="text-xs text-muted-foreground">
              {formatAchievementDate(achievement.earnedDate)}
            </div>
          </div>
        ))}
        
        {achievements.length > 2 && (
          <Button 
            variant="outline" 
            size="sm" 
            className={cn("w-full", expanded ? "hidden" : "")}
            onClick={() => setExpanded(true)}
          >
            Show All ({achievements.length})
          </Button>
        )}
      </div>
    </div>
  );
};

export default AchievementList;
