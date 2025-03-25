
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, ArrowRight, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { FaGoogle, FaFacebook } from "react-icons/fa6";
import { handleOAuthRedirect } from "@/services/authService";
import { toast } from "@/hooks/use-toast";

const Login = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Check for OAuth redirect on component mount
  useEffect(() => {
    handleOAuthRedirect();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    try {
      await login(email, password);
      toast({
        title: "Login successful",
        description: "Welcome back to RealEstate!",
      });
      
      const from = location.state?.from?.pathname || "/dashboard";
      navigate(from, { replace: true });
      
      if (onClose) onClose();
    } catch (err) {
      console.error("Login error:", err);
      setError("Invalid email or password. Please try again.");
      toast({
        title: "Login failed",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      });
    }
  };

  // Function to handle OAuth logins
  const handleOAuthLogin = (provider: 'google' | 'facebook') => {
    window.location.href = `http://localhost:5000/auth/${provider}`;
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Background Overlay */}
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose}></div>
      
      {/* Modal Container */}
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative z-50">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Header */}
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-bold">Welcome back</h1>
            <p className="mt-2 text-gray-600">Sign in to continue to your account</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link to="/forgot-password" className="text-sm text-estate-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {error && <div className="text-red-500 text-sm">{error}</div>}

            <Button
              type="submit"
              className="w-full bg-estate-primary hover:bg-estate-primary/90 flex items-center justify-center"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign in"}
              {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
          </form>

          {/* Social Login Buttons */}
          <div className="mt-6 space-y-3">
            <div className="flex items-center">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="px-2 text-gray-500 text-sm">or continue with</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

            <div className="flex space-x-4">
              <button 
                type="button"
                onClick={() => handleOAuthLogin('google')}
                className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
              >
                <FaGoogle className="h-5 w-5 mr-2" />
                Google
              </button>
              <button 
                type="button"
                onClick={() => handleOAuthLogin('facebook')}
                className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
              >
                <FaFacebook className="h-5 w-5 mr-2 text-blue-600" />
                Facebook
              </button>
            </div>
          </div>

          {/* Signup Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link to="/register" className="text-estate-primary hover:underline font-medium">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
