import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Home, 
  Users, 
  Settings, 
  Plus, 
  Eye, 
  Edit, 
  Trash, 
  User
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getAllProperties, deleteProperty, getAgentDetails } from "@/services/propertyService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Property } from "@/lib/data";
import { formatPrice } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserTable from "../admin/UserTable";
import {
  ResponsiveContainer,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  Bar
} from 'recharts';

interface AdminDashboardProps {
  activeTab: string;
}

const AnalyticsTab = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const allProperties = await getAllProperties();
        setProperties(allProperties || []);
      } catch (error) {
        console.error("Failed to fetch properties for analytics:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProperties();
  }, []);

  const analyticsData = [
    { name: 'Properties', value: properties.length },
    { name: 'Views', value: properties.reduce((sum, p) => sum + (p.views || 0), 0) },
    { name: 'Featured', value: properties.filter(p => p.featured).length },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="w-full h-full p-6">
      <h2 className="text-2xl font-bold mb-4">Analytics</h2>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={analyticsData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

const AdminDashboard = ({ activeTab }: AdminDashboardProps) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [agentDetails, setAgentDetails] = useState<any>(null);
  const [showAgentDetails, setShowAgentDetails] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("authToken");

        if (activeTab === "properties" || activeTab === "overview") {
          const allProperties = await getAllProperties();
          setProperties(allProperties || []);
        }

        if (activeTab === "users" || activeTab === "overview") {
          const response = await fetch('http://localhost:5000/users/all', {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const userData = await response.json();
            setUsers(userData.users || []);
          } else {
            console.error("Failed to fetch users, status:", response.status);
          }
        }
      } catch (error) {
        console.error("Error fetching admin dashboard data:", error);
        toast({
          title: "Error",
          description: "Failed to load dashboard data. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [activeTab, toast]);

  const handleDeleteProperty = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this property? This action cannot be undone.")) {
      try {
        await deleteProperty(id);
        setProperties(properties.filter(p => p.id !== id && p._id !== id));
        toast({ title: "Success", description: "Property deleted successfully." });
      } catch (error) {
        console.error("Error deleting property:", error);
        toast({
          title: "Error",
          description: "Failed to delete property. Please try again later.",
          variant: "destructive",
        });
      }
    }
  };

  const handleViewAgentDetails = async (agentId: string) => {
    try {
      const agent = await getAgentDetails(agentId);
      setAgentDetails(agent);
      setShowAgentDetails(true);
    } catch (error) {
      console.error("Error fetching agent details:", error);
      toast({
        title: "Error",
        description: "Failed to fetch agent details. Please try again later.",
        variant: "destructive",
      });
    }
  };

  
  if (activeTab === "properties") {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold tracking-tight">All Properties</h2>
          <Button asChild>
            <Link to="/dashboard?tab=add-property">
              <Plus className="mr-2 h-4 w-4" />
              Add Property
            </Link>
          </Button>
        </div>
        
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-4 border-t-transparent border-estate-primary rounded-full animate-spin"></div>
          </div>
        ) : properties.length === 0 ? (
          <Card className="text-center p-6">
            <p className="mb-4">No properties found.</p>
            <Button asChild>
              <Link to="/dashboard?tab=add-property">
                <Plus className="mr-2 h-4 w-4" />
                Add First Property
              </Link>
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <Card key={property.id || property._id} className="overflow-hidden">
                <div className="aspect-w-16 aspect-h-9 relative">
                  <img
                    src={property.images && property.images.length > 0 ? property.images[0] : "/placeholder.svg"}
                    alt={property.title}
                    className="object-cover w-full h-48"
                  />
                  <span className={`absolute top-2 right-2 px-2.5 py-0.5 rounded-full text-xs font-medium
                    ${property.features?.status === 'for-sale' ? 'bg-green-100 text-green-800' : 
                    property.features?.status === 'for-rent' ? 'bg-blue-100 text-blue-800' : 
                    'bg-gray-100 text-gray-800'}`}>
                    {property.features?.status?.replace('-', ' ') || "N/A"}
                  </span>
                </div>
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold truncate">{property.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {property.location?.city || "N/A"}, {property.location?.state || "N/A"}
                  </p>
                  <div className="mt-2 flex justify-between items-center">
                    <span className="text-lg font-bold">
                      {formatPrice(property.price)}
                    </span>
                    <span className="text-sm text-gray-500 flex items-center">
                      <Eye className="inline h-4 w-4 mr-1" /> {property.views || 0} views
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded-md">
                      {property.features?.bedrooms || 0} bed
                    </span>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded-md">
                      {property.features?.bathrooms || 0} bath
                    </span>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded-md">
                      {property.features?.area || 0} sq ft
                    </span>
                  </div>
                  
                  {property.agent && (
                    <div 
                      className="mt-3 flex items-center cursor-pointer text-blue-600 hover:text-blue-800"
                      onClick={() => property.agent?.id && handleViewAgentDetails(property.agent.id)}
                    >
                      <User className="h-4 w-4 mr-1" />
                      <span className="text-sm">{property.agent.name}</span>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="p-4 pt-0 flex justify-end space-x-2">
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
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (activeTab === "users") {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">All Users</h2>
        
        {/* Users list implementation would go here */}
        <div className="text-center py-8">
          <p>User management interface is under development.</p>
        </div>
      </div>
    );
  }
  
  // Default to overview tab
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">Admin Dashboard</h2>
      
      <Tabs defaultValue="properties">
        <TabsList className="mb-4">
          <TabsTrigger value="properties">Properties</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="properties">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              <div className="col-span-full flex items-center justify-center h-40">
                <div className="w-8 h-8 border-4 border-t-transparent border-estate-primary rounded-full animate-spin"></div>
              </div>
            ) : properties.slice(0, 6).map((property) => (
              <Card key={property.id || property._id}>
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-base font-medium truncate">{property.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-4 py-2">
  <div className="w-full">
    <img
      src={property.images}
      alt=""
      className="w-full object-cover"
      style={{ height: "290px" }}
    />
  </div>

  <div className="flex justify-between text-sm mt-2">
    <span>{formatPrice(property.price)}</span>
    <Badge variant="outline">
      {property.features?.status?.replace("-", " ") || "N/A"}
    </Badge>
  </div>
</CardContent>

                <CardFooter className="p-4 pt-0 flex justify-end">
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/property/${property.id || property._id}`}>
                      <Eye className="h-4 w-4 mr-1" /> View
                    </Link>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="ml-2"
                    onClick={() => handleDeleteProperty(property.id || property._id as string)}
                  >
                    <Trash className="h-4 w-4 mr-1 text-red-500" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          {properties.length > 6 && (
            <div className="text-center mt-4">
              <Button variant="outline" asChild>
                <Link to="/admin?tab=properties">View All Properties</Link>
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="users">
          <div className="text-center py-8">

<UserTable/>    
      </div>
        </TabsContent>
        
        <TabsContent value="analytics">
        <AnalyticsTab />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Total Properties
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{properties.length}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Total Views
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {properties.reduce((sum, p) => sum + (p.views || 0), 0)}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Featured Properties
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {properties.filter(p => p.featured).length}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Agent Details Dialog */}
      <Dialog open={showAgentDetails} onOpenChange={setShowAgentDetails}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agent Details</DialogTitle>
            <DialogDescription>
              Information about the property agent
            </DialogDescription>
          </DialogHeader>
          
          {agentDetails && (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200">
                  <img 
                    src={agentDetails.avatar || agentDetails.image || "/placeholder.svg"} 
                    alt={agentDetails.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-semibold">{agentDetails.name}</h3>
                  <p className="text-sm text-gray-500">{agentDetails.email}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p>{agentDetails.phone || "Not provided"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Role</p>
                  <p className="capitalize">{agentDetails.role || "Agent"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Member Since</p>
                  <p>{agentDetails.createdAt ? new Date(agentDetails.createdAt).toLocaleDateString() : "Unknown"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Properties Listed</p>
                  <p>{agentDetails.propertyCount || "Unknown"}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Bio</p>
                <p className="text-sm">{agentDetails.bio || "No biography provided."}</p>
              </div>
              
              <div className="flex justify-end pt-4">
                <Button 
                  variant="outline"
                  onClick={() => setShowAgentDetails(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
