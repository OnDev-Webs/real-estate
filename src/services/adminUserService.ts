
import { authenticatedRequest } from "./utils/apiHelpers";

/**
 * Get all users as admin
 */
export const getAllUsers = async () => {
  try {
    const response = await authenticatedRequest("/admin/users-with-properties", "GET");
    return response.users || [];
  } catch (error) {
    console.error("Error fetching all users:", error);
    return [];
  }
};

/**
 * Get user details by ID (admin only)
 */
export const getUserDetailsById = async (userId: string) => {
  try {
    const response = await authenticatedRequest(`/admin/users/${userId}`, "GET");
    return response.user;
  } catch (error) {
    console.error("Error fetching user details:", error);
    throw error;
  }
};

/**
 * Delete user account (admin only)
 */
export const deleteUserAccount = async (userId: string) => {
  try {
    const response = await authenticatedRequest(`/admin/users/${userId}`, "DELETE");
    return response;
  } catch (error) {
    console.error("Error deleting user account:", error);
    throw error;
  }
};

/**
 * Delete user's property (admin only)
 */
export const deleteUserProperty = async (propertyId: string) => {
  try {
    const response = await authenticatedRequest(`/admin/properties/${propertyId}`, "DELETE");
    return response;
  } catch (error) {
    console.error("Error deleting user property:", error);
    throw error;
  }
};

/**
 * Update user role (admin only)
 */
export const updateUserRole = async (userId: string, newRole: string) => {
  try {
    const response = await authenticatedRequest(`/admin/users/${userId}/role`, "PUT", {
      role: newRole
    });
    return response.user;
  } catch (error) {
    console.error("Error updating user role:", error);
    throw error;
  }
};

/**
 * Send notification to user (admin only)
 */
export const sendNotificationToUser = async (userId: string, title: string, message: string) => {
  try {
    const response = await authenticatedRequest("/admin/send-notification", "POST", {
      userIds: [userId],
      title,
      message
    });
    return response;
  } catch (error) {
    console.error("Error sending notification:", error);
    throw error;
  }
};
