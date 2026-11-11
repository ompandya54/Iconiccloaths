/**
 * Central Main API Client / Endpoint Configuration
 */
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://iconic-node.onrender.com';

/**
 * Universal request wrapper for all API calls
 */
export async function apiRequest(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  // Add auth token if available in browser
  if (typeof window !== 'undefined') {
    const isAdminRoute = window.location.pathname.startsWith('/admin');
    const token = options.token || 
      (isAdminRoute 
        ? (localStorage.getItem('iconic_admin_token') || localStorage.getItem('token'))
        : (localStorage.getItem('iconic_customer_token') || localStorage.getItem('token') || localStorage.getItem('iconic_admin_token'))
      );
      
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`[API Error] ${endpoint}:`, error.message);
    return {
      success: false,
      message: error.message,
    };
  }
}

export default BASE_URL;

