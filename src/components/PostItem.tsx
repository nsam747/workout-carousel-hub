import React, { useState } from "react";
import { Post, toggleLike, currentUser, isLikedByUser, tryWorkout } from "@/lib/feedsData";
import WorkoutCard from "@/components/WorkoutCard";
import ExerciseItem from "@/components/ExerciseItem";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { Heart, Flag, UserPlus, UserCheck, Copy, Bookmark, MoreHorizontal, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

interface PostItemProps {
  post: Post;
}

const PostItem: React.FC<PostItemProps> = ({ post }) => {
  const [isLiked, setIsLiked] = useState<boolean>(
    isLikedByUser(post.id, currentUser.id)
  );
  const [likeCount, setLikeCount] = useState<number>(post.likes);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isFollowing, setIsFollowing] = useState<boolean>(post.user.isFollowing || false);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

  const handleLikeToggle = () => {
    toggleLike(post.id, currentUser.id);
    
    if (isLiked) {
      setLikeCount(prev => Math.max(0, prev - 1));
      setIsLiked(false);
    } else {
      setLikeCount(prev => prev + 1);
      setIsLiked(true);
      toast.success("Post liked!");
    }
  };

  const handleReportPost = () => {
    toast.success("Post reported. Our team will review it.");
  };

  const handleFollowToggle = () => {
    setIsFollowing(!isFollowing);
    toast.success(isFollowing ? "Unfollowed user" : "Following user");
  };

  const handleTryWorkout = () => {
    if (post.contentType === "workout" && post.workoutData) {
      tryWorkout(post.workoutData);
      toast.success("Workout added to your routines!");
    }
  };
  
  const handleBookmarkToggle = () => {
    setIsBookmarked(!isBookmarked);
    toast.success(isBookmarked ? "Removed from bookmarks" : "Added to bookmarks");
  };

  const formatTimeAgo = (timestamp: string) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch (error) {
      return "recently";
    }
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(part => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  // Check if post has media
  const hasMedia = post.media && post.media.length > 0;
  
  // Handle media navigation
  const showNextMedia = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (post.media) {
      setCurrentMediaIndex((prev) => (prev + 1) % post.media!.length);
    }
  };

  const showPrevMedia = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (post.media) {
      setCurrentMediaIndex((prev) => (prev - 1 + post.media!.length) % post.media!.length);
    }
  };

  return (
    <div className="mb-6 bg-background border border-border rounded-xl overflow-hidden glass-card animate-scale-in">
      {/* User info header */}
      <div className="px-4 py-3 border-b border-border/40 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage src={post.user.avatar} alt={post.user.name} />
            <AvatarFallback>{getInitials(post.user.name)}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium text-sm">{post.user.name}</h3>
            <span className="text-xs text-muted-foreground">
              {formatTimeAgo(post.timestamp)}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span 
            className="inline-flex items-center justify-center text-xs py-1 px-2.5 rounded-full bg-primary/10 text-primary"
          >
            {post.tag}
          </span>
          <Button 
            variant="ghost" 
            size="sm" 
            className={cn(
              "text-xs rounded-full h-8",
              isFollowing ? "bg-primary/10 text-primary" : "hover:bg-primary/5"
            )}
            onClick={handleFollowToggle}
          >
            {isFollowing ? (
              <>
                <UserCheck className="h-3.5 w-3.5 mr-1" />
                Following
              </>
            ) : (
              <>
                <UserPlus className="h-3.5 w-3.5 mr-1" />
                Follow
              </>
            )}
          </Button>
        </div>
      </div>
      
      {/* Post media carousel (if available) */}
      {hasMedia && (
        <div className="relative">
          <AspectRatio ratio={16/9} className="bg-gray-100">
            <img 
              src={post.media![currentMediaIndex]} 
              alt={`Post image ${currentMediaIndex + 1}`}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </AspectRatio>

          {/* Media navigation */}
          {post.media && post.media.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-2 top-1/2 transform -translate-y-1/2 h-8 w-8 rounded-full bg-background/70"
                onClick={showPrevMedia}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 rounded-full bg-background/70"
                onClick={showNextMedia}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
                {post.media.map((_, index) => (
                  <span 
                    key={index} 
                    className={cn(
                      "block h-2 w-2 rounded-full",
                      index === currentMediaIndex ? "bg-primary" : "bg-white/50"
                    )}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}
      
      {/* Post message */}
      {post.message && (
        <div className="px-4 py-3 border-b border-border/40">
          <p className="text-sm">{post.message}</p>
        </div>
      )}
      
      {/* Workout or Exercise content */}
      <div className="border-b border-border/40">
        {post.contentType === "workout" && post.workoutData && (
          <WorkoutCard 
            workout={post.workoutData} 
            isExpanded={isExpanded}
            onToggleExpanded={toggleExpand}
            isReadOnly={true}
          />
        )}
        
        {post.contentType === "exercise" && post.exerciseData && (
          <div className="px-0">
            <ExerciseItem 
              exercise={post.exerciseData} 
              workoutId={post.id} // Using post ID as workout ID for context
            />
          </div>
        )}
      </div>
      
      {/* Like counter and actions */}
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <span className="text-sm text-muted-foreground mr-2">
            {likeCount} {likeCount === 1 ? "like" : "likes"}
          </span>
          
          <button 
            className={cn(
              "inline-flex items-center justify-center gap-1.5 text-sm py-1.5 px-3 rounded-full transition-colors mr-2",
              isLiked 
                ? "bg-primary/10 text-primary font-medium" 
                : "text-muted-foreground hover:bg-primary/5"
            )}
            onClick={handleLikeToggle}
            aria-label={isLiked ? "Unlike post" : "Like post"}
          >
            <Heart 
              className={cn(
                "h-4 w-4 transition-transform", 
                isLiked && "fill-primary text-primary scale-110"
              )} 
            />
            {isLiked ? "Liked" : "Like"}
          </button>
        </div>
        
        {/* Actions dropdown menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full"
            >
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">More options</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {post.contentType === "workout" && post.workoutData && (
              <DropdownMenuItem onClick={handleTryWorkout}>
                <Copy className="h-4 w-4 mr-2" />
                <span>Try Workout</span>
              </DropdownMenuItem>
            )}
            
            <DropdownMenuItem onClick={handleBookmarkToggle}>
              <Bookmark className={cn(
                "h-4 w-4 mr-2",
                isBookmarked && "fill-foreground"
              )} />
              <span>{isBookmarked ? "Remove Bookmark" : "Bookmark"}</span>
            </DropdownMenuItem>
            
            <DropdownMenuItem onClick={handleReportPost}>
              <Flag className="h-4 w-4 mr-2" />
              <span>Report</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default PostItem;
