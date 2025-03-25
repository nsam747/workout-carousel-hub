
import React, { useState } from "react";
import { Plus, Edit, Check } from "lucide-react";
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
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { addCategory, updateCategory, getCategoryInfo } from "@/lib/mockData";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import * as LucideIcons from "lucide-react";

interface CategorySelectorProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

const CATEGORY_COLORS = [
  "#9b87f5", // Primary Purple
  "#6E59A5", // Tertiary Purple
  "#E5DEFF", // Soft Purple
  "#8B5CF6", // Vivid Purple
  "#0EA5E9", // Ocean Blue
  "#33C3F0", // Sky Blue
  "#ea384c", // Red
  "#10B981", // Green
  "#F59E0B", // Amber
  "#6366F1", // Indigo
];

// Common icons that might be useful for workout categories
const COMMON_ICONS = [
  "activity",
  "dumbbell",
  "heart",
  "running",
  "stretching",
  "bike",
  "swimming",
  "tennis",
  "yoga",
  "barbell",
  "target",
  "globe",
  "mountain",
  "timer",
  "flame"
];

const CategorySelector: React.FC<CategorySelectorProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  const [newCategory, setNewCategory] = useState("");
  const [editingCategory, setEditingCategory] = useState("");
  const [selectedColor, setSelectedColor] = useState(CATEGORY_COLORS[0]);
  const [selectedIcon, setSelectedIcon] = useState<string | undefined>(undefined);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  // Function to determine contrasting text color (black or white) based on background
  const getContrastColor = (hexColor: string) => {
    // Convert hex to RGB
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    
    // Calculate relative luminance (perceived brightness)
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    
    // Return black for bright colors, white for dark colors
    return luminance > 0.5 ? "#000000" : "#FFFFFF";
  };

  // Get complementary border color (same hue but different opacity)
  const getBorderColor = (hexColor: string) => {
    // Convert hex to RGB
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    
    // Return the same color with 70% opacity for border
    return `rgba(${r}, ${g}, ${b}, 0.7)`;
  };
  
  const handleAddCategory = () => {
    if (!newCategory.trim()) {
      toast.error("Please enter a category name");
      return;
    }
    
    if (categories.includes(newCategory.trim())) {
      toast.error("This category already exists");
      return;
    }
    
    addCategory(newCategory.trim(), selectedColor, selectedIcon);
    toast.success(`Added category: ${newCategory}`);
    setNewCategory("");
    setSelectedIcon(undefined);
    setIsAddDialogOpen(false);
  };
  
  const handleEditCategory = () => {
    if (!editingCategory.trim()) {
      toast.error("Please enter a category name");
      return;
    }
    
    if (categories.includes(editingCategory.trim()) && editingCategory !== selectedCategory) {
      toast.error("This category name already exists");
      return;
    }
    
    updateCategory(selectedCategory, editingCategory, selectedColor, selectedIcon);
    toast.success(`Updated category: ${editingCategory}`);
    onSelectCategory(editingCategory);
    setIsEditDialogOpen(false);
  };
  
  const openEditDialog = () => {
    if (!selectedCategory) return;
    
    const categoryInfo = getCategoryInfo(selectedCategory);
    setEditingCategory(selectedCategory);
    setSelectedColor(categoryInfo.color);
    setSelectedIcon(categoryInfo.icon);
    setIsEditDialogOpen(true);
  };

  const renderIconSelector = (isEdit: boolean) => (
    <div>
      <label className="text-sm font-medium mb-2 block">Select Icon (Optional)</label>
      <div className="grid grid-cols-5 gap-2 max-h-48 overflow-y-auto p-1 border rounded-md">
        <div 
          key="none" 
          className={cn(
            "flex items-center justify-center w-10 h-10 rounded cursor-pointer transition-all border-2",
            !selectedIcon ? "border-black scale-110" : "border-transparent hover:border-gray-300"
          )}
          onClick={() => setSelectedIcon(undefined)}
        >
          <span className="text-xs text-gray-400">None</span>
        </div>
        {COMMON_ICONS.map((icon) => {
          const IconComponent = (LucideIcons as any)[icon];
          return (
            <div
              key={icon}
              className={cn(
                "flex items-center justify-center w-10 h-10 rounded cursor-pointer transition-all border-2",
                selectedIcon === icon ? "border-black scale-110" : "border-transparent hover:border-gray-300"
              )}
              onClick={() => setSelectedIcon(icon)}
              title={icon}
            >
              {IconComponent && <IconComponent className="h-5 w-5" />}
            </div>
          );
        })}
      </div>
    </div>
  );
  
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Category:</span>
        <div className="flex gap-2">
          {selectedCategory && (
            <Button variant="ghost" size="sm" className="h-7 px-2 text-xs gap-1" onClick={openEditDialog}>
              <Edit className="h-3 w-3" />
              Edit
            </Button>
          )}
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
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
                <div>
                  <label className="text-sm font-medium mb-2 block">Select Color</label>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORY_COLORS.map((color) => (
                      <div
                        key={color}
                        className={cn(
                          "w-8 h-8 rounded-full cursor-pointer transition-all border-2",
                          selectedColor === color ? "border-black scale-110" : "border-transparent"
                        )}
                        style={{ backgroundColor: color }}
                        onClick={() => setSelectedColor(color)}
                      >
                        {selectedColor === color && (
                          <Check 
                            className="h-4 w-4 mx-auto my-1" 
                            style={{ color: getContrastColor(color) }} 
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                
                {renderIconSelector(false)}
                
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
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
      </div>
      
      {/* Edit Category Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <Input
              value={editingCategory}
              onChange={(e) => setEditingCategory(e.target.value)}
              placeholder="Category name"
            />
            <div>
              <label className="text-sm font-medium mb-2 block">Select Color</label>
              <div className="flex flex-wrap gap-2">
                {CATEGORY_COLORS.map((color) => (
                  <div
                    key={color}
                    className={cn(
                      "w-8 h-8 rounded-full cursor-pointer transition-all border-2",
                      selectedColor === color ? "border-black scale-110" : "border-transparent"
                    )}
                    style={{ backgroundColor: color }}
                    onClick={() => setSelectedColor(color)}
                  >
                    {selectedColor === color && (
                      <Check 
                        className="h-4 w-4 mx-auto my-1" 
                        style={{ color: getContrastColor(color) }} 
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            {renderIconSelector(true)}
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditCategory}>
                Update Category
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => {
          const categoryInfo = getCategoryInfo(category);
          // Dynamically get icon component if it exists
          const CategoryIcon = categoryInfo.icon && (LucideIcons as any)[categoryInfo.icon] 
            ? (LucideIcons as any)[categoryInfo.icon] 
            : null;
          
          const isSelected = selectedCategory === category;
          const bgOpacity = isSelected ? 1 : 0.7; // More solid color for selected
          
          return (
            <Badge
              key={category}
              variant={isSelected ? "default" : "outline"}
              className={cn(
                "cursor-pointer transition-all flex items-center gap-1 border-2",
                isSelected ? "bg-primary scale-105" : ""
              )}
              onClick={() => onSelectCategory(category)}
              style={
                !isSelected && categoryInfo
                  ? {
                      backgroundColor: `${categoryInfo.color}${bgOpacity < 1 ? Math.round(bgOpacity * 255).toString(16) : ''}`,
                      color: getContrastColor(categoryInfo.color),
                      borderColor: getBorderColor(categoryInfo.color)
                    }
                  : {}
              }
            >
              {CategoryIcon && <CategoryIcon className="h-3.5 w-3.5" />}
              {category}
            </Badge>
          );
        })}
      </div>
    </div>
  );
};

export default CategorySelector;
