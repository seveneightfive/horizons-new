import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Frown } from 'lucide-react';
import { Button } from '@/components/ui/button';

const NotFound = () => {
  return (
    <>
      <Helmet>
        <title>404 Not Found</title>
      </Helmet>
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-center px-4">
        <Frown className="w-24 h-24 text-slate-400 mb-4" />
        <h1 className="text-6xl font-bold text-slate-800 mb-2">404</h1>
        <h2 className="text-3xl font-semibold text-slate-700 mb-4">Page Not Found</h2>
        <p className="text-slate-500 mb-8 max-w-md">
          Sorry, the page you are looking for does not exist. It might have been moved or deleted.
        </p>
        <Link to="/">
          <Button size="lg">Go to Homepage</Button>
        </Link>
      </div>
    </>
  );
};

export default NotFound;