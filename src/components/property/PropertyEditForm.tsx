
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getPropertyById, updateProperty, uploadImages } from "@/services/propertyService";
import { Property } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import StepByStepPropertyForm, { PropertyFormData } from "@/components/StepByStepPropertyForm";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from 'react-router-dom';


interface PropertyEditFormProps {
  propertyId: string | null;
  onSuccess?: () => void;
}

const PropertyEditForm = ({ propertyId, onSuccess }: PropertyEditFormProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProperty = async () => {
      if (!propertyId) {
        setError("No property ID provided");
        setIsLoading(false);
        return;
      }
  
      setIsLoading(true);
      try {
        const propertyData = await getPropertyById(propertyId);
        setProperty(propertyData);
      } catch (err) {
        console.error("Error fetching property:", err);
        setError("Failed to fetch property details");
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchProperty();
  }, [propertyId]);
  
  const handleSubmit = async (formData: PropertyFormData, newImages: File[]) => {
    if (!property || !propertyId) return;
  
    setIsLoading(true);
  
    try {
      // Prepare the updated property data
      const updatedProperty = {
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
          lat: parseFloat(formData.latitude) || property.location.lat,
          lng: parseFloat(formData.longitude) || property.location.lng,
        },
        amenities: [],
        featured: formData.isFeatured || false,
      };
  
      // Add amenities if checked
      if (formData.hasGarden) updatedProperty.amenities.push("Garden");
      if (formData.hasGarage) updatedProperty.amenities.push("Garage");
      if (formData.hasPool) updatedProperty.amenities.push("Swimming Pool");
      if (formData.isPetFriendly) updatedProperty.amenities.push("Pet Friendly");
      if (formData.hasCentralHeating) updatedProperty.amenities.push("Central Heating");
      if (formData.hasAirConditioning) updatedProperty.amenities.push("Air Conditioning");
  
      // Add the images to the FormData if any new images are provided
      // const formDataForRequest = new FormData();
      // formDataForRequest.append('propertyData', JSON.stringify(updatedProperty));
  
      // if (newImages.length > 0) {
      //   newImages.forEach((image) => {
      //     formDataForRequest.append('images', image);
      //   });
      // }
      const formDataForRequest = new FormData();
      formDataForRequest.append('propertyData', JSON.stringify(updatedProperty)); // Property data
      newImages.forEach((image) => {
        formDataForRequest.append('images', image); // Append each image to 'images'
      });


      const token = localStorage.getItem("authToken"); // Get token from localStorage or wherever it's stored
  
      const response = await fetch(`http://localhost:5000/properties/${propertyId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formDataForRequest,
      });
  
      if (!response.ok) {
        throw new Error('Failed to update property');
      }
  
      toast({
        title: "Success",
        description: "Property updated successfully!",
      });
  
      // Handle success callback or redirect based on user role
      if (onSuccess) {
        onSuccess();
      } else {
        if (user?.role === 'admin') {
          navigate('/admin?tab=properties');
        } else {
          navigate(`/property/${propertyId}`);
        }
      }
    } catch (err) {
      console.error("Error updating property:", err);
      toast({
        title: "Error",
        description: "Failed to update property. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  
  

  if (isLoading && !property) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-estate-primary"></div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {error || "Failed to load property details. Please try again."}
        </AlertDescription>
      </Alert>
    );
  }

  const initialData: Partial<PropertyFormData> = {
    title: property.title || "",
    description: property.description || "",
    price: property.price ? property.price.toString() : "0",
    propertyType: property.features?.propertyType || "apartment",
    status: property.features?.status || "for-sale",
    bedrooms: property.features?.bedrooms ? property.features.bedrooms.toString() : "0",
    bathrooms: property.features?.bathrooms ? property.features.bathrooms.toString() : "0",
    area: property.features?.area ? property.features.area.toString() : "0",
    yearBuilt: property.features?.yearBuilt ? property.features.yearBuilt.toString() : new Date().getFullYear().toString(),
    address: property.location?.address || "",
    city: property.location?.city || "",
    state: property.location?.state || "",
    zipCode: property.location?.zip || "",
    country: property.location?.country || "India",
    latitude: property.location?.lat ? property.location.lat.toString() : "0",
    longitude: property.location?.lng ? property.location.lng.toString() : "0",
    hasGarden: property.amenities?.includes("Garden") || false,
    hasGarage: property.amenities?.includes("Garage") || false,
    hasPool: property.amenities?.includes("Swimming Pool") || false,
    isPetFriendly: property.amenities?.includes("Pet Friendly") || false,
    hasCentralHeating: property.amenities?.includes("Central Heating") || false,
    hasAirConditioning: property.amenities?.includes("Air Conditioning") || false,
    isFeatured: property.featured || false,
  };

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Edit Property</h1>
      
      <StepByStepPropertyForm
        onSubmit={handleSubmit}
        isLoading={isLoading}
        initialData={initialData}
        isEditMode={true}
      />
    </div>
  );
};

export default PropertyEditForm;
