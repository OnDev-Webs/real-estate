
// Import necessary utilities
import { authenticatedRequest } from "./utils/apiHelpers";

/**
 * Get dashboard statistics for agents/owners
 */
export const getDashboardStats = async () => {
  try {
    const response = await authenticatedRequest("/properties/dashboard/stats", "GET");
    console.log("Dashboard stats response:", response);
    return response.data || { 
      totalProperties: 0,
      activeProperties: 0,
      totalViews: 0,
      recentProperties: []
    };
  } catch (error) {
    console.error("Get dashboard stats error:", error);
    // Return default values on error instead of throwing
    return { 
      totalProperties: 0,
      activeProperties: 0,
      totalViews: 0,
      recentProperties: []
    };
  }
};

/**
 * Get active property listings
 */
export const getActiveListings = async () => {
  try {
    const response = await authenticatedRequest("/properties/dashboard/active-listings", "GET");
    console.log("Active listings response:", response);
    return response.properties || [];
  } catch (error) {
    console.error("Get active listings error:", error);
    return [];
  }
};

/**
 * Get today's leads (property inquiries in last 24 hours)
 */
export const getTodayLeads = async () => {
  try {
    const response = await authenticatedRequest("/properties/dashboard/today-leads", "GET");
    return response.leads || [];
  } catch (error) {
    console.error("Get today leads error:", error);
    return [];
  }
};

/**
 * Get recently viewed properties for the current user
 */
export const getRecentlyViewed = async () => {
  try {
    const response = await authenticatedRequest("/properties/dashboard/recently-viewed", "GET");
    return response.properties || [];
  } catch (error) {
    console.error("Get recently viewed properties error:", error);
    return [];
  }
};


// Function to get the user ID from localStorage
const getUserIdFromLocalStorage = () => {
  try {
    const userData = localStorage.getItem("user");
    if (!userData) return null;

    const user = JSON.parse(userData);
    return user?._id || null;
  } catch (error) {
    console.error("Failed to parse user from localStorage", error);
    return null;
  }
};

// Function to fetch recently viewed properties by a specific user
export const getRecentlyViewedByUser = async () => {
  try {
    // Get userId from localStorage
    const userId = getUserIdFromLocalStorage();

    // If userId is not found, return empty array or handle as needed
    if (!userId) {
      throw new Error('User ID not found');
    }

    // Make the API request to fetch recently viewed properties by a specific user
    const response = await authenticatedRequest(`/properties/users/${userId}/recently-viewed`, "GET");

    // Return the properties from the response, or an empty array if none found
    console.log( "response:",response )
    return response.properties || [];
  } catch (error) {
    console.error("Get user recently viewed properties error:", error);
    return [];
  }
};

// Example usage
const fetchRecentlyViewedProperties = async () => {
  const recentlyViewedProperties = await getRecentlyViewedByUser();
  console.log("Recently Viewed Properties:", recentlyViewedProperties);
};

// Call the function to fetch recently viewed properties
fetchRecentlyViewedProperties();


/**
 * Get favorite properties for the current user
 */
export const getFavoriteProperties = async () => {
  try {
    const response = await authenticatedRequest("/users/favorites", "GET");
    return response.favorites || [];
  } catch (error) {
    console.error("Get favorite properties error:", error);
    return [];
  }
};
