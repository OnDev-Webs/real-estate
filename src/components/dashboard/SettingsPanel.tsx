
import { useAuth } from "@/contexts/AuthContext";
import ProfileSettings from "@/components/admin/ProfileSettings";

const SettingsPanel = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
      
      {/* For all users (buyer, seller, agent, admin), show profile settings */}
      <ProfileSettings />
      
      {/* Only admin users see additional settings */}
      {isAdmin && (
        <div className="space-y-6 mt-8">
          <div className="p-4 border rounded-md bg-gray-50">
            <h3 className="text-lg font-medium mb-2">Admin Controls</h3>
            <p className="text-gray-500">
              As an admin, you have access to additional settings and controls to manage the platform.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPanel;
