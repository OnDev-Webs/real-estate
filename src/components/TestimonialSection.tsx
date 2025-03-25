
import { useState } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: "Rahul Sharma",
    role: "Property Buyer",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    quote: "I was struggling to find my dream home until I came across this platform. The search filters made it super easy to narrow down options, and the agent I connected with was incredibly helpful. Found my perfect home in just 3 weeks!",
    rating: 5
  },
  {
    id: 2,
    name: "Priya Patel",
    role: "First-time Homeowner",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    quote: "As a first-time buyer, I was anxious about the process. The resources and guides on this site were so valuable. The mortgage calculator helped me plan my finances, and the property alerts notified me as soon as a suitable option came up.",
    rating: 5
  },
  {
    id: 3,
    name: "Amit Kapoor",
    role: "Property Investor",
    image: "https://randomuser.me/api/portraits/men/62.jpg",
    quote: "I've been using this platform for my real estate investments for over 2 years now. The market insights and property analytics have been invaluable for making informed decisions. Highly recommend for serious investors.",
    rating: 4
  },
];

export default function TestimonialSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  const nextTestimonial = () => {
    setActiveIndex((current) => (current + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveIndex((current) => (current - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div className="bg-[#f8f9fa] py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">What Our Clients Say</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Read testimonials from customers who found their perfect property through our platform
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto relative">
          <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="md:w-1/3 flex flex-col items-center">
                <div className="w-24 h-24 rounded-full overflow-hidden mb-4">
                  <img 
                    src={testimonials[activeIndex].image} 
                    alt={testimonials[activeIndex].name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-lg font-semibold text-center">{testimonials[activeIndex].name}</h3>
                <p className="text-gray-500 text-sm text-center">{testimonials[activeIndex].role}</p>
                <div className="flex mt-2">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={16} 
                      className={i < testimonials[activeIndex].rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"} 
                    />
                  ))}
                </div>
              </div>
              
              <div className="md:w-2/3">
                <svg className="text-gray-300 w-12 h-12 mb-4" fill="currentColor" viewBox="0 0 32 32" aria-hidden="true">
                  <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                </svg>
                <p className="text-gray-700 italic mb-6">{testimonials[activeIndex].quote}</p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center mt-6 gap-4">
            <button 
              onClick={prevTestimonial}
              className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-black hover:text-white transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              onClick={nextTestimonial}
              className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-black hover:text-white transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
