
const API_URL = "http://localhost:5000";

// Get token from localStorage
export const getToken = (): string | null => {
  return localStorage.getItem("authToken");
};

// Helper for API requests with authentication
export const authenticatedRequest = async (
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
    // Set mode to 'cors' for cross-origin requests
    mode: 'cors',
    credentials: 'same-origin', // Changed from 'include' to 'same-origin' for better compatibility
  };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);

    if (!response.ok) {
      try {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error: ${response.status}`);
      } catch (e) {
        throw new Error(`Error: ${response.status}`);
      }
    }

    // For empty responses (e.g., DELETE operations), return empty object
    if (response.status === 204 || response.headers.get('content-length') === '0') {
      return {};
    }

    return response.json();
  } catch (error) {
    console.error("API request failed:", error);
    throw error;
  }
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!getToken();
};
