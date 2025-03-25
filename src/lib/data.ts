export interface Property {
  id: string;
  _id?: string; // Add optional _id field to match MongoDB documents
  title: string;
  description: string;
  price: number;
  location: {
    address: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    lat?: number;
    lng?: number;
  };
  features: {
    bedrooms: number; // BHK
    bathrooms: number;
    area: number; // square feet
    yearBuilt: number;
    propertyType: 'apartment' | 'house' | 'villa' | 'plot' | 'penthouse';
    status: 'for-sale' | 'for-rent' | 'sold' | 'pending';
    floorPlan?: string; // URL to floor plan image
  };
  amenities: string[];
  images: string[];
  agent: {
    id: string;
    name: string;
    phone: string;
    email: string;
    image: string;
  };
  featured: boolean;
  createdAt: string;
  views?: number; // Add optional views field
}

export const properties: Property[] = [
  {
    id: "prop-1",
    title: "Modern 3 BHK Apartment in Powai",
    description: "Luxurious 3 BHK apartment with breathtaking lake views, modern finishes, and resort-style amenities. This stunning property features an open floor plan with floor-to-ceiling windows, a gourmet kitchen with high-end appliances, and a spacious balcony perfect for entertaining.",
    price: 18500000,
    location: {
      address: "123 Lake Vista Road",
      city: "Mumbai",
      state: "Maharashtra",
      zip: "400076",
      country: "India",
      lat: 19.116587,
      lng: 72.889780
    },
    features: {
      bedrooms: 3,
      bathrooms: 2,
      area: 1650,
      yearBuilt: 2019,
      propertyType: "apartment",
      status: "for-sale",
      floorPlan: "https://images.unsplash.com/photo-1604014438576-9e97f3c26a25?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    amenities: ["Swimming Pool", "Fitness Center", "Parking", "24/7 Security", "Pet-Friendly", "Elevator"],
    images: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    ],
    agent: {
      id: "agent-1",
      name: "Priya Sharma",
      phone: "(022) 2555-1234",
      email: "priya.s@realestate.com",
      image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    featured: true,
    createdAt: "2023-09-15T10:30:00Z"
  },
  {
    id: "prop-2",
    title: "Spacious 4 BHK Villa in Juhu",
    description: "Beautiful family home with plenty of space for entertaining. Features include a large backyard, updated kitchen, and a finished basement. Located in the prestigious Juhu area with excellent schools nearby.",
    price: 75000000,
    location: {
      address: "456 Juhu Beach Road",
      city: "Mumbai",
      state: "Maharashtra",
      zip: "400049",
      country: "India",
      lat: 19.086167,
      lng: 72.826363
    },
    features: {
      bedrooms: 4,
      bathrooms: 4,
      area: 3200,
      yearBuilt: 2010,
      propertyType: "villa",
      status: "for-sale",
      floorPlan: "https://images.unsplash.com/photo-1604014237800-1c9102c219da?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    amenities: ["Garden", "Garage", "Fireplace", "Central AC", "Basement", "Patio"],
    images: [
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    ],
    agent: {
      id: "agent-2",
      name: "Vikram Malhotra",
      phone: "(022) 2555-5678",
      email: "vikram.m@realestate.com",
      image: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    featured: true,
    createdAt: "2023-09-10T14:45:00Z"
  },
  {
    id: "prop-3",
    title: "Luxury 2 BHK Condo in Worli",
    description: "Stunning luxury condo in the heart of Worli with sea views. Walking distance to shops, restaurants, and entertainment. Features high-end finishes, an open floor plan, and amazing city views.",
    price: 25000000,
    location: {
      address: "789 Sea Face Road",
      city: "Mumbai",
      state: "Maharashtra",
      zip: "400018",
      country: "India",
      lat: 19.009602,
      lng: 72.815323
    },
    features: {
      bedrooms: 2,
      bathrooms: 2,
      area: 1200,
      yearBuilt: 2018,
      propertyType: "apartment",
      status: "for-sale",
      floorPlan: "https://images.unsplash.com/photo-1604014237256-11d475e2a2d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    amenities: ["Concierge", "Fitness Center", "Rooftop Terrace", "Private Parking", "Security System", "Elevator"],
    images: [
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    ],
    agent: {
      id: "agent-3",
      name: "Anjali Desai",
      phone: "(022) 2555-9012",
      email: "anjali.d@realestate.com",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    featured: false,
    createdAt: "2023-09-05T09:15:00Z"
  },
  {
    id: "prop-4",
    title: "Charming 3 BHK Townhouse in Bandra",
    description: "Beautifully renovated townhouse located minutes from Bandra Bandstand. Features modern kitchen, hardwood floors throughout, and a private patio. Perfect for urban professionals.",
    price: 32000000,
    location: {
      address: "101 Hill Road",
      city: "Mumbai",
      state: "Maharashtra",
      zip: "400050",
      country: "India",
      lat: 19.058383,
      lng: 72.828214
    },
    features: {
      bedrooms: 3,
      bathrooms: 3,
      area: 1800,
      yearBuilt: 2015,
      propertyType: "apartment",
      status: "for-sale",
      floorPlan: "https://images.unsplash.com/photo-1604014438487-b2c27bdc5d51?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    amenities: ["Private Patio", "Hardwood Floors", "Modern Appliances", "Parking Space", "Storage Unit", "Close to Transit"],
    images: [
      "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    ],
    agent: {
      id: "agent-2",
      name: "Vikram Malhotra",
      phone: "(022) 2555-5678",
      email: "vikram.m@realestate.com",
      image: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    featured: false,
    createdAt: "2023-08-28T16:20:00Z"
  },
  {
    id: "prop-5",
    title: "Elegant 5 BHK Heritage Bungalow in Malabar Hill",
    description: "Stunning heritage bungalow with modern updates throughout. Original architectural details preserved while incorporating contemporary amenities. Features a chef's kitchen, spacious primary suite, and beautiful garden.",
    price: 125000000,
    location: {
      address: "555 Ridge Road",
      city: "Mumbai",
      state: "Maharashtra",
      zip: "400006",
      country: "India",
      lat: 18.956310,
      lng: 72.804565
    },
    features: {
      bedrooms: 5,
      bathrooms: 5,
      area: 5500,
      yearBuilt: 1945,
      propertyType: "house",
      status: "for-sale",
      floorPlan: "https://images.unsplash.com/photo-1604014307827-76ae479d65e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    amenities: ["Original Details", "Garden", "Chef's Kitchen", "Home Office", "High Ceilings", "Wine Cellar"],
    images: [
      "https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    ],
    agent: {
      id: "agent-1",
      name: "Priya Sharma",
      phone: "(022) 2555-1234",
      email: "priya.s@realestate.com",
      image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    featured: true,
    createdAt: "2023-09-12T11:05:00Z"
  },
  {
    id: "prop-6",
    title: "Modern 4 BHK Penthouse in Andheri",
    description: "Escape to this modern penthouse offering tranquility and luxury. Expansive views, open-concept design, and premium finishes. Perfect for those seeking space and serenity.",
    price: 45000000,
    location: {
      address: "777 Oshiwara Garden",
      city: "Mumbai",
      state: "Maharashtra",
      zip: "400053",
      country: "India",
      lat: 19.136788,
      lng: 72.826503
    },
    features: {
      bedrooms: 4,
      bathrooms: 4,
      area: 3000,
      yearBuilt: 2021,
      propertyType: "penthouse",
      status: "for-sale",
      floorPlan: "https://images.unsplash.com/photo-1604014438396-3273645c64f7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    amenities: ["City Views", "Smart Home", "Heated Floors", "Jacuzzi", "Private Terrace", "Solar Panels"],
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    ],
    agent: {
      id: "agent-3",
      name: "Anjali Desai",
      phone: "(022) 2555-9012",
      email: "anjali.d@realestate.com",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    featured: false,
    createdAt: "2023-08-20T13:40:00Z"
  }
];

export const agents = properties.map(property => property.agent)
  .filter((agent, index, self) => 
    index === self.findIndex((a) => a.id === agent.id)
  );

export const cities = ["Mumbai", "Pune", "Thane", "Navi Mumbai", "Bangalore", "Delhi", "Hyderabad", "Chennai"];

export const propertyTypes = [
  { value: 'apartment', label: 'Apartment' },
  { value: 'house', label: 'House' },
  { value: 'villa', label: 'Villa' },
  { value: 'penthouse', label: 'Penthouse' },
  { value: 'plot', label: 'Plot' }
];

export const statusTypes = [
  { value: 'for-sale', label: 'For Sale' },
  { value: 'for-rent', label: 'For Rent' },
  { value: 'sold', label: 'Sold' },
  { value: 'pending', label: 'Pending' }
];

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
    minimumFractionDigits: 0
  }).format(price);
}

export function getPropertyById(id: string): Property | undefined {
  return properties.find(property => property.id === id);
}

export function searchProperties(
  query: string = '',
  filters: {
    minPrice?: number;
    maxPrice?: number;
    bedrooms?: number;
    bathrooms?: number;
    propertyType?: string;
    status?: string;
    city?: string;
  } = {}
): Property[] {
  return properties.filter(property => {
    // Search by query
    const matchesQuery = query === '' || 
      property.title.toLowerCase().includes(query.toLowerCase()) ||
      property.description.toLowerCase().includes(query.toLowerCase()) ||
      property.location.city.toLowerCase().includes(query.toLowerCase()) ||
      property.location.address.toLowerCase().includes(query.toLowerCase());
    
    // Apply filters
    const matchesMinPrice = filters.minPrice === undefined || property.price >= filters.minPrice;
    const matchesMaxPrice = filters.maxPrice === undefined || property.price <= filters.maxPrice;
    const matchesBedrooms = filters.bedrooms === undefined || property.features.bedrooms >= filters.bedrooms;
    const matchesBathrooms = filters.bathrooms === undefined || property.features.bathrooms >= filters.bathrooms;
    const matchesPropertyType = !filters.propertyType || property.features.propertyType === filters.propertyType;
    const matchesStatus = !filters.status || property.features.status === filters.status;
    const matchesCity = !filters.city || property.location.city === filters.city;
    
    return matchesQuery && 
           matchesMinPrice && 
           matchesMaxPrice && 
           matchesBedrooms && 
           matchesBathrooms && 
           matchesPropertyType && 
           matchesStatus &&
           matchesCity;
  });
}

export function getFeaturedProperties(): Property[] {
  return properties.filter(property => property.featured);
}

export function getRecentProperties(limit: number = 3): Property[] {
  return [...properties]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
}
