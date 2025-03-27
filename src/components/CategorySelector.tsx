
import React, { useState, useRef } from "react";
import { Tag, Edit, Plus, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { getCategoryInfo, getAllCategories, createCategory, updateCategory } from "@/lib/mockData";
import * as LucideIcons from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CategorySelectorProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  onCreateCategory?: (categoryName: string) => void;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  onCreateCategory
}) => {
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null);
  const [touchedCategory, setTouchedCategory] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryColor, setNewCategoryColor] = useState("#9B59B6"); // Default color
  const [newCategoryIcon, setNewCategoryIcon] = useState<string | null>("Tag");
  const [editCategoryName, setEditCategoryName] = useState("");
  const [editCategoryColor, setEditCategoryColor] = useState("");
  const [editCategoryIcon, setEditCategoryIcon] = useState<string | null>(null);
  const [currentEditCategory, setCurrentEditCategory] = useState("");
  
  // Predefined colors
  const colorOptions = [
    "#FF5733", // Red
    "#3498DB", // Blue
    "#2ECC71", // Green
    "#F1C40F", // Yellow
    "#9B59B6", // Purple
    "#E74C3C", // Crimson
    "#1ABC9C", // Teal
    "#D35400", // Orange
    "#34495E", // Navy
    "#16A085", // Sea Green
    "#8E44AD", // Violet
    "#2980B9", // Royal Blue
    "#27AE60", // Emerald
    "#F39C12", // Amber
    "#E67E22", // Carrot
  ];
  
  // Function to handle mouse/touch down event
  const handleTouchStart = (category: string) => {
    setTouchedCategory(category);
    const timer = setTimeout(() => {
      handleEditCategory(category);
    }, 500); // 500ms for long press
    setLongPressTimer(timer);
  };
  
  // Function to handle mouse/touch up event
  const handleTouchEnd = (category: string) => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
    
    // Only trigger selection if it's the same category that started the touch
    if (touchedCategory === category) {
      onSelectCategory(category);
    }
    
    setTouchedCategory(null);
  };
  
  // Handle touch move out
  const handleTouchMove = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
    setTouchedCategory(null);
  };
  
  // Function to determine contrasting text color based on background
  const getContrastColor = (hexColor: string) => {
    // Convert hex to RGB
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    
    // Calculate relative luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    
    // Return black for bright colors, white for dark
    return luminance > 0.5 ? "#000000" : "#FFFFFF";
  };
  
  // Render icon by name if it exists
  const renderCategoryIcon = (iconName: string | null, color: string) => {
    if (!iconName) return null;
    
    // Get icon component by name
    const IconComponent = (LucideIcons as any)[iconName];
    if (!IconComponent) return null;
    
    return <IconComponent size={14} color={color} className="mr-1" />;
  };
  
  // Handle creating a new category
  const handleCreateCategory = () => {
    if (newCategoryName.trim()) {
      // Create the category in our mock data
      createCategory({
        name: newCategoryName.trim(),
        color: newCategoryColor,
        icon: newCategoryIcon
      });
      
      // If there's a callback, call it
      if (onCreateCategory) {
        onCreateCategory(newCategoryName.trim());
      }
      
      // Reset state and close dialog
      setNewCategoryName("");
      setNewCategoryColor("#9B59B6");
      setNewCategoryIcon("Tag");
      setIsCreateDialogOpen(false);
    }
  };
  
  // Handle editing a category
  const handleEditCategory = (category: string) => {
    setCurrentEditCategory(category);
    const categoryInfo = getCategoryInfo(category);
    setEditCategoryName(category);
    setEditCategoryColor(categoryInfo.color);
    setEditCategoryIcon(categoryInfo.icon);
    setIsEditDialogOpen(true);
  };
  
  // Handle saving edited category
  const handleSaveEditedCategory = () => {
    if (editCategoryName.trim()) {
      updateCategory(currentEditCategory, {
        name: editCategoryName.trim(),
        color: editCategoryColor,
        icon: editCategoryIcon
      });
      
      // Update selected category if it was the one being edited
      if (selectedCategory === currentEditCategory) {
        onSelectCategory(editCategoryName.trim());
      }
      
      setIsEditDialogOpen(false);
    }
  };
  
  // Filter available icons to a reasonable subset
  const availableIcons = [
    "Activity", "Award", "Book", "Bookmark", "Calendar", "Clock", "Compass", 
    "Dumbbell", "Flame", "Heart", "Home", "Map", "MapPin", "Monitor", 
    "Moon", "Mountain", "Music", "Pencil", "Phone", "Settings", "ShoppingBag", 
    "Star", "Sun", "Tag", "Target", "Umbrella", "User", "Users", 
    "Zap", "Yoga", "Utensils", "Truck", "Trophy", "ThumbsUp", "Thermometer"
  ];
  
  return (
    <div>
      <div className="flex items-center justify-between text-sm font-medium mb-2">
        <div className="flex items-center">
          <Tag className="h-4 w-4 mr-2" />
          <span>Category</span>
        </div>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-6 w-6 p-0 rounded-full"
          onClick={() => setIsCreateDialogOpen(true)}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => {
          const isSelected = category === selectedCategory;
          const categoryInfo = getCategoryInfo(category);
          const textColor = getContrastColor(categoryInfo.color);
          
          return (
            <div
              key={category}
              className={cn(
                "px-3 py-1.5 rounded-full cursor-pointer flex items-center transition-all",
                isSelected ? "ring-2 ring-primary" : "hover:ring-1 hover:ring-border"
              )}
              style={{ 
                backgroundColor: categoryInfo.color,
                color: textColor,
              }}
              onMouseDown={() => handleTouchStart(category)}
              onMouseUp={() => handleTouchEnd(category)}
              onMouseLeave={handleTouchMove}
              onTouchStart={() => handleTouchStart(category)}
              onTouchEnd={() => handleTouchEnd(category)}
              onTouchMove={handleTouchMove}
              onContextMenu={(e) => {
                e.preventDefault();
                handleEditCategory(category);
              }}
              onDoubleClick={() => handleEditCategory(category)}
            >
              {categoryInfo.icon && renderCategoryIcon(categoryInfo.icon, textColor)}
              <span>{category}</span>
            </div>
          );
        })}
      </div>
      
      {/* Create Category Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Category</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="col-span-3"
                placeholder="Category name"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Color</Label>
              <div className="col-span-3 flex flex-wrap gap-2">
                {colorOptions.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setNewCategoryColor(color)}
                    className={cn(
                      "w-8 h-8 rounded-full transition-all",
                      newCategoryColor === color ? "ring-2 ring-primary ring-offset-2" : ""
                    )}
                    style={{ backgroundColor: color }}
                    aria-label={`Select color ${color}`}
                  >
                    {newCategoryColor === color && (
                      <Check 
                        className="h-4 w-4 mx-auto" 
                        color={getContrastColor(color)} 
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right pt-2">Icon</Label>
              <div className="col-span-3">
                <Tabs defaultValue="all">
                  <TabsList className="mb-2">
                    <TabsTrigger value="all">All Icons</TabsTrigger>
                    <TabsTrigger value="selected">Selected</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="all">
                    <ScrollArea className="h-[200px]">
                      <div className="flex flex-wrap gap-2">
                        {availableIcons.map((iconName) => {
                          const IconComponent = (LucideIcons as any)[iconName];
                          if (!IconComponent) return null;
                          
                          return (
                            <button
                              key={iconName}
                              type="button"
                              onClick={() => setNewCategoryIcon(iconName)}
                              className={cn(
                                "p-2 rounded-md transition-all",
                                newCategoryIcon === iconName 
                                  ? "bg-primary text-primary-foreground" 
                                  : "bg-muted hover:bg-muted/80"
                              )}
                              aria-label={`Select icon ${iconName}`}
                            >
                              <IconComponent className="h-5 w-5" />
                            </button>
                          );
                        })}
                      </div>
                    </ScrollArea>
                  </TabsContent>
                  
                  <TabsContent value="selected">
                    <div className="p-4 flex justify-center items-center h-[200px] border rounded-md">
                      {newCategoryIcon ? (
                        <div className="flex flex-col items-center gap-2">
                          {renderCategoryIcon(newCategoryIcon, "#000000")}
                          <span className="text-sm">{newCategoryIcon}</span>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => setNewCategoryIcon(null)}
                          >
                            <X className="h-4 w-4 mr-2" />
                            Remove
                          </Button>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">No icon selected</span>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateCategory}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Category Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-name" className="text-right">
                Name
              </Label>
              <Input
                id="edit-name"
                value={editCategoryName}
                onChange={(e) => setEditCategoryName(e.target.value)}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Color</Label>
              <div className="col-span-3 flex flex-wrap gap-2">
                {colorOptions.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setEditCategoryColor(color)}
                    className={cn(
                      "w-8 h-8 rounded-full transition-all",
                      editCategoryColor === color ? "ring-2 ring-primary ring-offset-2" : ""
                    )}
                    style={{ backgroundColor: color }}
                    aria-label={`Select color ${color}`}
                  >
                    {editCategoryColor === color && (
                      <Check 
                        className="h-4 w-4 mx-auto" 
                        color={getContrastColor(color)} 
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right pt-2">Icon</Label>
              <div className="col-span-3">
                <Tabs defaultValue="all">
                  <TabsList className="mb-2">
                    <TabsTrigger value="all">All Icons</TabsTrigger>
                    <TabsTrigger value="selected">Selected</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="all">
                    <ScrollArea className="h-[200px]">
                      <div className="flex flex-wrap gap-2">
                        {availableIcons.map((iconName) => {
                          const IconComponent = (LucideIcons as any)[iconName];
                          if (!IconComponent) return null;
                          
                          return (
                            <button
                              key={iconName}
                              type="button"
                              onClick={() => setEditCategoryIcon(iconName)}
                              className={cn(
                                "p-2 rounded-md transition-all",
                                editCategoryIcon === iconName 
                                  ? "bg-primary text-primary-foreground" 
                                  : "bg-muted hover:bg-muted/80"
                              )}
                              aria-label={`Select icon ${iconName}`}
                            >
                              <IconComponent className="h-5 w-5" />
                            </button>
                          );
                        })}
                      </div>
                    </ScrollArea>
                  </TabsContent>
                  
                  <TabsContent value="selected">
                    <div className="p-4 flex justify-center items-center h-[200px] border rounded-md">
                      {editCategoryIcon ? (
                        <div className="flex flex-col items-center gap-2">
                          {renderCategoryIcon(editCategoryIcon, "#000000")}
                          <span className="text-sm">{editCategoryIcon}</span>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => setEditCategoryIcon(null)}
                          >
                            <X className="h-4 w-4 mr-2" />
                            Remove
                          </Button>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">No icon selected</span>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEditedCategory}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CategorySelector;
