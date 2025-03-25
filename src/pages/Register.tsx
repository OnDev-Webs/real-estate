
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building2, Mail, Lock, User, ArrowRight, X } from "lucide-react";
import { FaGoogle, FaFacebook } from "react-icons/fa6";
import { toast } from "@/hooks/use-toast";
import { useAuth, UserRole } from "@/contexts/AuthContext";

const Register = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<UserRole>("buyer");
  const [error, setError] = useState("");
  const { register, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      toast({
        title: "Registration failed",
        description: "Passwords do not match. Please try again.",
        variant: "destructive",
      });
      return;
    }

    try {
      await register(email, password, name, role);
      toast({
        title: "Registration successful",
        description: "Your account has been created successfully!",
      });
      navigate("/dashboard");
      if (onClose) onClose();
    } catch (err) {
      console.error("Registration error:", err);
      setError("Registration failed. Please try again.");
      toast({
        title: "Registration failed",
        description: "Please try again with different credentials.",
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
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full relative max-h-[90vh] overflow-y-auto">
          {/* Close Button */}
          <button className="absolute top-3 right-3 text-gray-600 hover:text-gray-800" onClick={onClose}>
            <X className="h-5 w-5" />
          </button>
    
          {/* Header */}
          <div className="text-center mb-6 pb-2">
            <h1 className="text-2xl font-bold">Create an account</h1>
            <p className="mt-2 text-gray-600">Join our platform to buy, sell, or list properties</p>
          </div>
    
          {/* Form */}
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input id="name" type="text" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} className="pl-10" required />
              </div>
            </div>
    
            <div>
              <Label htmlFor="email">Email address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input id="email" type="email" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10" required />
              </div>
            </div>
    
            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10" required />
              </div>
            </div>
  
            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input 
                  id="confirmPassword" 
                  type="password" 
                  placeholder="••••••••" 
                  value={confirmPassword} 
                  onChange={(e) => setConfirmPassword(e.target.value)} 
                  className="pl-10" 
                  required 
                />
              </div>
            </div>
    
            <div>
              <Label htmlFor="role">I want to</Label>
              <select 
                id="role" 
                value={role} 
                onChange={(e) => setRole(e.target.value as UserRole)} 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-estate-primary" 
                required
              >
                <option value="buyer">Buy Properties</option>
                <option value="owner">Sell My Properties</option>
                <option value="agent">List as an Agent</option>
              </select>
            </div>
    
            {error && <div className="text-red-500 text-sm">{error}</div>}
    
            <Button type="submit" className="w-full bg-estate-primary hover:bg-estate-primary/90" disabled={isLoading}>
              {isLoading ? "Creating Account..." : "Create Account"}
              {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
          </form>
    
          {/* Social Sign-in */}
          <div className="mt-4 space-y-3">
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
    
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="text-estate-primary hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
