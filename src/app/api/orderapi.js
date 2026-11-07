/**
 * Order APIs - Passes through central api.js
 */
import { apiRequest } from './api';

/**
 * Place a new order (Checkout)
 */
export async function createOrder(orderPayload) {
  return await apiRequest('/api/orders', {
    method: 'POST',
    body: JSON.stringify(orderPayload),
  });
}

/**
 * Get order details by ID or Order Number
 */
export async function getOrderById(orderId) {
  return await apiRequest(`/api/orders/${orderId}`);
}

/**
 * Get logged-in user order history
 */
export async function getMyOrders() {
  return await apiRequest('/api/orders/myorders');
}

/**
 * Admin: Get all orders with optional status and pagination
 */
export async function getAdminOrders(params = {}) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      query.append(key, value);
    }
  });

  const queryString = query.toString() ? `?${query.toString()}` : '';
  return await apiRequest(`/api/orders${queryString}`);
}

/**
 * Admin: Update order delivery / fulfillment status
 */
export async function updateOrderStatus(orderId, statusData) {
  return await apiRequest(`/api/orders/${orderId}/status`, {
    method: 'PUT',
    body: JSON.stringify(statusData),
  });
}

/**
 * Admin: Delete order
 */
export async function deleteOrder(orderId) {
  return await apiRequest(`/api/orders/${orderId}`, {
    method: 'DELETE',
  });
}

