
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Home, Filter, PlusCircle, BarChart, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const BottomNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = (path: string) => location.pathname === path;
  
  const scrollToTop = () => {
    if (isActive("/")) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      navigate("/");
    }
  };
  
  const handleFilterClick = () => {
    // Placeholder for future functionality
    console.log("Filter functionality coming soon");
  };
  
  const handleDataClick = () => {
    // Placeholder for future functionality
    console.log("Data view functionality coming soon");
  };
  
  const handleSettingsClick = () => {
    // Placeholder for future functionality
    console.log("Settings functionality coming soon");
  };
  
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-sm border-t border-border/50 h-16">
      <div className="max-w-xl mx-auto h-full flex items-center justify-around">
        <button 
          className={cn(
            "flex flex-col items-center justify-center h-full w-16 transition-colors",
            isActive("/") ? "text-primary" : "text-muted-foreground"
          )}
          onClick={scrollToTop}
        >
          <Home className="h-5 w-5 mb-1" />
          <span className="text-xs">Home</span>
        </button>
        
        <button 
          className="flex flex-col items-center justify-center h-full w-16 text-muted-foreground"
          onClick={handleFilterClick}
        >
          <Filter className="h-5 w-5 mb-1" />
          <span className="text-xs">Filter</span>
        </button>
        
        <button 
          className="flex flex-col items-center justify-center h-full w-16 bg-primary text-primary-foreground rounded-full -mt-6 shadow-lg"
          onClick={() => navigate("/add-workout")}
        >
          <PlusCircle className="h-6 w-6 mb-1" />
          <span className="text-xs">Add</span>
        </button>
        
        <button 
          className="flex flex-col items-center justify-center h-full w-16 text-muted-foreground"
          onClick={handleDataClick}
        >
          <BarChart className="h-5 w-5 mb-1" />
          <span className="text-xs">Data</span>
        </button>
        
        <button 
          className="flex flex-col items-center justify-center h-full w-16 text-muted-foreground"
          onClick={handleSettingsClick}
        >
          <Settings className="h-5 w-5 mb-1" />
          <span className="text-xs">Settings</span>
        </button>
      </div>
    </div>
  );
};

export default BottomNavigation;
