
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { 
  loginUser, 
  registerUser, 
  logoutUser, 
  getCurrentUser, 
  isAuthenticated,
  fetchUserDetails
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
    
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    
    navigate("/");
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
