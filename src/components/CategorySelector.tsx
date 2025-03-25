
import React, { useState } from "react";
import { Plus, Edit, Check, Icons } from "lucide-react";
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
import { addCategory, updateCategory, getCategoryInfo } from "@/lib/mockData";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Icon } from "lucide-react";
import * as LucideIcons from "lucide-react";

interface CategorySelectorProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

// Available category icons (subset of Lucide icons)
const CATEGORY_ICONS = [
  { name: "Dumbbell", icon: LucideIcons.Dumbbell },
  { name: "Running", icon: LucideIcons.Running },
  { name: "Smile", icon: LucideIcons.Smile },
  { name: "Heart", icon: LucideIcons.Heart },
  { name: "Flame", icon: LucideIcons.Flame },
  { name: "Bike", icon: LucideIcons.Bike },
  { name: "Trophy", icon: LucideIcons.Trophy },
  { name: "Timer", icon: LucideIcons.Timer },
  { name: "Yoga", icon: LucideIcons.Yoga },
  { name: "Stretching", icon: LucideIcons.Stretch },
  { name: "Activity", icon: LucideIcons.Activity },
  { name: "Mountain", icon: LucideIcons.Mountain },
  { name: "Waves", icon: LucideIcons.Waves },
];

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

const CategorySelector: React.FC<CategorySelectorProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  const [newCategory, setNewCategory] = useState("");
  const [editingCategory, setEditingCategory] = useState("");
  const [selectedColor, setSelectedColor] = useState(CATEGORY_COLORS[0]);
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
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

  // Function to get a complementary border color with opacity
  const getBorderColor = (hexColor: string) => {
    // Convert hex to RGB
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    
    // Adjust brightness slightly for border
    const darkerR = Math.max(0, r - 30);
    const darkerG = Math.max(0, g - 30);
    const darkerB = Math.max(0, b - 30);
    
    // Return with 40% opacity
    return `rgba(${darkerR}, ${darkerG}, ${darkerB}, 0.4)`;
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
    setSelectedIcon(null);
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
    setSelectedIcon(categoryInfo.icon || null);
    setIsEditDialogOpen(true);
  };
  
  // Render an icon component by name
  const renderIcon = (iconName: string | null, color: string) => {
    if (!iconName) return null;
    
    const IconComponent = CATEGORY_ICONS.find(i => i.name === iconName)?.icon;
    if (!IconComponent) return null;
    
    return <IconComponent size={14} color={color} />;
  };
  
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
                <div>
                  <label className="text-sm font-medium mb-2 block">Select Icon (Optional)</label>
                  <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
                    <div
                      className={cn(
                        "w-8 h-8 rounded-md flex items-center justify-center cursor-pointer transition-all border-2",
                        selectedIcon === null ? "border-black" : "border-border"
                      )}
                      onClick={() => setSelectedIcon(null)}
                    >
                      <span className="text-xs">None</span>
                    </div>
                    {CATEGORY_ICONS.map((iconObj) => (
                      <div
                        key={iconObj.name}
                        className={cn(
                          "w-8 h-8 rounded-md flex items-center justify-center cursor-pointer transition-all border-2",
                          selectedIcon === iconObj.name ? "border-black bg-secondary" : "border-border"
                        )}
                        onClick={() => setSelectedIcon(iconObj.name)}
                      >
                        <iconObj.icon size={16} />
                      </div>
                    ))}
                  </div>
                </div>
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
            <div>
              <label className="text-sm font-medium mb-2 block">Select Icon (Optional)</label>
              <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
                <div
                  className={cn(
                    "w-8 h-8 rounded-md flex items-center justify-center cursor-pointer transition-all border-2",
                    selectedIcon === null ? "border-black" : "border-border"
                  )}
                  onClick={() => setSelectedIcon(null)}
                >
                  <span className="text-xs">None</span>
                </div>
                {CATEGORY_ICONS.map((iconObj) => (
                  <div
                    key={iconObj.name}
                    className={cn(
                      "w-8 h-8 rounded-md flex items-center justify-center cursor-pointer transition-all border-2",
                      selectedIcon === iconObj.name ? "border-black bg-secondary" : "border-border"
                    )}
                    onClick={() => setSelectedIcon(iconObj.name)}
                  >
                    <iconObj.icon size={16} />
                  </div>
                ))}
              </div>
            </div>
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
          const isSelected = selectedCategory === category;
          const textColor = getContrastColor(categoryInfo.color);
          const borderColor = getBorderColor(categoryInfo.color);
          
          return (
            <Badge
              key={category}
              variant={isSelected ? "default" : "outline"}
              className={cn(
                "cursor-pointer transition-all gap-1",
                isSelected ? "bg-primary" : ""
              )}
              onClick={() => onSelectCategory(category)}
              style={
                selectedCategory !== category
                  ? {
                      backgroundColor: `${categoryInfo.color}${isSelected ? "" : "CC"}`, // CC = 80% opacity
                      color: textColor,
                      borderColor: borderColor,
                      borderWidth: "1.5px"
                    }
                  : {}
              }
            >
              {categoryInfo.icon && renderIcon(categoryInfo.icon, isSelected ? "#fff" : textColor)}
              {category}
            </Badge>
          );
        })}
      </div>
    </div>
  );
};

export default CategorySelector;
