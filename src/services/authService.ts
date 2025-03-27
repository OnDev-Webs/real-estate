
import { User, UserRole } from "@/contexts/AuthContext";

const API_URL = "http://localhost:5000";

// Helper to parse JWT token
const parseJwt = (token: string) => {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (e) {
    return null;
  }
};

// Login user with email and password
export const loginUser = async (
  email: string,
  password: string
): Promise<{ user: User; token: string }> => {
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
    
    // Store token in localStorage
    localStorage.setItem("authToken", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    
    return { 
      user: data.user, 
      token: data.token 
    };
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

// Register a new user
export const registerUser = async (
  email: string,
  password: string,
  name: string,
  role: UserRole
): Promise<{ user: User; token: string }> => {
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
    
    // Store token in localStorage
    localStorage.setItem("authToken", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    
    return { 
      user: data.user, 
      token: data.token 
    };
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
};

// Logout user
export const logoutUser = (): void => {
  localStorage.removeItem("authToken");
  localStorage.removeItem("user");
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem("authToken");
  if (!token) return false;
  
  // Check if token is expired
  const decodedToken = parseJwt(token);
  if (!decodedToken) return false;
  
  const isExpired = decodedToken.exp * 1000 < Date.now();
  if (isExpired) {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    return false;
  }
  
  return true;
};

// Get the current user
export const getCurrentUser = (): User | null => {
  if (!isAuthenticated()) return null;
  
  const userStr = localStorage.getItem("user");
  if (!userStr) return null;
  
  return JSON.parse(userStr);
};

// Get user details from server (to refresh user data)
export const fetchUserDetails = async (): Promise<User> => {
  const token = localStorage.getItem("authToken");
  if (!token) throw new Error("Not authenticated");
  
  try {
    const response = await fetch(`${API_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user details");
    }

    const data = await response.json();
    
    // Update stored user
    localStorage.setItem("user", JSON.stringify(data.user));
    
    return data.user;
  } catch (error) {
    console.error("Fetch user details error:", error);
    throw error;
  }
};

// Handle OAuth redirect
export const handleOAuthRedirect = (): boolean => {
  // Check if URL contains token parameter
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');
  
  if (token) {
    // Store token in localStorage
    localStorage.setItem("authToken", token);
    
    // Fetch user details
    fetchUserDetails()
      .then(user => {
        localStorage.setItem("user", JSON.stringify(user));
        
        // Clean URL by removing token parameter
        const url = new URL(window.location.href);
        url.searchParams.delete('token');
        window.history.replaceState({}, document.title, url.toString());
        
        // Redirect to dashboard
        window.location.href = '/dashboard';
      })
      .catch(error => {
        console.error("OAuth redirect error:", error);
        logoutUser();
      });
    
    return true; // Return true to indicate a redirect was handled
  }
  
  return false; // Return false if no redirect was handled
};

// Update user profile
export const updateUserProfile = async (userData: Partial<User>): Promise<User> => {
  const token = localStorage.getItem("authToken");
  if (!token) throw new Error("Not authenticated");
  
  try {
    const response = await fetch(`${API_URL}/auth/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to update profile");
    }

    const data = await response.json();
    
    // Update stored user with new data
    const currentUser = getCurrentUser();
    if (currentUser) {
      const updatedUser = { ...currentUser, ...data.user };
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }
    
    return data.user;
  } catch (error) {
    console.error("Update profile error:", error);
    throw error;
  }
};

// Update user password
export const updatePassword = async (
  currentPassword: string,
  newPassword: string
): Promise<{ success: boolean; message: string }> => {
  const token = localStorage.getItem("authToken");
  if (!token) throw new Error("Not authenticated");
  
  try {
    const response = await fetch(`${API_URL}/auth/password`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to update password");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Update password error:", error);
    throw error;
  }
};

// Update notification preferences
export const updateNotificationPreferences = async (
  preferences: {
    emailNotifications?: boolean;
    listings?: boolean;
    messages?: boolean;
  }
): Promise<{ success: boolean; message: string }> => {
  const token = localStorage.getItem("authToken");
  if (!token) throw new Error("Not authenticated");
  
  try {
    const response = await fetch(`${API_URL}/auth/notification-preferences`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(preferences),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to update notification preferences");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Update notification preferences error:", error);
    throw error;
  }
};

// Get user notifications
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'message' | 'property' | 'offer' | 'alert' | 'appointment';
  time: string;
  read: boolean;
  relatedId?: string;
}

export const getUserNotifications = async (): Promise<Notification[]> => {
  const token = localStorage.getItem("authToken");
  if (!token) throw new Error("Not authenticated");
  
  try {
    const response = await fetch(`${API_URL}/auth/notifications`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      // For now, if the API doesn't exist, return mock data
      if (response.status === 404) {
        return getMockNotifications();
      }
      throw new Error("Failed to fetch notifications");
    }

    const data = await response.json();
    return data.notifications;
  } catch (error) {
    console.error("Fetch notifications error:", error);
    // Return mock data for demo purposes
    return getMockNotifications();
  }
};

// Mark notification as read
export const markNotificationAsRead = async (
  notificationId: string
): Promise<{ success: boolean }> => {
  const token = localStorage.getItem("authToken");
  if (!token) throw new Error("Not authenticated");
  
  try {
    const response = await fetch(`${API_URL}/auth/notifications/${notificationId}/read`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to mark notification as read");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Mark notification as read error:", error);
    // For demo, return success
    return { success: true };
  }
};

// Mark all notifications as read
export const markAllNotificationsAsRead = async (): Promise<{ success: boolean }> => {
  const token = localStorage.getItem("authToken");
  if (!token) throw new Error("Not authenticated");
  
  try {
    const response = await fetch(`${API_URL}/auth/notifications/read-all`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to mark all notifications as read");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Mark all notifications as read error:", error);
    // For demo, return success
    return { success: true };
  }
};

// Delete notification
export const deleteNotification = async (
  notificationId: string
): Promise<{ success: boolean }> => {
  const token = localStorage.getItem("authToken");
  if (!token) throw new Error("Not authenticated");
  
  try {
    const response = await fetch(`${API_URL}/auth/notifications/${notificationId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete notification");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Delete notification error:", error);
    // For demo, return success
    return { success: true };
  }
};

// Mock notifications for development
const getMockNotifications = (): Notification[] => {
  return [
    {
      id: "1",
      title: "New message from Michael Scott",
      message: "I'll check the availability of that apartment for you.",
      type: "message",
      time: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
      read: false,
      relatedId: "agent-1"
    },
    {
      id: "2",
      title: "Property viewed",
      message: "Your listing 'Beach House' has been viewed 10 times today.",
      type: "property",
      time: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3 hours ago
      read: false,
      relatedId: "property-2"
    },
    {
      id: "3",
      title: "Offer received",
      message: "You have received a new offer for 'Mountain Cabin'.",
      type: "offer",
      time: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
      read: true,
      relatedId: "property-3"
    },
    {
      id: "4",
      title: "Price drop alert",
      message: "A property you saved has dropped in price by $25,000.",
      type: "alert",
      time: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
      read: true,
      relatedId: "property-4"
    },
    {
      id: "5",
      title: "Appointment reminder",
      message: "You have a property viewing scheduled tomorrow at 2:00 PM.",
      type: "appointment",
      time: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
      read: true,
      relatedId: "appointment-1"
    }
  ];
};