
import { SmartphoneIcon, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function DownloadAppSection() {
  return (
    <div className="bg-black py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Download Our Mobile App</h2>
            <p className="text-white/80 mb-8">
              Search for properties, save favorites, and get real-time notifications on your mobile device. Our app makes property hunting easier than ever.
            </p>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="text-white" size={20} />
                <span className="text-white">Search properties on the go</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="text-white" size={20} />
                <span className="text-white">Get instant notifications for new listings</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="text-white" size={20} />
                <span className="text-white">Schedule viewings with a single tap</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="text-white" size={20} />
                <span className="text-white">Chat directly with property agents</span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="bg-white text-black hover:bg-white/90">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Google_Play_Store_badge_EN.svg/1200px-Google_Play_Store_badge_EN.svg.png" alt="Google Play" className="h-8" />
              </Button>
              <Button className="bg-white text-black hover:bg-white/90">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Download_on_the_App_Store_Badge.svg/1200px-Download_on_the_App_Store_Badge.svg.png" alt="App Store" className="h-8" />
              </Button>
            </div>
          </div>
          
          <div className="hidden md:flex justify-center">
            <div className="relative">
              <div className="w-64 h-[500px] bg-white/10 rounded-3xl p-3 relative overflow-hidden">
                <div className="w-full h-full bg-gray-800 rounded-2xl overflow-hidden">
                  <img 
                    src="https://img.freepik.com/free-vector/real-estate-app-interface_23-2148627768.jpg" 
                    alt="App Screenshot" 
                    className="w-full h-full object-cover" 
                  />
                </div>
                <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-24 h-5 bg-black rounded-full"></div>
              </div>
              <div className="absolute -bottom-4 -right-4 w-64 h-[500px] bg-white/5 rounded-3xl -z-10 transform rotate-6"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
