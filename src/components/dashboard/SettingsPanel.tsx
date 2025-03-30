
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { updateNotificationPreferences } from "@/services/authService";
import { Bell, Lock, User, Eye } from "lucide-react";

const SettingsPanel = () => {
  const { user, refreshUser, setShareProfile } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  // Set default preferences
  const [emailNotifications, setEmailNotifications] = useState(
    user?.preferences?.emailNotifications !== false
  );
  const [listingUpdates, setListingUpdates] = useState(
    user?.preferences?.listings !== false
  );
  const [messageNotifications, setMessageNotifications] = useState(
    user?.preferences?.messages !== false
  );
  const [shareProfile, setShareProfileState] = useState(
    user?.preferences?.shareProfile === true
  );

  const handleNotificationChange = async () => {
    setIsLoading(true);
    try {
      await updateNotificationPreferences({
        emailNotifications,
        listings: listingUpdates,
        messages: messageNotifications,
      });
      
      await refreshUser();
      
      toast({
        title: "Settings updated",
        description: "Your notification preferences have been saved.",
      });
    } catch (error) {
      console.error("Error updating notification preferences:", error);
      toast({
        title: "Update failed",
        description: "There was a problem updating your preferences.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleShareProfileChange = async (share: boolean) => {
    setShareProfileState(share);
    try {
      await setShareProfile(share);
    } catch (error) {
      // Reset to previous state if failed
      setShareProfileState(!share);
      console.error("Error updating profile sharing preference:", error);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
      
      {/* Notifications Settings */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center">
            <Bell className="mr-2 h-5 w-5" />
            Notification Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="email-notifications" className="text-base">Email Notifications</Label>
              <p className="text-sm text-gray-500">Receive email updates about your account activity</p>
            </div>
            <Switch 
              id="email-notifications" 
              checked={emailNotifications} 
              onCheckedChange={setEmailNotifications}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="listing-updates" className="text-base">Listing Updates</Label>
              <p className="text-sm text-gray-500">Get notified about new property listings that match your criteria</p>
            </div>
            <Switch 
              id="listing-updates" 
              checked={listingUpdates} 
              onCheckedChange={setListingUpdates}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="message-notifications" className="text-base">Message Notifications</Label>
              <p className="text-sm text-gray-500">Receive notifications when someone sends you a message</p>
            </div>
            <Switch 
              id="message-notifications" 
              checked={messageNotifications} 
              onCheckedChange={setMessageNotifications}
            />
          </div>
          
          <Button 
            className="mt-4" 
            onClick={handleNotificationChange}
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Save Notification Settings"}
          </Button>
        </CardContent>
      </Card>
      
      {/* Privacy Settings */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center">
            <Eye className="mr-2 h-5 w-5" />
            Privacy Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="share-profile" className="text-base">Share Profile with Property Owners</Label>
              <p className="text-sm text-gray-500">
                Allow property owners to see your profile information when you interact with their listings
              </p>
            </div>
            <Switch 
              id="share-profile" 
              checked={shareProfile} 
              onCheckedChange={handleShareProfileChange}
            />
          </div>
        </CardContent>
      </Card>
      
      {/* Security Settings */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center">
            <Lock className="mr-2 h-5 w-5" />
            Security Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Button variant="outline" asChild>
            <a href="/dashboard?tab=security">Manage Security Settings</a>
          </Button>
        </CardContent>
      </Card>
      
      {/* Account Settings */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center">
            <User className="mr-2 h-5 w-5" />
            Account Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Button variant="outline" asChild>
            <a href="/dashboard?tab=profile">Edit Profile Information</a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPanel;
