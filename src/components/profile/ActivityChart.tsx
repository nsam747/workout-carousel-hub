
import React from "react";
import { WeeklyStat } from "@/lib/profileData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip, TooltipProps } from "recharts";
import { format } from "date-fns";
import { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent";

interface ActivityChartProps {
  weeklyStats: WeeklyStat[];
}

const ActivityChart: React.FC<ActivityChartProps> = ({ weeklyStats }) => {
  // Format week starting date to short month and day
  const formatWeekLabel = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM d");
    } catch (error) {
      return "Week";
    }
  };

  // Prepare data for recharts
  const chartData = weeklyStats.map(week => ({
    week: formatWeekLabel(week.weekStarting),
    workouts: week.workouts,
    time: Math.round(week.totalTime / 60), // Convert to hours
    fullData: week, // Store full data for tooltip
  }));

  // Custom tooltip component with proper TypeScript typing
  const CustomTooltip = ({ active, payload }: TooltipProps<ValueType, NameType>) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload.fullData as WeeklyStat;
      
      const categoryItems = Object.entries(data.categories)
        .map(([category, count]) => (
          <div key={category} className="flex justify-between">
            <span>{category}</span>
            <span>{count}x</span>
          </div>
        ));
      
      return (
        <div className="bg-background p-2 border border-border rounded-lg shadow-md text-xs">
          <p className="font-semibold mb-1">Week of {formatWeekLabel(data.weekStarting)}</p>
          <div className="flex justify-between font-medium">
            <span>Total Workouts:</span>
            <span>{data.workouts}</span>
          </div>
          <div className="flex justify-between">
            <span>Total Time:</span>
            <span>{Math.round(data.totalTime / 60)}h {data.totalTime % 60}m</span>
          </div>
          {data.totalDistance && (
            <div className="flex justify-between">
              <span>Total Distance:</span>
              <span>{data.totalDistance.toFixed(1)} km</span>
            </div>
          )}
          <div className="mt-1 pt-1 border-t border-border">
            <p className="font-medium mb-1">Workout Types:</p>
            {categoryItems}
          </div>
        </div>
      );
    }
    
    return null;
  };

  return (
    <Card className="border-none shadow-none">
      <CardHeader className="px-4 pt-3 pb-0">
        <CardTitle className="text-base">Weekly Activity</CardTitle>
      </CardHeader>
      <CardContent className="p-0 pt-2">
        <div className="h-44">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
              <XAxis 
                dataKey="week"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
                dy={5}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="workouts"
                fill="#9b87f5"
                radius={[4, 4, 0, 0]}
                barSize={30}
                animationDuration={1000}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityChart;
