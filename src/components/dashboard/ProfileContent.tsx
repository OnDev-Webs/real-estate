
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Briefcase, 
  Calendar, 
  Building, 
  Upload, 
  Shield 
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

const ProfileContent = () => {
  const { user } = useAuth();
  
  // Mock data - would come from API in a real app
  const mockUser = user || {
    id: "1",
    name: "John Smith",
    email: "john.smith@example.com",
    phone: "+91 9876543210",
    role: "owner",
    bio: "I'm a property owner with multiple properties in Mumbai. Looking to connect with reliable agents and potential buyers.",
    avatar: "https://res.cloudinary.com/dw7w2at8k/image/upload/v1736785538/ed060b47018885c4c6847048f8a83758_qgbypi.png",
    address: "123 Main Street, Bandra West",
    city: "Mumbai",
    state: "Maharashtra",
    zipCode: "400050",
    country: "India",
    company: "Smith Properties",
    website: "www.smithproperties.com",
    socialLinks: {
      facebook: "facebook.com/johnsmith",
      twitter: "twitter.com/johnsmith",
      linkedin: "linkedin.com/in/johnsmith",
      instagram: "instagram.com/johnsmith"
    },
    memberSince: "Jan 2023"
  };
  
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState(mockUser);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSocialLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [name]: value
      }
    }));
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      setUploadedImage(imageUrl);
    }
  };
  
  const handleSaveProfile = () => {
    // In a real app, this would call an API to update the user profile
    toast({
      title: "Profile Updated",
      description: "Your profile has been successfully updated",
    });
    
    setIsEditing(false);
  };
  
  return (
    <div>
      <Tabs defaultValue="profile">
        <TabsList className="mb-6">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Card */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="mb-6 relative w-32 h-32 mx-auto">
                  <Avatar className="w-32 h-32">
                    <AvatarImage src={uploadedImage || profileData.avatar} />
                    <AvatarFallback>{profileData.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  
                  {isEditing && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                      <label htmlFor="avatarUpload" className="cursor-pointer text-white">
                        <Upload className="h-6 w-6 mx-auto mb-1" />
                        <span className="text-xs">Change</span>
                        <input 
                          id="avatarUpload" 
                          type="file" 
                          className="hidden" 
                          accept="image/*"
                          onChange={handleImageChange}
                        />
                      </label>
                    </div>
                  )}
                </div>
                
                <h3 className="text-xl font-bold mb-1">{profileData.name}</h3>
                <p className="text-gray-500 capitalize mb-4">{profileData.role}</p>
                
                <div className="space-y-3 text-left">
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 text-gray-500 mr-2" />
                    <span>{profileData.email}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 text-gray-500 mr-2" />
                    <span>{profileData.phone}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 text-gray-500 mr-2" />
                    <span>{profileData.address}, {profileData.city}, {profileData.state}</span>
                  </div>
                  {profileData.company && (
                    <div className="flex items-center">
                      <Briefcase className="h-4 w-4 text-gray-500 mr-2" />
                      <span>{profileData.company}</span>
                    </div>
                  )}
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                    <span>Member since {profileData.memberSince}</span>
                  </div>
                </div>
                
                {!isEditing && (
                  <Button 
                    className="mt-6 bg-estate-primary hover:bg-estate-primary/90 w-full"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Profile
                  </Button>
                )}
              </CardContent>
            </Card>
            
            {/* Profile Details */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>{isEditing ? "Edit Profile" : "About Me"}</CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input 
                          id="name" 
                          name="name" 
                          value={profileData.name}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input 
                          id="email" 
                          name="email" 
                          type="email" 
                          value={profileData.email}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input 
                          id="phone" 
                          name="phone" 
                          value={profileData.phone}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="company">Company</Label>
                        <Input 
                          id="company" 
                          name="company" 
                          value={profileData.company}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="website">Website</Label>
                        <Input 
                          id="website" 
                          name="website" 
                          value={profileData.website}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea 
                        id="bio" 
                        name="bio" 
                        className="min-h-32"
                        value={profileData.bio}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Address</Label>
                      <Input 
                        id="address" 
                        name="address" 
                        value={profileData.address}
                        onChange={handleInputChange}
                        className="mb-2"
                      />
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        <Input 
                          id="city" 
                          name="city" 
                          placeholder="City"
                          value={profileData.city}
                          onChange={handleInputChange}
                        />
                        <Input 
                          id="state" 
                          name="state" 
                          placeholder="State"
                          value={profileData.state}
                          onChange={handleInputChange}
                        />
                        <Input 
                          id="zipCode" 
                          name="zipCode" 
                          placeholder="ZIP Code"
                          value={profileData.zipCode}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Social Media Links</Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <Input 
                          id="facebook" 
                          name="facebook" 
                          placeholder="Facebook URL"
                          value={profileData.socialLinks.facebook}
                          onChange={handleSocialLinkChange}
                        />
                        <Input 
                          id="twitter" 
                          name="twitter" 
                          placeholder="Twitter URL"
                          value={profileData.socialLinks.twitter}
                          onChange={handleSocialLinkChange}
                        />
                        <Input 
                          id="linkedin" 
                          name="linkedin" 
                          placeholder="LinkedIn URL"
                          value={profileData.socialLinks.linkedin}
                          onChange={handleSocialLinkChange}
                        />
                        <Input 
                          id="instagram" 
                          name="instagram" 
                          placeholder="Instagram URL"
                          value={profileData.socialLinks.instagram}
                          onChange={handleSocialLinkChange}
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-end space-x-3">
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setIsEditing(false);
                          setProfileData(mockUser);
                          setUploadedImage(null);
                        }}
                      >
                        Cancel
                      </Button>
                      <Button 
                        className="bg-estate-primary hover:bg-estate-primary/90"
                        onClick={handleSaveProfile}
                      >
                        Save Changes
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-gray-700">{profileData.bio}</p>
                    </div>
                    
                    {profileData.website && (
                      <div>
                        <h3 className="text-md font-medium mb-2">Website</h3>
                        <a href={`https://${profileData.website}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          {profileData.website}
                        </a>
                      </div>
                    )}
                    
                    <div>
                      <h3 className="text-md font-medium mb-2">Social Media</h3>
                      <div className="flex space-x-3">
                        {Object.entries(profileData.socialLinks).map(([platform, url]) => (
                          url && (
                            <a 
                              key={platform} 
                              href={`https://${url}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-gray-600 hover:text-estate-primary"
                            >
                              {platform.charAt(0).toUpperCase() + platform.slice(1)}
                            </a>
                          )
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500 mb-6">
                Manage your account settings and preferences from the main Settings tab in the dashboard sidebar.
              </p>
              <Button 
                variant="outline"
                onClick={() => window.location.href = "/dashboard?tab=settings"}
              >
                Go to Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-md font-medium mb-2">Password</h3>
                  <div className="space-y-4">
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
                    <Button className="bg-estate-primary hover:bg-estate-primary/90">
                      Update Password
                    </Button>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-md font-medium mb-2 flex items-center">
                    <Shield className="h-4 w-4 mr-2" />
                    Two-Factor Authentication
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Add an extra layer of security to your account by enabling two-factor authentication.
                  </p>
                  <Button variant="outline">Enable 2FA</Button>
                </div>
                
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-md font-medium mb-2 text-red-600">Danger Zone</h3>
                  <p className="text-gray-500 mb-4">
                    Once you delete your account, there is no going back. Please be certain.
                  </p>
                  <Button variant="destructive">Delete Account</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfileContent;
