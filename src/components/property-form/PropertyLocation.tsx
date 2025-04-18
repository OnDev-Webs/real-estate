
import { Input } from "@/components/ui/input";
import { PropertyFormData } from "../StepByStepPropertyForm";

interface PropertyLocationProps {
  formData: PropertyFormData;
  updateFormData: (data: Partial<PropertyFormData>) => void;
  isLoading: boolean;
}

const PropertyLocation = ({ formData, updateFormData, isLoading }: PropertyLocationProps) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Location Information</h3>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="address" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Address *
          </label>
          <Input 
            id="address"
            placeholder="e.g. 123 Main Street" 
            value={formData.address}
            onChange={(e) => updateFormData({ address: e.target.value })}
            disabled={isLoading}
            required
          />
          {!formData.address && <p className="text-sm text-destructive">Address is required</p>}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="city" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            City *
          </label>
          <Input 
            id="city"
            placeholder="e.g. New York" 
            value={formData.city}
            onChange={(e) => updateFormData({ city: e.target.value })}
            disabled={isLoading}
            required
          />
          {!formData.city && <p className="text-sm text-destructive">City is required</p>}
        </div>
        
        <div className="space-y-2">
          <label htmlFor="state" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            State *
          </label>
          <Input 
            id="state"
            placeholder="e.g. NY" 
            value={formData.state}
            onChange={(e) => updateFormData({ state: e.target.value })}
            disabled={isLoading}
            required
          />
          {!formData.state && <p className="text-sm text-destructive">State is required</p>}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="zipCode" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Zip Code *
          </label>
          <Input 
            id="zipCode"
            placeholder="e.g. 10001" 
            value={formData.zipCode}
            onChange={(e) => updateFormData({ zipCode: e.target.value })}
            disabled={isLoading}
            required
          />
          {!formData.zipCode && <p className="text-sm text-destructive">Zip code is required</p>}
        </div>
        
        <div className="space-y-2">
          <label htmlFor="country" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Country
          </label>
          <Input 
            id="country"
            placeholder="e.g. India" 
            value={formData.country}
            onChange={(e) => updateFormData({ country: e.target.value })}
            disabled={isLoading}
            defaultValue="India"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="latitude" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Latitude
          </label>
          <Input 
            id="latitude"
            type="text"
            placeholder="e.g. 40.7128" 
            value={formData.latitude}
            onChange={(e) => updateFormData({ latitude: e.target.value })}
            disabled={isLoading}
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="longitude" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Longitude
          </label>
          <Input 
            id="longitude"
            type="text"
            placeholder="e.g. -74.0060" 
            value={formData.longitude}
            onChange={(e) => updateFormData({ longitude: e.target.value })}
            disabled={isLoading}
          />
        </div>
      </div>
      
      <p className="text-xs text-gray-500">* Required fields</p>
    </div>
  );
};

export default PropertyLocation;
