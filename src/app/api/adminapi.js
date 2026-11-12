/**
 * Admin APIs - Passes through central api.js
 */
import { apiRequest } from './api';

/**
 * Admin Login
 */
export async function adminLogin(credentials) {
  return await apiRequest('/api/admin/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
}

/**
 * Check Admin Session / Profile (/api/admin/me)
 */
export async function checkAdminSession() {
  return await apiRequest('/api/admin/me');
}

/**
 * Get Admin Dashboard Overview Metrics
 */
export async function getAdminDashboard() {
  return await apiRequest('/api/admin/dashboard');
}

/**
 * Create additional admin account
 */
export async function createAdmin(adminData) {
  return await apiRequest('/api/admin/create', {
    method: 'POST',
    body: JSON.stringify(adminData),
  });
}

/**
 * Get all dynamic sections
 */
export async function getAllSections() {
  return await apiRequest('/api/sections');
}

/**
 * Public: Get active dynamic sections with populated products
 */
export async function getActiveSections() {
  return await apiRequest('/api/sections/active');
}

/**
 * Create dynamic landing page section
 */
export async function createSection(sectionData) {
  return await apiRequest('/api/sections', {
    method: 'POST',
    body: JSON.stringify(sectionData),
  });
}

/**
 * Update dynamic landing page section
 */
export async function updateSection(id, sectionData) {
  return await apiRequest(`/api/sections/${id}`, {
    method: 'PUT',
    body: JSON.stringify(sectionData),
  });
}

/**
 * Toggle section active/inactive status in one click
 */
export async function toggleSectionStatus(id) {
  return await apiRequest(`/api/sections/${id}/toggle`, {
    method: 'PATCH',
  });
}

/**
 * Delete a dynamic section
 */
export async function deleteSection(id) {
  return await apiRequest(`/api/sections/${id}`, {
    method: 'DELETE',
  });
}

/**
 * ================= ATTRIBUTES APIs =================
 */

/**
 * Get all attributes (fits, themes, badges, materials, sizes, colors, etc.)
 */
export async function getAttributes(params = {}) {
  const query = new URLSearchParams(params).toString();
  const url = query ? `/api/attributes?${query}` : '/api/attributes';
  return await apiRequest(url);
}

/**
 * Create a new attribute
 */
export async function createAttribute(attributeData) {
  return await apiRequest('/api/attributes', {
    method: 'POST',
    body: JSON.stringify(attributeData),
  });
}

/**
 * Update an attribute
 */
export async function updateAttribute(id, attributeData) {
  return await apiRequest(`/api/attributes/${id}`, {
    method: 'PUT',
    body: JSON.stringify(attributeData),
  });
}

/**
 * Delete an attribute
 */
export async function deleteAttribute(id) {
  return await apiRequest(`/api/attributes/${id}`, {
    method: 'DELETE',
  });
}

/**
 * Reset / Seed default attributes
 */
export async function seedAttributes(overwrite = false) {
  return await apiRequest('/api/attributes/seed', {
    method: 'POST',
    body: JSON.stringify({ overwrite }),
  });
}


