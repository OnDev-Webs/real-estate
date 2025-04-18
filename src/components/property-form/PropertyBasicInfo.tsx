
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/contexts/AuthContext";
import { PropertyFormData } from "../StepByStepPropertyForm";

interface PropertyBasicInfoProps {
  formData: PropertyFormData;
  updateFormData: (data: Partial<PropertyFormData>) => void;
  isLoading: boolean;
}

const PropertyBasicInfo = ({ formData, updateFormData, isLoading }: PropertyBasicInfoProps) => {
  const { user } = useAuth();
  const isAgentOrOwner = user?.role === "agent" || user?.role === "owner" || user?.role === "admin";

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Basic Information</h3>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="title" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Property Title *
          </label>
          <Input 
            id="title"
            placeholder="e.g. Modern Apartment in City Center" 
            value={formData.title}
            onChange={(e) => updateFormData({ title: e.target.value })}
            disabled={isLoading}
            required
          />
          {!formData.title && <p className="text-sm text-destructive">Title is required</p>}
        </div>
        
        <div className="space-y-2">
          <label htmlFor="description" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Description *
          </label>
          <Textarea 
            id="description"
            placeholder="Describe your property..." 
            value={formData.description}
            onChange={(e) => updateFormData({ description: e.target.value })}
            disabled={isLoading}
            rows={4}
            required
          />
          {!formData.description && <p className="text-sm text-destructive">Description is required</p>}
        </div>
        
        <div className="space-y-2">
          <label htmlFor="price" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Price (₹) *
          </label>
          <Input 
            id="price"
            type="number" 
            placeholder="e.g. 250000" 
            value={formData.price}
            onChange={(e) => updateFormData({ price: e.target.value })}
            disabled={isLoading}
            required
          />
          {!formData.price && <p className="text-sm text-destructive">Price is required</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="propertyType" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Property Type *
            </label>
            <Select 
              value={formData.propertyType}
              onValueChange={(value) => updateFormData({ propertyType: value })}
              disabled={isLoading}
            >
              <SelectTrigger id="propertyType">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="apartment">Apartment</SelectItem>
                <SelectItem value="house">House</SelectItem>
                <SelectItem value="villa">Villa</SelectItem>
                <SelectItem value="plot">Plot</SelectItem>
                <SelectItem value="penthouse">Penthouse</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="status" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Status *
            </label>
            <Select 
              value={formData.status}
              onValueChange={(value) => updateFormData({ status: value })}
              disabled={isLoading}
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="for-sale">For Sale</SelectItem>
                <SelectItem value="for-rent">For Rent</SelectItem>
                <SelectItem value="sold">Sold</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {isAgentOrOwner && (
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h4 className="font-medium">Featured Property</h4>
              <p className="text-sm text-gray-500">Mark this property as featured to highlight it on the homepage</p>
            </div>
            <Switch
              checked={formData.isFeatured}
              onCheckedChange={(checked) => updateFormData({ isFeatured: checked })}
              disabled={isLoading}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyBasicInfo;
