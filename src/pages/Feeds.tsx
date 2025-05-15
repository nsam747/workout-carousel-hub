
import React, { useState, useEffect } from "react";
import { getAllPosts, getPostsByTag, getFollowedPosts, PostTag, currentUser } from "@/lib/feedsData";
import PostItem from "@/components/PostItem";
import TagFilter from "@/components/TagFilter";
import BottomNavigation from "@/components/BottomNavigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserPlus } from "lucide-react";

const Feeds = () => {
  const [selectedTab, setSelectedTab] = useState<"trending" | "recent" | "following">("trending");
  const [selectedTag, setSelectedTag] = useState<PostTag | "All">("All");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Simulate loading
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [selectedTab, selectedTag]);
  
  // Get posts based on selected tab and tag
  const getPosts = () => {
    // First filter by tag
    const tagFilteredPosts = selectedTag === "All" 
      ? getAllPosts() 
      : getPostsByTag(selectedTag as PostTag);
    
    // Then apply tab-specific filtering/sorting
    if (selectedTab === "following") {
      const followedPosts = getFollowedPosts(currentUser.id);
      return selectedTag === "All" 
        ? followedPosts 
        : followedPosts.filter(post => post.tag === selectedTag);
    }
    
    // Sort posts based on selected tab
    return [...tagFilteredPosts].sort((a, b) => {
      if (selectedTab === "trending") {
        // Sort by likes for trending
        return b.likes - a.likes;
      } else {
        // Sort by date for recent
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      }
    });
  };
  
  const posts = getPosts();
  
  // Separate posts with and without media
  const postsWithMedia = posts.filter(post => {
    return (post.contentType === "exercise" && post.exerciseData?.media?.length) || 
           (post.contentType === "workout" && post.workoutData?.exercises[0]?.media?.length);
  });
  
  const postsWithoutMedia = posts.filter(post => {
    return !(
      (post.contentType === "exercise" && post.exerciseData?.media?.length) || 
      (post.contentType === "workout" && post.workoutData?.exercises[0]?.media?.length)
    );
  });
  
  // Combine posts to prioritize media posts
  const sortedPosts = [...postsWithMedia, ...postsWithoutMedia];

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
          onValueChange={(v) => setSelectedTab(v as "trending" | "recent" | "following")}
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="trending">Trending</TabsTrigger>
            <TabsTrigger value="recent">Recent</TabsTrigger>
            <TabsTrigger value="following">Following</TabsTrigger>
          </TabsList>
          
          <TabsContent value="trending" className="mt-4 space-y-6">
            {isLoading ? (
              // Loading skeletons
              <div className="space-y-6 animate-pulse">
                {Array(3).fill(0).map((_, i) => (
                  <div key={i} className="bg-background border border-border rounded-xl h-64 w-full"></div>
                ))}
              </div>
            ) : sortedPosts.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-muted-foreground">No trending posts found for this category.</p>
              </div>
            ) : (
              sortedPosts.map(post => (
                <PostItem key={post.id} post={post} />
              ))
            )}
          </TabsContent>
          
          <TabsContent value="recent" className="mt-4 space-y-6">
            {isLoading ? (
              // Loading skeletons
              <div className="space-y-6 animate-pulse">
                {Array(3).fill(0).map((_, i) => (
                  <div key={i} className="bg-background border border-border rounded-xl h-64 w-full"></div>
                ))}
              </div>
            ) : sortedPosts.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-muted-foreground">No recent posts found for this category.</p>
              </div>
            ) : (
              sortedPosts.map(post => (
                <PostItem key={post.id} post={post} />
              ))
            )}
          </TabsContent>
          
          <TabsContent value="following" className="mt-4">
            {isLoading ? (
              // Loading skeletons
              <div className="space-y-6 animate-pulse">
                {Array(3).fill(0).map((_, i) => (
                  <div key={i} className="bg-background border border-border rounded-xl h-64 w-full"></div>
                ))}
              </div>
            ) : sortedPosts.length === 0 ? (
              <div className="text-center py-10 space-y-4">
                <UserPlus className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground">You're not following anyone yet or they haven't posted.</p>
                <p className="text-sm text-muted-foreground">Follow other users to see their posts in this feed.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {sortedPosts.map(post => (
                  <PostItem key={post.id} post={post} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default Feeds;
