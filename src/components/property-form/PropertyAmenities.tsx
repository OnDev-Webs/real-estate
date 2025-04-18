
import { Checkbox } from "@/components/ui/checkbox";
import { PropertyFormData } from "../StepByStepPropertyForm";

interface PropertyAmenitiesProps {
  formData: PropertyFormData;
  updateFormData: (data: Partial<PropertyFormData>) => void;
  isLoading: boolean;
}

const PropertyAmenities = ({ formData, updateFormData, isLoading }: PropertyAmenitiesProps) => {
  const amenities = [
    {
      id: "garden",
      name: "Garden",
      description: "Does the property have a garden?",
      field: "hasGarden"
    },
    {
      id: "garage",
      name: "Garage",
      description: "Does the property have a garage?",
      field: "hasGarage"
    },
    {
      id: "pool",
      name: "Swimming Pool",
      description: "Does the property have a swimming pool?",
      field: "hasPool"
    },
    {
      id: "petFriendly",
      name: "Pet Friendly",
      description: "Is the property pet friendly?",
      field: "isPetFriendly"
    },
    {
      id: "centralHeating",
      name: "Central Heating",
      description: "Does the property have central heating?",
      field: "hasCentralHeating"
    },
    {
      id: "airConditioning",
      name: "Air Conditioning",
      description: "Does the property have air conditioning?",
      field: "hasAirConditioning"
    }
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Amenities</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {amenities.map((amenity) => (
          <div 
            key={amenity.id}
            className="flex flex-row items-center justify-between rounded-lg border p-4"
          >
            <div className="space-y-0.5">
              <div className="text-base font-medium">{amenity.name}</div>
              <div className="text-sm text-gray-500">{amenity.description}</div>
            </div>
            <Checkbox
              checked={formData[amenity.field as keyof PropertyFormData] as boolean}
              onCheckedChange={(checked) => 
                updateFormData({ [amenity.field]: Boolean(checked) })
              }
              disabled={isLoading}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PropertyAmenities;
