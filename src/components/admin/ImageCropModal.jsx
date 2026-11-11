'use client';

import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import {
  X,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Crop as CropIcon,
  Check,
  Sparkles,
  Loader2
} from 'lucide-react';

/**
 * Creates an Image element from a data URL or blob URL
 */
const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.setAttribute('crossOrigin', 'anonymous');
    image.src = url;
  });

/**
 * Crops image on a canvas and returns a WebP Blob
 */
async function getCroppedImg(imageSrc, pixelCrop, rotation = 0) {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) return null;

  // Set canvas size to the cropped dimensions
  canvas.width = Math.round(pixelCrop.width);
  canvas.height = Math.round(pixelCrop.height);

  ctx.save();

  // If rotation exists, translate and rotate canvas
  if (rotation !== 0) {
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.translate(-canvas.width / 2, -canvas.height / 2);
  }

  // Draw the cropped portion
  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  ctx.restore();

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('Canvas export failed'));
          return;
        }
        resolve(blob);
      },
      'image/webp',
      0.92
    );
  });
}

export default function ImageCropModal({
  isOpen,
  imageSrc,
  onClose,
  onCropComplete,
  initialAspect = 1, // Default 1:1 square for streetwear apparel
  isUploading = false,
}) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [aspect, setAspect] = useState(initialAspect);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const onCropChange = (newCrop) => setCrop(newCrop);
  const onZoomChange = (newZoom) => setZoom(newZoom);

  const onCropPixelsComplete = useCallback((croppedArea, pixels) => {
    setCroppedAreaPixels(pixels);
  }, []);

  const handleApplyCrop = async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    setIsProcessing(true);

    try {
      const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels, rotation);
      if (croppedBlob) {
        await onCropComplete(croppedBlob, croppedAreaPixels);
      }
    } catch (err) {
      console.error('Failed to crop image:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen || !imageSrc) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[92vh] border border-slate-200">
        
        {/* Modal Header */}
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
              <CropIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Crop & Position Image</h3>
              <p className="text-[11px] text-slate-500">
                Pinch or scroll to zoom, drag to position for sharp Cloudinary upload
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing || isUploading}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors disabled:opacity-40"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Cropper Viewport Container */}
        <div className="relative w-full h-80 sm:h-96 bg-slate-900 overflow-hidden select-none">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={aspect || undefined}
            onCropChange={onCropChange}
            onZoomChange={onZoomChange}
            onCropComplete={onCropPixelsComplete}
            showGrid={true}
            cropShape="rect"
            style={{
              containerStyle: { background: '#090d16' },
              cropAreaStyle: {
                border: '2px solid #2563eb',
                boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.65)',
              },
            }}
          />
        </div>

        {/* Controls Footer */}
        <div className="p-4 sm:p-5 bg-white space-y-4">
          
          {/* Aspect Ratio Presets */}
          <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
            <span className="font-bold text-slate-600 uppercase text-[10px] tracking-wider">
              Aspect Ratio:
            </span>
            <div className="flex items-center space-x-1.5">
              <button
                type="button"
                onClick={() => setAspect(1)}
                className={`px-3 py-1 rounded-lg font-bold text-xs transition-all ${
                  aspect === 1
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                1:1 Square (Product)
              </button>
              <button
                type="button"
                onClick={() => setAspect(3 / 4)}
                className={`px-3 py-1 rounded-lg font-bold text-xs transition-all ${
                  aspect === 3 / 4
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                3:4 Lookbook
              </button>
              <button
                type="button"
                onClick={() => setAspect(null)}
                className={`px-3 py-1 rounded-lg font-bold text-xs transition-all ${
                  aspect === null
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Freeform
              </button>
            </div>
          </div>

          {/* Zoom & Rotation Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
            {/* Zoom Slider */}
            <div className="flex items-center space-x-2">
              <ZoomOut className="w-3.5 h-3.5 text-slate-400" />
              <input
                type="range"
                value={zoom}
                min={1}
                max={3}
                step={0.05}
                aria-label="Zoom"
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-full accent-blue-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
              />
              <ZoomIn className="w-3.5 h-3.5 text-slate-400" />
            </div>

            {/* Rotate Button */}
            <div className="flex items-center justify-end space-x-2">
              <button
                type="button"
                onClick={() => setRotation((prev) => (prev + 90) % 360)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center space-x-1.5 transition-colors"
                title="Rotate 90 degrees clockwise"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>Rotate 90°</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setCrop({ x: 0, y: 0 });
                  setZoom(1);
                  setRotation(0);
                }}
                className="px-2.5 py-1.5 text-slate-500 hover:text-slate-800 text-xs font-semibold"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isProcessing || isUploading}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleApplyCrop}
              disabled={isProcessing || isUploading}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/20 flex items-center space-x-2 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {(isProcessing || isUploading) ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Optimizing & Uploading to Cloudinary...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 stroke-[2.5]" />
                  <span>Crop & Upload Image</span>
                </>
              )}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}

