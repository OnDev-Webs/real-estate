import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import PropertyBasicInfo from "./property-form/PropertyBasicInfo";
import PropertyFeatures from "./property-form/PropertyFeatures";
import PropertyLocation from "./property-form/PropertyLocation";
import PropertyAmenities from "./property-form/PropertyAmenities";
import PropertyImages from "./property-form/PropertyImages";
import PropertyReview from "./property-form/PropertyReview";

export type PropertyFormData = {
  title: string;
  description: string;
  price: string;
  status: string;
  propertyType: string;
  bedrooms: string;
  bathrooms: string;
  area: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  latitude: string;
  longitude: string;
  yearBuilt: string;
  hasGarden: boolean;
  hasGarage: boolean;
  hasPool: boolean;
  isPetFriendly: boolean;
  hasCentralHeating: boolean;
  hasAirConditioning: boolean;
  isFeatured?: boolean;
};

interface StepByStepPropertyFormProps {
  onSubmit: (formData: PropertyFormData, images: File[]) => Promise<void>;
  isLoading: boolean;
  initialData?: Partial<PropertyFormData>;
  isEditMode?: boolean;
}

const StepByStepPropertyForm = ({
  onSubmit,
  isLoading,
  initialData = {},
  isEditMode = false
}: StepByStepPropertyFormProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [images, setImages] = useState<File[]>([]);
  const [formData, setFormData] = useState<PropertyFormData>({
    title: initialData.title || "",
    description: initialData.description || "",
    price: initialData.price || "",
    status: initialData.status || "for-sale",
    propertyType: initialData.propertyType || "apartment",
    bedrooms: initialData.bedrooms || "2",
    bathrooms: initialData.bathrooms || "2",
    area: initialData.area || "",
    address: initialData.address || "",
    city: initialData.city || "",
    state: initialData.state || "",
    zipCode: initialData.zipCode || "",
    country: initialData.country || "India",
    latitude: initialData.latitude || "",
    longitude: initialData.longitude || "",
    yearBuilt: initialData.yearBuilt || new Date().getFullYear().toString(),
    hasGarden: initialData.hasGarden || false,
    hasGarage: initialData.hasGarage || false,
    hasPool: initialData.hasPool || false,
    isPetFriendly: initialData.isPetFriendly || false,
    hasCentralHeating: initialData.hasCentralHeating || false,
    hasAirConditioning: initialData.hasAirConditioning || false,
    isFeatured: initialData.isFeatured || false
  });

  const totalSteps = 6;
  const progressPercentage = (currentStep / totalSteps) * 100;

  const updateFormData = (data: Partial<PropertyFormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const handleImagesChange = (newImages: File[]) => {
    setImages(newImages);
  };

  const nextStep = () => {
    if (currentStep === 1 && (!formData.title || !formData.description || !formData.price)) {
      toast({
        title: "Required fields missing",
        description: "Please fill in all required fields before proceeding.",
        variant: "destructive"
      });
      return;
    }

    if (currentStep === 3 && (!formData.address || !formData.city || !formData.state || !formData.zipCode)) {
      toast({
        title: "Required fields missing",
        description: "Please fill in all required location fields before proceeding.",
        variant: "destructive"
      });
      return;
    }

    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to add a property",
        variant: "destructive"
      });
      return;
    }

    try {
      await onSubmit(formData, images);
    } catch (error) {
      console.error("Error submitting property:", error);
      toast({
        title: "Error",
        description: "Failed to submit property. Please try again.",
        variant: "destructive"
      });
    }
  };

  const steps = [
    {
      title: "Basic Information",
      content: (
        <PropertyBasicInfo
          formData={formData}
          updateFormData={updateFormData}
          isLoading={isLoading}
        />
      )
    },
    {
      title: "Property Features",
      content: (
        <PropertyFeatures
          formData={formData}
          updateFormData={updateFormData}
          isLoading={isLoading}
        />
      )
    },
    {
      title: "Location",
      content: (
        <PropertyLocation
          formData={formData}
          updateFormData={updateFormData}
          isLoading={isLoading}
        />
      )
    },
    {
      title: "Amenities",
      content: (
        <PropertyAmenities
          formData={formData}
          updateFormData={updateFormData}
          isLoading={isLoading}
        />
      )
    },
    {
      title: "Images",
      content: (
        <PropertyImages
          images={images}
          setImages={handleImagesChange}
          isLoading={isLoading}
        />
      )
    },
    {
      title: "Review",
      content: (
        <PropertyReview
          formData={formData}
          images={images}
          isLoading={isLoading}
        />
      )
    }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">
          {isEditMode ? "Edit Property" : "Add New Property"} - Step {currentStep} of {totalSteps}
        </h2>
        <Progress value={progressPercentage} className="h-2" />
        
        <div className="flex justify-between mt-4 overflow-x-auto py-2">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`text-sm px-3 py-1 rounded-full whitespace-nowrap mx-1 ${
                currentStep === index + 1
                  ? "bg-black text-white"
                  : index + 1 < currentStep
                  ? "bg-gray-200 text-gray-700"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              {step.title}
            </div>
          ))}
        </div>
      </div>

      <Card className="p-6">
        {steps[currentStep - 1].content}

        <div className="flex justify-between mt-8">
          <Button
            type="button"
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1 || isLoading}
          >
            Previous
          </Button>

          {currentStep < totalSteps ? (
            <Button
              type="button"
              onClick={nextStep}
              disabled={isLoading}
            >
              Next
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className="bg-black hover:bg-black/80"
            >
              {isLoading ? "Submitting..." : isEditMode ? "Update Property" : "Submit Property"}
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};

export default StepByStepPropertyForm;
