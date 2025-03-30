
import { Property } from "@/lib/data";

// Mock API URL (should match the one in apiHelpers.ts)
const API_URL = "http://localhost:5000";

/**
 * Convert API property object to frontend Property type
 */
export const mapApiPropertyToFrontend = (apiProperty: any): Property => {
  return {
    id: apiProperty._id || apiProperty.id,
    title: apiProperty.title,
    description: apiProperty.description,
    price: apiProperty.price,
    images: apiProperty.images || [],
    location: {
      address: apiProperty.location?.address || '',
      city: apiProperty.location?.city || '',
      state: apiProperty.location?.state || '',
      zip: apiProperty.location?.zip || '',
      country: apiProperty.location?.country || 'United States',
      lat: apiProperty.location?.lat || 0,
      lng: apiProperty.location?.lng || 0
    },
    features: {
      bedrooms: apiProperty.features?.bedrooms || 0,
      bathrooms: apiProperty.features?.bathrooms || 0,
      area: apiProperty.features?.area || 0,
      yearBuilt: apiProperty.features?.yearBuilt || new Date().getFullYear(),
      propertyType: apiProperty.features?.propertyType || "apartment",
      status: apiProperty.features?.status || "for-sale",
      floorPlan: apiProperty.features?.floorPlan || null
    },
    agent: {
      id: apiProperty.agent?.id || '',
      name: apiProperty.agent?.name || 'Agent Name',
      email: apiProperty.agent?.email || 'agent@example.com',
      phone: apiProperty.agent?.phone || 'Not provided',
      image: apiProperty.agent?.image || 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    },
    amenities: apiProperty.amenities || [],
    createdAt: apiProperty.createdAt || new Date().toISOString(),
    views: apiProperty.views || 0,
    featured: apiProperty.featured || false
  };
};

/**
 * Convert frontend Property to API format for creation/update
 */
export const mapFrontendPropertyToApi = (property: any) => {
  return {
    title: property.title,
    description: property.description,
    price: Number(property.price),
    features: {
      bedrooms: Number(property.bedrooms),
      bathrooms: Number(property.bathrooms),
      area: Number(property.area),
      yearBuilt: Number(property.yearBuilt || new Date().getFullYear()),
      propertyType: property.propertyType,
      status: property.status,
      floorPlan: property.floorPlan
    },
    location: {
      address: property.address,
      city: property.city,
      state: property.state,
      zip: property.zipCode, // Match the backend field name
      country: property.country || "United States",
      lat: parseFloat(property.latitude) || 0,
      lng: parseFloat(property.longitude) || 0
    },
    amenities: getAmenitiesFromFormData(property),
    images: property.images || []
  };
};

/**
 * Extract amenities from form data
 */
const getAmenitiesFromFormData = (formData: any) => {
  const amenities = [];
  
  if (formData.hasGarage) amenities.push('Garage');
  if (formData.hasPool) amenities.push('Swimming Pool');
  if (formData.isPetFriendly) amenities.push('Pet Friendly');
  if (formData.hasCentralHeating) amenities.push('Central Heating');
  if (formData.hasAirConditioning) amenities.push('Air Conditioning');
  if (formData.hasGarden) amenities.push('Garden');
  
  return amenities;
};

/**
 * Fetch properties from the API
 */
export const fetchProperties = async (filters = {}) => {
  try {
    // Build query string from filters
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) queryParams.append(key, String(value));
    });
    
    const queryString = queryParams.toString();
    const url = `${API_URL}/properties${queryString ? `?${queryString}` : ''}`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.properties.map(mapApiPropertyToFrontend);
  } catch (error) {
    console.error('Error fetching properties:', error);
    throw error;
  }
};

/**
 * Fetch property by ID
 */
export const fetchPropertyById = async (id: string) => {
  try {
    const response = await fetch(`${API_URL}/properties/${id}`);
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return mapApiPropertyToFrontend(data.property);
  } catch (error) {
    console.error(`Error fetching property ${id}:`, error);
    throw error;
  }
};

/**
 * Fetch featured properties
 */
export const fetchFeaturedProperties = async () => {
  try {
    const response = await fetch(`${API_URL}/properties?featured=true`);
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.properties.map(mapApiPropertyToFrontend);
  } catch (error) {
    console.error('Error fetching featured properties:', error);
    throw error;
  }
};

/**
 * Fetch properties by city
 */
export const fetchPropertiesByCity = async (city: string) => {
  try {
    const response = await fetch(`${API_URL}/properties?city=${encodeURIComponent(city)}`);
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.properties.map(mapApiPropertyToFrontend);
  } catch (error) {
    console.error(`Error fetching properties for city ${city}:`, error);
    throw error;
  }
};
