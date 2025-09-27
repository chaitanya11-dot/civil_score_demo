import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, FileText, CheckCircle, UploadCloud, Loader2, Check } from 'lucide-react';

const SubmitActivity: React.FC = () => {
    const [activityType, setActivityType] = useState('Environmental Care');
    const [description, setDescription] = useState('');
    const [evidenceFile, setEvidenceFile] = useState<File | null>(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'submitting' | 'submitted'>('idle');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setEvidenceFile(e.target.files[0]);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmissionStatus('submitting');
        
        // Simulate network delay for submission
        setTimeout(() => {
            console.log({
                activityType,
                description,
                fileName: evidenceFile?.name,
            });
            setSubmissionStatus('submitted');
            
            // Show success message for a moment before changing screens
            setTimeout(() => {
                setIsSubmitted(true);
            }, 1000);
        }, 1500);
    };

    if (isSubmitted) {
        return (
             <div className="flex flex-col items-center justify-center text-center max-w-2xl mx-auto py-12 animate-fade-in">
                <div className="inline-block bg-primary-100 p-4 rounded-full">
                    <CheckCircle className="h-10 w-10 text-primary-600" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mt-4">Activity Submitted</h1>
                <p className="text-gray-500 mt-2 mb-8">
                    Thank you! Your activity has been submitted for review. Points will be added to your score upon verification.
                </p>
                <div className="flex space-x-4">
                    <button
                        onClick={() => {
                            setIsSubmitted(false);
                            setActivityType('Environmental Care');
                            setDescription('');
                            setEvidenceFile(null);
                            setSubmissionStatus('idle'); // Reset status
                        }}
                        className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-6 rounded-lg transition-transform transform hover:scale-105"
                    >
                        Submit Another Activity
                    </button>
                     <Link
                        to="/activities"
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-6 rounded-lg transition-transform transform hover:scale-105"
                    >
                        Back to Activities
                    </Link>
                </div>
            </div>
        );
    }


    return (
        <div className="max-w-2xl mx-auto animate-fade-in-up">
            <div className="text-center mb-8">
                <div className="inline-block bg-primary-100 p-3 rounded-full">
                    <PlusCircle className="h-8 w-8 text-primary-600" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mt-4">Submit an Activity</h1>
                <p className="text-gray-500 mt-1">Log your positive contributions for verification.</p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="activity-type" className="block text-sm font-medium text-gray-700 mb-1.5">Type of Activity</label>
                        <select
                            id="activity-type"
                            name="activity-type"
                            value={activityType}
                            onChange={(e) => setActivityType(e.target.value)}
                            className="block w-full pl-3 pr-10 py-2 text-base bg-gray-50 border-gray-300 focus:outline-none sm:text-sm rounded-md shadow-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition duration-200 text-gray-900"
                        >
                            <option>Environmental Care</option>
                            <option>Community Volunteering</option>
                            <option>Animal Welfare</option>
                            <option>Health Initiative</option>
                            <option>Civic Duty</option>
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
                            placeholder="Provide details about the activity, date, and location..."
                            className="pl-10 block w-full shadow-sm sm:text-sm bg-gray-50 border-gray-300 rounded-md focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition duration-200 text-gray-900"
                        ></textarea>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Upload Proof (Optional)</label>
                        <div className="mt-1.5 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                            <div className="space-y-1 text-center">
                                {evidenceFile ? (
                                    <div className="text-sm text-gray-500">
                                        <p>File selected: <span className="font-semibold">{evidenceFile.name}</span></p>
                                        <button
                                            type="button"
                                            onClick={() => setEvidenceFile(null)}
                                            className="text-red-500 hover:text-red-600 font-medium text-xs mt-1"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <UploadCloud className="mx-auto h-12 w-12 text-gray-400"/>
                                        <div className="flex text-sm text-gray-600 justify-center">
                                            <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-700 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500">
                                                <span>Upload a file</span>
                                                <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} />
                                            </label>
                                            <p className="pl-1">or drag and drop</p>
                                        </div>
                                        <p className="text-xs text-gray-500">Photos, certificates, etc.</p>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={submissionStatus !== 'idle'}
                            className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200 active:scale-95 disabled:bg-primary-400 disabled:cursor-not-allowed"
                        >
                            {submissionStatus === 'idle' && 'Submit for Verification'}
                            {submissionStatus === 'submitting' && (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Submitting...
                                </>
                            )}
                            {submissionStatus === 'submitted' && (
                                <>
                                    <Check className="mr-2 h-5 w-5" />
                                    Success!
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SubmitActivity;