import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import PoliceBadge from '../components/icons/PoliceBadge';

const PoliceLogin: React.FC = () => {
  const navigate = useNavigate();
  const { policeLogin } = useAuth();
  const [officerId, setOfficerId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate network delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500));

    // Use the policeLogin function from the authentication context
    const success = policeLogin(officerId, password);
    
    if (success) {
      // On successful login, navigate to the police dashboard
      navigate('/police');
    } else {
      // On failure, set an error message to be displayed to the user
      setError('Invalid credentials. Please try again.');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-800 p-4">
      <div className="w-full max-w-sm animate-fade-in-up">
        <div className="flex flex-col items-center mb-8">
            <PoliceBadge className="h-16 w-16 text-blue-400 animate-float" />
            <h1 className="text-3xl font-bold text-white mt-3">Police Portal</h1>
            <p className="text-gray-400 mt-1">Incident Management System</p>
        </div>
        
        <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-700">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="officerId" className="block text-sm font-medium text-gray-700">
                Officer ID
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="officerId"
                  id="officerId"
                  value={officerId}
                  onChange={(e) => setOfficerId(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 sm:text-sm transition duration-200 text-gray-900"
                  placeholder="Enter your Officer ID"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  type="password"
                  name="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 sm:text-sm transition duration-200 text-gray-900"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center py-2.5 px-4 mt-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 active:scale-95 disabled:bg-blue-400"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing In...
                  </>
                ) : (
                  <>
                    <LogIn className="mr-2 h-4 w-4"/>
                    Login
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
        <p className="text-xs text-gray-400 mt-4 text-center">
            For demo: ID: <strong>POLICE007</strong>, Pass: <strong>password123</strong>
        </p>
        <div className="mt-6 text-center border-t pt-4 border-gray-600">
            <Link
                to="/login"
                className="inline-flex items-center group text-sm font-medium text-gray-300 hover:text-white transition-colors px-4 py-2 rounded-lg hover:bg-gray-700"
            >
                <ArrowLeft className="mr-2 h-4 w-4 transition-transform transform group-hover:-translate-x-1"/>
                Switch to Citizen Portal
            </Link>
        </div>
      </div>
    </div>
  );
};

export default PoliceLogin;