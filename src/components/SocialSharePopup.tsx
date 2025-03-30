
import { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Facebook, Instagram, Twitter, Copy, Share2, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SocialSharePopupProps {
  isOpen: boolean;
  onClose: () => void;
  propertyTitle: string;
  propertyId: string;
}

const SocialSharePopup = ({ isOpen, onClose, propertyTitle, propertyId }: SocialSharePopupProps) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  
  const baseUrl = window.location.origin;
  const propertyUrl = `${baseUrl}/property/${propertyId}`;
  
  const shareMessage = `Check out this property: ${propertyTitle} on FindHome`;
  
  const encodedMessage = encodeURIComponent(shareMessage);
  const encodedUrl = encodeURIComponent(propertyUrl);
  
  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedMessage}`;
  const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodedMessage}&url=${encodedUrl}`;
  const instagramShareUrl = `https://instagram.com`; // Instagram doesn't support direct sharing via URL
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(propertyUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };
  
  const handleSocialShare = (url: string) => {
    window.open(url, '_blank', 'width=600,height=400');
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Property Listed Successfully!</DialogTitle>
          <DialogDescription>
            Your property "{propertyTitle}" has been listed. Share it on social media to attract more potential buyers.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col space-y-4 py-4">
          <div className="flex justify-center space-x-6">
            <button
              onClick={() => handleSocialShare(facebookShareUrl)}
              className="flex flex-col items-center text-blue-600 hover:text-blue-800 transition-colors"
            >
              <div className="p-3 bg-blue-100 rounded-full mb-2">
                <Facebook size={24} />
              </div>
              <span className="text-xs">Facebook</span>
            </button>
            
            <button
              onClick={() => handleSocialShare(twitterShareUrl)}
              className="flex flex-col items-center text-sky-500 hover:text-sky-700 transition-colors"
            >
              <div className="p-3 bg-sky-100 rounded-full mb-2">
                <Twitter size={24} />
              </div>
              <span className="text-xs">Twitter</span>
            </button>
            
            <button
              onClick={() => {
                // For Instagram, we can just copy the link since direct sharing isn't supported
                handleCopyLink();
                toast({
                  title: "Link copied!",
                  description: "You can paste it on Instagram."
                });
              }}
              className="flex flex-col items-center text-pink-600 hover:text-pink-800 transition-colors"
            >
              <div className="p-3 bg-pink-100 rounded-full mb-2">
                <Instagram size={24} />
              </div>
              <span className="text-xs">Instagram</span>
            </button>
          </div>
          
          <div className="mt-4 flex items-center space-x-2">
            <input
              className="flex-1 p-2 border rounded-md text-sm text-gray-500"
              value={propertyUrl}
              readOnly
            />
            <Button 
              size="sm" 
              variant="outline" 
              onClick={handleCopyLink}
              className="flex items-center"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              <span className="ml-2">{copied ? "Copied" : "Copy"}</span>
            </Button>
          </div>
        </div>
        
        <DialogFooter className="sm:justify-start">
          <Button 
            type="button" 
            variant="secondary" 
            onClick={onClose}
            className="w-full sm:w-auto"
          >
            Close
          </Button>
          <Button 
            type="button"
            onClick={() => window.location.href = `/property/${propertyId}`}
            className="w-full sm:w-auto"
          >
            View Property
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SocialSharePopup;
