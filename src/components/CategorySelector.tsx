
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
import { addCategory, updateCategory, getCategoryInfo } from "@/lib/mockData";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import * as LucideIcons from "lucide-react";

interface CategorySelectorProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

// Available category icons (subset of Lucide icons that actually exist)
const CATEGORY_ICONS = [
  { name: "Dumbbell", icon: LucideIcons.Dumbbell },
  { name: "Activity", icon: LucideIcons.Activity },
  { name: "Heart", icon: LucideIcons.Heart },
  { name: "Flame", icon: LucideIcons.Flame },
  { name: "Bike", icon: LucideIcons.Bike },
  { name: "Trophy", icon: LucideIcons.Trophy },
  { name: "Footprints", icon: LucideIcons.Footprints },
  { name: "Waves", icon: LucideIcons.Waves },
  { name: "Mountain", icon: LucideIcons.Mountain },
  { name: "Leaf", icon: LucideIcons.Leaf },
];

const CATEGORY_COLORS = [
  "#ea384c", // Red
  "#f97315", // Orange
  "#eab308", // Yellow
  "#10B981", // Green
  "#0EA5E9", // Blue
  "#6366f1", // Indigo
  "#8B5CF6", // Violet
  "#EC4899", // Pink
  "#475569", // Slate
  "#9b87f5", // Purple
];

const CategorySelector: React.FC<CategorySelectorProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editCategoryName, setEditCategoryName] = useState("");
  const [selectedColor, setSelectedColor] = useState(CATEGORY_COLORS[0]);
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
  const [categoryToEdit, setCategoryToEdit] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      addCategory(newCategoryName.trim(), selectedColor, selectedIcon);
      toast.success(`Category "${newCategoryName}" created!`);
      setNewCategoryName("");
      setSelectedColor(CATEGORY_COLORS[0]);
      setSelectedIcon(null);
      setOpen(false);
    }
  };

  const handleUpdateCategory = () => {
    if (categoryToEdit && editCategoryName.trim()) {
      updateCategory(categoryToEdit, editCategoryName.trim(), selectedColor, selectedIcon);
      toast.success(`Category updated!`);
      setCategoryToEdit(null);
      setEditCategoryName("");
      setSelectedColor(CATEGORY_COLORS[0]);
      setSelectedIcon(null);
      setOpen(false);
    }
  };

  const startEditCategory = (category: string) => {
    const categoryInfo = getCategoryInfo(category);
    setCategoryToEdit(category);
    setEditCategoryName(category);
    setSelectedColor(categoryInfo.color);
    setSelectedIcon(categoryInfo.icon);
    setOpen(true);
  };

  // Function to get contrasting text color
  const getContrastColor = (hexColor: string) => {
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? "#000000" : "#FFFFFF";
  };

  // Function to get border color with opacity
  const getBorderColor = (hexColor: string) => {
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    
    const darkerR = Math.max(0, r - 30);
    const darkerG = Math.max(0, g - 30);
    const darkerB = Math.max(0, b - 30);
    
    return `rgba(${darkerR}, ${darkerG}, ${darkerB}, 0.4)`;
  };

  // Render category icon
  const renderCategoryIcon = (category: string) => {
    const info = getCategoryInfo(category);
    if (!info.icon) return null;
    
    const IconComponent = (LucideIcons as any)[info.icon];
    if (!IconComponent) return null;
    
    return (
      <IconComponent
        size={14}
        color={getContrastColor(info.color)}
        className="mr-1"
      />
    );
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-medium">Category</label>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="h-7">
              <Plus className="h-3.5 w-3.5 mr-1" />
              Add
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {categoryToEdit ? "Edit Category" : "Add Category"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-2">
              <div>
                <label className="text-sm font-medium">Name</label>
                <Input
                  value={categoryToEdit ? editCategoryName : newCategoryName}
                  onChange={(e) =>
                    categoryToEdit
                      ? setEditCategoryName(e.target.value)
                      : setNewCategoryName(e.target.value)
                  }
                  placeholder="Category name"
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-medium block mb-2">Color</label>
                <div className="grid grid-cols-5 gap-2">
                  {CATEGORY_COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className={cn(
                        "h-8 w-8 rounded-full flex items-center justify-center transition-all",
                        selectedColor === color
                          ? "ring-2 ring-offset-2 ring-primary"
                          : ""
                      )}
                      style={{ backgroundColor: color }}
                      onClick={() => setSelectedColor(color)}
                    >
                      {selectedColor === color && (
                        <Check className="h-4 w-4 text-white" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium block mb-2">Icon (Optional)</label>
                <div className="grid grid-cols-5 gap-2">
                  {CATEGORY_ICONS.map(({ name, icon: Icon }) => (
                    <button
                      key={name}
                      type="button"
                      className={cn(
                        "h-10 w-10 rounded-lg flex items-center justify-center border transition-all",
                        selectedIcon === name
                          ? "ring-2 ring-primary bg-primary/10"
                          : "bg-muted hover:bg-muted/80"
                      )}
                      onClick={() => setSelectedIcon(name)}
                    >
                      <Icon className="h-5 w-5" />
                    </button>
                  ))}
                  <button
                    type="button"
                    className={cn(
                      "h-10 w-10 rounded-lg flex items-center justify-center border transition-all",
                      selectedIcon === null
                        ? "ring-2 ring-primary bg-primary/10"
                        : "bg-muted hover:bg-muted/80"
                    )}
                    onClick={() => setSelectedIcon(null)}
                  >
                    <div className="h-5 w-5 flex items-center justify-center">×</div>
                  </button>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button
                  type="button"
                  onClick={categoryToEdit ? handleUpdateCategory : handleAddCategory}
                >
                  {categoryToEdit ? "Update" : "Add"} Category
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-wrap gap-2">
        {categories.map((category) => {
          const info = getCategoryInfo(category);
          const isSelected = category === selectedCategory;
          const opacity = isSelected ? 1 : 0.7;
          
          return (
            <div key={category} className="inline-flex items-center">
              <Badge
                variant="outline"
                className={cn(
                  "rounded-full py-1 px-3 cursor-pointer gap-1.5 transition-all",
                  isSelected ? "ring-1 ring-offset-1" : "opacity-75"
                )}
                style={{
                  backgroundColor: `${info.color}${isSelected ? "" : "85"}`,
                  color: getContrastColor(info.color),
                  borderColor: getBorderColor(info.color),
                  borderWidth: "1.5px"
                }}
                onClick={() => onSelectCategory(category)}
              >
                {renderCategoryIcon(category)}
                {category}
              </Badge>
              <button
                title="Edit category"
                className="ml-1 text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => startEditCategory(category)}
              >
                <Edit className="h-3 w-3" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CategorySelector;
