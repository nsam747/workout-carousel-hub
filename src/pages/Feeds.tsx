
import React, { useState } from "react";
import { getAllPosts, getPostsByTag, PostTag } from "@/lib/feedsData";
import PostItem from "@/components/PostItem";
import TagFilter from "@/components/TagFilter";
import BottomNavigation from "@/components/BottomNavigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Feeds = () => {
  const [selectedTab, setSelectedTab] = useState<"trending" | "recent">("trending");
  const [selectedTag, setSelectedTag] = useState<PostTag | "All">("All");
  
  // Get all posts
  const allPosts = getAllPosts();
  
  // Filter posts by tag if needed
  const filteredPosts = selectedTag === "All" 
    ? allPosts 
    : getPostsByTag(selectedTag as PostTag);
    
  // Sort posts based on selected tab
  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (selectedTab === "trending") {
      // Sort by likes for trending
      return b.likes - a.likes;
    } else {
      // Sort by date for recent
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    }
  });

  return (
    <div className="bg-gradient-to-b from-background to-secondary/50 min-h-screen pb-20">
      <div className="max-w-2xl mx-auto px-4 pt-8 pb-4">
        <header className="mb-6 animate-fade-in">
          <h1 className="text-3xl font-bold tracking-tight">Feeds</h1>
          <p className="text-muted-foreground mt-1">
            Discover workouts and exercises shared by the community
          </p>
        </header>

        {/* Tag filtering */}
        <div className="mb-4">
          <TagFilter selectedTag={selectedTag} onSelectTag={setSelectedTag} />
        </div>

        {/* Tabs for sorting */}
        <Tabs 
          defaultValue="trending" 
          className="mb-6" 
          onValueChange={(v) => setSelectedTab(v as "trending" | "recent")}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="trending">Trending</TabsTrigger>
            <TabsTrigger value="recent">Recent</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Posts list */}
        <div className="space-y-6">
          {sortedPosts.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-muted-foreground">No posts found for this category.</p>
            </div>
          ) : (
            sortedPosts.map(post => (
              <PostItem key={post.id} post={post} />
            ))
          )}
        </div>
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default Feeds;
