
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { DollarSign, MessageSquare, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface PropertyBuyerActionsProps {
  propertyId: string;
  propertyTitle: string;
  propertyPrice: number;
}

const PropertyBuyerActions: React.FC<PropertyBuyerActionsProps> = ({
  propertyId,
  propertyTitle,
  propertyPrice,
}) => {
  const { toast } = useToast();
  const { user, isAuthenticated, toggleFavorite } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [offerAmount, setOfferAmount] = useState(propertyPrice.toString());
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleMakeOffer = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please login to make an offer on this property.",
        variant: "destructive",
      });
      navigate('/login', { state: { from: `/property/${propertyId}` } });
      return;
    }
    
    // In a real app, this would connect to a backend API
    toast({
      title: "Offer Submitted",
      description: "Your offer has been sent to the seller.",
    });
    setIsDialogOpen(false);
  };

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please login to purchase this property.",
        variant: "destructive",
      });
      navigate('/login', { state: { from: `/property/${propertyId}` } });
      return;
    }
    
    // In a real app, this would redirect to a payment/checkout flow
    toast({
      title: "Purchase Initiated",
      description: "You'll be redirected to complete your purchase.",
    });
  };

  const handleSaveProperty = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please login to save this property to favorites.",
        variant: "destructive",
      });
      navigate('/login', { state: { from: `/property/${propertyId}` } });
      return;
    }
    
    await toggleFavorite(propertyId);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
      <h3 className="text-xl font-semibold mb-6">Interested in this property?</h3>
      
      <div className="space-y-4">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              className="w-full bg-estate-primary hover:bg-estate-primary/90 mb-2"
            >
              <MessageSquare className="mr-2 h-5 w-5" />
              Make an Offer
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Make an Offer</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="propertyTitle" className="text-sm font-medium">Property</label>
                <Input id="propertyTitle" value={propertyTitle} disabled />
              </div>
              <div className="space-y-2">
                <label htmlFor="offerAmount" className="text-sm font-medium">Your Offer</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="offerAmount"
                    type="number"
                    value={offerAmount}
                    onChange={(e) => setOfferAmount(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium">Message to Seller</label>
                <Textarea
                  id="message"
                  placeholder="Include any details or questions about the property"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="button" onClick={handleMakeOffer}>
                Submit Offer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        <Button 
          variant="outline" 
          className="w-full"
          onClick={handleBuyNow}
        >
          <DollarSign className="mr-2 h-5 w-5" />
          Buy Now
        </Button>
        
        <Button 
          variant="outline" 
          className="w-full"
          onClick={handleSaveProperty}
        >
          <Heart className="mr-2 h-5 w-5" />
          Save Property
        </Button>
      </div>
    </div>
  );
};

export default PropertyBuyerActions;
