
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Mail, Phone, MapPin, FileText, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PropertyCard from "@/components/PropertyCard";
import ContactForm from "@/components/ContactForm";
import { agents, properties, Property } from '@/lib/data';

const AgentDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [agent, setAgent] = useState<any>(null);
  const [agentProperties, setAgentProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Find agent with matching id
    const foundAgent = agents.find(a => a.id === id);
    
    if (foundAgent) {
      setAgent(foundAgent);
      
      // Find properties listed by this agent
      const agentProps = properties.filter(property => property.agent.id === id);
      setAgentProperties(agentProps);
    }
    
    setLoading(false);
  }, [id]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="animate-pulse">Loading agent details...</div>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (!agent) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Agent Not Found</h2>
            <p className="mb-6">The agent you're looking for doesn't exist or has been removed.</p>
            <Link to="/agents">
              <Button>Browse Agents</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-20">
        {/* Breadcrumb */}
        <div className="bg-estate-light py-4">
          <div className="container">
            <div className="flex items-center text-sm">
              <Link to="/" className="text-estate-gray hover:text-estate-primary">Home</Link>
              <span className="mx-2 text-estate-gray">/</span>
              <Link to="/agents" className="text-estate-gray hover:text-estate-primary">Agents</Link>
              <span className="mx-2 text-estate-gray">/</span>
              <span className="text-estate-primary font-medium">{agent.name}</span>
            </div>
          </div>
        </div>
        
        {/* Agent Profile */}
        <section className="py-12 bg-white">
          <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Agent Information */}
              <div className="lg:col-span-2">
                <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
                  <div className="flex flex-col md:flex-row gap-6 md:items-start">
                    <div className="w-40 h-40 rounded-full overflow-hidden flex-shrink-0 mx-auto md:mx-0">
                      <img 
                        src={agent.image} 
                        alt={agent.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="flex-grow">
                      <h1 className="text-2xl md:text-3xl font-bold mb-2">{agent.name}</h1>
                      <p className="text-estate-gray mb-4">Senior Real Estate Consultant</p>
                      
                      <div className="flex flex-col gap-3 mb-5">
                        <a 
                          href={`tel:${agent.phone}`} 
                          className="flex items-center gap-3 text-estate-gray hover:text-estate-primary transition-colors"
                        >
                          <Phone size={18} />
                          <span>{agent.phone}</span>
                        </a>
                        <a 
                          href={`mailto:${agent.email}`} 
                          className="flex items-center gap-3 text-estate-gray hover:text-estate-primary transition-colors"
                        >
                          <Mail size={18} />
                          <span>{agent.email}</span>
                        </a>
                        <div className="flex items-center gap-3 text-estate-gray">
                          <MapPin size={18} />
                          <span>Miami, Florida</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-3">
                        <a href="#" className="p-2 rounded-full bg-estate-light text-estate-gray hover:text-estate-primary transition-colors">
                          <Facebook size={18} />
                        </a>
                        <a href="#" className="p-2 rounded-full bg-estate-light text-estate-gray hover:text-estate-primary transition-colors">
                          <Twitter size={18} />
                        </a>
                        <a href="#" className="p-2 rounded-full bg-estate-light text-estate-gray hover:text-estate-primary transition-colors">
                          <Instagram size={18} />
                        </a>
                        <a href="#" className="p-2 rounded-full bg-estate-light text-estate-gray hover:text-estate-primary transition-colors">
                          <Linkedin size={18} />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
                  <h2 className="text-2xl font-bold mb-4">About Me</h2>
                  <p className="text-estate-gray mb-6">
                    With over 10 years of experience in the real estate industry, I specialize in helping clients find their dream homes and secure profitable investment properties. My deep knowledge of the local market and commitment to client satisfaction has earned me a reputation as one of the top agents in the area.
                  </p>
                  <p className="text-estate-gray mb-6">
                    I believe that buying or selling a property should be a smooth and rewarding experience. My approach is to listen carefully to my clients' needs, provide expert guidance throughout the process, and negotiate the best possible terms for every transaction.
                  </p>
                  <p className="text-estate-gray">
                    Whether you're a first-time homebuyer, looking to upgrade to a larger property, or interested in real estate investment, I have the expertise and resources to help you achieve your goals.
                  </p>
                </div>
                
                {/* Agent Listings */}
                <div>
                  <h2 className="text-2xl font-bold mb-6">My Listings</h2>
                  
                  {agentProperties.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {agentProperties.map((property, index) => (
                        <PropertyCard 
                          key={property.id} 
                          property={property} 
                          index={index}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-estate-light rounded-xl">
                      <h3 className="text-xl font-semibold mb-2">No listings yet</h3>
                      <p className="text-estate-gray">
                        This agent doesn't have any active listings at the moment.
                      </p>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Right Column - Contact Form */}
              <div className="lg:col-span-1">
                <div className="bg-white p-6 rounded-xl shadow-sm mb-8 sticky top-24">
                  <h3 className="text-xl font-bold mb-4">Contact {agent.name}</h3>
                  
                  <ContactForm agentName={agent.name} propertyTitle="" />
                  
                  <div className="mt-6">
                    <Button variant="outline" className="w-full gap-2">
                      <FileText size={18} />
                      <span>Download Resume</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default AgentDetails;
