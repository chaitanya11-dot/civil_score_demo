export interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
}

export type User = {
  id: string;
  type: 'citizen' | 'police';
  name?: string;
  email?: string;
  imageUrl?: string;
};

export type ActivityLog = {
  id: string;
  activities: {
    date: string;
    description: string;
    points: number;
  }[];
};

// --- NEW/UPDATED TYPES FOR POLICE PORTAL ---

export interface Person {
  role: 'Complainant' | 'Accused' | 'Witness' | 'Victim';
  name: string;
  address: string;
  contact: string;
  statement?: string;
  aadhaarId?: string;
}

export interface CourtDetails {
  courtName: string;
  caseNumber: string;
  judge: string;
  prosecutor: string;
  defenseLawyer: string;
}

export interface Hearing {
  date: string;
  summary: string;
  nextHearingDate?: string;
}

export interface Evidence {
  id: string;
  name: string;
  url: string; // Blob URL or remote URL
  type: 'image' | 'document' | 'audio' | 'video' | 'other';
  uploadedBy: string; // uploader_id (e.g., 'Officer Smith')
  timestamp: string;
  description: string;
  ocrText?: string;
}

export interface Note {
  text: string;
  author: string;
  timestamp: string;
}

export type CaseStatus = 
  | 'Reported' 
  | 'Under Investigation' 
  | 'Charge Sheet Filed' 
  | 'In Trial' 
  | 'Convicted' 
  | 'Acquitted' 
  | 'Closed';

export interface CriminalCase {
  id: number; // case_id
  firNumber: string;
  firDate: string;
  caseType: string;
  status: CaseStatus;
  policeStation: string;
  investigatingOfficer: string;
  complainant: Person;
  involvedPersons: Person[];
  courtDetails?: CourtDetails;
  hearings: Hearing[];
  nextHearingDate?: string;
  location: {
    address: string;
    lat?: number;
    lng?: number;
  };
  tags: string[];
  description: string;
  evidence: Evidence[];
  internalNotes: Note[];
}