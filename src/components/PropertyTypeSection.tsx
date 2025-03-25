
import { Building, Home, MapPin, Warehouse, Landmark, Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const propertyTypes = [
  {
    name: "Apartments",
    icon: Building,
    count: 1240,
    path: "/properties?type=apartment"
  },
  {
    name: "Independent Houses",
    icon: Home,
    count: 850,
    path: "/properties?type=house"
  },
  {
    name: "Plots",
    icon: MapPin,
    count: 640,
    path: "/properties?type=plot"
  },
  {
    name: "Commercial",
    icon: Building2,
    count: 520,
    path: "/properties?type=commercial"
  },
  {
    name: "Farm Houses",
    icon: Warehouse,
    count: 300,
    path: "/properties?type=farmhouse"
  },
  {
    name: "Villas",
    icon: Landmark,
    count: 480,
    path: "/properties?type=villa"
  },
];

export default function PropertyTypeSection() {
  return (
    <div className="bg-white py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Browse Properties by Type</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our wide range of properties across different categories to find what suits your needs
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {propertyTypes.map((type, index) => (
            <Link 
              key={index}
              to={type.path}
              className="flex flex-col items-center bg-white border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-all hover:-translate-y-1"
            >
              <div className="w-16 h-16 bg-black/5 rounded-lg flex items-center justify-center mb-4">
                <type.icon className="text-black" size={24} />
              </div>
              <h3 className="text-lg font-semibold mb-1">{type.name}</h3>
              <p className="text-gray-500 text-sm">{type.count} Properties</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
