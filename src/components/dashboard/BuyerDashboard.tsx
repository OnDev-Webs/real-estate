
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Property } from "@/lib/data";
import PropertyCard from "@/components/PropertyCard";
import { Heart, Clock, Eye, AlertCircle } from "lucide-react";
import { getAllProperties } from "@/services/propertyService";
import { useToast } from "@/hooks/use-toast";

interface BuyerDashboardProps {
  activeTab: string;
}

const BuyerDashboard: React.FC<BuyerDashboardProps> = ({ activeTab }) => {
  // Use real data from backend instead of mock data
  const [favoriteProperties, setFavoriteProperties] = useState<Property[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<Property[]>([]);
  const [recommendedProperties, setRecommendedProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProperties = async () => {
      setIsLoading(true);
      try {
        // In a real application, we would fetch these specifically for the user
        // For now, we'll just get all properties and use different subsets
        const allProperties = await getAllProperties();
        
        // Simulate favorited properties (in a real app, this would come from user's saved properties)
        setFavoriteProperties(allProperties.slice(0, 3));
        
        // Simulate recently viewed (in a real app, this would track user's view history)
        setRecentlyViewed(allProperties.slice(3, 6));
        
        // Simulate recommended properties
        setRecommendedProperties(allProperties.slice(0, 2));
      } catch (error) {
        console.error("Error fetching properties:", error);
        toast({
          title: "Error",
          description: "Failed to load properties. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperties();
  }, [toast]);

  if (activeTab === "favorites") {
    return (
      <div>
        <h2 className="text-xl font-bold mb-6">Favorite Properties</h2>
        {isLoading ? (
          <div className="text-center py-8">
            <div className="w-8 h-8 border-4 border-estate-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-500">Loading favorite properties...</p>
          </div>
        ) : favoriteProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteProperties.map((property, index) => (
              <PropertyCard key={property.id || property._id} property={property} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm">
            <Heart className="mx-auto h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium mb-2">No favorites yet</h3>
            <p className="text-gray-500 mb-6">
              Start browsing properties and save your favorites here.
            </p>
            <Link to="/properties">
              <Button className="bg-estate-primary hover:bg-estate-primary/90">
                Browse Properties
              </Button>
            </Link>
          </div>
        )}
      </div>
    );
  }

  if (activeTab === "search") {
    return (
      <div>
        <h2 className="text-xl font-bold mb-6">Property Search</h2>
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <p className="mb-4">
            Use our advanced search filters to find your dream property:
          </p>
          <Link to="/properties">
            <Button className="bg-estate-primary hover:bg-estate-primary/90">
              Go to Property Search
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Default: Overview
  return (
    <div>
      {/* Stats */}
      {isLoading ? (
        <div className="text-center py-8">
          <div className="w-8 h-8 border-4 border-estate-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading dashboard data...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Saved Properties</h3>
                <Heart className="h-6 w-6 text-estate-primary" />
              </div>
              <p className="text-3xl font-bold mt-2">{favoriteProperties.length}</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Recently Viewed</h3>
                <Clock className="h-6 w-6 text-estate-primary" />
              </div>
              <p className="text-3xl font-bold mt-2">{recentlyViewed.length}</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">New Listings</h3>
                <Eye className="h-6 w-6 text-estate-primary" />
              </div>
              <p className="text-3xl font-bold mt-2">{Math.min(10, recentlyViewed.length + favoriteProperties.length)}</p>
              <p className="text-green-500 text-sm mt-1">Updated today</p>
            </div>
          </div>
          
          {/* Recent Activities */}
          <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
            <h2 className="text-xl font-bold mb-4">Recently Viewed</h2>
            {recentlyViewed.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {recentlyViewed.map((property) => (
                  <Link to={`/property/${property.id || property._id}`} key={property.id || property._id} className="block">
                    <div className="group relative rounded-lg overflow-hidden border border-gray-200 transition-all hover:shadow-md">
                      <div className="aspect-video bg-gray-200 relative overflow-hidden">
                        <img 
                          src={property.images[0]} 
                          alt={property.title} 
                          className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold line-clamp-1">{property.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {property.location.city}, {property.location.state}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">No recently viewed properties</p>
                <Link to="/properties" className="mt-4 inline-block">
                  <Button variant="outline">Browse Properties</Button>
                </Link>
              </div>
            )}
          </div>
          
          {/* Recommendation */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-bold mb-4">Recommended For You</h2>
            {recommendedProperties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {recommendedProperties.map((property, index) => (
                  <PropertyCard key={property.id || property._id} property={property} index={index} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">No recommendations available</p>
                <Link to="/properties" className="mt-4 inline-block">
                  <Button variant="outline">Browse Properties</Button>
                </Link>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default BuyerDashboard;
