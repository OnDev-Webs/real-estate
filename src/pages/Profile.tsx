import { useState, useEffect } from "react";
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
  Briefcase,
  Loader2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { updateUserProfile, updatePassword } from "@/services/authService";

const Profile = () => {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // If no authenticated user, we'll use a mock user for demo
  const mockUser = user || {
    id: "user-1",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    role: "buyer",
    phone: "+1 (555) 123-4567",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    bio: "Looking for my dream home in the city center with a nice view and close to amenities."
  };

  const [formData, setFormData] = useState({
    name: mockUser.name,
    email: mockUser.email,
    phone: mockUser.phone || "",
    bio: mockUser.bio || "",
    address: user?.address || "123 Main Street, New York, NY 10001",
    city: user?.city || "New York",
    state: user?.state || "NY",
    zipCode: user?.zipCode || "10001",
    country: user?.country || "United States",
    company: user?.company || (user?.role === "agent" ? "City Real Estate" : ""),
    experience: user?.role === "agent" ? "5 years" : "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  // Update form data when user data changes
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name,
        email: user.email,
        phone: user.phone || prev.phone,
        bio: user.bio || prev.bio,
        address: user.address || prev.address,
        city: user.city || prev.city,
        state: user.state || prev.state,
        zipCode: user.zipCode || prev.zipCode,
        country: user.country || prev.country,
        company: user.company || prev.company
      }));
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Prepare data for API call
      const profileData = {
        name: formData.name,
        phone: formData.phone,
        bio: formData.bio,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        country: formData.country,
        company: formData.company
      };
      
      // Call API to update profile
      await updateUserProfile(profileData);
      
      // Refresh user data in context
      if (refreshUser) {
        await refreshUser();
      }
      
      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully."
      });
    } catch (error) {
      let errorMessage = "Failed to update profile. Please try again.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Validate password match
      if (formData.newPassword !== formData.confirmPassword) {
        toast({
          title: "Passwords don't match",
          description: "New password and confirm password must match.",
          variant: "destructive"
        });
        return;
      }
      
      // Call API to update password
      await updatePassword(formData.currentPassword, formData.newPassword);
      
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
    } catch (error) {
      let errorMessage = "Failed to update password. Please try again.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
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
                    src={user?.avatar || mockUser.avatar} 
                    alt={user?.name || mockUser.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h2 className="text-xl font-bold">{user?.name || mockUser.name}</h2>
                <p className="text-gray-500 capitalize">{user?.role || mockUser.role}</p>
                
                <div className="w-full mt-6 space-y-4">
                  <div className="flex items-center text-gray-600">
                    <Mail className="w-5 h-5 mr-3" />
                    <span>{user?.email || mockUser.email}</span>
                  </div>
                  
                  {(user?.phone || mockUser.phone) && (
                    <div className="flex items-center text-gray-600">
                      <Phone className="w-5 h-5 mr-3" />
                      <span>{user?.phone || mockUser.phone}</span>
                    </div>
                  )}
                  
                  {(user?.address || formData.address) && (
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-5 h-5 mr-3" />
                      <span>{user?.city || formData.city}, {user?.country || formData.country}</span>
                    </div>
                  )}
                  
                  {(user?.role === "agent" || mockUser.role === "agent") && (
                    <div className="flex items-center text-gray-600">
                      <Building className="w-5 h-5 mr-3" />
                      <span>{user?.company || formData.company}</span>
                    </div>
                  )}
                  
                  {(user?.role === "agent" || mockUser.role === "agent") && (
                    <div className="flex items-center text-gray-600">
                      <Briefcase className="w-5 h-5 mr-3" />
                      <span>{formData.experience}</span>
                    </div>
                  )}
                </div>
                
                {(user?.bio || mockUser.bio) && (
                  <div className="mt-6 border-t pt-6 w-full">
                    <h3 className="font-medium mb-2">About</h3>
                    <p className="text-gray-600 text-sm">{user?.bio || mockUser.bio}</p>
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
                          readOnly
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
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">City</label>
                        <Input
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">State</label>
                        <Input
                          name="state"
                          value={formData.state}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Zip Code</label>
                        <Input
                          name="zipCode"
                          value={formData.zipCode}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Country</label>
                        <Input
                          name="country"
                          value={formData.country}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    
                    {(user?.role === "agent" || mockUser.role === "agent") && (
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
                        name="bio"
                        value={formData.bio}
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
                            src={user?.avatar || mockUser.avatar} 
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
                    
                    <Button type="submit" className="bg-estate-primary hover:bg-estate-primary/90" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        "Save Changes"
                      )}
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
                    
                    <Button 
                      type="submit" 
                      className="bg-estate-primary hover:bg-estate-primary/90"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        "Update Password"
                      )}
                    </Button>
                  </form>
                </TabsContent>
                
                {/* Preferences Tab */}
                <TabsContent value="preferences">
                  <div className="py-4">
                    <p className="text-sm text-gray-500 mb-4">
                      To manage your notification preferences, visit the Settings panel in your dashboard.
                    </p>
                    
                    <Button 
                      type="button" 
                      className="mt-6 bg-estate-primary hover:bg-estate-primary/90"
                      onClick={() => navigate("/dashboard?tab=settings")}
                    >
                      Go to Settings
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