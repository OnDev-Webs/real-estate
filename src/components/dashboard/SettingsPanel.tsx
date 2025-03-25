
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { Save, BellRing, Mail, Lock, Shield, UserRound } from 'lucide-react';

const SettingsPanel = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  
  // Form states
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);
  
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Settings Updated",
        description: "Your settings have been successfully saved."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update settings. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" defaultValue="John Doe" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" defaultValue="john.doe@example.com" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" defaultValue="+1 (555) 123-4567" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea 
                id="bio" 
                defaultValue="Real estate enthusiast with a passion for finding the perfect home."
                className="min-h-32"
              />
            </div>
          </div>
        );
        
      case "notifications":
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium mb-4">Notification Preferences</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Email Notifications</Label>
                  <p className="text-sm text-gray-500">Receive updates via email</p>
                </div>
                <Switch 
                  checked={emailNotifications} 
                  onCheckedChange={setEmailNotifications}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Push Notifications</Label>
                  <p className="text-sm text-gray-500">Receive notifications on your device</p>
                </div>
                <Switch 
                  checked={pushNotifications} 
                  onCheckedChange={setPushNotifications} 
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Marketing Emails</Label>
                  <p className="text-sm text-gray-500">Receive promotional content and offers</p>
                </div>
                <Switch 
                  checked={marketingEmails} 
                  onCheckedChange={setMarketingEmails} 
                />
              </div>
            </div>
          </div>
        );
        
      case "security":
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium mb-4">Security Settings</h3>
            
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input id="currentPassword" type="password" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input id="newPassword" type="password" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input id="confirmPassword" type="password" />
            </div>
            
            <div className="pt-4">
              <Button className="w-full bg-black hover:bg-black/90">Change Password</Button>
            </div>
            
            <div className="pt-4 border-t border-gray-200">
              <h4 className="text-md font-medium mb-2">Two-Factor Authentication</h4>
              <p className="text-sm text-gray-500 mb-4">
                Add an extra layer of security to your account by enabling two-factor authentication.
              </p>
              <Button variant="outline" className="w-full">Enable 2FA</Button>
            </div>
          </div>
        );
        
      case "privacy":
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium mb-4">Privacy Settings</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Profile Visibility</Label>
                  <p className="text-sm text-gray-500">Make your profile visible to other users</p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Contact Information</Label>
                  <p className="text-sm text-gray-500">Show your contact information publicly</p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Location Data</Label>
                  <p className="text-sm text-gray-500">Allow us to use your location data</p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Data Collection</Label>
                  <p className="text-sm text-gray-500">Allow us to collect usage data to improve services</p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
            
            <div className="pt-4 border-t border-gray-200">
              <h4 className="text-md font-medium mb-2">Data Management</h4>
              <p className="text-sm text-gray-500 mb-4">
                You can download or delete all your data from our platform.
              </p>
              <div className="flex gap-4">
                <Button variant="destructive" className="flex-2">Delete Account</Button>
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x">
        {/* Settings Navigation */}
        <nav className="p-4 space-y-1">
          <h2 className="text-xl font-bold mb-4">Settings</h2>
          <Button
            variant="ghost"
            className={`w-full justify-start ${activeTab === "profile" ? "bg-gray-100" : ""}`}
            onClick={() => setActiveTab("profile")}
          >
            <UserRound className="mr-2 h-5 w-5" />
            Profile
          </Button>
          <Button
            variant="ghost"
            className={`w-full justify-start ${activeTab === "notifications" ? "bg-gray-100" : ""}`}
            onClick={() => setActiveTab("notifications")}
          >
            <BellRing className="mr-2 h-5 w-5" />
            Notifications
          </Button>
          <Button
            variant="ghost"
            className={`w-full justify-start ${activeTab === "security" ? "bg-gray-100" : ""}`}
            onClick={() => setActiveTab("security")}
          >
            <Lock className="mr-2 h-5 w-5" />
            Security
          </Button>
          <Button
            variant="ghost"
            className={`w-full justify-start ${activeTab === "privacy" ? "bg-gray-100" : ""}`}
            onClick={() => setActiveTab("privacy")}
          >
            <Shield className="mr-2 h-5 w-5" />
            Privacy
          </Button>
        </nav>
        
        {/* Settings Content */}
        <div className="p-6 col-span-3">
          <form onSubmit={handleSave}>
            {renderTabContent()}
            
            <div className="mt-8 pt-4 border-t border-gray-200 flex justify-end">
              <Button 
                type="submit"
                className="bg-black hover:bg-black/90"
                disabled={isLoading}
              >
                <Save className="mr-2 h-4 w-4" />
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
