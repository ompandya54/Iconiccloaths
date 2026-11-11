/**
 * Customer Authentication & Profile API Client
 */
import { apiRequest } from './api';

/**
 * Register a new customer
 */
export async function customerRegister(userData) {
  return await apiRequest('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
}

/**
 * Customer login
 */
export async function customerLogin(credentials) {
  return await apiRequest('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
}

/**
 * Get current customer profile
 */
export async function getCustomerProfile() {
  return await apiRequest('/api/auth/profile');
}

/**
 * Update current customer profile
 */
export async function updateCustomerProfile(profileData) {
  return await apiRequest('/api/auth/profile', {
    method: 'PUT',
    body: JSON.stringify(profileData),
  });
}

/**
 * Get customer wishlist
 */
export async function getCustomerWishlist() {
  return await apiRequest('/api/auth/wishlist');
}

/**
 * Add product to wishlist
 */
export async function addToCustomerWishlist(productId) {
  return await apiRequest(`/api/auth/wishlist/${productId}`, {
    method: 'POST',
  });
}

/**
 * Remove product from wishlist
 */
export async function removeFromCustomerWishlist(productId) {
  return await apiRequest(`/api/auth/wishlist/${productId}`, {
    method: 'DELETE',
  });
}

