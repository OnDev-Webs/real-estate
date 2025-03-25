
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, User } from 'lucide-react';
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { agents } from '@/lib/data';

const Agents = () => {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-20">
        {/* Hero Section */}
        <section className="bg-estate-light py-16">
          <div className="container text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Our Expert Agents</h1>
            <p className="text-estate-gray max-w-2xl mx-auto">
              Our team of experienced real estate professionals is dedicated to helping you find your perfect property
            </p>
          </div>
        </section>
        
        {/* Agents Grid */}
        <section className="py-16 bg-white">
          <div className="container">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, index) => (
                  <div key={index} className="bg-gray-100 rounded-xl h-[350px] animate-pulse"></div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {agents.map((agent) => (
                  <div key={agent.id} className="bg-white rounded-xl shadow-sm overflow-hidden transition-transform hover:-translate-y-1 hover:shadow-md">
                    <div className="aspect-[3/2] bg-estate-light">
                      <img 
                        src={agent.image} 
                        alt={agent.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-1">{agent.name}</h3>
                      <p className="text-estate-gray text-sm mb-4">Real Estate Agent</p>
                      
                      <div className="flex flex-col gap-3 mb-5">
                        <a 
                          href={`tel:${agent.phone}`} 
                          className="flex items-center gap-3 text-estate-gray hover:text-estate-primary transition-colors text-sm"
                        >
                          <Phone size={16} />
                          <span>{agent.phone}</span>
                        </a>
                        <a 
                          href={`mailto:${agent.email}`} 
                          className="flex items-center gap-3 text-estate-gray hover:text-estate-primary transition-colors text-sm"
                        >
                          <Mail size={16} />
                          <span>{agent.email}</span>
                        </a>
                      </div>
                      
                      <Link to={`/agent/${agent.id}`}>
                        <Button className="w-full bg-estate-primary hover:bg-estate-primary/90 gap-2">
                          <User size={16} />
                          <span>View Profile</span>
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
        
        {/* Join Our Team CTA */}
        <section className="py-20 bg-estate-primary">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center text-white">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Join Our Team</h2>
              <p className="text-lg mb-8 text-white/80">
                Are you a real estate professional looking to grow your career? We're always looking for talented agents to join our team.
              </p>
              <Link to="/careers">
                <Button className="bg-white text-estate-primary hover:bg-estate-secondary hover:text-estate-dark gap-2 min-w-[160px]">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Agents;
