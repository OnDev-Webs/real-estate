import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Home, 
  Plus, 
  Eye, 
  Edit, 
  Trash, 
  AlertCircle,
  Activity,
  UserPlus,
  TrendingUp
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { getUserProperties, deleteProperty } from "@/services/propertyService";
import { getDashboardStats } from "@/services/dashboardService";
import { Property } from "@/lib/data";
import { formatPrice } from "@/lib/data";

interface OwnerDashboardProps {
  activeTab: string;
}

interface DashboardStats {
  totalProperties: number;
  activeProperties: number;
  totalViews: number;
  recentProperties: Property[];
}

const OwnerDashboard = ({ activeTab }: OwnerDashboardProps) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [todayLeads, setTodayLeads] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // Fetch dashboard stats
        if (activeTab === "overview") {
          const dashboardStats = await getDashboardStats();
          setStats(dashboardStats);
          
          // Fetch today's leads for enhanced analytics
          const leads = await fetch('/api/leads/today').then(res => res.json()).catch(() => []);
          setTodayLeads(leads);
        }
        
        // Fetch properties
        const userProperties = await getUserProperties();
        setProperties(userProperties);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast({
          title: "Error",
          description: "Failed to load your dashboard data. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [activeTab, toast]);

  const handleDeleteProperty = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this property?")) {
      try {
        await deleteProperty(id);
        
        // Update the properties list
        setProperties(properties.filter(property => (property.id !== id && property._id !== id)));
        
        toast({
          title: "Success",
          description: "Property deleted successfully.",
        });
      } catch (error) {
        console.error("Error deleting property:", error);
        toast({
          title: "Error",
          description: "Failed to delete property. Please try again later.",
          variant: "destructive"
        });
      }
    }
  };

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
        {/* Enhanced Stats Overview Cards - Aligned with AgentDashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
                <Activity className="h-8 w-8 text-green-500" />
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
                <Eye className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Today's Leads
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">
                  {isLoading ? "..." : todayLeads.length}
                </div>
                <UserPlus className="h-8 w-8 text-purple-500" />
              </div>
              {!isLoading && (
                <div className="text-xs text-green-500 mt-1">
                  New in the last 24 hours
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Analytics Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Analytics Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Visitor Activity</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Average views per listing</span>
                    <span className="font-medium">
                      {isLoading 
                        ? "..." 
                        : stats?.totalProperties && stats.totalProperties > 0 
                          ? (stats.totalViews / stats.totalProperties).toFixed(1) 
                          : "0"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Most viewed property</span>
                    <span className="font-medium">
                      {isLoading
                        ? "..."
                        : stats?.recentProperties && stats.recentProperties.length > 0
                          ? `${stats.recentProperties[0].views || 0} views`
                          : "No data"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Total views today</span>
                    <span className="font-medium">{isLoading ? "..." : todayLeads.length}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Performance</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Active listing rate</span>
                    <span className="font-medium">
                      {isLoading 
                        ? "..." 
                        : stats?.totalProperties && stats.totalProperties > 0 
                          ? `${((stats.activeProperties / stats.totalProperties) * 100).toFixed(0)}%` 
                          : "0%"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Engagement rate</span>
                    <span className="font-medium">
                      {isLoading ? "..." : "62%"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Response rate</span>
                    <span className="font-medium">
                      {isLoading ? "..." : "85%"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold mb-4">Actions</h3>
              <div className="flex flex-wrap gap-3">
                <Button asChild variant="outline" size="sm">
                  <Link to="/dashboard?tab=properties">
                    <Home className="mr-2 h-4 w-4" />
                    Manage Properties
                  </Link>
                </Button>
                <Button asChild variant="outline" size="sm">
                  <Link to="/dashboard?tab=add-property">
                    <Plus className="mr-2 h-4 w-4" />
                    Add New Property
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

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

  // Properties tab view with card format
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
              <Card key={property.id || property._id} className="overflow-hidden">
                <div className="aspect-w-16 aspect-h-9 relative">
                  <img
                    src={property.images[0] || "/placeholder.svg"}
                    alt={property.title}
                    className="object-cover w-full h-48"
                  />
                  <span className={`absolute top-2 right-2 px-2.5 py-0.5 rounded-full text-xs font-medium
                    ${property.features?.status === 'for-sale' ? 'bg-green-100 text-green-800' : 
                    property.features?.status === 'for-rent' ? 'bg-blue-100 text-blue-800' : 
                    'bg-gray-100 text-gray-800'}`}>
                    {(property.features?.status || "").replace('-', ' ')}
                  </span>
                </div>
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold truncate">{property.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {property.location.city}, {property.location.state}
                  </p>
                  <div className="mt-2 flex justify-between items-center">
                    <span className="text-lg font-bold">
                      {formatPrice(property.price)}
                    </span>
                    <span className="text-sm text-gray-500">
                      <Eye className="inline h-4 w-4 mr-1" /> {property.views || 0} views
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded-md">
                      {property.features.bedrooms} bed
                    </span>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded-md">
                      {property.features.bathrooms} bath
                    </span>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded-md">
                      {property.features.area} sq ft
                    </span>
                  </div>
                  <div className="mt-4 flex justify-end space-x-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/property/${property.id || property._id}`}>
                        <Eye className="h-4 w-4 mr-1" /> View
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/dashboard?tab=edit-property&id=${property.id || property._id}`}>
                        <Edit className="h-4 w-4 mr-1" /> Edit
                      </Link>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDeleteProperty(property.id || property._id as string)}
                    >
                      <Trash className="h-4 w-4 mr-1 text-red-500" />
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

export default OwnerDashboard;
