import React, { useState, useRef } from 'react';
import QRCode from 'react-qr-code';
import { X, Download, Copy, Check } from 'lucide-react';

interface ShareQRModalProps {
  isOpen: boolean;
  onClose: () => void;
  qrValue: string;
}

const ShareQRModal: React.FC<ShareQRModalProps> = ({ isOpen, onClose, qrValue }) => {
  const [isCopied, setIsCopied] = useState(false);
  const qrCodeRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    // In a real app, this would be a dynamic URL.
    const publicProfileUrl = `https://example.com/civil-score/profile/${qrValue.split(':')[1]}`;
    navigator.clipboard.writeText(publicProfileUrl).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
    });
  };

  const handleDownload = () => {
    const svg = qrCodeRef.current?.querySelector('svg');
    if (svg) {
      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      const img = new Image();
      img.onload = () => {
        canvas.width = img.width + 32; // add padding
        canvas.height = img.height + 32;
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 16, 16); // draw image with padding
        const pngFile = canvas.toDataURL('image/png');
        
        const downloadLink = document.createElement('a');
        downloadLink.download = 'CivilScore-Digital-ID.png';
        downloadLink.href = pngFile;
        downloadLink.click();
      };
      img.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity animate-fast-fade-in"
        onClick={onClose}
        aria-hidden="true"
      ></div>

      {/* Modal Content */}
      <div className="relative bg-white rounded-lg shadow-xl p-6 w-full max-w-sm mx-4 transform transition-all animate-scale-up text-center flex flex-col items-center justify-center">
        <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
            aria-label="Close"
          >
            <X size={20} />
        </button>
        
        <h3 className="text-xl leading-6 font-semibold text-gray-900 mb-2" id="modal-title">
          Share Your Digital ID
        </h3>
        <p className="text-sm text-gray-500 mb-6">Others can scan this to view your public profile.</p>

        <div className="p-4 bg-white rounded-lg inline-block border border-gray-200" ref={qrCodeRef}>
            <QRCode value={qrValue} size={200} fgColor="#1f2937" />
        </div>
        
        <div className="mt-6 space-y-3 w-full">
             <button
                type="button"
                onClick={handleDownload}
                className="w-full inline-flex justify-center items-center rounded-md border border-transparent shadow-sm px-4 py-2.5 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:text-sm transition-all active:scale-95"
            >
                <Download size={16} className="mr-2"/>
                Download PNG
            </button>
            <button
                type="button"
                onClick={handleCopyLink}
                className="w-full inline-flex justify-center items-center rounded-md border border-gray-300 shadow-sm px-4 py-2.5 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:text-sm transition-all active:scale-95"
            >
                {isCopied ? (
                     <>
                        <Check size={16} className="mr-2 text-green-500"/> Copied!
                     </>
                ) : (
                    <>
                        <Copy size={16} className="mr-2"/> Copy Link
                    </>
                )}
            </button>
        </div>
      </div>
    </div>
  );
};

export default ShareQRModal;