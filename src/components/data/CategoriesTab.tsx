
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { categoryInfo, CategoryInfo } from '@/lib/mockData';

const CategoriesTab = () => {
  const [categories, setCategories] = useState<CategoryInfo[]>([]);
  
  useEffect(() => {
    setCategories([...categoryInfo]);
  }, []);
  
  return (
    <div className="space-y-4">
      <Button className="w-full" disabled>
        <PlusCircle className="mr-2 h-4 w-4" />
        Add New Category
      </Button>
      
      <div className="space-y-2 mt-4">
        {categories.map(category => (
          <Card key={category.name} className="p-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div 
                className="w-4 h-4 rounded-full" 
                style={{ backgroundColor: category.color }}
              />
              <span className="font-medium">{category.name}</span>
            </div>
            <Button variant="outline" size="sm" disabled>Edit</Button>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CategoriesTab;
