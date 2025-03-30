
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { 
  loginUser, 
  registerUser, 
  logoutUser, 
  getCurrentUser, 
  isAuthenticated,
  fetchUserDetails,
  toggleFavoriteProperty,
  getFavorites,
  toggleShareProfile
} from "@/services/authService";

export type UserRole = "owner" | "agent" | "buyer" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
  phone?: string;
  avatar?: string;
  bio?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  company?: string;
  website?: string;
  description?: string;
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
  };
  preferences?: {
    emailNotifications?: boolean;
    listings?: boolean;
    messages?: boolean;
    shareProfile?: boolean;
  };
  favorites?: string[];
  memberSince?: string;
}

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, role: UserRole) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  toggleFavorite: (propertyId: string) => Promise<void>;
  isFavorite: (propertyId: string) => boolean;
  setShareProfile: (share: boolean) => Promise<void>;
  userFavorites: string[];
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userFavorites, setUserFavorites] = useState<string[]>([]);
  const navigate = useNavigate();

  // Check for existing session on mount using JWT
  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (isAuthenticated()) {
          const currentUser = getCurrentUser();
          if (currentUser) {
            setUser(currentUser);
            
            // Refresh user data from server
            try {
              const updatedUser = await fetchUserDetails();
              setUser(updatedUser);
              
              // Fetch user favorites
              const favorites = await getFavorites();
              setUserFavorites(favorites);
            } catch (error) {
              console.error("Could not refresh user data:", error);
              // If refresh fails, log the user out
              logoutUser();
              setUser(null);
            }
          }
        }
      } catch (error) {
        console.error("Auth check error:", error);
        // If token is invalid, clear it
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { user: loggedInUser } = await loginUser(email, password);
      setUser(loggedInUser);
      
      // Fetch user favorites after login
      const favorites = await getFavorites();
      setUserFavorites(favorites);
      
      toast({
        title: "Success!",
        description: "You have successfully logged in.",
      });
      
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login failed",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string, role: UserRole) => {
    setIsLoading(true);
    try {
      const { user: registeredUser } = await registerUser(email, password, name, role);
      setUser(registeredUser);
      
      toast({
        title: "Registration successful!",
        description: "Your account has been created.",
      });
      
      navigate("/dashboard");
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Registration failed",
        description: "Please try again with different credentials.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUser = async () => {
    try {
      const updatedUser = await fetchUserDetails();
      setUser(updatedUser);
      
      // Refresh favorites
      const favorites = await getFavorites();
      setUserFavorites(favorites);
    } catch (error) {
      console.error("Failed to refresh user:", error);
      // If refresh fails, log the user out
      logoutUser();
      setUser(null);
      throw error;
    }
  };

  const logout = () => {
    logoutUser();
    setUser(null);
    setUserFavorites([]);
    
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    
    navigate("/");
  };
  
  const toggleFavorite = async (propertyId: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please login to save properties to favorites",
        variant: "destructive"
      });
      navigate("/login");
      return;
    }
    
    try {
      await toggleFavoriteProperty(propertyId);
      // Update favorites list
      const favorites = await getFavorites();
      setUserFavorites(favorites);
      
      const isFav = favorites.includes(propertyId);
      toast({
        title: isFav ? "Property saved" : "Property removed",
        description: isFav 
          ? "Property has been added to your favorites" 
          : "Property has been removed from your favorites"
      });
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast({
        title: "Error",
        description: "Failed to update favorites. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const isFavorite = (propertyId: string): boolean => {
    return userFavorites.includes(propertyId);
  };
  
  const setShareProfile = async (share: boolean) => {
    try {
      await toggleShareProfile(share);
      // Update user with new preference
      await refreshUser();
      
      toast({
        title: "Preference updated",
        description: share 
          ? "Your profile is now visible to property owners" 
          : "Your profile is now hidden from property owners"
      });
    } catch (error) {
      console.error("Error updating sharing preference:", error);
      toast({
        title: "Error",
        description: "Failed to update preference. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        refreshUser,
        toggleFavorite,
        isFavorite,
        setShareProfile,
        userFavorites
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
