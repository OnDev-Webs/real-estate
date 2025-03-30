
import { authenticatedRequest } from "./utils/apiHelpers";
import { properties } from "@/lib/data";

/**
 * Get dashboard statistics
 */
export const getDashboardStats = async () => {
  try {
    const response = await authenticatedRequest("/properties/dashboard/stats");
    return response.data;
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    throw error;
  }
};

/**
 * Get active property listings
 */
export const getActiveListings = async () => {
  try {
    const response = await authenticatedRequest("/properties/dashboard/active-listings");
    return response.properties;
  } catch (error) {
    console.error("Error fetching active listings:", error);
    throw error;
  }
};

/**
 * Get today's leads (last 24 hours)
 */
export const getTodayLeads = async () => {
  try {
    const response = await authenticatedRequest("/properties/dashboard/today-leads");
    console.log("Today's leads API response:", response);
    return response.leads;
  } catch (error) {
    console.error("Error fetching today's leads:", error);
    throw error;
  }
};

/**
 * Get notification counts
 */
export const getNotificationCounts = async () => {
  try {
    const response = await authenticatedRequest("/notifications/count");
    return response.count;
  } catch (error) {
    console.error("Error fetching notification counts:", error);
    return 0; // Default to 0 as this is non-critical
  }
};

/**
 * Get recently viewed properties
 */
export const getRecentlyViewed = async () => {
  try {
    const response = await authenticatedRequest("/properties/dashboard/recently-viewed");
    return response.properties;
  } catch (error) {
    console.error("Error fetching recently viewed properties:", error);
    // Return mock data for now
    return properties.slice(0, 3);
  }
};

/**
 * Get favorite properties
 */
export const getFavoriteProperties = async () => {
  try {
    const response = await authenticatedRequest("/properties/dashboard/favorites");
    return response.properties;
  } catch (error) {
    console.error("Error fetching favorite properties:", error);
    // Return mock data for now
    return properties.slice(0, 2);
  }
};
