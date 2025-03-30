
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Upload } from 'lucide-react';

// This is a simplified mock implementation since we don't have the actual uploadthing package
interface UploadButtonProps {
  endpoint: string;
  onClientUploadComplete?: (urls: string[]) => void;
  onUploadError?: (error: Error) => void;
}

export const UploadButton: React.FC<UploadButtonProps> = ({ 
  endpoint, 
  onClientUploadComplete, 
  onUploadError 
}) => {
  const [isUploading, setIsUploading] = useState(false);
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    
    if (!files || files.length === 0) return;
    
    setIsUploading(true);
    
    try {
      // Create a FormData object to send the files
      const formData = new FormData();
      Array.from(files).forEach(file => {
        formData.append('images', file);
      });
      
      // Get token from localStorage
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Authentication required');
      }
      
      // Send the files to the server
      const response = await fetch('http://localhost:5000/properties/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      
      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Call the callback with the image URLs
      if (onClientUploadComplete) {
        onClientUploadComplete(data.urls);
      }
    } catch (error) {
      console.error('Error uploading images:', error);
      if (onUploadError) {
        onUploadError(error as Error);
      }
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <input
        type="file"
        multiple
        onChange={handleFileChange}
        className="hidden"
        id="upload-button"
        accept="image/*"
      />
      <label htmlFor="upload-button">
        <Button type="button" variant="outline" asChild disabled={isUploading}>
          <span className="cursor-pointer flex items-center gap-2">
            <Upload size={16} />
            {isUploading ? "Uploading..." : "Upload Images"}
          </span>
        </Button>
      </label>
    </div>
  );
};
