
import { Property } from './data';

// Helper function to generate unique IDs
function generateId(prefix: string, index: number): string {
  return `${prefix}-${index + 1}`;
}

// Generate the current date minus a random number of days (for createdAt)
function randomDate(daysBack = 90): string {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * daysBack));
  return date.toISOString();
}

// Properties for Sale (20 properties in different locations)
export const propertiesForSale: Property[] = [
  {
    id: "sale-1",
    title: "Luxury 4 BHK Apartment in Pali Hill",
    description: "Experience Mumbai's finest living in this spacious 4 BHK apartment with premium finishes, sea views, and resort-style amenities. This luxury residence features an elegant living area, a state-of-the-art kitchen, and four well-appointed bedrooms.",
    price: 120000000,
    location: {
      address: "501 Heritage Heights, Pali Hill",
      city: "Mumbai",
      state: "Maharashtra",
      zip: "400050",
      country: "India",
      lat: 19.0607,
      lng: 72.8297
    },
    features: {
      bedrooms: 4,
      bathrooms: 4.5,
      area: 3200,
      yearBuilt: 2021,
      propertyType: "apartment",
      status: "for-sale",
      floorPlan: "https://images.unsplash.com/photo-1604014438576-9e97f3c26a25?q=80&w=870"
    },
    amenities: ["Swimming Pool", "Gym", "Garden", "24/7 Security", "Private Terrace", "Parking", "Club House"],
    images: [
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?q=80&w=992",
      "https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=992",
      "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?q=80&w=992",
      "https://images.unsplash.com/photo-1600121848594-d8644e57abab?q=80&w=992"
    ],
    agent: {
      id: "agent-1",
      name: "Priya Sharma",
      phone: "(022) 2555-1234",
      email: "priya.s@realestate.com",
      image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    featured: true,
    createdAt: randomDate()
  },
  {
    id: "sale-2",
    title: "Sea-facing 3 BHK in Marine Drive",
    description: "Spectacular sea-facing apartment at the heart of Marine Drive with panoramic views of the Arabian Sea. This immaculately maintained residence offers generous living spaces, modern amenities, and a prime location.",
    price: 98000000,
    location: {
      address: "23 Queens Necklace, Marine Drive",
      city: "Mumbai",
      state: "Maharashtra",
      zip: "400020",
      country: "India",
      lat: 18.9442,
      lng: 72.8233
    },
    features: {
      bedrooms: 3,
      bathrooms: 3,
      area: 2100,
      yearBuilt: 2018,
      propertyType: "apartment",
      status: "for-sale",
      floorPlan: "https://images.unsplash.com/photo-1604014438487-b2c27bdc5d51?q=80&w=870"
    },
    amenities: ["Sea View", "Central AC", "Gym", "Concierge", "Covered Parking", "High Security"],
    images: [
      "https://images.unsplash.com/photo-1599809275671-b5942cabc7a2?q=80&w=992",
      "https://images.unsplash.com/photo-1600210492493-0946911123ea?q=80&w=992",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=992",
      "https://images.unsplash.com/photo-1552242718-c5360894aecd?q=80&w=992"
    ],
    agent: {
      id: "agent-3",
      name: "Anjali Desai",
      phone: "(022) 2555-9012",
      email: "anjali.d@realestate.com",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    featured: true,
    createdAt: randomDate()
  },
  {
    id: "sale-3",
    title: "5 BHK Duplex Penthouse in Malabar Hill",
    description: "Exclusive duplex penthouse with stunning city and sea views. This exceptional residence features double-height ceilings, a private pool, and premium finishes throughout. A perfect blend of luxury, privacy, and sophistication.",
    price: 250000000,
    location: {
      address: "Sky Villa, Ridge Road, Malabar Hill",
      city: "Mumbai",
      state: "Maharashtra",
      zip: "400006",
      country: "India",
      lat: 18.9548,
      lng: 72.7985
    },
    features: {
      bedrooms: 5,
      bathrooms: 6,
      area: 6500,
      yearBuilt: 2022,
      propertyType: "penthouse",
      status: "for-sale",
      floorPlan: "https://images.unsplash.com/photo-1604014307827-76ae479d65e1?q=80&w=870"
    },
    amenities: ["Private Pool", "Terrace Garden", "Home Theater", "Wine Cellar", "Smart Home", "Staff Quarters", "Elevator"],
    images: [
      "https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?q=80&w=992",
      "https://images.unsplash.com/photo-1617104678098-de229db51175?q=80&w=992",
      "https://images.unsplash.com/photo-1617104666298-60a2d6bf3f22?q=80&w=992",
      "https://images.unsplash.com/photo-1606744837616-7595180d0ae5?q=80&w=992"
    ],
    agent: {
      id: "agent-2",
      name: "Vikram Malhotra",
      phone: "(022) 2555-5678",
      email: "vikram.m@realestate.com",
      image: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    featured: true,
    createdAt: randomDate()
  },
  {
    id: "sale-4",
    title: "4 BHK Independent Villa in Juhu",
    description: "Magnificent villa in Juhu's most sought-after enclave. This meticulously designed property features lush gardens, contemporary interiors, and proximity to Juhu Beach. Perfect for families seeking luxury and convenience.",
    price: 180000000,
    location: {
      address: "42 Silver Sands, Juhu Tara Road",
      city: "Mumbai",
      state: "Maharashtra",
      zip: "400049",
      country: "India",
      lat: 19.0883,
      lng: 72.8264
    },
    features: {
      bedrooms: 4,
      bathrooms: 4.5,
      area: 4800,
      yearBuilt: 2019,
      propertyType: "villa",
      status: "for-sale",
      floorPlan: "https://images.unsplash.com/photo-1604014438396-3273645c64f7?q=80&w=870"
    },
    amenities: ["Private Garden", "Swimming Pool", "Outdoor Kitchen", "BBQ Area", "Garage", "CCTV Security"],
    images: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=992",
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=992",
      "https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4?q=80&w=992",
      "https://images.unsplash.com/photo-1615880484746-a134be9a6ecf?q=80&w=992"
    ],
    agent: {
      id: "agent-1",
      name: "Priya Sharma",
      phone: "(022) 2555-1234",
      email: "priya.s@realestate.com",
      image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    featured: false,
    createdAt: randomDate()
  },
  {
    id: "sale-5",
    title: "3 BHK Modern Apartment in Powai",
    description: "Contemporary living space in Powai's premium residential complex. This well-appointed apartment offers lake views, modern amenities, and proximity to tech parks and shopping centers.",
    price: 42000000,
    location: {
      address: "C-1204, Lakeshore Heights, Powai",
      city: "Mumbai",
      state: "Maharashtra",
      zip: "400076",
      country: "India",
      lat: 19.1207,
      lng: 72.9073
    },
    features: {
      bedrooms: 3,
      bathrooms: 3,
      area: 1850,
      yearBuilt: 2020,
      propertyType: "apartment",
      status: "for-sale",
      floorPlan: "https://images.unsplash.com/photo-1604014237800-1c9102c219da?q=80&w=870"
    },
    amenities: ["Lake View", "Clubhouse", "Swimming Pool", "Gym", "Children's Play Area", "Indoor Games"],
    images: [
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=992",
      "https://images.unsplash.com/photo-1600121848594-d8644e57abab?q=80&w=992",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=992",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=992"
    ],
    agent: {
      id: "agent-3",
      name: "Anjali Desai",
      phone: "(022) 2555-9012",
      email: "anjali.d@realestate.com",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    featured: false,
    createdAt: randomDate()
  },
  {
    id: "sale-6",
    title: "4 BHK High-End Apartment in Lower Parel",
    description: "Exclusive residence in one of Mumbai's premium high-rises. This sophisticated apartment offers panoramic city views, world-class amenities, and easy access to business districts and entertainment hubs.",
    price: 85000000,
    location: {
      address: "Tower A, World Towers, Lower Parel",
      city: "Mumbai",
      state: "Maharashtra",
      zip: "400013",
      country: "India",
      lat: 18.9977,
      lng: 72.8376
    },
    features: {
      bedrooms: 4,
      bathrooms: 4.5,
      area: 2800,
      yearBuilt: 2021,
      propertyType: "apartment",
      status: "for-sale",
      floorPlan: "https://images.unsplash.com/photo-1604014307827-76ae479d65e1?q=80&w=870"
    },
    amenities: ["Sky Lounge", "Infinity Pool", "Spa", "Concierge", "Private Theater", "Wine Cellar"],
    images: [
      "https://images.unsplash.com/photo-1600021233544-90c871ac1eed?q=80&w=992",
      "https://images.unsplash.com/photo-1600566753151-384129cf4e3e?q=80&w=992",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=992",
      "https://images.unsplash.com/photo-1600047509358-9dc75507daeb?q=80&w=992"
    ],
    agent: {
      id: "agent-2",
      name: "Vikram Malhotra",
      phone: "(022) 2555-5678",
      email: "vikram.m@realestate.com",
      image: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    featured: true,
    createdAt: randomDate()
  },
  {
    id: "sale-7",
    title: "3 BHK Premium Flat in Andheri West",
    description: "Modern apartment with excellent connectivity in a vibrant neighborhood. This thoughtfully designed residence offers comfortable living spaces, quality finishes, and a host of lifestyle amenities.",
    price: 37500000,
    location: {
      address: "B-1503, Oberoi Springs, Andheri West",
      city: "Mumbai",
      state: "Maharashtra",
      zip: "400053",
      country: "India",
      lat: 19.1351,
      lng: 72.8146
    },
    features: {
      bedrooms: 3,
      bathrooms: 3,
      area: 1650,
      yearBuilt: 2018,
      propertyType: "apartment",
      status: "for-sale",
      floorPlan: "https://images.unsplash.com/photo-1604014438487-b2c27bdc5d51?q=80&w=870"
    },
    amenities: ["Swimming Pool", "Gym", "Landscaped Gardens", "Children's Play Area", "Party Hall", "Indoor Games"],
    images: [
      "https://images.unsplash.com/photo-1600563438938-a9a27215c612?q=80&w=992",
      "https://images.unsplash.com/photo-1600210491369-e753d80a41f3?q=80&w=992",
      "https://images.unsplash.com/photo-1600607687644-c7171b47104e?q=80&w=992",
      "https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?q=80&w=992"
    ],
    agent: {
      id: "agent-1",
      name: "Priya Sharma",
      phone: "(022) 2555-1234",
      email: "priya.s@realestate.com",
      image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    featured: false,
    createdAt: randomDate()
  },
  {
    id: "sale-8",
    title: "2 BHK Cozy Apartment in Dadar",
    description: "Well-maintained apartment in a prime residential area with excellent connectivity. This cozy home features functional layouts, good natural light, and proximity to markets and cultural landmarks.",
    price: 28500000,
    location: {
      address: "405, Shivaji Park View, Dadar West",
      city: "Mumbai",
      state: "Maharashtra",
      zip: "400028",
      country: "India",
      lat: 19.0218,
      lng: 72.8421
    },
    features: {
      bedrooms: 2,
      bathrooms: 2,
      area: 950,
      yearBuilt: 2015,
      propertyType: "apartment",
      status: "for-sale",
      floorPlan: "https://images.unsplash.com/photo-1604014438576-9e97f3c26a25?q=80&w=870"
    },
    amenities: ["24/7 Security", "Visitor Parking", "Power Backup", "Elevator", "CCTV Surveillance"],
    images: [
      "https://images.unsplash.com/photo-1600566752355-35792bedcfea?q=80&w=992",
      "https://images.unsplash.com/photo-1600566752734-32897d2e4d0f?q=80&w=992",
      "https://images.unsplash.com/photo-1600566753104-685f4f24cb4d?q=80&w=992",
      "https://images.unsplash.com/photo-1600585153490-76fb20a32601?q=80&w=992"
    ],
    agent: {
      id: "agent-3",
      name: "Anjali Desai",
      phone: "(022) 2555-9012",
      email: "anjali.d@realestate.com",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    featured: false,
    createdAt: randomDate()
  },
  {
    id: "sale-9",
    title: "4 BHK Luxury Penthouse in BKC",
    description: "Exceptional penthouse in Mumbai's premier business district. This magnificent residence offers spacious interiors, premium finishes, and wraparound terraces with city views. A statement of success and taste.",
    price: 195000000,
    location: {
      address: "Penthouse, The Capital, Bandra Kurla Complex",
      city: "Mumbai",
      state: "Maharashtra",
      zip: "400051",
      country: "India",
      lat: 19.0670,
      lng: 72.8667
    },
    features: {
      bedrooms: 4,
      bathrooms: 5,
      area: 5200,
      yearBuilt: 2023,
      propertyType: "penthouse",
      status: "for-sale",
      floorPlan: "https://images.unsplash.com/photo-1604014307827-76ae479d65e1?q=80&w=870"
    },
    amenities: ["Private Pool", "Sky Deck", "Home Automation", "Private Elevator", "Designer Kitchen", "Wine Room"],
    images: [
      "https://images.unsplash.com/photo-1610631687886-d108d5609020?q=80&w=992",
      "https://images.unsplash.com/photo-1613978461062-d05de55afe62?q=80&w=992",
      "https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4?q=80&w=992",
      "https://images.unsplash.com/photo-1613977257593-dd1107ea0fda?q=80&w=992"
    ],
    agent: {
      id: "agent-2",
      name: "Vikram Malhotra",
      phone: "(022) 2555-5678",
      email: "vikram.m@realestate.com",
      image: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    featured: true,
    createdAt: randomDate()
  },
  {
    id: "sale-10",
    title: "3 BHK Apartment with Sea View in Worli",
    description: "Elegant apartment with breathtaking sea views in a premium high-rise. This stylish residence combines modern design with comfort and features panoramic vistas of the Arabian Sea and Bandra-Worli Sea Link.",
    price: 72000000,
    location: {
      address: "31st Floor, Ahuja Towers, Worli",
      city: "Mumbai",
      state: "Maharashtra",
      zip: "400018",
      country: "India",
      lat: 19.0103,
      lng: 72.8148
    },
    features: {
      bedrooms: 3,
      bathrooms: 3.5,
      area: 2200,
      yearBuilt: 2020,
      propertyType: "apartment",
      status: "for-sale",
      floorPlan: "https://images.unsplash.com/photo-1604014307827-76ae479d65e1?q=80&w=870"
    },
    amenities: ["Sea View", "Infinity Pool", "Spa", "Fitness Center", "Valet Parking", "Business Center"],
    images: [
      "https://images.unsplash.com/photo-1600607687120-9e4981851011?q=80&w=992",
      "https://images.unsplash.com/photo-1600566752229-250ed79470f8?q=80&w=992",
      "https://images.unsplash.com/photo-1600566752497-66d565ad38d3?q=80&w=992",
      "https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=992"
    ],
    agent: {
      id: "agent-1",
      name: "Priya Sharma",
      phone: "(022) 2555-1234",
      email: "priya.s@realestate.com",
      image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    featured: true,
    createdAt: randomDate()
  },
  {
    id: "sale-11",
    title: "2 BHK Apartment in Chembur",
    description: "Well-designed apartment in a family-friendly neighborhood. This thoughtfully planned residence offers functional layouts, quality finishes, and excellent amenities for comfortable urban living.",
    price: 23500000,
    location: {
      address: "A-702, Diamond Garden, Chembur",
      city: "Mumbai",
      state: "Maharashtra",
      zip: "400071",
      country: "India",
      lat: 19.0529,
      lng: 72.9005
    },
    features: {
      bedrooms: 2,
      bathrooms: 2,
      area: 1050,
      yearBuilt: 2019,
      propertyType: "apartment",
      status: "for-sale",
      floorPlan: "https://images.unsplash.com/photo-1604014438487-b2c27bdc5d51?q=80&w=870"
    },
    amenities: ["Garden View", "Children's Play Area", "Community Hall", "Gym", "Security"],
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=992",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=992",
      "https://images.unsplash.com/photo-1600121848594-d8644e57abab?q=80&w=992",
      "https://images.unsplash.com/photo-1600494603989-9650cf6ddd3d?q=80&w=992"
    ],
    agent: {
      id: "agent-3",
      name: "Anjali Desai",
      phone: "(022) 2555-9012",
      email: "anjali.d@realestate.com",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    featured: false,
    createdAt: randomDate()
  },
  {
    id: "sale-12",
    title: "3 BHK Villa in Thane West",
    description: "Spacious villa in a gated community with lush surroundings. This beautiful home features open layouts, quality construction, and excellent amenities for family living away from the city hustle.",
    price: 65000000,
    location: {
      address: "Villa 27, Royal Palms, Ghodbunder Road",
      city: "Thane",
      state: "Maharashtra",
      zip: "400610",
      country: "India",
      lat: 19.2369,
      lng: 72.9755
    },
    features: {
      bedrooms: 3,
      bathrooms: 3.5,
      area: 2800,
      yearBuilt: 2020,
      propertyType: "villa",
      status: "for-sale",
      floorPlan: "https://images.unsplash.com/photo-1604014238312-ccb88904fa86?q=80&w=870"
    },
    amenities: ["Private Garden", "Community Pool", "Clubhouse", "Tennis Court", "Nature Trails", "Security"],
    images: [
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=992",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=992",
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3d7?q=80&w=992",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=992"
    ],
    agent: {
      id: "agent-2",
      name: "Vikram Malhotra",
      phone: "(022) 2555-5678",
      email: "vikram.m@realestate.com",
      image: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    featured: false,
    createdAt: randomDate()
  },
  {
    id: "sale-13",
    title: "4 BHK Waterfront Bungalow in Madh Island",
    description: "Exclusive waterfront property with private beach access. This spectacular bungalow offers tranquil living with luxury amenities, lush gardens, and breathtaking views of the Arabian Sea.",
    price: 145000000,
    location: {
      address: "Beach House, Madh Island Road",
      city: "Mumbai",
      state: "Maharashtra",
      zip: "400061",
      country: "India",
      lat: 19.1440,
      lng: 72.7967
    },
    features: {
      bedrooms: 4,
      bathrooms: 5,
      area: 5800,
      yearBuilt: 2018,
      propertyType: "house",
      status: "for-sale",
      floorPlan: "https://images.unsplash.com/photo-1604014307827-76ae479d65e1?q=80&w=870"
    },
    amenities: ["Private Beach Access", "Swimming Pool", "Boat Dock", "Garden", "Outdoor Kitchen", "Guest House"],
    images: [
      "https://images.unsplash.com/photo-1523217582562-09d0def993a6?q=80&w=992",
      "https://images.unsplash.com/photo-1616137422495-1e9e46e2aa77?q=80&w=992",
      "https://images.unsplash.com/photo-1613553474179-e1eda3ea5734?q=80&w=992",
      "https://images.unsplash.com/photo-1613553507747-5f8d62ad5904?q=80&w=992"
    ],
    agent: {
      id: "agent-1",
      name: "Priya Sharma",
      phone: "(022) 2555-1234",
      email: "priya.s@realestate.com",
      image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    featured: true,
    createdAt: randomDate()
  },
  {
    id: "sale-14",
    title: "2 BHK Modern Apartment in Kharghar",
    description: "Contemporary apartment in a rapidly developing area with excellent infrastructure. This well-designed home offers comfortable living spaces, modern amenities, and easy access to transportation hubs.",
    price: 18500000,
    location: {
      address: "B-1206, Seawoods Residences, Sector 42",
      city: "Navi Mumbai",
      state: "Maharashtra",
      zip: "410210",
      country: "India",
      lat: 19.0278,
      lng: 73.0494
    },
    features: {
      bedrooms: 2,
      bathrooms: 2,
      area: 1100,
      yearBuilt: 2021,
      propertyType: "apartment",
      status: "for-sale",
      floorPlan: "https://images.unsplash.com/photo-1604014438487-b2c27bdc5d51?q=80&w=870"
    },
    amenities: ["Swimming Pool", "Gym", "Landscaped Gardens", "Jogging Track", "Indoor Games"],
    images: [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=992",
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=992",
      "https://images.unsplash.com/photo-1600607687644-c7171b47104e?q=80&w=992",
      "https://images.unsplash.com/photo-1600607687370-9b3a8fe5968d?q=80&w=992"
    ],
    agent: {
      id: "agent-3",
      name: "Anjali Desai",
      phone: "(022) 2555-9012",
      email: "anjali.d@realestate.com",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    featured: false,
    createdAt: randomDate()
  },
  {
    id: "sale-15",
    title: "3 BHK Garden Apartment in Khar",
    description: "Elegant ground floor apartment with a private garden in an upscale neighborhood. This distinctive residence combines indoor and outdoor living with premium finishes and top-quality amenities.",
    price: 85000000,
    location: {
      address: "Garden Villa, 15th Road, Khar West",
      city: "Mumbai",
      state: "Maharashtra",
      zip: "400052",
      country: "India",
      lat: 19.0748,
      lng: 72.8302
    },
    features: {
      bedrooms: 3,
      bathrooms: 3.5,
      area: 2400,
      yearBuilt: 2019,
      propertyType: "apartment",
      status: "for-sale",
      floorPlan: "https://images.unsplash.com/photo-1604014238170-4d5087336049?q=80&w=870"
    },
    amenities: ["Private Garden", "Jacuzzi", "Home Office", "Designer Kitchen", "Security System"],
    images: [
      "https://images.unsplash.com/photo-1600210491369-e753d80a41f3?q=80&w=992",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=992",
      "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?q=80&w=992",
      "https://images.unsplash.com/photo-1598928636135-d146dcd62409?q=80&w=992"
    ],
    agent: {
      id: "agent-2",
      name: "Vikram Malhotra",
      phone: "(022) 2555-5678",
      email: "vikram.m@realestate.com",
      image: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    featured: false,
    createdAt: randomDate()
  },
  {
    id: "sale-16",
    title: "5 BHK Sea-facing Bungalow in Versova",
    description: "Spectacular beachfront property with unobstructed sea views. This magnificent bungalow offers luxury living with private gardens, open terraces, and direct access to Versova Beach.",
    price: 220000000,
    location: {
      address: "Seaside Manor, Versova Beach Road",
      city: "Mumbai",
      state: "Maharashtra",
      zip: "400061",
      country: "India",
      lat: 19.1354,
      lng: 72.8154
    },
    features: {
      bedrooms: 5,
      bathrooms: 6,
      area: 7200,
      yearBuilt: 2017,
      propertyType: "house",
      status: "for-sale",
      floorPlan: "https://images.unsplash.com/photo-1604014237800-1c9102c219da?q=80&w=870"
    },
    amenities: ["Private Beach Access", "Infinity Pool", "Home Theater", "Wine Cellar", "Staff Quarters", "Garage"],
    images: [
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=992",
      "https://images.unsplash.com/photo-1628744448840-6e53344ce801?q=80&w=992",
      "https://images.unsplash.com/photo-1416331108676-a22ccb276e35?q=80&w=992",
      "https://images.unsplash.com/photo-1600585153490-76fb20a32601?q=80&w=992"
    ],
    agent: {
      id: "agent-1",
      name: "Priya Sharma",
      phone: "(022) 2555-1234",
      email: "priya.s@realestate.com",
      image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    featured: true,
    createdAt: randomDate()
  },
  {
    id: "sale-17",
    title: "4 BHK Ultra-Luxury Apartment in Tardeo",
    description: "Prestigious apartment in one of Mumbai's most exclusive high-rises. This opulent residence features designer interiors, premium finishes, and spectacular views of the city skyline and Arabian Sea.",
    price: 190000000,
    location: {
      address: "Sky Villa, Imperial Towers, Tardeo",
      city: "Mumbai",
      state: "Maharashtra",
      zip: "400034",
      country: "India",
      lat: 18.9711,
      lng: 72.8122
    },
    features: {
      bedrooms: 4,
      bathrooms: 5,
      area: 4800,
      yearBuilt: 2022,
      propertyType: "apartment",
      status: "for-sale",
      floorPlan: "https://images.unsplash.com/photo-1604014307827-76ae479d65e1?q=80&w=870"
    },
    amenities: ["Panoramic Views", "Private Elevator", "Smart Home", "Spa", "Concierge Services", "Helipad Access"],
    images: [
      "https://images.unsplash.com/photo-1600210491369-e753d80a41f3?q=80&w=992",
      "https://images.unsplash.com/photo-1615529179035-e760f6a2dcee?q=80&w=992",
      "https://images.unsplash.com/photo-1615529182904-14819c35db37?q=80&w=992",
      "https://images.unsplash.com/photo-1615529182950-83c377bafc27?q=80&w=992"
    ],
    agent: {
      id: "agent-2",
      name: "Vikram Malhotra",
      phone: "(022) 2555-5678",
      email: "vikram.m@realestate.com",
      image: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    featured: true,
    createdAt: randomDate()
  },
  {
    id: "sale-18",
    title: "3 BHK Premium Apartment in Goregaon East",
    description: "Elegant apartment in a well-planned residential complex with excellent connectivity. This family-friendly home offers spacious interiors, quality amenities, and proximity to business hubs and entertainment centers.",
    price: 32000000,
    location: {
      address: "D-1503, Oberoi Splendor, JVLR",
      city: "Mumbai",
      state: "Maharashtra",
      zip: "400063",
      country: "India",
      lat: 19.1352,
      lng: 72.8693
    },
    features: {
      bedrooms: 3,
      bathrooms: 3,
      area: 1750,
      yearBuilt: 2018,
      propertyType: "apartment",
      status: "for-sale",
      floorPlan: "https://images.unsplash.com/photo-1604014438487-b2c27bdc5d51?q=80&w=870"
    },
    amenities: ["Swimming Pool", "Tennis Court", "Jogging Track", "Landscaped Gardens", "Clubhouse"],
    images: [
      "https://images.unsplash.com/photo-1600210491369-e753d80a41f3?q=80&w=992",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=992",
      "https://images.unsplash.com/photo-1594484208280-efa00f96fc21?q=80&w=992",
      "https://images.unsplash.com/photo-1560448204-61dc36dc98c8?q=80&w=992"
    ],
    agent: {
      id: "agent-3",
      name: "Anjali Desai",
      phone: "(022) 2555-9012",
      email: "anjali.d@realestate.com",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    featured: false,
    createdAt: randomDate()
  },
  {
    id: "sale-19",
    title: "2 BHK Apartment in Malad West",
    description: "Well-designed apartment in a vibrant neighborhood with excellent connectivity. This thoughtfully planned residence offers functional layouts, quality finishes, and family-friendly amenities.",
    price: 19800000,
    location: {
      address: "A-807, Evershine Greens, Malad West",
      city: "Mumbai",
      state: "Maharashtra",
      zip: "400064",
      country: "India",
      lat: 19.1846,
      lng: 72.8404
    },
    features: {
      bedrooms: 2,
      bathrooms: 2,
      area: 1050,
      yearBuilt: 2019,
      propertyType: "apartment",
      status: "for-sale",
      floorPlan: "https://images.unsplash.com/photo-1604014237800-1c9102c219da?q=80&w=870"
    },
    amenities: ["Swimming Pool", "Gym", "Children's Play Area", "Garden", "24/7 Security"],
    images: [
      "https://images.unsplash.com/photo-1600607687165-46c1dea77e34?q=80&w=992",
      "https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=992",
      "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?q=80&w=992",
      "https://images.unsplash.com/photo-1550581190-9c1c48d21d6c?q=80&w=992"
    ],
    agent: {
      id: "agent-1",
      name: "Priya Sharma",
      phone: "(022) 2555-1234",
      email: "priya.s@realestate.com",
      image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    featured: false,
    createdAt: randomDate()
  },
  {
    id: "sale-20",
    title: "3 BHK Luxury Flat in Belapur CBD",
    description: "Premium apartment in Navi Mumbai's prime business district. This elegant residence offers spacious interiors, quality finishes, and excellent amenities in a well-connected neighborhood.",
    price: 28500000,
    location: {
      address: "C-1208, Seawoods Estate, Belapur CBD",
      city: "Navi Mumbai",
      state: "Maharashtra",
      zip: "400614",
      country: "India",
      lat: 19.0209,
      lng: 73.0395
    },
    features: {
      bedrooms: 3,
      bathrooms: 3,
      area: 1650,
      yearBuilt: 2020,
      propertyType: "apartment",
      status: "for-sale",
      floorPlan: "https://images.unsplash.com/photo-1604014237800-1c9102c219da?q=80&w=870"
    },
    amenities: ["Swimming Pool", "Gym", "Clubhouse", "Landscaped Gardens", "Children's Play Area", "Security"],
    images: [
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=992",
      "https://images.unsplash.com/photo-1598928636135-d146dcd62409?q=80&w=992",
      "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?q=80&w=992",
      "https://images.unsplash.com/photo-1600566753104-685f4f24cb4d?q=80&w=992"
    ],
    agent: {
      id: "agent-3",
      name: "Anjali Desai",
      phone: "(022) 2555-9012",
      email: "anjali.d@realestate.com",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    featured: false,
    createdAt: randomDate()
  }
];

// Properties for Rent (20 properties in different locations)
export const propertiesForRent: Property[] = [
  {
    id: "rent-1",
    title: "3 BHK Furnished Apartment in Bandra West",
    description: "Luxurious fully furnished apartment in Mumbai's most desirable neighborhood. This stylish residence features contemporary designs, premium finishes, and is walking distance from the sea and upscale restaurants.",
    price: 150000, // Monthly rent
    location: {
      address: "501 Sea Breeze, Carter Road",
      city: "Mumbai",
      state: "Maharashtra",
      zip: "400050",
      country: "India",
      lat: 19.0532,
      lng: 72.8284
    },
    features: {
      bedrooms: 3,
      bathrooms: 3,
      area: 1800,
      yearBuilt: 2018,
      propertyType: "apartment",
      status: "for-rent",
      floorPlan: "https://images.unsplash.com/photo-1604014438576-9e97f3c26a25?q=80&w=870"
    },
    amenities: ["Fully Furnished", "Sea View", "Gym", "Swimming Pool", "24/7 Security", "Power Backup"],
    images: [
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=992",
      "https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?q=80&w=992",
      "https://images.unsplash.com/photo-1589834390005-5d4fb9bf3d32?q=80&w=992",
      "https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?q=80&w=992"
    ],
    agent: {
      id: "agent-1",
      name: "Priya Sharma",
      phone: "(022) 2555-1234",
      email: "priya.s@realestate.com",
      image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    featured: true,
    createdAt: randomDate()
  },
  {
    id: "rent-2",
    title: "2 BHK Apartment with City View in Lower Parel",
    description: "Modern apartment in a premium high-rise with spectacular city views. This well-maintained residence offers convenient access to business districts, shopping centers, and entertainment venues.",
    price: 85000, // Monthly rent
    location: {
      address: "1204 Ashok Towers, Lower Parel",
      city: "Mumbai",
      state: "Maharashtra",
      zip: "400013",
      country: "India",
      lat: 18.9983,
      lng: 72.8338
    },
    features: {
      bedrooms: 2,
      bathrooms: 2,
      area: 1200,
      yearBuilt: 2017,
      propertyType: "apartment",
      status: "for-rent",
      floorPlan: "https://images.unsplash.com/photo-1604014438487-b2c27bdc5d51?q=80&w=870"
    },
    amenities: ["City View", "Swimming Pool", "Gym", "Clubhouse", "Security", "Parking"],
    images: [
      "https://images.unsplash.com/photo-1616137422495-1e9e46e2aa77?q=80&w=992",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=992",
      "https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4?q=80&w=992",
      "https://images.unsplash.com/photo-1589834390005-5d4fb9bf3d32?q=80&w=992"
    ],
    agent: {
      id: "agent-2",
      name: "Vikram Malhotra",
      phone: "(022) 2555-5678",
      email: "vikram.m@realestate.com",
      image: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    featured: true,
    createdAt: randomDate()
  },
  {
    id: "rent-3",
    title: "4 BHK Premium Villa in Juhu",
    description: "Elegant villa in a prestigious neighborhood close to Juhu Beach. This exquisite property features spacious living areas, premium finishes, lush gardens, and proximity to upscale amenities.",
    price: 300000, // Monthly rent
    location: {
      address: "Villa 15, Juhu Vile Parle Scheme",
      city: "Mumbai",
      state: "Maharashtra",
      zip: "400049",
      country: "India",
      lat: 19.0890,
      lng: 72.8294
    },
    features: {
      bedrooms: 4,
      bathrooms: 4.5,
      area: 4000,
      yearBuilt: 2016,
      propertyType: "villa",
      status: "for-rent",
      floorPlan: "https://images.unsplash.com/photo-1604014438396-3273645c64f7?q=80&w=870"
    },
    amenities: ["Private Garden", "Swimming Pool", "Jacuzzi", "Home Theater", "Staff Quarters", "Security"],
    images: [
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?q=80&w=992",
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=992",
      "https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4?q=80&w=992",
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=992"
    ],
    agent: {
      id: "agent-3",
      name: "Anjali Desai",
      phone: "(022) 2555-9012",
      email: "anjali.d@realestate.com",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    featured: true,
    createdAt: randomDate()
  },
  {
    id: "rent-4",
    title: "2 BHK Apartment in Andheri East",
    description: "Well-maintained apartment with excellent connectivity in a vibrant neighborhood. This thoughtfully designed residence offers comfortable living spaces and proximity to business districts and entertainment centers.",
    price: 55000, // Monthly rent
    location: {
      address: "B-604, Oberoi Splendor, Jogeshwari-Vikhroli Link Road",
      city: "Mumbai",
      state: "Maharashtra",
      zip: "400060",
      country: "India",
      lat: 19.1179,
      lng: 72.8631
    },
    features: {
      bedrooms: 2,
      bathrooms: 2,
      area: 1100,
      yearBuilt: 2015,
      propertyType: "apartment",
      status: "for-rent",
      floorPlan: "https://images.unsplash.com/photo-1604014237800-1c9102c219da?q=80&w=870"
    },
    amenities: ["Swimming Pool", "Gym", "Clubhouse", "Children's Play Area", "Security"],
    images: [
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=992",
      "https://images.unsplash.com/photo-1600607687644-c7171b47104e?q=80&w=992",
      "https://images.unsplash.com/photo-1600607687120-9e4981851011?q=80&w=992",
      "https://images.unsplash.com/photo-1600607687165-46c1dea77e34?q=80&w=992"
    ],
    agent: {
      id: "agent-1",
      name: "Priya Sharma",
      phone: "(022) 2555-1234",
      email: "priya.s@realestate.com",
      image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    featured: false,
    createdAt: randomDate()
  },
  {
    id: "rent-5",
    title: "3 BHK Seafacing Apartment in Worli",
    description: "Luxurious apartment with breathtaking sea views in a premium high-rise. This elegant residence offers panoramic vistas, contemporary interiors, and world-class amenities.",
    price: 175000, // Monthly rent
    location: {
      address: "2701 Omkar 1973, Worli",
      city: "Mumbai",
      state: "Maharashtra",
      zip: "400018",
      country: "India",
      lat: 19.0132,
      lng: 72.8154
    },
    features: {
      bedrooms: 3,
      bathrooms: 3.5,
      area: 2200,
      yearBuilt: 2019,
      propertyType: "apartment",
      status: "for-rent",
      floorPlan: "https://images.unsplash.com/photo-1604014438576-9e97f3c26a25?q=80&w=870"
    },
    amenities: ["Sea View", "Infinity Pool", "Spa", "Concierge", "Private Theater", "Fine Dining"],
    images: [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=992",
      "https://images.unsplash.com/photo-1600607687942-c8f52b2b6f0f?q=80&w=992",
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=992",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=992"
    ],
    agent: {
      id: "agent-2",
      name: "Vikram Malhotra",
      phone: "(022) 2555-5678",
      email: "vikram.m@realestate.com",
      image: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    featured: true,
    createdAt: randomDate()
  },
  {
    id: "rent-6",
    title: "1 BHK Apartment in Powai",
    description: "Cozy apartment near Hiranandani Gardens with lake views. This well-designed residence offers practical layouts, modern amenities, and proximity to tech parks and shopping centers.",
    price: 35000, // Monthly rent
    location: {
      address: "A-505, Lake Homes, Powai",
      city: "Mumbai",
      state: "Maharashtra",
      zip: "400076",
      country: "India",
      lat: 19.1273,
      lng: 72.9048
    },
    features: {
      bedrooms: 1,
      bathrooms: 1,
      area: 650,
      yearBuilt: 2018,
      propertyType: "apartment",
      status: "for-rent",
      floorPlan: "https://images.unsplash.com/photo-1604014438487-b2c27bdc5d51?q=80&w=870"
    },
    amenities: ["Lake View", "Gym", "Swimming Pool", "Security", "Parking"],
    images: [
      "https://images.unsplash.com/photo-1600210492493-0946911123ea?q=80&w=992",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=992",
      "https://images.unsplash.com/photo-1600566752751-78d7bc36c71a?q=80&w=992",
      "https://images.unsplash.com/photo-1600566752734-32897d2e4d0f?q=80&w=992"
    ],
    agent: {
      id: "agent-3",
      name: "Anjali Desai",
      phone: "(022) 2555-9012",
      email: "anjali.d@realestate.com",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    featured: false,
    createdAt: randomDate()
  },
  {
    id: "rent-7",
    title: "4 BHK Duplex Apartment in Dadar",
    description: "Spacious duplex apartment in a prime residential area with excellent connectivity. This family-friendly home features generous living spaces, quality finishes, and proximity to cultural landmarks.",
    price: 120000, // Monthly rent
    location: {
      address: "Matoshree Towers, Dadar West",
      city: "Mumbai",
      state: "Maharashtra",
      zip: "400028",
      country: "India",
      lat: 19.0226,
      lng: 72.8416
    },
    features: {
      bedrooms: 4,
      bathrooms: 4,
      area: 2800,
      yearBuilt: 2017,
      propertyType: "apartment",
      status: "for-rent",
      floorPlan: "https://images.unsplash.com/photo-1604014307827-76ae479d65e1?q=80&w=870"
    },
    amenities: ["Duplex Layout", "Garden View", "Gym", "Party Hall", "Children's Play Area", "Security"],
    images: [
      "https://images.unsplash.com/photo-1600210492493-0946911123ea?q=80&w=992",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=992",
      "https://images.unsplash.com/photo-1589834390005-5d4fb9bf3d32?q=80&w=992",
      "https://images.unsplash.com/photo-1549488344-1f9b8d2bd1f3?q=80&w=992"
    ],
    agent: {
      id: "agent-1",
      name: "Priya Sharma",
      phone: "(022) 2555-1234",
      email: "priya.s@realestate.com",
      image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    featured: false,
    createdAt: randomDate()
  },
  {
    id: "rent-8",
    title: "3 BHK Apartment in Goregaon West",
    description: "Well-designed apartment in a family-friendly neighborhood with excellent amenities. This thoughtfully planned residence offers spacious interiors, quality finishes, and convenient access to transportation hubs.",
    price: 65000, // Monthly rent
    location: {
      address: "D-1204, Sai Heights, SV Road",
      city: "Mumbai",
      state: "Maharashtra",
      zip: "400104",
      country: "India",
      lat: 19.1662,
      lng: 72.8463
    },
    features: {
      bedrooms: 3,
      bathrooms: 3,
      area: 1650,
      yearBuilt: 2016,
      propertyType: "apartment",
      status: "for-rent",
      floorPlan: "https://images.unsplash.com/photo-1604014238312-ccb88904fa86?q=80&w=870"
    },
    amenities: ["Swimming Pool", "Gym", "Garden", "Children's Play Area", "Security"],
    images: [
      "https://images.unsplash.com/photo-1600210491369-e753d80a41f3?q=80&w=992",
      "https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=992",
      "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?q=80&w=992",
      "https://images.unsplash.com/photo-1600566752355-35792bedcfea?q=80&w=992"
    ],
    agent: {
      id: "agent-2",
      name: "Vikram Malhotra",
      phone: "(022) 2555-5678",
      email: "vikram.m@realestate.com",
      image: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    featured: false,
    createdAt: randomDate()
  },
  {
    id: "rent-9",
    title: "2 BHK Sea-View Apartment in Malabar Hill",
    description: "Elegant apartment in a prestigious neighborhood with panoramic sea views. This sophisticated residence offers premium finishes, contemporary design, and access to exclusive amenities.",
    price: 95000, // Monthly rent
    location: {
      address: "904 Sea Palace, Malabar Hill",
      city: "Mumbai",
      state: "Maharashtra",
      zip: "400006",
      country: "India",
      lat: 18.9550,
      lng: 72.7997
    },
    features: {
      bedrooms: 2,
      bathrooms: 2.5,
      area: 1450,
      yearBuilt: 2019,
      propertyType: "apartment",
      status: "for-rent",
      floorPlan: "https://images.unsplash.com/photo-1604014237800-1c9102c219da?q=80&w=870"
    },
    amenities: ["Sea View", "Swimming Pool", "Gym", "Concierge", "Security", "Parking"],
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=992",
      "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?q=80&w=992",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=992",
      "https://images.unsplash.com/photo-1600585153490-76fb20a32601?q=80&w=992"
    ],
    agent: {
      id: "agent-3",
      name: "Anjali Desai",
      phone: "(022) 2555-9012",
      email: "anjali.d@realestate.com",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    featured: true,
    createdAt: randomDate()
  },
  {
    id: "rent-10",
    title: "3 BHK Furnished Apartment in BKC",
    description: "Luxurious fully furnished apartment in Mumbai's premier business district. This upscale residence offers designer interiors, premium amenities, and easy access to corporate offices and entertainment venues.",
    price: 130000, // Monthly rent
    location: {
      address: "A-1706, The Capital, Bandra Kurla Complex",
      city: "Mumbai",
      state: "Maharashtra",
      zip: "400051",
      country: "India",
      lat: 19.0641,
      lng: 72.8697
    },
    features: {
      bedrooms: 3,
      bathrooms: 3.5,
      area: 2100,
      yearBuilt: 2020,
      propertyType: "apartment",
      status: "for-rent",
      floorPlan: "https://images.unsplash.com/photo-1604014438576-9e97f3c26a25?q=80&w=870"
    },
    amenities: ["Fully Furnished", "Smart Home", "Spa", "Infinity Pool", "Concierge", "Business Center"],
    images: [
      "https://images.unsplash.com/photo-1615529182950-83c377bafc27?q=80&w=992",
      "https://images.unsplash.com/photo-1615529182904-14819c35db37?q=80&w=992",
      "https://images.unsplash.com/photo-1615529179035-e760f6a2dcee?q=80&w=992",
      "https://images.unsplash.com/photo-1600210491369-e753d80a41f3?q=80&w=992"
    ],
    agent: {
      id: "agent-1",
      name: "Priya Sharma",
      phone: "(022) 2555-1234",
      email: "priya.s@realestate.com",
      image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    featured: true,
    createdAt: randomDate()
  },
  {
    id: "rent-11",
    title: "2 BHK Apartment in Chembur",
    description: "Well-maintained apartment in a family-friendly neighborhood with excellent amenities. This functional residence offers comfortable living spaces, quality finishes, and convenient access to transportation and markets.",
    price: 42000, // Monthly rent
    location: {
      address: "B-1004, Diamond Garden, Chembur",
      city: "Mumbai",
      state: "Maharashtra",
      zip: "400071",
      country: "India",
      lat: 19.0539,
      lng: 72.9001
    },
    features: {
      bedrooms: 2,
      bathrooms: 2,
      area: 1050,
      yearBuilt: 2017,
      propertyType: "apartment",
      status: "for-rent",
      floorPlan: "https://images.unsplash.com/photo-1604014238170-4d5087336049?q=80&w=870"
    },
    amenities: ["Garden View", "Gym", "Children's Play Area", "Security", "Parking"],
    images: [
      "https://images.unsplash.com/photo-1600121848594-d8644e57abab?q=80&w=992",
      "https://images.unsplash.com/photo-1600607687644-c7171b47104e?q=80&w=992",
      "https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?q=80&w=992",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=992"
    ],
    agent: {
      id: "agent-2",
      name: "Vikram Malhotra",
      phone: "(022) 2555-5678",
      email: "vikram.m@realestate.com",
      image: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    featured: false,
    createdAt: randomDate()
  },
  {
    id: "rent-12",
    title: "3 BHK Villa in Thane",
    description: "Beautiful villa in a gated community with lush surroundings. This spacious residence offers modern amenities, quality finishes, and a tranquil environment away from the city hustle.",
    price: 90000, // Monthly rent
    location: {
      address: "Villa 42, Hiranandani Estate, Ghodbunder Road",
      city: "Thane",
      state: "Maharashtra",
      zip: "400607",
      country: "India",
      lat: 19.2183,
      lng: 72.9845
    },
    features: {
      bedrooms: 3,
      bathrooms: 3.5,
      area: 2600,
      yearBuilt: 2018,
      propertyType: "villa",
      status: "for-rent",
      floorPlan: "https://images.unsplash.com/photo-1604014238312-ccb88904fa86?q=80&w=870"
    },
    amenities: ["Private Garden", "Swimming Pool", "Clubhouse", "Tennis Court", "Security", "Parking"],
    images: [
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=992",
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=992",
      "https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4?q=80&w=992",
      "https://images.unsplash.com/photo-1573532071105-0c3d657a6a9d?q=80&w=992"
    ],
    agent: {
      id: "agent-3",
      name: "Anjali Desai",
      phone: "(022) 2555-9012",
      email: "anjali.d@realestate.com",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    featured: false,
    createdAt: randomDate()
  },
  {
    id: "rent-13",
    title: "2 BHK Apartment in Borivali West",
    description: "Well-maintained apartment in a vibrant neighborhood with excellent connectivity. This comfortable residence offers functional layouts, quality amenities, and proximity to parks and shopping centers.",
    price: 38000, // Monthly rent
    location: {
      address: "C-703, Shree Krishna Complex, L.T. Road",
      city: "Mumbai",
      state: "Maharashtra",
      zip: "400092",
      country: "India",
      lat: 19.2329,
      lng: 72.8570
    },
    features: {
      bedrooms: 2,
      bathrooms: 2,
      area: 950,
      yearBuilt: 2016,
      propertyType: "apartment",
      status: "for-rent",
      floorPlan: "https://images.unsplash.com/photo-1604014438487-b2c27bdc5d51?q=80&w=870"
    },
    amenities: ["Gym", "Children's Play Area", "Garden", "Security", "Parking"],
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=992",
      "https://images.unsplash.com/photo-1600607687165-46c1dea77e34?q=80&w=992",
      "https://images.unsplash.com/photo-1594484208280-efa00f96fc21?q=80&w=992",
      "https://images.unsplash.com/photo-1550581190-9c1c48d21d6c?q=80&w=992"
    ],
    agent: {
      id: "agent-1",
      name: "Priya Sharma",
      phone: "(022) 2555-1234",
      email: "priya.s@realestate.com",
      image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    featured: false,
    createdAt: randomDate()
  },
  {
    id: "rent-14",
    title: "4 BHK Luxury Apartment in Prabhadevi",
    description: "Exquisite residence in a premium high-rise with magnificent sea views. This opulent apartment features designer interiors, premium finishes, and world-class amenities for sophisticated living.",
    price: 200000, // Monthly rent
    location: {
      address: "Sky Villa, Raheja Artesia, Prabhadevi",
      city: "Mumbai",
      state: "Maharashtra",
      zip: "400025",
      country: "India",
      lat: 19.0170,
      lng: 72.8279
    },
    features: {
      bedrooms: 4,
      bathrooms: 4.5,
      area: 3200,
      yearBuilt: 2021,
      propertyType: "apartment",
      status: "for-rent",
      floorPlan: "https://images.unsplash.com/photo-1604014307827-76ae479d65e1?q=80&w=870"
    },
    amenities: ["Sea View", "Private Pool", "Spa", "Gym", "Concierge", "Wine Cellar", "Private Theater"],
    images: [
      "https://images.unsplash.com/photo-1615529182950-83c377bafc27?q=80&w=992",
      "https://images.unsplash.com/photo-1612965607446-25e1332775ae?q=80&w=992",
      "https://images.unsplash.com/photo-1574739782594-db4ead022697?q=80&w=992",
      "https://images.unsplash.com/photo-1613977257593-dd1107ea0fda?q=80&w=992"
    ],
    agent: {
      id: "agent-2",
      name: "Vikram Malhotra",
      phone: "(022) 2555-5678",
      email: "vikram.m@realestate.com",
      image: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    featured: true,
    createdAt: randomDate()
  },
  {
    id: "rent-15",
    title: "2 BHK Apartment in Kharghar",
    description: "Modern apartment in a well-planned neighborhood with excellent amenities. This thoughtfully designed residence offers comfortable living spaces, quality finishes, and convenient access to transportation and shopping.",
    price: 25000, // Monthly rent
    location: {
      address: "A-1204, Paradise Heights, Sector 20",
      city: "Navi Mumbai",
      state: "Maharashtra",
      zip: "410210",
      country: "India",
      lat: 19.0435,
      lng: 73.0610
    },
    features: {
      bedrooms: 2,
      bathrooms: 2,
      area: 1050,
      yearBuilt: 2019,
      propertyType: "apartment",
      status: "for-rent",
      floorPlan: "https://images.unsplash.com/photo-1604014438487-b2c27bdc5d51?q=80&w=870"
    },
    amenities: ["Swimming Pool", "Gym", "Garden", "Children's Play Area", "Security"],
    images: [
      "https://images.unsplash.com/photo-1600607687120-9e4981851011?q=80&w=992",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=992",
      "https://images.unsplash.com/photo-1600607687644-c7171b47104e?q=80&w=992",
      "https://images.unsplash.com/photo-1600607687370-9b3a8fe5968d?q=80&w=992"
    ],
    agent: {
      id: "agent-3",
      name: "Anjali Desai",
      phone: "(022) 2555-9012",
      email: "anjali.d@realestate.com",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    featured: false,
    createdAt: randomDate()
  },
  {
    id: "rent-16",
    title: "3 BHK Apartment in Malad East",
    description: "Spacious apartment in a family-friendly complex with modern amenities. This well-designed residence offers functional layouts, quality finishes, and convenient access to schools and markets.",
    price: 48000, // Monthly rent
    location: {
      address: "D-1505, Evershine Greens, Western Express Highway",
      city: "Mumbai",
      state: "Maharashtra",
      zip: "400097",
      country: "India",
      lat: 19.1798,
      lng: 72.8700
    },
    features: {
      bedrooms: 3,
      bathrooms: 3,
      area: 1550,
      yearBuilt: 2017,
      propertyType: "apartment",
      status: "for-rent",
      floorPlan: "https://images.unsplash.com/photo-1604014237800-1c9102c219da?q=80&w=870"
    },
    amenities: ["Swimming Pool", "Gym", "Garden", "Children's Play Area", "Security"],
    images: [
      "https://images.unsplash.com/photo-1600607687370-9b3a8fe5968d?q=80&w=992",
      "https://images.unsplash.com/photo-1600607687644-c7171b47104e?q=80&w=992",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=992",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=992"
    ],
    agent: {
      id: "agent-1",
      name: "Priya Sharma",
      phone: "(022) 2555-1234",
      email: "priya.s@realestate.com",
      image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    featured: false,
    createdAt: randomDate()
  },
  {
    id: "rent-17",
    title: "4 BHK Penthouse in Versova",
    description: "Spectacular penthouse with sea views and private terrace. This luxurious residence offers premium finishes, expansive living spaces, and proximity to Versova Beach and entertainment venues.",
    price: 180000, // Monthly rent
    location: {
      address: "Penthouse, Sea Breeze Tower, Versova",
      city: "Mumbai",
      state: "Maharashtra",
      zip: "400061",
      country: "India",
      lat: 19.1312,
      lng: 72.8189
    },
    features: {
      bedrooms: 4,
      bathrooms: 4.5,
      area: 3800,
      yearBuilt: 2020,
      propertyType: "penthouse",
      status: "for-rent",
      floorPlan: "https://images.unsplash.com/photo-1604014307827-76ae479d65e1?q=80&w=870"
    },
    amenities: ["Sea View", "Private Terrace", "Infinity Pool", "Home Theater", "Private Elevator", "BBQ Area"],
    images: [
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?q=80&w=992",
      "https://images.unsplash.com/photo-1613553474179-e1eda3ea5734?q=80&w=992",
      "https://images.unsplash.com/photo-1613553507747-5f8d62ad5904?q=80&w=992",
      "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?q=80&w=992"
    ],
    agent: {
      id: "agent-2",
      name: "Vikram Malhotra",
      phone: "(022) 2555-5678",
      email: "vikram.m@realestate.com",
      image: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    featured: true,
    createdAt: randomDate()
  },
  {
    id: "rent-18",
    title: "2 BHK Apartment in Mulund West",
    description: "Well-maintained apartment in a family-friendly neighborhood with excellent amenities. This comfortable residence offers functional layouts, quality finishes, and proximity to parks and markets.",
    price: 40000, // Monthly rent
    location: {
      address: "B-1204, Cypress Gardens, L.B.S. Marg",
      city: "Mumbai",
      state: "Maharashtra",
      zip: "400080",
      country: "India",
      lat: 19.1662,
      lng: 72.9538
    },
    features: {
      bedrooms: 2,
      bathrooms: 2,
      area: 1100,
      yearBuilt: 2018,
      propertyType: "apartment",
      status: "for-rent",
      floorPlan: "https://images.unsplash.com/photo-1604014238170-4d5087336049?q=80&w=870"
    },
    amenities: ["Swimming Pool", "Gym", "Garden", "Children's Play Area", "Security"],
    images: [
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=992",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=992",
      "https://images.unsplash.com/photo-1600607687165-46c1dea77e34?q=80&w=992",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=992"
    ],
    agent: {
      id: "agent-3",
      name: "Anjali Desai",
      phone: "(022) 2555-9012",
      email: "anjali.d@realestate.com",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    featured: false,
    createdAt: randomDate()
  },
  {
    id: "rent-19",
    title: "3 BHK Apartment in Nerul",
    description: "Spacious apartment in a well-planned neighborhood with excellent connectivity. This thoughtfully designed residence offers comfortable living spaces, quality finishes, and proximity to schools and shopping centers.",
    price: 45000, // Monthly rent
    location: {
      address: "C-1605, Palm Beach Residency, Sector 4",
      city: "Navi Mumbai",
      state: "Maharashtra",
      zip: "400706",
      country: "India",
      lat: 19.0336,
      lng: 73.0193
    },
    features: {
      bedrooms: 3,
      bathrooms: 3,
      area: 1600,
      yearBuilt: 2019,
      propertyType: "apartment",
      status: "for-rent",
      floorPlan: "https://images.unsplash.com/photo-1604014438487-b2c27bdc5d51?q=80&w=870"
    },
    amenities: ["Swimming Pool", "Gym", "Garden", "Children's Play Area", "Security"],
    images: [
      "https://images.unsplash.com/photo-1600607687644-c7171b47104e?q=80&w=992",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=992",
      "https://images.unsplash.com/photo-1600607687920-9e4981851011?q=80&w=992",
      "https://images.unsplash.com/photo-1598928636135-d146dcd62409?q=80&w=992"
    ],
    agent: {
      id: "agent-1",
      name: "Priya Sharma",
      phone: "(022) 2555-1234",
      email: "priya.s@realestate.com",
      image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    featured: false,
    createdAt: randomDate()
  },
  {
    id: "rent-20",
    title: "5 BHK Luxury Bungalow in Madh Island",
    description: "Spectacular beachfront property with private access to the sea. This magnificent bungalow offers luxurious living spaces, premium finishes, lush gardens, and breathtaking views of the Arabian Sea.",
    price: 350000, // Monthly rent
    location: {
      address: "The Beach House, Madh Island Road",
      city: "Mumbai",
      state: "Maharashtra",
      zip: "400061",
      country: "India",
      lat: 19.1396,
      lng: 72.7963
    },
    features: {
      bedrooms: 5,
      bathrooms: 6,
      area: 8000,
      yearBuilt: 2018,
      propertyType: "house",
      status: "for-rent",
      floorPlan: "https://images.unsplash.com/photo-1604014438396-3273645c64f7?q=80&w=870"
    },
    amenities: ["Private Beach Access", "Swimming Pool", "Home Theater", "Garden", "Staff Quarters", "Boat Dock"],
    images: [
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=992",
      "https://images.unsplash.com/photo-1623298317883-6b70254edf31?q=80&w=992",
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=992",
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=992"
    ],
    agent: {
      id: "agent-2",
      name: "Vikram Malhotra",
      phone: "(022) 2555-5678",
      email: "vikram.m@realestate.com",
      image: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    featured: true,
    createdAt: randomDate()
  }
];

// Initialize database with dummy data
export const initializeDatabase = () => {
  // Check if we've already initialized the data
  const isInitialized = localStorage.getItem('db_initialized');
  
  if (!isInitialized) {
    // Initialize properties for sale
    propertiesForSale.forEach(property => {
      localStorage.setItem(`property_${property.id}`, JSON.stringify(property));
    });
    
    // Initialize properties for rent
    propertiesForRent.forEach(property => {
      localStorage.setItem(`property_${property.id}`, JSON.stringify(property));
    });
    
    // Mark as initialized
    localStorage.setItem('db_initialized', 'true');
    console.log('Database initialized with dummy properties');
  }
};
