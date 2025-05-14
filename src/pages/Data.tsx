
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BottomNavigation from '@/components/BottomNavigation';
import ExercisesTab from '@/components/data/ExercisesTab';
import CategoriesTab from '@/components/data/CategoriesTab';
import MediaTab from '@/components/data/MediaTab';

const Data = () => {
  const [activeTab, setActiveTab] = useState<string>("exercises");
  
  return (
    <div className="pb-20 min-h-screen bg-background">
      <div className="container px-4 py-6 max-w-xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Data Management</h1>
        
        <Tabs defaultValue="exercises" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="exercises">Exercises</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="media" disabled>Media</TabsTrigger>
          </TabsList>
          <TabsContent value="exercises">
            <ExercisesTab />
          </TabsContent>
          <TabsContent value="categories">
            <CategoriesTab />
          </TabsContent>
          <TabsContent value="media">
            <MediaTab />
          </TabsContent>
        </Tabs>
      </div>
      <BottomNavigation />
    </div>
  );
};

export default Data;
