
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Login from '@/pages/Login'; 
import Register from '@/pages/Register';

import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger
} from "@/components/ui/navigation-menu";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown, User, Plus } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/contexts/AuthContext';

// Import the categories from Togglebuyrent to keep data consistent
const categories = [
  {
    title: "Flats for sale in Mumbai",
    locations: [
      "Andheri West", "Mahim", "Mira Road", "Mulund", "Vile Parle West",
      "Goregaon West", "Malabar Hill", "Byculla", "Andheri East", "Kurla",
      "Bhayandar", "Bhandup", "Juhu", "Borivali East", "Colaba", "Kanjurmarg",
      "Marol", "BKC", "Worli", "Ghatkopar West", "Jogeshwari East",
      "Borivali West", "Haware City", "Mahalaxmi", "Powai", "Ghatkopar East",
      "Matunga East", "Sion", "Jogeshwari West", "Dahisar", "Tardeo", "Grant Road"
    ]
  },
  {
    title: "Flats for sale in Thane",
    locations: [
      "Thane East", "Kolshet", "Waghbil", "Dombivli", "Beyond Thane", "Manpada",
      "Anand Nagar", "Korum Mall", "Hiranandani Estate", "Ghodbunder Road",
      "Majiwada", "Suraj Water Park", "Thane West"
    ]
  },
  {
    title: "Flats for sale in Navi Mumbai",
    locations: [
      "Panvel", "Kharghar", "Turbhe", "Nerul", "Khandaeshwar", "Ulwe", "Airoli",
      "Taloja", "Vashi", "Seawood Darave", "Bamandongri", "Shilphata", "Ghansoli",
      "Koparkhairane", "Sanpada", "Belapur CBD", "Kharkopar", "Navi Mumbai",
      "Rabale", "Juinagar", "Mansarovar", "Diva"
    ]
  }
];

const Header = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  const { user, isAuthenticated, logout } = useAuth();
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  
  // Format location for URL parameters
  const formatLocationLink = (location: string, isSale: boolean) => {
    const fullLocation = isSale 
      ? `Flats for sale in ${location}` 
      : `Flats for rent in ${location}`;
    const queryParam = encodeURIComponent(fullLocation);
    const cityMatch = location.match(/in\s+([^\s]+)$/);
    const city = cityMatch ? cityMatch[1] : '';
    const cityParam = encodeURIComponent(city);
    
    const route = isSale ? "properties-for-sale" : "properties-for-rent";
    return `/${route}?q=${queryParam}&city=${cityParam}`;
  };

  // Extract city from title
  const extractCity = (title: string) => {
    const parts = title.split(" in ");
    return parts[parts.length - 1];
  };

  // Function to handle location click and generate the correct URL
  const handleLocationClick = (location: string, city: string, isSale: boolean) => {
    // Format for URL parameter
    const locationType = isSale ? "sale" : "rent";
    const fullLocation = `Flats for ${locationType} in ${location}`;
    const queryParam = encodeURIComponent(fullLocation);
    const cityParam = encodeURIComponent(city);
    
    // Route to the appropriate page
    const route = isSale ? "properties-for-sale" : "properties-for-rent";
    return `/${route}?q=${queryParam}&city=${cityParam}`;
  };

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Prevent body scrolling when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [mobileMenuOpen]);

  const isTransparent = pathname === '/' && !scrolled && !mobileMenuOpen;

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        isTransparent 
          ? 'bg-transparent text-white' 
          : 'bg-white text-black shadow-sm'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold flex items-center">
            {isTransparent ? (
              <span className="text-white">Real estate</span>
            ) : (
              <span className="text-black">Real Estate</span>
            )}
          </Link>
          
          {/* Desktop Navigation */}
          {!isMobile && (
            <nav className="ml-8 hidden md:flex items-center space-x-1">
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <Link to="/" className={`px-4 py-2 rounded-md text-sm hover:bg-black/5 ${pathname === '/' ? 'font-semibold' : ''}`}>
                      Home
                    </Link>
                  </NavigationMenuItem>
                  
                  <NavigationMenuItem>
                    <NavigationMenuTrigger 
                      className={`bg-transparent hover:bg-black/5 ${isTransparent ? 'text-white' : 'text-black'}`}
                    >
                      For Sale
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="grid grid-cols-4 gap-4 p-6 w-[1000px]">
                        <div>
                          <h3 className="text-lg font-semibold mb-3">Property Types</h3>
                          <ul className="space-y-2">
                            <li>
                              <Link to="/properties-for-sale?type=apartment" className="text-sm hover:underline">Apartments</Link>
                            </li>
                            <li>
                              <Link to="/properties-for-sale?type=house" className="text-sm hover:underline">Independent Houses</Link>
                            </li>
                            <li>
                              <Link to="/properties-for-sale?type=villa" className="text-sm hover:underline">Villas</Link>
                            </li>
                            <li>
                              <Link to="/properties-for-sale?type=plot" className="text-sm hover:underline">Plots</Link>
                            </li>
                            <li>
                              <Link to="/properties-for-sale?type=farmhouse" className="text-sm hover:underline">Farm Houses</Link>
                            </li>
                          </ul>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-semibold mb-3">Popular Locations</h3>
                          <ul className="space-y-2">
                            <li>
                              <Link to="/properties-for-sale?city=Mumbai" className="text-sm hover:underline">Mumbai</Link>
                            </li>
                            <li>
                              <Link to="/properties-for-sale?city=Thane" className="text-sm hover:underline">Thane</Link>
                            </li>
                            <li>
                              <Link to="/properties-for-sale?city=Navi Mumbai" className="text-sm hover:underline">Navi Mumbai</Link>
                            </li>
                          </ul>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-semibold mb-3">By Budget</h3>
                          <ul className="space-y-2">
                            <li>
                              <Link to="/properties-for-sale?maxPrice=5000000" className="text-sm hover:underline">Under ₹50 Lakhs</Link>
                            </li>
                            <li>
                              <Link to="/properties-for-sale?minPrice=5000000&maxPrice=10000000" className="text-sm hover:underline">₹50 Lakhs - ₹1 Crore</Link>
                            </li>
                            <li>
                              <Link to="/properties-for-sale?minPrice=10000000&maxPrice=20000000" className="text-sm hover:underline">₹1 Crore - ₹2 Crore</Link>
                            </li>
                            <li>
                              <Link to="/properties-for-sale?minPrice=20000000" className="text-sm hover:underline">Above ₹2 Crore</Link>
                            </li>
                          </ul>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-semibold mb-3">Mumbai Areas</h3>
                          <div className="grid grid-cols-2 gap-1">
                            {categories[0].locations.slice(0, 16).map((location, idx) => (
                              <Link
                                key={idx}
                                to={handleLocationClick(location, "Mumbai", true)}
                                className="text-sm hover:underline truncate pr-2"
                              >
                                {location}
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 px-6 pb-6">
                        <div>
                          <h3 className="text-lg font-semibold mb-2">Thane Areas</h3>
                          <div className="grid grid-cols-2 gap-1">
                            {categories[1].locations.slice(0, 10).map((location, idx) => (
                              <Link
                                key={idx}
                                to={handleLocationClick(location, "Thane", true)}
                                className="text-sm hover:underline truncate pr-2"
                              >
                                {location}
                              </Link>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-semibold mb-2">Navi Mumbai Areas</h3>
                          <div className="grid grid-cols-2 gap-1">
                            {categories[2].locations.slice(0, 10).map((location, idx) => (
                              <Link
                                key={idx}
                                to={handleLocationClick(location, "Navi Mumbai", true)}
                                className="text-sm hover:underline truncate pr-2"
                              >
                                {location}
                              </Link>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex items-end">
                          <Link to="/properties-for-sale">
                            <Button variant="outline" className="border-black text-black">
                              Browse All Properties
                            </Button>
                          </Link>
                        </div>
                      </div>
                      
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                  
                  <NavigationMenuItem>
                    <NavigationMenuTrigger 
                      className={`bg-transparent hover:bg-black/5 ${isTransparent ? 'text-white' : 'text-black'}`}
                    >
                      For Rent
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="grid grid-cols-4 gap-4 p-6 w-[1000px]">
                        <div>
                          <h3 className="text-lg font-semibold mb-3">Property Types</h3>
                          <ul className="space-y-2">
                            <li>
                              <Link to="/properties-for-rent?type=apartment" className="text-sm hover:underline">Apartments</Link>
                            </li>
                            <li>
                              <Link to="/properties-for-rent?type=house" className="text-sm hover:underline">Independent Houses</Link>
                            </li>
                            <li>
                              <Link to="/properties-for-rent?type=villa" className="text-sm hover:underline">Villas</Link>
                            </li>
                            <li>
                              <Link to="/properties-for-rent?type=commercial" className="text-sm hover:underline">Commercial Spaces</Link>
                            </li>
                            <li>
                              <Link to="/properties-for-rent?type=pg" className="text-sm hover:underline">PG & Co-living</Link>
                            </li>
                          </ul>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-semibold mb-3">Popular Locations</h3>
                          <ul className="space-y-2">
                            <li>
                              <Link to="/properties-for-rent?city=Mumbai" className="text-sm hover:underline">Mumbai</Link>
                            </li>
                            <li>
                              <Link to="/properties-for-rent?city=Thane" className="text-sm hover:underline">Thane</Link>
                            </li>
                            <li>
                              <Link to="/properties-for-rent?city=Navi Mumbai" className="text-sm hover:underline">Navi Mumbai</Link>
                            </li>
                          </ul>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-semibold mb-3">By Budget</h3>
                          <ul className="space-y-2">
                            <li>
                              <Link to="/properties-for-rent?maxPrice=20000" className="text-sm hover:underline">Under ₹20,000</Link>
                            </li>
                            <li>
                              <Link to="/properties-for-rent?minPrice=20000&maxPrice=40000" className="text-sm hover:underline">₹20,000 - ₹40,000</Link>
                            </li>
                            <li>
                              <Link to="/properties-for-rent?minPrice=40000&maxPrice=60000" className="text-sm hover:underline">₹40,000 - ₹60,000</Link>
                            </li>
                            <li>
                              <Link to="/properties-for-rent?minPrice=60000" className="text-sm hover:underline">Above ₹60,000</Link>
                            </li>
                          </ul>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-semibold mb-3">Mumbai Areas</h3>
                          <div className="grid grid-cols-2 gap-1">
                            {categories[0].locations.slice(0, 16).map((location, idx) => (
                              <Link
                                key={idx}
                                to={handleLocationClick(location, "Mumbai", false)}
                                className="text-sm hover:underline truncate pr-2"
                              >
                                {location}
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 px-6 pb-6">
                        <div>
                          <h3 className="text-lg font-semibold mb-2">Thane Areas</h3>
                          <div className="grid grid-cols-2 gap-1">
                            {categories[1].locations.slice(0, 10).map((location, idx) => (
                              <Link
                                key={idx}
                                to={handleLocationClick(location, "Thane", false)}
                                className="text-sm hover:underline truncate pr-2"
                              >
                                {location}
                              </Link>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-semibold mb-2">Navi Mumbai Areas</h3>
                          <div className="grid grid-cols-2 gap-1">
                            {categories[2].locations.slice(0, 10).map((location, idx) => (
                              <Link
                                key={idx}
                                to={handleLocationClick(location, "Navi Mumbai", false)}
                                className="text-sm hover:underline truncate pr-2"
                              >
                                {location}
                              </Link>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex items-end">
                          <Link to="/properties-for-rent">
                            <Button variant="outline" className="border-black text-black">
                              Browse All Rentals
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                  
                  <NavigationMenuItem>
                    <Link to="/loans" className={`px-4 py-2 rounded-md text-sm hover:bg-black/5 ${pathname === '/loans' ? 'font-semibold' : ''}`}>
                      Loans
                    </Link>
                  </NavigationMenuItem>
                  
                  <NavigationMenuItem>
                    <Link to="/agents" className={`px-4 py-2 rounded-md text-sm hover:bg-black/5 ${pathname === '/agents' ? 'font-semibold' : ''}`}>
                      Agents
                    </Link>
                  </NavigationMenuItem>
                  
                  <NavigationMenuItem>
                    <Link to="/contact" className={`px-4 py-2 rounded-md text-sm hover:bg-black/5 ${pathname === '/contact' ? 'font-semibold' : ''}`}>
                      Contact
                    </Link>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </nav>
          )}
          
          {/* Right side buttons */}
          <div className="flex items-center">
            {!isMobile && (
              <>
                {isAuthenticated ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="gap-2">
                        <User size={18} />
                        <span>{user?.name || 'Account'}</span>
                        <ChevronDown size={16} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="min-w-[180px]">
                      <DropdownMenuItem asChild>
                        <Link to="/dashboard">Dashboard</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/profile">My Profile</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/messages">Messages</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/notifications">Notifications</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={logout}>
                        Sign Out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <>
                   <Button variant="outline" className={isTransparent ? "bg-white text-black hover:bg-white/90" : "bg-black text-white hover:bg-black/90"} onClick={() => setIsLoginOpen(true)} >
                        Sign In
                      </Button>
                      <Login isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
                      <Button style={{marginLeft:'5px'}} onClick={() => setIsRegisterOpen(true)} className={isTransparent ? "bg-white text-black hover:bg-white/90" : "bg-black text-white hover:bg-black/90" }>
                        Sign Up
                      </Button>
                      <Register isOpen={isRegisterOpen} onClose={() => setIsRegisterOpen(false)} />

                  </>
                )}
                {!isAuthenticated ? (
  <Button
    variant="outline"
    className="w-full border-black ms-3 text-black hover:bg-black hover:text-white gap-2"
    onClick={() => setIsLoginOpen(true)}
  >
    <Plus size={16} />
    <span>Add Property</span>
  </Button>
) : (
  <Link to="/add-property" className="w-full">
    <Button
      variant="outline"
      className="w-full ms-3 border-black text-black hover:bg-black hover:text-white gap-2"
    >
      <Plus size={16} />
      <span>Add Property</span>
    </Button>
  </Link>
)}

              </>
            )}
            
            {/* Mobile menu button */}
            {isMobile && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="focus:outline-none"
              >
                {mobileMenuOpen ? (
                  <X size={24} className={isTransparent ? "text-white" : "text-black"} />
                ) : (
                  <Menu size={24} className={isTransparent ? "text-white" : "text-black"} />
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMobile && mobileMenuOpen && (
        <div className="fixed inset-0 top-20 bg-white z-40 overflow-y-auto">
          <div className="container px-4 py-6">
            <nav className="flex flex-col space-y-2">
              <Link to="/" className="py-3 px-4 hover:bg-gray-100 rounded-md font-medium">
                Home
              </Link>
              
              <div className="py-2 px-4 border-t border-gray-100">
                <h3 className="font-semibold mb-2">For Sale</h3>
                <ul className="ml-4 space-y-2">
                  <li>
                    <Link to="/properties-for-sale?type=apartment" className="text-gray-700 hover:text-black">
                      Apartments
                    </Link>
                  </li>
                  <li>
                    <Link to="/properties-for-sale?type=house" className="text-gray-700 hover:text-black">
                      Independent Houses
                    </Link>
                  </li>
                  <li>
                    <Link to="/properties-for-sale?type=villa" className="text-gray-700 hover:text-black">
                      Villas
                    </Link>
                  </li>
                  
                  {/* Add Mumbai areas section */}
                  <li className="mt-2">
                    <details className="cursor-pointer">
                      <summary className="text-gray-700 font-medium">Mumbai Areas</summary>
                      <ul className="ml-3 mt-1 space-y-1">
                        {categories[0].locations.slice(0, 6).map((location, idx) => (
                          <li key={idx}>
                            <Link to={`/properties-for-sale?q=${encodeURIComponent(`Flats for sale in ${location}`)}&city=Mumbai`} 
                              className="text-gray-600 text-sm hover:text-black">
                              {location}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </details>
                  </li>
                  
                  <li>
                    <Link to="/properties-for-sale" className="text-gray-700 hover:text-black font-medium">
                      View All For Sale
                    </Link>
                  </li>
                </ul>
              </div>
              
              <div className="py-2 px-4 border-t border-gray-100">
                <h3 className="font-semibold mb-2">For Rent</h3>
                <ul className="ml-4 space-y-2">
                  <li>
                    <Link to="/properties-for-rent?type=apartment" className="text-gray-700 hover:text-black">
                      Apartments
                    </Link>
                  </li>
                  <li>
                    <Link to="/properties-for-rent?type=house" className="text-gray-700 hover:text-black">
                      Independent Houses
                    </Link>
                  </li>
                  <li>
                    <Link to="/properties-for-rent?type=villa" className="text-gray-700 hover:text-black">
                      Villas
                    </Link>
                  </li>
                  
                  {/* Add Mumbai areas section */}
                  <li className="mt-2">
                    <details className="cursor-pointer">
                      <summary className="text-gray-700 font-medium">Mumbai Areas</summary>
                      <ul className="ml-3 mt-1 space-y-1">
                        {categories[0].locations.slice(0, 6).map((location, idx) => (
                          <li key={idx}>
                            <Link to={`/properties-for-rent?q=${encodeURIComponent(`Flats for rent in ${location}`)}&city=Mumbai`} 
                              className="text-gray-600 text-sm hover:text-black">
                              {location}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </details>
                  </li>
                  
                  <li>
                    <Link to="/properties-for-rent" className="text-gray-700 hover:text-black font-medium">
                      View All For Rent
                    </Link>
                  </li>
                </ul>
              </div>
              
              <Link to="/loans" className="py-3 px-4 hover:bg-gray-100 rounded-md border-t border-gray-100">
                Loans
              </Link>
              
              <Link to="/agents" className="py-3 px-4 hover:bg-gray-100 rounded-md">
                Agents
              </Link>
              
              <Link to="/contact" className="py-3 px-4 hover:bg-gray-100 rounded-md">
                Contact
              </Link>
              
              <div className="mt-4 px-4 pt-4 border-t border-gray-100 flex flex-col space-y-3">
                {isAuthenticated ? (
                  <>
                    <Link to="/dashboard" className="w-full">
                      <Button variant="outline" className="w-full justify-start">
                        Dashboard
                      </Button>
                    </Link>
                    <Button variant="outline" className="w-full justify-start" onClick={logout}>
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    {/* <Link to="/login" className="w-full"> */}
                      <Button variant="outline" onClick={() => setIsLoginOpen(true)} className="w-full">
                        Sign In
                      </Button>
                      <Login isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />

                    {/* </Link> */}
                      <Button onClick={() => setIsRegisterOpen(true)} className="w-full bg-black text-white hover:bg-black/90">
                        Sign Up
                      </Button>
                      <Register isOpen={isRegisterOpen} onClose={() => setIsRegisterOpen(false)} />

                  </>
                )}
                <Link to="/add-property" className="w-full">
                  <Button variant="outline" className="w-full border-black text-black hover:bg-black hover:text-white gap-2">
                    <Plus size={16} />
                    <span>Add Property</span>
                  </Button>
                </Link>

                {!isAuthenticated ? (
  <Button
    variant="outline"
    className="w-full border-black text-black hover:bg-black hover:text-white gap-2"
    onClick={() => setIsLoginOpen(true)}
  >
    <Plus size={16} />
    <span>Add Property</span>
  </Button>
) : (
  <Link to="/add-property" className="w-full">
    <Button
      variant="outline"
      className="w-full border-black text-black hover:bg-black hover:text-white gap-2"
    >
      <Plus size={16} />
      <span>Add Property</span>
    </Button>
  </Link>
)}

              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
