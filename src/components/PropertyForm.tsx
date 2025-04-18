
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { createProperty, uploadPropertyImages } from '@/services/propertyService';

const formSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters" }),
  description: z.string().min(20, { message: "Description must be at least 20 characters" }),
  price: z.string().transform((val) => parseFloat(val)),
  status: z.string(),
  propertyType: z.string(),
  bedrooms: z.string().transform((val) => parseInt(val)),
  bathrooms: z.string().transform((val) => parseFloat(val)),
  area: z.string().transform((val) => parseInt(val)),
  address: z.string().min(5, { message: "Address is required" }),
  city: z.string().min(2, { message: "City is required" }),
  state: z.string().min(2, { message: "State is required" }),
  zip: z.string().min(2, { message: "Zip code is required" }),
});

interface PropertyFormProps {
  onSuccess?: () => void;
  propertyData?: any;
  onSubmit?: (values: any, images: File[]) => Promise<void>;
  isLoading?: boolean;
  initialData?: any;
  isEditMode?: boolean;
}

const PropertyForm: React.FC<PropertyFormProps> = ({ 
  onSuccess, 
  propertyData, 
  onSubmit: externalSubmit,
  isLoading: externalLoading = false,
  initialData,
  isEditMode = false
}) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState<File[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || propertyData || {
      title: '',
      description: '',
      price: '',
      status: 'for-sale',
      propertyType: 'house',
      bedrooms: '3',
      bathrooms: '2',
      area: '1500',
      address: '',
      city: '',
      state: '',
      zip: '',
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setImages(prev => [...prev, ...selectedFiles]);
    }
  };

  const onSubmitForm = async (values: z.infer<typeof formSchema>) => {
    if (externalSubmit) {
      return externalSubmit(values, images);
    }
    
    setIsLoading(true);
    try {
      // First, upload images if any
      let imageUrls: string[] = [];
      
      if (images.length > 0) {
        const formData = new FormData();
        images.forEach((image) => {
          formData.append('images', image);
        });
        
        imageUrls = await uploadPropertyImages(formData);
      }
      
      // Then create the property
      const propertyData = {
        title: values.title,
        description: values.description,
        price: values.price,
        features: {
          status: values.status,
          propertyType: values.propertyType,
          bedrooms: values.bedrooms,
          bathrooms: values.bathrooms,
          area: values.area,
        },
        location: {
          address: values.address,
          city: values.city,
          state: values.state,
          zip: values.zip,
        },
        images: imageUrls,
      };
      
      await createProperty(propertyData);
      
      toast({
        title: "Success",
        description: "Property created successfully",
      });
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error creating property:', error);
      toast({
        title: "Error",
        description: "Failed to create property",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadingState = externalLoading || isLoading;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmitForm)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Property Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Modern Apartment in Downtown" {...field} disabled={loadingState} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="250000" {...field} disabled={loadingState} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value} 
                      disabled={loadingState}
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
              
              <FormField
                control={form.control}
                name="propertyType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Property Type</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      disabled={loadingState}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
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
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="bedrooms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bedrooms</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} disabled={loadingState} />
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
                      <Input type="number" step="0.5" {...field} disabled={loadingState} />
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
                      <Input type="number" {...field} disabled={loadingState} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe the property..." 
                      className="resize-none h-32" 
                      {...field} 
                      disabled={loadingState} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="123 Main St" {...field} disabled={loadingState} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input placeholder="New York" {...field} disabled={loadingState} />
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
                    <FormLabel>State</FormLabel>
                    <FormControl>
                      <Input placeholder="NY" {...field} disabled={loadingState} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="zip"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Zip Code</FormLabel>
                    <FormControl>
                      <Input placeholder="10001" {...field} disabled={loadingState} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>
        
        <div>
          <FormLabel>Upload Images</FormLabel>
          <Input 
            type="file" 
            multiple 
            accept="image/*" 
            onChange={handleImageChange}
            disabled={loadingState}
            className="mt-1"
          />
          {images.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {images.map((image, index) => (
                <div key={index} className="relative">
                  <img 
                    src={URL.createObjectURL(image)} 
                    alt={`Preview ${index}`} 
                    className="h-20 w-20 object-cover rounded-md" 
                  />
                </div>
              ))}
            </div>
          )}
        </div>
        
        <Button 
          type="submit" 
          className="w-full bg-black hover:bg-black/80" 
          disabled={loadingState}
        >
          {loadingState ? "Creating Property..." : isEditMode ? "Update Property" : "Create Property"}
        </Button>
      </form>
    </Form>
  );
};

export default PropertyForm;
