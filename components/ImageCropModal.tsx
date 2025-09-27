import React, { useRef } from 'react';
import { X, Check } from 'lucide-react';

interface ImageCropModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (croppedImageUrl: string) => void;
  imageSrc: string | null;
}

const CROP_SIZE = 256;

const ImageCropModal: React.FC<ImageCropModalProps> = ({ isOpen, onClose, onSave, imageSrc }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  if (!isOpen || !imageSrc) return null;

  const handleSave = () => {
    const canvas = canvasRef.current;
    const image = new Image();
    image.src = imageSrc;
    image.onload = () => {
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      canvas.width = CROP_SIZE;
      canvas.height = CROP_SIZE;

      // Center-crop logic
      const sourceAspectRatio = image.width / image.height;
      const canvasAspectRatio = 1; // Square
      let sourceX = 0, sourceY = 0, sourceWidth = image.width, sourceHeight = image.height;

      if (sourceAspectRatio > canvasAspectRatio) { // Image is wider than canvas
        sourceWidth = image.height * canvasAspectRatio;
        sourceX = (image.width - sourceWidth) / 2;
      } else { // Image is taller than or same aspect as canvas
        sourceHeight = image.width / canvasAspectRatio;
        sourceY = (image.height - sourceHeight) / 2;
      }

      ctx.drawImage(
        image,
        sourceX,
        sourceY,
        sourceWidth,
        sourceHeight,
        0,
        0,
        CROP_SIZE,
        CROP_SIZE
      );

      const croppedUrl = canvas.toDataURL('image/jpeg', 0.9);
      onSave(croppedUrl);
      onClose();
    };
    image.onerror = () => {
        console.error("Failed to load image for cropping.");
        onClose();
    };
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity animate-fast-fade-in"
        onClick={onClose}
        aria-hidden="true"
      ></div>

      <div className="relative bg-white rounded-lg shadow-xl p-6 w-full max-w-lg mx-4 transform transition-all animate-scale-up flex flex-col items-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
          aria-label="Close"
        >
          <X size={20} />
        </button>
        
        <h3 className="text-xl leading-6 font-semibold text-gray-900 mb-4 self-start" id="modal-title">
          Crop & Resize Profile Picture
        </h3>

        <div className="w-full max-w-xs aspect-square overflow-hidden rounded-full border-4 border-primary-200 my-4 bg-gray-100">
            <img src={imageSrc} alt="Profile preview" className="w-full h-full object-cover" />
        </div>
        <p className="text-xs text-gray-500 mb-6">Your image will be resized to {CROP_SIZE}x{CROP_SIZE} pixels.</p>

        <canvas ref={canvasRef} className="hidden" />

        <div className="w-full flex justify-end space-x-3">
          <button
            type="button"
            className="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:text-sm transition-transform active:scale-95"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className="inline-flex justify-center items-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 sm:text-sm transition-transform active:scale-95"
            onClick={handleSave}
          >
            <Check size={16} className="mr-2"/>
            Save & Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageCropModal;