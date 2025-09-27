import React, { useState } from 'react';
import { Check, X, FileText, Briefcase, RefreshCw, CheckCircle } from 'lucide-react';

const initialSubmissions = [
  { id: 1, user: 'Alice Johnson', activityType: 'Environmental Care', description: 'Planted 10 trees in the community park on Sunday.', evidenceLink: '#' },
  { id: 2, user: 'Bob Williams', activityType: 'Community Volunteering', description: 'Volunteered at the local food bank for 4 hours.', evidenceLink: '#' },
  { id: 3, user: 'Charlie Brown', activityType: 'Civic Duty', description: 'Reported and tracked a major pothole on 5th avenue until it was fixed.', evidenceLink: '#' },
];

const AdminDashboard: React.FC = () => {
  const [submissions, setSubmissions] = useState(initialSubmissions);
  const [verifyingId, setVerifyingId] = useState<number | null>(null);
  const [finalizingId, setFinalizingId] = useState<number | null>(null);

  const handleApprove = (id: number) => {
    setVerifyingId(id);
    // Simulate async blockchain operation
    setTimeout(() => {
      console.log(`Simulating blockchain update for submission ID: ${id}... SUCCESS`);
      setVerifyingId(null);
      setFinalizingId(id);

      // After a short delay to show success, remove the item
      setTimeout(() => {
        setSubmissions(prev => prev.filter(sub => sub.id !== id));
        setFinalizingId(null);
      }, 1500);

    }, 2000);
  };

  const handleReject = (id: number) => {
    // For rejection, we can remove it immediately without the simulated delay.
    setSubmissions(prev => prev.filter(sub => sub.id !== id));
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in-up">
      <div className="text-center mb-10">
        <div className="inline-block bg-primary-100 p-3 rounded-full">
          <Briefcase className="h-8 w-8 text-primary-600" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mt-4">Admin/NGO Dashboard</h1>
        <p className="text-gray-500 mt-2">Review and verify submitted citizen activities.</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Pending Submissions ({submissions.length})</h2>
        {submissions.length > 0 ? (
          <div className="space-y-4">
            {submissions.map(submission => (
              <div key={submission.id} className="border border-gray-200 rounded-lg p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors hover:bg-gray-50">
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">{submission.activityType}</p>
                  <p className="text-sm text-gray-500">Submitted by: <span className="font-medium text-gray-700">{submission.user}</span></p>
                  <p className="text-sm text-gray-600 mt-1">{submission.description}</p>
                  <a href={submission.evidenceLink} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-500 hover:underline mt-2 inline-flex items-center">
                    <FileText size={14} className="mr-1" /> View Evidence
                  </a>
                </div>
                <div className="flex items-center space-x-2 flex-shrink-0 w-full sm:w-auto">
                  {verifyingId === submission.id ? (
                    <div className="w-full flex items-center justify-center bg-amber-100 text-amber-800 text-sm font-medium px-4 py-2 rounded-lg">
                      <RefreshCw size={16} className="mr-2 animate-spin" />
                      Verifying on Blockchain...
                    </div>
                  ) : finalizingId === submission.id ? (
                    <div className="w-full flex items-center justify-center bg-green-100 text-green-800 text-sm font-medium px-4 py-2 rounded-lg animate-fade-in">
                        <CheckCircle size={16} className="mr-2" />
                        Approved Successfully
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={() => handleReject(submission.id)}
                        disabled={!!verifyingId || !!finalizingId}
                        className="w-1/2 sm:w-auto flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <X size={16} className="mr-1" /> Reject
                      </button>
                      <button
                        onClick={() => handleApprove(submission.id)}
                        disabled={!!verifyingId || !!finalizingId}
                        className="w-1/2 sm:w-auto flex items-center justify-center px-4 py-2 bg-primary-100 text-primary-700 font-semibold rounded-lg hover:bg-primary-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Check size={16} className="mr-1" /> Approve
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <CheckCircle size={40} className="mx-auto text-green-500" />
            <p className="mt-2 font-medium">All submissions have been reviewed!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;