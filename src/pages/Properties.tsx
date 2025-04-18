
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import PropertyCard from "@/components/PropertyCard";
import Pagination from "@/components/Pagination";
import PropertyMap from "@/components/PropertyMap";
import { Button } from "@/components/ui/button";
import { FilterX, SlidersHorizontal, Search as SearchIcon } from "lucide-react";
import { Property } from "@/lib/data";
import { getPropertiesByStatus, getAllProperties } from "@/services/propertyService";

const PropertiesForRent = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | undefined>(undefined);
  
  // Filter states
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [sortOption, setSortOption] = useState("newest");
  
  const itemsPerPage = 6; // Reduced number of items per page to fit with map
  
  // Calculate pagination
  const indexOfLastProperty = currentPage * itemsPerPage;
  const indexOfFirstProperty = indexOfLastProperty - itemsPerPage;
  const currentProperties = filteredProperties.slice(indexOfFirstProperty, indexOfLastProperty);
  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);
  
  // Fetch properties
  useEffect(() => {
    const fetchProperties = async () => {
      setIsLoading(true);
      try {
        const data = await getAllProperties(); // <-- invoke the function
        setProperties(data);
        setFilteredProperties(data);
      } catch (error) {
        console.error("Error fetching properties:", error);
        setError("Failed to load properties. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchProperties();
  }, []);
  
  // Apply filters and search
  useEffect(() => {
    let result = [...properties];
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (property) =>
          property.title.toLowerCase().includes(query) ||
          property.description.toLowerCase().includes(query) ||
          property.location.city.toLowerCase().includes(query)
      );
    }
    
    // Apply filters
    if (minPrice) {
      result = result.filter((property) => property.price >= parseInt(minPrice));
    }
    
    if (maxPrice) {
      result = result.filter((property) => property.price <= parseInt(maxPrice));
    }
    
    if (bedrooms) {
      result = result.filter((property) => property.features.bedrooms >= parseInt(bedrooms));
    }
    
    if (propertyType) {
      result = result.filter((property) => property.features.propertyType === propertyType);
    }
    
    // Apply sorting
    switch (sortOption) {
      case "newest":
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case "oldest":
        result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;
    }
    
    setFilteredProperties(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [properties, searchQuery, minPrice, maxPrice, bedrooms, propertyType, sortOption]);
  
  const resetFilters = () => {
    setSearchQuery("");
    setMinPrice("");
    setMaxPrice("");
    setBedrooms("");
    setPropertyType("");
    setSortOption("newest");
  };
  
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handlePropertySelect = (propertyId: string) => {
    setSelectedPropertyId(propertyId);
    
    // Find the property in the list
    const property = properties.find(p => p.id === propertyId);
    if (property) {
      // Find the page that contains this property
      const propertyIndex = properties.indexOf(property);
      const page = Math.floor(propertyIndex / itemsPerPage) + 1;
      if (page !== currentPage) {
        setCurrentPage(page);
      }
    }
  };

  return (
    <Layout>
      <div className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">Properties For Rent</h1>
          
          {/* Search and Filters */}
          <div className="bg-white p-4 rounded-lg shadow-sm mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search properties..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-black/5 focus:border-black"
                />
                <SearchIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
              
              <Button 
                variant="outline" 
                className="md:w-auto"
                onClick={() => setShowFilters(!showFilters)}
              >
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filters
              </Button>
              
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="border rounded-md px-4 py-2 focus:ring-2 focus:ring-black/5 focus:border-black"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="price-high">Price: High to Low</option>
                <option value="price-low">Price: Low to High</option>
              </select>
            </div>
            
            {showFilters && (
              <div className="mt-4 border-t pt-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Min Price</label>
                    <input
                      type="number"
                      placeholder="Min Price"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-black/5 focus:border-black"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Max Price</label>
                    <input
                      type="number"
                      placeholder="Max Price"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-black/5 focus:border-black"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Bedrooms</label>
                    <select
                      value={bedrooms}
                      onChange={(e) => setBedrooms(e.target.value)}
                      className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-black/5 focus:border-black"
                    >
                      <option value="">Any</option>
                      <option value="1">1+</option>
                      <option value="2">2+</option>
                      <option value="3">3+</option>
                      <option value="4">4+</option>
                      <option value="5">5+</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Property Type</label>
                    <select
                      value={propertyType}
                      onChange={(e) => setPropertyType(e.target.value)}
                      className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-black/5 focus:border-black"
                    >
                      <option value="">Any</option>
                      <option value="apartment">Apartment</option>
                      <option value="house">House</option>
                      <option value="villa">Villa</option>
                      <option value="penthouse">Penthouse</option>
                      <option value="plot">Plot</option>
                    </select>
                  </div>
                </div>
                
                <div className="mt-4 flex justify-end">
                  <Button 
                    variant="outline" 
                    onClick={resetFilters}
                    className="flex items-center"
                  >
                    <FilterX className="h-4 w-4 mr-2" />
                    Reset Filters
                  </Button>
                </div>
              </div>
            )}
          </div>
          
          {/* Results with Map */}
          <div>
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : error ? (
              <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center">
                {error}
              </div>
            ) : filteredProperties.length === 0 ? (
              <div className="bg-white p-8 rounded-lg text-center">
                <h3 className="text-xl font-medium mb-2">No properties found</h3>
                <p className="text-gray-500 mb-4">Try adjusting your search or filter criteria</p>
                <Button variant="outline" onClick={resetFilters}>
                  Clear all filters
                </Button>
              </div>
            ) : (
              <>
                <p className="mb-4 text-gray-500">
                  Showing {currentProperties.length} of {filteredProperties.length} properties
                </p>
                
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Property Cards - Left side */}
                  <div className="md:w-1/2 lg:w-3/5">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {currentProperties.map((property) => (
                        <PropertyCard
                          key={property.id}
                          property={property}
                        />
                      ))}
                    </div>
                    
                    {totalPages > 1 && (
                      <div className="mt-8 flex justify-center">
                        <Pagination
                          totalPages={totalPages}
                          currentPage={currentPage}
                          onPageChange={handlePageChange}
                        />
                      </div>
                    )}
                  </div>
                  
                  {/* Map - Right side */}
                  <div className="md:w-1/2 lg:w-2/5 mt-6 md:mt-0">
                    <div className="sticky top-24 h-[calc(100vh-200px)] rounded-lg overflow-hidden border border-gray-200">
                      <PropertyMap 
                        properties={filteredProperties} 
                        selectedPropertyId={selectedPropertyId}
                        onPropertySelect={handlePropertySelect}
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PropertiesForRent;
