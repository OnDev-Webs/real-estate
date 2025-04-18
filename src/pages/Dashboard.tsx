
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
import EditPropertyContent from "@/components/dashboard/EditPropertyContent";
import MessageContent from "@/components/dashboard/MessageContent";
import NotificationContent from "@/components/dashboard/NotificationContent";
import { isAuthenticated } from "@/services/utils/apiHelpers";
import { getUserNotifications } from "@/services/notificationService";
import { Badge } from "@/components/ui/badge";
import ProfileSettings from "@/components/admin/ProfileSettings";

const Dashboard = () => {
  const [searchParams] = useSearchParams();
  const tabFromUrl = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState(tabFromUrl || "overview");
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  
  useEffect(() => {
    if (tabFromUrl) {
      setActiveTab(tabFromUrl);
    }
  }, [tabFromUrl]);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }
    
    if (user?.role === "admin" && 
        !activeTab.includes("add-property") && 
        !activeTab.includes("edit-property")) {
      navigate('/admin');
    }
  }, [user, navigate, activeTab]);

  useEffect(() => {
    const checkNotifications = async () => {
      if (!user) return;
      
      try {
        console.log("Checking for notifications...");
        const notifications = await getUserNotifications();
        console.log("Received notifications:", notifications);
        const unreadCount = notifications.filter(notification => !notification.read).length;
        setUnreadNotifications(unreadCount);
      } catch (error) {
        console.error("Error checking notifications:", error);
      }
    };
    
    checkNotifications();
    
    const interval = setInterval(checkNotifications, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, [user]);

  const role = user?.role || "buyer";

  const renderDashboardContent = () => {
    if (activeTab === "settings") {
      return <SettingsPanel />;
    } else if (activeTab === "profile") {
      return <ProfileSettings />;
    } else if (activeTab === "notifications") {
      return <NotificationContent />;
    } else if (activeTab === "messages") {
      return <MessageContent />;
    } else if (activeTab === "add-property") {
      return <AddPropertyContent />;
    } else if (activeTab === "edit-property") {
      return <EditPropertyContent />;
    }
    
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
    navigate('/');
  };

  const handleTabChange = (tab: string) => {
    if ((tab === "add-property" || tab === "edit-property") && !isAuthenticated()) {
      navigate('/login');
      return;
    }
    
    setActiveTab(tab);
    navigate(`/dashboard?tab=${tab}`);
  };

  if (user?.role === "admin" && 
      activeTab !== "add-property" && 
      activeTab !== "edit-property") {
    return null;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
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
            
            {(role === "owner" || role === "agent" || role === "admin") && (
              <Button
                variant="ghost"
                className={`w-full justify-start ${activeTab === "add-property" ? "bg-gray-100" : ""}`}
                onClick={() => handleTabChange("add-property")}
              >
                <Plus className="mr-2 h-5 w-5" />
                Add Property
              </Button>
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
            
            {(role === "owner" || role === "agent" || role === "admin") && (
              <Button
                variant="ghost"
                className={`w-full justify-start ${activeTab === "properties" ? "bg-gray-100" : ""}`}
                onClick={() => handleTabChange("properties")}
              >
                <Home className="mr-2 h-5 w-5" />
                My Properties
              </Button>
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
            

            {(role === "owner" || role === "agent" || role === "admin") && (

            <Button
              variant="ghost"
              className={`w-full justify-start ${activeTab === "notifications" ? "bg-gray-100" : ""}`}
              onClick={() => handleTabChange("notifications")}
            >
              <Bell className="mr-2 h-5 w-5" />
              Notifications
              {unreadNotifications > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {unreadNotifications}
                </Badge>
              )}
            </Button>
            )}
            
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
            <Button 
              variant="ghost" 
              className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-5 w-5" />
              Sign Out
            </Button>
          </div>
        </div>
      </aside>
      
      <main className="flex-1">
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
          </div>
          
          {renderDashboardContent()}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
