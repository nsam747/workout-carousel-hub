
import React, { useState } from "react";
import { Post, toggleLike, currentUser, isLikedByUser } from "@/lib/feedsData";
import WorkoutCard from "@/components/WorkoutCard";
import ExerciseItem from "@/components/ExerciseItem";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface PostItemProps {
  post: Post;
}

const PostItem: React.FC<PostItemProps> = ({ post }) => {
  const [isLiked, setIsLiked] = useState<boolean>(
    isLikedByUser(post.id, currentUser.id)
  );
  const [likeCount, setLikeCount] = useState<number>(post.likes);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

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
        <div>
          <span 
            className="inline-flex items-center justify-center text-xs py-1 px-2.5 rounded-full bg-primary/10 text-primary"
          >
            {post.tag}
          </span>
        </div>
      </div>
      
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
            // We don't want to allow deletion in the feed
            onDelete={undefined}
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
      
      {/* Like counter and button */}
      <div className="px-4 py-3 flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          {likeCount} {likeCount === 1 ? "like" : "likes"}
        </span>
        <button 
          className={cn(
            "inline-flex items-center justify-center gap-1.5 text-sm py-1.5 px-3 rounded-full transition-colors",
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
    </div>
  );
};

export default PostItem;
