
import { useState } from 'react';
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PropertyGalleryProps {
  images: string[];
  title: string;
}

const PropertyGallery = ({ images, title }: PropertyGalleryProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const handlePrev = () => {
    setActiveIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  const handleNext = () => {
    setActiveIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  };

  const openLightbox = () => {
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  return (
    <section className="bg-white py-8">
      <div className="container">
        <div className="relative mb-4">
          <div className="aspect-[16/9] rounded-lg overflow-hidden">
            <img 
              src={images[activeIndex]} 
              alt={`${title} - Image ${activeIndex + 1}`} 
              className="w-full h-full object-cover"
            />
          </div>
          
          <button 
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 text-estate-dark hover:bg-white transition-colors"
            onClick={handlePrev}
          >
            <ChevronLeft size={24} />
          </button>
          
          <button 
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 text-estate-dark hover:bg-white transition-colors"
            onClick={handleNext}
          >
            <ChevronRight size={24} />
          </button>
          
          <button 
            className="absolute right-4 top-4 p-2 rounded-full bg-white/80 text-estate-dark hover:bg-white transition-colors"
            onClick={openLightbox}
          >
            <Maximize2 size={20} />
          </button>
        </div>
        
        <div className="grid grid-cols-4 md:grid-cols-6 gap-2 md:gap-4">
          {images.map((image, index) => (
            <button
              key={index}
              className={cn(
                "aspect-video rounded-md overflow-hidden",
                activeIndex === index && "ring-2 ring-estate-primary"
              )}
              onClick={() => setActiveIndex(index)}
            >
              <img 
                src={image} 
                alt={`${title} - Thumbnail ${index + 1}`} 
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>
      
      {/* Lightbox */}
      {lightboxOpen && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <div className="relative max-w-6xl w-full">
            <button 
              className="absolute top-2 right-2 p-2 rounded-full bg-white/20 text-white hover:bg-white/40 z-10"
              onClick={closeLightbox}
            >
              <span className="sr-only">Close</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
            
            <img 
              src={images[activeIndex]} 
              alt={`${title} - Fullsize ${activeIndex + 1}`} 
              className="max-h-[85vh] mx-auto"
            />
            
            <div className="absolute left-0 top-1/2 -translate-y-1/2">
              <button 
                className="p-3 rounded-full bg-white/20 text-white hover:bg-white/40"
                onClick={(e) => { e.stopPropagation(); handlePrev(); }}
              >
                <ChevronLeft size={28} />
              </button>
            </div>
            
            <div className="absolute right-0 top-1/2 -translate-y-1/2">
              <button 
                className="p-3 rounded-full bg-white/20 text-white hover:bg-white/40"
                onClick={(e) => { e.stopPropagation(); handleNext(); }}
              >
                <ChevronRight size={28} />
              </button>
            </div>
            
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
              <div className="bg-white/20 rounded-full px-4 py-2 text-white">
                {activeIndex + 1} / {images.length}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default PropertyGallery;
