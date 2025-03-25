
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Users,
  Home,
  BarChart3,
  Settings,
  Search,
  Plus,
  MoreHorizontal,
  ArrowUpRight,
  ArrowDownRight,
  LucideDollarSign,
  Building,
  UserCheck,
  Activity,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Sample data for charts
const revenueData = [
  { name: "Jan", value: 12400 },
  { name: "Feb", value: 14800 },
  { name: "Mar", value: 11200 },
  { name: "Apr", value: 18600 },
  { name: "May", value: 16400 },
  { name: "Jun", value: 21200 },
];

const userActivityData = [
  { name: "Mon", value: 340 },
  { name: "Tue", value: 580 },
  { name: "Wed", value: 420 },
  { name: "Thu", value: 720 },
  { name: "Fri", value: 680 },
  { name: "Sat", value: 890 },
  { name: "Sun", value: 540 },
];

const propertyTypeData = [
  { name: "Houses", value: 45 },
  { name: "Apartments", value: 35 },
  { name: "Commercial", value: 10 },
  { name: "Land", value: 10 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

// Sample user and property data
const users = [
  {
    id: 1,
    name: "Jane Cooper",
    email: "jane.cooper@example.com",
    role: "Agent",
    status: "Active",
    joined: "Jan 12, 2023",
    listings: 8,
  },
  {
    id: 2,
    name: "Robert Fox",
    email: "robert.fox@example.com",
    role: "Buyer",
    status: "Active",
    joined: "Feb 4, 2023",
    listings: 0,
  },
  {
    id: 3,
    name: "Wade Warren",
    email: "wade.warren@example.com",
    role: "Owner",
    status: "Inactive",
    joined: "Mar 15, 2023",
    listings: 3,
  },
  {
    id: 4,
    name: "Esther Howard",
    email: "esther.howard@example.com",
    role: "Agent",
    status: "Active",
    joined: "Apr 28, 2023",
    listings: 12,
  },
  {
    id: 5,
    name: "Cameron Williamson",
    email: "cameron.williamson@example.com",
    role: "Buyer",
    status: "Active",
    joined: "May 10, 2023",
    listings: 0,
  },
];

const properties = [
  {
    id: 1,
    title: "Modern Apartment in Downtown",
    price: 350000,
    status: "For Sale",
    type: "Apartment",
    location: "New York",
    date: "Jun 2, 2023",
    views: 234,
  },
  {
    id: 2,
    title: "Luxury Villa with Pool",
    price: 1200000,
    status: "For Sale",
    type: "House",
    location: "Los Angeles",
    date: "Jun 8, 2023",
    views: 456,
  },
  {
    id: 3,
    title: "Office Space in Business District",
    price: 4500,
    status: "For Rent",
    type: "Commercial",
    location: "Chicago",
    date: "Jun 12, 2023",
    views: 128,
  },
  {
    id: 4,
    title: "Cozy Studio Near University",
    price: 1200,
    status: "For Rent",
    type: "Apartment",
    location: "Boston",
    date: "Jun 15, 2023",
    views: 189,
  },
  {
    id: 5,
    title: "Family Home with Garden",
    price: 520000,
    status: "For Sale",
    type: "House",
    location: "Seattle",
    date: "Jun 18, 2023",
    views: 312,
  },
];

const AdminDashboard = () => {
  const [searchUser, setSearchUser] = useState("");
  const [searchProperty, setSearchProperty] = useState("");

  // Filter users based on search term
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchUser.toLowerCase()) ||
      user.email.toLowerCase().includes(searchUser.toLowerCase())
  );

  // Filter properties based on search term
  const filteredProperties = properties.filter(
    (property) =>
      property.title.toLowerCase().includes(searchProperty.toLowerCase()) ||
      property.location.toLowerCase().includes(searchProperty.toLowerCase())
  );

  // Format price
  const formatPrice = (price: number) => {
    return price >= 10000
      ? `$${(price / 1000).toFixed(0)}k`
      : `$${price}`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f9f9f9]">
      <Header />
      
      <div className="container mx-auto py-6 flex-1">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <Button className="bg-black hover:bg-black/90 text-white">
            <Plus className="mr-2 h-4 w-4" />
            Add New Property
          </Button>
        </div>
        
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid grid-cols-4 max-w-[600px]">
            <TabsTrigger value="overview" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Users</span>
            </TabsTrigger>
            <TabsTrigger value="properties" className="gap-2">
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">Properties</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Settings</span>
            </TabsTrigger>
          </TabsList>
          
          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Revenue
                  </CardTitle>
                  <LucideDollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$86,432</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-500 inline-flex items-center">
                      <ArrowUpRight className="mr-1 h-3 w-3" />
                      +12.5%
                    </span>{" "}
                    from last month
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Properties Listed
                  </CardTitle>
                  <Building className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">2,856</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-500 inline-flex items-center">
                      <ArrowUpRight className="mr-1 h-3 w-3" />
                      +24.3%
                    </span>{" "}
                    from last month
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Active Users
                  </CardTitle>
                  <UserCheck className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12,234</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-500 inline-flex items-center">
                      <ArrowUpRight className="mr-1 h-3 w-3" />
                      +8.2%
                    </span>{" "}
                    from last month
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Conversion Rate
                  </CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3.2%</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-red-500 inline-flex items-center">
                      <ArrowDownRight className="mr-1 h-3 w-3" />
                      -1.1%
                    </span>{" "}
                    from last month
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7 mt-6">
              <Card className="lg:col-span-4">
                <CardHeader>
                  <CardTitle>Revenue Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#000000" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              
              <Card className="lg:col-span-3">
                <CardHeader>
                  <CardTitle>Property Distribution</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={propertyTypeData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {propertyTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
            
            <div className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>User Activity</CardTitle>
                  <CardDescription>User interactions over the past week</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={userActivityData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#000000"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Users Tab */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <CardTitle>Registered Users</CardTitle>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search users..."
                      className="pl-8 w-full sm:w-[300px]"
                      value={searchUser}
                      onChange={(e) => setSearchUser(e.target.value)}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead>Listings</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="font-medium">{user.name}</span>
                              <span className="text-sm text-muted-foreground">
                                {user.email}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>{user.role}</TableCell>
                          <TableCell>
                            <Badge
                              variant={user.status === "Active" ? "default" : "secondary"}
                              className={
                                user.status === "Active"
                                  ? "bg-green-100 text-green-800 hover:bg-green-100 hover:text-green-800"
                                  : "bg-gray-100 text-gray-800 hover:bg-gray-100 hover:text-gray-800"
                              }
                            >
                              {user.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{user.joined}</TableCell>
                          <TableCell>{user.listings}</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Properties Tab */}
          <TabsContent value="properties">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <CardTitle>Listed Properties</CardTitle>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search properties..."
                      className="pl-8 w-full sm:w-[300px]"
                      value={searchProperty}
                      onChange={(e) => setSearchProperty(e.target.value)}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Property</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Views</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredProperties.map((property) => (
                        <TableRow key={property.id}>
                          <TableCell>
                            <div className="font-medium">{property.title}</div>
                            <div className="text-sm text-muted-foreground">
                              Added: {property.date}
                            </div>
                          </TableCell>
                          <TableCell>
                            {typeof property.price === 'number' ? formatPrice(property.price) : property.price}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={
                                property.status === "For Sale"
                                  ? "border-blue-500 text-blue-500"
                                  : "border-purple-500 text-purple-500"
                              }
                            >
                              {property.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{property.type}</TableCell>
                          <TableCell>{property.location}</TableCell>
                          <TableCell>{property.views}</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Dashboard Settings</CardTitle>
                <CardDescription>
                  Manage your dashboard preferences and configurations.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">General Settings</h3>
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <label htmlFor="siteName">Site Name</label>
                      <Input id="siteName" defaultValue="Jugyah Real Estate" />
                    </div>
                    <div className="grid gap-2">
                      <label htmlFor="siteDescription">Site Description</label>
                      <Input
                        id="siteDescription"
                        defaultValue="Find your perfect property with our expert guidance"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Admin Preferences</h3>
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <label htmlFor="email">Admin Email</label>
                      <Input id="email" type="email" defaultValue="admin@jugyah.com" />
                    </div>
                    <div className="grid gap-2">
                      <label htmlFor="notifications">Notification Email</label>
                      <Input
                        id="notifications"
                        type="email"
                        defaultValue="notifications@jugyah.com"
                      />
                    </div>
                  </div>
                </div>
                
                <Button className="bg-black hover:bg-black/90 text-white">Save Changes</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      <Footer />
    </div>
  );
};

export default AdminDashboard;
