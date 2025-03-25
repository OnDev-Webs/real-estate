import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Bed, Bath, Square, MapPin, Calendar, Heart, 
  Share2, Printer, ChevronLeft, ChevronRight, 
  Phone, Mail, User, Check, X
} from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { formatPrice, Property } from '@/lib/data';
import SimilarProperties from '@/components/SimilarProperties';
import PropertyFeatures from '@/components/PropertyFeatures';
import PropertyGallery from '@/components/PropertyGallery';
import ContactForm from '@/components/ContactForm';
import PropertyMap from '@/components/PropertyMap';
import { getPropertyById } from '@/services/propertyService';

const API_URL = "http://localhost:5000";

const PropertyDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showFloorPlan, setShowFloorPlan] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      setIsLoading(true);
      
      try {
        const propertyData = await getPropertyById(id);
        if (propertyData._id && !propertyData.id) {
          propertyData.id = propertyData._id;
        }
        setProperty(propertyData);
        
        await fetch(`${API_URL}/properties/${id}/view`, {
          method: 'PUT'
        });
      } catch (error) {
        console.error("Error fetching property:", error);
        toast({
          title: "Error",
          description: "Failed to load property details. The property may not exist.",
          variant: "destructive",
        });
        navigate('/properties');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProperty();
  }, [id, navigate, toast]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link copied!",
      description: "Property link has been copied to clipboard.",
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast({
      title: isFavorite ? "Removed from favorites" : "Added to favorites",
      description: isFavorite 
        ? "Property has been removed from your favorites." 
        : "Property has been added to your favorites.",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-estate-primary border-t-transparent rounded-full animate-spin mb-4"></div>
            <p>Loading property details...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Property Not Found</h2>
            <p className="mb-6">The property you're looking for doesn't exist or has been removed.</p>
            <Link to="/properties">
              <Button>Browse Properties</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {/* Breadcrumb */}
        <div className="bg-estate-light py-4">
          <div className="container">
            <div className="flex items-center text-sm">
              <Link to="/" className="text-estate-gray hover:text-estate-primary">Home</Link>
              <span className="mx-2 text-estate-gray">/</span>
              <Link to="/properties" className="text-estate-gray hover:text-estate-primary">Properties</Link>
              <span className="mx-2 text-estate-gray">/</span>
              <span className="text-estate-primary font-medium">{property.title}</span>
            </div>
          </div>
        </div>
        
        {/* Property Header */}
        <section className="py-8 md:py-12 bg-white">
          <div className="container">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
              <div>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">{property.title}</h1>
                <div className="flex items-center gap-1 text-estate-gray">
                  <MapPin size={16} />
                  <span>
                    {property.location.address}, {property.location.city}, {property.location.state} {property.location.zip}
                  </span>
                </div>
              </div>
              
              <div className="flex flex-col items-end">
                <div className="text-2xl md:text-3xl font-bold text-estate-primary mb-1">
                  {formatPrice(property.price)}
                </div>
                <div className="flex items-center gap-1 text-estate-gray text-sm">
                  <Calendar size={14} />
                  <span>Listed on {new Date(property.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3 mb-6">
              <span className={`tag ${property.features.status === 'for-sale' ? 'bg-estate-primary text-white' : 'bg-estate-secondary text-estate-dark'}`}>
                {property.features.status === 'for-sale' ? 'For Sale' : 
                 property.features.status === 'for-rent' ? 'For Rent' : 
                 property.features.status === 'sold' ? 'Sold' : 'Pending'}
              </span>
              <span className="tag bg-black/70 text-white">
                {property.features.propertyType.charAt(0).toUpperCase() + property.features.propertyType.slice(1)}
              </span>
              {property.featured && (
                <span className="tag bg-estate-secondary text-estate-dark">
                  Featured
                </span>
              )}
            </div>
            
            <div className="flex flex-wrap gap-4 mb-8">
              <div className="flex items-center gap-1 text-estate-gray">
                <Bed size={18} />
                <span className="font-medium">{property.features.bedrooms} BHK</span>
              </div>
              <div className="flex items-center gap-1 text-estate-gray">
                <Bath size={18} />
                <span className="font-medium">{property.features.bathrooms}</span> Bathrooms
              </div>
              <div className="flex items-center gap-1 text-estate-gray">
                <Square size={18} />
                <span className="font-medium">{property.features.area}</span> sq ft
              </div>
              <div className="flex items-center gap-1 text-estate-gray">
                <Calendar size={18} />
                <span className="font-medium">Built {property.features.yearBuilt}</span>
              </div>
              {(property as any).views !== undefined && (
                <div className="flex items-center gap-1 text-estate-gray">
                  <User size={18} />
                  <span className="font-medium">{(property as any).views}</span> Views
                </div>
              )}
            </div>
            
            <div className="flex flex-wrap gap-3">
              <Button onClick={toggleFavorite} variant="outline" className="gap-2">
                <Heart size={18} fill={isFavorite ? "currentColor" : "none"} />
                <span>{isFavorite ? "Saved" : "Save"}</span>
              </Button>
              <Button onClick={handleShare} variant="outline" className="gap-2">
                <Share2 size={18} />
                <span>Share</span>
              </Button>
              <Button onClick={handlePrint} variant="outline" className="gap-2">
                <Printer size={18} />
                <span>Print</span>
              </Button>
              {property.features.floorPlan && (
                <Button onClick={() => setShowFloorPlan(!showFloorPlan)} variant="outline" className="gap-2">
                  <Square size={18} />
                  <span>Floor Plan</span>
                </Button>
              )}
            </div>
            
            {/* Floor Plan Modal */}
            {showFloorPlan && property.features.floorPlan && (
              <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-auto p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold">Floor Plan</h3>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => setShowFloorPlan(false)}
                      className="rounded-full"
                    >
                      <X size={24} />
                    </Button>
                  </div>
                  <div className="overflow-auto">
                    <img 
                      src={property.features.floorPlan} 
                      alt="Floor Plan" 
                      className="w-full h-auto"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
        
        {/* Property Gallery */}
        <PropertyGallery images={property.images} title={property.title} />
        
        {/* Property Details */}
        <section className="py-12 bg-estate-light">
          <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Property Information */}
              <div className="lg:col-span-2">
                <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
                  <h2 className="text-2xl font-bold mb-4">Description</h2>
                  <p className="text-estate-gray mb-6">{property.description}</p>
                  
                  <h3 className="text-xl font-semibold mb-3">Property Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center gap-2">
                      <span className="text-estate-gray">Property ID:</span>
                      <span className="font-medium">{property.id}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-estate-gray">Property Type:</span>
                      <span className="font-medium capitalize">{property.features.propertyType}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-estate-gray">Property Status:</span>
                      <span className="font-medium capitalize">{property.features.status.replace('-', ' ')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-estate-gray">Property Size:</span>
                      <span className="font-medium">{property.features.area} sq ft</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-estate-gray">Configuration:</span>
                      <span className="font-medium">{property.features.bedrooms} BHK</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-estate-gray">Bathrooms:</span>
                      <span className="font-medium">{property.features.bathrooms}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-estate-gray">Year Built:</span>
                      <span className="font-medium">{property.features.yearBuilt}</span>
                    </div>
                    {(property as any).views !== undefined && (
                      <div className="flex items-center gap-2">
                        <span className="text-estate-gray">Total Views:</span>
                        <span className="font-medium">{(property as any).views}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Floor Plan Section */}
                {property.features.floorPlan && (
                  <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-2xl font-bold">Floor Plan</h2>
                      <Button variant="outline" size="sm" onClick={() => setShowFloorPlan(true)}>
                        View Full Size
                      </Button>
                    </div>
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      <img 
                        src={property.features.floorPlan} 
                        alt="Floor Plan" 
                        className="w-full h-auto"
                      />
                    </div>
                  </div>
                )}
                
                {/* Features and Amenities */}
                <PropertyFeatures amenities={property.amenities} />
                
                {/* Location */}
                <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
                  <h2 className="text-2xl font-bold mb-4">Location</h2>
                  <div className="mb-4">
                    <div className="flex items-start gap-2 mb-2">
                      <MapPin size={18} className="mt-1 text-estate-primary" />
                      <span>
                        {property.location.address}, {property.location.city}, {property.location.state} {property.location.zip}, {property.location.country}
                      </span>
                    </div>
                  </div>
                  
                  <div className="aspect-video rounded-lg overflow-hidden">
                    {/* Map view */}
                    <PropertyMap 
                      properties={[property]} 
                      selectedPropertyId={property.id}
                      singleProperty={true} 
                    />
                  </div>
                </div>
              </div>
              
              {/* Right Column - Agent Info & Contact Form */}
              <div className="lg:col-span-1">
                {/* Agent Info */}
                <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
                  <div className="flex items-center gap-4 mb-4">
                    <img 
                      src={property.agent.image} 
                      alt={property.agent.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-bold text-lg">{property.agent.name}</h3>
                      <p className="text-estate-gray text-sm">Real Estate Agent</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-3 mb-6">
                    <a 
                      href={`tel:${property.agent.phone}`} 
                      className="flex items-center gap-3 text-estate-gray hover:text-estate-primary transition-colors"
                    >
                      <Phone size={18} />
                      <span>{property.agent.phone}</span>
                    </a>
                    <a 
                      href={`mailto:${property.agent.email}`} 
                      className="flex items-center gap-3 text-estate-gray hover:text-estate-primary transition-colors"
                    >
                      <Mail size={18} />
                      <span>{property.agent.email}</span>
                    </a>
                  </div>
                  
                  <Button className="w-full bg-estate-primary hover:bg-estate-primary/90 gap-2">
                    <User size={18} />
                    <span>View Agent Profile</span>
                  </Button>
                </div>
                
                {/* Contact Form */}
                <ContactForm agentName={property.agent.name} propertyTitle={property.title} />
              </div>
            </div>
          </div>
        </section>
        
        {/* Similar Properties */}
        <SimilarProperties 
          currentPropertyId={property.id} 
          propertyType={property.features.propertyType} 
          city={property.location.city}
        />
      </main>
      
      <Footer />
    </div>
  );
};

export default PropertyDetails;
