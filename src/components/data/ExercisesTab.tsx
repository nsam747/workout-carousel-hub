
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, PlusCircle } from 'lucide-react';
import { getAllCategories, getSavedExercises, Exercise } from '@/lib/mockData';
import ExercisesList from './ExercisesList';

const ExercisesTab = () => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchData = () => {
      const fetchedExercises = getSavedExercises();
      setExercises(fetchedExercises);
      
      const allCategories = getAllCategories();
      setCategories(['All', ...allCategories]);
    };
    
    fetchData();
  }, []);
  
  const filteredExercises = exercises.filter(exercise => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || exercise.type === selectedCategory;
    return matchesSearch && matchesCategory;
  });
  
  return (
    <div>
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search exercises..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>
        
        <Button 
          className="w-full" 
          onClick={() => navigate('/add-exercise')}
          disabled
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Exercise
        </Button>
        
        <ExercisesList exercises={filteredExercises} />
      </div>
    </div>
  );
};

export default ExercisesTab;
