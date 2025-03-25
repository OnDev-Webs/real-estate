
import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  Building2, 
  Plus, 
  Home, 
  Users, 
  Bell, 
  MessageSquare,
  Settings,
  LogOut,
  Heart,
  DollarSign,
  List,
  Activity,
  UserRound,
  Shield
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import BuyerDashboard from "@/components/dashboard/BuyerDashboard";
import OwnerDashboard from "@/components/dashboard/OwnerDashboard";
import AgentDashboard from "@/components/dashboard/AgentDashboard";
import AdminDashboard from "@/components/dashboard/AdminDashboard";
import SettingsPanel from "@/components/dashboard/SettingsPanel";
import AddPropertyContent from "@/components/dashboard/AddPropertyContent";
import MessageContent from "@/components/dashboard/MessageContent";
import NotificationContent from "@/components/dashboard/NotificationContent";
import ProfileContent from "@/components/dashboard/ProfileContent";

const Dashboard = () => {
  const [searchParams] = useSearchParams();
  const tabFromUrl = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState(tabFromUrl || "overview");
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  // Update active tab when URL changes
  useEffect(() => {
    if (tabFromUrl) {
      setActiveTab(tabFromUrl);
    }
  }, [tabFromUrl]);

  // Default role to buyer if not authenticated
  const role = user?.role || "buyer";

  const renderDashboardContent = () => {
    // Handle settings, profile, notifications, messages tabs
    if (activeTab === "settings") {
      return <SettingsPanel />;
    } else if (activeTab === "profile") {
      return <ProfileContent />;
    } else if (activeTab === "notifications") {
      return <NotificationContent />;
    } else if (activeTab === "messages") {
      return <MessageContent />;
    } else if (activeTab === "add-property") {
      return <AddPropertyContent />;
    }
    
    // Handle role-specific dashboards
    switch (role) {
      case "buyer":
        return <BuyerDashboard activeTab={activeTab} />;
      case "owner":
        return <OwnerDashboard activeTab={activeTab} />;
      case "agent":
        return <AgentDashboard activeTab={activeTab} />;
      case "admin":
        return <AdminDashboard activeTab={activeTab} />;
      default:
        return <BuyerDashboard activeTab={activeTab} />;
    }
  };

  const handleLogout = () => {
    logout();
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    // Update URL with the new tab
    navigate(`/dashboard?tab=${tab}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:block">
        <div className="h-full flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <Link to="/" className="flex items-center space-x-2">
            <h4 className="text-black">Real estate</h4>
            </Link>
          </div>
          
          <div className="p-4 border-b border-gray-200 ms-3">
            <div className="flex items-center space-x-3 hover:opacity-80 transition-opacity cursor-pointer" onClick={() => handleTabChange("profile")}>
             
              <div>
                <h4>Welcome</h4>
                <h5 className="font-medium">{user?.name || "Guest"}</h5>
              </div>
            </div>
          </div>
          
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            <Button
              variant="ghost"
              className={`w-full justify-start ${activeTab === "overview" ? "bg-gray-100" : ""}`}
              onClick={() => handleTabChange("overview")}
            >
              <LayoutDashboard className="mr-2 h-5 w-5" />
              Dashboard
            </Button>
            
            {(role === "owner" || role === "agent") && (
              <>

            {/* Add Property button now sets the activeTab instead of navigating */}
            <Button
              variant="ghost"
              className={`w-full justify-start ${activeTab === "add-property" ? "bg-gray-100" : ""}`}
              onClick={() => handleTabChange("add-property")}
            >
              <Plus className="mr-2 h-5 w-5" />
              Add Property
            </Button>
            </>
            )}
            {(role === "buyer" || !user) && (
              <>
                <Button
                  variant="ghost"
                  className={`w-full justify-start ${activeTab === "favorites" ? "bg-gray-100" : ""}`}
                  onClick={() => handleTabChange("favorites")}
                >
                  <Heart className="mr-2 h-5 w-5" />
                  Favorites
                </Button>
                <Button
                  variant="ghost"
                  className={`w-full justify-start ${activeTab === "search" ? "bg-gray-100" : ""}`}
                  onClick={() => handleTabChange("search")}
                >
                  <List className="mr-2 h-5 w-5" />
                  Property Search
                </Button>
              </>
            )}
            
            {(role === "owner" || role === "agent") && (
              <>
                <Button
                  variant="ghost"
                  className={`w-full justify-start ${activeTab === "properties" ? "bg-gray-100" : ""}`}
                  onClick={() => handleTabChange("properties")}
                >
                  <Home className="mr-2 h-5 w-5" />
                  My Properties
                </Button>
                
              </>
            )}
            
            {role === "agent" && (
              <Button
                variant="ghost"
                className={`w-full justify-start ${activeTab === "clients" ? "bg-gray-100" : ""}`}
                onClick={() => handleTabChange("clients")}
              >
                <Users className="mr-2 h-5 w-5" />
                Client Leads
              </Button>
            )}
            
            {role === "admin" && (
              <>
                <Button
                  variant="ghost"
                  className={`w-full justify-start ${activeTab === "users" ? "bg-gray-100" : ""}`}
                  onClick={() => handleTabChange("users")}
                >
                  <Users className="mr-2 h-5 w-5" />
                  Users
                </Button>
                <Button
                  variant="ghost"
                  className={`w-full justify-start ${activeTab === "analytics" ? "bg-gray-100" : ""}`}
                  onClick={() => handleTabChange("analytics")}
                >
                  <Activity className="mr-2 h-5 w-5" />
                  Analytics
                </Button>
                <Button
                  variant="ghost"
                  className={`w-full justify-start ${activeTab === "admin-portal" ? "bg-gray-100" : ""}`}
                  onClick={() => handleTabChange("admin-portal")}
                >
                  <Shield className="mr-2 h-5 w-5" />
                  Admin Portal
                </Button>
              </>
            )}
            
            <Button
              variant="ghost"
              className={`w-full justify-start ${activeTab === "notifications" ? "bg-gray-100" : ""}`}
              onClick={() => handleTabChange("notifications")}
            >
              <Bell className="mr-2 h-5 w-5" />
              Notifications
            </Button>
            
            <Button
              variant="ghost"
              className={`w-full justify-start ${activeTab === "settings" ? "bg-gray-100" : ""}`}
              onClick={() => handleTabChange("settings")}
            >
              <Settings className="mr-2 h-5 w-5" />
              Settings
            </Button>
          </nav>
          
          <div className="p-4 border-t border-gray-200">
            {user ? (
              <Button 
                variant="ghost" 
                className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-5 w-5" />
                Sign Out
              </Button>
            ) : (
              <Button 
                variant="ghost" 
                className="w-full justify-start"
                onClick={() => navigate('/login')}
              >
                <LogOut className="mr-2 h-5 w-5" />
                Sign In
              </Button>
            )}
          </div>
        </div>
      </aside>
      
      {/* Main Content */}
      <main className="flex-1">
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            {/* Header content if needed */}
          </div>
          
          {renderDashboardContent()}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
