
import React, { useEffect, useState } from 'react';
import { Check, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCategories } from '@/hooks/useExerciseData';
import { WorkoutCategory } from '@/lib/mockData';

interface CategorySelectorProps {
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({ selectedCategory, onCategorySelect }) => {
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const { categories, loading, createCategory, updateCategory } = useCategories();
  
  const handleAddCategory = () => {
    if (newCategory.trim()) {
      createCategory({ name: newCategory.trim(), color: '#808080', icon: null });
      onCategorySelect(newCategory.trim());
      setNewCategory('');
      setShowNewCategoryInput(false);
    }
  };
  
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {!loading && categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            className="rounded-full"
            onClick={() => onCategorySelect(category)}
          >
            {category}
            {selectedCategory === category && <Check className="ml-1 h-4 w-4" />}
          </Button>
        ))}
        
        {!showNewCategoryInput && (
          <Button
            variant="outline"
            size="sm"
            className="rounded-full"
            onClick={() => setShowNewCategoryInput(true)}
          >
            <Plus className="mr-1 h-4 w-4" />
            New Category
          </Button>
        )}
      </div>
      
      {showNewCategoryInput && (
        <div className="flex gap-2 items-center">
          <Input
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="Category name"
            className="flex-1"
            autoFocus
          />
          <Button size="sm" onClick={handleAddCategory} disabled={!newCategory.trim()}>
            <Check className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setShowNewCategoryInput(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default CategorySelector;
