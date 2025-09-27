import type { CriminalCase } from '../types';

export const initialCasesData: CriminalCase[] = [
  { 
    id: 2024001,
    firNumber: 'FIR-001-24',
    firDate: '2024-07-22T08:15',
    caseType: 'Traffic Violation',
    status: 'Reported',
    policeStation: 'Traffic Div, South Zone',
    investigatingOfficer: 'Unassigned',
    complainant: { role: 'Complainant', name: 'Emily White', address: '456 Oak St', contact: '555-0103' },
    involvedPersons: [
      { role: 'Accused', name: 'John Doe', address: '123 Pine St', contact: '555-0104' }
    ],
    courtDetails: undefined,
    hearings: [],
    location: { address: 'Corner of Oak & 1st', lat: 34.0522, lng: -118.2437 },
    tags: ['traffic', 'red-light', 'high-speed'],
    description: 'A silver sedan ran a red light at a high speed, nearly causing a collision. License plate was partially visible.',
    evidence: [
      { id: 'ev-1', name: 'dashcam.jpg', url: 'https://picsum.photos/seed/car/800/600', type: 'image', uploadedBy: 'Emily White', timestamp: '2024-07-22T08:16', description: 'Dashcam footage from complainant vehicle.' },
      { id: 'ev-2', name: 'Witness Statement.pdf', url: '#', type: 'document', uploadedBy: 'Emily White', timestamp: '2024-07-22T08:18', description: 'Written statement from a pedestrian witness.' }
    ],
    internalNotes: []
  },
  {
    id: 2024002,
    firNumber: 'FIR-002-24',
    firDate: '2024-07-21T14:00',
    caseType: 'Theft',
    status: 'Under Investigation',
    policeStation: 'Central Precinct',
    investigatingOfficer: 'Det. Miller',
    complainant: { role: 'Complainant', name: 'John Smith', address: '789 Maple St', contact: '555-0101' },
    involvedPersons: [],
    courtDetails: undefined,
    hearings: [],
    location: { address: 'Public Library, Main St', lat: 34.0530, lng: -118.2430 },
    tags: ['theft', 'bicycle', 'public-property'],
    description: 'A bicycle was stolen from the public rack outside the library. It was a blue mountain bike with a black seat.',
    evidence: [],
    internalNotes: [
        { text: 'Checked library CCTV, suspect is a male, approx 5\'10", wearing a grey hoodie. Image quality is poor.', author: 'Det. Miller', timestamp: '2024-07-23T11:00' }
    ]
  },
  {
    id: 2024003,
    firNumber: 'FIR-003-24',
    firDate: '2024-07-20T22:30',
    caseType: 'Vandalism',
    status: 'Charge Sheet Filed',
    policeStation: 'Westside Station',
    investigatingOfficer: 'Officer Rodriguez',
    complainant: { role: 'Complainant', name: 'Jane Doe', address: '101 Elm St', contact: '555-0102' },
    involvedPersons: [
        { role: 'Accused', name: 'Mikey Adams', address: '21 Jump Street', contact: '555-0105' }
    ],
    courtDetails: { courtName: 'City Criminal Court', caseNumber: 'CC-2024-582', judge: 'Hon. Eva Perry', prosecutor: 'ADA Hanson', defenseLawyer: 'Public Defender' },
    hearings: [
        { date: '2024-08-15T10:00', summary: 'First appearance. Plea of not guilty entered.', nextHearingDate: '2024-09-05T14:00' }
    ],
    nextHearingDate: '2024-09-05T14:00',
    location: { address: 'Community Center, Park Ave', lat: 34.0550, lng: -118.2480 },
    tags: ['vandalism', 'graffiti', 'community-property'],
    description: 'Graffiti spray-painted on the community center wall near the main entrance. The tag is a red symbol. Suspect identified from anonymous tip.',
    evidence: [
      { id: 'ev-3', name: 'graffiti.jpg', url: 'https://picsum.photos/seed/graffiti/800/600', type: 'image', uploadedBy: 'Jane Doe', timestamp: '2024-07-20T22:32', description: 'Photo of the graffiti on the wall.' }
    ],
    internalNotes: [
        { text: 'Anonymous tip received pointing to Mikey Adams. Matched tag style to subject\'s social media posts. Subject confessed upon questioning.', author: 'Officer Rodriguez', timestamp: '2024-07-25T16:30' }
    ]
  },
  {
    id: 2024004,
    firNumber: 'FIR-004-24',
    firDate: '2024-06-15T18:00',
    caseType: 'Assault',
    status: 'Closed',
    policeStation: 'Central Precinct',
    investigatingOfficer: 'Det. Miller',
    complainant: { role: 'Victim', name: 'Peter Jones', address: '321 Birch St', contact: '555-0106' },
    involvedPersons: [],
    courtDetails: undefined,
    hearings: [],
    location: { address: 'Downtown Alley', lat: 34.0500, lng: -118.2400 },
    tags: ['assault', 'closed', 'unidentified-suspect'],
    description: 'Victim was mugged and pushed to the ground by an unknown assailant. Wallet and phone were stolen. Victim sustained minor injuries.',
    evidence: [],
    internalNotes: [
        { text: 'No witnesses found. No CCTV in the area. Suspect remains unidentified. Case closed due to lack of leads.', author: 'Det. Miller', timestamp: '2024-07-10T10:00' }
    ]
  }
];
