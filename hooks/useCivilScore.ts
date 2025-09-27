import { useMemo } from 'react';
import { activityLogs } from '../data/activityLog';
import { Trophy, Award, Shield } from 'lucide-react';

// --- Civil Score Algorithm Configuration ---
const BASE_SCORE = 50;
// A higher decay constant means older activities retain their value for longer.
// 365 means an activity from 1 year ago has ~37% of its original impact.
const DECAY_CONSTANT = 365;

interface ScoreBreakdown {
  baseScore: number;
  // Activities will now contain their weighted (decayed) points
  positiveActivities: { description: string; points: number }[];
  negativeActivities: { description: string; points: number }[];
  totalPositive: number; // Sum of weighted positive points
  totalNegative: number; // Sum of weighted negative points
}

/**
 * Calculates the number of days between a given date string and today.
 * @param dateString - The date of the activity (e.g., "2024-07-15").
 * @returns The number of days that have passed.
 */
const daysSince = (dateString: string): number => {
  const eventDate = new Date(dateString);
  const today = new Date();
  // Disregard time part for a pure date comparison
  eventDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  const diffTime = Math.abs(today.getTime() - eventDate.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const useCivilScore = (userId?: string) => {
  const scoreData = useMemo(() => {
    const userActivity = activityLogs.find(log => log.id === userId);

    const breakdown: ScoreBreakdown = {
      baseScore: BASE_SCORE,
      positiveActivities: [],
      negativeActivities: [],
      totalPositive: 0,
      totalNegative: 0,
    };

    if (userActivity?.activities) {
      userActivity.activities.forEach(activity => {
        const daysAgo = daysSince(activity.date);
        // Apply exponential decay to the points based on recency
        const weight = Math.exp(-daysAgo / DECAY_CONSTANT);
        const weightedPoints = activity.points * weight;

        if (activity.points > 0) {
          breakdown.totalPositive += weightedPoints;
          breakdown.positiveActivities.push({
            description: activity.description,
            points: parseFloat(weightedPoints.toFixed(2)), // Store the weighted value
          });
        } else if (activity.points < 0) {
          breakdown.totalNegative += weightedPoints;
          breakdown.negativeActivities.push({
            description: activity.description,
            points: parseFloat(weightedPoints.toFixed(2)), // Store the weighted value
          });
        }
      });
    }

    // Calculate the raw score by applying the weighted changes to the base score
    const rawScore = BASE_SCORE + breakdown.totalPositive + breakdown.totalNegative;

    // Clamp the final score to be within the 0-100 range and round it
    const score = Math.max(0, Math.min(100, Math.round(rawScore)));

    // Round the totals for display
    breakdown.totalPositive = Math.round(breakdown.totalPositive);
    breakdown.totalNegative = Math.round(breakdown.totalNegative); // This will be a negative number

    // Determine the user's tier based on their final score
    let tier, tierIcon, tierColor;
    if (score >= 56) {
      tier = 'Gold';
      tierIcon = Trophy;
      tierColor = { text: 'text-amber-500', bg: 'bg-amber-100', border: 'border-amber-200' };
    } else if (score >= 46) {
      tier = 'Silver';
      tierIcon = Award;
      tierColor = { text: 'text-gray-500', bg: 'bg-gray-200', border: 'border-gray-300' };
    } else {
      tier = 'Bronze';
      tierIcon = Shield;
      tierColor = { text: 'text-orange-600', bg: 'bg-orange-100', border: 'border-orange-200' };
    }
    
    // Reverse the activities to show the most recent (and impactful) ones first
    breakdown.positiveActivities.reverse();
    breakdown.negativeActivities.reverse();
    
    return { score, tier, tierIcon, tierColor, breakdown };

  }, [userId]);

  return scoreData;
};