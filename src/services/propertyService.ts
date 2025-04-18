
import { authenticatedRequest, publicRequest } from "./utils/apiHelpers";

/**
 * Create a new property
 */
export const createProperty = async (propertyData: any) => {
  try {
    const response = await authenticatedRequest('/properties', 'POST', propertyData);
    return response.property;
  } catch (error) {
    console.error('Error creating property:', error);
    throw error;
  }
};

/**
 * Upload property images
 */
export const uploadPropertyImages = async (formData: FormData) => {
  try {
    // Create options object for file upload
    const options = {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
      body: formData
    };
    
    // Remove Content-Type header as it's set automatically with boundary for multipart/form-data
    delete (options.headers as any)['Content-Type'];
    
    // Make direct fetch request without using authenticatedRequest helper
    const response = await fetch(`http://localhost:5000/properties/upload`, options);
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.urls || [];
  } catch (error) {
    console.error('Error uploading images:', error);
    throw error;
  }
};

/**
 * Get property details
 */
export const getPropertyDetails = async (propertyId: string) => {
  try {
    const response = await authenticatedRequest(`/properties/${propertyId}`, 'GET');
    return response.property;
  } catch (error) {
    console.error('Error getting property details:', error);
    throw error;
  }
};

// Alias for getPropertyDetails that matches the imported name in other files
export const getPropertyById = getPropertyDetails;

/**
 * Update property details
 */
export const updateProperty = async (propertyId: string, propertyData: any) => {
  try {
    const response = await authenticatedRequest(`/properties/${propertyId}`, 'PUT', propertyData);
    return response.property;
  } catch (error) {
    console.error('Error updating property:', error);
    throw error;
  }
};

/**
 * Delete property
 */
export const deleteProperty = async (propertyId: string) => {
  try {
    const response = await authenticatedRequest(`/properties/${propertyId}`, 'DELETE');
    return response;
  } catch (error) {
    console.error('Error deleting property:', error);
    throw error;
  }
};

/**
 * Get user properties
 */
export const getUserProperties = async () => {
  try {
    const response = await authenticatedRequest('/properties/user/me', 'GET');
    return response.properties;
  } catch (error) {
    console.error('Error getting user properties:', error);
    return [];
  }
};

/**
 * Get properties by status
 */
export const getPropertiesByStatus = async (status: string) => {
  try {
    const response = await publicRequest(`/properties/status/${status}`, 'GET');
    return response.properties;
  } catch (error) {
    console.error(`Error getting ${status} properties:`, error);
    return [];
  }
};

/**
 * Get all properties
 */
export const getAllProperties = async () => {
  try {
    // This is a public endpoint so we don't need authentication
    const response = await fetch(`http://localhost:5000/properties`);
    const data = await response.json();
    return data.properties;
  } catch (error) {
    console.error('Error getting all properties:', error);
    return [];
  }
};

/**
 * Contact property owner
 */
export const contactPropertyOwner = async (propertyId: string, message: string) => {
  try {
    const response = await authenticatedRequest(`/properties/${propertyId}/contact`, 'POST', { message });
    return response;
  } catch (error) {
    console.error('Error contacting property owner:', error);
    throw error;
  }
};

/**
 * Get agent details by ID
 */
export const getAgentDetails = async (agentId: string) => {
  try {
    const response = await authenticatedRequest(`/users/${agentId}`, 'GET');
    return response.user;
  } catch (error) {
    console.error('Error getting agent details:', error);
    throw error;
  }
};

/**
 * Get property leads for a user
 */
export const getUserPropertyLeads = async () => {
  try {
    const response = await authenticatedRequest('/properties/dashboard/today-leads', 'GET');
    return response.leads || [];
  } catch (error) {
    console.error('Error getting property leads:', error);
    return [];
  }
};

// Alias for uploadPropertyImages that matches the imported name in other files
export const uploadImages = uploadPropertyImages;

// Alias for createProperty that matches the imported name in other files
export const addProperty = createProperty;
