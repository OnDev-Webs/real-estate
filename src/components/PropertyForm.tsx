import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { UploadButton } from "@/lib/uploadthing";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, ArrowLeft, ArrowRight } from "lucide-react";
import PropertyMap from "./PropertyMap";
import { Property } from "@/lib/data";
import { Card, CardContent } from "@/components/ui/card";

interface PropertyFormProps {
  onSubmit: (data: any, images: File[]) => void;
  isLoading: boolean;
  initialData?: any;
  isEditMode?: boolean;
}

const propertySchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  price: z.string().refine(val => !isNaN(Number(val)), {
    message: "Price must be a valid number",
  }),
  propertyType: z.string(),
  status: z.string(),
  bedrooms: z.string().refine(val => !isNaN(Number(val)), {
    message: "Bedrooms must be a valid number",
  }),
  bathrooms: z.string().refine(val => !isNaN(Number(val)), {
    message: "Bathrooms must be a valid number",
  }),
  area: z.string().refine(val => !isNaN(Number(val)), {
    message: "Area must be a valid number",
  }),
  yearBuilt: z.string().refine(val => !isNaN(Number(val)), {
    message: "Year built must be a valid number",
  }),
  address: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(2, "City must be at least 2 characters"),
  state: z.string().min(2, "State must be at least 2 characters"),
  zipCode: z.string().min(5, "Zip code must be at least 5 characters"),
  country: z.string().min(2, "Country must be at least 2 characters"),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
  hasGarden: z.boolean().optional().default(false),
  hasGarage: z.boolean().optional().default(false),
  hasPool: z.boolean().optional().default(false),
  isPetFriendly: z.boolean().optional().default(false),
  hasCentralHeating: z.boolean().optional().default(false),
  hasAirConditioning: z.boolean().optional().default(false),
});

type PropertyFormValues = z.infer<typeof propertySchema>;
type PropertyFieldName = keyof PropertyFormValues;

const PropertyForm: React.FC<PropertyFormProps> = ({
  onSubmit,
  isLoading,
  initialData,
  isEditMode = false,
}) => {
  enum FormSections {
    BASIC_INFO = 0,
    PROPERTY_DETAILS = 1,
    LOCATION = 2,
    AMENITIES = 3,
    IMAGES = 4,
  }

  const [currentSection, setCurrentSection] = useState(FormSections.BASIC_INFO);
  const [uploadedImages, setUploadedImages] = useState<string[]>(
    initialData?.existingImages || []
  );
  const [newImages, setNewImages] = useState<File[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      price: initialData?.price?.toString() || "",
      propertyType: initialData?.features?.propertyType || "apartment",
      status: initialData?.features?.status || "for-sale",
      bedrooms: initialData?.features?.bedrooms?.toString() || "1",
      bathrooms: initialData?.features?.bathrooms?.toString() || "1",
      area: initialData?.features?.area?.toString() || "0",
      yearBuilt: initialData?.features?.yearBuilt?.toString() || new Date().getFullYear().toString(),
      address: initialData?.location?.address || "",
      city: initialData?.location?.city || "",
      state: initialData?.location?.state || "",
      zipCode: initialData?.location?.zip || "",
      country: initialData?.location?.country || "United States",
      latitude: initialData?.location?.lat?.toString() || "",
      longitude: initialData?.location?.lng?.toString() || "",
      hasGarden: initialData?.features?.hasGarden || false,
      hasGarage: initialData?.features?.hasGarage || false,
      hasPool: initialData?.features?.hasPool || false,
      isPetFriendly: initialData?.features?.isPetFriendly || false,
      hasCentralHeating: initialData?.features?.hasCentralHeating || false,
      hasAirConditioning: initialData?.features?.hasAirConditioning || false,
    },
  });

  const handleUploadComplete = (urls: string[]) => {
    console.log("Upload complete, received URLs:", urls);
    setUploadedImages([...uploadedImages, ...urls]);
    setUploadError(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      setNewImages([...newImages, ...files]);
      
      const tempUrls = files.map(file => URL.createObjectURL(file));
      setUploadedImages([...uploadedImages, ...tempUrls]);
    }
  };

  const handleFormSubmit = form.handleSubmit((data) => {
    if (uploadedImages.length === 0 && newImages.length === 0) {
      setUploadError("At least one image is required");
      setCurrentSection(FormSections.IMAGES);
      return;
    }
    
    onSubmit(data, newImages);
  });

  const handleNext = async () => {
    const sectionFields = getSectionFields(currentSection);
    
    const isValid = await form.trigger(sectionFields as PropertyFieldName[]);
    
    if (isValid) {
      setCurrentSection(currentSection + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentSection(currentSection - 1);
  };

  const getSectionFields = (section: FormSections): PropertyFieldName[] => {
    switch (section) {
      case FormSections.BASIC_INFO:
        return ["title", "description", "price", "status"];
      case FormSections.PROPERTY_DETAILS:
        return ["propertyType", "bedrooms", "bathrooms", "area", "yearBuilt"];
      case FormSections.LOCATION:
        return ["address", "city", "state", "zipCode", "country", "latitude", "longitude"];
      case FormSections.AMENITIES:
        return [
          "hasGarden", "hasGarage", "hasPool", 
          "isPetFriendly", "hasCentralHeating", "hasAirConditioning"
        ];
      case FormSections.IMAGES:
        return [];
      default:
        return [];
    }
  };

  const renderSectionHeading = () => {
    switch (currentSection) {
      case FormSections.BASIC_INFO:
        return "Basic Information";
      case FormSections.PROPERTY_DETAILS:
        return "Property Details";
      case FormSections.LOCATION:
        return "Location Information";
      case FormSections.AMENITIES:
        return "Amenities & Features";
      case FormSections.IMAGES:
        return "Property Images";
      default:
        return "";
    }
  };

  const renderSectionContent = () => {
    switch (currentSection) {
      case FormSections.BASIC_INFO:
        return renderBasicInfoSection();
      case FormSections.PROPERTY_DETAILS:
        return renderPropertyDetailsSection();
      case FormSections.LOCATION:
        return renderLocationSection();
      case FormSections.AMENITIES:
        return renderAmenitiesSection();
      case FormSections.IMAGES:
        return renderImagesSection();
      default:
        return null;
    }
  };

  const renderBasicInfoSection = () => (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Property Title</FormLabel>
            <FormControl>
              <Input placeholder="Enter property title" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Describe the property" 
                className="min-h-32" 
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="Enter price" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Listing Status</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="for-sale">For Sale</SelectItem>
                  <SelectItem value="for-rent">For Rent</SelectItem>
                  <SelectItem value="sold">Sold</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );

  const renderPropertyDetailsSection = () => (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="propertyType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Property Type</FormLabel>
            <Select 
              onValueChange={field.onChange} 
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select property type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="apartment">Apartment</SelectItem>
                <SelectItem value="house">House</SelectItem>
                <SelectItem value="villa">Villa</SelectItem>
                <SelectItem value="plot">Plot</SelectItem>
                <SelectItem value="penthouse">Penthouse</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField
          control={form.control}
          name="bedrooms"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bedrooms</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="Number of bedrooms" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="bathrooms"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bathrooms</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="Number of bathrooms" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="area"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Area (sq ft)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="Property area" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <FormField
        control={form.control}
        name="yearBuilt"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Year Built</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                placeholder="Year built" 
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );

  const renderLocationSection = () => {
    const previewProperty: Property = {
      id: "preview",
      title: form.getValues("title"),
      location: {
        address: form.getValues("address"),
        city: form.getValues("city"),
        state: form.getValues("state"),
        zip: form.getValues("zipCode"),
        country: form.getValues("country"),
        lat: parseFloat(form.getValues("latitude")) || 19.0760,
        lng: parseFloat(form.getValues("longitude")) || 72.8777
      },
      price: parseFloat(form.getValues("price")) || 0,
      images: uploadedImages,
    } as Property;
    
    return (
      <div className="space-y-4">
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Street Address</FormLabel>
              <FormControl>
                <Input placeholder="Enter street address" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input placeholder="Enter city" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>State/Province</FormLabel>
                <FormControl>
                  <Input placeholder="Enter state" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="zipCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Zip/Postal Code</FormLabel>
                <FormControl>
                  <Input placeholder="Enter zip code" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <FormControl>
                  <Input placeholder="Enter country" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="latitude"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Latitude (optional)</FormLabel>
                <FormControl>
                  <Input placeholder="Enter latitude" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="longitude"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Longitude (optional)</FormLabel>
                <FormControl>
                  <Input placeholder="Enter longitude" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="mt-4">
          <h3 className="text-sm font-medium mb-2">Location Preview</h3>
          <div className="h-64 border rounded-md overflow-hidden">
            {previewProperty.location && (
              <PropertyMap 
                properties={[previewProperty]} 
                singleProperty={true} 
              />
            )}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Note: Use the latitude and longitude fields to precisely position your property on the map
          </p>
        </div>
      </div>
    );
  };

  const renderAmenitiesSection = () => (
    <div className="space-y-4">
      <h3 className="text-sm font-medium mb-2">Select Available Amenities</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="hasGarden"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel className="font-normal">Garden</FormLabel>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="hasGarage"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel className="font-normal">Garage</FormLabel>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="hasPool"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel className="font-normal">Swimming Pool</FormLabel>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="isPetFriendly"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel className="font-normal">Pet Friendly</FormLabel>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="hasCentralHeating"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel className="font-normal">Central Heating</FormLabel>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="hasAirConditioning"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel className="font-normal">Air Conditioning</FormLabel>
            </FormItem>
          )}
        />
      </div>
    </div>
  );

  const renderImagesSection = () => (
    <div className="space-y-4">
      {uploadError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{uploadError}</AlertDescription>
        </Alert>
      )}
      
      <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
        <div className="space-y-2">
          <div className="flex justify-center">
            <UploadButton
              endpoint="imageUploader"
              onClientUploadComplete={handleUploadComplete}
              onUploadError={(error) => setUploadError(error.message)}
            />
          </div>
          <p className="text-sm text-gray-500">
            or
          </p>
          <div>
            <label
              htmlFor="file-upload"
              className="cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500"
            >
              <span>Select files from your computer</span>
              <input
                id="file-upload"
                name="file-upload"
                type="file"
                className="sr-only"
                multiple
                accept="image/*"
                onChange={handleFileChange}
              />
            </label>
          </div>
          <p className="text-xs text-gray-500">
            PNG, JPG, WEBP up to 10MB
          </p>
        </div>
      </div>
      
      {uploadedImages.length > 0 && (
        <div>
          <h3 className="text-sm font-medium mb-2">Uploaded Images</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {uploadedImages.map((url, index) => (
              <div key={index} className="relative group">
                <img
                  src={url}
                  alt={`Uploaded ${index + 1}`}
                  className="h-24 w-full object-cover rounded-md border border-gray-200"
                />
                <button
                  type="button"
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center text-xs opacity-80 hover:opacity-100"
                  onClick={() => {
                    const newUrls = [...uploadedImages];
                    newUrls.splice(index, 1);
                    setUploadedImages(newUrls);
                    
                    if (index < newImages.length) {
                      const newFiles = [...newImages];
                      newFiles.splice(index, 1);
                      setNewImages(newFiles);
                    }
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderProgressIndicator = () => (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        {[...Array(5)].map((_, i) => (
          <div 
            key={i} 
            className={`w-full h-1 mx-1 rounded ${
              i <= currentSection ? "bg-estate-primary" : "bg-gray-200"
            }`}
          />
        ))}
      </div>
      <div className="flex justify-between text-xs text-gray-500">
        <span>Basic</span>
        <span>Details</span>
        <span>Location</span>
        <span>Amenities</span>
        <span>Images</span>
      </div>
    </div>
  );

  return (
    <Card>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={handleFormSubmit} className="space-y-8">
            {renderProgressIndicator()}
            
            <div>
              <h2 className="text-lg font-semibold mb-4">{renderSectionHeading()}</h2>
              {renderSectionContent()}
            </div>
            
            <div className="flex justify-between pt-4">
              {currentSection > 0 ? (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handlePrevious}
                  disabled={isLoading}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>
              ) : (
                <div></div>
              )}
              
              {currentSection < FormSections.IMAGES ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  disabled={isLoading}
                >
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button 
                  type="submit" 
                  disabled={isLoading}
                >
                  {isLoading 
                    ? "Submitting..." 
                    : isEditMode 
                      ? "Update Property" 
                      : "Add Property"
                  }
                </Button>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default PropertyForm;
