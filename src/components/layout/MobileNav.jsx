import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Users, Calendar, UserCircle } from 'lucide-react';
import { useAuth } from '@/contexts/SupabaseAuthContext';

const MobileNav = () => {
  const { user } = useAuth();

  const navLinkClasses = ({ isActive }) =>
    `flex flex-col items-center gap-1 px-2 py-2 rounded-lg transition-colors text-xs font-medium ${
      isActive
        ? 'text-slate-900'
        : 'text-slate-500 hover:bg-slate-100'
    }`;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-slate-200 z-50">
      <nav className="grid grid-cols-4 items-center justify-items-center h-16">
        <NavLink to="/" end className={navLinkClasses}>
          <Home className="w-6 h-6" />
          <span>Home</span>
        </NavLink>
        <NavLink to="/artists" className={navLinkClasses}>
          <Users className="w-6 h-6" />
          <span>Artists</span>
        </NavLink>
        <NavLink to="/events" className={navLinkClasses}>
          <Calendar className="w-6 h-6" />
          <span>Events</span>
        </NavLink>
        <NavLink to={user ? "/dashboard" : "/login"} className={navLinkClasses}>
          <UserCircle className="w-6 h-6" />
          <span>{user ? 'Account' : 'Login'}</span>
        </NavLink>
      </nav>
    </div>
  );
};

export default MobileNav;