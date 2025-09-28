import React, { useState } from 'react';
import { AlertTriangle, FileText, MapPin, Calendar, Camera, Info } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { CriminalCase, Evidence, Person } from '../types';

const ReportCrime: React.FC = () => {
    // State for form fields
    const [caseType, setCaseType] = useState('Theft');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [dateTime, setDateTime] = useState('');
    const [evidenceFile, setEvidenceFile] = useState<File | null>(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [suspectName, setSuspectName] = useState('');
    const [suspectAadhaar, setSuspectAadhaar] = useState('');
    const { user } = useAuth();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setEvidenceFile(e.target.files[0]);
            // Also clear the input value to allow re-uploading the same file
            e.target.value = '';
        }
    };

    const formatAadhaar = (value: string) => {
        const cleaned = value.replace(/\D/g, '');
        const match = cleaned.match(/^(\d{0,4})(\d{0,4})(\d{0,4})$/);
        if (!match) return cleaned;
        return [match[1], match[2], match[3]].filter(Boolean).join(' ');
    };

    const handleAadhaarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatAadhaar(e.target.value);
        setSuspectAadhaar(formatted);
    };


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const newEvidence: Evidence[] = [];
        const timestamp = new Date().toISOString();
        if (evidenceFile) {
            newEvidence.push({
                id: `evidence-${Date.now()}`,
                name: evidenceFile.name,
                url: URL.createObjectURL(evidenceFile),
                type: evidenceFile.type.startsWith('image/') ? 'image' : 'document',
                uploadedBy: user?.name || 'Citizen Reporter',
                timestamp: timestamp,
                description: 'Initial evidence submitted with report.'
            });
        }

        const complainant: Person = {
            role: 'Complainant',
            name: user?.name || 'Citizen User',
            address: 'N/A',
            contact: user?.email || 'N/A',
        };

        const involved: Person[] = [];
        if (suspectName.trim() !== '') {
            const accused: Person = {
                role: 'Accused',
                name: suspectName.trim(),
                address: 'N/A',
                contact: 'N/A',
                aadhaarId: suspectAadhaar.replace(/\s/g, ''),
            };
            involved.push(accused);
        }

        const newCase: CriminalCase = {
            id: Date.now(),
            firNumber: `FIR-${Date.now().toString().slice(-6)}`,
            firDate: dateTime,
            caseType: caseType,
            status: 'Reported',
            policeStation: 'Central Precinct',
            investigatingOfficer: 'Unassigned',
            complainant,
            involvedPersons: involved,
            hearings: [],
            location: { address: location },
            tags: [caseType],
            description,
            evidence: newEvidence,
            internalNotes: [],
        };
        
        try {
            const storedCasesRaw = localStorage.getItem('policeCases');
            const existingCases: CriminalCase[] = storedCasesRaw ? JSON.parse(storedCasesRaw) : [];
            const updatedCases = [newCase, ...existingCases]; // Prepend new case
            localStorage.setItem('policeCases', JSON.stringify(updatedCases));
        } catch (error) {
            console.error("Failed to save new case to localStorage", error);
        }

        setIsSubmitted(true);
    };
    
    // A success message view after submission
    if (isSubmitted) {
        return (
             <div className="flex flex-col items-center justify-center text-center max-w-2xl mx-auto py-12 animate-fade-in">
                <div className="inline-block bg-primary-100 p-4 rounded-full">
                    <FileText className="h-10 w-10 text-primary-600" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mt-4">Report Submitted</h1>
                <p className="text-gray-500 mt-2 mb-8">
                    Thank you. Your report has been registered as a new case and forwarded to the Police Portal for review.
                </p>
                <button
                    onClick={() => {
                        // Reset form state for a new report
                        setIsSubmitted(false);
                        setCaseType('Theft');
                        setDescription('');
                        setLocation('');
                        setDateTime('');
                        setEvidenceFile(null);
                        setSuspectName('');
                        setSuspectAadhaar('');
                    }}
                    className="mt-6 bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-6 rounded-lg transition-transform transform hover:scale-105"
                >
                    Submit Another Report
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto animate-fade-in-up">
            <div className="text-center mb-8">
                <div className="inline-block bg-red-100 p-3 rounded-full">
                    <AlertTriangle className="h-8 w-8 text-red-500" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mt-4">Report an Incident</h1>
                <p className="text-gray-500 mt-1">Help keep your community safe. Please provide as much detail as possible.</p>
            </div>
            
            <div className="bg-red-50 border-l-4 border-red-400 text-red-800 p-4 rounded-md mb-8" role="alert">
              <div className="flex">
                <div className="py-1"><Info className="h-5 w-5 mr-3"/></div>
                <div>
                  <p className="font-bold">Important Notice</p>
                  <p className="text-sm">This form is for non-emergency incidents only. For emergencies, please contact your local authorities immediately.</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="case-type" className="block text-sm font-medium text-gray-700 mb-1.5">Type of Incident</label>
                        <select 
                            id="case-type" 
                            name="case-type" 
                            value={caseType}
                            onChange={(e) => setCaseType(e.target.value)}
                            className="block w-full pl-3 pr-10 py-2 text-base bg-gray-50 border-gray-300 focus:outline-none sm:text-sm rounded-md shadow-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition duration-200 text-gray-900"
                        >
                            <option>Theft</option>
                            <option>Vandalism</option>
                            <option>Public Nuisance</option>
                            <option>Traffic Violation</option>
                            <option>Assault</option>
                            <option>Other</option>
                        </select>
                    </div>
                    
                    <div className="relative">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                        <FileText className="absolute top-10 left-3 h-5 w-5 text-gray-400 pointer-events-none" />
                        <textarea
                            id="description"
                            name="description"
                            rows={4}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                            placeholder="Provide a detailed account of the incident..."
                            className="pl-10 block w-full shadow-sm sm:text-sm bg-gray-50 border-gray-300 rounded-md focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition duration-200 text-gray-900"
                        />
                    </div>

                    <div className="relative">
                        <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1.5">Location</label>
                        <MapPin className="absolute top-10 left-3 h-5 w-5 text-gray-400 pointer-events-none" />
                        <input
                            type="text"
                            id="location"
                            name="location"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            required
                            placeholder="e.g., Corner of Main St and Park Ave"
                            className="pl-10 block w-full shadow-sm sm:text-sm bg-gray-50 border-gray-300 rounded-md focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition duration-200 text-gray-900"
                        />
                    </div>
                    
                    <div className="relative">
                        <label htmlFor="datetime" className="block text-sm font-medium text-gray-700 mb-1.5">Date and Time</label>
                        <Calendar className="absolute top-10 left-3 h-5 w-5 text-gray-400 pointer-events-none" />
                        <input
                            type="datetime-local"
                            id="datetime"
                            name="datetime"
                            value={dateTime}
                            onChange={(e) => setDateTime(e.target.value)}
                            required
                            className="pl-10 block w-full shadow-sm sm:text-sm bg-gray-50 border-gray-300 rounded-md focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition duration-200 text-gray-900"
                        />
                    </div>
                    
                    <div>
                        <h3 className="text-base font-medium text-gray-800">Suspect Details (Optional)</h3>
                        <p className="text-sm text-gray-500 mb-4 mt-1">If you know the identity of the person(s) involved, please provide their details below.</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                            <div>
                                <label htmlFor="suspect-name" className="block text-sm font-medium text-gray-700 mb-1.5">Suspect's Name</label>
                                <input
                                    type="text"
                                    id="suspect-name"
                                    name="suspect-name"
                                    value={suspectName}
                                    onChange={(e) => setSuspectName(e.target.value)}
                                    placeholder="e.g., John Doe"
                                    className="block w-full shadow-sm sm:text-sm bg-gray-50 border-gray-300 rounded-md focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition duration-200 text-gray-900"
                                />
                            </div>
                            <div>
                                <label htmlFor="suspect-aadhaar" className="block text-sm font-medium text-gray-700 mb-1.5">Suspect's Aadhaar Number</label>
                                <input
                                    type="text"
                                    id="suspect-aadhaar"
                                    name="suspect-aadhaar"
                                    value={suspectAadhaar}
                                    onChange={handleAadhaarChange}
                                    placeholder="XXXX XXXX XXXX"
                                    maxLength={14}
                                    className="block w-full shadow-sm sm:text-sm bg-gray-50 border-gray-300 rounded-md focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition duration-200 text-gray-900"
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Attach Evidence (Optional)</label>
                        <div className="mt-1.5 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                            <div className="space-y-1 text-center">
                                <Camera className="mx-auto h-12 w-12 text-gray-400" />
                                <div className="flex text-sm text-gray-600 justify-center">
                                    <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-700 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500">
                                        <span>Upload a file</span>
                                        <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} />
                                    </label>
                                    <p className="pl-1">or drag and drop</p>
                                </div>
                                <p className="text-xs text-gray-500">Photos, documents, etc.</p>
                                {evidenceFile && <p className="text-xs text-gray-500 mt-1 font-semibold">Selected: {evidenceFile.name}</p>}
                            </div>
                        </div>
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200 active:scale-95"
                        >
                            Submit Report
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ReportCrime;