import React from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle } from 'lucide-react';

const ActivityDetail: React.FC = () => {
  const location = useLocation();
  const activity = location.state as { title: string; description: string; iframeUrl?: string };

  if (!activity) {
    // If no state is passed, redirect to the activities list
    return <Navigate to="/activities" replace />;
  }

  const { title, description, iframeUrl } = activity;

  if (iframeUrl) {
    return (
      <div className="w-full h-full -m-4 sm:-m-6 lg:-m-8">
        <iframe
          src={iframeUrl}
          title={title}
          className="w-full h-full border-0"
        ></iframe>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto animate-fade-in-up">
      <div className="mb-6">
        <Link 
          to="/activities" 
          className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-primary-600 transition-colors"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to Activities
        </Link>
      </div>

      <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
        <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
        <p className="text-gray-600 mt-4 text-base leading-relaxed">{description}</p>
        
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Verification</h2>
          <div className="mt-3 flex items-center bg-green-50 p-4 rounded-lg border border-green-200">
            <CheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
            <div>
              <p className="font-semibold text-green-800">Verified by Blockchain ✅</p>
              <a href="#" className="text-xs text-green-700 hover:underline">
                View Transaction: 0x123...abc (Placeholder)
              </a>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            This record is immutable and permanently stored on the blockchain for transparency and trust.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ActivityDetail;