import { useEffect } from 'react';
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import FeaturedProperties from "@/components/FeaturedProperties";
import Footer from "@/components/Footer";
import { ArrowRight, Search, Home, Building2, Handshake, Users, Award, CheckCircle2, MapPin } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { getRecentProperties, formatPrice } from '@/lib/data';
import PropertyCategorySection from '@/components/PropertyCategorySection';
import FlatsGrid from '@/components/Flatgrid';
import Sellrent from "@/components/Sellrent"
import Togglebuyrent from "@/components/Togglebuyrent"
import { Toggle } from '@/components/ui/toggle';
import TestimonialSection from '@/components/TestimonialSection';

const Index = () => {
  const recentProperties = getRecentProperties(3);

  useEffect(() => {
    // Initialize animation observer
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observe all elements with the animate-on-scroll class
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
      observer.observe(el);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <Hero />
      
        <PropertyCategorySection />
        
        <FeaturedProperties />
        
        {/* About Section */}
        <section className="section bg-white">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-on-scroll">
              <img 
                src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="About FindHome" 
                className="rounded-lg shadow-lg"
              />
            </div>
            
            <div className="animate-on-scroll">
              <span className="inline-block px-3 py-1 bg-estate-primary/10 text-estate-primary rounded-full mb-2 text-sm font-medium">
                About Us
              </span>
              <h2 className="section-title mb-4">We're on a Mission to Change How You Find Home</h2>
              <p className="text-estate-gray mb-6">
                At FindHome, we believe everyone deserves to find their perfect place. Our platform connects buyers, sellers, and real estate professionals in a seamless experience designed to make property transactions simple and stress-free.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                <div className="flex items-start gap-3">
                  <div className="bg-estate-primary/10 p-2 rounded text-estate-primary">
                    <Search size={24} />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold mb-1">Easy Search</h4>
                    <p className="text-estate-gray text-sm">Find exactly what you're looking for with our powerful search tools.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="bg-estate-primary/10 p-2 rounded text-estate-primary">
                    <Building2 size={24} />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold mb-1">Quality Listings</h4>
                    <p className="text-estate-gray text-sm">Thousands of verified properties with detailed information and imagery.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="bg-estate-primary/10 p-2 rounded text-estate-primary">
                    <Users size={24} />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold mb-1">Expert Agents</h4>
                    <p className="text-estate-gray text-sm">Connect with experienced agents who can guide your journey.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="bg-estate-primary/10 p-2 rounded text-estate-primary">
                    <Handshake size={24} />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold mb-1">Smooth Transactions</h4>
                    <p className="text-estate-gray text-sm">We simplify the process from first contact to final closing.</p>
                  </div>
                </div>
              </div>
              
              <Link to="/properties">
                <Button className="bg-estate-primary hover:bg-estate-primary/90 gap-2">
                  <span>Browse Properties</span>
                  <ArrowRight size={16} />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
        {/* Why Choose Us */}
        <section className="section bg-estate-primary/5">
        <div className="container text-center">
          <div className="max-w-2xl mx-auto mb-12 animate-on-scroll">
            <span className="inline-block px-3 py-1 bg-estate-primary/10 text-estate-primary rounded-full mb-2 text-sm font-medium">
              Why Choose Us
            </span>
            <h2 className="section-title mb-4">The Superior Choice for Your Real Estate Journey</h2>
            <p className="text-estate-gray">
              We stand out from the competition with our commitment to excellence, innovative approach, and dedication to client satisfaction.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-sm transition-transform duration-300 hover:shadow-md hover:-translate-y-1 animate-on-scroll">
              <div className="w-16 h-16 bg-estate-primary/10 text-estate-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <Home size={28} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Extensive Property Selection</h3>
              <p className="text-estate-gray">
                Access thousands of listings across all property types, from cozy apartments to luxury estates, ensuring you find exactly what you're looking for.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-sm transition-transform duration-300 hover:shadow-md hover:-translate-y-1 animate-on-scroll">
              <div className="w-16 h-16 bg-estate-primary/10 text-estate-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <Award size={28} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Award-Winning Service</h3>
              <p className="text-estate-gray">
                Our team of real estate professionals has been recognized for outstanding customer service and industry expertise year after year.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-sm transition-transform duration-300 hover:shadow-md hover:-translate-y-1 animate-on-scroll">
              <div className="w-16 h-16 bg-estate-primary/10 text-estate-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={28} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Verified Listings Only</h3>
              <p className="text-estate-gray">
                Every property on our platform undergoes a thorough verification process to ensure accuracy and legitimacy, giving you peace of mind.
              </p>
            </div>
          </div>
        </div>
      </section>
      
        {/* Recent Properties */}
        <section className="section bg-white">
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-12 animate-on-scroll">
            <div>
              <span className="inline-block px-3 py-1 bg-estate-primary/10 text-estate-primary rounded-full mb-2 text-sm font-medium">
                New Arrivals
              </span>
              <h2 className="section-title">Recently Added Properties</h2>
              <p className="section-subtitle">
                Be the first to discover our newest listings and find your dream home before anyone else.
              </p>
            </div>
            <Link to="/properties">
              <Button variant="outline" className="border-estate-primary text-estate-primary hover:bg-estate-primary hover:text-white gap-2">
                View All Properties
                <ArrowRight size={16} />
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {recentProperties.map((property, index) => (
              <div 
                key={property.id}
                className="property-card overflow-hidden rounded-xl transition-all duration-500 transform animate-on-scroll hover:shadow-md"
              >
                <Link to={`/property/${property.id}`} className="group">
                  <div className="relative overflow-hidden aspect-[4/3]">
                    <img 
                      src={property.images[0]} 
                      alt={property.title}
                      className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
                    />
                    
                    <div className="absolute top-3 left-3">
                      <span className={`tag ${property.features.status === 'for-sale' ? 'bg-estate-primary text-white' : 'bg-estate-secondary text-estate-dark'}`}>
                        {property.features.status === 'for-sale' ? 'For Sale' : 'For Rent'}
                      </span>
                    </div>
                    
                    <div className="absolute bottom-3 left-3">
                      <span className="tag bg-black/70 text-white">
                        {property.features.propertyType.charAt(0).toUpperCase() + property.features.propertyType.slice(1)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <div className="flex items-center gap-1 text-estate-gray mb-2">
                      <MapPin size={16} />
                      <span className="text-sm truncate">
                        {property.location.city}, {property.location.state}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-semibold mb-2 line-clamp-1 group-hover:text-estate-primary transition-colors">
                      {property.title}
                    </h3>
                    
                    <p className="text-estate-gray text-sm mb-4 line-clamp-2">
                      {property.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="font-semibold text-lg text-estate-primary">
                        {formatPrice(property.price)}
                      </div>
                      <Button variant="outline" size="sm" className="text-xs border-estate-primary text-estate-primary hover:bg-estate-primary hover:text-white">
                        View Details
                      </Button>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

        <FlatsGrid/>

        <Sellrent/>

        <TestimonialSection />


        {/* CTA */}
        <section className="py-20 bg-estate-primary">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center text-white animate-on-scroll">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Find Your Dream Home?</h2>
            <p className="text-lg mb-8 text-white/80">
              Join thousands of satisfied customers who found their perfect property with FindHome. Start your search today!
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/properties">
                <Button className="bg-white text-estate-primary hover:bg-estate-secondary hover:text-estate-dark gap-2 min-w-[160px]">
                  <Search size={18} />
                  <span>Find Properties</span>
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-estate-primary gap-2 min-w-[160px]">
                  <span>Contact Us</span>
                  <ArrowRight size={18} />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
