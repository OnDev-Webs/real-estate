import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "@/hooks/use-toast";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Upload } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { addProperty, uploadImages } from "@/services/propertyService";

const formSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.string().refine(val => !isNaN(Number(val)) && Number(val) > 0, "Price must be a positive number"),
  bedrooms: z.string().refine(val => !isNaN(Number(val)) && Number(val) >= 0, "Bedrooms must be a non-negative number"),
  bathrooms: z.string().refine(val => !isNaN(Number(val)) && Number(val) >= 0, "Bathrooms must be a non-negative number"),
  area: z.string().refine(val => !isNaN(Number(val)) && Number(val) > 0, "Area must be a positive number"),
  propertyType: z.string().min(1, "Property type is required"),
  status: z.string().min(1, "Status is required"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zipCode: z.string().min(1, "ZIP code is required"),
  features: z.object({
    hasGarden: z.boolean().optional(),
    hasGarage: z.boolean().optional(),
    hasPool: z.boolean().optional(),
    isPetFriendly: z.boolean().optional(),
    hasCentralHeating: z.boolean().optional(),
    hasAirConditioning: z.boolean().optional()
  }).optional(),
});

const availableCities = [
  "Mumbai",
  "Navi Mumbai",
  "Thane"
];

const AddPropertyContent = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;
  const navigate = useNavigate();
  const { user } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      price: "",
      bedrooms: "",
      bathrooms: "",
      area: "",
      propertyType: "",
      status: "",
      address: "",
      city: "",
      state: "Maharashtra",
      zipCode: "",
      features: {
        hasGarden: false,
        hasGarage: false,
        hasPool: false,
        isPetFriendly: false,
        hasCentralHeating: false,
        hasAirConditioning: false
      }
    },
  });

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);
      setImages(prev => [...prev, ...newFiles]);
      
      const newUrls = newFiles.map(file => URL.createObjectURL(file));
      setPreviewUrls(prev => [...prev, ...newUrls]);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
    URL.revokeObjectURL(previewUrls[index]);
    setPreviewUrls(previewUrls.filter((_, i) => i !== index));
  };

  const nextStep = () => {
    const currentStepValid = validateCurrentStep();
    if (!currentStepValid) return;
    
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const validateCurrentStep = () => {
    let isValid = true;
    const values = form.getValues();
    
    switch (currentStep) {
      case 1:
        if (!values.title || !values.description) {
          toast({
            title: "Validation Error",
            description: "Please complete all required fields in this step",
            variant: "destructive",
          });
          isValid = false;
        }
        break;
      case 2:
        if (!values.price || !values.propertyType || !values.status || !values.bedrooms || !values.bathrooms || !values.area) {
          toast({
            title: "Validation Error",
            description: "Please complete all required fields in this step",
            variant: "destructive",
          });
          isValid = false;
        }
        break;
      case 3:
        if (!values.address || !values.city || !values.state || !values.zipCode) {
          toast({
            title: "Validation Error",
            description: "Please complete all required fields in this step",
            variant: "destructive",
          });
          isValid = false;
        }
        break;
      case 4:
        if (images.length === 0) {
          toast({
            title: "Validation Error",
            description: "Please upload at least one image",
            variant: "destructive",
          });
          isValid = false;
        }
        break;
    }
    
    return isValid;
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (images.length === 0) {
      toast({
        title: "Error",
        description: "Please upload at least one image",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      let imageUrls: string[] = [];
      try {
        imageUrls = await uploadImages(images);
      } catch (error) {
        console.error("Error uploading images:", error);
        imageUrls = previewUrls;
      }

      const propertyData = {
        title: data.title,
        description: data.description,
        price: parseFloat(data.price),
        features: {
          bedrooms: parseInt(data.bedrooms),
          bathrooms: parseInt(data.bathrooms),
          area: parseFloat(data.area),
          yearBuilt: new Date().getFullYear(),
          status: data.status as 'for-sale' | 'for-rent' | 'sold' | 'pending',
          propertyType: data.propertyType as 'apartment' | 'house' | 'villa' | 'plot' | 'penthouse',
          ...data.features
        },
        images: imageUrls,
        amenities: [],
        agent: {
          id: user?.id || "unknown",
          name: user?.name || "Unknown Agent",
          email: user?.email || "unknown@example.com",
          phone: user?.phone || "000-000-0000",
          image: user?.avatar || "https://via.placeholder.com/300"
        },
        location: {
          address: data.address,
          city: data.city,
          state: data.state,
          zip: data.zipCode,
          country: "India",
          lat: 19.076,
          lng: 72.8777
        },
        createdAt: new Date().toISOString(),
        featured: false,
        views: 0
      };

      await addProperty(propertyData);

      toast({
        title: "Success",
        description: "Property has been added successfully",
      });

      navigate("/dashboard?tab=properties");
    } catch (error) {
      console.error("Error adding property:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add property. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4 md:col-span-2">
            <h3 className="text-lg font-medium">Basic Information</h3>
            
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Modern Apartment in Mumbai" {...field} />
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
                      placeholder="Describe the property..." 
                      className="min-h-32" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );
        
      case 2:
        return (
          <div className="space-y-4 md:col-span-2">
            <h3 className="text-lg font-medium">Property Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price (₹)</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" placeholder="e.g., 5000000" {...field} />
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
                    <FormLabel>Area (sq.ft)</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" placeholder="e.g., 1200" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="bedrooms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bedrooms</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" placeholder="e.g., 3" {...field} />
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
                      <Input type="number" min="0" placeholder="e.g., 2" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="propertyType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Property Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="apartment">Apartment</SelectItem>
                        <SelectItem value="house">House</SelectItem>
                        <SelectItem value="villa">Villa</SelectItem>
                        <SelectItem value="condo">Condo</SelectItem>
                        <SelectItem value="land">Land</SelectItem>
                        <SelectItem value="commercial">Commercial</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="for-sale">For Sale</SelectItem>
                        <SelectItem value="for-rent">For Rent</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="space-y-4 mt-6">
              <h3 className="text-lg font-medium">Features & Amenities</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="features.hasGarden"
                  render={({ field }) => (
                    <FormItem className="flex items-start space-x-2 space-y-0">
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
                  name="features.hasGarage"
                  render={({ field }) => (
                    <FormItem className="flex items-start space-x-2 space-y-0">
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
                  name="features.hasPool"
                  render={({ field }) => (
                    <FormItem className="flex items-start space-x-2 space-y-0">
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
                  name="features.isPetFriendly"
                  render={({ field }) => (
                    <FormItem className="flex items-start space-x-2 space-y-0">
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
                  name="features.hasCentralHeating"
                  render={({ field }) => (
                    <FormItem className="flex items-start space-x-2 space-y-0">
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
                  name="features.hasAirConditioning"
                  render={({ field }) => (
                    <FormItem className="flex items-start space-x-2 space-y-0">
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
          </div>
        );
        
      case 3:
        return (
          <div className="space-y-4 md:col-span-2">
            <h3 className="text-lg font-medium">Location</h3>
            
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Street address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select city" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableCities.map((city) => (
                          <SelectItem key={city} value={city}>
                            {city}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State</FormLabel>
                    <FormControl>
                      <Input value="Maharashtra" disabled {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="zipCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ZIP Code</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 400001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        );
        
      case 4:
        return (
          <div className="space-y-4 md:col-span-2">
            <h3 className="text-lg font-medium">Property Images</h3>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="h-8 w-8 text-gray-400 mx-auto mb-4" />
              <h4 className="text-base font-medium mb-1">Upload Property Images</h4>
              <p className="text-sm text-gray-500 mb-4">Drag and drop your images here or click to browse</p>
              
              <label className="relative inline-block">
  <input
    type="file"
    id="images"
    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
    onChange={handleImageChange}
    accept="image/*"
    multiple
  />
  <span className="inline-block border border-gray-300 px-4 py-2 rounded bg-white text-sm cursor-pointer">
    Select Images
  </span>
</label>

            </div>
            
            {previewUrls.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
                {previewUrls.map((url, index) => (
                  <div key={index} className="relative rounded-md overflow-hidden group">
                    <img 
                      src={url} 
                      alt={`Preview ${index}`}
                      className="w-full h-24 object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
        
      default:
        return null;
    }
  };

  const renderProgressBar = () => {
    return (
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          {Array.from({ length: totalSteps }).map((_, index) => (
            <div 
              key={index} 
              className="relative flex items-center justify-center"
            >
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep > index + 1 
                    ? 'bg-green-500 text-white' 
                    : currentStep === index + 1 
                    ? 'bg-estate-primary text-white' 
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {index + 1}
              </div>
              <span className=" bottom-6 text-xs ms-3 whitespace-nowrap">
                {index === 0 ? 'Basic Info' : 
                 index === 1 ? 'Property Details' : 
                 index === 2 ? 'Location' : 'Images'}
              </span>
            </div>
          ))}
        </div>
        <div className="overflow-hidden h-2 rounded-full bg-gray-200 mt-2">
          <div 
            className="h-full bg-estate-primary" 
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          ></div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Add New Property</CardTitle>
          <CardDescription>Enter the details of the property you want to list</CardDescription>
        </CardHeader>
        <CardContent>
          {renderProgressBar() }
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 ">
              <div className="grid grid-cols-1 md:grid-cols-2 mt-5 gap-6">
                {renderStepContent()}
              </div>
              
              <div className="flex justify-between space-x-4">
                {currentStep > 1 ? (
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={prevStep}
                  >
                    Previous
                  </Button>
                ) : (
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => navigate('/dashboard')}
                  >
                    Cancel
                  </Button>
                )}
                
                {currentStep < totalSteps ? (
                  <Button 
                    type="button" 
                    onClick={nextStep}
                    className="bg-estate-primary hover:bg-estate-primary/90"
                  >
                    Next
                  </Button>
                ) : (
                  <Button 
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-estate-primary hover:bg-estate-primary/90"
                  >
                    {isSubmitting ? "Submitting..." : "Add Property"}
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddPropertyContent;
