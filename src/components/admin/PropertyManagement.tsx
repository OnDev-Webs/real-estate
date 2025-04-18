
import { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Eye, Edit, Trash, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getAllProperties, deleteProperty, getAgentDetails } from '@/services/propertyService';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

const PropertyManagement = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState(null);
  const [agentDetailsOpen, setAgentDetailsOpen] = useState(false);
  const [currentAgent, setCurrentAgent] = useState(null);
  const [agentLoading, setAgentLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      setLoading(true);
      const data = await getAllProperties();
      setProperties(data);
    } catch (error) {
      console.error('Error loading properties:', error);
      toast({
        title: 'Error',
        description: 'Failed to load properties',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (property) => {
    setPropertyToDelete(property);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteProperty(propertyToDelete._id);
      toast({
        title: 'Success',
        description: 'Property deleted successfully',
      });
      loadProperties();
    } catch (error) {
      console.error('Error deleting property:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete property',
        variant: 'destructive',
      });
    } finally {
      setDeleteDialogOpen(false);
      setPropertyToDelete(null);
    }
  };

  const handleViewProperty = (propertyId) => {
    navigate(`/property/${propertyId}`);
  };

  const handleEditProperty = (propertyId) => {
    navigate(`/admin/property/edit?id=${propertyId}`);
  };

  const handleViewAgentDetails = async (agentId) => {
    try {
      setAgentLoading(true);
      const agent = await getAgentDetails(agentId);
      setCurrentAgent(agent);
      setAgentDetailsOpen(true);
    } catch (error) {
      console.error('Error fetching agent details:', error);
      toast({
        title: 'Error',
        description: 'Failed to load agent details',
        variant: 'destructive',
      });
    } finally {
      setAgentLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'for-sale': return 'bg-green-100 text-green-800 border-green-300';
      case 'for-rent': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'sold': return 'bg-gray-100 text-gray-800 border-gray-300';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Properties</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Properties</CardTitle>
          <Button onClick={() => navigate('/admin?tab=add-property')}>Add New Property</Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Views</TableHead>
                  <TableHead>Agent</TableHead>
                  <TableHead>Added On</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {properties.length > 0 ? (
                  properties.map((property) => (
                    <TableRow key={property._id}>
                      <TableCell>
                        <div className="w-16 h-12 rounded overflow-hidden">
                          {property.images && property.images[0] ? (
                            <img
                              src={property.images[0]}
                              alt={property.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                              <Eye className="h-4 w-4 text-gray-400" />
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        <div className="max-w-[200px] truncate">{property.title}</div>
                      </TableCell>
                      <TableCell>{formatCurrency(property.price)}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`${getStatusBadgeColor(property.features?.status)}`}
                        >
                          {property.features?.status?.replace('-', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Eye className="h-4 w-4 mr-1" />
                          <span>{property.views || 0}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="flex items-center gap-1"
                          onClick={() => handleViewAgentDetails(property.agent?.id)}
                        >
                          <User className="h-4 w-4" />
                          <span className="truncate max-w-[80px]">{property.agent?.name}</span>
                        </Button>
                      </TableCell>
                      <TableCell>
                        {property.createdAt
                          ? format(new Date(property.createdAt), 'MMM d, yyyy')
                          : 'N/A'}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleViewProperty(property._id)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {/* <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditProperty(property._id)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button> */}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteClick(property)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center h-24">
                      No properties found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the property "{propertyToDelete?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Agent Details Dialog */}
      <Dialog open={agentDetailsOpen} onOpenChange={setAgentDetailsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Agent Details</DialogTitle>
          </DialogHeader>
          {agentLoading ? (
            <div className="flex justify-center p-4">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-black"></div>
            </div>
          ) : currentAgent ? (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 rounded-full overflow-hidden">
                  {currentAgent.avatar ? (
                    <img
                      src={currentAgent.avatar}
                      alt={currentAgent.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full bg-gray-100 flex items-center justify-center">
                      <User className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-medium">{currentAgent.name}</h3>
                  <p className="text-sm text-gray-500">{currentAgent.role}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p>{currentAgent.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p>{currentAgent.phone || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Joined</p>
                  <p>{currentAgent.createdAt ? format(new Date(currentAgent.createdAt), 'MMM d, yyyy') : 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Properties</p>
                  <p>{currentAgent.propertyCount || '0'}</p>
                </div>
              </div>
              
              {currentAgent.bio && (
                <div>
                  <p className="text-sm text-gray-500">Bio</p>
                  <p className="text-sm">{currentAgent.bio}</p>
                </div>
              )}
            </div>
          ) : (
            <p className="text-center py-4">Failed to load agent details</p>
          )}
          <DialogFooter>
            <Button onClick={() => setAgentDetailsOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PropertyManagement;
