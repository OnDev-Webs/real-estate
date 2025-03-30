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
  Eye,
  TrendingUp,
  UserPlus,
  Activity,
  Calendar
} from "lucide-react";
import { getUserProperties } from "@/services/propertyService";
import { getTodayLeads, getActiveListings, getDashboardStats } from "@/services/dashboardService";
import { Property } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import { formatPrice } from "@/lib/data";
import ClientLeads from "./ClientLeads";

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
  const [todayLeads, setTodayLeads] = useState<any[]>([]);
  const [activeListings, setActiveListings] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // Fetch dashboard stats
        if (activeTab === "overview") {
          console.log("Fetching dashboard stats...");
          const dashboardStats = await getDashboardStats();
          console.log("Received dashboard stats:", dashboardStats);
          setStats(dashboardStats);
          
          // Fetch today's leads and active listings for enhanced analytics
          try {
            const leads = await getTodayLeads();
            setTodayLeads(leads || []);
          } catch (error) {
            console.error("Error fetching leads:", error);
            setTodayLeads([]);
          }
          
          try {
            const listings = await getActiveListings();
            setActiveListings(listings || []);
          } catch (error) {
            console.error("Error fetching active listings:", error);
            setActiveListings([]);
          }
        }
        
        // Fetch all properties for properties tab
        if (activeTab === "properties") {
          try {
            const fetchedProperties = await getUserProperties();
            console.log("Fetched user properties:", fetchedProperties);
            setProperties(fetchedProperties || []);
          } catch (error) {
            console.error("Error fetching properties:", error);
            setProperties([]);
          }
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast({
          title: "Error",
          description: "Failed to fetch your dashboard data. Please try again.",
          variant: "destructive",
        });
        // Initialize with empty values to prevent undefined errors
        setStats({
          totalProperties: 0,
          activeProperties: 0,
          totalViews: 0,
          recentProperties: []
        });
        setTodayLeads([]);
        setActiveListings([]);
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

  if (activeTab === "clients") {
    return <ClientLeads />;
  }

  if (activeTab === "overview") {
    return (
      <div className="space-y-6">
        {/* Enhanced Stats Overview Cards */}
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
                  {isLoading ? "..." : (todayLeads && todayLeads.length) || 0}
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
                        : (stats?.recentProperties && stats.recentProperties.length > 0)
                          ? `${stats.recentProperties[0].views || 0} views`
                          : "No data"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Total views today</span>
                    <span className="font-medium">{isLoading ? "..." : (todayLeads && todayLeads.length) || 0}</span>
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
                        : (stats?.totalProperties && stats.totalProperties > 0)
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
                  <Link to="/dashboard?tab=clients">
                    <User className="mr-2 h-4 w-4" />
                    View All Leads
                  </Link>
                </Button>
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
                          src={(property.images && property.images.length > 0) ? property.images[0] : "/placeholder.svg"}
                          alt={property.title}
                          className="w-full h-full object-cover rounded-md"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {property.title}
                        </p>
                        <p className="text-sm text-gray-500">
                          {property.location?.city || 'N/A'}, {property.location?.state || 'N/A'}
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
                    src={(property.images && property.images.length > 0) ? property.images[0] : "/placeholder.svg"}
                    alt={property.title}
                    className="object-cover w-full h-48 rounded-t-lg"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold">{property.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {property.location?.city || 'N/A'}, {property.location?.state || 'N/A'}
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
