import { Property } from "@/lib/data";

const API_URL = "http://localhost:5000";

// Get token from localStorage
const getToken = (): string | null => {
  return localStorage.getItem("authToken");
};

// Helper for API requests with authentication
const authenticatedRequest = async (
  endpoint: string,
  method: string = "GET",
  data?: any
) => {
  const token = getToken();
  if (!token) {
    throw new Error("Authentication required");
  }

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const config: RequestInit = {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
  };

  const response = await fetch(`${API_URL}${endpoint}`, config);

  if (!response.ok) {
    try {
      const errorData = await response.json();
      throw new Error(errorData.message || `Error: ${response.status}`);
    } catch (e) {
      throw new Error(`Error: ${response.status}`);
    }
  }

  return response.json();
};

// Fetch dashboard statistics for agent/owner
export const getDashboardStats = async (): Promise<{
  totalProperties: number;
  activeProperties: number;
  totalViews: number;
  recentProperties: Property[];
}> => {
  const response = await authenticatedRequest("/properties/dashboard/stats");
  console.log("Dashboard stats response:", response); // Add logging to help debug
  return response.data;
};

// Fetch properties with filters and pagination
export const getFilteredProperties = async (
  filters: {
    status?: string;
    propertyType?: string;
    minPrice?: number;
    maxPrice?: number;
    bedrooms?: number;
    city?: string;
  },
  page: number = 1,
  limit: number = 10
): Promise<{
  properties: Property[];
  total: number;
  pages: number;
  currentPage: number;
}> => {
  // Convert filters to query params
  const queryParams = new URLSearchParams();
  if (filters.status) queryParams.append("status", filters.status);
  if (filters.propertyType) queryParams.append("propertyType", filters.propertyType);
  if (filters.minPrice) queryParams.append("minPrice", filters.minPrice.toString());
  if (filters.maxPrice) queryParams.append("maxPrice", filters.maxPrice.toString());
  if (filters.bedrooms) queryParams.append("bedrooms", filters.bedrooms.toString());
  if (filters.city) queryParams.append("city", filters.city);
  
  queryParams.append("page", page.toString());
  queryParams.append("limit", limit.toString());

  const response = await authenticatedRequest(`/properties?${queryParams.toString()}`);
  
  // Ensure all properties have an id property (using _id if necessary)
  const properties = response.properties.map((property: any) => {
    if (property._id && !property.id) {
      property.id = property._id;
    }
    return property;
  });

  return {
    properties,
    total: response.total,
    pages: response.pages,
    currentPage: response.currentPage
  };
};

// Fetch analytics data (for admin)
export const getAnalyticsData = async (): Promise<any> => {
  const response = await authenticatedRequest("/admin/analytics");
  return response.data;
};

export default {
  getDashboardStats,
  getFilteredProperties,
  getAnalyticsData
};
