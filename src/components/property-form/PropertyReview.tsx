
import { PropertyFormData } from "../StepByStepPropertyForm";

interface PropertyReviewProps {
  formData: PropertyFormData;
  images: File[];
  isLoading: boolean;
}

const PropertyReview = ({ formData, images, isLoading }: PropertyReviewProps) => {
  const amenities = [];
  if (formData.hasGarden) amenities.push("Garden");
  if (formData.hasGarage) amenities.push("Garage");
  if (formData.hasPool) amenities.push("Swimming Pool");
  if (formData.isPetFriendly) amenities.push("Pet Friendly");
  if (formData.hasCentralHeating) amenities.push("Central Heating");
  if (formData.hasAirConditioning) amenities.push("Air Conditioning");

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Review Your Property Details</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <h4 className="font-medium">Basic Information</h4>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <div className="text-sm text-gray-500">Title:</div>
              <div className="text-sm">{formData.title}</div>
              
              <div className="text-sm text-gray-500">Price:</div>
              <div className="text-sm">₹{formData.price}</div>
              
              <div className="text-sm text-gray-500">Property Type:</div>
              <div className="text-sm capitalize">{formData.propertyType}</div>
              
              <div className="text-sm text-gray-500">Status:</div>
              <div className="text-sm capitalize">{formData.status.replace('-', ' ')}</div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium">Description</h4>
            <p className="text-sm mt-2">{formData.description}</p>
          </div>
          
          <div>
            <h4 className="font-medium">Features</h4>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <div className="text-sm text-gray-500">Bedrooms:</div>
              <div className="text-sm">{formData.bedrooms}</div>
              
              <div className="text-sm text-gray-500">Bathrooms:</div>
              <div className="text-sm">{formData.bathrooms}</div>
              
              <div className="text-sm text-gray-500">Area:</div>
              <div className="text-sm">{formData.area} sq ft</div>
              
              <div className="text-sm text-gray-500">Year Built:</div>
              <div className="text-sm">{formData.yearBuilt}</div>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <h4 className="font-medium">Location</h4>
            <div className="grid grid-cols-3 gap-2 mt-2">
              <div className="text-sm text-gray-500">Address:</div>
              <div className="text-sm col-span-2">{formData.address}</div>
              
              <div className="text-sm text-gray-500">City:</div>
              <div className="text-sm col-span-2">{formData.city}</div>
              
              <div className="text-sm text-gray-500">State:</div>
              <div className="text-sm col-span-2">{formData.state}</div>
              
              <div className="text-sm text-gray-500">Zip Code:</div>
              <div className="text-sm col-span-2">{formData.zipCode}</div>
              
              <div className="text-sm text-gray-500">Country:</div>
              <div className="text-sm col-span-2">{formData.country}</div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium">Amenities</h4>
            {amenities.length > 0 ? (
              <div className="flex flex-wrap gap-2 mt-2">
                {amenities.map((amenity, index) => (
                  <span key={index} className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                    {amenity}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 mt-2">No amenities selected</p>
            )}
          </div>
          
          <div>
            <h4 className="font-medium">Images</h4>
            <p className="text-sm mt-2">
              {images.length} {images.length === 1 ? 'image' : 'images'} selected
            </p>
          </div>
        </div>
      </div>
      
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
        <p className="text-sm text-yellow-800">
          Please review all the information above before submitting. Once submitted, your property will be visible to potential buyers and renters.
        </p>
      </div>
    </div>
  );
};

export default PropertyReview;
