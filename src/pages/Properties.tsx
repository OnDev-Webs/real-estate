
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from "@/components/Layout";
import PropertySearch from "@/components/PropertySearch";
import PropertyCard from "@/components/PropertyCard";
import PropertyMap from "@/components/PropertyMap";
import { Building2, GridIcon, LayoutList, ArrowUpDown, ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { searchProperties, Property } from '@/lib/data';

const Properties = () => {
  const [searchParams] = useSearchParams();
  const [properties, setProperties] = useState<Property[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortOption, setSortOption] = useState('latest');
  const [showMap, setShowMap] = useState(true);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | undefined>(undefined);
  const propertiesPerPage = 9;

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Get filter values from URL params
    const query = searchParams.get('q') || '';
    const city = searchParams.get('city') || '';
    const propertyType = searchParams.get('type') || '';
    const minPrice = searchParams.get('minPrice') ? parseInt(searchParams.get('minPrice')!) : undefined;
    const maxPrice = searchParams.get('maxPrice') ? parseInt(searchParams.get('maxPrice')!) : undefined;
    const beds = searchParams.get('beds') ? parseInt(searchParams.get('beds')!) : undefined;
    const baths = searchParams.get('baths') ? parseInt(searchParams.get('baths')!) : undefined;
    
    // Search properties based on filters
    const filteredProperties = searchProperties(query, {
      city,
      propertyType,
      minPrice,
      maxPrice,
      bedrooms: beds,
      bathrooms: baths
    });
    
    // Sort properties
    let sortedProperties = [...filteredProperties];
    switch (sortOption) {
      case 'latest':
        sortedProperties.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'price-low':
        sortedProperties.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        sortedProperties.sort((a, b) => b.price - a.price);
        break;
      default:
        break;
    }
    
    setProperties(sortedProperties);
    setTotalPages(Math.ceil(sortedProperties.length / propertiesPerPage));
    setCurrentPage(1); // Reset to first page on new search
  }, [searchParams, sortOption]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handlePropertySelect = (propertyId: string) => {
    setSelectedPropertyId(propertyId);
    
    // Find the property in the list
    const property = properties.find(p => p.id === propertyId);
    if (property) {
      // Find the page that contains this property
      const propertyIndex = properties.indexOf(property);
      const page = Math.floor(propertyIndex / propertiesPerPage) + 1;
      if (page !== currentPage) {
        setCurrentPage(page);
      }
    }
  };

  // Get current page's properties
  const currentProperties = properties.slice(
    (currentPage - 1) * propertiesPerPage,
    currentPage * propertiesPerPage
  );

  const renderPagination = () => {
    const pages = [];
    const maxPagesToShow = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
    
    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`w-10 h-10 flex items-center justify-center rounded-md transition-colors ${
            currentPage === i 
              ? 'bg-black text-white' 
              : 'bg-white border border-gray-200 hover:border-black hover:text-black'
          }`}
        >
          {i}
        </button>
      );
    }
    
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="w-10 h-10 flex items-center justify-center rounded-md bg-white border border-gray-200 hover:border-black hover:text-black disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={18} />
        </button>
        
        {pages}
        
        <button
          onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="w-10 h-10 flex items-center justify-center rounded-md bg-white border border-gray-200 hover:border-black hover:text-black disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    );
  };

  return (
    <Layout>
      <main className="flex-grow pt-20 pb-16">
        {/* Hero Section */}
        <section className="bg-black py-12 md:py-20">
          <div className="container text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Find Your Perfect Property
            </h1>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              Explore our extensive collection of properties for sale and rent. Use our advanced search to find exactly what you're looking for.
            </p>
          </div>
        </section>
        
        {/* Search Section */}
        <section className="container -mt-8 mb-12">
          <PropertySearch />
        </section>
        
        {/* Properties Section */}
        <section className="container">
          <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-gray-600">
              <p>Showing <span className="font-medium text-black">{properties.length}</span> properties</p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setViewMode('grid')}
                  className={viewMode === 'grid' ? 'text-black' : 'text-gray-500'}
                  aria-label="Grid view"
                >
                  <GridIcon size={20} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setViewMode('list')}
                  className={viewMode === 'list' ? 'text-black' : 'text-gray-500'}
                  aria-label="List view"
                >
                  <LayoutList size={20} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowMap(!showMap)}
                  className={showMap ? 'text-black' : 'text-gray-500'}
                  aria-label="Toggle map"
                >
                  <MapPin size={20} />
                </Button>
              </div>
              
              <div className="flex items-center relative">
                <ArrowUpDown size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <select
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-black/50"
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                >
                  <option value="latest">Latest</option>
                  <option value="price-low">Price (Low to High)</option>
                  <option value="price-high">Price (High to Low)</option>
                </select>
              </div>
            </div>
          </div>
          
          {currentProperties.length > 0 ? (
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Properties List */}
              <div className={`${showMap ? 'lg:w-1/2' : 'w-full'}`}>
                <div className={`grid ${
                  viewMode === 'grid' 
                    ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6' 
                    : 'grid-cols-1 gap-4'
                }`}>
                  {currentProperties.map((property, index) => (
                    <PropertyCard 
                      key={property.id} 
                      property={property} 
                      index={index}
                    />
                  ))}
                </div>
                
                {totalPages > 1 && (
                  <div className="mt-12 flex justify-center">
                    {renderPagination()}
                  </div>
                )}
              </div>
              
              {/* Map */}
              {showMap && (
                <div className="lg:w-1/2">
                  <div className="sticky top-24 h-[calc(100vh-200px)]">
                    <PropertyMap 
                      properties={properties} 
                      selectedPropertyId={selectedPropertyId}
                      onPropertySelect={handlePropertySelect}
                    />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white p-8 rounded-lg shadow-sm text-center">
              <div className="w-16 h-16 bg-black/10 text-black rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">No Properties Found</h3>
              <p className="text-gray-600 mb-6">
                We couldn't find any properties matching your search criteria. Try adjusting your filters or search terms.
              </p>
              <Button 
                onClick={() => window.location.href = '/properties'}
                className="bg-black hover:bg-black/90"
              >
                View All Properties
              </Button>
            </div>
          )}
        </section>
      </main>
    </Layout>
  );
};

export default Properties;
