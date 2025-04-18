
import { authenticatedRequest } from "./utils/apiHelpers";

/**
 * Update the user's profile
 */
export const updateUserProfile = async (profileData: any) => {
  try {
    const response = await authenticatedRequest('/auth/profile', 'PUT', profileData);
    return response.user;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

/**
 * Update user's password
 */
export const updateUserPassword = async (currentPassword: string, newPassword: string) => {
  try {
    const response = await authenticatedRequest('/auth/password', 'PUT', {
      currentPassword,
      newPassword
    });
    return response;
  } catch (error) {
    console.error('Error updating password:', error);
    throw error;
  }
};

/**
 * Update user's notification preferences
 */
export const updateUserSettings = async (preferences: any) => {
  try {
    const response = await authenticatedRequest('/auth/notification-preferences', 'PUT', {
      emailNotifications: preferences.emailNotifications,
      listings: preferences.listings,
      messages: preferences.messages,
      isPublic: preferences.shareProfile
    });
    return response;
  } catch (error) {
    console.error('Error updating notification preferences:', error);
    throw error;
  }
};

/**
 * Get user details by ID
 */
export const getUserDetails = async (userId: string) => {
  try {
    const response = await authenticatedRequest(`/users/${userId}`, 'GET');
    return response.user;
  } catch (error) {
    console.error('Error getting user details:', error);
    throw error;
  }
};

/**
 * Get public agents
 */
export const getPublicAgents = async () => {
  try {
    // This is a public endpoint so we don't need authentication
    const response = await fetch(`http://localhost:5000/api/users/agents`);
    const data = await response.json();
    return data.agents;
  } catch (error) {
    console.error('Error getting public agents:', error);
    return [];
  }
};

/**
 * Contact an agent
 */
export const contactAgent = async (agentId: string, message: string) => {
  try {
    const response = await authenticatedRequest(`/users/contact-agent/${agentId}`, 'POST', { message });
    return response;
  } catch (error) {
    console.error('Error contacting agent:', error);
    throw error;
  }
};
