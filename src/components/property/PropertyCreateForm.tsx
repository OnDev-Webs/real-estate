import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import StepByStepPropertyForm, { PropertyFormData } from "@/components/StepByStepPropertyForm";
import { useAuth } from "@/contexts/AuthContext";
import SocialSharePopup from "../SocialSharePopup";

interface PropertyCreateFormProps {
  onSuccess?: () => void;
}

const PropertyCreateForm = ({ onSuccess }: PropertyCreateFormProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showSharePopup, setShowSharePopup] = useState(false);
  const [newPropertyData, setNewPropertyData] = useState<{ title: string; id: string } | null>(null);

  const handleSubmit = async (formData: PropertyFormData, images: File[]) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to add a property",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
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
          lat: parseFloat(formData.latitude) || 0,
          lng: parseFloat(formData.longitude) || 0
        },
        amenities: [],
        featured: formData.isFeatured || false
      };

      // Add amenities
      if (formData.hasGarden) propertyData.amenities.push("Garden");
      if (formData.hasGarage) propertyData.amenities.push("Garage");
      if (formData.hasPool) propertyData.amenities.push("Swimming Pool");
      if (formData.isPetFriendly) propertyData.amenities.push("Pet Friendly");
      if (formData.hasCentralHeating) propertyData.amenities.push("Central Heating");
      if (formData.hasAirConditioning) propertyData.amenities.push("Air Conditioning");

      const formDataToSend = new FormData();
      formDataToSend.append("data", JSON.stringify(propertyData));
      images.forEach(image => formDataToSend.append("images", image));

      const response = await fetch("http://localhost:5000/properties", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error("Failed to create property");
      }

      const property = await response.json();
      console.log("Created property response:", property);


      toast({
        title: "Success",
        description: "Property created successfully!",
      });

      setNewPropertyData({
        title: property.property.title,
        id: property.property._id,
      });

      setShowSharePopup(true);

    } catch (error) {
      console.error("Error creating property:", error);
      toast({
        title: "Error",
        description: "Failed to create property. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* <h1 className="text-2xl font-bold mb-6">Add New Property</h1> */}

      <StepByStepPropertyForm
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />

      {showSharePopup && newPropertyData && (
        <SocialSharePopup
          isOpen={showSharePopup}
          onClose={() => {
            setShowSharePopup(false);
            navigate("/dashboard?tab=properties");
          }}
          propertyTitle={newPropertyData.title}
          propertyId={newPropertyData.id}
        />
      )}
    </div>
  );
};

export default PropertyCreateForm;
