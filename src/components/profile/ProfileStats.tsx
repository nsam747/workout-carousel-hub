
import React from "react";
import { UserProfile, formatTime } from "@/lib/profileData";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart3, Calendar, Clock, Flame } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProfileStatsProps {
  profile: UserProfile;
}

const ProfileStats: React.FC<ProfileStatsProps> = ({ profile }) => {
  const { stats } = profile;
  
  return (
    <div className="px-4 py-3">
      <h2 className="text-lg font-semibold mb-3">Activity Overview</h2>
      
      <div className="grid grid-cols-2 gap-3">
        {/* Distance */}
        <StatCard 
          icon={<BarChart3 className="h-4 w-4 text-blue-500" />}
          value={stats.totalDistance.toLocaleString()}
          unit="km"
          label="Total Distance"
          className="bg-blue-50 dark:bg-blue-950/40"
        />
        
        {/* Time */}
        <StatCard 
          icon={<Clock className="h-4 w-4 text-purple-500" />}
          value={formatTime(stats.totalTime)}
          unit=""
          label="Total Time"
          className="bg-purple-50 dark:bg-purple-950/40"
        />
        
        {/* Calories */}
        <StatCard 
          icon={<Flame className="h-4 w-4 text-orange-500" />}
          value={stats.totalCalories.toLocaleString()}
          unit="cal"
          label="Total Calories"
          className="bg-orange-50 dark:bg-orange-950/40"
        />
        
        {/* Weekly Average */}
        <StatCard 
          icon={<Calendar className="h-4 w-4 text-green-500" />}
          value={stats.weeklyAverage.toString()}
          unit="workouts"
          label="Weekly Average"
          className="bg-green-50 dark:bg-green-950/40"
        />
      </div>
      
      {/* Personal Bests */}
      <div className="mt-5">
        <h3 className="text-sm font-semibold mb-2 flex items-center">
          <span className="mr-1">💪</span> Personal Bests
        </h3>
        <div className="bg-secondary/50 rounded-lg p-3 space-y-2">
          {stats.personalBests.map(pb => (
            <div key={pb.id} className="flex justify-between items-center">
              <span className="text-sm">{pb.category}</span>
              <span className="text-sm font-medium">{pb.value} {pb.unit}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

interface StatCardProps {
  icon: React.ReactNode;
  value: string;
  unit: string;
  label: string;
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, value, unit, label, className }) => {
  return (
    <Card className={cn("overflow-hidden border-none", className)}>
      <CardContent className="p-3">
        <div className="flex items-center mb-1">
          {icon}
          <span className="text-xs text-muted-foreground ml-1">{label}</span>
        </div>
        <div className="font-semibold">
          {value} <span className="text-xs font-normal text-muted-foreground">{unit}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileStats;
