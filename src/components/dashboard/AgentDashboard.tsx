
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  User, 
  Home,
  Plus,
  AlertCircle,
  Eye
} from "lucide-react";
import { getUserProperties } from "@/services/propertyService";
import { getDashboardStats } from "@/services/dashboardService";
import { Property } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import { formatPrice } from "@/lib/data";

interface AgentDashboardProps {
  activeTab: string;
}

interface DashboardStats {
  totalProperties: number;
  activeProperties: number;
  totalViews: number;
  recentProperties: Property[];
}

const AgentDashboard = ({ activeTab }: AgentDashboardProps) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // Fetch dashboard stats
        if (activeTab === "overview") {
          const dashboardStats = await getDashboardStats();
          setStats(dashboardStats);
        }
        
        // Fetch all properties for properties tab
        const fetchedProperties = await getUserProperties();
        setProperties(fetchedProperties);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast({
          title: "Error",
          description: "Failed to fetch your dashboard data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [activeTab, toast]);

  const renderEmptyState = () => (
    <div className="text-center py-12">
      <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
      <h3 className="mt-4 text-lg font-semibold text-gray-900">No Properties Found</h3>
      <p className="mt-2 text-sm text-gray-500">Get started by creating your first property listing.</p>
      <Button className="mt-4" asChild>
        <Link to="/dashboard?tab=add-property">
          <Plus className="mr-2 h-4 w-4" />
          Add Property
        </Link>
      </Button>
    </div>
  );

  if (activeTab === "overview") {
    return (
      <div className="space-y-6">
        {/* Stats Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Total Properties
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">
                  {isLoading ? "..." : stats?.totalProperties || 0}
                </div>
                <Home className="h-8 w-8 text-estate-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Active Listings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">
                  {isLoading ? "..." : stats?.activeProperties || 0}
                </div>
                <User className="h-8 w-8 text-estate-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Property Views
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">
                  {isLoading ? "..." : stats?.totalViews || 0}
                </div>
                <Eye className="h-8 w-8 text-estate-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Properties Section */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Properties</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <div className="w-8 h-8 border-4 border-estate-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="mt-2 text-sm text-gray-500">Loading properties...</p>
              </div>
            ) : !stats?.recentProperties || stats.recentProperties.length === 0 ? (
              renderEmptyState()
            ) : (
              <div className="divide-y divide-gray-200">
                {stats.recentProperties.map((property) => (
                  <Link
                    key={property.id || property._id}
                    to={`/property/${property.id || property._id}`}
                    className="block py-4 hover:bg-gray-50 transition duration-150 ease-in-out"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0 w-16 h-16">
                        <img
                          src={property.images[0] || "/placeholder.svg"}
                          alt={property.title}
                          className="w-full h-full object-cover rounded-md"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {property.title}
                        </p>
                        <p className="text-sm text-gray-500">
                          {property.location.city}, {property.location.state}
                        </p>
                        <p className="text-sm text-gray-500">
                          Price: {formatPrice(property.price)}
                        </p>
                      </div>
                      <div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                          ${property.features?.status === 'for-sale' ? 'bg-green-100 text-green-800' : 
                          property.features?.status === 'for-rent' ? 'bg-blue-100 text-blue-800' : 
                          'bg-gray-100 text-gray-800'}`}>
                          {(property.features?.status || "").replace('-', ' ')}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Properties tab view
  if (activeTab === "properties") {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold tracking-tight">My Properties</h2>
          <Button asChild>
            <Link to="/dashboard?tab=add-property">
              <Plus className="mr-2 h-4 w-4" />
              Add Property
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-4 border-estate-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-500">Loading your properties...</p>
          </div>
        ) : properties.length === 0 ? (
          renderEmptyState()
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <Card key={property.id || property._id}>
                <div className="aspect-w-16 aspect-h-9">
                  <img
                    src={property.images[0] || "/placeholder.svg"}
                    alt={property.title}
                    className="object-cover w-full h-48 rounded-t-lg"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold">{property.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {property.location.city}, {property.location.state}
                  </p>
                  <div className="mt-2 flex justify-between items-center">
                    <span className="text-lg font-bold">
                      {formatPrice(property.price)}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${property.features?.status === 'for-sale' ? 'bg-green-100 text-green-800' : 
                      property.features?.status === 'for-rent' ? 'bg-blue-100 text-blue-800' : 
                      'bg-gray-100 text-gray-800'}`}>
                      {(property.features?.status || "").replace('-', ' ')}
                    </span>
                  </div>
                  <div className="mt-4 flex justify-end space-x-2">
                    <Button variant="outline" asChild>
                      <Link to={`/property/${property.id || property._id}`}>View Details</Link>
                    </Button>
                    <Button variant="default" asChild>
                      <Link to={`/dashboard?tab=edit-property&id=${property.id || property._id}`}>Edit</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  }

  return null;
};

export default AgentDashboard;
