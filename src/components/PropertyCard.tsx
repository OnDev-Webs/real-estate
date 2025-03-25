
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bed, Bath, Square, MapPin, Heart } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from '@/lib/utils';
import { Property, formatPrice } from '@/lib/data';

interface PropertyCardProps {
  property: Property;
  index?: number;
}

const PropertyCard = ({ property, index = 0 }: PropertyCardProps) => {
  const navigate = useNavigate();
  const cardRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, []);

  const handleImageLoad = () => {
    setIsImageLoaded(true);
  };

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  const handleViewDetails = (e: React.MouseEvent) => {
    e.preventDefault();
    // Use the _id from the backend if it exists, otherwise fallback to id
    const propertyId = (property as any)._id || property.id;
    navigate(`/property/${propertyId}`);
  };

  const getStatusColor = () => {
    switch (property.features.status) {
      case 'for-sale':
        return 'bg-black text-white';
      case 'for-rent':
        return 'bg-white text-black border border-black';
      case 'sold':
        return 'bg-black text-white';
      case 'pending':
        return 'bg-gray-500 text-white';
      default:
        return 'bg-black text-white';
    }
  };

  const getStatusText = () => {
    switch (property.features.status) {
      case 'for-sale':
        return 'For Sale';
      case 'for-rent':
        return 'For Rent';
      case 'sold':
        return 'Sold';
      case 'pending':
        return 'Pending';
      default:
        return 'For Sale';
    }
  };

  // Get the property ID safely
  const propertyId = (property as any)._id || property.id;

  return (
    <div 
      ref={cardRef}
      className={cn(
        "property-card h-full overflow-hidden rounded-xl transition-all duration-500 transform",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16",
        `transition-delay-${index * 100 > 500 ? 500 : index * 100}`,
        "hover:shadow-md"
      )}
      style={{ 
        transitionDelay: `${Math.min(index * 75, 500)}ms`, border:'1px solid #e0e0e0'
      }}
    >
      <Link to={`/property/${propertyId}`} className="group flex flex-col h-full bg-white border border-gray-100 rounded-xl overflow-hidden card-shadow">
        {/* Image Container */}
        <div className="relative overflow-hidden aspect-[4/3]">
          <div 
            className={cn(
              "blur-load",
              isImageLoaded && "loaded"
            )}
            style={{ backgroundImage: `url(${property.images[0]}?blur=200&w=50)` }}
          >
            <img 
              src={property.images[0]} 
              alt={property.title}
              className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
              onLoad={handleImageLoad}
            />
          </div>
          
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            <span className={cn("property-badge", getStatusColor())}>
              {getStatusText()}
            </span>
            {property.featured && (
              <span className="property-badge bg-white text-black border border-black">
                Featured
              </span>
            )}
          </div>
          
          <button 
            onClick={toggleFavorite}
            className={cn(
              "absolute top-3 right-3 p-2 rounded-full transition-colors",
              isFavorite ? "bg-black text-white" : "bg-white text-gray-500 hover:text-black"
            )}
          >
            <Heart size={18} fill={isFavorite ? "white" : "none"} />
          </button>
          
          <div className="absolute bottom-3 left-3">
            <span className="property-badge bg-black/70 text-white">
              {property.features.propertyType.charAt(0).toUpperCase() + property.features.propertyType.slice(1)}
            </span>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-4 flex flex-col flex-grow">
          <div className="flex items-center gap-1 text-gray-600 mb-2">
            <MapPin size={16} className="text-black" />
            <span className="text-sm truncate">
              {property.location.city}, {property.location.state}
            </span>
          </div>
          
          <h3 className="text-lg font-semibold mb-2 line-clamp-1 group-hover:text-black transition-colors">
            {property.title}
          </h3>
          
          <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">
            {property.description}
          </p>
          
          <div className="flex items-center justify-between border-t border-gray-100 pt-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 text-gray-600">
                <Bed size={16} className="text-black" />
                <span className="text-sm">{property.features.bedrooms} BHK</span>
              </div>
              <div className="flex items-center gap-1 text-gray-600">
                <Bath size={16} className="text-black" />
                <span className="text-sm">{property.features.bathrooms}</span>
              </div>
              <div className="flex items-center gap-1 text-gray-600">
                <Square size={16} className="text-black" />
                <span className="text-sm">{property.features.area} sq ft</span>
              </div>
            </div>
          </div>
          
          <div className="mt-4 flex items-center justify-between">
            <div className="font-semibold text-lg text-black">
              {formatPrice(property.price)}
              {property.features.status === 'for-rent' && <span className="text-xs text-gray-600 ml-1">/month</span>}
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs border-black text-black hover:bg-black hover:text-white rounded-full"
              onClick={handleViewDetails}
            >
              View Details
            </Button>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default PropertyCard;
