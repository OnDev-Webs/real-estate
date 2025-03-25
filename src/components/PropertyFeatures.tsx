
import { Check } from 'lucide-react';

interface PropertyFeaturesProps {
  amenities: string[];
}

const PropertyFeatures = ({ amenities }: PropertyFeaturesProps) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
      <h2 className="text-2xl font-bold mb-4">Features & Amenities</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-3">
        {amenities.map((amenity, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className="text-estate-primary">
              <Check size={18} />
            </div>
            <span>{amenity}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PropertyFeatures;
