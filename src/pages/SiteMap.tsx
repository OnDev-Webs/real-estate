
import React from 'react';
import { Link } from 'react-router-dom';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { cities, propertyTypes, statusTypes } from '@/lib/data';
import { propertiesForSale, propertiesForRent } from '@/lib/dummy-properties';

const SiteMap = () => {
  // Get unique locations from properties
  const getSaleLocations = () => {
    const locations = propertiesForSale.map(property => property.location.city);
    return [...new Set(locations)];
  };

  const getRentLocations = () => {
    const locations = propertiesForRent.map(property => property.location.city);
    return [...new Set(locations)];
  };

  // Get unique property types
  const getPropertyTypes = () => {
    const types = [...propertiesForSale, ...propertiesForRent].map(property => property.features.propertyType);
    return [...new Set(types)];
  };

  // Get all properties by ID
  const getAllPropertyIds = () => {
    return [...propertiesForSale, ...propertiesForRent].map(property => property.id);
  };

  // Get all agents
  const getAgents = () => {
    const agents = [...propertiesForSale, ...propertiesForRent].map(property => property.agent);
    return [...new Set(agents.map(a => a.id))].map(id => 
      agents.find(agent => agent.id === id)
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-20">
        <section className="py-16 bg-white">
          <div className="container">
            <h1 className="text-3xl md:text-4xl font-bold mb-6">Site Map</h1>
            <p className="text-gray-600 mb-12">Navigate through all pages and resources available on Jugyah.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Main Pages */}
              <div>
                <h2 className="text-xl font-semibold mb-4 border-b pb-2">Main Pages</h2>
                <ul className="space-y-2">
                  <li><Link to="/" className="text-blue-600 hover:underline">Home</Link></li>
                  <li><Link to="/properties" className="text-blue-600 hover:underline">All Properties</Link></li>
                  <li><Link to="/properties-for-sale" className="text-blue-600 hover:underline">Properties for Sale</Link></li>
                  <li><Link to="/properties-for-rent" className="text-blue-600 hover:underline">Properties for Rent</Link></li>
                  <li><Link to="/agents" className="text-blue-600 hover:underline">Real Estate Agents</Link></li>
                  <li><Link to="/contact" className="text-blue-600 hover:underline">Contact Us</Link></li>
                  <li><Link to="/loans" className="text-blue-600 hover:underline">Home Loans</Link></li>
                  <li><Link to="/login" className="text-blue-600 hover:underline">Login</Link></li>
                  <li><Link to="/register" className="text-blue-600 hover:underline">Register</Link></li>
                </ul>
              </div>
              
              {/* Properties by City */}
              <div>
                <h2 className="text-xl font-semibold mb-4 border-b pb-2">Properties by City</h2>
                <div className="mb-4">
                  <h3 className="font-medium mb-2">For Sale:</h3>
                  <ul className="space-y-1">
                    {getSaleLocations().map((city, index) => (
                      <li key={`sale-${index}`}>
                        <Link 
                          to={`/properties-for-sale?city=${city}`}
                          className="text-blue-600 hover:underline"
                        >
                          Properties for Sale in {city}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium mb-2">For Rent:</h3>
                  <ul className="space-y-1">
                    {getRentLocations().map((city, index) => (
                      <li key={`rent-${index}`}>
                        <Link 
                          to={`/properties-for-rent?city=${city}`}
                          className="text-blue-600 hover:underline"
                        >
                          Properties for Rent in {city}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              {/* Properties by Type */}
              <div>
                <h2 className="text-xl font-semibold mb-4 border-b pb-2">Properties by Type</h2>
                <ul className="space-y-2">
                  {getPropertyTypes().map((type, index) => (
                    <li key={index}>
                      <Link 
                        to={`/properties?type=${type}`}
                        className="text-blue-600 hover:underline capitalize"
                      >
                        {type}s
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* User Dashboard */}
              <div>
                <h2 className="text-xl font-semibold mb-4 border-b pb-2">User Dashboard</h2>
                <ul className="space-y-2">
                  <li><Link to="/dashboard" className="text-blue-600 hover:underline">My Dashboard</Link></li>
                  <li><Link to="/profile" className="text-blue-600 hover:underline">My Profile</Link></li>
                  <li><Link to="/messages" className="text-blue-600 hover:underline">Messages</Link></li>
                  <li><Link to="/notifications" className="text-blue-600 hover:underline">Notifications</Link></li>
                  <li><Link to="/add-property" className="text-blue-600 hover:underline">Add Property</Link></li>
                </ul>
              </div>
              
              {/* Featured Properties */}
              <div>
                <h2 className="text-xl font-semibold mb-4 border-b pb-2">Featured Properties</h2>
                <ul className="space-y-2">
                  {[...propertiesForSale, ...propertiesForRent]
                    .filter(prop => prop.featured)
                    .slice(0, 8)
                    .map((property, index) => (
                      <li key={index}>
                        <Link 
                          to={`/property/${property.id}`}
                          className="text-blue-600 hover:underline"
                        >
                          {property.title}
                        </Link>
                      </li>
                    ))
                  }
                </ul>
              </div>
              
              {/* Real Estate Agents */}
              <div>
                <h2 className="text-xl font-semibold mb-4 border-b pb-2">Real Estate Agents</h2>
                <ul className="space-y-2">
                  {getAgents().map((agent, index) => (
                    <li key={index}>
                      <Link 
                        to={`/agent/${agent?.id}`}
                        className="text-blue-600 hover:underline"
                      >
                        {agent?.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default SiteMap;
