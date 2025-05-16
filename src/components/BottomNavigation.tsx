
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Home, PlusCircle, BarChart, Settings, Users, User } from "lucide-react";
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
  
  const handleFeedsClick = () => {
    navigate("/feeds");
  };
  
  const handleDataClick = () => {
    navigate("/data");
  };
  
  const handleProfileClick = () => {
    navigate("/profile");
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
          className={cn(
            "flex flex-col items-center justify-center h-full w-16 transition-colors",
            isActive("/feeds") ? "text-primary" : "text-muted-foreground"
          )}
          onClick={handleFeedsClick}
        >
          <Users className="h-5 w-5 mb-1" />
          <span className="text-xs">Feeds</span>
        </button>
        
        <button 
          className="flex flex-col items-center justify-center h-full w-16 bg-primary text-primary-foreground rounded-full -mt-6 shadow-lg"
          onClick={() => navigate("/add-workout")}
        >
          <PlusCircle className="h-6 w-6 mb-1" />
          <span className="text-xs">Add</span>
        </button>
        
        <button 
          className={cn(
            "flex flex-col items-center justify-center h-full w-16 transition-colors",
            isActive("/data") ? "text-primary" : "text-muted-foreground"
          )}
          onClick={handleDataClick}
        >
          <BarChart className="h-5 w-5 mb-1" />
          <span className="text-xs">Data</span>
        </button>
        
        <button 
          className={cn(
            "flex flex-col items-center justify-center h-full w-16 transition-colors",
            isActive("/profile") ? "text-primary" : "text-muted-foreground"
          )}
          onClick={handleProfileClick}
        >
          <User className="h-5 w-5 mb-1" />
          <span className="text-xs">Profile</span>
        </button>
      </div>
    </div>
  );
};

export default BottomNavigation;
