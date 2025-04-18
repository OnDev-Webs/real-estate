
import { authenticatedRequest } from "./utils/apiHelpers";
import { Property } from "@/lib/data";

// Base API URL
const API_URL = "http://localhost:5000";

/**
 * Get all users with their property counts
 */
export const getAllUsersWithPropertyCount = async () => {
  try {
    const response = await authenticatedRequest("/admin/users-with-properties");
    console.log("API Response:", response);

    return response.users;
    
  } catch (error) {
    console.error("Error fetching users with property counts:", error);
    throw error;
  }
  
};


/**
 * Get all properties with their owners/agents
 */
export const getAllPropertiesWithOwners = async () => {
  try {
    const response = await authenticatedRequest("/admin/properties-with-owners");
    return response.properties;
  } catch (error) {
    console.error("Error fetching properties with owners:", error);
    throw error;
  }
};

/**
 * Get system statistics 
 */
export const getSystemStats = async () => {
  try {
    const response = await authenticatedRequest("/admin/system-stats");
    return response.stats;
  } catch (error) {
    console.error("Error fetching system stats:", error);
    throw error;
  }
};

/**
 * Get all form submissions
 */
export const getFormSubmissions = async () => {
  try {
    const response = await authenticatedRequest("/admin/form-submissions");
    return response.submissions;
  } catch (error) {
    console.error("Error fetching form submissions:", error);
    throw error;
  }
};

/**
 * Update user role
 */
export const updateUserRole = async (userId: string, role: string) => {
  try {
    const response = await authenticatedRequest(`/admin/users/${userId}/role`, "PUT", { role });
    return response.user;
  } catch (error) {
    console.error("Error updating user role:", error);
    throw error;
  }
};

/**
 * Toggle property feature status
 */
export const togglePropertyFeature = async (propertyId: string) => {
  try {
    const response = await authenticatedRequest(`/properties/${propertyId}/toggle-featured`, "PUT");
    return response.property;
  } catch (error) {
    console.error("Error toggling property feature:", error);
    throw error;
  }
};

/**
 * Get list of all recent form submissions
 */
export const getRecentFormSubmissions = async (limit = 10) => {
  try {
    const response = await authenticatedRequest(`/admin/form-submissions?limit=${limit}`);
    return response.submissions;
  } catch (error) {
    console.error("Error fetching recent form submissions:", error);
    return [];
  }
};

/**
 * Send notification to users
 */
export const sendNotificationToUsers = async (userIds: string[], message: string, title: string) => {
  try {
    const response = await authenticatedRequest("/admin/send-notification", "POST", {
      userIds,
      message,
      title
    });
    return response.success;
  } catch (error) {
    console.error("Error sending notification:", error);
    throw error;
  }
};

/**
 * Register new admin user
 * This function uses the regular authService register function but specifies the role as admin
 */
export const registerAdmin = async (email: string, password: string, name: string) => {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, name, role: 'admin' }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Admin registration failed");
    }

    const data = await response.json();
    
    // Save the JWT token to localStorage
    localStorage.setItem("authToken", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    
    return data;
  } catch (error) {
    console.error("Admin registration error:", error);
    throw error;
  }
};

/**
 * Create new property
 */
export const createProperty = async (propertyData: any) => {
  try {
    const response = await authenticatedRequest("/admin/properties", "POST", propertyData);
    return response.property;
  } catch (error) {
    console.error("Error creating property:", error);
    throw error;
  }
};

/**
 * Delete property
 */
export const deleteProperty = async (propertyId: string) => {
  try {
    const response = await authenticatedRequest(`/admin/properties/${propertyId}`, "DELETE");
    return response.success;
  } catch (error) {
    console.error("Error deleting property:", error);
    throw error;
  }
};
