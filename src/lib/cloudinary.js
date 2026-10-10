import crypto from 'crypto';

/**
 * Uploads an image file (Buffer, Base64 data URI, or File stream) securely to Cloudinary via REST API.
 * Uses Server-Side HMAC SHA-1 Signatures so CLOUDINARY_API_SECRET is NEVER exposed to the frontend.
 * 
 * @param {string | Buffer} fileData - Base64 Data URI (data:image/png;base64,...) or Image Buffer/URL
 * @param {Object} options - Upload options (folder, public_id, etc.)
 * @returns {Promise<Object>} - Cloudinary upload result object containing { url, secure_url, public_id, width, height, format }
 */
export async function uploadToCloudinary(fileData, options = {}) {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName) {
    throw new Error('CLOUDINARY_CLOUD_NAME is missing in environment variables (.env.local)');
  }

  const folder = options.folder || 'iconiccloaths/products';
  const timestamp = Math.floor(Date.now() / 1000);

  const formData = new FormData();
  formData.append('file', fileData);

  // If Unsigned preset is configured
  if (uploadPreset && !apiSecret) {
    formData.append('upload_preset', uploadPreset);
    formData.append('folder', folder);
  } else if (apiKey && apiSecret) {
    // Highly Secure Server-Signed Upload (Recommended)
    // Cloudinary signature parameters must be sorted alphabetically
    const paramsToSign = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
    
    // Generate SHA-1 Hash Signature
    const signature = crypto.createHash('sha1').update(paramsToSign).digest('hex');

    formData.append('api_key', apiKey);
    formData.append('timestamp', timestamp.toString());
    formData.append('folder', folder);
    formData.append('signature', signature);
  } else {
    throw new Error(
      'Cloudinary setup incomplete. Please provide (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET) in .env.local'
    );
  }

  const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

  const response = await fetch(uploadUrl, {
    method: 'POST',
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error?.message || 'Failed to upload image to Cloudinary');
  }

  return {
    url: data.secure_url || data.url,
    secure_url: data.secure_url,
    public_id: data.public_id,
    width: data.width,
    height: data.height,
    format: data.format,
    bytes: data.bytes,
  };
}

/**
 * Deletes an image from Cloudinary cloud storage by its public_id.
 * Uses HMAC SHA-1 signed request to Cloudinary destroy API endpoint.
 * 
 * @param {string} publicId - The Cloudinary public_id (e.g. "iconiccloaths/products/sample_123")
 * @returns {Promise<Object>} - { result: "ok" | "not found" }
 */
export async function deleteFromCloudinary(publicId) {
  if (!publicId) return { result: 'ignored' };

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    console.warn('Cloudinary credentials missing. Skipping image deletion from Cloudinary.');
    return { result: 'credentials_missing' };
  }

  const timestamp = Math.floor(Date.now() / 1000);

  // Alphabetically sorted parameters for signature: public_id, timestamp
  const paramsToSign = `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
  const signature = crypto.createHash('sha1').update(paramsToSign).digest('hex');

  const formData = new FormData();
  formData.append('public_id', publicId);
  formData.append('api_key', apiKey);
  formData.append('timestamp', timestamp.toString());
  formData.append('signature', signature);

  const destroyUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`;

  try {
    const response = await fetch(destroyUrl, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error deleting Cloudinary image [${publicId}]:`, error);
    return { result: 'error', error: error.message };
  }
}

/**
 * Helper to extract Cloudinary public_id from a full Cloudinary URL.
 * e.g. "https://res.cloudinary.com/demo/image/upload/v1234567890/iconiccloaths/products/sample.jpg" -> "iconiccloaths/products/sample"
 */
export function extractPublicIdFromUrl(url) {
  if (!url || typeof url !== 'string' || !url.includes('res.cloudinary.com')) {
    return null;
  }

  try {
    const parts = url.split('/upload/');
    if (parts.length < 2) return null;
    
    // Remove version string if present (e.g., v1612345678/)
    let publicIdWithExt = parts[1].replace(/^v\d+\//, '');
    
    // Remove file extension (.jpg, .png, .webp, etc.)
    const lastDotIndex = publicIdWithExt.lastIndexOf('.');
    if (lastDotIndex > -1) {
      publicIdWithExt = publicIdWithExt.substring(0, lastDotIndex);
    }
    
    return publicIdWithExt;
  } catch (e) {
    return null;
  }
}

export default uploadToCloudinary;
