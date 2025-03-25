
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

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

export default function Togglebuyrent() {
  const [activeTab, setActiveTab] = useState("buying");
  const navigate = useNavigate();

  const getRentLocations = (locations: string[]) => {
    return locations.map(loc => `Flats for rent in ${loc}`);
  };

  const handleLocationClick = (location: string, city: string) => {
    // Format for URL parameter
    const queryParam = encodeURIComponent(location);
    const cityParam = encodeURIComponent(city.split(" ")[2]); // Extract city name
    
    // Route to the appropriate page
    const route = activeTab === "buying" ? "properties-for-sale" : "properties-for-rent";
    return `/${route}?q=${queryParam}&city=${cityParam}`;
  };

  const extractCity = (title: string) => {
    // Extract city from the title (e.g., "Flats for sale in Mumbai" -> "Mumbai")
    const parts = title.split(" in ");
    return parts[parts.length - 1];
  };

  return (
    <div className="bg-[#f8f9fa] py-16">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <div className="inline-flex bg-gray-200 rounded-lg p-1">
            <button
              className={`px-6 py-2 rounded-md ${
                activeTab === "buying" ? "bg-black text-white" : "bg-transparent text-gray-700"
              } font-medium transition-all`}
              onClick={() => setActiveTab("buying")}
            >
              Buying
            </button>
            <button
              className={`px-6 py-2 rounded-md ${
                activeTab === "renting" ? "bg-black text-white" : "bg-transparent text-gray-700"
              } font-medium transition-all`}
              onClick={() => setActiveTab("renting")}
            >
              Renting
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((category, index) => {
            const city = extractCity(category.title);
            return (
              <div key={index} className="mb-6">
                <h2 className="text-lg font-semibold mb-4">
                  {activeTab === "buying" 
                    ? category.title 
                    : category.title.replace("sale", "rent")}
                </h2>
                <div className="space-y-2">
                  {(activeTab === "buying" 
                    ? category.locations.map(loc => `Flats for sale in ${loc}`) 
                    : getRentLocations(category.locations)
                  ).map((location, idx) => (
                    <Link 
                      key={idx} 
                      to={handleLocationClick(location, city)}
                      className="block text-gray-700 hover:text-blue-600 hover:underline"
                    >
                      {location}
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
