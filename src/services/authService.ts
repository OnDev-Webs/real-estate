import { User } from "@/contexts/AuthContext";

const API_URL = "http://localhost:5000";

// Define Notification type
export interface Notification {
  id: string;
  type: 'message' | 'property' | 'offer' | 'alert' | 'appointment' | string;
  title: string;
  message: string;
  read: boolean;
  time: Date;
  relatedId?: string;
}

// Register user
export const registerUser = async (
  email: string,
  password: string,
  name: string,
  role: string
): Promise<{ user: User; token: string }> => {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password, name, role }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Registration failed");
  }

  const data = await response.json();
  
  // Save to localStorage
  localStorage.setItem("authToken", data.token);
  localStorage.setItem("user", JSON.stringify(data.user));
  
  return data;
};

// Login user
export const loginUser = async (
  email: string,
  password: string
): Promise<{ user: User; token: string }> => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Login failed");
  }

  const data = await response.json();
  
  // Save to localStorage
  localStorage.setItem("authToken", data.token);
  localStorage.setItem("user", JSON.stringify(data.user));
  
  return data;
};

// Logout user
export const logoutUser = (): void => {
  localStorage.removeItem("authToken");
  localStorage.removeItem("user");
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem("authToken");
};

// Get current user from localStorage
export const getCurrentUser = (): User | null => {
  const userStr = localStorage.getItem("user");
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr);
  } catch (error) {
    console.error("Error parsing user data", error);
    return null;
  }
};

// Fetch user details from API
export const fetchUserDetails = async (): Promise<User> => {
  const token = localStorage.getItem("authToken");
  if (!token) {
    throw new Error("Not authenticated");
  }

  const response = await fetch(`${API_URL}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch user details");
  }

  const data = await response.json();
  
  // Update localStorage
  localStorage.setItem("user", JSON.stringify(data.user));
  
  return data.user;
};

// Update user profile
export const updateUserProfile = async (profileData: Partial<User>): Promise<User> => {
  const token = localStorage.getItem("authToken");
  if (!token) {
    throw new Error("Not authenticated");
  }

  const response = await fetch(`${API_URL}/auth/profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(profileData),
  });

  if (!response.ok) {
    throw new Error("Failed to update profile");
  }

  const data = await response.json();
  
  // Update localStorage
  localStorage.setItem("user", JSON.stringify(data.user));
  
  return data.user;
};

// Update password
export const updatePassword = async (
  currentPassword: string,
  newPassword: string
): Promise<{ message: string }> => {
  const token = localStorage.getItem("authToken");
  if (!token) {
    throw new Error("Not authenticated");
  }

  const response = await fetch(`${API_URL}/auth/password`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ currentPassword, newPassword }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to update password");
  }

  return await response.json();
};

// Update notification preferences
export const updateNotificationPreferences = async (
  preferences: Record<string, boolean>
): Promise<User> => {
  const token = localStorage.getItem("authToken");
  if (!token) {
    throw new Error("Not authenticated");
  }

  const response = await fetch(`${API_URL}/auth/notification-preferences`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ preferences }),
  });

  if (!response.ok) {
    throw new Error("Failed to update notification preferences");
  }

  const data = await response.json();
  
  // Update localStorage
  localStorage.setItem("user", JSON.stringify(data.user));
  
  return data.user;
};

// Toggle favorite property
export const toggleFavoriteProperty = async (propertyId: string): Promise<{ message: string }> => {
  const token = localStorage.getItem("authToken");
  if (!token) {
    throw new Error("Not authenticated");
  }

  const response = await fetch(`${API_URL}/auth/favorites/${propertyId}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to toggle favorite property");
  }

  return await response.json();
};

// Get user favorites
export const getFavorites = async (): Promise<string[]> => {
  const token = localStorage.getItem("authToken");
  if (!token) {
    return [];
  }

  const response = await fetch(`${API_URL}/auth/favorites`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    return [];
  }

  const data = await response.json();
  return data.favorites;
};

// Toggle share profile preference
export const toggleShareProfile = async (share: boolean): Promise<{ message: string }> => {
  const token = localStorage.getItem("authToken");
  if (!token) {
    throw new Error("Not authenticated");
  }

  const response = await fetch(`${API_URL}/auth/share-profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ share }),
  });

  if (!response.ok) {
    throw new Error("Failed to update sharing preference");
  }

  return await response.json();
};

// OAuth redirect handler
export const handleOAuthRedirect = (): void => {
  // Check if there's an OAuth token in the URL (e.g., after redirect)
  const params = new URLSearchParams(window.location.search);
  const token = params.get('token');
  const error = params.get('error');
  
  if (error) {
    console.error('OAuth login failed:', error);
    // Could display an error message here
  }
  
  if (token) {
    // Store the token
    localStorage.setItem('authToken', token);
    
    // Try to extract user data if it's in the URL
    const userData = params.get('userData');
    if (userData) {
      try {
        const user = JSON.parse(decodeURIComponent(userData));
        localStorage.setItem('user', JSON.stringify(user));
      } catch (e) {
        console.error('Failed to parse user data from URL', e);
      }
    } else {
      // If user data isn't in the URL, fetch it
      fetchUserDetails().catch(err => {
        console.error('Failed to fetch user details after OAuth login', err);
      });
    }
    
    // Redirect to dashboard
    window.location.href = '/dashboard';
  }
};

// Get user notifications
export const getUserNotifications = async (): Promise<Notification[]> => {
  const token = localStorage.getItem("authToken");
  if (!token) {
    throw new Error("Authentication required");
  }

  const response = await fetch(`${API_URL}/notifications`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch notifications");
  }

  const data = await response.json();
  return data.notifications.map((notification: any) => ({
    ...notification,
    id: notification._id || notification.id,
    time: new Date(notification.createdAt || notification.updatedAt || new Date())
  }));
};

// Mark notification as read
export const markNotificationAsRead = async (id: string) => {
  const token = localStorage.getItem("authToken");
  if (!token) {
    throw new Error("Authentication required");
  }

  const response = await fetch(`${API_URL}/notifications/${id}/read`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to mark notification as read");
  }

  return await response.json();
};

// Mark all notifications as read
export const markAllNotificationsAsRead = async () => {
  const token = localStorage.getItem("authToken");
  if (!token) {
    throw new Error("Authentication required");
  }

  const response = await fetch(`${API_URL}/notifications/read-all`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to mark all notifications as read");
  }

  return await response.json();
};

// Delete notification
export const deleteNotification = async (id: string) => {
  const token = localStorage.getItem("authToken");
  if (!token) {
    throw new Error("Authentication required");
  }

  const response = await fetch(`${API_URL}/notifications/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to delete notification");
  }

  return await response.json();
};
