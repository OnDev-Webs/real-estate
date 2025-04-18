
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface PropertyImagesProps {
  images: File[];
  setImages: (images: File[]) => void;
  isLoading: boolean;
}

const PropertyImages = ({ images, setImages, isLoading }: PropertyImagesProps) => {
  const [previewUrls, setPreviewUrls] = useState<string[]>(
    images.map(img => URL.createObjectURL(img))
  );

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files) as File[];
      
      // Add new files to existing ones
      const newImages = [...images, ...selectedFiles];
      setImages(newImages);
      
      // Create preview URLs
      const newPreviewUrls = [
        ...previewUrls,
        ...selectedFiles.map(file => URL.createObjectURL(file))
      ];
      setPreviewUrls(newPreviewUrls);
    }
  };

  const removeImage = (index: number) => {
    const updatedImages = [...images];
    updatedImages.splice(index, 1);
    setImages(updatedImages);
    
    const updatedPreviewUrls = [...previewUrls];
    URL.revokeObjectURL(updatedPreviewUrls[index]); // Clean up URL object
    updatedPreviewUrls.splice(index, 1);
    setPreviewUrls(updatedPreviewUrls);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Property Images</h3>
      
      <div className="border-2 border-dashed border-gray-300 rounded-md p-6">
        <Input 
          type="file" 
          accept="image/*" 
          multiple 
          onChange={handleImageChange}
          className="mb-4" 
          disabled={isLoading}
        />
        
        <p className="text-sm text-gray-500 mb-4">
          Upload high-quality images of your property. You can upload multiple images at once.
        </p>
        
        {previewUrls.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            {previewUrls.map((url, index) => (
              <div key={index} className="relative group">
                <img 
                  src={url} 
                  alt={`Property image ${index + 1}`} 
                  className="w-full h-40 object-cover rounded-md"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  onClick={() => removeImage(index)}
                  disabled={isLoading}
                >
                  <X size={16} />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center p-8 bg-gray-50 rounded-md">
            <p className="text-gray-500">No images selected</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyImages;
