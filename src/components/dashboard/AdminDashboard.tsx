
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Property, properties, agents } from "@/lib/data";
import { 
  Users, 
  Home, 
  DollarSign, 
  Activity, 
  PieChart, 
  BarChart,
  CheckCircle,
  XCircle,
  User
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AdminDashboardProps {
  activeTab: string;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ activeTab }) => {
  const { toast } = useToast();
  
  // Mock data for users
  const [users] = useState([
    { id: 1, name: "John Smith", email: "john@example.com", role: "agent", status: "active" },
    { id: 2, name: "Maria Rodriguez", email: "maria@example.com", role: "owner", status: "active" },
    { id: 3, name: "Robert Lee", email: "robert@example.com", role: "buyer", status: "active" },
    { id: 4, name: "Sarah Johnson", email: "sarah@example.com", role: "agent", status: "active" },
    { id: 5, name: "David Miller", email: "david@example.com", role: "owner", status: "pending" },
  ]);
  
  const handleApproveUser = (id: number) => {
    toast({
      title: "User Approved",
      description: "User has been successfully approved.",
    });
    // In a real app, this would call an API to update the user status
  };
  
  const handleRejectUser = (id: number) => {
    toast({
      title: "User Rejected",
      description: "User has been rejected.",
      variant: "destructive",
    });
    // In a real app, this would call an API to update the user status
  };
  
  if (activeTab === "users") {
    return (
      <div>
        <h2 className="text-xl font-bold mb-6">User Management</h2>
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <User className="h-6 w-6 text-gray-500" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 
                        user.role === 'agent' ? 'bg-blue-100 text-blue-800' : 
                        user.role === 'owner' ? 'bg-green-100 text-green-800' : 
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.status === 'active' ? 'bg-green-100 text-green-800' : 
                        user.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'
                      }`}>
                        {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        {user.status === 'pending' ? (
                          <>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-green-600 hover:text-green-800 hover:bg-green-50"
                              onClick={() => handleApproveUser(user.id)}
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-red-600 hover:text-red-800 hover:bg-red-50"
                              onClick={() => handleRejectUser(user.id)}
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </>
                        ) : (
                          <Button variant="ghost" size="sm" className="text-estate-primary">Edit</Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  if (activeTab === "analytics") {
    return (
      <div>
        <h2 className="text-xl font-bold mb-6">Analytics</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <PieChart className="mr-2 h-5 w-5 text-estate-primary" />
              Property Types Distribution
            </h3>
            <div className="h-64 flex items-center justify-center">
              <p className="text-gray-500">Pie chart showing property types will appear here</p>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <BarChart className="mr-2 h-5 w-5 text-estate-primary" />
              Monthly Sales
            </h3>
            <div className="h-64 flex items-center justify-center">
              <p className="text-gray-500">Bar chart showing monthly sales will appear here</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-medium mb-4 flex items-center">
            <Activity className="mr-2 h-5 w-5 text-estate-primary" />
            Website Traffic
          </h3>
          <div className="h-64 flex items-center justify-center">
            <p className="text-gray-500">Line chart showing website traffic will appear here</p>
          </div>
        </div>
      </div>
    );
  }

  // Default: Overview
  return (
    <div>
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Users</h3>
            <Users className="h-6 w-6 text-estate-primary" />
          </div>
          <p className="text-3xl font-bold mt-2">{users.length}</p>
          <p className="text-green-500 text-sm mt-1">+2 this week</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Properties</h3>
            <Home className="h-6 w-6 text-estate-primary" />
          </div>
          <p className="text-3xl font-bold mt-2">{properties.length}</p>
          <p className="text-green-500 text-sm mt-1">+3 this month</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Agents</h3>
            <Users className="h-6 w-6 text-estate-primary" />
          </div>
          <p className="text-3xl font-bold mt-2">{agents.length}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Revenue</h3>
            <DollarSign className="h-6 w-6 text-estate-primary" />
          </div>
          <p className="text-3xl font-bold mt-2">$57,500</p>
          <p className="text-green-500 text-sm mt-1">+8% from last month</p>
        </div>
      </div>
      
      {/* Pending Approvals */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
        <h2 className="text-xl font-bold mb-4">Pending Approvals</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.filter(user => user.status === 'pending').map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <User className="h-6 w-6 text-gray-500" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap capitalize">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 
                      user.role === 'agent' ? 'bg-blue-100 text-blue-800' : 
                      user.role === 'owner' ? 'bg-green-100 text-green-800' : 
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date().toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-green-600 hover:text-green-800 hover:bg-green-50"
                        onClick={() => handleApproveUser(user.id)}
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-600 hover:text-red-800 hover:bg-red-50"
                        onClick={() => handleRejectUser(user.id)}
                      >
                        <XCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {users.filter(user => user.status === 'pending').length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                    No pending approvals
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Recent Properties */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-bold mb-4">Recent Properties</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Agent</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {properties.slice(0, 5).map((property) => (
                <tr key={property.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <img className="h-10 w-10 rounded-md object-cover" src={property.images[0]} alt="" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{property.title}</div>
                        <div className="text-sm text-gray-500">{property.location.city}, {property.location.state}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      property.features.status === 'for-sale' ? 'bg-green-100 text-green-800' : 
                      property.features.status === 'for-rent' ? 'bg-blue-100 text-blue-800' : 
                      property.features.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {property.features.status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{property.agent.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${property.price.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link to={`/property/${property.id}`}>
                      <Button variant="ghost" size="sm" className="text-estate-primary">View</Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
