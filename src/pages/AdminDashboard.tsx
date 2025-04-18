import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, Users, Home, Settings, Bell, LogOut, Plus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdminNotifications from "@/components/admin/AdminNotifications";
import PropertyManagement from "@/components/admin/PropertyManagement";
import ProfileSettings from "@/components/admin/ProfileSettings";
import AdminDashboardComponent from "@/components/dashboard/AdminDashboard";
import UserTable from "@/components/admin/UserTable";
import AddPropertyContentAdmin from "@/components/admin/add-property";

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { from: location.pathname } });
      return;
    }

    if (user.role !== "admin") {
      toast({
        title: "Access Denied",
        description: "Only admin users can access this page.",
        variant: "destructive"
      });
      navigate('/dashboard');
      return;
    }

    const params = new URLSearchParams(location.search);
    const tab = params.get("tab");
    if (
      tab &&
      ["overview", "properties", "add-property", "users", "notifications", "settings"].includes(tab)
    ) {
      setActiveTab(tab);
    }
  }, [user, location, navigate, toast]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    navigate(`/admin?tab=${value}`);
  };

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate("/");
  };

  if (!user || user.role !== "admin") {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <div className="container mx-auto py-6 flex-1">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Welcome, {user?.name}</span>
            <button
              onClick={handleLogout}
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
          <TabsList className="grid grid-cols-6 w-full max-w-4xl">
            <TabsTrigger value="overview" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="properties" className="gap-2">
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">Properties</span>
            </TabsTrigger>
            <TabsTrigger value="add-property" className="gap-2">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Add New Property</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Users</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Settings</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <AdminDashboardComponent activeTab="overview" />
          </TabsContent>

          <TabsContent value="properties">
            <PropertyManagement />
          </TabsContent>

          <TabsContent value="add-property">
            <AddPropertyContentAdmin />
          </TabsContent>

          <TabsContent value="users">
            <UserTable activeTab="users" />
          </TabsContent>

          <TabsContent value="notifications">
            <AdminNotifications />
          </TabsContent>

          <TabsContent value="settings">
            <ProfileSettings />
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
};

export default AdminDashboard;
