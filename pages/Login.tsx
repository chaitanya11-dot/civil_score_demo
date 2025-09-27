import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import ShieldCheck from '../components/icons/ShieldCheck';
import { LogIn, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [aadhaar, setAadhaar] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const formatAadhaar = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{0,4})(\d{0,4})(\d{0,4})$/);
    if (!match) return cleaned;
    return [match[1], match[2], match[3]].filter(Boolean).join(' ');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatAadhaar(e.target.value);
    setAadhaar(formatted);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const success = login(aadhaar.replace(/\s/g, ''));
    
    if (success) {
      navigate('/');
    } else {
      setError('Invalid Aadhaar Number. Please try again.');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-sm animate-fade-in-up">
        <div className="flex flex-col items-center mb-8">
            <ShieldCheck className="h-14 w-14 text-primary-600 animate-float" />
            <h1 className="text-3xl font-bold text-gray-900 mt-2">Civil Score</h1>
            <p className="text-gray-500 mt-1">Your digital reputation, secured.</p>
        </div>
        
        <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
          <form onSubmit={handleLogin}>
            <div>
              <label htmlFor="aadhaar" className="block text-sm font-medium text-gray-700">
                Aadhaar Number
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="aadhaar"
                  id="aadhaar"
                  value={aadhaar}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 sm:text-sm transition duration-200 text-gray-900"
                  placeholder="XXXX XXXX XXXX"
                  maxLength={14}
                  required
                />
              </div>
            </div>

            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

            <div className="mt-6">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200 active:scale-95 disabled:bg-primary-400"
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
         <div className="text-xs text-gray-500 mt-4 text-center space-y-1">
            <p>For demo, use one of the following Aadhaar numbers:</p>
            <ul className="flex flex-wrap justify-center gap-x-3 gap-y-1">
                <li><strong className="font-semibold">1111 2222 3333</strong> (850)</li>
                <li><strong className="font-semibold">4444 5555 6666</strong> (675)</li>
                <li><strong className="font-semibold">7777 8888 9999</strong> (520)</li>
                <li><strong className="font-semibold">1234 1234 1234</strong> (350)</li>
            </ul>
        </div>
         <div className="mt-6 text-center border-t pt-4 border-gray-200">
          <Link
            to="/police/login"
            className="inline-flex items-center group text-sm font-medium text-gray-600 hover:text-primary-700 transition-colors px-4 py-2 rounded-lg hover:bg-gray-100"
          >
            Switch to Law Enforcement Portal
            <ArrowRight className="ml-2 h-4 w-4 transition-transform transform group-hover:translate-x-1"/>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
