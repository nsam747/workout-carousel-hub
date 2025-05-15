
import React, { useState } from "react";
import { Post, toggleLike, currentUser, isLikedByUser, toggleFollow, isFollowingUser, reportPost } from "@/lib/feedsData";
import WorkoutCard from "@/components/WorkoutCard";
import ExerciseItem from "@/components/ExerciseItem";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { Heart, Flag, MoreHorizontal, UserPlus, Check, UserMinus } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface PostItemProps {
  post: Post;
}

const PostItem: React.FC<PostItemProps> = ({ post }) => {
  const [isLiked, setIsLiked] = useState<boolean>(
    isLikedByUser(post.id, currentUser.id)
  );
  const [isFollowing, setIsFollowing] = useState<boolean>(
    isFollowingUser(post.user.id, currentUser.id)
  );
  const [likeCount, setLikeCount] = useState<number>(post.likes);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [showReportDialog, setShowReportDialog] = useState<boolean>(false);
  const [reportReason, setReportReason] = useState<string>("");

  // Determine if post has media to display
  const hasMedia = (post.contentType === "exercise" && post.exerciseData?.media?.length) || 
                   (post.contentType === "workout" && post.workoutData?.exercises[0]?.media?.length);
  
  // Get the first media item path
  const mediaPath = post.contentType === "exercise" 
    ? post.exerciseData?.media?.[0] 
    : post.workoutData?.exercises[0]?.media?.[0];

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

  const handleFollowToggle = () => {
    toggleFollow(post.user.id, currentUser.id);
    
    if (isFollowing) {
      setIsFollowing(false);
      toast("Unfollowed " + post.user.name);
    } else {
      setIsFollowing(true);
      toast.success("Now following " + post.user.name);
    }
  };

  const handleReport = () => {
    setShowReportDialog(true);
  };

  const submitReport = () => {
    reportPost(post.id, currentUser.id, reportReason);
    setShowReportDialog(false);
    setReportReason("");
    toast.success("Report submitted. Thank you for keeping our community safe.");
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

  // Determine if this is a popular post (high engagement)
  const isPopularPost = likeCount > 25;

  return (
    <div className={cn(
      "mb-6 bg-background border rounded-xl overflow-hidden glass-card animate-scale-in",
      isPopularPost ? "border-primary/30" : "border-border",
      hasMedia ? "card-with-media" : ""
    )}>
      {/* Media display at the top if available */}
      {hasMedia && mediaPath && (
        <div className="media-container w-full overflow-hidden">
          <AspectRatio ratio={16/9} className="bg-secondary/30">
            <img 
              src={mediaPath} 
              alt="Exercise demonstration" 
              className="w-full h-full object-cover transition-transform hover:scale-105 duration-700"
              loading="lazy"
            />
          </AspectRatio>
        </div>
      )}
      
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
          {/* Follow button */}
          {post.user.id !== currentUser.id && (
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "rounded-full h-8 px-2", 
                isFollowing ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
              onClick={handleFollowToggle}
            >
              {isFollowing ? (
                <>
                  <UserMinus className="h-4 w-4 mr-1" />
                  <span className="text-xs">Following</span>
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4 mr-1" />
                  <span className="text-xs">Follow</span>
                </>
              )}
            </Button>
          )}
          
          {/* Category tag */}
          <span 
            className={cn(
              "inline-flex items-center justify-center text-xs py-1 px-2.5 rounded-full",
              {
                "bg-primary/10 text-primary": post.tag === "Calisthenics",
                "bg-purple-500/10 text-purple-500": post.tag === "Aerials",
                "bg-green-500/10 text-green-500": post.tag === "Yoga",
                "bg-blue-500/10 text-blue-500": post.tag === "Gym",
                "bg-pink-500/10 text-pink-500": post.tag === "Dance",
                "bg-orange-500/10 text-orange-500": post.tag === "Other"
              }
            )}
          >
            {post.tag}
          </span>
          
          {/* Report menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 rounded-full hover:bg-muted"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onClick={handleReport}>
                <Flag className="h-4 w-4 mr-2" />
                <span>Report</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
            // Only show delete/edit if it's the current user's post
            isReadOnly={post.user.id !== currentUser.id}
            // We don't want to allow deletion in the feed
            onDelete={undefined}
            onTryWorkout={() => {
              // This will be implemented in the WorkoutCard component
              toast.success(`Added "${post.workoutData.title}" to your workouts!`);
            }}
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

      {/* Report dialog */}
      <Dialog open={showReportDialog} onOpenChange={setShowReportDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Report Content</DialogTitle>
            <DialogDescription>
              Please let us know why you're reporting this post.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
            >
              <option value="" disabled>Select a reason</option>
              <option value="inappropriate">Inappropriate content</option>
              <option value="spam">Spam</option>
              <option value="harmful">Harmful or dangerous</option>
              <option value="other">Other</option>
            </select>
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setShowReportDialog(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={submitReport} disabled={!reportReason}>
              Submit Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PostItem;
