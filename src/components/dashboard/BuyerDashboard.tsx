
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Property, properties } from "@/lib/data";
import PropertyCard from "@/components/PropertyCard";
import { Heart, Clock, Eye } from "lucide-react";

interface BuyerDashboardProps {
  activeTab: string;
}

const BuyerDashboard: React.FC<BuyerDashboardProps> = ({ activeTab }) => {
  // Mock data - would come from API calls in a real app
  const [favoriteProperties] = useState<Property[]>(properties.slice(0, 3));
  const [recentlyViewed] = useState<Property[]>(properties.slice(3, 6));

  if (activeTab === "favorites") {
    return (
      <div>
        <h2 className="text-xl font-bold mb-6">Favorite Properties</h2>
        {favoriteProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteProperties.map((property, index) => (
              <PropertyCard key={property.id} property={property} index={index} />
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
          <p className="text-3xl font-bold mt-2">12</p>
          <p className="text-green-500 text-sm mt-1">+3 since yesterday</p>
        </div>
      </div>
      
      {/* Recent Activities */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
        <h2 className="text-xl font-bold mb-4">Recently Viewed</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recentlyViewed.map((property, index) => (
            <Link to={`/property/${property.id}`} key={property.id} className="block">
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
      </div>
      
      {/* Recommendation */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-bold mb-4">Recommended For You</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {properties.slice(0, 2).map((property, index) => (
            <PropertyCard key={property.id} property={property} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BuyerDashboard;
