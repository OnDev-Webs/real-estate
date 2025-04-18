
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Building2, 
  ArrowLeft, 
  DollarSign, 
  Bed, 
  Bath, 
  Square, 
  Upload, 
  X, 
  Check,
  MapPin
} from "lucide-react";
import { propertyTypes } from "@/lib/data";
// Fix: Use the correct import
import { addProperty } from "@/services/propertyService";

const mumbaiLocations = [
  "Andheri West", "Mahim", "Mira Road", "Mulund", "Vile Parle West",
  "Goregaon West", "Malabar Hill", "Byculla", "Andheri East", "Kurla",
  "Bhayandar", "Bhandup", "Juhu", "Borivali East", "Colaba", "Kanjurmarg",
  "Marol", "BKC", "Worli", "Ghatkopar West", "Jogeshwari East",
  "Borivali West", "Haware City", "Mahalaxmi", "Powai", "Ghatkopar East",
  "Matunga East", "Sion", "Jogeshwari West", "Dahisar", "Tardeo", "Grant Road"
];

const thaneLocations = [
  "Thane East", "Kolshet", "Waghbil", "Dombivli", "Beyond Thane", "Manpada",
  "Anand Nagar", "Korum Mall", "Hiranandani Estate", "Ghodbunder Road",
  "Majiwada", "Suraj Water Park", "Thane West"
];

const naviMumbaiLocations = [
  "Panvel", "Kharghar", "Turbhe", "Nerul", "Khandaeshwar", "Ulwe", "Airoli",
  "Taloja", "Vashi", "Seawood Darave", "Bamandongri", "Shilphata", "Ghansoli",
  "Koparkhairane", "Sanpada", "Belapur CBD", "Kharkopar", "Navi Mumbai",
  "Rabale", "Juinagar", "Mansarovar", "Diva"
];

const allLocations = [
  { region: "Mumbai", locations: mumbaiLocations },
  { region: "Thane", locations: thaneLocations },
  { region: "Navi Mumbai", locations: naviMumbaiLocations }
];

const AddProperty = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;
  const [formError, setFormError] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  const [availableLocations, setAvailableLocations] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [uploadError, setUploadError] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [status, setStatus] = useState("for-sale");
  const [bedrooms, setBedrooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [area, setArea] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [featured, setFeatured] = useState(false);
  const [coordinates, setCoordinates] = useState({ lat: 19.0760, lng: 72.8777 });

  useEffect(() => {
    if (selectedRegion) {
      const region = allLocations.find(r => r.region === selectedRegion);
      if (region) {
        setAvailableLocations(region.locations);
        setCity("");
      }
    } else {
      setAvailableLocations([]);
    }
  }, [selectedRegion]);

  useEffect(() => {
    if (!user) {
      return;
    }
    
    if (user.role !== 'agent' && user.role !== 'owner') {
      toast({
        title: "Access Denied",
        description: "Only agents and property owners can add properties.",
        variant: "destructive"
      });
      navigate('/dashboard');
    }
  }, [user, navigate, toast]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files);
      
      const oversizedFiles = fileArray.filter(file => file.size > 5 * 1024 * 1024);
      if (oversizedFiles.length > 0) {
        setUploadError(`${oversizedFiles.length} file(s) exceed the 5MB limit and won't be uploaded.`);
        const validFiles = fileArray.filter(file => file.size <= 5 * 1024 * 1024);
        setUploadedFiles(prev => [...prev, ...validFiles]);
        
        const newImageUrls = validFiles.map(file => URL.createObjectURL(file));
        setImages(prev => [...prev, ...newImageUrls]);
        return;
      }
      
      setUploadedFiles(prev => [...prev, ...fileArray]);
      
      const newImageUrls = fileArray.map(file => URL.createObjectURL(file));
      setImages(prev => [...prev, ...newImageUrls]);
      setUploadError("");
    }
  };

  const removeImage = (indexToRemove: number) => {
    setImages(images.filter((_, index) => index !== indexToRemove));
    setUploadedFiles(uploadedFiles.filter((_, index) => index !== indexToRemove));
  };

  const nextStep = () => {
    if (!validateCurrentStep()) {
      return;
    }
    
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
      setFormError("");
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
      setFormError("");
    }
  };

  const validateCurrentStep = (): boolean => {
    setFormError("");
    
    switch (currentStep) {
      case 1:
        if (!title || !description || !price) {
          setFormError("Please fill in all the required fields");
          return false;
        }
        if (isNaN(Number(price)) || Number(price) <= 0) {
          setFormError("Please enter a valid price");
          return false;
        }
        break;
      case 2:
        if (!propertyType || !bedrooms || !bathrooms || !area) {
          setFormError("Please fill in all the required fields");
          return false;
        }
        if (isNaN(Number(bedrooms)) || Number(bedrooms) <= 0) {
          setFormError("Please enter a valid number of bedrooms");
          return false;
        }
        if (isNaN(Number(bathrooms)) || Number(bathrooms) <= 0) {
          setFormError("Please enter a valid number of bathrooms");
          return false;
        }
        if (isNaN(Number(area)) || Number(area) <= 0) {
          setFormError("Please enter a valid area");
          return false;
        }
        break;
      case 3:
        if (!street || !selectedRegion || !city || !state || !zipCode) {
          setFormError("Please fill in all the required fields");
          return false;
        }
        break;
      case 4:
        if (images.length === 0) {
          setFormError("Please upload at least one image");
          return false;
        }
        break;
    }
    
    return true;
  };

  const uploadImagesToCloudinary = async () => {
    if (uploadedFiles.length === 0) {
      return [];
    }
    
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      const formData = new FormData();
      uploadedFiles.forEach(file => {
        formData.append('images', file);
      });
      
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("Authentication required");
      }
      
      const response = await fetch("http://localhost:5000/properties/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      setIsUploading(false);
      setUploadProgress(100);
      return data.urls;
    } catch (error) {
      console.error("Error uploading images:", error);
      setUploadError("Failed to upload images. Please try again.");
      setIsUploading(false);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateCurrentStep()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      if (!user) {
        throw new Error("You must be logged in to add a property");
      }
      
      const imageUrls = await uploadImagesToCloudinary();
      
      const formData = new FormData();
      
      const propertyData = {
        title,
        description,
        price: parseFloat(price),
        location: {
          address: street,
          city,
          state,
          zip: zipCode,
          country: "India",
          lat: coordinates.lat,
          lng: coordinates.lng
        },
        features: {
          bedrooms: parseInt(bedrooms),
          bathrooms: parseInt(bathrooms),
          area: parseInt(area),
          yearBuilt: new Date().getFullYear(),
          propertyType: propertyType as 'apartment' | 'house' | 'villa' | 'plot' | 'penthouse',
          status: status as 'for-sale' | 'for-rent' | 'sold' | 'pending',
        },
        amenities: [],
        images: imageUrls,
        agent: {
          id: user.id,
          name: user.name,
          phone: user.phone || "Not provided",
          email: user.email,
          image: user.avatar || "https://images.unsplash.com/photo-1566492031773-4f4e44671857?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
        },
        featured
      };
      
      formData.append('property', JSON.stringify(propertyData));
      
      await addProperty(formData);
      
      toast({
        title: "Property Added",
        description: "Your property has been successfully listed.",
      });
      
      navigate("/dashboard");
    } catch (error) {
      console.error("Error adding property:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "There was a problem adding your property.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepIndicator = () => {
    return (
      <div  style={{marginBottom:'90px'}} className="flex items-center justify-center mb-8">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <div 
            key={index} 
            className="flex items-center"
          >
            <div 
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                index + 1 === currentStep
                  ? 'bg-black text-white'
                  : index + 1 < currentStep
                  ? 'bg-black text-white'
                  : 'bg-gray-200 text-gray-500'
              }`}
            >
              {index + 1 < currentStep ? (
                <Check size={16} />
              ) : (
                <span>{index + 1}</span>
              )}
            </div>
            {index < totalSteps - 1 && (
              <div 
                className={`w-20 h-1 mt-5 mb-5 ${
                  index + 1 < currentStep ? 'bg-black' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderStepTitle = () => {
    switch (currentStep) {
      case 1:
        return "Basic Information";
      case 2:
        return "Property Details";
      case 3:
        return "Location";
      case 4:
        return "Property Images";
      case 5:
        return "Review and Submit";
      default:
        return "";
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Property Title</Label>
              <Input 
                id="title" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                placeholder="e.g. Modern Apartment in Downtown"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                placeholder="Describe your property in detail..."
                className="min-h-32"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <DollarSign className="h-5 w-5 text-gray-400" />
                </div>
                <Input 
                  id="price" 
                  type="number" 
                  value={price} 
                  onChange={(e) => setPrice(e.target.value)} 
                  placeholder="e.g. 250000"
                  className="pl-10"
                  required
                />
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="propertyType">Property Type</Label>
              <select
                id="propertyType"
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="w-full h-10 px-3 py-2 border border-input rounded-md bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                required
              >
                <option value="">Select Type</option>
                {propertyTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Listing Status</Label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full h-10 px-3 py-2 border border-input rounded-md bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                required
              >
                <option value="for-sale">For Sale</option>
                <option value="for-rent">For Rent</option>
                <option value="pending">Pending</option>
                <option value="sold">Sold</option>
              </select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="bedrooms">Bedrooms</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Bed className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input 
                    id="bedrooms" 
                    type="number" 
                    value={bedrooms} 
                    onChange={(e) => setBedrooms(e.target.value)} 
                    placeholder="e.g. 3"
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bathrooms">Bathrooms</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Bath className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input 
                    id="bathrooms" 
                    type="number" 
                    value={bathrooms} 
                    onChange={(e) => setBathrooms(e.target.value)} 
                    placeholder="e.g. 2"
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="area">Area (sq ft)</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Square className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input 
                    id="area" 
                    type="number" 
                    value={area} 
                    onChange={(e) => setArea(e.target.value)} 
                    placeholder="e.g. 1500"
                    className="pl-10"
                    required
                  />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="featured" 
                  checked={featured} 
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
                />
                <Label htmlFor="featured">Feature this property (shows in featured section)</Label>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="street">Street Address</Label>
              <Input 
                id="street" 
                value={street} 
                onChange={(e) => setStreet(e.target.value)} 
                placeholder="e.g. 123 Main St"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="region">Region</Label>
              <select
                id="region"
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="w-full h-10 px-3 py-2 border border-input rounded-md bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                required
              >
                <option value="">Select Region</option>
                {allLocations.map((region) => (
                  <option key={region.region} value={region.region}>
                    {region.region}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="city">Location</Label>
              <select
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full h-10 px-3 py-2 border border-input rounded-md bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                required
                disabled={!selectedRegion}
              >
                <option value="">Select Location</option>
                {availableLocations.map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input 
                  id="state" 
                  value={state || "Maharashtra"} 
                  onChange={(e) => setState(e.target.value)} 
                  placeholder="Maharashtra"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="zipCode">Zip Code</Label>
                <Input 
                  id="zipCode" 
                  value={zipCode} 
                  onChange={(e) => setZipCode(e.target.value)} 
                  placeholder="e.g. 400001"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Map Location (For Demonstration Only)</Label>
              <div className="relative bg-gray-200 h-40 rounded-lg flex items-center justify-center">
                <MapPin size={32} className="text-red-500" />
                <p className="absolute bg-white px-2 py-1 rounded text-sm">
                  Map View (Mock)
                </p>
              </div>
              <p className="text-sm text-gray-500">
                For this demo, we're using preset coordinates for Indian cities. In a real application, 
                you would integrate with a mapping API to allow precise location selection.
              </p>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                id="images"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <label
                htmlFor="images"
                className="cursor-pointer flex flex-col items-center justify-center"
              >
                <Upload className="w-12 h-12 text-gray-400 mb-2" />
                <p className="mb-1 font-medium">Click to upload images</p>
                <p className="text-xs text-gray-500">JPG, PNG, or GIF (max. 5MB each)</p>
              </label>
            </div>
            
            {uploadError && (
              <div className="bg-red-50 text-red-700 p-3 rounded-md">
                {uploadError}
              </div>
            )}
            
            {isUploading && (
              <div className="space-y-2">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-black h-2.5 rounded-full" 
                    style={{width: `${uploadProgress}%`}}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 text-center">{uploadProgress}% Uploaded</p>
              </div>
            )}
            
            {images.length > 0 && (
              <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image}
                      alt={`Property image ${index + 1}`}
                      className="h-32 w-full object-cover rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-black bg-opacity-50 rounded-full p-1 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      case 5:
        return (
          <div className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Property Summary</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Basic Information</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Title:</span>
                      <span className="font-medium">{title || "Not specified"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Price:</span>
                      <span className="font-medium">${price || "0"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className="font-medium capitalize">{status.replace('-', ' ') || "Not specified"}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-3">Property Details</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Type:</span>
                      <span className="font-medium capitalize">{propertyType || "Not specified"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Bedrooms:</span>
                      <span className="font-medium">{bedrooms || "0"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Bathrooms:</span>
                      <span className="font-medium">{bathrooms || "0"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Area:</span>
                      <span className="font-medium">{area || "0"} sq ft</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <h4 className="font-medium mb-3">Location</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Address:</span>
                    <span className="font-medium">{street || "Not specified"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Region:</span>
                    <span className="font-medium">{selectedRegion || "Not specified"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Location:</span>
                    <span className="font-medium">{city || "Not specified"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">State:</span>
                    <span className="font-medium">{state || "Not specified"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Zip Code:</span>
                    <span className="font-medium">{zipCode || "Not specified"}</span>
                  </div>
                </div>
              </div>
              
              <div><input
        type="file"
        accept="image/*"
        multiple
        onChange={handleImageUpload}
        className="mb-4"
      />
              {images.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-medium mb-3">Images</h4>
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                    {images.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`Property preview ${index + 1}`}
                        className="h-16 w-full object-cover rounded-md"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div></div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm py-4 px-6">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link to="/dashboard" className="flex items-center text-gray-500 hover:text-gray-900">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Dashboard
            </Link>
            <h1 className="text-xl font-semibold">Add New Property</h1>
          </div>
          <Link to="/" className="flex items-center space-x-2">
            <Building2 className="h-6 w-6 text-black" strokeWidth={2.5} />
            <span className="font-bold text-xl">FindHome</span>
          </Link>
        </div>
      </header>

      <div className="container mx-auto py-8 px-4">
        <div className="max-w-3xl mx-auto bg-white shadow-sm rounded-lg p-6">
          <h2 className="text-xl font-bold mb-6">{renderStepTitle()}</h2>
          
          {formError && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
              {formError}
            </div>
          )}
          
          {renderStepIndicator()}
          
          <form onSubmit={(e) => e.preventDefault()}>
            {renderStepContent()}
            
            <div className="mt-8 flex justify-between">
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
                  className="bg-black hover:bg-black/90 text-white"
                  onClick={nextStep}
                >
                  Next
                </Button>
              ) : (
                <Button 
                  type="button" 
                  className="bg-black hover:bg-black/90 text-white"
                  disabled={isLoading}
                  onClick={handleSubmit}
                >
                  {isLoading ? "Creating..." : "Create Property"}
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProperty;
