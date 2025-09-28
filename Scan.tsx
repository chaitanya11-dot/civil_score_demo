import React, { useRef, useEffect, useState } from 'react';
import { ScanLine, RefreshCw, AlertTriangle, CheckCircle, Upload, Camera } from 'lucide-react';
import type { User } from '../types';
import { dummyUsers } from '../data/users';
import { useCivilScore } from '../hooks/useCivilScore';


const ScannedUserProfile: React.FC<{ user: User; onReset: () => void }> = ({ user, onReset }) => {
    const { score, tier, tierIcon: TierIcon, tierColor } = useCivilScore(user.id);

    return (
      <div className="max-w-2xl mx-auto animate-fade-in-up">
        <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <img className="h-24 w-24 rounded-full object-cover border-4 border-gray-200" src={user.imageUrl} alt={user.name} />
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
              <p className="text-gray-500">{user.email}</p>
            </div>
            <div className="text-center">
                <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center ${tierColor.bg} border-4 ${tierColor.border}`}>
                    <TierIcon className={`h-12 w-12 ${tierColor.text}`} />
                </div>
                <p className="text-2xl font-bold text-gray-800 mt-2">{score}</p>
                <p className={`text-md font-semibold ${tierColor.text}`}>{tier} Tier</p>
            </div>
          </div>
          
           <div className="mt-6 flex flex-col items-center justify-center text-center py-6 bg-green-50 rounded-lg border border-green-200">
                <CheckCircle className="h-8 w-8 text-green-500" />
                <p className="mt-2 font-semibold text-green-800">No public red flags on record.</p>
                <p className="text-sm text-green-700">This citizen is in good standing.</p>
           </div>


          <div className="mt-6 pt-6 border-t">
            <button
              onClick={onReset}
              className="w-full flex items-center justify-center py-3 px-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-lg transition-all duration-200 active:scale-95"
            >
              <RefreshCw className="mr-2 h-4 w-4"/> Scan Another ID
            </button>
          </div>
        </div>
      </div>
    );
};


const Scan: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [scannedData, setScannedData] = useState<{ user: User } | null>(null);
  const [scanMode, setScanMode] = useState<'idle' | 'scanning' | 'processing'>('idle');

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      return stream;
    } catch (err) {
      console.error("Error accessing camera:", err);
      throw new Error("Could not access the camera. Please check your browser permissions.");
    }
  };

  const stopCamera = (stream: MediaStream | null) => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const handleStartScan = () => {
    setCameraError(null);
    setScannedData(null);
    setScanMode('scanning');
  };

  const resetScanner = () => {
    setScannedData(null);
    setCameraError(null);
    setScanMode('idle');
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return;
    
    setScanMode('processing');
    setCameraError(null);

    // Simulate processing the uploaded QR code
    setTimeout(() => {
        const scannedEmail = 'anika.singh@example.com';
        const user = dummyUsers.find(u => u.email === scannedEmail);

        if (user) {
          setScannedData({ user });
        } else {
          setCameraError("Uploaded QR code is not valid.");
        }
        setScanMode('idle'); // Return to idle for the next scan after this one completes
    }, 2500);

    // Clear the input value to allow re-uploading the same file
    event.target.value = '';
  };

  useEffect(() => {
    if (scanMode !== 'scanning') return;

    let stream: MediaStream | null = null;
    let timer: ReturnType<typeof setTimeout>;

    const setupScanner = async () => {
      try {
        stream = await startCamera();
        
        // Simulate scan after 3.5 seconds
        timer = setTimeout(() => {
          const scannedEmail = 'anika.singh@example.com';
          const user = dummyUsers.find(u => u.email === scannedEmail);

          if (user) {
             setScannedData({ user });
          } else {
            setCameraError("Scanned QR code is not valid.");
          }
          setScanMode('idle');
          stopCamera(stream);
        }, 3500);

      } catch (e) {
        if (e instanceof Error) {
            setCameraError(e.message);
        } else {
            setCameraError("An unknown error occurred while accessing the camera.");
        }
        setScanMode('idle');
      }
    };

    setupScanner();

    return () => {
      clearTimeout(timer);
      stopCamera(stream);
    };
  }, [scanMode]);
  
  if (scannedData) {
    return <ScannedUserProfile user={scannedData.user} onReset={resetScanner} />;
  }

  return (
    <div className="flex flex-col items-center justify-center text-center max-w-2xl mx-auto py-8 animate-fade-in-up">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/png, image/jpeg, image/webp"
        className="hidden"
      />
      <div className="inline-block bg-primary-100 p-4 rounded-full">
        <ScanLine className="h-10 w-10 text-primary-600" />
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mt-4">Scan Civil ID</h1>
      <p className="text-gray-500 mt-2 mb-8">
        Point your camera at a Civil Score QR code, or upload an image to securely view a citizen's public profile and score.
      </p>
      
      <div className="w-full max-w-md aspect-square bg-gray-900 rounded-lg shadow-lg overflow-hidden relative border-4 border-white flex items-center justify-center">
        {scanMode === 'scanning' && (
          <>
            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-3/4 h-3/4 relative">
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary-500 rounded-tl-lg"></div>
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary-500 rounded-tr-lg"></div>
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary-500 rounded-bl-lg"></div>
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary-500 rounded-br-lg"></div>
                    <div className="absolute top-0 left-0 right-0 h-1 bg-primary-500/80 rounded-full shadow-[0_0_10px_theme(colors.primary.400)] animate-scan-line"></div>
                </div>
            </div>
          </>
        )}
        {scanMode === 'processing' && (
           <div className="flex flex-col items-center justify-center text-white p-4">
            <svg className="animate-spin h-10 w-10 text-white mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="font-semibold">Processing QR Code...</p>
          </div>
        )}
        {scanMode === 'idle' && (
          <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-gray-100 text-gray-600">
            {cameraError ? (
                <div className="flex flex-col items-center text-red-600">
                  <AlertTriangle className="h-8 w-8 mb-2" />
                  <p className="font-semibold">Operation Failed</p>
                  <p className="text-sm text-center">{cameraError}</p>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center text-gray-500">
                  <Camera className="h-16 w-16" />
                  <p className="mt-4 font-semibold">Ready to Scan</p>
                  <p className="mt-1 text-sm">Choose an option below to start.</p>
                </div>
            )}
          </div>
        )}
      </div>
      
      <div className="mt-6 w-full max-w-md">
        {scanMode === 'scanning' ? (
          <p className="text-gray-500 font-semibold animate-pulse">Searching for QR code...</p>
        ) : scanMode === 'processing' ? (
          <p className="text-gray-500 font-semibold animate-pulse">Analyzing image...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={handleStartScan}
                className="w-full flex items-center justify-center py-3 px-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-lg transition-all duration-200 active:scale-95"
              >
                <Camera className="mr-2 h-4 w-4"/> {cameraError ? 'Try Camera Again' : 'Scan with Camera'}
              </button>
              <button
                onClick={handleUploadClick}
                className="w-full flex items-center justify-center py-3 px-4 bg-gray-600 hover:bg-gray-700 text-white font-bold rounded-lg transition-all duration-200 active:scale-95"
              >
                <Upload className="mr-2 h-4 w-4"/> Upload from Gallery
              </button>
          </div>
        )}
      </div>
      <style>{`
        @keyframes scan-line { 0% { top: 0; } 100% { top: 100%; } }
        .animate-scan-line { animation: scan-line 3s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default Scan;