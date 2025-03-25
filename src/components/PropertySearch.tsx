
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Search, Home, MapPin, DollarSign, Bed, Bath, Filter, ArrowRight } from 'lucide-react';
import { cities, propertyTypes, formatPrice } from '@/lib/data';
import { useNavigate, useSearchParams } from 'react-router-dom';

const PropertySearch = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedCity, setSelectedCity] = useState(searchParams.get('city') || '');
  const [selectedType, setSelectedType] = useState(searchParams.get('type') || '');
  const [minPrice, setMinPrice] = useState(parseInt(searchParams.get('minPrice') || '0'));
  const [maxPrice, setMaxPrice] = useState(parseInt(searchParams.get('maxPrice') || '2000000'));
  const [bedrooms, setBedrooms] = useState(parseInt(searchParams.get('beds') || '0'));
  const [bathrooms, setBathrooms] = useState(parseInt(searchParams.get('baths') || '0'));
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  const handlePriceChange = (values: number[]) => {
    setMinPrice(values[0]);
    setMaxPrice(values[1]);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    const params = new URLSearchParams();
    if (searchQuery) params.append('q', searchQuery);
    if (selectedCity) params.append('city', selectedCity);
    if (selectedType) params.append('type', selectedType);
    if (minPrice > 0) params.append('minPrice', minPrice.toString());
    if (maxPrice < 2000000) params.append('maxPrice', maxPrice.toString());
    if (bedrooms > 0) params.append('beds', bedrooms.toString());
    if (bathrooms > 0) params.append('baths', bathrooms.toString());
    
    navigate(`/properties?${params.toString()}`);
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <form onSubmit={handleSearch}>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="relative lg:col-span-2">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <Search size={18} />
              </div>
              <Input
                placeholder="Enter keywords, address..."
                className="pl-10 h-12 border-gray-200"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <MapPin size={18} />
              </div>
              <select
                className="w-full h-12 pl-10 pr-4 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-estate-primary/50"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
              >
                <option value="">Any Location</option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <Home size={18} />
              </div>
              <select
                className="w-full h-12 pl-10 pr-4 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-estate-primary/50"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                <option value="">Property Type</option>
                {propertyTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <Button
                type="button"
                variant="outline"
                className="h-12 w-full border-estate-primary text-estate-primary hover:bg-estate-primary hover:text-white gap-2"
                onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
              >
                <Filter size={18} />
                <span>Advanced</span>
              </Button>
            </div>
          </div>
          
          {isAdvancedOpen && (
            <div className="mt-6 pt-6 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
              <div>
                <Label className="mb-2 block">Price Range</Label>
                <div className="px-3">
                  <Slider
                    defaultValue={[minPrice, maxPrice]}
                    max={2000000}
                    step={10000}
                    onValueChange={handlePriceChange}
                    className="my-5"
                  />
                </div>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center">
                    <DollarSign size={16} className="text-gray-400 mr-1" />
                    <span>{formatPrice(minPrice)}</span>
                  </div>
                  <div className="flex items-center">
                    <DollarSign size={16} className="text-gray-400 mr-1" />
                    <span>{formatPrice(maxPrice)}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <Label htmlFor="bedrooms" className="mb-2 block">Bedrooms</Label>
                <div className="flex flex-wrap gap-2">
                  {[0, 1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      type="button"
                      className={`flex items-center justify-center w-12 h-12 rounded-md border transition-all ${
                        bedrooms === value 
                          ? 'bg-estate-primary text-white border-estate-primary' 
                          : 'border-gray-200 hover:border-estate-primary hover:text-estate-primary'
                      }`}
                      onClick={() => setBedrooms(value)}
                    >
                      {value === 0 ? 'Any' : value === 5 ? '5+' : value}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <Label htmlFor="bathrooms" className="mb-2 block">Bathrooms</Label>
                <div className="flex flex-wrap gap-2">
                  {[0, 1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      type="button"
                      className={`flex items-center justify-center w-12 h-12 rounded-md border transition-all ${
                        bathrooms === value 
                          ? 'bg-estate-primary text-white border-estate-primary' 
                          : 'border-gray-200 hover:border-estate-primary hover:text-estate-primary'
                      }`}
                      onClick={() => setBathrooms(value)}
                    >
                      {value === 0 ? 'Any' : value === 5 ? '5+' : value}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="px-6 py-4 bg-gray-50 flex justify-end">
          <Button
            type="submit"
            className="bg-estate-primary hover:bg-estate-primary/90 text-white gap-2"
          >
            <Search size={18} />
            <span>Search Properties</span>
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PropertySearch;
