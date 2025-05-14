
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, Edit, StickyNote, Image, BookOpen } from 'lucide-react';
import { Exercise, getAllWorkouts, Workout, formatMetricWithUnit, Metric } from '@/lib/mockData';
import { getSavedExercises, getCategoryInfo } from '@/lib/mockData';
import { formatMetricName, getMetricIcon } from '@/lib/exerciseUtils';

interface MetricStats {
  totalValue: number;
  maxValue: number;
  count: number;
  unit: string;
}

const ExerciseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [metricStats, setMetricStats] = useState<Record<string, MetricStats>>({});
  const [activeTab, setActiveTab] = useState("overview");
  
  useEffect(() => {
    if (!id) return;
    
    // Get the exercise
    const exercises = getSavedExercises();
    const foundExercise = exercises.find(e => e.id === id);
    
    if (foundExercise) {
      setExercise(foundExercise);
      
      // Find all workouts containing this exercise
      const allWorkouts = getAllWorkouts();
      const relevantWorkouts = allWorkouts.filter(workout => 
        workout.exercises.some(e => e.id === id)
      );
      setWorkouts(relevantWorkouts);
      
      // Calculate metrics stats
      calculateMetricStats(relevantWorkouts, id);
    }
  }, [id]);
  
  const calculateMetricStats = (workouts: Workout[], exerciseId: string) => {
    const stats: Record<string, MetricStats> = {};
    
    workouts.forEach(workout => {
      const exerciseInstance = workout.exercises.find(e => e.id === exerciseId);
      if (!exerciseInstance || !exerciseInstance.sets) return;
      
      exerciseInstance.sets.forEach(set => {
        if (!set.metrics) return;
        
        set.metrics.forEach(metric => {
          if (!stats[metric.type]) {
            stats[metric.type] = {
              totalValue: 0,
              maxValue: 0,
              count: 0,
              unit: metric.unit
            };
          }
          
          stats[metric.type].totalValue += metric.value;
          stats[metric.type].maxValue = Math.max(stats[metric.type].maxValue, metric.value);
          stats[metric.type].count++;
        });
      });
    });
    
    setMetricStats(stats);
  };
  
  const getTotalSetsAndReps = () => {
    let totalSets = 0;
    let totalReps = 0;
    
    workouts.forEach(workout => {
      const exerciseInstance = workout.exercises.find(e => e.id === id);
      if (!exerciseInstance || !exerciseInstance.sets) return;
      
      totalSets += exerciseInstance.sets.length;
      
      exerciseInstance.sets.forEach(set => {
        if (!set.metrics) return;
        
        const repsMetric = set.metrics.find(m => m.type === 'repetitions');
        if (repsMetric) {
          totalReps += repsMetric.value;
        }
      });
    });
    
    return { totalSets, totalReps };
  };
  
  const getAllNotes = () => {
    const notes: string[] = [];
    
    workouts.forEach(workout => {
      const exerciseInstance = workout.exercises.find(e => e.id === id);
      if (exerciseInstance && exerciseInstance.notes && exerciseInstance.notes.trim().length > 0) {
        notes.push(exerciseInstance.notes);
      }
    });
    
    return notes;
  };

  const getAllMedia = () => {
    const media: string[] = [];
    
    workouts.forEach(workout => {
      const exerciseInstance = workout.exercises.find(e => e.id === id);
      if (exerciseInstance && exerciseInstance.media && exerciseInstance.media.length > 0) {
        media.push(...exerciseInstance.media);
      }
    });
    
    return media;
  };
  
  if (!exercise) {
    return (
      <div className="container px-4 py-6 max-w-xl mx-auto">
        <Button variant="ghost" onClick={() => navigate('/data')} className="mb-4">
          <ChevronLeft className="mr-1 h-4 w-4" /> Back
        </Button>
        <div className="text-center py-12">Exercise not found</div>
      </div>
    );
  }
  
  const { totalSets, totalReps } = getTotalSetsAndReps();
  const notes = getAllNotes();
  const media = getAllMedia();
  const categoryInfo = getCategoryInfo(exercise.type);
  
  return (
    <div className="container px-4 py-6 pb-20 max-w-xl mx-auto">
      <Button variant="ghost" onClick={() => navigate('/data')} className="mb-4">
        <ChevronLeft className="mr-1 h-4 w-4" /> Back
      </Button>
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{exercise.name}</h1>
        <Button variant="outline" size="icon" disabled>
          <Edit className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="flex items-center gap-2 mb-6">
        <div 
          className="w-3 h-3 rounded-full" 
          style={{ backgroundColor: categoryInfo.color }}
        />
        <span className="text-sm text-muted-foreground">{exercise.type}</span>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="notes">Notes & Media</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <Card className="mb-4">
            <CardContent className="pt-6">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-muted-foreground text-xs">Workouts</p>
                  <p className="text-xl font-semibold">{workouts.length}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Total Sets</p>
                  <p className="text-xl font-semibold">{totalSets}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Total Reps</p>
                  <p className="text-xl font-semibold">{totalReps}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <h2 className="text-lg font-semibold mb-3">Performance Metrics</h2>
          <div className="space-y-3">
            {Object.keys(metricStats).map(metricType => (
              <Card key={metricType} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    {getMetricIcon(metricType)}
                    <span className="font-medium">
                      {formatMetricName(metricType)}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Max</p>
                      <p className="font-semibold">
                        {metricStats[metricType].maxValue} {metricStats[metricType].unit}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Average</p>
                      <p className="font-semibold">
                        {metricStats[metricType].count > 0
                          ? Math.round((metricStats[metricType].totalValue / metricStats[metricType].count) * 10) / 10
                          : 0} {metricStats[metricType].unit}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {Object.keys(metricStats).length === 0 && (
              <div className="text-center py-4 text-muted-foreground">
                No performance data available yet
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="notes">
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <StickyNote className="h-4 w-4" />
            Notes
          </h2>
          
          <div className="space-y-3 mb-6">
            {notes.length > 0 ? (
              notes.map((note, index) => (
                <Card key={index} className="p-3">
                  <p className="text-sm">{note}</p>
                </Card>
              ))
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                No notes available
              </div>
            )}
          </div>
          
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Image className="h-4 w-4" />
            Media
          </h2>
          
          <div className="grid grid-cols-3 gap-2">
            {media.length > 0 ? (
              media.map((src, index) => (
                <div key={index} className="aspect-square rounded-md bg-muted flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-muted-foreground" />
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center py-4 text-muted-foreground">
                No media available
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ExerciseDetail;
