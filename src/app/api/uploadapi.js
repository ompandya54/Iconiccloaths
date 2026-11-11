/**
 * Image Upload API Client
 * Sends image blob/file to backend Express /api/upload
 * Processed with Sharp & uploaded directly to Cloudinary
 */
import BASE_URL from './api';

export async function uploadImageFile(fileOrBlob, filename = 'product.webp', cropData = null) {
  const formData = new FormData();
  formData.append('image', fileOrBlob, filename);

  if (cropData) {
    if (cropData.x !== undefined) formData.append('cropX', cropData.x);
    if (cropData.y !== undefined) formData.append('cropY', cropData.y);
    if (cropData.width !== undefined) formData.append('cropWidth', cropData.width);
    if (cropData.height !== undefined) formData.append('cropHeight', cropData.height);
  }

  const token = typeof window !== 'undefined'
    ? (localStorage.getItem('iconic_admin_token') || localStorage.getItem('token'))
    : null;

  try {
    const url = `${BASE_URL}/api/upload`;
    const res = await fetch(url, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });

    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Image upload failed:', error);
    return {
      success: false,
      message: error.message || 'Image upload failed',
    };
  }
}

