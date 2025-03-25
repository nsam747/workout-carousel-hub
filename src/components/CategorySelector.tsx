
import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { addCategory } from "@/lib/mockData";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface CategorySelectorProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  const [newCategory, setNewCategory] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const handleAddCategory = () => {
    if (!newCategory.trim()) {
      toast.error("Please enter a category name");
      return;
    }
    
    if (categories.includes(newCategory.trim())) {
      toast.error("This category already exists");
      return;
    }
    
    addCategory(newCategory.trim());
    toast.success(`Added category: ${newCategory}`);
    setNewCategory("");
    setIsDialogOpen(false);
  };
  
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Category:</span>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" className="h-7 px-2 text-xs gap-1">
              <Plus className="h-3 w-3" />
              New
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Category</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <Input
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Category name"
              />
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddCategory}>
                  Add Category
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Badge
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            className={cn(
              "cursor-pointer transition-all",
              selectedCategory === category ? "bg-primary" : "hover:bg-secondary"
            )}
            onClick={() => onSelectCategory(category)}
          >
            {category}
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default CategorySelector;
