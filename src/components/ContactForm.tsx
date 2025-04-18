import { useState } from 'react';
import { Mail, Send, User, Phone } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface ContactFormProps {
  agentName: string;
  agentEmail: string;
  propertyTitle: string;
}

const ContactForm = ({ agentName, agentEmail, propertyTitle }: ContactFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: `I'm interested in ${propertyTitle}. Please provide more information.`,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('http://localhost:5000/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, agentEmail, propertyTitle }),
      });

      const result = await response.json();
      if (result.success) {
        toast({
          title: "Message Sent",
          description: `Your message has been sent to ${agentName}.`,
        });
        setFormData({
          name: '',
          email: '',
          phone: '',
          message: `I'm interested in ${propertyTitle}. Please provide more information.`,
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to send message.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong.",
        variant: "destructive",
      });
    }

    setIsSubmitting(false);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Mail size={18} className="text-jugyah-blue" />
        <span>Contact Agent</span>
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm text-gray-600">Your Name</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <Input name="name" value={formData.name} onChange={handleChange} required placeholder="Full name" className="pl-10" />
          </div>
        </div>

        <div>
          <label className="text-sm text-gray-600">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <Input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="Email address" className="pl-10" />
          </div>
        </div>

        <div>
          <label className="text-sm text-gray-600">Phone</label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <Input name="phone" value={formData.phone} onChange={handleChange} required placeholder="Phone number" className="pl-10" />
          </div>
        </div>

        <div>
          <label className="text-sm text-gray-600">Message</label>
          <Textarea name="message" rows={4} value={formData.message} onChange={handleChange} required />
        </div>

        <Button type="submit" disabled={isSubmitting} className="w-full bg-jugyah-blue hover:bg-jugyah-blue/90 gap-2">
          <Send size={18} />
          <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
        </Button>

        <p className="text-xs text-gray-500 text-center">
          By submitting, you agree to our privacy policy.
        </p>
      </form>
    </div>
  );
};

export default ContactForm;
