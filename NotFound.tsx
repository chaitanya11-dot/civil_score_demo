import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-center p-4">
      <ShieldAlert className="h-24 w-24 text-amber-500 mb-4" />
      <h1 className="text-6xl font-extrabold text-gray-900">404</h1>
      <h2 className="text-2xl font-semibold text-gray-800 mt-2">Page Not Found</h2>
      <p className="text-gray-500 mt-4 max-w-md">
        Sorry, the page you are looking for does not exist. It might have been moved or deleted.
      </p>
      <Link
        to="/"
        className="mt-8 px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg shadow-sm hover:bg-primary-700 transition-colors"
      >
        Go Back to Dashboard
      </Link>
    </div>
  );
};

export default NotFound;