
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PropertyForm from "@/components/PropertyForm";
import { addProperty, uploadImages } from "@/services/propertyService";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import SocialSharePopup from "@/components/SocialSharePopup";

const AddPropertyContent = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showSharePopup, setShowSharePopup] = useState(false);
  const [newPropertyData, setNewPropertyData] = useState({
    id: "",
    title: ""
  });

  const handleSubmit = async (formData: any, images: File[]) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to add a property",
        variant: "destructive"
      });
      navigate("/login");
      return;
    }
    
    setIsLoading(true);
    
    try {
      console.log("Form data:", formData);
      console.log("Images to upload:", images);
      
      // Upload images first if there are any
      let imageUrls: string[] = [];
      if (images.length > 0) {
        console.log("Uploading images...");
        imageUrls = await uploadImages(images);
        console.log("Image upload complete. URLs:", imageUrls);
      }
      
      // Create property data
      const propertyData = {
        title: formData.title,
        description: formData.description,
        price: Number(formData.price),
        features: {
          bedrooms: Number(formData.bedrooms),
          bathrooms: Number(formData.bathrooms),
          area: Number(formData.area),
          status: formData.status,
          propertyType: formData.propertyType,
          yearBuilt: Number(formData.yearBuilt) || new Date().getFullYear(),
        },
        location: {
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zip: formData.zipCode,
          country: formData.country || "India",
          lat: parseFloat(formData.latitude) || 19.0760,
          lng: parseFloat(formData.longitude) || 72.8777
        },
        images: imageUrls,
        amenities: []
      };
      
      // Add amenities if checked
      if (formData.hasGarden) propertyData.amenities.push("Garden");
      if (formData.hasGarage) propertyData.amenities.push("Garage");
      if (formData.hasPool) propertyData.amenities.push("Swimming Pool");
      if (formData.isPetFriendly) propertyData.amenities.push("Pet Friendly");
      if (formData.hasCentralHeating) propertyData.amenities.push("Central Heating");
      if (formData.hasAirConditioning) propertyData.amenities.push("Air Conditioning");
      
      // Add the property
      const newProperty = await addProperty(propertyData);
      console.log("Property added:", newProperty);
      
      toast({
        title: "Success",
        description: "Property has been added successfully",
      });
      
      // Set property data for sharing
      setNewPropertyData({
        id: newProperty.id || newProperty._id,
        title: newProperty.title
      });
      
      // Show share popup
      setShowSharePopup(true);
      
    } catch (error) {
      console.error("Error adding property:", error);
      toast({
        title: "Error",
        description: "Failed to add property. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold tracking-tight mb-6">Add New Property</h2>
      <PropertyForm onSubmit={handleSubmit} isLoading={isLoading} />
      
      {/* Social Share Popup */}
      <SocialSharePopup 
        isOpen={showSharePopup}
        onClose={() => {
          setShowSharePopup(false);
          navigate("/dashboard?tab=properties");
        }}
        propertyTitle={newPropertyData.title}
        propertyId={newPropertyData.id}
      />
    </div>
  );
};

export default AddPropertyContent;
