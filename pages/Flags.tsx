import React from 'react';
import { Flag, ShieldCheck } from 'lucide-react';

const Flags: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center max-w-2xl mx-auto py-12 animate-fade-in-up">
      <div className="flex items-center text-red-500 mb-4">
        <div className="bg-red-100 p-3 rounded-full">
            <Flag className="h-8 w-8 text-red-600" />
        </div>
      </div>
      <h1 className="text-3xl font-bold text-gray-900">Red Flags</h1>
      <p className="text-gray-500 mt-2 mb-8">
        This page shows activities that have negatively impacted your score.
      </p>
      <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200 w-full">
        <div className="flex justify-center items-center">
            <ShieldCheck className="h-8 w-8 text-primary-600" />
            <p className="ml-4 text-lg font-semibold text-gray-700">
            You have no Red Flags. Keep up the great work!
            </p>
        </div>
      </div>
    </div>
  );
};

export default Flags;