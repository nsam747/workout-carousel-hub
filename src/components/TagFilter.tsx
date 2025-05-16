
import React from "react";
import { cn } from "@/lib/utils";
import { PostTag } from "@/lib/feedsData";

interface TagFilterProps {
  selectedTag: PostTag | "All";
  onSelectTag: (tag: PostTag | "All") => void;
}

const TagFilter: React.FC<TagFilterProps> = ({ selectedTag, onSelectTag }) => {
  // All available tags plus "All" option
  const tags: (PostTag | "All")[] = ["All", "Strength", "Cardio", "Flexibility", "Core", "Recovery", "HIIT", "Balance"];
  
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4">
      {tags.map(tag => (
        <button
          key={tag}
          onClick={() => onSelectTag(tag)}
          className={cn(
            "whitespace-nowrap py-1.5 px-3 rounded-full text-sm transition-colors",
            selectedTag === tag
              ? "bg-primary text-primary-foreground font-medium"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          )}
        >
          {tag}
        </button>
      ))}
    </div>
  );
};

export default TagFilter;
