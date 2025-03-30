
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, MapPin, Home, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { getRecentlyViewed, getFavoriteProperties } from "@/services/dashboardService";
import { formatPrice } from "@/lib/data";

interface BuyerDashboardProps {
  activeTab: string;
}

const BuyerDashboard: React.FC<BuyerDashboardProps> = ({ activeTab }) => {
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (activeTab === "overview") {
          const viewedProperties = await getRecentlyViewed();
          setRecentlyViewed(viewedProperties);
        } else if (activeTab === "favorites") {
          const favoriteProperties = await getFavoriteProperties();
          setFavorites(favoriteProperties);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [activeTab]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-estate-primary"></div>
      </div>
    );
  }

  // Render the favorites tab content
  if (activeTab === "favorites") {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-6">My Favorite Properties</h1>
        
        {favorites.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-6">
                <Heart className="mx-auto mb-4 h-12 w-12 text-gray-300" />
                <h3 className="text-lg font-medium mb-2">No favorite properties yet</h3>
                <p className="text-gray-500 mb-4">Browse properties and add them to your favorites</p>
                <Button asChild>
                  <Link to="/properties">Browse Properties</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((property: any) => (
              <Card key={property.id} className="overflow-hidden">
                <div className="relative h-48 w-full">
                  <img
                    src={property.images[0] || "/placeholder.svg"}
                    alt={property.title}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full bg-white drop-shadow-md"
                    >
                      <Heart className="h-5 w-5 fill-current text-red-500" />
                    </Button>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-1 truncate">{property.title}</h3>
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="truncate">
                      {property.location?.address}, {property.location?.city}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-bold text-lg">
                        {formatPrice(property.price)}
                      </span>
                      {property.features?.status === "for-rent" && <span className="text-sm"> /month</span>}
                    </div>
                    <Link to={`/property/${property.id}`}>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Default overview tab
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Saved Searches</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Favorite Properties</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{favorites.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Recent Views</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recentlyViewed.length}</div>
          </CardContent>
        </Card>
      </div>
      
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Recently Viewed</h2>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/properties" className="flex items-center">
              View All <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
        
        {recentlyViewed.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-6">
                <Home className="mx-auto mb-4 h-12 w-12 text-gray-300" />
                <h3 className="text-lg font-medium mb-2">No recently viewed properties</h3>
                <p className="text-gray-500 mb-4">Start browsing properties to see them here</p>
                <Button asChild>
                  <Link to="/properties">Browse Properties</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentlyViewed.slice(0, 3).map((property: any) => (
              <Card key={property.id} className="overflow-hidden">
                <div className="relative h-48 w-full">
                  <img
                    src={property.images[0] || "/placeholder.svg"}
                    alt={property.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-1 truncate">{property.title}</h3>
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="truncate">
                      {property.location?.address}, {property.location?.city}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-bold text-lg">
                        {formatPrice(property.price)}
                      </span>
                      {property.features?.status === "for-rent" && <span className="text-sm"> /month</span>}
                    </div>
                    <Link to={`/property/${property.id}`}>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BuyerDashboard;
