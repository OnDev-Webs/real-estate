
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getUserPropertyLeads, getUserProperties } from "@/services/propertyService";
import { useToast } from "@/hooks/use-toast";
import { 
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Eye, MessageSquare } from "lucide-react";
import { isToday } from 'date-fns';


const ClientLeads = () => {
  const [leads, setLeads] = useState<any[]>([]);
  const [properties, setProperties] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const todayUpdates = properties.filter(
    (property) => property.updatedAt && isToday(new Date(property.updatedAt))
  );
  
  const count = todayUpdates.length;

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Get property leads (views/inquiries)
        const leadsData = await getUserPropertyLeads();
        setLeads(leadsData);
        
        // Get user properties to show view counts
        const propertiesData = await getUserProperties();
        setProperties(propertiesData);
      } catch (error) {
        console.error("Error fetching leads:", error);
        toast({
          title: "Error",
          description: "Failed to load client leads. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">Client Leads</h2>

      {/* Property View Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Properties</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{properties.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Views</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {properties.reduce((total, property) => total + (property.views || 0), 0)}
            </div>
          </CardContent>
        </Card>
        {/* <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Recent Inquiries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{leads.length}</div>
          </CardContent>
        </Card> */}
      </div>

      {/* Property Views Table */}
      <Card>
        <CardHeader>
          <CardTitle>Property Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableCaption>List of your properties and their performance</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Property</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-center">Views</TableHead>
                <TableHead className="text-center">Inquiries</TableHead>
                <TableHead>Last Activity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    Loading property data...
                  </TableCell>
                </TableRow>
              ) : properties.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    No properties found. Add a property to start tracking performance.
                  </TableCell>
                </TableRow>
              ) : (
                properties.map((property) => (
                  <TableRow key={property.id || property._id}>
                    <TableCell className="font-medium">{property.title}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={
                        property.features?.status === 'for-sale' ? 'bg-green-100 text-green-800' : 
                        property.features?.status === 'for-rent' ? 'bg-blue-100 text-blue-800' : 
                        'bg-gray-100 text-gray-800'
                      }>
                        {property.features?.status?.replace('-', ' ') || 'Unknown'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center">
                        <Eye className="h-4 w-4 mr-1" /> 
                        {property.views || 0}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        {leads.filter(lead => 
                          (lead.property?.id === property.id || lead.property?._id === property._id)
                        ).length}
                      </div>
                    </TableCell>
                    <TableCell>
                      {/* {property.updatedAt ? 
                        formatDistanceToNow(new Date(property.updatedAt), { addSuffix: true }) : 
                        'No recent activity'} */}
                           {properties.filter(
  (property) => property.updatedAt && isToday(new Date(property.updatedAt))
).length}

                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Recent Leads Table */}
    
    </div>
  );
};

export default ClientLeads;
