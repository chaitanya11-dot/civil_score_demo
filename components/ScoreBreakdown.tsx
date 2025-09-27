import React from 'react';
import { ArrowDown, ArrowUp, Plus, Minus, Equal, CheckCircle, AlertTriangle } from 'lucide-react';

interface ScoreBreakdownProps {
    breakdown: {
        baseScore: number;
        positiveActivities: { description: string; points: number }[];
        negativeActivities: { description: string; points: number }[];
        totalPositive: number;
        totalNegative: number;
    };
    finalScore: number;
}

const ScoreBreakdown: React.FC<ScoreBreakdownProps> = ({ breakdown, finalScore }) => {
  return (
    <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Score Calculation</h2>
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 space-y-4">
            {/* Base Score */}
            <div className="flex justify-between items-center text-gray-700">
                <p className="font-medium">Base Score</p>
                <p className="font-mono font-semibold text-lg">{breakdown.baseScore}</p>
            </div>

            <hr/>

            {/* Positive Activities */}
            <div>
                <div className="flex justify-between items-center mb-2">
                    <p className="font-medium text-green-600 flex items-center"><CheckCircle size={16} className="mr-2"/>Positive Deeds</p>
                    <p className="font-mono font-semibold text-lg text-green-600 flex items-center"><Plus size={14}/>{breakdown.totalPositive}</p>
                </div>
                <div className="space-y-1 pl-6 border-l-2 border-green-200 ml-2">
                    {breakdown.positiveActivities.map((activity, index) => (
                        <div key={index} className="flex justify-between items-center text-sm text-gray-600">
                            <p>{activity.description}</p>
                            <p className="font-mono text-green-600">+{activity.points}</p>
                        </div>
                    ))}
                    {breakdown.positiveActivities.length === 0 && (
                         <p className="text-sm text-gray-400 italic">No positive activities recorded yet.</p>
                    )}
                </div>
            </div>

             <hr/>

            {/* Negative Activities */}
             <div>
                <div className="flex justify-between items-center mb-2">
                    <p className="font-medium text-red-600 flex items-center"><AlertTriangle size={16} className="mr-2"/>Negative Incidents</p>
                    <p className="font-mono font-semibold text-lg text-red-600 flex items-center"><Minus size={14}/>{Math.abs(breakdown.totalNegative)}</p>
                </div>
                <div className="space-y-1 pl-6 border-l-2 border-red-200 ml-2">
                    {breakdown.negativeActivities.map((activity, index) => (
                        <div key={index} className="flex justify-between items-center text-sm text-gray-600">
                            <p>{activity.description}</p>
                            <p className="font-mono text-red-600">{activity.points}</p>
                        </div>
                    ))}
                     {breakdown.negativeActivities.length === 0 && (
                         <p className="text-sm text-gray-400 italic">No negative incidents recorded. Great job!</p>
                    )}
                </div>
            </div>

            <hr className="border-dashed"/>

            {/* Final Score */}
            <div className="flex justify-between items-center pt-2">
                <p className="font-semibold text-lg text-gray-800 flex items-center"><Equal size={16} className="mr-2"/>Final Civil Score</p>
                <p className="font-mono font-bold text-2xl text-primary-700">{finalScore}</p>
            </div>
        </div>
    </div>
  );
};

export default ScoreBreakdown;
