
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, 
  Mail, 
  Phone, 
  Lock, 
  Image,
  MapPin,
  Building,
  Briefcase
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // If no authenticated user, we'll use a mock user for demo
  const mockUser = user || {
    id: "user-1",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    role: "buyer",
    phone: "+1 (555) 123-4567",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    description: "Looking for my dream home in the city center with a nice view and close to amenities."
  };

  const [formData, setFormData] = useState({
    name: mockUser.name,
    email: mockUser.email,
    phone: mockUser.phone || "",
    description: mockUser.description || "",
    address: "123 Main Street, New York, NY 10001",
    company: user?.role === "agent" ? "City Real Estate" : "",
    experience: user?.role === "agent" ? "5 years" : "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would call an API to update the user profile
    toast({
      title: "Profile updated",
      description: "Your profile information has been updated successfully."
    });
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate password
    if (formData.newPassword !== formData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "New password and confirm password must match.",
        variant: "destructive"
      });
      return;
    }
    
    // In a real app, this would call an API to update the password
    toast({
      title: "Password updated",
      description: "Your password has been updated successfully."
    });
    
    // Clear password fields
    setFormData(prev => ({
      ...prev,
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with top navigation */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Profile</h1>
          <Button
            variant="outline"
            onClick={() => navigate("/dashboard")}
          >
            Back to Dashboard
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <Card className="lg:col-span-1">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center">
                <div className="w-32 h-32 rounded-full border-4 border-gray-100 overflow-hidden mb-4">
                  <img 
                    src={mockUser.avatar} 
                    alt={mockUser.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h2 className="text-xl font-bold">{mockUser.name}</h2>
                <p className="text-gray-500 capitalize">{mockUser.role}</p>
                
                <div className="w-full mt-6 space-y-4">
                  <div className="flex items-center text-gray-600">
                    <Mail className="w-5 h-5 mr-3" />
                    <span>{mockUser.email}</span>
                  </div>
                  
                  {mockUser.phone && (
                    <div className="flex items-center text-gray-600">
                      <Phone className="w-5 h-5 mr-3" />
                      <span>{mockUser.phone}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-5 h-5 mr-3" />
                    <span>New York, USA</span>
                  </div>
                  
                  {mockUser.role === "agent" && (
                    <div className="flex items-center text-gray-600">
                      <Building className="w-5 h-5 mr-3" />
                      <span>City Real Estate</span>
                    </div>
                  )}
                  
                  {mockUser.role === "agent" && (
                    <div className="flex items-center text-gray-600">
                      <Briefcase className="w-5 h-5 mr-3" />
                      <span>5 years experience</span>
                    </div>
                  )}
                </div>
                
                {mockUser.description && (
                  <div className="mt-6 border-t pt-6 w-full">
                    <h3 className="font-medium mb-2">About</h3>
                    <p className="text-gray-600 text-sm">{mockUser.description}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Edit Profile Tabs */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Edit Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="info">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="info">Personal Info</TabsTrigger>
                  <TabsTrigger value="security">Security</TabsTrigger>
                  <TabsTrigger value="preferences">Preferences</TabsTrigger>
                </TabsList>
                
                {/* Personal Info Tab */}
                <TabsContent value="info">
                  <form onSubmit={handleProfileSubmit} className="space-y-6 py-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                        <Input
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Email</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                        <Input
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Phone</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                        <Input
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Address</label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                        <Input
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    
                    {mockUser.role === "agent" && (
                      <>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Company</label>
                          <div className="relative">
                            <Building className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                            <Input
                              name="company"
                              value={formData.company}
                              onChange={handleChange}
                              className="pl-10"
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Experience</label>
                          <div className="relative">
                            <Briefcase className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                            <Input
                              name="experience"
                              value={formData.experience}
                              onChange={handleChange}
                              className="pl-10"
                            />
                          </div>
                        </div>
                      </>
                    )}
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Bio</label>
                      <Textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={4}
                        placeholder="Tell us about yourself"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Profile Picture</label>
                      <div className="flex items-center space-x-4">
                        <div className="h-16 w-16 rounded-full overflow-hidden bg-gray-100">
                          <img 
                            src={mockUser.avatar} 
                            alt="Profile" 
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <Button type="button" variant="outline" className="flex items-center">
                          <Image className="mr-2 h-4 w-4" />
                          Change Photo
                        </Button>
                      </div>
                    </div>
                    
                    <Button type="submit" className="bg-estate-primary hover:bg-estate-primary/90">
                      Save Changes
                    </Button>
                  </form>
                </TabsContent>
                
                {/* Security Tab */}
                <TabsContent value="security">
                  <form onSubmit={handlePasswordSubmit} className="space-y-6 py-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Current Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                        <Input
                          name="currentPassword"
                          type="password"
                          value={formData.currentPassword}
                          onChange={handleChange}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">New Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                        <Input
                          name="newPassword"
                          type="password"
                          value={formData.newPassword}
                          onChange={handleChange}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Confirm New Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                        <Input
                          name="confirmPassword"
                          type="password"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    
                    <Button type="submit" className="bg-estate-primary hover:bg-estate-primary/90">
                      Update Password
                    </Button>
                  </form>
                </TabsContent>
                
                {/* Preferences Tab */}
                <TabsContent value="preferences">
                  <div className="py-4">
                    <p className="text-sm text-gray-500 mb-4">
                      Customize your notification preferences and account settings.
                    </p>
                    
                    <div className="space-y-4">
                      {/* Notification preferences would go here */}
                      <div className="flex items-center justify-between border-b pb-4">
                        <div>
                          <h3 className="font-medium">Email Notifications</h3>
                          <p className="text-sm text-gray-500">Receive email updates about your account activity</p>
                        </div>
                        <div className="form-control">
                          <input type="checkbox" className="toggle" defaultChecked />
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between border-b pb-4">
                        <div>
                          <h3 className="font-medium">SMS Notifications</h3>
                          <p className="text-sm text-gray-500">Receive text messages for important updates</p>
                        </div>
                        <div className="form-control">
                          <input type="checkbox" className="toggle" />
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between pb-4">
                        <div>
                          <h3 className="font-medium">Marketing Communications</h3>
                          <p className="text-sm text-gray-500">Receive promotional offers and updates</p>
                        </div>
                        <div className="form-control">
                          <input type="checkbox" className="toggle" defaultChecked />
                        </div>
                      </div>
                    </div>
                    
                    <Button type="button" className="mt-6 bg-estate-primary hover:bg-estate-primary/90">
                      Save Preferences
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
