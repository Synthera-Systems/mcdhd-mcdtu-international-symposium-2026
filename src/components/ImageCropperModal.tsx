"use client";

import { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { motion, AnimatePresence } from 'framer-motion';
import getCroppedImg, { createImage } from '@/utils/cropImage';

interface ImageCropperModalProps {
  isOpen: boolean;
  imageSrc: string;
  onClose: () => void;
  onCropComplete: (croppedFile: File) => void;
}

export default function ImageCropperModal({ isOpen, imageSrc, onClose, onCropComplete }: ImageCropperModalProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [aspectRatio, setAspectRatio] = useState<number>(3 / 4);

  const onCropChange = useCallback((location: any) => {
    setCrop(location);
  }, []);

  const onZoomChange = useCallback((newZoom: number) => {
    setZoom(newZoom);
  }, []);

  const handleCropComplete = useCallback((croppedArea: any, croppedPixels: any) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  // Detect image aspect ratio dynamically on image load
  const onMediaLoaded = useCallback((mediaSize: { width: number; height: number; naturalWidth: number; naturalHeight: number }) => {
    if (mediaSize.naturalWidth && mediaSize.naturalHeight) {
      setAspectRatio(mediaSize.naturalWidth / mediaSize.naturalHeight);
    }
  }, []);

  // 1. Confirm Selection / Crop
  const handleSave = async () => {
    if (!croppedAreaPixels) return;
    setIsProcessing(true);
    try {
      const croppedImageFile = await getCroppedImg(imageSrc, croppedAreaPixels);
      if (croppedImageFile) {
        onCropComplete(croppedImageFile);
      }
    } catch (e) {
      console.error(e);
      alert("Failed to crop image. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // 2. Skip Crop & Use Full Original Image
  const handleUseOriginal = async () => {
    if (!imageSrc) return;
    setIsProcessing(true);
    try {
      const img = await createImage(imageSrc);
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const file = new File([blob], "receipt-original.jpg", {
                type: "image/jpeg",
              });
              onCropComplete(file);
            }
            setIsProcessing(false);
          },
          "image/jpeg",
          0.85
        );
      }
    } catch (e) {
      console.error("Error using original image:", e);
      setIsProcessing(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-6 bg-primary/60 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]"
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-surface-dim/20 flex justify-between items-center bg-surface-bright/30">
              <div>
                <h3 className="font-playfair text-xl font-bold text-primary">Verify Receipt Screenshot</h3>
                <p className="font-inter text-xs text-on-surface-variant">Scale or position image to fit the crop area</p>
              </div>
              <button onClick={onClose} className="p-2 bg-surface hover:bg-surface-dim/20 rounded-xl transition-colors cursor-pointer">
                <svg className="w-5 h-5 text-on-surface-variant" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {/* Cropper Container - Unrestricted Zoom & Positioning */}
            <div className="relative w-full h-[50vh] sm:h-[480px] bg-black">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={aspectRatio}
                minZoom={0.2} // Allows zoom out to make full receipt smaller than crop box
                maxZoom={3}
                restrictPosition={false} // Enables padding / black background around image
                objectFit="contain"
                onCropChange={onCropChange}
                onCropComplete={handleCropComplete}
                onZoomChange={onZoomChange}
                onMediaLoaded={onMediaLoaded}
              />
            </div>

            {/* Controls & Action Buttons */}
            <div className="p-5 sm:p-6 bg-white border-t border-surface-dim/20">
              <div className="flex items-center gap-4 mb-5">
                <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Zoom</span>
                <input
                  type="range"
                  value={zoom}
                  min={0.2}
                  max={3}
                  step={0.05}
                  aria-labelledby="Zoom"
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="w-full h-1.5 bg-surface-dim/30 rounded-lg appearance-none cursor-pointer accent-secondary"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button 
                  type="button"
                  onClick={handleUseOriginal}
                  disabled={isProcessing}
                  className="w-full sm:w-auto px-5 py-3 border border-surface-dim text-primary hover:bg-surface-bright rounded-xl font-bold text-xs transition-colors cursor-pointer disabled:opacity-50"
                >
                  Use Full Image
                </button>

                <div className="flex gap-3 w-full sm:w-auto flex-1">
                  <button 
                    type="button"
                    onClick={onClose} 
                    disabled={isProcessing}
                    className="flex-1 px-4 py-3 border border-surface-dim/50 rounded-xl font-bold text-xs text-primary hover:bg-surface-bright transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    type="button"
                    onClick={handleSave}
                    disabled={isProcessing}
                    className="flex-1 px-4 py-3 bg-secondary text-white rounded-xl font-bold text-xs hover:bg-secondary-container transition-colors shadow-md shadow-secondary/20 flex items-center justify-center cursor-pointer disabled:opacity-50"
                  >
                    {isProcessing ? "Processing..." : "Confirm Selection"}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}