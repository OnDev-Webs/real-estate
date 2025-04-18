
import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

interface PropertyFavoriteButtonProps {
  propertyId: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'icon' | 'button';
}

interface FavoriteResult {
  isFavorite: boolean;
}

const PropertyFavoriteButton = ({ 
  propertyId, 
  className,
  size = 'md',
  variant = 'icon'
}: PropertyFavoriteButtonProps) => {
  const { toast } = useToast();
  const { user, toggleFavorite, isFavorite } = useAuth();
  const [isFav, setIsFav] = useState(false);
  
  useEffect(() => {
    if (user) {
      // Initialize favorite status
      const checkFavorite = async () => {
        const favStatus = isFavorite(propertyId);
        setIsFav(!!favStatus);
      };
      
      checkFavorite();
    }
  }, [user, propertyId, isFavorite]);

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please login to save properties to favorites",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // Call the toggleFavorite function from AuthContext
      const result = await toggleFavorite(propertyId) as unknown as FavoriteResult;
      setIsFav(result.isFavorite);
      
      toast({
        title: result.isFavorite ? "Added to favorites" : "Removed from favorites",
        description: result.isFavorite 
          ? "Property has been added to your favorites" 
          : "Property has been removed from your favorites"
      });
    } catch (error) {
      console.error("Error toggling favorite:", error);
      // toast({
      //   title: "Error",
      //   description: "Could not update favorites. Please try again.",
      //   variant: "destructive"
      // });
    }
  };

  // Icon sizes based on size prop
  const iconSizes = {
    sm: 16,
    md: 18,
    lg: 24
  };
  
  // Button styles based on size prop
  const buttonStyles = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12"
  };

  if (variant === 'icon') {
    return (
      <button 
        onClick={handleToggleFavorite}
        className={cn(
          "rounded-full p-2 transition-colors",
          isFav ? "bg-black text-white" : "bg-white text-gray-500 hover:text-black",
          buttonStyles[size],
          className
        )}
      >
        <Heart size={iconSizes[size]} fill={isFav ? "white" : "none"} />
      </button>
    );
  }
  
  return (
    <Button
      variant={isFav ? "default" : "outline"}
      size="sm"
      onClick={handleToggleFavorite}
      className={cn(
        "rounded-full",
        isFav ? "bg-black text-white" : "border-black text-black hover:bg-black hover:text-white",
        className
      )}
    >
      <Heart 
        size={iconSizes.sm} 
        className="mr-2" 
        fill={isFav ? "white" : "none"} 
      />
      {isFav ? "Saved" : "Save"}
    </Button>
  );
};

export default PropertyFavoriteButton;
