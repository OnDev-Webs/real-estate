
import PropertyCreateForm from "@/components/property/PropertyCreateForm";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const AddPropertyContentAdmin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const handleSuccess = () => {
    toast({
      title: "Success",
      description: "Property created successfully!",
    });
    
    // Redirect based on user role
    if (user?.role === 'admin') {
      navigate('/admin?tab=properties');
    } else {
      navigate('/dashboard?tab=properties');
    }
  };

  return <PropertyCreateForm onSuccess={handleSuccess} />;
};

export default AddPropertyContentAdmin;
