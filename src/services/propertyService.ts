
// Import necessary utilities
import { authenticatedRequest } from "./utils/apiHelpers";
import { Property } from "@/lib/data";

// Base API URL
const API_URL = "http://localhost:5000";

/**
 * Get all properties
 */
export const getProperties = async () => {
  try {
    const response = await fetch(`${API_URL}/properties`);
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    const data = await response.json();
    return data.properties;
  } catch (error) {
    console.error("Error fetching properties:", error);
    throw error;
  }
};

/**
 * Get property by ID
 */
export const getPropertyById = async (id: string) => {
  try {
    const response = await fetch(`${API_URL}/properties/${id}`);
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    const data = await response.json();
    return data.property;
  } catch (error) {
    console.error(`Error fetching property ${id}:`, error);
    throw error;
  }
};

/**
 * Get properties by status (for-sale, for-rent, sold, pending)
 */
export const getPropertiesByStatus = async (status: string) => {
  try {
    const response = await fetch(`${API_URL}/properties/status/${status}`);
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    const data = await response.json();
    return data.properties;
  } catch (error) {
    console.error(`Error fetching ${status} properties:`, error);
    throw error;
  }
};

/**
 * Add a new property
 */
export const addProperty = async (propertyData: any) => {
  try {
    const response = await authenticatedRequest(
      "/properties",
      "POST",
      propertyData
    );
    return response.property;
  } catch (error) {
    console.error("Error adding property:", error);
    throw error;
  }
};

/**
 * Update an existing property
 */
export const updateProperty = async (propertyData: any) => {
  try {
    const response = await authenticatedRequest(
      `/properties/${propertyData.id}`,
      "PUT",
      propertyData
    );
    return response.property;
  } catch (error) {
    console.error("Error updating property:", error);
    throw error;
  }
};

/**
 * Delete a property
 */
export const deleteProperty = async (id: string) => {
  try {
    await authenticatedRequest(`/properties/${id}`, "DELETE");
    return true;
  } catch (error) {
    console.error("Error deleting property:", error);
    throw error;
  }
};

/**
 * Upload property images
 */
export const uploadImages = async (images: File[]): Promise<string[]> => {
  try {
    const token = localStorage.getItem("authToken");
    if (!token) {
      throw new Error("Authentication required");
    }

    const formData = new FormData();
    images.forEach((image) => {
      formData.append("images", image);
    });

    const response = await fetch(`${API_URL}/properties/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
      mode: "cors",
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    return data.urls;
  } catch (error) {
    console.error("Error uploading images:", error);
    throw error;
  }
};

/**
 * Get properties by user
 */
export const getUserProperties = async () => {
  try {
    const response = await authenticatedRequest("/properties/user/me");
    return response.properties;
  } catch (error) {
    console.error("Error fetching user properties:", error);
    throw error;
  }
};

/**
 * Get featured properties
 */
export const getFeaturedProperties = async () => {
  try {
    const response = await fetch(`${API_URL}/properties?featured=true`);
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    const data = await response.json();
    return data.properties;
  } catch (error) {
    console.error("Error fetching featured properties:", error);
    throw error;
  }
};

/**
 * Increment property view count
 */
export const incrementPropertyViews = async (id: string) => {
  try {
    const response = await fetch(`${API_URL}/properties/${id}/view`, {
      method: "PUT",
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    const data = await response.json();
    return data.views;
  } catch (error) {
    console.error("Error incrementing property views:", error);
    // Don't throw error for view count as it's not critical
    return null;
  }
};

/**
 * Contact property owner/agent
 */
export const contactPropertyOwner = async (id: string, message: string) => {
  try {
    const response = await authenticatedRequest(
      `/properties/${id}/contact`,
      "POST",
      { message }
    );
    return response;
  } catch (error) {
    console.error("Error contacting property owner:", error);
    throw error;
  }
};

/**
 * Search properties with filters
 */
export const searchProperties = async (
  query: string = "",
  filters: any = {}
) => {
  try {
    // Build query string
    const queryParams = new URLSearchParams();
    
    if (query) {
      queryParams.append("query", query);
    }
    
    // Add filters to query params
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        queryParams.append(key, value as string);
      }
    });
    
    const queryString = queryParams.toString();
    const url = `${API_URL}/properties/search${queryString ? `?${queryString}` : ""}`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.properties;
  } catch (error) {
    console.error("Error searching properties:", error);
    throw error;
  }
};
