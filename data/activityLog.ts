import type { ActivityLog } from '../types';

export const activityLogs: ActivityLog[] = [
  // Aarav Sharma (Gold Tier) -> 50 (Base) + 11 (Pos) - 0 (Neg) = 61
  {
    id: "111122223333",
    activities: [
      { date: "2024-07-15", description: "Blood donation", points: 5 },
      { date: "2024-06-30", description: "Taxes paid on time", points: 4 },
      { date: "2024-05-20", description: "No traffic fines in May", points: 2 },
    ],
  },
  // Priya Patel (Silver Tier) -> 50 (Base) + 3 (Pos) - 2 (Neg) = 51
  {
    id: "444455556666",
    activities: [
      { date: "2024-07-10", description: "Volunteering at social service", points: 3 },
      { date: "2024-05-10", description: "Traffic fine", points: -2 },
    ],
  },
  // Rohan Gupta (Bronze Tier) -> 50 (Base) + 2 (Pos) - 6 (Neg) = 46 (This is Silver)
  // Let's adjust for Bronze. 50 + 2 - 9 = 43
  {
    id: "777788889999",
    activities: [
      { date: "2024-04-12", description: "Tree plantation drive", points: 2 },
      { date: "2024-01-05", description: "Public nuisance complaint", points: -1 },
      { date: "2023-09-01", description: "Minor crime (theft)", points: -5 },
      { date: "2023-08-15", description: "Bill payment default", points: -3 },
    ],
  },
  // Anika Singh (Needs Improvement / Below Bronze) -> 50 (Base) + 6 (Pos) - 13 = 43
  {
    id: "123412341234",
    activities: [
      { date: "2024-06-01", description: "Fed stray dogs (June)", points: 5 },
      { date: "2024-05-15", description: "Fed stray dogs (May)", points: 1 },
      { date: "2024-03-22", description: "Minor crime (theft)", points: -5 },
      { date: "2023-11-15", description: "Traffic fine", points: -2 },
      { date: "2023-10-01", description: "Major Crime (assault)", points: -10 },
    ],
  },
  // Default Citizen User (Silver Tier)
  {
      id: "123456789012",
      activities: [
        { date: "2024-07-01", description: "No traffic fines in June", points: 2 },
        { date: "2024-06-15", description: "Taxes paid on time", points: 4 },
        { date: "2024-05-25", description: "Littering fine", points: -1 },
      ]
  }
];
