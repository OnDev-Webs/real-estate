
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getTodayLeads } from "@/services/dashboardService";
import { Mail, Phone, User, Building } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  property: {
    id: string;
    title: string;
  };
  message: string;
  type: "view" | "contact";
  date: string;
  status: "new" | "contacted" | "qualified" | "unqualified";
}

const ClientLeads = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const { toast } = useToast();

  useEffect(() => {
    const fetchLeads = async () => {
      setIsLoading(true);
      try {
        const todayLeads = await getTodayLeads();
        console.log("Fetched today's leads:", todayLeads);
        
        if (Array.isArray(todayLeads)) {
          setLeads(todayLeads);
        } else {
          console.error("Invalid leads data format", todayLeads);
          setLeads([]);
        }
      } catch (error) {
        console.error("Error fetching leads:", error);
        toast({
          title: "Error",
          description: "Failed to load leads. Please try again.",
          variant: "destructive",
        });
        setLeads([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeads();

    // Refresh leads every 5 minutes
    const interval = setInterval(fetchLeads, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [toast]);

  const getFilteredLeads = () => {
    switch (activeTab) {
      case "contact":
        return leads.filter(lead => lead.type === "contact");
      case "view":
        return leads.filter(lead => lead.type === "view");
      case "new":
        return leads.filter(lead => lead.status === "new");
      case "all":
      default:
        return leads;
    }
  };

  const handleStatusChange = (leadId: string, newStatus: Lead["status"]) => {
    // In a real app, this would make an API call to update the status
    setLeads(leads.map(lead => 
      lead.id === leadId ? { ...lead, status: newStatus } : lead
    ));
    
    toast({
      title: "Status Updated",
      description: `Lead status changed to ${newStatus}`,
    });
  };

  const renderLeadStatus = (status: Lead["status"]) => {
    switch (status) {
      case "new":
        return <Badge className="bg-blue-500">New</Badge>;
      case "contacted":
        return <Badge className="bg-yellow-500">Contacted</Badge>;
      case "qualified":
        return <Badge className="bg-green-500">Qualified</Badge>;
      case "unqualified":
        return <Badge className="bg-red-500">Unqualified</Badge>;
      default:
        return null;
    }
  };

  const renderLeadType = (type: Lead["type"]) => {
    switch (type) {
      case "contact":
        return <Badge className="bg-purple-500">Inquiry</Badge>;
      case "view":
        return <Badge variant="outline">View</Badge>;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="w-8 h-8 border-4 border-estate-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="mt-4 text-gray-500">Loading leads...</p>
      </div>
    );
  }

  const filteredLeads = getFilteredLeads();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">Client Leads</h2>
        <span className="text-sm text-gray-500">
          Showing {filteredLeads.length} of {leads.length} leads from the last 24 hours
        </span>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Leads</TabsTrigger>
          <TabsTrigger value="contact">Inquiries</TabsTrigger>
          <TabsTrigger value="view">Property Views</TabsTrigger>
          <TabsTrigger value="new">New</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {filteredLeads.length === 0 ? (
            <Card>
              <CardContent className="py-10 text-center">
                <p className="text-gray-500">No leads found for this filter.</p>
              </CardContent>
            </Card>
          ) : (
            filteredLeads.map((lead) => (
              <Card key={lead.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg flex items-center">
                      <User className="h-5 w-5 mr-2 text-gray-500" />
                      {lead.name || "Anonymous User"}
                    </CardTitle>
                    <div className="flex space-x-2">
                      {renderLeadType(lead.type)}
                      {renderLeadStatus(lead.status)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Contact Information</h3>
                      <div className="space-y-2">
                        <p className="text-sm flex items-center">
                          <Mail className="h-4 w-4 mr-2 text-gray-500" />
                          {lead.email || "Email not provided"}
                        </p>
                        <p className="text-sm flex items-center">
                          <Phone className="h-4 w-4 mr-2 text-gray-500" />
                          {lead.phone || "Phone not provided"}
                        </p>
                      </div>
                      
                      <h3 className="text-sm font-medium text-gray-500 mt-4 mb-2">Activity</h3>
                      <div className="text-sm">
                        <p>
                          {lead.type === "view" 
                            ? "Viewed property" 
                            : "Sent inquiry about property"}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatDistanceToNow(new Date(lead.date), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Property Information</h3>
                      <div className="flex items-start space-x-2">
                        <Building className="h-4 w-4 mt-0.5 text-gray-500" />
                        <div>
                          <p className="text-sm font-medium">
                            {lead.property?.title || "Unknown Property"}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            ID: {lead.property?.id || "N/A"}
                          </p>
                        </div>
                      </div>
                      
                      {lead.message && (
                        <>
                          <h3 className="text-sm font-medium text-gray-500 mt-4 mb-2">Message</h3>
                          <p className="text-sm bg-gray-50 p-2 rounded border border-gray-100">
                            {lead.message}
                          </p>
                        </>
                      )}
                      
                      <div className="mt-4 flex flex-wrap gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleStatusChange(lead.id, "contacted")}
                        >
                          Mark Contacted
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-green-600"
                          onClick={() => handleStatusChange(lead.id, "qualified")}
                        >
                          Qualify
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-red-600"
                          onClick={() => handleStatusChange(lead.id, "unqualified")}
                        >
                          Disqualify
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClientLeads;
