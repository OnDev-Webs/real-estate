
import { useEffect } from 'react';
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import FeaturedProperties from "@/components/FeaturedProperties";
import RecentProperties from "@/components/RecentProperties";
import Footer from "@/components/Footer";
import { ArrowRight, Search, Home, Building2, Handshake, Users, Award, CheckCircle2, MapPin } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import FlatsGrid from '@/components/Flatgrid';
import Sellrent from "@/components/Sellrent";
import TestimonialSection from '@/components/TestimonialSection';
import PropertyCategorySection from '@/components/PropertyCategorySection';

const Index = () => {
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
        <RecentProperties />

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
