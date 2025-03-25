import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Mail, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  propertyId: string;
  propertyTitle: string;
  message: string;
  date: string;
  status: "new" | "contacted" | "qualified" | "converted" | "closed";
}

// This would come from an API in a real application
const getLeads = async (): Promise<Lead[]> => {
  // Simulating API call with mock data
  return [
    {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      phone: "555-123-4567",
      propertyId: "prop1",
      propertyTitle: "Modern Apartment in Downtown",
      message: "I'm interested in scheduling a viewing for this weekend.",
      date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      status: "new"
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane@example.com",
      phone: "555-987-6543",
      propertyId: "prop2",
      propertyTitle: "Luxury Villa with Ocean View",
      message: "Is this property still available? I'd like to make an offer.",
      date: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
      status: "contacted"
    },
    {
      id: "3",
      name: "Robert Johnson",
      email: "robert@example.com",
      phone: "555-456-7890",
      propertyId: "prop3",
      propertyTitle: "Cozy Family Home in Suburbs",
      message: "What are the mortgage options for this property?",
      date: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
      status: "qualified"
    }
  ];
};

const ClientLeads = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const { toast } = useToast();

  useEffect(() => {
    const fetchLeads = async () => {
      setIsLoading(true);
      try {
        const data = await getLeads();
        setLeads(data);
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

    fetchLeads();
  }, [toast]);

  const filteredLeads = activeFilter === "all" 
    ? leads 
    : leads.filter(lead => lead.status === activeFilter);

  const handleUpdateStatus = (leadId: string, newStatus: Lead["status"]) => {
    setLeads(leads.map(lead => 
      lead.id === leadId ? { ...lead, status: newStatus } : lead
    ));
    
    toast({
      title: "Status Updated",
      description: `Lead status has been updated to ${newStatus}.`
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">Client Leads</h2>
        <div className="flex space-x-2">
          <Button 
            variant={activeFilter === "all" ? "default" : "outline"} 
            onClick={() => setActiveFilter("all")}
          >
            All
          </Button>
          <Button 
            variant={activeFilter === "new" ? "default" : "outline"}
            onClick={() => setActiveFilter("new")}
          >
            New
          </Button>
          <Button 
            variant={activeFilter === "contacted" ? "default" : "outline"}
            onClick={() => setActiveFilter("contacted")}
          >
            Contacted
          </Button>
          <Button 
            variant={activeFilter === "qualified" ? "default" : "outline"}
            onClick={() => setActiveFilter("qualified")}
          >
            Qualified
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-4 border-estate-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading your leads...</p>
        </div>
      ) : filteredLeads.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg shadow-sm">
          <AlertCircle className="mx-auto h-12 w-12 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium mb-2">No Leads Found</h3>
          <p className="text-gray-500 mb-6">
            {activeFilter === "all" 
              ? "You don't have any client leads yet." 
              : `You don't have any ${activeFilter} leads.`}
          </p>
          <Button onClick={() => setActiveFilter("all")}>
            View All Leads
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredLeads.map(lead => (
            <Card key={lead.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                    <div>
                      <h3 className="text-lg font-semibold">{lead.name}</h3>
                      <p className="text-sm text-gray-500">
                        Interested in: <span className="font-medium text-gray-700">{lead.propertyTitle}</span>
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Submitted: {new Date(lead.date).toLocaleDateString()}
                      </p>
                      <div className="flex items-center mt-2 space-x-4">
                        <a 
                          href={`mailto:${lead.email}`} 
                          className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                        >
                          <Mail className="h-4 w-4 mr-1" />
                          {lead.email}
                        </a>
                        <a 
                          href={`tel:${lead.phone}`} 
                          className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                        >
                          <Phone className="h-4 w-4 mr-1" />
                          {lead.phone}
                        </a>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full
                        ${lead.status === 'new' ? 'bg-blue-100 text-blue-800' : 
                        lead.status === 'contacted' ? 'bg-yellow-100 text-yellow-800' :
                        lead.status === 'qualified' ? 'bg-green-100 text-green-800' :
                        lead.status === 'converted' ? 'bg-purple-100 text-purple-800' :
                        'bg-gray-100 text-gray-800'}`}>
                        {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                      </span>
                      <Button variant="outline" size="sm">View Details</Button>
                    </div>
                  </div>
                  
                  <div className="mt-4 p-4 bg-gray-50 rounded-md">
                    <p className="text-sm text-gray-700">{lead.message}</p>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                    <div className="text-sm text-gray-500">
                      Update status:
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        variant={lead.status === "new" ? "default" : "outline"}
                        onClick={() => handleUpdateStatus(lead.id, "new")}
                        disabled={lead.status === "new"}
                      >
                        New
                      </Button>
                      <Button 
                        size="sm" 
                        variant={lead.status === "contacted" ? "default" : "outline"}
                        onClick={() => handleUpdateStatus(lead.id, "contacted")}
                        disabled={lead.status === "contacted"}
                      >
                        Contacted
                      </Button>
                      <Button 
                        size="sm" 
                        variant={lead.status === "qualified" ? "default" : "outline"}
                        onClick={() => handleUpdateStatus(lead.id, "qualified")}
                        disabled={lead.status === "qualified"}
                      >
                        Qualified
                      </Button>
                      <Button 
                        size="sm" 
                        variant={lead.status === "converted" ? "default" : "outline"}
                        onClick={() => handleUpdateStatus(lead.id, "converted")}
                        disabled={lead.status === "converted"}
                      >
                        Converted
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClientLeads;