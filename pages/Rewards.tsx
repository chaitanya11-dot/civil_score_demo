import React from 'react';
import { Gift } from 'lucide-react';

const Rewards: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center max-w-2xl mx-auto py-12 animate-fade-in-up">
      <div className="inline-block bg-primary-100 p-4 rounded-full">
        <Gift className="h-10 w-10 text-primary-600" />
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mt-4">Rewards & Benefits</h1>
      <p className="text-gray-500 mt-2 mb-8">
        Citizens with high scores get access to exclusive rewards.
      </p>
      <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200 w-full">
        <p className="text-lg font-semibold text-primary-700">
          Reward system coming soon. Maintain a high score to be eligible!
        </p>
      </div>
    </div>
  );
};

export default Rewards;