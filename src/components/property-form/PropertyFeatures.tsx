
import { Input } from "@/components/ui/input";
import { PropertyFormData } from "../StepByStepPropertyForm";

interface PropertyFeaturesProps {
  formData: PropertyFormData;
  updateFormData: (data: Partial<PropertyFormData>) => void;
  isLoading: boolean;
}

const PropertyFeatures = ({ formData, updateFormData, isLoading }: PropertyFeaturesProps) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Property Features</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label htmlFor="bedrooms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Bedrooms *
          </label>
          <Input 
            id="bedrooms"
            type="number" 
            placeholder="e.g. 3" 
            value={formData.bedrooms || ""}
            onChange={(e) => updateFormData({ bedrooms: e.target.value })}
            disabled={isLoading}
            required
          />
          {!formData.bedrooms && <p className="text-sm text-destructive">Bedrooms are required</p>}
        </div>
        
        <div className="space-y-2">
          <label htmlFor="bathrooms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Bathrooms *
          </label>
          <Input 
            id="bathrooms"
            type="number" 
            placeholder="e.g. 2" 
            step="0.5"
            value={formData.bathrooms || ""}
            onChange={(e) => updateFormData({ bathrooms: e.target.value })}
            disabled={isLoading}
            required
          />
          {!formData.bathrooms && <p className="text-sm text-destructive">Bathrooms are required</p>}
        </div>
        
        <div className="space-y-2">
          <label htmlFor="area" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Area (sq ft) *
          </label>
          <Input 
            id="area"
            type="number" 
            placeholder="e.g. 1200" 
            value={formData.area || ""}
            onChange={(e) => updateFormData({ area: e.target.value })}
            disabled={isLoading}
            required
          />
          {!formData.area && <p className="text-sm text-destructive">Area is required</p>}
        </div>
      </div>
      
      <div className="space-y-2">
        <label htmlFor="yearBuilt" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Year Built
        </label>
        <Input 
          id="yearBuilt"
          type="number" 
          placeholder="e.g. 2020" 
          value={formData.yearBuilt || ""}
          onChange={(e) => updateFormData({ yearBuilt: e.target.value })}
          disabled={isLoading}
        />
      </div>
    </div>
  );
};

export default PropertyFeatures;
