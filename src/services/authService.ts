
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
