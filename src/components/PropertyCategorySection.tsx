
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Home, Building, MapPin, Plus, ArrowRight } from 'lucide-react';

const PropertyCategorySection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Find Your Perfect Property in Mumbai</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Whether you're looking to buy, rent, or list a property in Mumbai and surrounding areas, we have the tools and expertise to help you succeed.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Buy */}
          <div className="group">
            <div className="bg-white rounded-xl p-8 text-center transition-all hover:shadow-xl border border-gray-100 h-full flex flex-col relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-jugyah-blue/5 rounded-bl-[100px] -z-0"></div>
              
              <div className="w-20 h-20 bg-jugyah-blue/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-jugyah-blue/20 transition-all z-10">
                <Home className="h-10 w-10 text-jugyah-blue" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Buy</h3>
              <p className="text-gray-600 mb-6 flex-grow">
                Find your dream home from our exclusive listings of properties for sale across Mumbai.
              </p>
              <Link to="/properties?type=for-sale" className="block mt-auto">
                <Button variant="default" className="w-full gap-2 bg-jugyah-blue hover:bg-jugyah-blue/90 rounded-full">
                  Browse Properties
                  <ArrowRight size={16} />
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Rent */}
          <div className="group">
            <div className="bg-white rounded-xl p-8 text-center transition-all hover:shadow-xl border border-gray-100 h-full flex flex-col relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-jugyah-green/5 rounded-bl-[100px] -z-0"></div>
              
              <div className="w-20 h-20 bg-jugyah-green/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-jugyah-green/20 transition-all z-10">
                <Building className="h-10 w-10 text-jugyah-green" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Rent</h3>
              <p className="text-gray-600 mb-6 flex-grow">
                Discover a wide range of rental properties in Mumbai's most desirable neighborhoods.
              </p>
              <Link to="/properties?type=for-rent" className="block mt-auto">
                <Button variant="default" className="w-full gap-2 bg-jugyah-green hover:bg-jugyah-green/90 rounded-full">
                  Explore Rentals
                  <ArrowRight size={16} />
                </Button>
              </Link>
            </div>
          </div>
          
          {/* List */}
          <div className="group">
            <div className="bg-white rounded-xl p-8 text-center transition-all hover:shadow-xl border border-gray-100 h-full flex flex-col relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-jugyah-orange/5 rounded-bl-[100px] -z-0"></div>
              
              <div className="w-20 h-20 bg-jugyah-orange/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-jugyah-orange/20 transition-all z-10">
                <Plus className="h-10 w-10 text-jugyah-orange" />
              </div>
              <h3 className="text-2xl font-bold mb-4">List</h3>
              <p className="text-gray-600 mb-6 flex-grow">
                List your Mumbai property with us and reach thousands of potential buyers or renters.
              </p>
              <Link to="/add-property" className="block mt-auto">
                <Button variant="default" className="w-full gap-2 bg-jugyah-orange hover:bg-jugyah-orange/90 rounded-full">
                  List Your Property
                  <ArrowRight size={16} />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PropertyCategorySection;
