
const API_URL = "http://localhost:5000";

interface RequestOptions {
  method: string;
  headers: Record<string, string>;
  body?: string;
}

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem("authToken");
};

/**
 * Make an authenticated request to the API
 */
/**
 * Make an authenticated request to the API
 */
export const authenticatedRequest = async (endpoint: string, method: string = "GET", data: any = null) => {
  try {
    const authToken = localStorage.getItem("authToken");
    
    if (!authToken) {
      throw new Error("No authentication token found. Please log in.");
    }

    const options: RequestOptions = {
      method,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${authToken}` // Include token in the header
      }
    };

    // Add request body if data is provided
    if (data && (method === "POST" || method === "PUT")) {
      options.body = JSON.stringify(data);
    }

    const fullUrl = `${API_URL}${endpoint}`;
    console.log(`Making ${method} request to: ${fullUrl}`);
    const response = await fetch(fullUrl, options);

    // Log the request details for debugging
    console.log(`API ${method} request to ${endpoint}:`, { 
      status: response.status, 
      ok: response.ok
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Handle unauthorized error - token expired or invalid
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        window.location.href = "/login";
        throw new Error("Authentication expired. Please log in again.");
      }
      
      // Try to get more information about the error
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        // If we can't parse the response as JSON, just use the status
        errorData = { message: `Server returned ${response.status}` };
      }
      
      throw new Error(errorData?.message || `Error: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("API request failed:", error);
    throw error;
  }
};


/**
 * Make an unauthenticated request to the API
 */
export const publicRequest = async (endpoint: string, method: string = "GET", data: any = null) => {
  try {
    const options: RequestOptions = {
      method,
      headers: {
        "Content-Type": "application/json"
      }
    };

    // Add request body if data is provided
    if (data && (method === "POST" || method === "PUT")) {
      options.body = JSON.stringify(data);
    }

    const fullUrl = `${API_URL}${endpoint}`;
    const response = await fetch(fullUrl, options);
    
    if (!response.ok) {
      // Try to get more information about the error
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        // If we can't parse the response as JSON, just use the status
        errorData = { message: `Server returned ${response.status}` };
      }
      
      throw new Error(errorData?.message || `Error: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("API request failed:", error);
    throw error;
  }
};
