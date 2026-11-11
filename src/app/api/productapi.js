/**
 * Product APIs - All product endpoints pass through central api.js
 */
import { apiRequest } from './api';

/**
 * Get all products with filters, sorting, and pagination
 */
export async function getProducts(params = {}) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      query.append(key, value);
    }
  });

  const queryString = query.toString() ? `?${query.toString()}` : '';
  return await apiRequest(`/api/products${queryString}`);
}

/**
 * Get single product by ID or Slug
 */
export async function getProductById(id) {
  if (!id) return null;
  return await apiRequest(`/api/products/${encodeURIComponent(id)}`);
}

/**
 * Get bestseller products for landing page
 */
export async function getBestsellers(limit = 8) {
  return await apiRequest(`/api/products/bestsellers?limit=${limit}`);
}

/**
 * Get featured products
 */
export async function getFeaturedProducts(limit = 8) {
  return await apiRequest(`/api/products/featured?limit=${limit}`);
}

/**
 * Get new arrivals / latest drops
 */
export async function getNewArrivals(limit = 8) {
  return await apiRequest(`/api/products/new-arrivals?limit=${limit}`);
}

/**
 * Get related products for product details page
 */
export async function getRelatedProducts(id, limit = 4) {
  return await apiRequest(`/api/products/${id}/related?limit=${limit}`);
}

/**
 * Get filter attributes (sizes, colors, categories, price range)
 */
export async function getProductAttributes() {
  return await apiRequest('/api/products/attributes');
}

/**
 * Admin: Create a new product
 */
export async function createProduct(productData) {
  return await apiRequest('/api/products', {
    method: 'POST',
    body: JSON.stringify(productData),
  });
}

/**
 * Admin: Update an existing product
 */
export async function updateProduct(id, productData) {
  return await apiRequest(`/api/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(productData),
  });
}

/**
 * Admin: Delete a product
 */
export async function deleteProduct(id) {
  return await apiRequest(`/api/products/${id}`, {
    method: 'DELETE',
  });
}

/**
 * Admin: Toggle active/inactive status
 */
export async function toggleProductStatus(id) {
  return await apiRequest(`/api/products/${id}/toggle-status`, {
    method: 'PATCH',
  });
}

/**
 * Admin: Perform bulk actions (delete, activate, deactivate)
 */
export async function bulkProductAction(action, ids) {
  return await apiRequest('/api/products/bulk-action', {
    method: 'POST',
    body: JSON.stringify({ action, ids }),
  });
}

/**
 * Add review to a product
 */
export async function addProductReview(id, reviewData) {
  return await apiRequest(`/api/products/${id}/reviews`, {
    method: 'POST',
    body: JSON.stringify(reviewData),
  });
}

