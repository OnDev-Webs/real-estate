
import { useSearchParams, useNavigate } from "react-router-dom";
import PropertyEditForm from "@/components/property/PropertyEditForm";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const EditPropertyContent = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const propertyId = searchParams.get("id");
  
  const handleSuccess = () => {
    toast({
      title: "Success",
      description: "Property updated successfully!",
    });
    
    // Redirect based on user role
    if (user?.role === 'admin') {
      navigate('/admin?tab=properties');
    } else {
      navigate('/dashboard?tab=properties');
    }
  };

  return <PropertyEditForm propertyId={propertyId} onSuccess={handleSuccess} />;
};

export default EditPropertyContent;
