import React, { useState, useRef, useEffect } from 'react';
import { BookUser, Calendar, Files, Gavel, Scale, User, Users, FileText, Check, X, ShieldCheck, Search, Info, Filter, Upload, ZoomIn, ArrowDownUp, Bot, Loader2, Clipboard, Edit, Trash2, PlusCircle } from 'lucide-react';
import { CriminalCase, Note, Evidence, CaseStatus, Person } from '../types';
// Fix: Changed import from non-existent 'data/cases' to the repurposed 'data/incidents'
import { initialCasesData } from '../data/incidents';
import { extractTextFromImage } from '../services/geminiService';

const statusColors: Record<CaseStatus, { bg: string, text: string, border: string }> = {
  'Reported': { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-200' },
  'Under Investigation': { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200' },
  'Charge Sheet Filed': { bg: 'bg-indigo-100', text: 'text-indigo-800', border: 'border-indigo-200' },
  'In Trial': { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-200' },
  'Convicted': { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200' },
  'Acquitted': { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200' },
  'Closed': { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-200' },
};

const getInitialCases = (): CriminalCase[] => {
  try {
    const storedCases = localStorage.getItem('policeCases');
    if (storedCases) {
      return JSON.parse(storedCases);
    }
    localStorage.setItem('policeCases', JSON.stringify(initialCasesData));
    return initialCasesData;
  } catch (error) {
    console.error("Failed to load cases from localStorage", error);
    return initialCasesData;
  }
};

const fileToB64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = error => reject(error);
    });
};

// --- New Case Modal Component ---
const initialNewCaseState = {
    firNumber: '',
    firDate: '',
    caseType: 'Theft',
    policeStation: 'Central Precinct',
    investigatingOfficer: '',
    complainant: { role: 'Complainant' as const, name: '', address: '', contact: '' },
    location: { address: '' },
    tags: '', // Will be a string, then parsed
    description: '',
};

type NewCaseData = typeof initialNewCaseState;

interface NewCaseModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (newCaseData: Omit<CriminalCase, 'id' | 'status' | 'involvedPersons' | 'hearings' | 'evidence' | 'internalNotes'> & { complainant: Person }) => void;
}

const NewCaseModal: React.FC<NewCaseModalProps> = ({ isOpen, onClose, onSave }) => {
    const [formData, setFormData] = useState<NewCaseData>(initialNewCaseState);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name.startsWith('complainant.')) {
            const key = name.split('.')[1] as keyof Person;
            setFormData(prev => ({ ...prev, complainant: { ...prev.complainant, [key]: value } }));
        } else if (name === 'location.address') {
            setFormData(prev => ({ ...prev, location: { address: value } }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const caseToSave = {
            ...formData,
            tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        };
        onSave(caseToSave);
        setFormData(initialNewCaseState); // Reset form for next time
    };

    if (!isOpen) return null;

    const FormInput: React.FC<{ label: string; name: string; value: string; onChange: any; required?: boolean; type?: string; placeholder?: string; className?: string }> = 
      ({ label, name, value, onChange, required = false, type = 'text', placeholder, className }) => (
        <div className={className}>
          <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
          <input type={type} id={name} name={name} value={value} onChange={onChange} required={required} placeholder={placeholder} className="block w-full text-sm shadow-sm bg-gray-50 border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
        </div>
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 animate-fade-in" onMouseDown={onClose}>
            <div className="bg-white rounded-lg shadow-xl p-0 w-full max-w-3xl mx-4 transform transition-all animate-scale-up" onMouseDown={e => e.stopPropagation()}>
                <div className="flex justify-between items-center border-b p-4">
                    <h3 className="text-xl font-semibold text-gray-900 flex items-center"><PlusCircle size={20} className="mr-2 text-blue-500" />Create New Criminal Case</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={24}/></button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="max-h-[70vh] overflow-y-auto p-6 space-y-6">
                        <fieldset>
                            <legend className="text-lg font-semibold text-gray-800 mb-3">Case Information</legend>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormInput label="FIR Number" name="firNumber" value={formData.firNumber} onChange={handleChange} required placeholder="e.g., FIR-123-24" />
                                <FormInput label="FIR Date & Time" name="firDate" value={formData.firDate} onChange={handleChange} required type="datetime-local" />
                                <div>
                                    <label htmlFor="caseType" className="block text-sm font-medium text-gray-700 mb-1">Case Type</label>
                                    <select id="caseType" name="caseType" value={formData.caseType} onChange={handleChange} className="block w-full text-sm shadow-sm bg-gray-50 border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                                        <option>Theft</option><option>Vandalism</option><option>Public Nuisance</option><option>Traffic Violation</option><option>Assault</option><option>Other</option>
                                    </select>
                                </div>
                                <FormInput label="Police Station" name="policeStation" value={formData.policeStation} onChange={handleChange} required />
                                <FormInput label="Investigating Officer" name="investigatingOfficer" value={formData.investigatingOfficer} onChange={handleChange} required placeholder="e.g., Det. Miller" />
                            </div>
                        </fieldset>

                        <fieldset>
                            <legend className="text-lg font-semibold text-gray-800 mb-3">Complainant Details</legend>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormInput label="Name" name="complainant.name" value={formData.complainant.name} onChange={handleChange} required />
                                <FormInput label="Contact Info" name="complainant.contact" value={formData.complainant.contact} onChange={handleChange} required placeholder="Phone or email" />
                                <FormInput label="Address" name="complainant.address" value={formData.complainant.address} onChange={handleChange} required className="md:col-span-2" />
                            </div>
                        </fieldset>

                        <fieldset>
                            <legend className="text-lg font-semibold text-gray-800 mb-3">Incident Details</legend>
                            <div className="space-y-4">
                                <FormInput label="Location" name="location.address" value={formData.location.address} onChange={handleChange} required placeholder="e.g., Corner of Main St & Park Ave" />
                                <div>
                                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description of Incident</label>
                                    <textarea id="description" name="description" value={formData.description} onChange={handleChange} required rows={4} className="block w-full text-sm shadow-sm bg-gray-50 border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500"></textarea>
                                </div>
                                <FormInput label="Tags" name="tags" value={formData.tags} onChange={handleChange} placeholder="theft, public-property, high-value" />
                            </div>
                        </fieldset>
                    </div>
                    <div className="flex justify-end items-center border-t p-4 bg-gray-50 rounded-b-lg">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md mr-3 hover:bg-gray-50 font-semibold text-sm">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 text-sm">Create Case</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// --- Evidence Edit Modal Component ---
interface EvidenceEditModalProps {
    evidence: Evidence;
    onClose: () => void;
    onSave: (evidenceId: string, newDescription: string, newOcrText: string) => void;
}

const EvidenceEditModal: React.FC<EvidenceEditModalProps> = ({ evidence, onClose, onSave }) => {
    const [description, setDescription] = useState(evidence.description);
    const [ocrText, setOcrText] = useState(evidence.ocrText || '');

    const handleSave = () => {
        onSave(evidence.id, description, ocrText);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 animate-fade-in" onMouseDown={onClose}>
            <div className="bg-white rounded-lg shadow-xl p-0 w-full max-w-2xl mx-4 transform transition-all animate-scale-up" onMouseDown={e => e.stopPropagation()}>
                <div className="flex justify-between items-center border-b p-4">
                    <h3 className="text-xl font-semibold text-gray-900 flex items-center"><Edit size={20} className="mr-2 text-blue-500" />Edit Evidence Details</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={24}/></button>
                </div>
                <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                    <p className="font-semibold text-gray-700">File: <span className="text-blue-600 font-medium">{evidence.name}</span></p>
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            id="description"
                            rows={3}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Add a description for this piece of evidence..."
                            className="block w-full text-sm shadow-sm bg-gray-50 border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="ocrText" className="block text-sm font-medium text-gray-700 mb-1">AI Extracted Text (OCR)</label>
                        <textarea
                            id="ocrText"
                            rows={6}
                            value={ocrText}
                            onChange={(e) => setOcrText(e.target.value)}
                            placeholder="Text extracted by AI will appear here. You can edit it if needed."
                            className="block w-full text-sm shadow-sm bg-gray-50 border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-mono"
                        />
                    </div>
                </div>
                 <div className="flex justify-end items-center border-t p-4 bg-gray-50 rounded-b-lg">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md mr-3 hover:bg-gray-50 font-semibold text-sm">Cancel</button>
                    <button type="button" onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 text-sm">Save Changes</button>
                </div>
            </div>
        </div>
    );
};


const PoliceDashboard: React.FC = () => {
  const [cases, setCases] = useState<CriminalCase[]>(getInitialCases);
  const [selectedCase, setSelectedCase] = useState<CriminalCase | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'info' | 'error', message: string } | null>(null);
  const [newNote, setNewNote] = useState('');
  const [filterStatus, setFilterStatus] = useState<CaseStatus | 'All'>('All');
  const [sortBy, setSortBy] = useState<'firDate' | 'caseType'>('firDate');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [isNewCaseModalOpen, setIsNewCaseModalOpen] = useState(false);
  const [editingEvidence, setEditingEvidence] = useState<Evidence | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editableCase, setEditableCase] = useState<CriminalCase | null>(null);
  const [isCourtDetailsEditMode, setIsCourtDetailsEditMode] = useState(false);
  const [editableCourtDetails, setEditableCourtDetails] = useState(selectedCase?.courtDetails);
  const [newHearing, setNewHearing] = useState({ date: '', summary: '', nextHearingDate: '' });


  const [ocrState, setOcrState] = useState<{
      isOpen: boolean;
      isLoading: boolean;
      result: string | null;
      error: string | null;
      evidence?: Evidence;
  }>({ isOpen: false, isLoading: false, result: null, error: null });

  useEffect(() => {
    try {
        localStorage.setItem('policeCases', JSON.stringify(cases));
    } catch (error) {
        console.error("Failed to save cases to localStorage", error);
    }
  }, [cases]);

  useEffect(() => {
    if (selectedCase) {
        const updatedCase = cases.find(c => c.id === selectedCase.id);
        setSelectedCase(updatedCase || null);
        if (isEditMode) {
          setEditableCase(updatedCase || null);
        }
        setEditableCourtDetails(updatedCase?.courtDetails);
    }
  }, [cases, selectedCase?.id, isEditMode]);


  const filteredCases = cases
    .filter(c => filterStatus === 'All' || c.status === filterStatus)
    .filter(c => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      return (
        c.description.toLowerCase().includes(q) ||
        c.location.address.toLowerCase().includes(q) ||
        c.complainant.name.toLowerCase().includes(q) ||
        c.caseType.toLowerCase().includes(q) ||
        c.firNumber.toLowerCase().includes(q) ||
        c.involvedPersons.some(p => p.name.toLowerCase().includes(q)) ||
        String(c.id).includes(q)
      );
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'caseType':
          return a.caseType.localeCompare(b.caseType);
        case 'firDate':
        default:
          return new Date(b.firDate).getTime() - new Date(a.firDate).getTime();
      }
    });

  const handleStatusChange = (caseId: number, newStatus: CaseStatus) => {
    setCases(prev => prev.map(c => c.id === caseId ? { ...c, status: newStatus } : c));
    setNotification({ type: 'info', message: `Case #${caseId} status updated to "${newStatus}".` });
    setTimeout(() => setNotification(null), 4000);
  };
  
  const handleAddNote = () => {
    if (!selectedCase || newNote.trim() === '') return;
    const noteToAdd: Note = {
      text: newNote,
      author: 'Officer Smith',
      timestamp: new Date().toISOString(),
    };
    setCases(prev => prev.map(c => c.id === selectedCase.id ? { ...c, internalNotes: [...c.internalNotes, noteToAdd] } : c));
    setNewNote('');
  };

  const handleEvidenceUploadClick = () => fileInputRef.current?.click();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || !selectedCase) return;

    const files = Array.from(event.target.files);
    // FIX: Explicitly type the 'file' parameter as 'File' to correct a type inference issue where it was being treated as 'unknown'.
    const newEvidenceList: Evidence[] = files.map((file: File) => ({
        id: `evidence-${Date.now()}-${Math.random()}`,
        name: file.name,
        url: URL.createObjectURL(file),
        type: file.type.startsWith('image/') ? 'image' : (file.type.startsWith('application/pdf') ? 'document' : (file.type.startsWith('audio/') ? 'audio' : (file.type.startsWith('video/') ? 'video' : 'other'))),
        uploadedBy: 'Officer Smith',
        timestamp: new Date().toISOString(),
        description: ''
    }));

    setCases(prev => prev.map(c => c.id === selectedCase.id ? { ...c, evidence: [...c.evidence, ...newEvidenceList] } : c));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };
  
  const handleRemoveEvidence = (evidenceId: string) => {
    if (!selectedCase) return;
    const evidenceToRemove = selectedCase.evidence.find(e => e.id === evidenceId);
    if (evidenceToRemove?.url.startsWith('blob:')) {
      URL.revokeObjectURL(evidenceToRemove.url);
    }
    setCases(prev => prev.map(c => c.id === selectedCase.id ? { ...c, evidence: c.evidence.filter(e => e.id !== evidenceId) } : c));
  };

  const handleSaveEvidenceDetails = (evidenceId: string, newDescription: string, newOcrText: string) => {
    if (!selectedCase) return;
    setCases(prevCases => prevCases.map(c => 
        c.id === selectedCase.id 
        ? {
            ...c,
            evidence: c.evidence.map(e => 
                e.id === evidenceId ? { ...e, description: newDescription, ocrText: newOcrText } : e
            )
        }
        : c
    ));
    setEditingEvidence(null); // Close modal
    setNotification({ type: 'success', message: 'Evidence details updated successfully.' });
    setTimeout(() => setNotification(null), 4000);
};
  
  const handleOcrClick = async (evidence: Evidence) => {
    if (!evidence.url.startsWith('blob:')) {
        setOcrState({ isOpen: true, isLoading: false, result: null, error: 'OCR only available for newly uploaded images.', evidence});
        return;
    }
    setOcrState({ isOpen: true, isLoading: true, result: null, error: null, evidence });

    try {
        const response = await fetch(evidence.url);
        const blob = await response.blob();
        const file = new File([blob], evidence.name, { type: blob.type });
        const base64Data = await fileToB64(file);
        
        const ocrResult = await extractTextFromImage(base64Data, file.type);
        setOcrState(s => s.isOpen ? { ...s, isLoading: false, result: ocrResult } : s);
        
        // Save OCR result to state automatically
        if (selectedCase) {
            setCases(prevCases => prevCases.map(c => 
                c.id === selectedCase.id 
                ? { ...c, evidence: c.evidence.map(e => e.id === evidence.id ? { ...e, ocrText: ocrResult } : e) } 
                : c
            ));
        }
    } catch (err) {
        console.error(err);
        setOcrState(s => s.isOpen ? { ...s, isLoading: false, error: 'Failed to process image with AI.' } : s);
    }
  };

  const handleSaveNewCase = (newCaseData: Omit<CriminalCase, 'id' | 'status' | 'involvedPersons' | 'hearings' | 'evidence' | 'internalNotes'> & { complainant: Person }) => {
    const newCase: CriminalCase = {
        ...newCaseData,
        id: Date.now(),
        status: 'Under Investigation', // Default status
        involvedPersons: [],
        hearings: [],
        evidence: [],
        internalNotes: [],
    };
    setCases(prev => [newCase, ...prev]);
    setIsNewCaseModalOpen(false);
    setSelectedCase(newCase);
    setNotification({ type: 'success', message: `New case ${newCase.firNumber} created successfully.` });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleToggleEditMode = () => {
    if (isEditMode && editableCase) {
        // Save changes
        setCases(prevCases => prevCases.map(c => c.id === editableCase.id ? editableCase : c));
        setNotification({ type: 'success', message: 'Case details updated.' });
        setTimeout(() => setNotification(null), 4000);
    }
    setIsEditMode(!isEditMode);
  };

  const handleEditableCaseChange = (field: keyof CriminalCase, value: any) => {
    if (editableCase) {
        if (field === 'location') {
            setEditableCase({ ...editableCase, location: { address: value } });
        } else if (field === 'tags') {
            setEditableCase({ ...editableCase, tags: value.split(',').map((t:string) => t.trim()) });
        } else {
            setEditableCase({ ...editableCase, [field]: value });
        }
    }
  };

  const handleSaveCourtDetails = () => {
    if (!selectedCase) return;
    setCases(prev => prev.map(c => 
        c.id === selectedCase.id ? { ...c, courtDetails: editableCourtDetails } : c
    ));
    setIsCourtDetailsEditMode(false);
    setNotification({ type: 'success', message: 'Court details updated.' });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleAddHearing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCase || !newHearing.date || !newHearing.summary) return;
    setCases(prev => prev.map(c => 
        c.id === selectedCase.id ? { ...c, hearings: [...c.hearings, newHearing], nextHearingDate: newHearing.nextHearingDate || c.nextHearingDate } : c
    ));
    setNewHearing({ date: '', summary: '', nextHearingDate: '' });
  };


  const tabs = [
    { id: 'overview', label: 'Overview', icon: Scale },
    { id: 'people', label: 'Involved Persons', icon: Users },
    { id: 'evidence', label: 'Evidence Locker', icon: Files },
    { id: 'proceedings', label: 'Court Proceedings', icon: Gavel },
    { id: 'notes', label: 'Case Log', icon: BookUser },
  ];

  return (
    <>
      <input type="file" ref={fileInputRef} onChange={handleFileChange} multiple accept="image/*,video/*,audio/*,.pdf" className="hidden" />
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Criminal Case Management</h1>
           <div className="flex items-center gap-4">
            <button
                onClick={() => setIsNewCaseModalOpen(true)}
                className="flex items-center px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg shadow-sm hover:bg-blue-700 transition-colors active:scale-95"
            >
              <PlusCircle size={18} className="mr-2" />
              New Case
            </button>
            <div className="relative">
              <input type="text" placeholder="Search cases..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-72 pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
           </div>
        </div>
        
        {notification && (
          <div className={`mb-4 p-4 rounded-lg flex items-start animate-fade-in ${notification.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : notification.type === 'error' ? 'bg-red-50 border-red-200 text-red-800' : 'bg-blue-50 border-blue-200 text-blue-800'}`}>
            <Info size={20} className="mr-3 mt-0.5" />
            <p className="flex-1">{notification.message}</p>
            <button onClick={() => setNotification(null)} className="ml-4"><X size={18} /></button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Case List */}
          <div className="lg:col-span-1 bg-white p-4 rounded-lg shadow-md border border-gray-200 h-fit">
            <h2 className="text-lg font-semibold text-gray-800 border-b pb-3 mb-3">Case Queue ({filteredCases.length})</h2>
              <div className="flex gap-2 mb-3">
                <div className="relative flex-1">
                    <select value={filterStatus} onChange={e => setFilterStatus(e.target.value as any)} className="w-full text-sm bg-gray-100 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 pl-8" aria-label="Filter by status">
                        <option value="All">All Statuses</option>
                        {Object.keys(statusColors).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <Filter className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500"/>
                  </div>
                  <div className="relative flex-1">
                    <select value={sortBy} onChange={e => setSortBy(e.target.value as any)} className="w-full text-sm bg-gray-100 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 pl-8" aria-label="Sort cases">
                        <option value="firDate">Sort: Newest</option>
                        <option value="caseType">Sort: Type</option>
                    </select>
                    <ArrowDownUp className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500"/>
                  </div>
              </div>
            <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-2">
              {filteredCases.length > 0 ? filteredCases.map(c => (
                  <button key={c.id} onClick={() => { setSelectedCase(c); setActiveTab('overview'); setIsEditMode(false); setEditableCase(c); }} className={`w-full text-left p-3 rounded-lg border-2 transition-all ${selectedCase?.id === c.id ? 'bg-blue-50 border-blue-500 shadow' : 'bg-gray-50 border-gray-200 hover:border-blue-400 hover:bg-white'}`}>
                    <div className="flex justify-between items-start mb-1">
                        <p className="font-semibold text-gray-800">{c.firNumber} - {c.caseType}</p>
                    </div>
                    <p className="text-sm text-gray-500 mb-2">{c.location.address}</p>
                    <div className="flex justify-between items-center">
                        <p className="text-xs text-gray-400">Date: {new Date(c.firDate).toLocaleDateString()}</p>
                        <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${statusColors[c.status].bg} ${statusColors[c.status].text}`}>{c.status}</span>
                    </div>
                  </button>
              )) : (
                <div className="text-center py-10 text-gray-500"><ShieldCheck size={32} className="mx-auto text-green-500" /><p className="mt-2 font-medium">No cases match filters.</p></div>
              )}
            </div>
          </div>

          {/* Case Details */}
          <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md border border-gray-200 min-h-[80vh]">
            {selectedCase ? (
              <div className="animate-fade-in">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-1">{selectedCase.firNumber}</h2>
                    <p className="text-gray-500">Case ID: #{selectedCase.id}</p>
                  </div>
                  <select value={selectedCase.status} onChange={(e) => handleStatusChange(selectedCase.id, e.target.value as CaseStatus)} className={`text-sm font-semibold rounded-full px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 border ${statusColors[selectedCase.status].border} ${statusColors[selectedCase.status].bg} ${statusColors[selectedCase.status].text}`}>
                      {Object.keys(statusColors).map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                
                <div className="border-b border-gray-200 my-4">
                  <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                    {tabs.map(tab => (
                      <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`${activeTab === tab.id ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} group inline-flex items-center py-3 px-1 border-b-2 font-medium text-sm transition-colors`}>
                        <tab.icon className="-ml-0.5 mr-2 h-5 w-5" /><span>{tab.label}</span>
                      </button>
                    ))}
                  </nav>
                </div>

                {/* Tab Content */}
                <div className="mt-4">
                    {activeTab === 'overview' && (
                        <div className="space-y-4 animate-fade-in">
                           <div className="flex justify-between items-center">
                                <h3 className="text-lg font-semibold text-gray-800">Case Overview</h3>
                                <button onClick={handleToggleEditMode} className={`flex items-center px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${isEditMode ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                                  {isEditMode ? <><Check size={16} className="mr-1.5"/> Save Changes</> : <><Edit size={14} className="mr-1.5"/> Edit Details</>}
                                </button>
                           </div>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                {isEditMode && editableCase ? (
                                    <>
                                        <div><strong className="font-medium text-gray-600 block mb-1">Type:</strong> <input type="text" value={editableCase.caseType} onChange={e => handleEditableCaseChange('caseType', e.target.value)} className="w-full text-sm p-1 border rounded-md" /></div>
                                        <div><strong className="font-medium text-gray-600 block mb-1">Officer:</strong> <input type="text" value={editableCase.investigatingOfficer} onChange={e => handleEditableCaseChange('investigatingOfficer', e.target.value)} className="w-full text-sm p-1 border rounded-md" /></div>
                                        <div className="md:col-span-2"><strong className="font-medium text-gray-600 block mb-1">Location:</strong> <input type="text" value={editableCase.location.address} onChange={e => handleEditableCaseChange('location', e.target.value)} className="w-full text-sm p-1 border rounded-md" /></div>
                                        <div className="md:col-span-2"><strong className="font-medium text-gray-600 block mb-1">Description:</strong> <textarea value={editableCase.description} onChange={e => handleEditableCaseChange('description', e.target.value)} rows={3} className="w-full text-sm p-1 border rounded-md" /></div>
                                        <div className="md:col-span-2"><strong className="font-medium text-gray-600 block mb-1">Tags:</strong> <input type="text" value={editableCase.tags.join(', ')} onChange={e => handleEditableCaseChange('tags', e.target.value)} className="w-full text-sm p-1 border rounded-md" /></div>
                                    </>
                                ) : (
                                    <>
                                        <p><strong className="font-medium text-gray-600">Type:</strong> {selectedCase.caseType}</p>
                                        <p><strong className="font-medium text-gray-600">FIR Date:</strong> {new Date(selectedCase.firDate).toLocaleString()}</p>
                                        <p><strong className="font-medium text-gray-600">Police Station:</strong> {selectedCase.policeStation}</p>
                                        <p><strong className="font-medium text-gray-600">Investigating Officer:</strong> {selectedCase.investigatingOfficer}</p>
                                        <p className="md:col-span-2"><strong className="font-medium text-gray-600">Location:</strong> {selectedCase.location.address}</p>
                                        <h4 className="font-semibold text-gray-700 pt-2 md:col-span-2">Description</h4>
                                        <p className="md:col-span-2 bg-gray-50 p-3 rounded-md border border-gray-200 text-gray-800 text-sm">{selectedCase.description}</p>
                                    </>
                                )}
                           </div>
                        </div>
                    )}
                    {activeTab === 'people' && (
                        <div className="space-y-4 animate-fade-in">
                            <h3 className="text-lg font-semibold text-gray-800">Involved Persons</h3>
                            {[selectedCase.complainant, ...selectedCase.involvedPersons].map((p, i) => (
                                <div key={i} className="p-3 bg-gray-50 border rounded-lg">
                                    <p className="font-semibold">{p.name} <span className="text-xs bg-gray-200 text-gray-700 font-medium px-2 py-0.5 rounded-full ml-2">{p.role}</span></p>
                                    <p className="text-sm text-gray-600">{p.address} | {p.contact}</p>
                                </div>
                            ))}
                        </div>
                    )}
                    {activeTab === 'evidence' && (
                        <div className="animate-fade-in">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold text-gray-800">Evidence Locker</h3>
                                <button onClick={handleEvidenceUploadClick} className="flex items-center px-3 py-1.5 text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 transition-colors"><Upload size={14} className="mr-2"/>Upload</button>
                            </div>
                             {selectedCase.evidence.length > 0 ? (
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                  {selectedCase.evidence.map(item => (
                                    <div key={item.id} className="relative group text-center">
                                      <div className="relative w-full h-24 bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200 group-hover:border-blue-500 transition-all">
                                        {item.type === 'image' ? <img src={item.url} alt={item.name} className="w-full h-full object-cover" /> : <div className="p-2 flex flex-col items-center justify-center h-full"><FileText className="h-8 w-8 text-gray-500"/><span className="text-xs mt-1 text-gray-600 break-words line-clamp-2">{item.name}</span></div> }
                                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity space-x-2" aria-hidden="true">
                                          {item.type === 'image' && <button title="Preview" onClick={() => setPreviewImage(item.url)} className="p-1.5 rounded-full hover:bg-white/20"><ZoomIn size={20} /></button>}
                                          {(item.type === 'image' || item.type === 'document') && <button title="Run AI OCR" onClick={() => handleOcrClick(item)} className="p-1.5 rounded-full hover:bg-white/20"><Bot size={20} /></button>}
                                          <button title="Edit Details" onClick={() => setEditingEvidence(item)} className="p-1.5 rounded-full hover:bg-white/20"><Edit size={20} /></button>
                                        </div>
                                      </div>
                                      <button onClick={() => handleRemoveEvidence(item.id)} className="absolute -top-1.5 -right-1.5 bg-red-600 text-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100" aria-label="Remove evidence"><X size={12} /></button>
                                    </div>
                                  ))}
                                </div>
                              ) : ( <div className="text-sm text-gray-500 italic bg-gray-50 p-4 rounded-md border text-center"><p>No evidence has been uploaded for this case.</p></div> )}
                        </div>
                    )}
                    {activeTab === 'proceedings' && (
                       <div className="animate-fade-in space-y-6">
                            <div>
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-semibold text-gray-800">Court Details</h3>
                                    <button onClick={() => setIsCourtDetailsEditMode(!isCourtDetailsEditMode)} className={`flex items-center px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${isCourtDetailsEditMode ? 'bg-gray-200 text-gray-800' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                                        {isCourtDetailsEditMode ? <><X size={14} className="mr-1.5"/> Cancel</> : <><Edit size={14} className="mr-1.5"/> Edit Details</>}
                                    </button>
                                </div>
                                {isCourtDetailsEditMode ? (
                                    <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg border">
                                        <input type="text" placeholder="Court Name" value={editableCourtDetails?.courtName || ''} onChange={e => setEditableCourtDetails(prev => ({...prev!, courtName: e.target.value}))} className="p-2 border rounded-md" />
                                        <input type="text" placeholder="Case Number" value={editableCourtDetails?.caseNumber || ''} onChange={e => setEditableCourtDetails(prev => ({...prev!, caseNumber: e.target.value}))} className="p-2 border rounded-md" />
                                        <input type="text" placeholder="Judge" value={editableCourtDetails?.judge || ''} onChange={e => setEditableCourtDetails(prev => ({...prev!, judge: e.target.value}))} className="p-2 border rounded-md" />
                                        <input type="text" placeholder="Prosecutor" value={editableCourtDetails?.prosecutor || ''} onChange={e => setEditableCourtDetails(prev => ({...prev!, prosecutor: e.target.value}))} className="p-2 border rounded-md" />
                                        <input type="text" placeholder="Defense Lawyer" value={editableCourtDetails?.defenseLawyer || ''} onChange={e => setEditableCourtDetails(prev => ({...prev!, defenseLawyer: e.target.value}))} className="p-2 border rounded-md col-span-2" />
                                        <button onClick={handleSaveCourtDetails} className="bg-blue-600 text-white rounded-md py-2 font-semibold col-span-2">Save Court Details</button>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm bg-gray-50 p-4 rounded-lg border">
                                        <p><strong className="font-medium">Court:</strong> {selectedCase.courtDetails?.courtName || 'N/A'}</p>
                                        <p><strong className="font-medium">Case #:</strong> {selectedCase.courtDetails?.caseNumber || 'N/A'}</p>
                                        <p><strong className="font-medium">Judge:</strong> {selectedCase.courtDetails?.judge || 'N/A'}</p>
                                        <p><strong className="font-medium">Prosecutor:</strong> {selectedCase.courtDetails?.prosecutor || 'N/A'}</p>
                                        <p className="col-span-2"><strong className="font-medium">Defense:</strong> {selectedCase.courtDetails?.defenseLawyer || 'N/A'}</p>
                                    </div>
                                )}
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Hearing Log</h3>
                                <div className="space-y-3 mb-4 max-h-48 overflow-y-auto pr-2">
                                    {selectedCase.hearings.length > 0 ? selectedCase.hearings.map((hearing, i) => (
                                        <div key={i} className="p-3 bg-gray-50 border rounded-lg text-sm">
                                            <p className="font-semibold">{new Date(hearing.date).toLocaleString()}</p>
                                            <p className="text-gray-700 my-1">{hearing.summary}</p>
                                            {hearing.nextHearingDate && <p className="text-xs font-medium text-blue-600">Next Hearing: {new Date(hearing.nextHearingDate).toLocaleString()}</p>}
                                        </div>
                                    )) : <p className="text-sm text-gray-500 italic">No hearings logged.</p>}
                                </div>
                                <form onSubmit={handleAddHearing} className="bg-gray-100 p-4 rounded-lg border space-y-3">
                                    <h4 className="font-semibold text-gray-700">Add New Hearing</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <input type="datetime-local" value={newHearing.date} onChange={e => setNewHearing(p => ({...p, date: e.target.value}))} required className="p-2 border rounded-md w-full" />
                                        <input type="datetime-local" value={newHearing.nextHearingDate} onChange={e => setNewHearing(p => ({...p, nextHearingDate: e.target.value}))} className="p-2 border rounded-md w-full" />
                                    </div>
                                    <textarea value={newHearing.summary} onChange={e => setNewHearing(p => ({...p, summary: e.target.value}))} required placeholder="Summary of proceedings..." rows={2} className="w-full p-2 border rounded-md"></textarea>
                                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-md py-2 font-semibold">Log Hearing</button>
                                </form>
                            </div>
                        </div>
                    )}
                    {activeTab === 'notes' && (
                        <div className="animate-fade-in">
                             <h3 className="text-lg font-semibold text-gray-800 mb-2">Internal Case Log</h3>
                              <div className="space-y-3 mb-4 max-h-60 overflow-y-auto bg-gray-50 p-3 rounded-md border border-gray-200">
                                {selectedCase.internalNotes.length > 0 ? selectedCase.internalNotes.map((note, index) => (
                                  <div key={index} className="bg-white p-3 rounded-md border shadow-sm"><p className="text-sm text-gray-800 whitespace-pre-wrap">{note.text}</p><p className="text-xs text-gray-400 mt-2 text-right">{note.author} &bull; {new Date(note.timestamp).toLocaleString()}</p></div>
                                )) : <p className="text-sm text-gray-500 italic text-center py-4">No notes for this case yet.</p>}
                              </div>
                              <div className="flex items-start gap-3">
                                <textarea value={newNote} onChange={e => setNewNote(e.target.value)} placeholder="Add a new investigation note..." rows={3} className="flex-1 block w-full shadow-sm sm:text-sm bg-white border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500"/>
                                <button onClick={handleAddNote} disabled={!newNote.trim()} className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 active:scale-95 text-sm disabled:bg-blue-400 h-full">Add Note</button>
                              </div>
                        </div>
                    )}
                </div>

              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center text-gray-500">
                <ShieldCheck size={48} className="mb-4 text-gray-400"/><h3 className="text-xl font-semibold">Select a Case</h3><p>Choose a case from the list to view its details.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <NewCaseModal
          isOpen={isNewCaseModalOpen}
          onClose={() => setIsNewCaseModalOpen(false)}
          onSave={handleSaveNewCase}
      />

      {/* OCR Modal */}
      {ocrState.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 animate-fade-in" onClick={() => setOcrState({isOpen: false, isLoading: false, result: null, error: null})}>
          <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-2xl mx-4 transform animate-scale-up" onClick={e => e.stopPropagation()}>
             <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-800 flex items-center"><Bot size={20} className="mr-2 text-blue-500"/>AI Document Analysis</h3>
                <button onClick={() => setOcrState({isOpen: false, isLoading: false, result: null, error: null})} className="text-gray-400 hover:text-gray-600"><X size={24}/></button>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg border max-h-[70vh] overflow-y-auto">
                {ocrState.isLoading && <div className="flex flex-col items-center justify-center text-gray-600 py-12"><Loader2 className="h-10 w-10 animate-spin text-blue-500"/><p className="mt-4 font-medium">Analyzing document with Gemini...</p></div>}
                {ocrState.error && <div className="text-center text-red-600 py-12"><Info size={32} className="mx-auto"/><p className="mt-2 font-semibold">Error</p><p>{ocrState.error}</p></div>}
                {ocrState.result && (
                    <div>
                        <div className="flex justify-between items-center mb-3">
                            <p className="font-semibold text-gray-700">Extraction Result for <span className="text-blue-600">{ocrState.evidence?.name}</span></p>
                            <button onClick={() => navigator.clipboard.writeText(ocrState.result || '')} className="flex items-center text-sm font-medium text-gray-600 hover:text-black bg-gray-200 px-3 py-1 rounded-md"><Clipboard size={14} className="mr-1.5"/>Copy</button>
                        </div>
                        <pre className="bg-white p-4 rounded border border-gray-200 text-sm text-gray-800 whitespace-pre-wrap font-sans">{ocrState.result}</pre>
                    </div>
                )}
            </div>
          </div>
        </div>
      )}

      {/* Image Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in" onClick={() => setPreviewImage(null)}>
          <div className="relative p-4 animate-scale-up" onClick={e => e.stopPropagation()}>
            <button onClick={() => setPreviewImage(null)} className="absolute -top-2 -right-2 bg-white rounded-full p-1.5 shadow-lg text-gray-800 hover:bg-gray-200" aria-label="Close image preview"><X size={24} /></button>
            <img src={previewImage} alt="Evidence preview" className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg shadow-2xl"/>
          </div>
        </div>
      )}

      {editingEvidence && (
        <EvidenceEditModal
            evidence={editingEvidence}
            onClose={() => setEditingEvidence(null)}
            onSave={handleSaveEvidenceDetails}
        />
      )}
    </>
  );
};

export default PoliceDashboard;