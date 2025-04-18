
// Import necessary utilities
import { authenticatedRequest } from "./utils/apiHelpers";

// Base API URL
const API_URL = "http://localhost:5000";

// Define the Notification type
export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  time: Date;
  relatedId?: string;
}

/**
 * User Login
 */
export const loginUser = async (email: string, password: string) => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Login failed");
    }

    const data = await response.json();
    
    // Save the JWT token to localStorage
    localStorage.setItem("authToken", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    
    return data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

/**
 * User Registration
 */
export const registerUser = async (email: string, password: string, name: string, role: string) => {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, name, role }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Registration failed");
    }

    const data = await response.json();
    
    // Save the JWT token to localStorage
    localStorage.setItem("authToken", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    
    return data;
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
};

/**
 * Social Login
 */
export const socialLogin = async (provider: string) => {
  window.location.href = `${API_URL}/auth/${provider}`;
};

/**
 * Handle OAuth Redirect
 */
export const handleOAuthRedirect = () => {
  // Check if there's a token in the URL (from OAuth redirect)
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');
  
  if (token) {
    // Save the JWT token
    localStorage.setItem("authToken", token);
    
    // Remove the token from the URL (to prevent security issues)
    window.history.replaceState({}, document.title, window.location.pathname);
    
    // Reload the user data
    return true;
  }
  
  return false;
};

/**
 * Logout
 */
export const logoutUser = () => {
  localStorage.removeItem("authToken");
  localStorage.removeItem("user");
};

/**
 * Get current user from localStorage
 */
export const getCurrentUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = () => {
  const token = localStorage.getItem("authToken");
  return !!token;
};

/**
 * Fetch user details from server
 */
export const fetchUserDetails = async () => {
  try {
    const response = await authenticatedRequest("/users/profile");
    
    // Update user data in localStorage
    localStorage.setItem("user", JSON.stringify(response.user));
    
    return response.user;
  } catch (error) {
    console.error("Fetch user details error:", error);
    throw error;
  }
};

/**
 * Update user profile
 */
export const updateUserProfile = async (profileData: any) => {
  try {
    const response = await authenticatedRequest("/users/profile", "PUT", profileData);
    
    // Update user data in localStorage
    localStorage.setItem("user", JSON.stringify(response.user));
    
    return response.user;
  } catch (error) {
    console.error("Update profile error:", error);
    throw error;
  }
};

/**
 * Update user password
 */
export const updatePassword = async (currentPassword: string, newPassword: string) => {
  try {
    const response = await authenticatedRequest("/auth/password", "PUT", {
      currentPassword,
      newPassword
    });
    return response;
  } catch (error) {
    console.error("Update password error:", error);
    throw error;
  }
};

/**
 * Update notification preferences
 */
export const updateNotificationPreferences = async (preferences: { 
  emailNotifications?: boolean;
  listings?: boolean;
  messages?: boolean;
}) => {
  try {
    const response = await authenticatedRequest(
      "/auth/notification-preferences", 
      "PUT", 
      preferences
    );
    return response;
  } catch (error) {
    console.error("Update notification preferences error:", error);
    throw error;
  }
};

/**
 * Toggle favorite property
 */
export const toggleFavoriteProperty = async (propertyId: string) => {
  try {
    const response = await authenticatedRequest(`/users/favorites/${propertyId}`, "POST");
    return response;
  } catch (error) {
    console.error("Toggle favorite error:", error);
    throw error;
  }
};

/**
 * Get favorite properties
 */
export const getFavorites = async (): Promise<string[]> => {
  try {
    const response = await authenticatedRequest("/users/favorites");
    return response.favoriteIds || [];
  } catch (error) {
    console.error("Get favorites error:", error);
    return [];
  }
};

/**
 * Toggle profile sharing preference
 */
export const toggleShareProfile = async (shareProfile: boolean) => {
  try {
    const response = await authenticatedRequest("/users/preferences/share-profile", "PUT", { shareProfile });
    return response;
  } catch (error) {
    console.error("Toggle share profile error:", error);
    throw error;
  }
};

/**
 * Get user notifications
 */
export const getUserNotifications = async (): Promise<Notification[]> => {
  try {
    const response = await authenticatedRequest("/notifications");
    return response.notifications.map((notification: any) => ({
      ...notification,
      time: new Date(notification.createdAt || new Date())
    }));
  } catch (error) {
    console.error("Get notifications error:", error);
    return [];
  }
};

/**
 * Mark notification as read
 */
export const markNotificationAsRead = async (notificationId: string) => {
  try {
    const response = await authenticatedRequest(`/notifications/${notificationId}/read`, "PUT");
    return response;
  } catch (error) {
    console.error("Mark notification as read error:", error);
    throw error;
  }
};

/**
 * Mark all notifications as read
 */
export const markAllNotificationsAsRead = async () => {
  try {
    const response = await authenticatedRequest("/notifications/read-all", "PUT");
    return response;
  } catch (error) {
    console.error("Mark all notifications as read error:", error);
    throw error;
  }
};

/**
 * Delete notification
 */
export const deleteNotification = async (notificationId: string) => {
  try {
    const response = await authenticatedRequest(`/notifications/${notificationId}`, "DELETE");
    return response;
  } catch (error) {
    console.error("Delete notification error:", error);
    throw error;
  }
};
