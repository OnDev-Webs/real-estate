
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getPropertyById, updateProperty, uploadImages } from "@/services/propertyService";
import { Property } from "@/lib/data";
import PropertyForm from "@/components/PropertyForm";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const EditPropertyContent = () => {
  const [searchParams] = useSearchParams();
  const propertyId = searchParams.get("id");
  const navigate = useNavigate();
  const { toast } = useToast();
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

      try {
        console.log("Fetching property with ID:", propertyId);
        const propertyData = await getPropertyById(propertyId);
        console.log("Fetched property data:", propertyData);
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

  const handleSubmit = async (formData: any, newImages: File[]) => {
    if (!property || !propertyId) return;
    
    setIsLoading(true);
    
    try {
      console.log("Form data:", formData);
      console.log("New images to upload:", newImages);
      
      // Upload new images if any
      let imageUrls: string[] = [];
      if (newImages.length > 0) {
        console.log("Uploading new images...");
        imageUrls = await uploadImages(newImages);
        console.log("Image upload complete. New URLs:", imageUrls);
      }
      
      // Combine existing and new image URLs
      const existingImages = property.images || [];
      const allImages = [...existingImages, ...imageUrls];
      
      const updatedProperty = {
        id: propertyId,
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
          lng: parseFloat(formData.longitude) || property.location.lng
        },
        images: allImages,
        amenities: []
      };
      
      // Add amenities if checked
      if (formData.hasGarden) updatedProperty.amenities.push("Garden");
      if (formData.hasGarage) updatedProperty.amenities.push("Garage");
      if (formData.hasPool) updatedProperty.amenities.push("Swimming Pool");
      if (formData.isPetFriendly) updatedProperty.amenities.push("Pet Friendly");
      if (formData.hasCentralHeating) updatedProperty.amenities.push("Central Heating");
      if (formData.hasAirConditioning) updatedProperty.amenities.push("Air Conditioning");

      await updateProperty(updatedProperty);
      
      toast({
        title: "Success",
        description: "Property updated successfully!",
        variant: "default",
      });
      
      navigate(`/property/${propertyId}`);
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

  if (isLoading) {
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

  const initialData = {
    title: property.title || "",
    description: property.description || "",
    price: property.price || 0,
    propertyType: property.features?.propertyType || "apartment",
    status: property.features?.status || "for-sale",
    bedrooms: property.features?.bedrooms || 0,
    bathrooms: property.features?.bathrooms || 0,
    area: property.features?.area || 0,
    yearBuilt: property.features?.yearBuilt || new Date().getFullYear(),
    amenities: property.amenities || [],
    address: property.location?.address || "",
    city: property.location?.city || "",
    state: property.location?.state || "",
    zip: property.location?.zip || "",
    country: property.location?.country || "United States",
    latitude: property.location?.lat || 0,
    longitude: property.location?.lng || 0,
    existingImages: property.images || [],
    hasGarden: property.amenities?.includes("Garden") || false,
    hasGarage: property.amenities?.includes("Garage") || false,
    hasPool: property.amenities?.includes("Swimming Pool") || false,
    isPetFriendly: property.amenities?.includes("Pet Friendly") || false,
    hasCentralHeating: property.amenities?.includes("Central Heating") || false,
    hasAirConditioning: property.amenities?.includes("Air Conditioning") || false,
  };

  console.log("Property images:", property.images);
  console.log("Initial form data:", initialData);

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Edit Property</h1>
      
      <PropertyForm
        onSubmit={handleSubmit}
        isLoading={isLoading}
        initialData={initialData}
        isEditMode={true}
      />
    </div>
  );
};

export default EditPropertyContent;
