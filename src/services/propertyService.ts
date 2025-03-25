
import { Property } from "@/lib/data";

const API_URL = "http://localhost:5000";

// Get token from localStorage
const getToken = (): string | null => {
  return localStorage.getItem("authToken");
};

// Helper for API requests with authentication
const authenticatedRequest = async (
  endpoint: string,
  method: string = "GET",
  data?: any,
  isFormData: boolean = false
) => {
  const token = getToken();
  if (!token) {
    throw new Error("Authentication required");
  }

  const headers: HeadersInit = {
    Authorization: `Bearer ${token}`,
  };

  // Only add Content-Type for non-FormData requests
  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  const config: RequestInit = {
    method,
    headers,
    body: isFormData ? data : data ? JSON.stringify(data) : undefined,
  };

  const response = await fetch(`${API_URL}${endpoint}`, config);

  if (!response.ok) {
    try {
      const errorData = await response.json();
      throw new Error(errorData.message || `Error: ${response.status}`);
    } catch (e) {
      throw new Error(`Error: ${response.status}`);
    }
  }

  return response.json();
};

// Upload images to Cloudinary through our backend
export const uploadImages = async (images: File[]): Promise<string[]> => {
  const formData = new FormData();
  images.forEach((image) => {
    formData.append("images", image);
  });

  const response = await authenticatedRequest("/properties/upload", "POST", formData, true);
  return response.urls; // These will be Cloudinary URLs returned from the backend
};

// Add a new property with uploaded image URLs
export const addProperty = async (propertyData: Partial<Property>): Promise<Property> => {
  // Ensure the location structure matches what the API expects
  if (propertyData.location) {
    // Rename zipCode to zip to match the expected Property type
    if ('zipCode' in propertyData.location) {
      const { zipCode, ...rest } = propertyData.location as any;
      propertyData.location = {
        ...rest,
        zip: zipCode,
      };
    }
    
    // Rename latitude/longitude to lat/lng if needed
    if ('latitude' in propertyData.location) {
      const { latitude, longitude, ...rest } = propertyData.location as any;
      propertyData.location = {
        ...rest,
        lat: latitude,
        lng: longitude,
      };
    }
  }

  // Make sure property data conforms to the expected schema
  if (!propertyData.features) {
    propertyData.features = {} as any;
  }
  
  // Ensure yearBuilt is present
  if (!propertyData.features.yearBuilt) {
    propertyData.features.yearBuilt = new Date().getFullYear();
  }

  const response = await authenticatedRequest("/properties", "POST", propertyData);
  return response.property;
};

// Get all properties
export const getAllProperties = async (): Promise<Property[]> => {
  const response = await fetch(`${API_URL}/properties`);
  if (!response.ok) {
    throw new Error("Failed to fetch properties");
  }
  const data = await response.json();
  return data.properties.map((property: any) => {
    // Ensure each property has an id property for frontend use
    if (property._id && !property.id) {
      property.id = property._id;
    }
    return property;
  });
};

// Get properties by status (for-sale, for-rent, etc.)
export const getPropertiesByStatus = async (status: string): Promise<Property[]> => {
  const response = await fetch(`${API_URL}/properties/status/${status}`);
  if (!response.ok) {
    throw new Error("Failed to fetch properties");
  }
  const data = await response.json();
  return data.properties.map((property: any) => {
    // Ensure each property has an id property for frontend use
    if (property._id && !property.id) {
      property.id = property._id;
    }
    return property;
  });
};

// Get property by ID
export const getPropertyById = async (id: string): Promise<Property> => {
  const response = await fetch(`${API_URL}/properties/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch property");
  }
  const data = await response.json();
  // Ensure the property has an id property for frontend use
  if (data.property._id && !data.property.id) {
    data.property.id = data.property._id;
  }
  return data.property;
};

// Update a property
export const updateProperty = async (id: string, propertyData: Partial<Property>): Promise<Property> => {
  // Apply the same location field conversions as in addProperty
  if (propertyData.location) {
    if ('zipCode' in propertyData.location) {
      const { zipCode, ...rest } = propertyData.location as any;
      propertyData.location = {
        ...rest,
        zip: zipCode,
      };
    }
    
    if ('latitude' in propertyData.location) {
      const { latitude, longitude, ...rest } = propertyData.location as any;
      propertyData.location = {
        ...rest,
        lat: latitude,
        lng: longitude,
      };
    }
  }

  // Ensure yearBuilt is present
  if (propertyData.features && !propertyData.features.yearBuilt) {
    propertyData.features.yearBuilt = new Date().getFullYear();
  }

  const response = await authenticatedRequest(`/properties/${id}`, "PUT", propertyData);
  return response.property;
};

// Delete a property
export const deleteProperty = async (id: string): Promise<void> => {
  await authenticatedRequest(`/properties/${id}`, "DELETE");
};

// Get properties for the current agent
export const getUserProperties = async (): Promise<Property[]> => {
  const response = await authenticatedRequest("/properties/user/me");
  return response.properties.map((property: any) => {
    // Ensure each property has an id property for frontend use
    if (property._id && !property.id) {
      property.id = property._id;
    }
    return property;
  });
};
