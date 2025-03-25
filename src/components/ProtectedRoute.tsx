
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from "@/hooks/use-toast";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-estate-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Show toast notification
    toast({
      title: "Authentication Required",
      description: "You need to be logged in to access this page",
      variant: "destructive",
    });
    
    // Redirect to login page but save the location they were trying to access
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
