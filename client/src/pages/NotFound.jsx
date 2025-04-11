import { SearchX, Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-full bg-gray-50 flex flex-col">
      {/* 404 Content */}
      <div className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full text-center">
          <div className="text-center">
            <SearchX className="mx-auto h-24 w-24 text-indigo-400" />
            <h1 className="mt-6 text-6xl font-extrabold text-gray-900 tracking-tight">404</h1>
            <h2 className="mt-2 text-3xl font-bold text-gray-900">Page not found</h2>
            <p className="mt-4 text-lg text-gray-600">
              Sorry, we couldn`t find the page you`re looking for. The link you followed may be broken, or the page may have been removed.
            </p>
            <div className="mt-12 flex justify-center space-x-4">
              <button 
                onClick={() => window.history.back()} 
                className="inline-flex items-center px-4 py-2 border border-indigo-300 text-sm font-medium rounded-md text-indigo-700 bg-white hover:bg-indigo-50"
              >
                <ArrowLeft className="mr-2 h-5 w-5" />
                Go Back
              </button>
              <a 
                href="/" 
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <Home className="mr-2 h-5 w-5" />
                Back to Home
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white mt-8">
        <div className="max-w-7xl mx-auto py-6 px-4 overflow-hidden sm:px-6 lg:px-8">
          <p className="mt-2 text-center text-base text-gray-500">
            &copy; 2025 SmartLearn. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default NotFound;