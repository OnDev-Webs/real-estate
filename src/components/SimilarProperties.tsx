
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import PropertyCard from './PropertyCard';
import { Property, searchProperties } from '@/lib/data';

interface SimilarPropertiesProps {
  currentPropertyId: string;
  propertyType: string;
  city: string;
}

const SimilarProperties = ({ currentPropertyId, propertyType, city }: SimilarPropertiesProps) => {
  const [similarProperties, setSimilarProperties] = useState<Property[]>([]);
  
  useEffect(() => {
    // Get all properties
    const allProperties = searchProperties();
    
    // Find similar properties based on type and city, excluding the current property
    const similar = allProperties.filter(property => 
      property.id !== currentPropertyId && 
      (property.features.propertyType === propertyType || 
       property.location.city === city)
    ).slice(0, 3);
    
    setSimilarProperties(similar);
  }, [currentPropertyId, propertyType, city]);

  if (similarProperties.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-white">
      <div className="container">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-12">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-2">You May Also Like</h2>
            <p className="text-gray-600">
              Discover other properties that match your interests
            </p>
          </div>
          <Link to="/properties">
            <Button variant="outline" className="border-black text-black hover:bg-black hover:text-white gap-2 rounded-full">
              View All Properties
              <ArrowRight size={16} />
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {similarProperties.map((property, index) => (
            <PropertyCard 
              key={property.id} 
              property={property} 
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SimilarProperties;
