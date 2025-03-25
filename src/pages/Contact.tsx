
import { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Message sent!",
        description: "We've received your message and will get back to you soon.",
      });
      
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      
      setIsSubmitting(false);
    }, 1500);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-20">
        {/* Hero Section */}
        <section className="bg-estate-light py-16">
          <div className="container text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Contact Us</h1>
            <p className="text-estate-gray max-w-2xl mx-auto">
              Have a question or need assistance? Our team is here to help you. Reach out to us through any of the channels below.
            </p>
          </div>
        </section>
        
        {/* Contact Info + Form */}
        <section className="py-16 bg-white">
          <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Contact Information */}
              <div className="lg:col-span-1">
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <h2 className="text-2xl font-bold mb-6">Get In Touch</h2>
                  
                  <div className="flex flex-col gap-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-estate-primary/10 text-estate-primary rounded-full">
                        <MapPin size={24} />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Our Location</h3>
                        <p className="text-estate-gray">
                          1234 Main Street, Miami,<br />
                          Florida 33101, USA
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-estate-primary/10 text-estate-primary rounded-full">
                        <Phone size={24} />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Phone Number</h3>
                        <p className="text-estate-gray">
                          <a href="tel:+1-555-123-4567" className="hover:text-estate-primary transition-colors">
                            +1 (555) 123-4567
                          </a>
                          <br />
                          <a href="tel:+1-555-987-6543" className="hover:text-estate-primary transition-colors">
                            +1 (555) 987-6543
                          </a>
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-estate-primary/10 text-estate-primary rounded-full">
                        <Mail size={24} />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Email Address</h3>
                        <p className="text-estate-gray">
                          <a href="mailto:info@findhome.com" className="hover:text-estate-primary transition-colors">
                            info@findhome.com
                          </a>
                          <br />
                          <a href="mailto:support@findhome.com" className="hover:text-estate-primary transition-colors">
                            support@findhome.com
                          </a>
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-estate-primary/10 text-estate-primary rounded-full">
                        <Clock size={24} />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Office Hours</h3>
                        <p className="text-estate-gray">
                          Monday - Friday: 9:00 AM - 6:00 PM<br />
                          Saturday: 10:00 AM - 4:00 PM<br />
                          Sunday: Closed
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Contact Form */}
              <div className="lg:col-span-2">
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
                  
                  <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium mb-1">Your Name</label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          placeholder="John Doe"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium mb-1">Email Address</label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          placeholder="john@example.com"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium mb-1">Phone Number</label>
                        <Input
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="(555) 123-4567"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="subject" className="block text-sm font-medium mb-1">Subject</label>
                        <Input
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          required
                          placeholder="Property Inquiry"
                        />
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <label htmlFor="message" className="block text-sm font-medium mb-1">Your Message</label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        placeholder="How can we help you?"
                        rows={6}
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full md:w-auto bg-estate-primary hover:bg-estate-primary/90 gap-2"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <span>Sending...</span>
                      ) : (
                        <>
                          <Send size={18} />
                          <span>Send Message</span>
                        </>
                      )}
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Map Section */}
        <section className="bg-estate-light py-16">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Our Location</h2>
              <p className="text-estate-gray max-w-2xl mx-auto">
                Visit our office to meet our team and discuss your real estate needs in person
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="aspect-video bg-estate-light rounded-lg flex items-center justify-center">
                <div className="text-center p-8">
                  <p className="mb-4">Map view will be available soon.</p>
                  <p className="text-sm text-estate-gray">Our office is located at 1234 Main Street, Miami, Florida 33101.</p>
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

export default Contact;
