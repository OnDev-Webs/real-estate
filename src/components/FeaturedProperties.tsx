import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import PropertyCard from "@/components/PropertyCard";
import { Property } from "@/lib/data";
import { Button } from "@/components/ui/button";

import { getPropertiesByStatus } from "@/services/propertyService";
import { Link } from "react-router-dom"; // <-- make sure you're using react-router

const PropertiesForRent = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProperties = async () => {
      setIsLoading(true);
      try {
        const data = await getPropertiesByStatus("for-rent");
        setProperties(data.slice(0, 3)); // Display only the first 3
      } catch (error) {
        console.error("Error fetching properties:", error);
        setError("Failed to load properties. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperties();
  }, []);

  return (
    
      <div className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">Properties For Rent</h1>

          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center">
              {error}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {properties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>

              <div className="mt-8 text-center">
                
                <Link
                  to="/properties-for-sale"
                  className="inline-block bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition"
                >
                  View More
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
   
  );
};

export default PropertiesForRent;
