
import React, { useState, useRef } from 'react';
import QRCode from 'react-qr-code';
import { Share2, Edit, Check, X, QrCode, Camera } from 'lucide-react';
import ShareQRModal from '../components/ShareQRModal';
import ImageCropModal from '../components/ImageCropModal';
import { useAuth } from '../contexts/AuthContext';
import { useCivilScore } from '../hooks/useCivilScore';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const { score, tier, tierIcon: TierIcon, tierColor } = useCivilScore(user?.id);

  const [userProfile, setUserProfile] = useState({
    name: user?.name || 'Citizen User',
    email: user?.email || 'citizen@example.com',
    imageUrl: user?.imageUrl || "https://picsum.photos/200",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editingProfile, setEditingProfile] = useState(userProfile);
  
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleEditClick = () => {
    setEditingProfile(userProfile);
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
  };

  const handleSaveClick = () => {
    setUserProfile(editingProfile);
    setIsEditing(false);
    // In a real app, you'd also update the auth context or send to a server here.
  };
  
  const handleProfileImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageToCrop(e.target?.result as string);
        setIsCropModalOpen(true);
      };
      reader.readAsDataURL(file);
    }
    event.target.value = ''; // Allow re-uploading the same file
  };

  const handleCropSave = (croppedImageUrl: string) => {
    setEditingProfile(prev => ({ ...prev, imageUrl: croppedImageUrl }));
    // In a real app, you might save the cropped image immediately or wait for the main save button.
    // For this UI, we'll update the editing state.
    setIsCropModalOpen(false);
    setImageToCrop(null);
  };

  const qrValue = `civil-score-user:${userProfile.email}`;

  return (
    <>
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
        {/* User Profile Banner */}
        <div className="bg-primary-600 p-5 rounded-lg shadow-md flex items-center space-x-5">
          <div className="relative">
            <img className="h-20 w-20 rounded-full object-cover border-4 border-white/80" src={isEditing ? editingProfile.imageUrl : userProfile.imageUrl} alt="Citizen User" />
            {isEditing && (
              <button 
                onClick={handleProfileImageClick}
                className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center text-white opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                aria-label="Change profile picture"
              >
                <Camera size={24} />
              </button>
            )}
          </div>
          <div className="flex-1">
            {isEditing ? (
              <div className="space-y-1">
                <input type="text" value={editingProfile.name} onChange={(e) => setEditingProfile({...editingProfile, name: e.target.value})} className="text-xl font-bold w-full p-1 rounded-md bg-white/20 focus:outline-none focus:ring-2 focus:ring-white text-white placeholder-white/70" />
                <input type="email" value={editingProfile.email} onChange={(e) => setEditingProfile({...editingProfile, email: e.target.value})} className="text-sm w-full p-1 rounded-md bg-white/20 focus:outline-none focus:ring-2 focus:ring-white text-white placeholder-white/70" />
              </div>
            ) : (
              <>
                <h1 className="text-2xl font-bold text-white">{userProfile.name}</h1>
                <p className="text-white/80">{userProfile.email}</p>
              </>
            )}
          </div>
          <div className="flex space-x-2 self-start">
              {isEditing ? (
                   <>
                      <button onClick={handleSaveClick} className="bg-white hover:bg-gray-100 text-green-700 font-bold py-1 px-3 rounded-lg text-xs flex items-center transition-all active:scale-95"><Check size={14} className="mr-1"/> Save</button>
                      <button onClick={handleCancelClick} className="bg-white/30 hover:bg-white/40 text-white font-medium py-1 px-3 rounded-lg text-xs flex items-center transition-all active:scale-95"><X size={14} className="mr-1"/> Cancel</button>
                   </>
              ) : (
                   <>
                      <button onClick={() => setIsShareModalOpen(true)} className="bg-white/30 hover:bg-white/40 text-white font-semibold py-1 px-3 rounded-lg text-xs flex items-center transition-all"><Share2 size={12} className="mr-1.5"/> Share</button>
                      <button onClick={handleEditClick} className="bg-white/30 hover:bg-white/40 text-white font-semibold py-1 px-3 rounded-lg text-xs flex items-center transition-all"><Edit size={12} className="mr-1.5"/> Edit</button>
                   </>
              )}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Civil Score Card */}
          <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-md border border-gray-200 flex flex-col items-center justify-center">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Civil Score Tier</h2>
              <div className={`w-36 h-36 rounded-full flex items-center justify-center ${tierColor.bg} border-4 ${tierColor.border} mb-4`}>
                <TierIcon className={`h-20 w-20 ${tierColor.text}`} />
             </div>
             <p className="text-4xl font-bold text-gray-800">{score}</p>
             <p className={`text-lg font-semibold ${tierColor.text}`}>{tier} Tier</p>
          </div>

          {/* Digital ID Card */}
          <div className="md:col-span-1 bg-white p-6 rounded-lg shadow-md border border-gray-200 text-center flex flex-col justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">Digital ID</h2>
                <div className="p-2 bg-white rounded-lg inline-block my-3 border border-gray-200">
                  <QRCode value={qrValue} size={128} fgColor="#1f2937" />
                </div>
                <p className="text-xs text-gray-500 mt-1">Scan this to view your public profile.</p>
              </div>
              <button
                onClick={() => setIsShareModalOpen(true)}
                className="mt-4 w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-4 rounded-lg text-sm flex items-center justify-center transition-all active:scale-95"
              >
                <QrCode size={16} className="mr-2"/> Share QR Code
              </button>
          </div>
        </div>

        {/* Bottom Cards */}
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">Endorsements</h2>
              <p className="text-sm text-gray-500 text-center py-4">No endorsements received yet.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">Verified Public Activities</h2>
              <p className="text-sm text-gray-500 text-center py-4">No activities logged.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">Earned Badges</h2>
              <p className="text-sm text-gray-500 text-center py-4">No badges earned yet. Keep up the good work!</p>
            </div>
        </div>
      </div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/png, image/jpeg, image/webp"
        style={{ display: 'none' }}
      />
      <ShareQRModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        qrValue={qrValue}
      />
      <ImageCropModal
        isOpen={isCropModalOpen}
        onClose={() => setIsCropModalOpen(false)}
        imageSrc={imageToCrop}
        onSave={handleCropSave}
      />
    </>
  );
};

export default Profile;
